import React, { useState, useEffect } from "react";

import { Form, Flex, Spin, notification } from "antd";

import {
  Autocomplete,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Button,
  ImageList,
  ImageListItem,
} from "@mui/material";

import Textarea from "@mui/joy/Textarea";
import useScrollToTop from "../../hook/useScrollToTop";

import { getProperties } from "../../api/propertiesApi";
import { getPhotoNews, createPhotoNew } from "../../api/photoNewApi";
import { getProvinces, getDistricts, getWards } from "../../api/addressApi";

// import { uploadMutipleVideos } from "../../api/uploadVideoApi";
import { uploadCloudinaryMultipleImages } from "../../api/imageApi";

import { CameraOutlined } from "@ant-design/icons";

function PostNewPage() {
  const [imagess, setImages] = useState([]);

  const [video, setVideo] = useState([]);

  const [files, setFiles] = useState([]);

  const [files1, setFiles1] = useState([]);
  const [error1, setError] = useState(null);

  const [dataProperties, setDataProperties] = useState([]);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");

  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [addNew, setAddNew] = useState({
    property_type_id: "654ba93cba62368b56847d72",
    address: {
      province: "",
      district: "",
      ward: "",
      details: "",
    },

    details: "",
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
    type: "lens",
    images: [],
    videos: [],
    contact_info: {
      contact_name: "",
      contact_phone: "",
      contact_email: "",
    },
  });

  const handleImageChange = (e) => {
    const files = e.target.files;
    setFiles(files);
    console.log("Files: ", files);
    const imagess = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages(imagess);

    console.log("Images: ", imagess);
    setAddNew((prevState) => ({
      ...prevState,
      images: imagess,
    }));

    console.log("Addnew: ", addNew);

    setFiles((prevState) => [...prevState, ...files]);
  };

  const onSubmit = async () => {
    try {
      // Ensure files is an array
      const filesArray = Array.isArray(files) ? files : Array.from(files);
      const form = new FormData();
      filesArray.forEach((file) => {
        form.append("images", file);
      });

      const imagess = await uploadCloudinaryMultipleImages(form);

      const response = await createPhotoNew({
        ...addNew,
        images: imagess,
      });

      console.log("Response: ", response);

      //susccess notification
      if (response.message === "Tạo tin thành công") {
        notification.success({
          message: "Tạo tin thành công",
          description: "Tin của bạn đã được đăng thành công",
        });
      }
      if (response.message === "Bạn đã sử dụng hết số lần đăng tin") {
        notification.error({
          message: "Lỗi",
          description: "Bạn đã sử dụng hết số lần đăng tin",
        });
      }
      if (response?.response?.data?.errors) {
        if (response.response.data.errors.title) {
          notification.error({
            message: "Lỗi",
            description: response.response.data.errors.title,
          });
        }
        if (response.response.data.errors.description) {
          notification.error({
            message: "Lỗi",
            description: response.response.data.errors.description,
          });
        }
        if (response.response.data.errors["contact_info.contact_email"]) {
          notification.error({
            message: "Lỗi",
            description:
              response.response.data.errors["contact_info.contact_email"],
          });
        }
        if (response.response.data.errors["contact_info.contact_phone"]) {
          notification.error({
            message: "Lỗi",
            description:
              response.response.data.errors["contact_info.contact_phone"],
          });
        }
        if (response.response.data.errors["contact_info.contact_name"]) {
          notification.error({
            message: "Lỗi",
            description:
              response.response.data.errors["contact_info.contact_name"],
          });
        }
        if (response.response.data.errors["address.details"]) {
          notification.error({
            message: "Lỗi",
            description: response.response.data.errors["address.details"],
          });
        }
        if (response.response.data.errors["address.province"]) {
          notification.error({
            message: "Lỗi",
            description: response.response.data.errors["address.province"],
          });
        }
        if (response.response.data.errors["address.district"]) {
          notification.error({
            message: "Lỗi",
            description: response.response.data.errors["address.district"],
          });
        }
        if (response.response.data.errors["address.ward"]) {
          notification.error({
            message: "Lỗi",
            description: response.response.data.errors["address.ward"],
          });
        }
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  console.log(error1);

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await getProperties();
      setDataProperties(response.data.data);
    };

    const fetchProvinces = async () => {
      const provincesData = await getProvinces();
      setProvinces(provincesData);
    };

    fetchProvinces();

    const fetchDistricts = async () => {
      const districtsData = await getDistricts();
      console.log("Data: ", districtsData.idProvince, selectedProvince);
      const data = districtsData?.filter(
        (district) => district.idProvince === selectedProvince
      );
      setDistricts(data);
    };

    fetchDistricts();

    const fetchWards = async () => {
      const wardsData = await getWards();
      const data = wardsData?.filter(
        (ward) =>
          ward.district_id === selectedDistrict &&
          ward.province_id === selectedProvince
      );
      setWards(data);
    };
    fetchWards();

    fetchProperties();
  }, []);

  const districtFilter = districts.filter(
    (district) => district.idProvince === selectedProvince
  );

  const wardFilter = wards.filter(
    (ward) => ward.idDistrict === selectedDistrict
  );

  addNew.address.province = provinces?.find(
    (province) => province.idProvince === selectedProvince
  )?.name;
  addNew.address.district = districts?.find(
    (district) => district.idDistrict === selectedDistrict
  )?.name;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddNew({ ...addNew, [name]: value });
  };

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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddNew((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value,
      },
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setAddNew((prevData) => ({
      ...prevData,
      price: {
        ...prevData.price,
        [name]: value,
      },
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setAddNew((prevData) => ({
      ...prevData,
      contact_info: {
        ...prevData.contact_info,
        [name]: value,
      },
    }));
  };

  const addressResult =
    addNew.address.province +
    ", " +
    addNew.address.district +
    ", " +
    addNew.address.ward +
    ", " +
    addNew.address.details;

  console.log("Addnew: ", addNew);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // if (isLoading) {
  //   return (
  //     <Flex
  //       sx={{
  //         height: "100vh",
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //       <Spin size="large" />
  //     </Flex>
  //   );
  // }

  useScrollToTop();
  return (
    <div className="container d-flex justify-content-center mt-4">
      <div className="">
        <Form className="container ">
          <div className="container-fluid">
            <h3>Thông tin cơ bản</h3>{" "}
            <div className="mt-4">
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  Loại sản phẩm (Bấm chọn)
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="cho-thue"
                  name="type"
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
            <div>
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
                  <option selected>Chọn tỉnh, thành phố</option>
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
            <div>
              <p>Quận, huyện</p>
              <Form.Item>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  value={selectedDistrict}
                  name="district"
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  onClick={handleAddressChange}
                  disabled={!selectedProvince}
                >
                  <option value="" selected>
                    Chọn quận, huyện
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
            <div>
              <p>Phường, xã</p>
              <Form.Item>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  disabled={!selectedDistrict}
                  name="ward"
                  onClick={handleAddressChange}
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
              </Form.Item>
            </div>
            <div>
              <p className="mt-4">Địa chỉ cụ thể</p>
              <Form.Item>
                <TextField
                  size="small"
                  variant="outlined"
                  name="details"
                  label="Nhập địa chỉ cụ thể"
                  onChange={handleAddressChange}
                  sx={{ width: 900 }}
                />
              </Form.Item>
            </div>{" "}
            <div>
              <p className="mt-4">
                Địa chỉ:
                <span>{addressResult}</span>
              </p>
            </div>
          </div>
          <hr />
          <div className="container-fluid">
            <h3>Thông tin bài viết</h3>

            <div className="">
              <p className="mt-4">Tiêu đề</p>
              <Form.Item>
                <TextField
                  size="small"
                  id="outlined-basic"
                  label="Tiêu đề"
                  variant="outlined"
                  name="title"
                  sx={{ width: 900 }}
                  onChange={handleChange}
                />
              </Form.Item>
            </div>
            <div>
              <p className="mt-4">Mô tả</p>
              <Form.Item>
                <Textarea
                  id="outlined-basic"
                  placeholder="Nhập mô tả chung về tin của bạn. Ví dụ: Máy còn bảo hành 2 năm, đã dùng được 2 tháng, máy hơi cũ ..."
                  variant="outlined"
                  name="description"
                  sx={{ width: 900 }}
                  onChange={handleChange}
                />
              </Form.Item>
            </div>
          </div>
          <hr />
          <div className="container-fluid">
            <h3>Thông tin máy</h3>
            {addNew.type === "accessory" ? null : addNew.type ===
              "lens" ? null : addNew.type === "camcorder" ? null : (
              <div className="mt-4">
                <p>Loại máy ảnh </p>
                <Form.Item>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="property_type_id"
                    onClick={handleChange}
                  >
                    <option selected>Loại máy ảnh</option>
                    {dataProperties && dataProperties.length > 0
                      ? dataProperties.map((item, index) => {
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

            <div className="row">
              <div className="col-7">
                {" "}
                <p className="mt-4">Giá</p>
                <Form.Item>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    label="Giá"
                    variant="outlined"
                    name="value"
                    sx={{ width: 490 }}
                    onChange={handlePriceChange}
                  />
                </Form.Item>
              </div>
              <div className="col-5">
                <p className="mt-4">Đơn vị</p>
                <Form.Item>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="unit"
                    onClick={handlePriceChange}
                  >
                    <option selected>Chọn đơn vị</option>
                    <option value="VND">VNĐ</option>
                    <option value="USD">USD</option>
                  </select>
                </Form.Item>
              </div>{" "}
              <div className="mt-4">
                <p>
                  Tổng giá:{" "}
                  <span>
                    {formatPrice(addNew.price.value ? addNew.price.value : 0)}.
                    {addNew.price.unit}
                  </span>
                </p>
              </div>{" "}
            </div>
            <div>
              <p className="mt-4 fs-6">Pháp lý</p>
              <select
                name="legal_info"
                className="form-select"
                aria-label="Default select example"
                onClick={handleChange}
              >
                <option selected>Chọn pháp lý</option>
                <option value="Co">Có</option>
                <option value="Khong">Không</option>
              </select>
            </div>
          </div>
          <hr />
          <div className="container-fluid">
            <h3>Hình ảnh & Video</h3>
            <div>
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
                <Button>
                  <input
                    type="file"
                    name="imagess"
                    multiple
                    onChange={handleImageChange}
                  />
                  <br />
                  <div>
                    <CameraOutlined />
                  </div>
                </Button>
              </div>

              <ImageList
                sx={{ width: 200, height: 250 }}
                variant="quilted"
                className="col"
              >
                {imagess.map((image, index) => (
                  <ImageListItem key={index}>
                    <img src={image} alt={image} />
                  </ImageListItem>
                ))}
              </ImageList>
            </div>
            {/* <div>
              <p className="mt-4">Video</p>
              <Button>
                <input type="file" name="video" onChange={handleVideoChange} />
              </Button>
              <div>
                {video.map((video, index) => (
                  <video key={index} width="320" height="240" controls>
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ))}
              </div>
            </div> */}
          </div>
          <hr />
          <div>
            <h3>Thông tin liên hệ</h3>

            <div className="row">
              <div className="col">
                <p className="mt-4">Họ và tên</p>
                <Form.Item>
                  <TextField
                    size="small"
                    sx={{ width: 290 }}
                    id="outlined-basic"
                    label="Họ và tên"
                    variant="outlined"
                    name="contact_name"
                    onChange={handleContactChange}
                  />
                </Form.Item>
              </div>
              <div className="col">
                <p className="mt-4">Số điện thoại</p>
                <Form.Item>
                  <TextField
                    size="small"
                    sx={{ width: 290 }}
                    id="outlined-basic"
                    label="Số điện thoại"
                    variant="outlined"
                    name="contact_phone"
                    onChange={handleContactChange}
                  />
                </Form.Item>
              </div>
            </div>
            <div>
              <p className="mt-4">Email</p>
              <Form.Item>
                <TextField
                  size="small"
                  sx={{ width: 290 }}
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  name="contact_email"
                  onChange={handleContactChange}
                />
              </Form.Item>
            </div>
          </div>
          <hr />

          <div className="d-flex justify-content-center">
            <Button className="btn-primary" onClick={onSubmit}>
              Đăng tin
            </Button>
          </div>
          <br />
        </Form>
      </div>
    </div>
  );
}

export default PostNewPage;
