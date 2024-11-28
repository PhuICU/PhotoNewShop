import React, { useState, useEffect } from "react";

import { Checkbox, Pagination, Modal, Form } from "antd";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useQueryParams from "../../hook/useQueryParams";

import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CameraOutlined,
} from "@ant-design/icons";

import {
  FormControl,
  InputAdornment,
  TextField,
  IconButton,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
  createSvgIcon,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  ImageList,
  TablePagination,
  ImageListItem,
} from "@mui/material";

import Textarea from "@mui/joy/Textarea";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import { styled } from "@mui/material/styles";

import { deepOrange, red } from "@mui/material/colors";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { getProperties } from "../../api/propertiesApi";
import { getProvinces, getDistricts, getWards } from "../../api/addressApi";

import instance from "../../api/instanApi";

import { createPhotoNew, deletePhotoNew } from "../../api/photoNewApi";

import { uploadCloudinaryMultipleImages } from "../../api/imageApi";

// import { uploadMutipleVideos } from "../../api/uploadVideoApi";
import TextArea from "antd/es/input/TextArea";

function DashbroadNew() {
  const [dataProperties, setDataProperties] = useState({
    _id: "",
    name: "",
    description: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showClearIcon, setShowClearIcon] = useState(false);

  const [dataNew, setDataNew] = useState({
    items: [],
    paginate: {
      total: 0,
      limit: 0,
      page: 0,
    },
  });
  const [page, setPage] = useState(0); // Pagination page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  console.log("Data: ", dataNew);

  const [removeId, setRemoveId] = useState("");

  const [addnew, setAddNew] = useState({
    property_type_id: "",
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
    type: "",
    images: [],
    videos: [],
    contact_info: {
      contact_name: "",
      contact_phone: "",
      contact_email: "",
    },
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => {
    setOpen1(true);
  };
  const handleClose1 = () => setOpen1(false);

  const [files, setFiles] = useState([]);

  const [files1, setFiles1] = useState([]);

  const [imagess, setImages] = useState([]);

  const [video, setVideo] = useState([]);

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

    console.log("Addnew: ", addnew);

    setFiles((prevState) => [...prevState, ...files]);
  };

  const handleVideoChange = (e) => {
    const files = e.target.files;
    setFiles1(files);
    console.log("Files: ", files);
    const video = Array.from(files).map((file) => URL.createObjectURL(file));
    setVideo(video);

    console.log("Video: ", video);
    setAddNew((prevState) => ({
      ...prevState,
      video: video,
    }));

    console.log("Addnew: ", addnew);

    setFiles1((prevState) => [...prevState, ...files]);
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

  const query = useQueryParams();

  const { data, isLoading } = useQuery({
    queryKey: ["photo-news", query],
    queryFn: async () => await instance.get(`/photo-news`),
  });

  console.log(data);
  const post = data?.data?.data?.items;

  console.log("Data: ", post);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProperties();
        setDataProperties(response.data.data);
      } catch (error) {
        console.log("Failed to fetch data: ", error);
      }
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
    fetchData(dataNew.paginate.page);

    // fetchNew();
    fetchData();
  }, []);

  const districtFilter = districts.filter(
    (district) => district.idProvince === selectedProvince
  );

  const wardFilter = wards.filter(
    (ward) => ward.idDistrict === selectedDistrict
  );

  console.log("Data: ", districtFilter, selectedDistrict);

  console.log("Data: ", selectedDistrict, wardFilter);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddNew((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    try {
      const response = await deletePhotoNew(removeId);
      console.log("Data: ", response);
      alert("Xóa thành công");

      window.location.reload();
    } catch (error) {
      console.log("Failed to fetch data: ", error);
    }
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

  const handlePageChange = (newPage) => {
    fetchData(newPage);
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

  addnew.price.value = Number(addnew.price.value);

  const addressResult =
    provinces.find(
      (province) => province.idProvince === addnew.address.province
    )?.name +
    ", " +
    districts.find(
      (district) => district.idDistrict === addnew.address.district
    )?.name +
    ", " +
    addnew.address.ward +
    ", " +
    addnew.address.details;
  console.log("Data: ", addnew);

  const typeArray = [
    {
      value: "camera",
      label: "Máy ảnh",
    },
    {
      value: "lens",
      label: "Ống kính",
    },
    {
      value: "accessory",
      label: "Phụ kiện",
    },
    {
      value: "camcorder",
      label: "Máy quay",
    },
  ];

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setShowClearIcon(event.target.value ? "flex" : "none");
  };

  const handleClick = () => {
    setSearchTerm("");
    setShowClearIcon("none");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  const filteredItems = post?.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.contact_info.contact_name.toLowerCase().includes(term) ||
      typeArray
        .find((type) => type.value === item.type)
        ?.label.toLowerCase()
        .includes(term) ||
      item.title.toLowerCase().includes(term) ||
      dataProperties
        .find((property) => property._id === item.property_type_id)
        ?.name.toLowerCase()
        .includes(term) ||
      "" ||
      item.contact_info.contact_email.toLowerCase().includes(term) ||
      item.price.value.toString().toLowerCase().includes(term)
    );
  });

  console.log("Search query: ", dataNew.items);

  console.log("Data: ", files);

  const onSubmit = async () => {
    try {
      const form = new FormData();
      files.forEach((file) => {
        form.append("images", file);
      });
      const imagess = await uploadCloudinaryMultipleImages(form);

      console.log("Images: ", imagess);

      if (files1.length > 0) {
        const form1 = new FormData();
        files1.forEach((file) => {
          form1.append("videos", file);
        });
        const video = await uploadMutipleVideos(form1);
        console.log("Video: ", video);
        const response = await createPhotoNew({
          ...addnew,
          images: imagess,
          videos: video,
        });
      }

      console.log("Video: ", video);
      const response = await createPhotoNew({
        ...addnew,
        images: imagess,
        videos: video,
      });
      console.log("Data: ", response);
      if (response) {
        //alert response message
        alert("Thêm mới thành công");
      }
    } catch (error) {
      console.log("Failed to fetch data: ", error);
    }
  };

  console.log("Data: ", addnew);

  const { search } = "search";

  const itemRender = (_, type, originalElement) => {
    if (type === "prev") {
      return (
        <Button>
          <ArrowLeftOutlined />
          Trang trước
        </Button>
      );
    }
    if (type === "next") {
      return (
        <Button>
          Trang sau
          <ArrowRightOutlined />
        </Button>
      );
    }
    return originalElement;
  };

  const PlusIcon = createSvgIcon(
    // credit: plus icon from https://heroicons.com/
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>,
    "Plus"
  );

  const ColorButton1 = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    "&:hover": {
      backgroundColor: deepOrange[700],
    },
  }));

  const ColorButton2 = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(red[400]),
    backgroundColor: red[400],
    "&:hover": {
      backgroundColor: red[700],
    },
  }));

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="mt-4 container">
      {isLoading && <p>Loading...</p>}
      <div className="d-flex justify-content-between ">
        <div>
          <h5>DANH SÁCH TIN </h5>
        </div>
        <div>
          <ColorButton1 type="primary" onClick={handleOpen1}>
            <PlusIcon fontSize="90" /> Thêm mới bài đăng
          </ColorButton1>
        </div>
      </div>
      <div className="mt-4">
        <FormControl className={search}>
          <TextField
            placeholder="Tìm kiếm"
            size="small"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  position="end"
                  style={{ display: showClearIcon }}
                  onClick={handleClick}
                >
                  <ClearIcon />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </div>
      <div className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox>Khách hàng</Checkbox>
              </TableCell>
              <TableCell>Loại tin </TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Loại hình </TableCell>
              <TableCell>Địa chỉ Email</TableCell>
              <TableCell>Giá bán</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems?.length > 0 ? (
              filteredItems?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox>{item.contact_info.contact_name}</Checkbox>
                  </TableCell>
                  <TableCell>
                    {typeArray.find((type) => type.value === item.type)?.label}
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    {dataProperties.length > 0 ? (
                      dataProperties.find(
                        (property) => property._id === item.property_type_id
                      )?.name
                    ) : (
                      <p>Không có dữ liệu</p>
                    )}
                  </TableCell>
                  <TableCell>{item.contact_info.contact_email}</TableCell>
                  <TableCell>
                    {formatPrice(item.price.value) + " " + item.price.unit}
                  </TableCell>
                  <TableCell>
                    <Link to={`/admin/new/${item._id}`}>
                      <IconButton variant="outlined" color="primary">
                        <EditOutlinedIcon />
                      </IconButton>
                    </Link>
                    <IconButton
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => setRemoveId(item._id)}
                      color="error"
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="7">Không có dữ liệu</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>{" "}
        <TablePagination
          component="div"
          count={filteredItems?.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count}`
          }
        />
      </div>
      {console.log("Data: ", dataNew.paginate)}
      <div className="d-flex justify-content-center">
        {dataNew.paginate.total > 0 ? (
          <Pagination
            total={dataNew.paginate.total}
            current={dataNew.paginate.page}
            pageSize={dataNew.paginate.limit}
            itemRender={itemRender}
            onChange={handlePageChange}
          />
        ) : null}
      </div>

      <Modal
        visible={open1}
        onOk={onSubmit}
        onCancel={handleClose1}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ variant: "outlined", danger: true }}
        width={690}
      >
        <Form className="container " encType="">
          <div className="container-fluid">
            <h3>Thông tin cơ bản</h3>
            <div className="mt-4">
              <p>Loại tin </p>
              <Form.Item>
                <select
                  class="form-select"
                  aria-label="Default select example"
                  name="property_type_id"
                  onClick={handleChange}
                >
                  <option selected>Loại hình máy </option>
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
            <div>
              <p>Tỉnh, thành phố</p>
              <Form.Item>
                <select
                  class="form-select"
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
                          <option
                            key={item.idProvince}
                            value={item.idProvince}
                            id={item.name}
                          >
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
                  class="form-select"
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
                  class="form-select"
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
                          <option key={item.idCommune} value={item.name}>
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
                  variant="outlined"
                  name="details"
                  size="small"
                  label="Nhập địa chỉ cụ thể"
                  onChange={handleAddressChange}
                  sx={{ width: 590 }}
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
                  sx={{ width: 590 }}
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
                  sx={{ width: 590 }}
                  onChange={handleChange}
                />
              </Form.Item>
            </div>
          </div>
          <hr />
          <div className="container-fluid">
            <h3>Thông tin máy</h3>

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

            <div className="row">
              <div className="col-9">
                <p className="mt-4 fs-6">Mức giá</p>
                <Form.Item>
                  <TextField
                    size="small"
                    id="outlined-basic"
                    label="Giá máy"
                    variant="outlined"
                    name="value"
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
                    onClick={handlePriceChange}
                  >
                    <option value="VND">VND</option>
                    <option value="USD">USD</option>
                  </select>
                </Form.Item>
              </div>
              <div className="mt-4">
                <p>
                  Tổng giá:{" "}
                  <span>
                    {addnew.price.value.toLocaleString("it-IT")}.
                    {addnew.price.unit}
                  </span>
                </p>
              </div>{" "}
            </div>

            <div>
              <p className="mt-4 fs-6">Pháp lý</p>
              <select
                name="legal_info"
                class="form-select"
                aria-label="Default select example"
                onClick={handleChange}
              >
                <option selected>Chọn pháp lý</option>
                <option value="yes">ys</option>
                <option value="no">no</option>
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
      </Modal>
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Xóa bài đăng
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">Bạn có chắc muốn xóa vĩnh viễn?</div>
            <div class="modal-footer">
              <Button
                type="secondary"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Hủy
              </Button>
              <ColorButton2
                type="primary"
                onClick={handleDelete}
                data-bs-dismiss="modal"
              >
                Xóa
              </ColorButton2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashbroadNew;
