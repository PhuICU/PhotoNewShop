import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import useScrollToTop from "../../hook/useScrollToTop";
import { useFetchUser } from "../../hook/useFetchUser";
import useUserStore from "../store/useUserStore";

import UserChat from "../chat/userChat";
import ChatBox from "../chat/chatBox";
import CardFavorites from "../card/cardFavorites";
import PostUser from "../table/table.postUser";

import { Paper, Button, Typography, Divider } from "@mui/material";

// import Textarea from "@mui/joy/Textarea";

import { Avatar, Modal, Upload, Form, Input, Image, notification } from "antd";

import { CrownFilled } from "@ant-design/icons";

import { styled } from "@mui/material/styles";

import { red, amber, lightBlue, deepOrange, pink } from "@mui/material/colors";

import { uploadCloudinarySingleImage } from "../../api/imageApi";
import {
  changePassword,
  requestLockAccount,
  getProfile,
} from "../../api/authApi";

import { getCurrentActiveVip } from "../../api/vipApi";
import { getPhotoNewsByUserId, updatePhotoNew } from "../../api/photoNewApi";

import { getDistricts, getProvinces, getWards } from "../../api/addressApi";
import { getChatsOfUser } from "../../api/chatApi";

import EditUserModal from "../modal/modal.editUser";

import "../../utils/Language/i18n";
import { useTranslation } from "react-i18next";

function ProfilePage() {
  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  const id = JSON.parse(localStorage.getItem("user"))._id;

  const [password, setPassword] = useState({
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  });
  const { data: user, isLoading, isError, error } = useFetchUser();
  console.log(user);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [districts1, setDistricts1] = useState([]);

  const [dataNewUser, setDataNewUser] = useState([]);

  const [chat, setChat] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [idChat, setIdChat] = useState("");

  const [selectedProvince, setSelectedProvince] = useState("");

  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [dataFavorites, setDataFavorites] = useState([]);

  const [HistoryVip, setHistoryVip] = useState([]);

  const { t } = useTranslation();

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

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

  useEffect(() => {
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

    const fetchDistricts1 = async () => {
      const districtsData = await getDistricts();
      setDistricts1(districtsData);
    };

    fetchDistricts1();
    fetchProvinces();
    fetchDistricts();
    fetchWards();
    fetchHistoryVip();
  }, [setHistoryVip, setDataFavorites]);

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
                        <span> {user?.full_name}</span>
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
              <EditUserModal />
            </div>
            <br />
          </div>
          <div className=" container-fluid">
            <h4>{t("Thông tin cá nhân")}</h4>
            <div>
              <p>
                <span className="fw-bold">{t("Họ và tên")}: </span>{" "}
                {user?.full_name}
              </p>
              <p>
                <span className="fw-bold">{t("Số điện thoại")}: </span>{" "}
                {user?.phone}
              </p>
              <p>
                <span className="fw-bold">{t("Email")}: </span> {user?.email}
              </p>
              <p>
                <span className="fw-bold">{t("Địa chỉ")}: </span>{" "}
                {user?.address?.province &&
                user?.address?.district &&
                user?.address?.ward
                  ? (Array.isArray(provinces) && provinces.length > 0
                      ? provinces.find(
                          (province) =>
                            province.idProvince === user?.address?.province
                        )?.name
                      : "") +
                    ", " +
                    (Array.isArray(districts1) && districts1.length > 0
                      ? districts1.find(
                          (district) =>
                            district.idDistrict === user?.address?.district
                        )?.name
                      : "") +
                    ", " +
                    user?.address?.ward +
                    ", " +
                    user?.address?.details
                  : ""}
              </p>
            </div>
            <div className="row mt-4">
              <div className="col-4">
                <Link to={"/up-vip"}>
                  <ColorButton3>{t("Nâng VIP")}</ColorButton3>
                </Link>
              </div>
              <div className="col-4">
                <Link to={"/instruction"}>
                  <ColorButton3>{t("Hướng dẫn")}</ColorButton3>
                </Link>
              </div>
              <div className="col-4">
                <Link to={"/post/new"}>
                  <ColorButton3>{t("Đăng tin")}</ColorButton3>
                </Link>
              </div>
            </div>
            <br />
          </div>
        </Paper>
        &emsp;
        <Paper className="col-4 container-fluid p-2 mb-2 grad1">
          <Paper sx={{ py: 2 }} className="mt-4 container-fluid">
            <h5 className="">{t("Thông tin tài khoản")}</h5>
            <div className="d-flex justify-content-between container-fluid This is 25% opacity secondary background .bg-secondary.bg-gradient">
              <ul className="navbar-nav">
                <li className="nav-item ">
                  <p>{t("Số lượng tin đã đăng")}</p>
                </li>
                <li className="nav-item ">
                  <p>{t("Tài khoản Vip")}</p>
                </li>
                <li className="nav-item ">
                  <p className="">{t("Ngày hết hạn Vip")}</p>
                </li>
                <li className="nav-item ">
                  <p className="">{t("Giới hạn tin đăng")}</p>
                </li>
              </ul>
              <ul className="navbar-nav">
                <li className=" fs-6">
                  <p>{HistoryVip ? HistoryVip?.posting_used : 0}</p>
                </li>
                <li className=" fs-6">
                  <p>{HistoryVip ? t(HistoryVip?.package?.packageName) : 0}</p>
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
              {t("Quản lý tài khoản")}
            </ColorButton2>
          </div>
        </Paper>
      </div>
      <br />
      <Divider textAlign="left">
        <h4>{t("Bài đăng của bạn")}</h4>
      </Divider>
      <PostUser dataNewUser={dataNewUser} user={id} />

      <Divider className="" textAlign="left">
        <h4>{t("Tin đăng đã lưu")}</h4>
      </Divider>

      <CardFavorites dataFavorites={dataFavorites} />

      <Divider>
        <h4>{t("Tin nhắn của bạn")}</h4>
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
              {t(
                "Hiện chưa có đoạn chat nào, hãy nhắn tin với người khác để tạo đoạn chat"
              )}
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
