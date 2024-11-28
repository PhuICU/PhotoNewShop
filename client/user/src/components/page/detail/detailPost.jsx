import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

import useScrollToTop from "../../../hook/useScrollToTop";
import { timeSince } from "../../../utils/Funtion";

import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ChatBoxUser from "../../chat/chatBoxUser";

import {
  IconButton,
  Card,
  TextField,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Menu,
  Button,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { Modal, Form, notification } from "antd";
import Textarea from "@mui/joy/Textarea";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { UnorderedListOutlined } from "@ant-design/icons";

import { getPhotoNewsById } from "../../../api/photoNewApi";

import { creatReport } from "../../../api/reportApi";
import instance from "../../../api/instanApi";

import { getProvinces, getDistricts } from "../../../api/addressApi";
import { getProperties } from "../../../api/propertiesApi";

import { pink } from "@mui/material/colors";
import { set } from "zod";

function DetailPost({ post }) {
  const [newdata, setNewData] = useState({
    images: [],
    price: {
      value: 0,
      unit: "",
    },
    title: "",
    description: "",
    type: "",
    property_type_id: "",

    posted_by: "",
    address: {
      province: "",
      district: "",
      ward: "",
    },
  });

  const [doneComment, setDoneComment] = useState(false);

  const [properties, setProperties] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const id_user = JSON.parse(localStorage.getItem("user1"))?._id;

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const { id } = useParams();

  const [editComment, setEditComment] = useState({
    content: "",
    post_id: id,
    user_id: id_user,
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [idUpdate, setIdUpdate] = useState("");

  const [comment, setComment] = useState({
    content: "",
    post_id: id,
    user_id: id_user,
  });

  const [report, setReport] = useState({
    content: [],
    report_item_id: id,
    reported_id: "",
    report_type: "",
  });

  const [reportComment, setReportComment] = useState({
    content: [],
    report_item_id: "",
    reported_id: "",
    report_type: "",
  });

  report.reported_id = newdata?.posted_by;

  const showModal = () => {
    setOpen(true);
  };

  const showModal1 = () => {
    setOpen1(true);
  };

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });

  const [coordinates, setCoordinates] = useState([10.8231, 106.6297]); // Default to HCMC
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNew = async () => {
      try {
        const res = await getPhotoNewsById(id);
        setNewData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNew();
  }, [id]);

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

    const fetchProperties = async () => {
      const propertiesData = await getProperties();
      setProperties(propertiesData.data.data);
    };

    fetchProvinces();
    fetchDistricts();
    fetchProperties();
  }, []);

  const getCoordinates = async (province, district, ward) => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: `${ward}, ${district}, ${province}, Vietnam`,
            format: "json",
          },
        }
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setCoordinates([parseFloat(lat), parseFloat(lon)]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to get coordinates:", error);
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      if (newdata.address.province && newdata.address.district) {
        getCoordinates(
          newdata.address.province,
          newdata.address.district,
          newdata.address.ward
        );
      }
    };

    fetchLocation();
  }, [newdata]);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

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
    });
  };

  const { data } = useQuery({
    queryKey: ["comments"],
    queryFn: () => instance.get(`http://localhost:5010/comments/${id}`),
  });

  const commentMutation = useMutation({
    mutationFn: (data) =>
      instance.post(`/comments/create`, {
        content: data.content,
        post_id: id,
        user_id: id_user,
      }),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (data) => instance.delete(`/comments/delete/${data}`),
  });

  const updateCommentMutation = useMutation({
    mutationFn: (data) => instance.put(`/comments/update/${idUpdate}`, data),
  });

  const handleComment = async (data) => {
    commentMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments"]);
      },
      onError: (error) => {
        if (error.response.status === 403) {
          // alert("Bạn chưa có đăng ký vip, vui lòng đăng ký vip để bình luận");
          notification["error"]({
            message: "Thông báo",
            description:
              "Bạn chưa đăng ký vip, vui lòng đăng ký vip để bình luận",
            duration: 2,
          });
        }
        // alert("Bạn chưa đăng nhập, vui lòng đăng nhập để bình luận");
        notification["error"]({
          message: "Thông báo",
          description: "Bạn chưa đăng nhập, vui lòng đăng nhập để bình luận",
          duration: 2,
        });
      },
    });
  };

  const handleDeleteComment = async (data) => {
    deleteCommentMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments"]);
      },
    });
  };

  const handleUpdateComment = async (data) => {
    updateCommentMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments"]);
      },
    });
  };

  const datacomment1 = data?.data?.data || [];

  const handleChange = (event) => {
    setComment({ ...comment, [event.target.name]: event.target.value });
  };

  const handleChangeReport = (event) => {
    if (event.target.checked) {
      setReport({
        ...report,
        content: [...report.content, event.target.value],
      });
    } else {
      setReport({
        ...report,
        content: report.content.filter((item) => item !== event.target.value),
      });
    }
  };

  const handleReport = (event) => {
    event.preventDefault();
    creatReport(report)
      .then((response) => {
        console.log(response);
        // alert("Báo cáo thành công");
        notification["success"]({
          message: "Thông báo",
          description: "Báo cáo thành công",
          duration: 2,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChangeReportComment = (event) => {
    if (event.target.checked) {
      setReportComment({
        ...reportComment,
        content: [...reportComment.content, event.target.value],
      });
    } else {
      setReportComment({
        ...reportComment,
        content: reportComment.content.filter(
          (item) => item !== event.target.value
        ),
      });
    }
  };

  const handleReportComment = (event) => {
    event.preventDefault();
    creatReport(reportComment)
      .then((response) => {
        console.log(response);
        // alert("Báo cáo thành công");
        notification["success"]({
          message: "Thông báo",
          description: "Báo cáo thành công",
          duration: 2,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditContent = (event) => {
    setEditComment({ ...editComment, content: event.target.value });
  };

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
      value: "accessories",
      label: "Phụ kiện",
    },
  ];

  //xuất hiện ở đầu trang
  useScrollToTop();

  return (
    <div className="container row">
      <div className="col-9 container">
        <div className="d-flex justify-content-center">
          <Carousel style={{ width: "560px" }}>
            {newdata?.images &&
              newdata?.images.map((item, index) => (
                <Carousel.Item key={index}>
                  <img
                    width={560}
                    height={460}
                    src={item.url}
                    alt={`Slide ${index}`}
                  />
                </Carousel.Item>
              ))}
          </Carousel>
        </div>
        <div className="mt-4">
          <h5>{newdata?.title}</h5>
        </div>
        <hr />
        <div className="mt-4 row">
          <div className="col-8 row">
            <div className="col">
              <h6>Mức giá</h6>
              <h6>
                {newdata?.price?.value} {newdata?.price?.unit}
              </h6>
            </div>
          </div>
          <div className="col-4 d-flex justify-content-end">
            {favoritesPostIds.includes(newdata?._id) ? (
              <IconButton
                onClick={(event) => handleUnFavorite(event, newdata?._id)}
              >
                <FavoriteIcon sx={{ color: pink[500] }} />
              </IconButton>
            ) : (
              <IconButton
                onClick={(event) => handleFavorite(event, newdata._id)}
              >
                <FavoriteIcon />
              </IconButton>
            )}
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
            <IconButton
              aria-label="report"
              onClick={() => {
                showModal();
                setReport({
                  ...report,
                  report_type: "POST",
                });
              }}
            >
              <ReportProblemOutlinedIcon />
            </IconButton>
          </div>
        </div>
        <hr />
        <div>
          <h5>Thông tin mô tả</h5>
          <p>{newdata?.description}</p>
        </div>
        <hr />
        <div>
          <h5>Thông tin chi tiết</h5>
          <div className="row">
            <div className="col-6">
              <p>
                <span>Địa chỉ: </span>
                {newdata?.address.province}, {newdata?.address.district},{" "}
                {newdata?.address.ward}
              </p>
            </div>
            <div className="col-6">
              <p>
                {newdata?.type == "camera" ? (
                  <div>
                    <span>Loại máy: </span>
                    {
                      properties?.find(
                        (item) => item._id === newdata.property_type_id
                      )?.name
                    }
                  </div>
                ) : (
                  <div>
                    <span>Loại máy: </span>
                    {
                      typeArr.find((item) => item.value === newdata?.type)
                        ?.label
                    }
                  </div>
                )}
              </p>
            </div>
          </div>
        </div>

        <hr />
        <div>
          <h5>Vị trí</h5>
          <div
            style={{
              height: "400px",
            }}
          >
            {!loading && (
              <MapContainer
                center={coordinates}
                zoom={13}
                style={{ height: "400px", width: "800px" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={coordinates}>
                  <Popup></Popup>
                </Marker>
              </MapContainer>
            )}
          </div>
          <div>
            <p>
              Xem đuờng đi{" "}
              <Link
                to={`/map/${newdata?.address.province}/${newdata?.address.district}/${newdata?.address.ward}`}
              >
                tại đây
              </Link>
            </p>
          </div>
        </div>
        <hr />
        <div className="mt-4">
          <h5>Bình luận</h5>
          <Card>
            <div className="mt-4 container">
              {datacomment1.length > 0
                ? datacomment1.map((item, index) => (
                    <div key={index}>
                      <hr />
                      <div className="row">
                        <div className="col-1">
                          <img
                            src="https://mui.com/static/images/avatar/2.jpg"
                            alt="avatar"
                            style={{ width: "50px", height: "50px" }}
                            className="rounded-circle "
                          />
                          {/* <p>{item}</p> */}
                        </div>
                        <div className="col-10">
                          <p disabled size="small" value>
                            {item.content}
                          </p>

                          <p className="blockquote-footer">
                            {timeSince(item.created_at)} <span>bởi </span>
                            {item.user.full_name}
                          </p>
                        </div>
                        <div className="col-1">
                          {id_user === item.user._id ? (
                            <div>
                              <IconButton
                                aria-controls="simple-menu"
                                aria-haspopup="true"
                                onClick={(event) => {
                                  handleClick(event);
                                  setIdUpdate(item._id);
                                  setEditComment({
                                    ...editComment,
                                    content: item.content,
                                  });
                                }}
                              >
                                <UnorderedListOutlined />
                              </IconButton>

                              <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={handleClose}
                              >
                                <MenuItem
                                  onClick={() => handleDeleteComment(idUpdate)}
                                >
                                  Xóa
                                </MenuItem>

                                <MenuItem
                                  onClick={() => {
                                    setEditComment({
                                      ...editComment,
                                      status: "sửa",
                                    });
                                  }}
                                >
                                  Sửa
                                </MenuItem>
                              </Menu>
                            </div>
                          ) : (
                            <IconButton
                              aria-label="report"
                              onClick={() => {
                                showModal1();
                                setReportComment({
                                  ...reportComment,
                                  report_item_id: item._id,
                                  reported_id: item.user._id,
                                  report_type: "COMMENT",
                                });
                              }}
                            >
                              <i
                                class="fa fa-exclamation"
                                aria-hidden="true"
                                style={{ color: "red" }}
                              ></i>
                            </IconButton>
                          )}
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))
                : null}
            </div>

            <div className="row mt-4 container">
              {editComment.status === "sửa" ? (
                <div className="row mt-4 container">
                  <div className="col-10">
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      fullWidth
                      name="content"
                      value={editComment.content}
                      onChange={handleEditContent}
                    />
                  </div>
                  <div className="col-2">
                    <IconButton
                      onClick={
                        // () => handleUpdateComment(editComment)
                        () => {
                          handleUpdateComment(editComment);
                          setEditComment({ ...editComment, status: "" });
                        }
                      }
                    >
                      <SendOutlinedIcon />
                    </IconButton>
                  </div>
                </div>
              ) : (
                <div className="row mt-4 container">
                  <div className="col-10">
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      fullWidth
                      name="content"
                      label="Nhập bình luận"
                      value={comment.content}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-2">
                    <IconButton
                      onClick={() => {
                        handleComment(comment);
                        setComment({ ...comment, content: "" });
                      }}
                    >
                      <SendOutlinedIcon />
                    </IconButton>
                  </div>
                </div>
              )}
            </div>
            <br />
          </Card>
        </div>
      </div>
      <div className="col-2">
        <div className="mt-4">
          <Card
            sx={{
              width: "250px",
            }}
          >
            {localStorage.getItem("user1") ? (
              <div className="container mt-4">
                <h5 className="d-flex justify-content-center">
                  Thông tin liên hệ
                </h5>
                <hr />
                <p className="d-flex justify-content-center">
                  {newdata?.contact_info?.contact_name}
                </p>
                <p className="d-flex justify-content-center">
                  {newdata?.contact_info?.contact_email}
                </p>
                <p className="d-flex justify-content-center">
                  {newdata?.contact_info?.contact_phone}
                </p>
              </div>
            ) : (
              <div className="container mt-4">
                <h5 className="d-flex justify-content-center">
                  Thông tin liên hệ
                </h5>
                <hr />
                <p className="d-flex justify-content-center text-muted">
                  Vui lòng đăng nhập để xem thông tin liên hệ
                </p>
              </div>
            )}
          </Card>
          <div
            style={{
              top: "0",

              height: "50px",
              padding: "10px",
            }}
          >
            <div className="mt-4">
              <img
                src="https://img.freepik.com/premium-psd/poster-template-world-photography-day-celebration_892970-9386.jpg"
                alt=""
                width={250}
              />
            </div>
            <hr />
            <Stack className="mt-4 ">
              <div
                className=""
                style={{
                  width: "290px",
                  height: "500px",
                }}
              >
                <div className=" mt-4">
                  <h5 className="d-flex justify-content-center">Hỗ trợ</h5>

                  <div className="d-flex justify-content-center">
                    <div className=" ">
                      <ChatBoxUser user={id_user} info={newdata} />
                    </div>
                  </div>
                  <br />
                </div>
              </div>
            </Stack>
          </div>
        </div>
      </div>

      <Modal visible={open} onOk={handleReport} onCancel={() => setOpen(false)}>
        <div>
          <h6>
            <ReportProblemOutlinedIcon />
            <span className="container">
              Báo cáo tin đăng có tin không đúng?
            </span>
          </h6>
        </div>
        <hr />
        <Form>
          <Form.Item>
            <FormGroup name="content" onChange={handleChangeReport}>
              <FormControlLabel
                value="Địa chỉ không đúng"
                control={
                  <Checkbox
                    // checked={content}
                    onChange={handleChangeReport}
                    name="content"
                  />
                }
                label="Địa chỉ không đúng"
              />

              <FormControlLabel
                value="Ảnh không đúng với thực tế"
                control={
                  <Checkbox
                    // checked={content}
                    onChange={handleChangeReport}
                    name="content"
                  />
                }
                label="Ảnh không đúng với thực tế"
              />
              <FormControlLabel
                value="Trùng với tin rao khác"
                control={
                  <Checkbox
                    // checked={content}
                    onChange={handleChangeReport}
                    name="content"
                  />
                }
                label="Trùng với tin rao khác"
              />
              <FormControlLabel
                value="Tin đã giao dịch xong"
                control={
                  <Checkbox
                    // checked={content}
                    onChange={handleChangeReport}
                    name="content"
                  />
                }
                label="Tin đã giao dịch xong"
              />
              <FormControlLabel
                value="Tin không có thật"
                control={
                  <Checkbox
                    // checked={content}
                    onChange={handleChangeReport}
                    name="content"
                  />
                }
                label="Tin không có thật"
              />
              <FormControlLabel
                value="Không liên lạc được"
                control={
                  <Checkbox
                    // checked={content}
                    onChange={handleChangeReport}
                    name="content"
                  />
                }
                label="Không liên lạc được"
              />
            </FormGroup>
          </Form.Item>
          <Form.Item>
            <p>Phản hồi khác</p>
            <Textarea
              placeholder="Nhập phản hồi"
              name="content"
              onChange={handleChangeReport}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        visible={open1}
        onOk={handleReportComment}
        onCancel={() => setOpen1(false)}
      >
        <div>
          <h6>
            <ReportProblemOutlinedIcon />
            <span className="container">Báo cáo tin đăng vi phạm</span>
          </h6>
        </div>
        <hr />
        <Form>
          <Form.Item>
            <FormGroup name="content" onChange={handleChangeReportComment}>
              <FormControlLabel
                value="Spam"
                control={
                  <Checkbox
                    // checked={content}
                    onChange={handleChangeReportComment}
                    name="content"
                  />
                }
                label="Spam"
              />
              <FormControlLabel
                value="Ngôn ngữ lăng mạ"
                control={
                  <Checkbox
                    // checked={content}
                    onChange={handleChangeReportComment}
                    name="content"
                  />
                }
                label="Ngôn ngữ lăng mạ"
              />
              <FormControlLabel
                value="Nội dung không phù hợp"
                control={
                  <Checkbox
                    // checked={content}
                    onChange={handleChangeReportComment}
                    name="content"
                  />
                }
                label="Nội dung không phù hợp"
              />
              <FormControlLabel
                value="Vi phạm pháp luật"
                control={
                  <Checkbox
                    // checked={content}
                    onChange={handleChangeReportComment}
                    name="content"
                  />
                }
                label="Vi phạm pháp luật"
              />
              <FormControlLabel
                value="Lừa đảo"
                control={
                  <Checkbox
                    // checked={content}
                    onChange={handleChangeReportComment}
                    name="content"
                  />
                }
                label="Lừa đảo"
              />
              <FormControlLabel
                value="Phân biệt chủng tộc, tôn giáo"
                control={
                  <Checkbox
                    // checked={content}
                    onChange={handleChangeReportComment}
                    name="content"
                  />
                }
                label="Phân biệt chủng tộc, tôn giáo"
              />
            </FormGroup>
          </Form.Item>
          <Form.Item>
            <p>Phản hồi khác</p>
            <Textarea
              placeholder="Nhập phản hồi"
              name="content"
              onChange={handleChangeReportComment}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default DetailPost;
