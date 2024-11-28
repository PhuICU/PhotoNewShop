import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { indigo } from "@mui/material/colors";

import { Button, Badge, Stack, Typography } from "@mui/material";

import {
  ProfileOutlined,
  ProductOutlined,
  AreaChartOutlined,
  CodepenOutlined,
  FormOutlined,
  UsergroupAddOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";

import { Tag } from "antd";

function Sidebar() {
  const [activeLink, setActiveLink] = useState("");

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const Navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user1");
    localStorage.removeItem("refreshToken");
    Navigate("/login");
  };

  const linkStyle = (link) => ({
    color: activeLink === link ? "rgba(12, 127, 218, 1)" : "black",
    textDecoration: "none",
    backgroundColor: activeLink === link ? "rgba(228, 240, 250, 1)" : "white",
    padding: "10px",
    borderRadius: "7px",
  });

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(indigo[500]),
    backgroundColor: indigo[500],
    "&:hover": {
      backgroundColor: indigo[700],
    },
  }));

  const theme = createTheme({
    typography: {
      subtitle1: {
        fontSize: 16,
      },
    },
  });

  return (
    <div className="">
      <div></div>
      <div className="">
        <div className=" mt-4">
          <Stack>
            <a href="http://localhost:5173/" className="nav-link">
              <ColorButton variant="contained">
                <span>Qua trang chủ</span>
              </ColorButton>
            </a>
          </Stack>
        </div>
        <div className=" mt-4">
          <Link
            to=""
            exact
            className="nav-link"
            style={linkStyle("")}
            onClick={() => handleLinkClick("")}
          >
            <ThemeProvider theme={theme}>
              <Typography variant="subtitle1">
                <AreaChartOutlined /> Tổng quan
              </Typography>
            </ThemeProvider>
          </Link>
        </div>
        <div className="mt-4">
          <p className="text-secondary"> QUẢN LÝ BÀI ĐĂNG</p>
          <div>
            <Link
              to={"/post"}
              className="nav-link  "
              style={linkStyle("/post")}
              onClick={() => handleLinkClick("/post")}
            >
              {" "}
              <ThemeProvider theme={theme}>
                <Typography variant="subtitle1">
                  <ProductOutlined /> Danh sách tin
                </Typography>
              </ThemeProvider>
            </Link>
            <Link
              to={"/censor"}
              className="nav-link "
              style={linkStyle("/censor")}
              onClick={() => handleLinkClick("/censor")}
            >
              {" "}
              <ThemeProvider theme={theme}>
                <Typography variant="subtitle1">
                  <FormOutlined /> Duyệt tin
                </Typography>
              </ThemeProvider>
            </Link>
            <Link
              to={"/type"}
              className="nav-link "
              style={linkStyle("/type")}
              onClick={() => handleLinkClick("/type")}
            >
              {" "}
              <ThemeProvider theme={theme}>
                <Typography variant="subtitle1">
                  <CodepenOutlined /> Loại hình
                </Typography>
              </ThemeProvider>
            </Link>{" "}
            <Link
              className="nav-link "
              to={"/comment"}
              style={linkStyle("/comment")}
              onClick={() => handleLinkClick("/comment")}
            >
              {" "}
              <ThemeProvider theme={theme}>
                <Typography variant="subtitle1">
                  <i className="fa fa-comment-o" aria-hidden="true"></i> Quản lý
                  bình luận
                </Typography>
              </ThemeProvider>
            </Link>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-secondary">QUẢN LÝ DANH MỤC KHÁC </p>
          <div>
            <Link
              className="nav-link "
              to={"/vip"}
              style={linkStyle("/vip")}
              onClick={() => handleLinkClick("/vip")}
            >
              {" "}
              <ThemeProvider theme={theme}>
                <Typography variant="subtitle1">
                  <i class="fa fa-star-o" aria-hidden="true"></i> Quản lý gói
                  vip
                </Typography>
              </ThemeProvider>
            </Link>
          </div>

          <div>
            <Link
              to={"/account"}
              className="nav-link "
              style={linkStyle("/account")}
              onClick={() => handleLinkClick("/account")}
            >
              {" "}
              <ThemeProvider theme={theme}>
                <Typography variant="subtitle1">
                  <UsergroupAddOutlined /> Quản lý tài khoản
                </Typography>
              </ThemeProvider>
            </Link>
            {/* <Link
              to={"/decent"}
              className="nav-link "
              style={linkStyle("/decent")}
              onClick={() => handleLinkClick("/decent")}
            >
              {" "}
              <ThemeProvider theme={theme}>
                <Typography variant="subtitle1">
                  <i className="fa fa-shield" aria-hidden="true"></i> Phân quyền
                </Typography>
              </ThemeProvider>
            </Link> */}

            <Link
              to={"/pay"}
              className="nav-link "
              style={linkStyle("/pay")}
              onClick={() => handleLinkClick("/pay")}
            >
              {" "}
              <ThemeProvider theme={theme}>
                <Typography variant="subtitle1">
                  <DollarCircleOutlined /> Quản lý thanh toán
                </Typography>
              </ThemeProvider>
            </Link>
          </div>

          <div>
            <Link
              to={"/report"}
              className="nav-link "
              style={linkStyle("/report")}
              onClick={() => handleLinkClick("/report")}
            >
              {" "}
              <ThemeProvider theme={theme}>
                <Typography variant="subtitle1">
                  <i className="fa fa-podcast" aria-hidden="true"></i> Quản lý
                  báo cáo
                </Typography>
              </ThemeProvider>
            </Link>
          </div>
        </div>
      </div>
      <br />
      <div className="dropdown pb-4 mt-4 container">
        <a
          href="#"
          className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          id="dropdownUser1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://github.com/mdo.png"
            alt="hugenerd"
            width="30"
            height="30"
            className="rounded-circle"
          />
          <span className="d-none d-sm-inline mx-1">loser</span>
        </a>
        <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
          <li>
            <a className="dropdown-item" href="#">
              Cài đặt
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Thông tin cá nhân
            </a>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <Button onClick={handleLogout} className="dropdown-item">
              <i className="fa fa-sign-out" aria-hidden="true"></i>
              Đăng xuất
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
