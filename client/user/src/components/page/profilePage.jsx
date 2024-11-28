import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import useScrollToTop from "../../hook/useScrollToTop";

import UserChat from "../chat/userChat";
import ChatBox from "../chat/chatBox";
import CardFavorites from "../card/cardFavorites";
import PostUser from "../table/table.postUser";

import { Paper, Button, Typography, Divider } from "@mui/material";

// import Textarea from "@mui/joy/Textarea";

import { Avatar, Modal, Upload, Form, Input, Image, notification } from "antd";

import { CameraOutlined } from "@ant-design/icons";
import { CrownFilled } from "@ant-design/icons";

import { styled } from "@mui/material/styles";

import { red, amber, lightBlue, deepOrange, pink } from "@mui/material/colors";

import { uploadCloudinarySingleImage } from "../../api/imageApi";
import {
  changePassword,
  requestLockAccount,
  getProfile,
  updateProfile,
} from "../../api/authApi";

import { getCurrentActiveVip } from "../../api/vipApi";
import { getPhotoNewsByUserId, updatePhotoNew } from "../../api/photoNewApi";
import { getProperties } from "../../api/propertiesApi";
import { getDistricts, getProvinces, getWards } from "../../api/addressApi";
import { getChatsOfUser } from "../../api/chatApi";

function ProfilePage() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  const id = JSON.parse(localStorage.getItem("user1"))._id;

  const [password, setPassword] = useState({
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [districts1, setDistricts1] = useState([]);

  const [dataNewUser, setDataNewUser] = useState([]);

  const [dataUser, setDataUser] = useState({
    full_name: "",
    phone: "",
    tax_code: "",
    email: "",
    address: {
      province: "",
      district: "",
      ward: "",
      details: "",
    },
  });

  const [chat, setChat] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [idChat, setIdChat] = useState("");

  const [selectedProvince, setSelectedProvince] = useState("");

  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [payloadUpdate, setPayloadUpdate] = useState({});

  const [dataFavorites, setDataFavorites] = useState([]);

  const [HistoryVip, setHistoryVip] = useState([]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const RequestLock = async () => {
    try {
      const res = await requestLockAccount();
      console.log(res);
      notification["success"]({
        message: "Thông báo",
        description: "Yêu cầu khóa tài khoản thành công",
        duration: 2,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <CameraOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const ColorButton1 = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(red[500]),
    fontSize: "10px",

    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: amber[700],
    },
  }));

  const ColorButton2 = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(lightBlue[300]),
    fontSize: "10px",
    backgroundColor: lightBlue[300],
    "&:hover": {
      backgroundColor: lightBlue[600],
    },
  }));

  const ColorButton3 = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(deepOrange[100]),
    fontSize: "10px",
    backgroundColor: deepOrange[100],
    "&:hover": {
      backgroundColor: amber[700],
    },
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile();
        setDataUser(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (localStorage.getItem("user1")) {
      const user = JSON.parse(localStorage.getItem("user1"));
      setPayloadUpdate((prev) => ({
        ...prev,
        full_name: user.full_name,
        phone: user.phone,
        tax_code: user.tax_code,
        email: user.email,
        address: user.address,
      }));
    }

    const fetchHistoryVip = async () => {
      try {
        const res = await getCurrentActiveVip();
        setHistoryVip(res.data.data);
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
      const data = districtsData?.filter(
        (district) => district.idProvince === selectedProvince
      );
      setDistricts(data);
    };

    const fetchWards = async () => {
      const wardsData = await getWards();
      const data = wardsData?.filter(
        (ward) =>
          ward.idDistrict === selectedDistrict &&
          ward.idProvince === selectedProvince
      );
      setWards(data);
    };

    const fetchDistricts1 = async () => {
      const districtsData = await getDistricts();
      setDistricts1(districtsData);
    };

    fetchDistricts1();
    fetchProvinces();
    fetchDistricts();
    fetchWards();
    fetchHistoryVip();
    fetchUser();
  }, [setDataUser, setHistoryVip, setDataFavorites]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await getChatsOfUser(id);
        setChat(res.data.data);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };

    fetchChats();
  }, [id]);

  const districtFilter = districts.filter(
    (district) => district.idProvince === selectedProvince
  );

  const wardFilter = wards.filter(
    (ward) => ward.idDistrict === selectedDistrict
  );

  useEffect(() => {
    const fetchNewUser = async () => {
      try {
        const res = await getPhotoNewsByUserId(id);
        setDataNewUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNewUser();
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setPayloadUpdate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = async (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const endDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onChangePassword = async () => {
    try {
      if (password.new_password.length < 6) {
        notification["error"]({
          message: "Thông báo",
          description: "Mật khẩu mới phải có ít nhất 6 ký tự",
          duration: 2,
        });
        return;
      } else if (password.new_password === password.old_password) {
        notification["error"]({
          message: "Thông báo",
          description: "Mật khẩu mới không được trùng mật khẩu cũ",
          duration: 2,
        });
        return;
      } else if (password.new_password !== password.new_password_confirm) {
        notification["error"]({
          message: "Thông báo",
          description: "Mật khẩu mới không khớp",
          duration: 2,
        });
        return;
      } else {
        const res = await changePassword(password);
        console.log(res);

        notification["success"]({
          message: "Thông báo",
          description: "Đổi mật khẩu thành công",
          duration: 2,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(payloadUpdate);
  const handleUpdateProfile = () => {
    try {
      const res = updateProfile(payloadUpdate);

      console.log(res);
      notification["success"]({
        message: "Thông báo",
        description: "Cập nhật thông tin thành công",
        duration: 2,
      });

      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddressUserChange = (e) => {
    const { name, value } = e.target;
    setPayloadUpdate((prevValue) => ({
      ...prevValue,
      address: {
        ...prevValue.address,
        [name]: value,
      },
    }));
  };

  const updateCurrentChat = (item) => {
    setCurrentChat(item); // or any other state setter
  };

  useScrollToTop();
  return (
    <div>
      <div className="row container-fluid mt-4">
        <Paper className="col-7 container">
          <div className="grad1 container">
            <div className="d-flex justify-content-between container-fluid  ">
              <nav className="navbar navbar-expand-lg navbar-light ">
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Avatar
                        alt="Travis Howard"
                        src="https://mui.com/static/images/avatar/2.jpg"
                      />
                    </li>
                    <li className="nav-item">
                      <h4 className="col">
                        <span> {dataUser.full_name}</span>
                      </h4>
                      <Typography
                        variant="caption"
                        display="block"
                        gutterBottom
                        className="text-muted"
                      >
                        <span className="fw-bold text-warning">
                          <CrownFilled />{" "}
                        </span>
                        {HistoryVip ? HistoryVip?.package?.vip_score : 0}
                      </Typography>
                    </li>
                  </ul>
                </div>
              </nav>
              <div className="align-self-end">
                <Button
                  variant="outlined"
                  className="bg-white text-dark mt-4 fw-bolder"
                  onClick={handleOpen}
                >
                  Cập nhật thông tin
                </Button>
              </div>
            </div>
            <br />
          </div>
          <div className="mt-4 container-fluid">
            <h4>Thông tin cá nhân</h4>
            <div>
              <p>
                <span className="fw-bold">Họ và tên: </span>{" "}
                {dataUser?.full_name}
              </p>
              <p>
                <span className="fw-bold">Số điện thoại: </span>{" "}
                {dataUser?.phone}
              </p>
              <p>
                <span className="fw-bold">Email: </span> {dataUser?.email}
              </p>
              <p>
                <span className="fw-bold">Địa chỉ: </span>{" "}
                {dataUser?.address?.province &&
                dataUser?.address?.district &&
                dataUser?.address?.ward
                  ? provinces.find(
                      (province) =>
                        province.idProvince === dataUser?.address?.province
                    )?.name +
                    ", " +
                    districts1.find(
                      (district) =>
                        district.idDistrict === dataUser?.address?.district
                    )?.name +
                    ", " +
                    dataUser?.address?.ward +
                    ", " +
                    dataUser?.address?.details
                  : ""}
              </p>
            </div>
            <div className="row mt-4">
              <div className="col-4">
                <Link to={"/up-vip"}>
                  <ColorButton3>Nâng VIP</ColorButton3>
                </Link>
              </div>
              <div className="col-4">
                <Link to={"/instruction"}>
                  <ColorButton3>Hướng dẫn</ColorButton3>
                </Link>
              </div>
              <div className="col-4">
                <Link to={"/post/new"}>
                  <ColorButton3>Đăng tin</ColorButton3>
                </Link>
              </div>
            </div>
            <br />
          </div>
        </Paper>
        &emsp;
        <Paper className="col-4 container-fluid p-3 mb-2 grad1">
          <Paper sx={{ py: 2 }} className="mt-4 container-fluid">
            <h5 className="">Thông tin tài khoản</h5>
            <div className="d-flex justify-content-between container-fluid This is 25% opacity secondary background .bg-secondary.bg-gradient">
              <ul className="navbar-nav">
                <li className="nav-item ">
                  <p>Số lượng tin đã đăng</p>
                </li>
                <li className="nav-item ">
                  <p>Tài khoản Vip</p>
                </li>
                <li className="nav-item ">
                  <p className="">Ngày hết hạn Vip</p>
                </li>
                <li className="nav-item ">
                  <p className="">Giới hạn tin đăng</p>
                </li>
              </ul>
              <ul className="navbar-nav">
                <li className=" fs-6">
                  <p>{HistoryVip ? HistoryVip?.posting_used : 0}</p>
                </li>
                <li className=" fs-6">
                  <p>{HistoryVip ? HistoryVip?.package?.packageName : 0}</p>
                </li>
                <li className=" fs-6">
                  <p>{HistoryVip ? endDate(HistoryVip?.end_date) : 0}</p>
                </li>
                <li className=" fs-6">
                  <p>
                    {HistoryVip
                      ? HistoryVip?.package?.priviLeges?.postingLimit
                          ?.totalPost - HistoryVip?.posting_used
                      : 0}
                  </p>
                </li>
              </ul>
            </div>
          </Paper>
          <div className="d-flex justify-content-center mt-4">
            <ColorButton2
              className="text-white"
              variant="contained"
              onClick={handleOpen1}
            >
              Quản lý tài khoản
            </ColorButton2>
          </div>
        </Paper>
      </div>
      <br />
      <Divider textAlign="left">
        <h4>Bài đăng của bạn</h4>
      </Divider>
      <PostUser dataNewUser={dataNewUser} user={id} />

      <Divider className="" textAlign="left">
        <h4>Tin đăng đã lưu</h4>
      </Divider>

      <CardFavorites dataFavorites={dataFavorites} />

      <Divider>
        <h4>Tin nhắn của bạn</h4>
      </Divider>
      {console.log(currentChat)}
      <div className="row  mt-4" style={{ paddingLeft: "80px" }}>
        <div className="col-4">
          {chat && chat && chat.length ? (
            chat.map((item, index) => (
              <div key={index}>
                <button
                  onClick={() => {
                    updateCurrentChat(item);
                    setIdChat(item._id);
                  }}
                  style={{
                    border: "none",
                    background: "none",
                    width: "100%",
                  }}
                >
                  <UserChat chat={item} user={id} />
                </button>
              </div>
            ))
          ) : (
            <p>
              Hiện chưa có đoạn chat nào, hãy nhắn tin với người khác để tạo
              đoạn chat
            </p>
          )}
        </div>
        {console.log(currentChat)}
        {/* Main chat display and input area */}
        <div className="col-7" style={{ paddingLeft: "100px" }}>
          <ChatBox chat={currentChat} user={id} id={idChat} />
        </div>
      </div>
      <Modal
        open={open}
        onOk={handleUpdateProfile}
        onCancel={handleClose}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form>
          <div className="">
            <h6>Thông tin cá nhân</h6>

            <div className="row mt-4">
              <div className="col">
                <p>Họ và tên</p>
                <Form.Item>
                  <Input
                    placeholder="Họ và tên"
                    value={payloadUpdate.full_name}
                    onChange={onChange}
                    name="full_name"
                  />
                </Form.Item>
              </div>
              <div className="col">
                <p>Mã thuế cá nhân</p>
                <Form.Item>
                  <Input
                    placeholder="Mã thuế cá nhân"
                    value={payloadUpdate.tax_code}
                    name="tax_code"
                    onChange={onChange}
                  />
                </Form.Item>
                <span className="text-muted">MST gồm 10 chữ số</span>
              </div>
            </div>
          </div>
          <hr />
          <div>
            <h6>Thông tin liên hệ</h6>
            <div className=" mt-4">
              <div>
                <p>Số điện thoại</p>
                <Form.Item>
                  <Input
                    placeholder="Số điện thoại"
                    value={payloadUpdate.phone}
                    name="phone"
                    onChange={onChange}
                  />
                </Form.Item>
              </div>{" "}
              <div>
                <p>Email</p>
                <Form.Item>
                  <Input
                    placeholder="Email"
                    value={payloadUpdate.email}
                    name="email"
                    onChange={onChange}
                  />
                </Form.Item>
              </div>
              <div>
                <p className="fw-bold">Địa chỉ</p>
                <div className="container">
                  <div>
                    <p>Tỉnh/Thành phố</p>
                    <Form.Item>
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        name="province"
                        onChange={(e) => handleProvinceChange(e.target.value)}
                        onClick={handleAddressUserChange}
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
                    </Form.Item>
                  </div>
                  <div>
                    <p>Quận/Huyện</p>
                    <Form.Item>
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        value={selectedDistrict}
                        name="district"
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        onClick={handleAddressUserChange}
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
                    </Form.Item>

                    <div>
                      <p>Phường/Xã</p>
                      <Form.Item>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          disabled={!selectedDistrict}
                          name="ward"
                          onClick={handleAddressUserChange}
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
                      <p>Địa chỉ cụ thể</p>
                      <Form.Item>
                        <Input
                          placeholder="Địa chỉ cụ thể"
                          value={payloadUpdate?.address?.details}
                          name="details"
                          onChange={handleAddressUserChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </Form>
      </Modal>
      <Modal
        open={open1}
        onOk={handleClose1}
        onCancel={handleClose1}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <div>
          <h6>Đổi mật khẩu </h6>
          <Form className=" mt-4">
            <div>
              <p>Mật khẩu hiện tại</p>
              <Form.Item>
                <Input
                  placeholder="Mật khẩu cũ"
                  name="old_password"
                  type="password"
                  onChange={handlePasswordChange}
                />
              </Form.Item>
              <Typography
                className="text-danger"
                variant="caption"
                display="block"
              >
                Bạn quên mật khẩu?
              </Typography>
            </div>
            <div className="mt-4">
              <p>Mật khẩu mới</p>
              <Form.Item>
                <Input
                  placeholder="Mật khẩu mới"
                  name="new_password"
                  type="password"
                  onChange={handlePasswordChange}
                />
              </Form.Item>
            </div>
            <div>
              <p>Nhập lại mật khẩu mới</p>
              <Form.Item>
                <Input
                  placeholder="Nhập lại mật khẩu mới"
                  name="new_password_confirm"
                  type="password"
                  onChange={handlePasswordChange}
                />
              </Form.Item>
              <Typography variant="caption" display="block" gutterBottom>
                Mật khẩu tối thiểu 8 ký tự
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                Chứa ít nhất 1 ký tự viết hoa
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                Chứa ít nhất 1 ký tự số
              </Typography>
            </div>
            <div className="d-flex justify-content-end">
              <ColorButton2 className="text-white" onClick={onChangePassword}>
                Lưu thay đổi
              </ColorButton2>
            </div>
          </Form>
        </div>
        <hr />
        <div>
          <h6>Khóa tài khoản</h6>
          <Form className=" mt-4">
            <div>
              <p>Mật khẩu</p>
              <Form.Item>
                <Input placeholder="Mật khẩu" />
              </Form.Item>
            </div>
            <div>
              <p>Lý do khóa</p>
              <Form.Item>
                <Input placeholder="Lý do khóa" />
              </Form.Item>
            </div>
            <div className="d-flex justify-content-end">
              <ColorButton1 onClick={RequestLock}>Khóa tài khoản</ColorButton1>
            </div>
          </Form>
          <Typography variant="subtitle2" gutterBottom>
            Lưu ý khi khóa tài khoản:
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Quý khách sẽ không thể đăng nhập lại vào tài khoản này sau khi khóa.
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Các tin đăng đang hiển thị của quý khách sẽ tiếp tục được hiển thị
            tới hết thời gian đăng tin đã chọn.
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Số dư tiền (nếu có) trong các tài khoản của quý khách sẽ không được
            hoàn lại.
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Tài khoản dịch vụ của quý khách chỉ có thể được khóa khi không còn
            số dư nợ.
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Số điện thoại chính đăng ký tài khoản này và các số điện thoại đăng
            tin của quý khách sẽ không thể được sử dụng lại để đăng ký tài khoản
            mới.
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Trong trường hợp bạn muốn sử dụng lại số điện thoại chính này, vui
            lòng liên hệ CSKH 1900.0000 để được hỗ trợ.
          </Typography>
        </div>
        <hr />
        <div>
          <h6>Yêu cầu xóa tài khoản</h6>
          <p>
            Gửi yêu cầu xoá toàn bộ thông tin của tài khoản. Sau khi được xử lý,
            toàn bộ thông tin sẽ được xoá và không thể hoàn tác.
          </p>
          <div className="d-flex justify-content-end">
            <ColorButton1>Yêu cầu xóa tài khoản</ColorButton1>
          </div>
        </div>
        <hr />
      </Modal>
    </div>
  );
}

export default ProfilePage;
