import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import instance from "../../api/instanApi";
import useScrollToTop from "../../hook/useScrollToTop";
import useQueryParams from "../../hook/useQueryParam";

import { red, pink } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

import { Col, Row, Input } from "antd";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import CardPhotoNew from "../card/cardPhotoNew";
import CarouselHomePage from "../carousel/carousel.homePage";

import SearchIcon from "@mui/icons-material/Search";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";

import { getProperties } from "../../api/propertiesApi";
import { getProvinces, getDistricts, getWards } from "../../api/addressApi";

function HomePage() {
  const [photos, setPhotos] = useState([]);
  const [properties, setProperties] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [status, setStatus] = useState("sell");

  const [searchItem, setSearchItem] = useState({
    province: "",
    district: "",
    ward: "",
    price: "",
    type: "",
    property: "",
    content: "",
  });

  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchItem({ ...searchItem, [name]: value });
  };

  const formatAddress = {
    province: searchItem.province,
    district: searchItem.district,
    ward: searchItem.ward,
    street: searchItem.street,
  };

  const onSearch = () => {
    localStorage.setItem("searchItem", JSON.stringify(searchItem));
    navigate("/search");
  };

  const clearSearch = () => {
    setSearchItem((prev) => ({
      ...prev,
      province: "",
      district: "",
      ward: "",
      street: "",
      price: "",
      type: "",
      property: "",
      content: "",
    }));

    setAddress((prev) => ({
      ...prev,
      province: "",
      district: "",
    }));

    selectedProvince("");
    selectedDistrict("");
  };

  searchItem.province = provinces.find(
    (item) => item.idProvince === selectedProvince
  )?.name;
  searchItem.district = districts.find(
    (item) => item.idDistrict === selectedDistrict
  )?.name;
  formatAddress.province = searchItem.province;

  formatAddress.district = searchItem.district;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        setProperties(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchProvinces = async () => {
      try {
        const response = await getProvinces();
        setProvinces(response);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchDistricts = async () => {
      const districtsData = await getDistricts();
      const data = districtsData?.filter(
        (district) => district.idProvince === selectedProvince
      );
      setDistricts(data);
    };

    const fetchWards = async () => {
      const wardsData = await getWards();
      const data = wardsData?.filter(
        (ward) =>
          ward.district_id === selectedDistrict &&
          ward.province_id === selectedProvince
      );
      setWards(data);
    };

    fetchProperties();
    fetchProvinces();
    fetchDistricts();
    fetchWards();
  }, []);

  const districtFilter = districts.filter(
    (district) => district.idProvince === selectedProvince
  );

  const wardFilter = wards.filter(
    (ward) => ward.idDistrict === selectedDistrict
  );

  const query = useQueryParams();

  const { data, isLoading } = useQuery({
    queryKey: ["photo-news", query],
    queryFn: async () => await instance.get(`/photo-news`),
  });

  const post = data?.data?.data?.items;

  const ColorButton1 = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    "&:hover": { backgroundColor: red[700] },
  }));

  const handleProvinceChange = async (provinceId) => {
    setSelectedProvince(provinceId);
    const data = await getDistricts(provinceId);
    setDistricts(data);
  };

  const handleDistrictChange = async (districtId) => {
    setSelectedDistrict(districtId);
    const data = await getWards(districtId);
    setWards(data);
  };

  useScrollToTop();
  return (
    <div>
      <div>
        <div
          className=" d-flex justify-content-center mt-2"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "240px",
            width: "100%",
            position: "relative",
          }}
        >
          <div className="mt-4">
            <div
              style={{
                position: "absolute",
                top: "17%",
                left: "23%",
                bottom: "17%",
                color: "white",
                textAlign: "center",
                backgroundColor: "rgba(2, 2, 0, 0.8)",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <div className="container-fluid mt-4 d-flex justify-content-center">
                <FormControl>
                  <TextField
                    placeholder="    Tìm kiếm"
                    size="small"
                    sx={{ width: "670px" }}
                    variant="outlined"
                    className="bg-white"
                    name="content"
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <div className="dropdown col">
                          <select
                            name="property"
                            id=""
                            className="form-select"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              width: "150px",
                              backgroundColor: "rgba(0, 0, 0, 0)",
                            }}
                            onChange={handleSearchChange}
                            key={searchItem.property}
                          >
                            {searchItem.property === "" ? (
                              <option selected value="" className="">
                                <Typography variant="caption">
                                  Kiểu máy
                                </Typography>
                              </option>
                            ) : (
                              <Typography variant="caption">
                                {searchItem.property}
                              </Typography>
                            )}

                            {properties?.map((item, index) => (
                              <option value={item.name} key={index}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ),
                      endAdornment: (
                        <InputAdornment position="start">
                          <ColorButton1 onClick={onSearch}>
                            <Typography variant="caption">
                              <SearchIcon /> Tìm kiếm
                            </Typography>
                          </ColorButton1>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              </div>

              <div className="row mt-4 container-fluid">
                <div className="dropdown col">
                  <Button
                    className="dropdown-toggle text-white border border-white"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      width: "280px",
                    }}
                  >
                    {searchItem.province ? (
                      <Typography variant="caption">
                        {formatAddress.province},{formatAddress.district},
                        {formatAddress.ward},{formatAddress.street}
                      </Typography>
                    ) : (
                      <Typography variant="caption">Trên toàn quốc</Typography>
                    )}
                  </Button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <li>
                      <a className="dropdown-item">
                        <h4>Khu vực </h4>
                        <form>
                          <div>
                            <select
                              className="form-select"
                              aria-label="Default select example"
                              name="province"
                              onChange={(e) =>
                                handleProvinceChange(e.target.value)
                              }
                              // onClick={handleAddressChange}
                              value={selectedProvince}
                            >
                              <option selected>Chọn tỉnh, thành phố</option>
                              {provinces && provinces.length > 0
                                ? provinces.map((item, index) => {
                                    return (
                                      <option
                                        key={item.idProvince}
                                        value={item.idProvince}
                                      >
                                        {item.name}
                                      </option>
                                    );
                                  })
                                : null}
                            </select>
                          </div>
                          <br />
                          <div>
                            <select
                              className="form-select"
                              aria-label="Default select example"
                              value={selectedDistrict}
                              name="district"
                              onChange={(e) =>
                                handleDistrictChange(e.target.value)
                              }
                              disabled={!selectedProvince}
                            >
                              <option value="" selected>
                                Chọn quận, huyện
                              </option>
                              {districtFilter && districtFilter.length > 0
                                ? districtFilter.map((item, index) => {
                                    return (
                                      <option
                                        key={item.idDistrict}
                                        value={item.idDistrict}
                                      >
                                        {item.name}
                                      </option>
                                    );
                                  })
                                : null}
                            </select>
                          </div>
                          <br />
                          <div>
                            <select
                              className="form-select"
                              aria-label="Default select example"
                              disabled={!selectedDistrict}
                              onClick={handleSearchChange}
                              name="ward"
                            >
                              <option value="" selected>
                                Chọn phường, xã
                              </option>
                              {wardFilter && wardFilter.length > 0
                                ? wardFilter.map((item, index) => {
                                    return (
                                      <option key={item.name} value={item.name}>
                                        {item.name}
                                      </option>
                                    );
                                  })
                                : null}
                            </select>
                          </div>
                          <br />
                          <div>
                            <input
                              type="text"
                              name="street"
                              className="form-control"
                              placeholder="Đường/Phố"
                              value={searchItem.street}
                              onChange={handleSearchChange}
                            />
                          </div>
                          <br />

                          <br />
                        </form>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="dropdown col">
                  <select
                    name="price"
                    id=""
                    className="form-select text-white"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      width: "120px",
                      backgroundColor: "rgba(0, 0, 0, 0)",
                    }}
                    onChange={handleSearchChange}
                  >
                    {searchItem.price === "" ? (
                      <option selected value="" className="">
                        <Typography variant="caption">{"Mức giá"}</Typography>
                      </option>
                    ) : (
                      <Typography variant="caption">
                        {searchItem.price}
                      </Typography>
                    )}

                    <option className="text-dark" value="1">
                      Dưới 1 triệu
                    </option>
                    <option className="text-dark" value="1-3">
                      1 - 3 triệu
                    </option>
                    <option className="text-dark" value="3-5">
                      3 - 5 triệu
                    </option>
                    <option className="text-dark" value="5-10">
                      5 - 10 triệu
                    </option>
                    <option className="text-dark" value="10-40">
                      10 - 40 triệu
                    </option>
                    <option className="text-dark" value="40-70">
                      40 - 70 triệu
                    </option>
                    <option className="text-dark" value="70-100">
                      70 - 100 triệu
                    </option>
                  </select>
                </div>
                <div className="col">
                  <IconButton className="text-white" onClick={clearSearch}>
                    <AutorenewOutlinedIcon />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <CarouselHomePage />
      </div>
      <div className="mt-4">
        <Divider textAlign="left">
          <h3>Tin dành cho bạn </h3>
        </Divider>
        <div className="container">
          <Button type="outlined">
            <Link to={"/map-nearby"} className="nav-link">
              {" "}
              Xem trên bản đồ{" "}
              <i className="fa fa-map-marker" aria-hidden="true"></i>
            </Link>
          </Button>
        </div>
        <div className="mt-4">
          <div className="container">
            <Row gutter={[16, 16]}>
              {post?.map((item, index) => (
                <Col span={6} key={index}>
                  <CardPhotoNew {...item} />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
