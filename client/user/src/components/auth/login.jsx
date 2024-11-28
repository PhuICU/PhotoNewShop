import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../api/authApi";

import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Typography,
  Avatar,
} from "@mui/material";

import { notification } from "antd";

import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error1, setError1] = useState("");
  const Navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    login(user)
      .then((response) => {
        console.log(response.data.data.user);
        console.log(response.data.data.access_token);
        localStorage.setItem("accessToken", response.data.data.access_token);
        localStorage.setItem("refreshToken", response.data.data.refresh_token);
        localStorage.setItem("user1", JSON.stringify(response.data.data.user));
        Navigate("/");
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message === "Unprocessable Entity") {
          if (error.response.data.errors.email) {
            const emailError = error.response.data.errors.email;
            notification["error"]({
              message: "Thông báo",
              description: emailError,
              duration: 2,
            });
          }
          if (error.response.data.errors.password) {
            const passwordError = error.response.data.errors.password;
            notification["error"]({
              message: "Thông báo",
              description: passwordError,
              duration: 2,
            });
          }
          if (error.response.data.errors.refresh_token) {
            notification["error"]({
              message: "Thông báo",
              description: "Email hoặc mật khẩu không chính xác",
              duration: 2,
            });
          }
        }
        if (error.response.data.message === "Thông tin đăng nhập không đúng") {
          notification["error"]({
            message: "Thông báo",
            description: "Email hoặc mật khẩu không chính xác",
            duration: 2,
          });
        }
      });
  };

  console.log(error1);

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const ColorButton1 = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[700]),
    fontSize: "10px",

    backgroundColor: grey[700],
    "&:hover": {
      backgroundColor: grey[900],
    },
  }));

  const openNotification = (type) => {
    const description =
      error1 === "Unprocessable Entity"
        ? "Email hoặc mật khẩu không chính xác"
        : error1;
    notification[type]({
      message: "Thông báo",
      description: description,
      duration: 2,
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between container-fluid">
        <div
          style={{
            paddingTop: "10px",
          }}
        >
          <Link to={"/"} className="link-underline-light">
            <img
              src="data:image/png;base64,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"
              alt=""
              width="70"
            />
          </Link>
        </div>
        <div className="mt-4">
          <Button variant="outlined">
            <Link to={"/register"} className="link-underline-light">
              Đăng ký
            </Link>
          </Button>
        </div>
      </div>
      <hr />
      <div className="row mt-4 ">
        <div
          className="col d-flex justify-content-center mt-4"
          style={{
            top: "0",
            zIndex: "1000",
            height: "108px",

            position: "sticky",
          }}
        >
          <img
            src="https://cdn.britannica.com/36/69636-050-81A93193/Self-Portrait-artist-panel-board-Vincent-van-Gogh-1887.jpg"
            alt=""
            width={400}
            height={400}
            className="mt-4"
          />
        </div>
        <div className="col d-flex justify-content-center">
          <Grid>
            <Box
              sx={{
                my: 4,
                mx: 15,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar>
                <LockOutlinedIcon />
              </Avatar>
              <div className="d-flex justify-content-start">
                <Typography component="h1" variant="h5">
                  Đăng nhập
                </Typography>
              </div>

              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <p>Địa chỉ email</p>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={handleChange}
                />
                <br />
                <p className="mt-4">Mật khẩu</p>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Ghi nhớ tôi"
                />
                <Grid container>
                  <Grid item xs>
                    <Link
                      to={"/forgot-password"}
                      variant="body2"
                      className="link-underline-light text-dark"
                    >
                      Quên mật khẩu?
                    </Link>
                  </Grid>
                </Grid>
                <ColorButton1
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => {
                    if (error1 !== "") {
                      openNotification("error");
                    }
                  }}
                >
                  Đăng nhập
                </ColorButton1>
              </Box>
            </Box>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default Login;
