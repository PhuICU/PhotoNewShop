import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useScrollToTop from "../../hook/useScrollToTop";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Breadcrumbs,
  Pagination,
  PaginationItem,
  Typography,
} from "@mui/material";
import { notification } from "antd";
import { pink } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import useQueryParams from "../../hook/useQueryParam";
import instance from "../../api/instanApi";
import { getWards, getDistricts, getProvinces } from "../../api/addressApi";

function ClassificationPage() {
  const queryParams = useQueryParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState({
    price: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  const { data: newData, isLoading } = useQuery({
    queryKey: ["photo-news", queryParams.type, currentPage],
    queryFn: async () =>
      await instance.get(
        `/photo-news/?type=${queryParams.type}&page=${currentPage}`
      ),
    enabled: !!queryParams.type,
    onSuccess: (data) => {
      setTotalPages(data.data.totalPages); // Update total pages from the response
    },
  });

  const data = newData?.data?.data?.items;
  const queryClient = useQueryClient();

  const { data: favoritesData } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => instance.get(`http://localhost:5010/favorites/user`),
  });

  const likeMutation = useMutation({
    mutationFn: (data) =>
      instance.post("http://localhost:5010/favorites/create", {
        post_id: data,
      }),
  });

  const unlikeMutation = useMutation({
    mutationFn: (data) => instance.delete(`/favorites/delete/${data}`),
  });

  const favoritesPostIds = favoritesData?.data?.data?.post_ids || [];

  const handleUnFavorite = async (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    unlikeMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["favorites"]);
      },
    });
  };

  const handleFavorite = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    likeMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["favorites"]);
      },
      onError: () => {
        notification["error"]({
          message: "Thông báo",
          description: "Bạn cần đăng nhập để thực hiện chức năng này",
          duration: 2,
        });
      },
    });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const filterData = (data, filter) => {
    if (!filter.price) return data;

    const [min, max] = filter.price.split("-").map(Number);

    return data?.filter((item) => {
      const price = item.price.value;
      return price >= min && price <= max;
    });
  };

  console.log("data", filterData(data, filter), filter);

  useEffect(() => {
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
      setDistricts(districtsData);
    };

    fetchProvinces();
    fetchDistricts();
  }, []);

  const typeArr = [
    {
      value: "camera",
      label: "Máy ảnh",
    },
    {
      value: "lens",
      label: "Ống kính",
    },
    {
      value: "camcorder",
      label: "Máy quay phim",
    },
    {
      value: "accessory",
      label: "Phụ kiện",
    },
  ];

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useScrollToTop();
  return (
    <div className="row container">
      {isLoading && <p>Loading...</p>}

      <div className="container col-8">
        <div className="container mt-4">
          <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                color="inherit"
                className="nav-link"
                to={`/classification?type=${queryParams.type}`}
              >
                {typeArr.find((type) => type.value === queryParams.type)?.label}
              </Link>
              <Typography color="text.primary">Tất cả </Typography>
            </Breadcrumbs>
          </div>
          <div className="mt-4">
            <h5> Trên toàn quốc</h5>
          </div>
          <div>
            <p>Hiện có {data?.length} tin.</p>
          </div>
        </div>
        <div className="mt-4">
          {filterData(data, filter)?.map((item) => (
            <Link to={`/post/${item._id}`} className="nav-link" key={item._id}>
              <Card className="mt-4">
                <CardMedia>
                  <div className="row mt-4">
                    <div className="col-5 ">
                      {item.images &&
                        item.images.slice(0, 1).map((image, index) => (
                          <div key={index}>
                            <img
                              src={image.url}
                              alt="image"
                              style={{
                                width: "300px",
                                height: "290px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        ))}
                    </div>

                    <div className="col-3 d-flex flex-row bd-highlight mb-3">
                      <div>
                        {item.images &&
                          item.images?.slice(1, 3)?.map((image, index) => (
                            <div key={index}>
                              <img
                                src={image.url}
                                alt="image"
                                style={{
                                  width: "220px",
                                  height: "150px",
                                  padding: "5px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          ))}
                      </div>
                      <div>
                        {item.images &&
                          item.images?.slice(3, 5)?.map((image, index) => (
                            <div key={index}>
                              <img
                                src={image.url}
                                alt="image"
                                style={{
                                  width: "220px",
                                  height: "150px",
                                  padding: "5px",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardMedia>
                <CardContent>
                  <div>
                    <h6>{item.title}</h6>
                  </div>
                  <div className="row">
                    <div className="col-4">
                      {formatPrice(item.price.value)} {item.price.unit}
                    </div>
                    <div className="col-8">
                      {item.address.province} - {item.address.district} -{" "}
                      {item.address.ward}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Typography
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description}
                    </Typography>
                  </div>
                </CardContent>
                <hr />
                <CardActions className="d-flex justify-content-between">
                  <div className="d-flex justify-content-between">
                    <div
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      {new Date(item.published_at).toLocaleDateString()}
                    </div>
                    <div
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      {item.contact_info.contact_name}
                    </div>
                    <div
                      style={{
                        padding: "0 10px",
                      }}
                    >
                      {localStorage.getItem("user1")
                        ? item.contact_info.contact_phone
                        : "**********" +
                          item.contact_info.contact_phone.slice(7, 10)}
                    </div>
                  </div>
                  <div>
                    {favoritesPostIds.includes(item._id) ? (
                      <IconButton
                        aria-label="add to favorites"
                        onClick={(e) => handleUnFavorite(e, item._id)}
                      >
                        <FavoriteIcon style={{ color: pink[500] }} />
                      </IconButton>
                    ) : (
                      <IconButton
                        aria-label="add to favorites"
                        onClick={(e) => handleFavorite(e, item._id)}
                      >
                        <FavoriteIcon />
                      </IconButton>
                    )}
                  </div>
                </CardActions>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-4 d-flex justify-content-center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            renderItem={(item) => (
              <PaginationItem
                components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />
        </div>
      </div>
      <div className="col-2 mt-4 ">
        <div>
          <Card>
            <div className="container mt-4 ">
              <h6 className="d-flex justify-content-center">
                Lọc theo khoảng giá
              </h6>
              <div className="d-flex justify-content-center">
                <ul className="navbar-nav">
                  <li
                    onClick={() =>
                      setFilter({
                        price: "0-1000000",
                      })
                    }
                  >
                    Dưới 1 triệu
                  </li>
                  <li
                    onClick={() =>
                      setFilter({
                        price: "1000000-3000000",
                      })
                    }
                  >
                    1 - 3 triệu
                  </li>
                  <li
                    onClick={() =>
                      setFilter({
                        price: "3000000-5000000",
                      })
                    }
                  >
                    3 - 5 triệu
                  </li>
                  <li
                    onClick={() =>
                      setFilter({
                        price: "5000000-10000000",
                      })
                    }
                  >
                    5 - 10 triệu
                  </li>
                  <li
                    onClick={() =>
                      setFilter({
                        price: "10000000-40000000",
                      })
                    }
                  >
                    10 - 40 triệu
                  </li>
                  <li
                    onClick={() =>
                      setFilter({
                        price: "40000000-70000000",
                      })
                    }
                  >
                    40 - 70 triệu
                  </li>
                  <li
                    onClick={() =>
                      setFilter({
                        price: "70000000-100000000",
                      })
                    }
                  >
                    70 - 100 triệu
                  </li>
                  <li
                    onClick={() =>
                      setFilter({
                        price: "100000000-200000000",
                      })
                    }
                  >
                    Trên 100 triệu
                  </li>
                </ul>
              </div>
              <br />
            </div>
          </Card>
          <br />

          <Card></Card>
        </div>
      </div>
      <div
        className="col-1 mt-4"
        style={{
          position: "sticky",
          top: "90px",
          backgroundColor: "white",
          height: "50px",
          padding: "10px",
        }}
      >
        <div>
          <img
            src="https://img.freepik.com/free-psd/black-friday-super-sale-instagram-facebook-story-banner-template_120329-3827.jpg"
            alt=""
            width={200}
            height={400}
          />
        </div>
      </div>
    </div>
  );
}

export default ClassificationPage;
