import React, { useEffect, useState } from "react";
import { Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import useQueryParams from "../../hook/useQueryParam";
import { useQuery } from "@tanstack/react-query";
import instance from "../../api/instanApi";
import provinceData from "../../dbNearProvince.json";
import { getProperties } from "../../api/propertiesApi";

import { useTranslation } from "react-i18next";
import "../../utils/Language/i18n";

function SearchFilter() {
  const savedData = JSON.parse(localStorage.getItem("searchItem"));
  console.log(savedData);

  const [properties, setProperties] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(savedData.province);

  const [nearbyProvinces, setNearbyProvinces] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [data, setData] = useState({
    province: savedData.province,
    district: savedData.district,
    ward: savedData.ward,
    price: savedData.price,

    property: savedData.property,
    content: savedData.content,
  });

  const { t } = useTranslation();

  const query = useQueryParams();
  console.log(query);

  const { data: fetchedData, isLoading } = useQuery({
    queryKey: ["photo-news", query],
    queryFn: async () => await instance.get(`/photo-news`),
  });

  const handleChangeSort = (e) => {
    setSortBy(e.target.value);
  };
  const posts = fetchedData?.data?.data?.items;

  function timeAgo(date) {
    const currentDate = new Date();
    const previousDate = new Date(date);
    const diff = currentDate - previousDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor(diff / 1000);
    if (days > 0) {
      return days + " ngày trước";
    } else if (hours > 0) {
      return hours + " giờ trước";
    } else if (minutes > 0) {
      return minutes + " phút trước";
    } else {
      return seconds + " giây trước";
    }
  }

  useEffect(() => {
    getProperties().then((res) => {
      setProperties(res.data.data);
      console.log(res.data.data);
    });
  }, []);

  // Filtering logic based on the criteria
  const filteredPosts = posts?.filter((item) => {
    const matchesPrice =
      !savedData.price ||
      (item.price.value >=
        parseFloat(savedData.price.split("-")[0] || 0) * 1000000 &&
        item.price.value <=
          parseFloat(savedData.price.split("-")[1]) * 1000000);

    const provinced = item.address.province;
    // provinces.find(
    //   (province) => province.idProvince === item.address.province
    // )?.idProvince;
    const matchesProvince =
      !savedData.province || provinced === savedData.province;

    const district = item.address.district;
    // districts.find(
    //   (district) => district.district_id === item.address.district
    // )?.district_id;
    const matchesDistrict =
      !savedData.district || district === savedData.district;

    const matchesWard = !savedData.ward || item.address.ward === savedData.ward;
    const matchesContent =
      !savedData.content ||
      item.title.toLowerCase().includes(savedData.content.toLowerCase()) ||
      item.description.toLowerCase().includes(savedData.content.toLowerCase());

    const Property = properties?.find(
      (property) => property._id === item.property_type_id
    )?.name;

    const matchesProperty =
      !savedData.property || Property === savedData.property;

    return (
      matchesPrice &&
      matchesProvince &&
      matchesDistrict &&
      matchesWard &&
      matchesContent &&
      matchesProperty
    );
  });

  // Sorting logic
  const sortedPosts = filteredPosts?.sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.updated_at) - new Date(a.updated_at);
    }
    if (sortBy === "oldest") {
      return new Date(a.updated_at) - new Date(b.updated_at);
    }
    return 0;
  });

  const priceArray = [
    {
      price: "1",
      title: "Dưới 1 triệu",
    },
    { price: "1-3", title: "1-3 triệu" },
    { price: "3-5", title: "3-5 triệu" },
    { price: "5-10", title: "5-10 triệu" },
    { price: "10-40", title: "10-40 triệu" },
    { price: "40-70", title: "40-70 triệu" },
    { price: "70-100", title: "70-100 triệu" },
  ];

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    if (selectedProvince) {
      const nearby = provinceData[selectedProvince] || [];
      setNearbyProvinces(nearby);
    }
  }, [selectedProvince]);

  const handleProvinceChange = (province) => {
    setSelectedProvince(province);
    setData({
      ...data,
      province: province,
      district: "",
      ward: "",
    });
  };

  localStorage.setItem("searchItem", JSON.stringify(data));
  return (
    <div className="container">
      {isLoading && <p>Loading...</p>}
      <div>
        <div className="mt-4">
          <Breadcrumbs aria-label="breadcrumb">
            {savedData.province ? (
              <Link underline="hover" color="ingerit" className="nav-link">
                {savedData.province}
              </Link>
            ) : null}
            {savedData.province ? (
              <Typography color="text.primary">
                {t("Tất cả tin tại")} {savedData.province}
              </Typography>
            ) : (
              <Typography color="text.primary">
                {t("Tất cả tin trên toàn quốc")}
              </Typography>
            )}
          </Breadcrumbs>
        </div>
        <div className="mt-4">
          {savedData.property !== "" ? (
            <h4>
              {t(savedData.property)}{" "}
              {savedData.province
                ? t("tại ") + savedData.province
                : t("trên toàn quốc")}
              {savedData.price ? (
                ", " +
                t("giá từ ") +
                priceArray.find((item) => item.price === savedData.price)?.title
              ) : (
                <h3></h3>
              )}
            </h4>
          ) : (
            <h4>
              {t("Tất cả sản phẩm")}{" "}
              {savedData.province
                ? t("tại ") + savedData.province
                : t("trên toàn quốc")}
              {savedData.price ? (
                ", " +
                t("giá từ ") +
                priceArray.find((item) => item.price === savedData.price)?.title
              ) : (
                <h3></h3>
              )}
            </h4>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-9">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p>{t("Hiện có") + " " + sortedPosts?.length + " " + t("tin")}</p>
            </div>
            <div>
              <select
                name="sort"
                onChange={handleChangeSort}
                className="form-select"
                style={{ width: "200px" }}
              >
                <option value="">{t("Sắp xếp theo")}</option>
                <option value="newest">{t("Mới nhất")}</option>
                <option value="oldest">{t("Cũ nhất")}</option>
              </select>
            </div>
          </div>
          {sortedPosts?.map((item) => (
            <div className="card mt-4" key={item.id}>
              <Link
                to={`/post/${item._id}`}
                className="link-offset-2 link-underline link-underline-opacity-0"
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-4">
                      <img
                        src={item.images[0].url}
                        alt=""
                        style={{
                          width: "200px",
                          height: "200px",
                        }}
                      />
                    </div>
                    <div className="col-8">
                      <h6 className="card-title">{item.title}</h6>
                      <div className="row">
                        <div className="col">
                          <p className="text-danger">
                            {formatPrice(item.price.value)} {item.price.unit}
                          </p>
                        </div>
                      </div>
                      <p className="card-text">
                        {item.address.province}, {item.address.district}
                      </p>
                      <div className="d-flex align-content-start flex-wrap">
                        <p className="text-muted">
                          Đăng {timeAgo(item.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="col-3">
          {savedData.province ? (
            <div>
              <h4>{t("Đề xuất các thành phố xung quanh")}</h4>
              <ul>
                {nearbyProvinces.map((province) => (
                  <li
                    key={province}
                    className="nav-link"
                    style={{
                      listStyle: "none",
                      padding: "10px",
                      margin: "0px",
                    }}
                    onClick={() => handleProvinceChange(province)}
                  >
                    <span
                      style={{
                        border: "1px solid #ccc",
                        padding: "5px",
                        paddingRight: "10px",
                        paddingLeft: "10px",
                        marginBottom: "5px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        backgroundColor: "#f5f5f5",
                      }}
                    >
                      {province}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;
