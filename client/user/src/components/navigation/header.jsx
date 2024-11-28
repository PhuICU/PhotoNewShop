import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { notification, theme } from "antd";
import { styled } from "@mui/material/styles";
import { getCurrentActiveVip } from "../../api/vipApi";

import { getProfile } from "../../api/authApi";
function Header() {
  const [activeLink, setActiveLink] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const Navigite = useNavigate();

  const setDarkMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  };

  const setLightMode = () => {
    document.querySelector("body").setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  };

  const selectTheme = localStorage.getItem("theme");

  if (selectTheme === "dark") {
    setDarkMode();
  }

  const toggleTheme = (e) => {
    if (e.target.checked) {
      setDarkMode();
    } else {
      setLightMode();
    }
  };

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#aab4be",
          ...theme.applyStyles("dark", {
            backgroundColor: "#8796A5",
          }),
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: "#001e3c",
      width: 32,
      height: 32,
      "&::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
      ...theme.applyStyles("dark", {
        backgroundColor: "#003892",
      }),
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: "#aab4be",
      borderRadius: 20 / 2,
      ...theme.applyStyles("dark", {
        backgroundColor: "#8796A5",
      }),
    },
  }));

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const [dataVip, setDataVip] = useState(false);

  const [dataUser, setDataUser] = useState({
    full_name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user1");
    Navigite("/");
  };

  const linkStyle = (link) => ({
    borderBottom: activeLink === link ? " red 2px solid" : "none",
    textDecoration: "none",

    padding: "10px",
  });

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProfile();
        setDataUser(response.data.data);
      } catch (error) {
        console.log("Failed to fetch data: ", error);
      }
    };

    const fetchVip = async () => {
      try {
        const response = await getCurrentActiveVip();
        if (response) {
          setDataVip(true);
        }
      } catch (error) {
        console.log("Failed to fetch data: ", error);
      }
    };
    fetchVip();
    fetchData();
  }, []);

  const warning = () => {
    // alert("Bạn cần đăng nhập để thực hiện chức năng này");
    notification["warning"]({
      message: "Thông báo",
      description: "Bạn cần đăng nhập để thực hiện chức năng này",
      duration: 2,
    });
  };

  return (
    <header
      style={{
        top: "0",
        zIndex: "1000",
        height: "78px",
        backgroundColor: "white",
        position: "sticky",
        boxShadow: "0 4px 6px 0 rgba(0, 0, 0, 0.1)",
      }}
      className="header-photo"
    >
      <div className="row">
        <div className="col-8">
          <nav className="navbar navbar-expand-lg navbar-light ">
            <div className="container-fluid">
              <Link
                to={"/"}
                className="navbar-brand"
                onClick={() => setActiveLink("/")}
              >
                <img
                  src="data:image/png;base64,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"
                  alt=""
                  width="70"
                />
              </Link>

              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item fw-bolder">
                    <Link
                      to={"/classfication?type=camera"}
                      className="nav-link "
                      style={linkStyle("/classfication?type=camera")}
                      onClick={() =>
                        handleLinkClick("/classfication?type=camera")
                      }
                    >
                      MÁY ẢNH
                    </Link>
                  </li>
                  <li className="nav-item fw-bolder">
                    <Link
                      to={"/classfication?type=camcorder"}
                      className="nav-link"
                      style={linkStyle("/classfication?type=camcorder")}
                      onClick={() =>
                        handleLinkClick("/classfication?type=camcorder")
                      }
                    >
                      MÁY QUAY
                    </Link>
                  </li>
                  <li className="nav-item fw-bolder">
                    {" "}
                    <Link
                      to={"/classfication?type=lens"}
                      className="nav-link"
                      style={linkStyle("/classfication?type=lens")}
                      onClick={() =>
                        handleLinkClick("/classfication?type=lens")
                      }
                    >
                      ỐNG KÍNH
                    </Link>
                  </li>

                  <li className="nav-item fw-bolder">
                    <Link
                      to={"/classfication?type=accessory"}
                      className="nav-link"
                      style={linkStyle("/classfication?type=accessory")}
                      onClick={() =>
                        handleLinkClick("/classfication?type=accessory")
                      }
                    >
                      PHỤ KIỆN
                    </Link>
                  </li>

                  <li className="nav-item fw-bolder">
                    <Link
                      to={"/chatbot"}
                      className="nav-link "
                      style={linkStyle("/chatbot")}
                      onClick={() => handleLinkClick("/chatbot")}
                    >
                      HỖ TRỢ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <div className="col-4 d-flex justify-content-end">
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <MaterialUISwitch
                            sx={{ m: 1 }}
                            defaultChecked={
                              selectTheme === "dark" ? true : false
                            }
                          />
                        }
                        onClick={toggleTheme}
                      />
                    </FormGroup>
                  </li>

                  {localStorage.getItem("accessToken") &&
                  localStorage.getItem("user1") ? (
                    <div className="collapse navbar-collapse" id="navbarNav">
                      <ul className="navbar-nav">
                        <li className="nav-item">
                          <Link
                            to={"/profile"}
                            className="nav-link"
                            id="basic-button"
                            aria-controls={open ? "basic-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onMouseEnter={handleClick}
                          >
                            <Avatar
                              alt="Travis Howard"
                              src="https://mui.com/static/images/avatar/2.jpg"
                            />
                          </Link>
                          <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                              "aria-labelledby": "basic-button",
                            }}
                          >
                            <MenuItem onClick={handleLogout}>
                              Đăng xuất
                            </MenuItem>
                          </Menu>
                        </li>
                        <li className="nav-item">
                          <Link to={"/profile"} className="nav-link">
                            {dataUser.full_name}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="collapse navbar-collapse" id="navbarNav">
                      <ul className="navbar-nav"></ul>
                      <li className="nav-item">
                        <Link to={"/login"} className="nav-link">
                          Đăng nhập
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to={"/register"} className="nav-link">
                          Đăng ký
                        </Link>
                      </li>
                    </div>
                  )}
                  <li>
                    {localStorage.getItem("user1") && dataVip === true ? (
                      <Link to={"/post/new"} className="nav-link">
                        <Button variant="contained">đăng tin</Button>
                      </Link>
                    ) : (
                      <Link
                        to={"/login"}
                        className="nav-link"
                        onClick={warning}
                      >
                        <Button variant="contained" disabled>
                          đăng tin
                        </Button>
                      </Link>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </nav>{" "}
        </div>{" "}
      </div>
    </header>
  );
}

export default Header;
