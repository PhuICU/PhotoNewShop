import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { formatPrice } from "../../utils/Funtion";
import { Link } from "react-router-dom";
import { getProperties } from "../../api/propertiesApi";

import { getDistricts, getProvinces, getWards } from "../../api/addressApi";

import { updatePhotoNew } from "../../api/photoNewApi";
import { uploadCloudinaryMultipleImages } from "../../api/imageApi";
import { Carousel } from "react-bootstrap";
import {
  IconButton,
  Box,
  Divider,
  FormLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  TextField,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { CameraOutlined } from "@mui/icons-material";
import Textarea from "@mui/joy/Textarea";

import { Modal, Form } from "antd";
import "../../utils/Language/i18n";
import { useTranslation } from "react-i18next";

function PostUser({ dataNewUser, user }) {
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const handleOpen2 = () => {
    setOpen2(true);
    setUploadedImages([]);
    setIsUploading(false);
  };
  const handleClose2 = () => setOpen2(false);
  const handleOpen3 = () => setOpen3(true);
  const handleClose3 = () => setOpen3(false);
  const [properties, setProperties] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [districts1, setDistricts1] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const { t } = useTranslation();
  const [editNew, setEditNew] = useState({
    property_type_id: "654ba93cba62368b56847d72",
    address: {
      province: "",
      district: "",
      ward: "",
      details: "",
    },
    title: "",
    description: "",
    legal_info: "",
    price: {
      value: 0,
      unit: "VND",
      is_for_sell: true,
      is_negotiable: false,
      rental_period: "Không có",
      deposit: 0,
    },
    type: "",
    images: [],
    videos: [],
    contact_info: {
      contact_name: "",
      contact_phone: "",
      contact_email: "",
    },
    posted_by: user,
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await getProperties();
        setProperties(res.data.data);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchProvinces = async () => {
      const provincesData = await getProvinces();
      setProvinces(provincesData);
    };

    const fetchDistricts = async () => {
      const districtsData = await getDistricts();
      // Check if districtsData is an array before filtering
      if (Array.isArray(districtsData)) {
        const data = districtsData.filter(
          (district) => district.idProvince === selectedProvince
        );
        setDistricts(data);
      } else {
        setDistricts([]);
      }
    };
    const fetchDistricts1 = async () => {
      const districtsData = await getDistricts();
      setDistricts1(districtsData);
    };

    const fetchWards = async () => {
      const wardsData = await getWards();
      // Check if wardsData is an array before filtering
      if (Array.isArray(wardsData)) {
        const data = wardsData.filter(
          (ward) =>
            ward.idDistrict === selectedDistrict &&
            ward.idProvince === selectedProvince
        );
        setWards(data);
      } else {
        setWards([]);
      }
    };

    fetchProperties();
    fetchProvinces();
    fetchDistricts();
    fetchWards();
    fetchDistricts1();
  }, []);

  const districtFilter = Array.isArray(districts) 
    ? districts.filter((district) => district.idProvince === selectedProvince)
    : [];

  const wardFilter = Array.isArray(wards)
    ? wards.filter((ward) => ward.idDistrict === selectedDistrict)
    : [];

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditNew((prevValue) => ({
      ...prevValue,
      address: {
        ...prevValue.address,
        [name]: value,
      },
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setEditNew((prevValue) => ({
      ...prevValue,
      price: {
        ...prevValue.price,
        [name]: value,
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditNew((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleProvinceChange = (provinceId) => {
    setSelectedProvince(provinceId);
    setSelectedDistrict("");
    setEditNew((prevValue) => ({
      ...prevValue,
      address: {
        ...prevValue.address,
        province: provinceId,
        district: "",
        ward: "",
      },
    }));
  };

  const handleDistrictChange = (districtId) => {
    setSelectedDistrict(districtId);
    setEditNew((prevValue) => ({
      ...prevValue,
      address: {
        ...prevValue.address,
        district: districtId,
        ward: "",
      },
    }));
  };

  const handleImageChange = async (event) => {
    const files = event.target.files;
    
    if (files.length === 0) {
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    console.log(files,formData);

    try {
      const uploadedImagesData = await uploadCloudinaryMultipleImages(formData);
      
      // Check if uploadedImagesData is an array before spreading
      const newImages = Array.isArray(uploadedImagesData) ? uploadedImagesData : [];
      
      if (newImages.length === 0) {
        alert("Không có hình ảnh nào được tải lên!");
        return;
      }
      
      // Update the editNew state with new images
      setEditNew(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
      
      // Also update the uploadedImages state for UI display
      setUploadedImages(prev => [...prev, ...newImages]);
      
      alert("Hình ảnh đã được tải lên thành công!");
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Có lỗi khi tải lên hình ảnh!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoChange = async ({ fileList }) => {
    const videos = fileList.map((file) => file.originFileObj);
    const formData = new FormData();
    videos.forEach((video) => {
      formData.append("file", video);
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setEditNew(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleUpdateNew = async () => {
    try {
      setIsUpdating(true);
      const {
        _id,
        property_type_id,
        address,
        title,
        description,
        legal_info,
        price,
        type,
        images,
        videos,
        contact_info,
        posted_by,
      } = editNew;
      
      // Validate that we have at least one image
      if (!images || images.length === 0) {
        alert("Vui lòng thêm ít nhất một hình ảnh!");
        return;
      }

      const res = await updatePhotoNew(_id, {
        property_type_id,
        address,
        title,
        description,
        legal_info,
        price,
        type,
        images,
        videos,
        contact_info,
        posted_by,
      });
      
      console.log(res);
      alert("Cập nhật tin thành công");
      handleClose2(); // Close the modal after successful update
    } catch (error) {
      console.log(error);
      alert("Có lỗi khi cập nhật tin!");
    } finally {
      setIsUpdating(false);
    }
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

  return (
    <div>
      <div className="mt-4 ">
        <div className="container-fluid">
          <table className="table container">
            <tbody>
              {dataNewUser && dataNewUser.length ? (
                dataNewUser.map(
                  (item) =>
                    item.status !== "expired" && (
                      <tr>
                        <td>
                          <img
                            src={item.images[0]?.url}
                            alt=""
                            width={200}
                            height={200}
                          />
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                            width: 200,
                          }}
                        >
                          {item.title}
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                          }}
                        >
                          {item.address.province}, {item.address.district}
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                          }}
                        >
                          {
                            Array.isArray(properties) && properties.length > 0
                              ? properties.find(
                                  (property) =>
                                    property._id === item.property_type_id
                                )?.name
                              : ""
                          }
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                          }}
                        >
                          {formatPrice(item.price.value)} {item.price.unit}
                        </td>

                        <td
                          style={{
                            verticalAlign: "middle",
                          }}
                        >
                          <Button
                            className="grad1 text-dark"
                            onClick={(e) => {
                              handleOpen2();
                              setEditNew(item);
                              setSelectedProvince(item.address.province);
                              setSelectedDistrict(item.address.district);
                            }}
                          >
                            Chỉnh sửa thông tin
                          </Button>
                          <p className="text-danger">{item.status}</p>
                          {item.status === "pending" ? (
                            <Button
                              style={{ fontSize: "12px" }}
                              onClick={() => {
                                handleOpen3();
                                setPreviewItem(item);
                              }}
                            >
                              Xem trước
                            </Button>
                          ) : (
                            <Button>
                              <Link
                                to={`/post/${item._id}`}
                                style={{ fontSize: "12px" }}
                              >
                                Xem chi tiết
                              </Link>
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                )
              ) : (
                <p>Không có dữ liệu</p>
              )}
            </tbody>
          </table>
        </div>
        <br />
      </div>{" "}
      <Modal
        open={open2}
        onOk={handleUpdateNew}
        onCancel={handleClose2}
        okText={isUpdating ? "Đang cập nhật..." : "Cập nhật"}
        cancelText="Hủy"
        width={660}
        confirmLoading={isUpdating}
      >
        <div>
          <h4>Chỉnh sửa tin đăng</h4>
        </div>
        <Box>
          <div className="mt-4">
            <Divider textAlign="left">
              <h6>Thông tin cơ bản</h6>
            </Divider>

            <div className="mt-4 container">
              <p>Tỉnh, thành phố</p>
              <Form.Item>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  name="province"
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  onClick={handleAddressChange}
                  value={selectedProvince}
                >
                  <option selected value={editNew.address.province}>
                    {editNew.address.province
                      ? editNew.address.province
                      : (Array.isArray(provinces) && provinces.length > 0
                          ? provinces.find(
                              (item) => item.idProvince === editNew.address.province
                            )?.name
                          : "")}
                  </option>
                  {provinces && provinces.length > 0
                    ? provinces.map((item, index) => {
                        return (
                          <option key={item.idProvince} value={item.idProvince}>
                            {item.name}
                          </option>
                        );
                      })
                    : null}
                </select>
              </Form.Item>
            </div>
            <div className="mt-4 container">
              <p>Quận, huyện</p>
              <Form.Item>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  value={selectedDistrict}
                  name="district"
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  onClick={handleAddressChange}
                >
                  <option value={editNew.address.district} selected>
                    {editNew.address.district
                      ? editNew.address.district
                      : (Array.isArray(districts1) && districts1.length > 0
                          ? districts1.find(
                              (item) => item.idDistrict === editNew.address.district
                            )?.name
                          : "")}
                  </option>
                  {districtFilter && districtFilter.length > 0
                    ? districtFilter.map((item, index) => {
                        return (
                          <option key={item.idDistrict} value={item.idDistrict}>
                            {item.name}
                          </option>
                        );
                      })
                    : null}
                </select>
              </Form.Item>
            </div>
            <div className="mt-4 container">
              <p>Phường, xã</p>
              <Form.Item>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  onClick={handleAddressChange}
                  name="ward"
                >
                  <option value={editNew.address.ward} selected>
                    {editNew.address.ward}
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
              </Form.Item>
            </div>

            <div className="mt-4 container">
              <p>Địa chỉ hiển thị trên tin đăng</p>
              <Form.Item>
                <TextField
                  size="small"
                  variant="outlined"
                  name="details"
                  value={editNew.address.details}
                  onChange={handleAddressChange}
                  sx={{ width: 590 }}
                />
              </Form.Item>
            </div>
          </div>
          <div>
            <Divider textAlign="left">
              <h6>Thông tin bài viết</h6>
            </Divider>

            <div className="mt-4 container">
              <p>Tiêu đề</p>
              <Form.Item>
                <TextField
                  size="small"
                  id="outlined-basic"
                  value={editNew.title}
                  variant="outlined"
                  name="title"
                  sx={{ width: 590 }}
                  onChange={handleChange}
                />
              </Form.Item>
            </div>
            <div className="mt-4 container">
              <p>Mô tả</p>
              <Form.Item>
                <Textarea
                  id="outlined-basic"
                  placeholder="Nhập mô tả chung về tin của bạn. Ví dụ: Máy còn bảo hành 2 năm, đã dùng được 2 tháng, máy hơi cũ ..."
                  variant="outlined"
                  value={editNew.description}
                  name="description"
                  sx={{ width: 590, height: 200 }}
                  onChange={handleChange}
                />{" "}
              </Form.Item>
            </div>
          </div>
          <div>
            <Divider textAlign="left">
              <h6>Thông tin sản phẩm</h6>
            </Divider>{" "}
            {editNew.type === "lens" ? null : editNew.type ===
              "accessory" ? null : (
              <div className="container mt-4">
                <p>Loại hình </p>
                <Form.Item>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="property_type_id"
                    onClick={handleChange}
                  >
                    <option
                      selected
                      value={editNew.property_type_id}
                      className="text-danger"
                    >
                      {
                        Array.isArray(properties) && properties.length > 0
                          ? properties.find(
                              (item) => item._id === editNew.property_type_id
                            )?.name
                          : ""
                      }
                    </option>
                    {properties && properties.length > 0
                      ? properties.map((item, index) => {
                          return (
                            <option key={index} value={item._id}>
                              {item.name}
                            </option>
                          );
                        })
                      : null}
                  </select>
                </Form.Item>
              </div>
            )}
            <div className="row container">
              <div className="col-9">
                <p className="mt-4 fs-6">Mức giá </p>
                <Form.Item>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    name="value"
                    value={editNew.price.value}
                    sx={{ width: 420 }}
                    onChange={handlePriceChange}
                  />
                </Form.Item>
              </div>
              <div className="col-3">
                <p className="mt-4 fs-6 container">Đơn vị</p>
                <Form.Item>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="unit"
                    value={editNew.price.unit}
                    onClick={handlePriceChange}
                  >
                    <option value="VND">VND</option>
                    <option value="USD">USD</option>
                  </select>
                </Form.Item>
              </div>
            </div>
            <div className="mt-4 container">
              <p>
                Tổng giá:{" "}
                <span>
                  {editNew.price.value.toLocaleString("it-IT")}.
                  {editNew.price.unit}
                </span>
              </p>
            </div>
            <div className="mt-4 container">
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  Loại tin (Bấm chọn)
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="cho-thue"
                  name="type"
                  value={editNew.type}
                  onClick={handleChange}
                >
                  <FormControlLabel
                    value="accessory"
                    control={<Radio />}
                    label="Phụ kiện"
                  />
                  <FormControlLabel
                    value="camera"
                    control={<Radio />}
                    label="Máy ảnh"
                  />
                  <FormControlLabel
                    value="camcorder"
                    control={<Radio />}
                    label="Máy quay"
                  />
                  <FormControlLabel
                    value="lens"
                    control={<Radio />}
                    label="Ống kính"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div className="container">
              <p className="mt-4 fs-6">Pháp lý</p>
              <select
                name="legal_info"
                className="form-select"
                aria-label="Default select example"
                onClick={handleChange}
              >
                <option
                  selected
                  value={editNew.legal_info}
                  className="text-danger"
                >
                  {editNew.legal_info === "so-hong"
                    ? "Sổ hồng"
                    : editNew.legal_info === "so-do"
                    ? "Sổ đỏ"
                    : editNew.legal_info === "so-vang"
                    ? "Giấy tờ hợp pháp"
                    : "Khác"}
                </option>
                <option value="so-hong">Sổ hồng</option>
                <option value="so-do">Sổ đỏ</option>
                <option value="so-vang">Giấy tờ hợp pháp</option>
                <option value="khac">Khác</option>
              </select>
            </div>
          </div>

          <div>
            <Divider textAlign="left">
              <h6>Hình ảnh và Video </h6>
            </Divider>
            <div className="container mt-4">
              <Typography variant="body2" gutterBottom>
                • Đăng tối thiểu 4 ảnh thường với tin VIP
              </Typography>
              <Typography variant="body2" gutterBottom>
                • Mô tả ảnh tối đa 45 kí tự.
              </Typography>
              <Typography variant="body2" gutterBottom>
                • Đăng tối đa 12 ảnh với tất cả các loại tin
              </Typography>
              <Typography variant="body2" gutterBottom>
                {" "}
                • Hãy dùng ảnh thật, không trùng, không chèn SĐT
              </Typography>
              <Typography variant="body2" gutterBottom>
                • Mỗi ảnh kích thước tối thiểu 100x100 px, tối đa 15 MB
              </Typography>
            </div>

            <div className="mt-4 container d-flex justify-content-between row">
              <div className="col">
                <Button
                  variant="contained"
                  component="label"
                  disabled={isUploading}
                  sx={{ mb: 2 }}
                >
                  {isUploading ? "Đang tải lên..." : "Chọn hình ảnh"}
                  <input
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </Button>
                {isUploading && (
                  <Typography variant="body2" color="text.secondary">
                    Đang tải lên hình ảnh...
                  </Typography>
                )}
              </div>

              <div className="col">
                <Typography variant="h6" gutterBottom>
                  Hình ảnh hiện tại ({editNew.images.length})
                </Typography>
                <ImageList
                  sx={{ width: 400, height: 300 }}
                  cols={3}
                  rowHeight={120}
                >
                  {editNew.images.map((image, index) => (
                    <ImageListItem key={index} sx={{ position: 'relative' }}>
                      <img 
                        src={image.url} 
                        alt={`Image ${index}`}
                        loading="lazy"
                        style={{ objectFit: 'cover' }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.8)',
                            color: 'white'
                          }
                        }}
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                      >
                        ×
                      </IconButton>
                    </ImageListItem>
                  ))}
                </ImageList>
                {editNew.images.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Chưa có hình ảnh nào
                  </Typography>
                )}
              </div>
            </div>
            {console.log(editNew)}
            <div>
              <p className="mt-4">Video</p>
              <Button>
                <input type="file" name="video" onChange={handleVideoChange} />
              </Button>
              <div>
                {Array.isArray(editNew?.videos) && editNew.videos.length > 0 ? (
                  editNew.videos.map((video, index) => (
                    <video key={index} width="320" height="240" controls>
                      <source src={video.video_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ))
                ) : (
                  <p>Chưa có video nào</p>
                )}
              </div>
            </div>
          </div>
        </Box>
        <hr />
      </Modal>
      <Modal
        open={open3}
        onOk={handleClose3}
        onCancel={handleClose3}
        okText="Đóng"
        cancelText="Hủy"
        width={800}
      >
        <div>
          <h4>Xem trước tin đăng</h4>

          <div className="d-flex justify-content-center mt-4">
            <Carousel style={{ width: "560px" }}>
              {previewItem?.images &&
                previewItem?.images.map((item, index) => (
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
            <h5>{previewItem?.title}</h5>
          </div>
          <hr />
          <div className="mt-4 row">
            <div className="col-8 row">
              <div className="col">
                <h6>Mức giá</h6>
                <h6>
                  {/* {formatPrice(
                    previewItem?.price?.value
                      ? previewItem?.price?.value
                      : previewItem?.price
                  )}{" "} */}
                  {previewItem?.price?.unit}
                </h6>
              </div>
            </div>
            <div className="col-4 d-flex justify-content-end">
              <IconButton
                onClick={(event) => handleFavorite(event, previewItem._id)}
              >
                <FavoriteIcon />
              </IconButton>

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
            <p>{previewItem?.description}</p>
          </div>
          <hr />
          <div>
            <h5>Thông tin chi tiết</h5>
            <div className="row">
              <div className="col-6">
                <p>
                  <span>Địa chỉ: </span>
                  {previewItem?.address.province},{" "}
                  {previewItem?.address.district}, {previewItem?.address.ward}
                </p>
              </div>
              <div className="col-6">
                <p>
                  {previewItem?.type == "camera" ? (
                    <div>
                      <span>Loại máy: </span>
                      {
                        Array.isArray(properties) && properties.length > 0
                          ? properties.find(
                              (item) => item._id === previewItem.property_type_id
                            )?.name
                          : ""
                      }
                    </div>
                  ) : (
                    <div>
                      <span>Loại máy: </span>
                      {
                        Array.isArray(typeArr) && typeArr.length > 0
                          ? typeArr.find((item) => item.value === previewItem?.type)
                              ?.label
                          : ""
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
                  to={`/map/${previewItem?.address.province}/${previewItem?.address.district}/${previewItem?.address.ward}`}
                >
                  tại đây
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PostUser;
