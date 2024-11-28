import React, { useState } from "react";
import { Link } from "react-router-dom";

import { register } from "../../api/authApi";

import {
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import { notification } from "antd";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function Register() {
  const [user, setUser] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    account_type: "",
    role: "user",
  });
  const [error1, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirm_password) {
      setError("Mật khẩu không khớp");
    } else {
      register(user)
        .then((response) => {
          console.log(response);
          localStorage.setItem("user", JSON.stringify(response.data));
          notification.success({
            message: "Thành công",
            description: "Đăng ký thành công",
          });
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data.errors);
          if (error.response.data.errors.email) {
            const emailError = error.response.data.errors.email;
            notification.error({
              message: "Thông báo",
              description: emailError,
              duration: 2,
            });
          }
          if (error.response.data.errors.password) {
            const passwordError = error.response.data.errors.password;
            notification.error({
              message: "Thông báo",
              description: passwordError,
              duration: 2,
            });
          }
          if (error.response.data.errors.full_name) {
            const fullNameError = error.response.data.errors.full_name;
            notification.error({
              message: "Thông báo",
              description: fullNameError,
              duration: 2,
            });
          }
          if (error.response.data.errors.account_type) {
            const accountTypeError = error.response.data.errors.account_type;
            notification.error({
              message: "Thông báo",
              description: accountTypeError,
              duration: 2,
            });
          }
        });
    }
  };

  console.log(error1);

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const [agree, setAgree] = React.useState(false);

  const openNotification = (type) => {
    notification[type]({
      message: "Thông báo",
      description: error1,
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
          <Link to={"/login"} className="link-underline-light">
            <Button variant="outlined" className="">
              Đăng nhập
            </Button>
          </Link>
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

              <Typography component="h1" variant="h5">
                Đăng ký
              </Typography>

              <Box
                component="form"
                noValidate
                onSubmit={onSubmit}
                sx={{ mt: 1 }}
              >
                <p>Họ và tên</p>
                <TextField
                  required
                  fullWidth
                  id="full_name"
                  label="Full Name"
                  name="full_name"
                  autoComplete="full_name"
                  autoFocus
                  onChange={handleChange}
                />

                <p className="mt-4">Địa chỉ email</p>
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
                {user.password !== user.confirm_password ? (
                  <p className="text-danger">Mật khẩu không khớp</p>
                ) : (
                  ""
                )}

                <p className="mt-4">Nhập lại mật khẩu</p>
                <TextField
                  required
                  fullWidth
                  name="confirm_password"
                  label="Password"
                  type="password"
                  id="confirm_password"
                  autoComplete="current-password"
                  onChange={handleChange}
                />
                {
                  // no match password
                  user.password !== user.confirm_password ? (
                    <p className="text-danger">Mật khẩu không khớp</p>
                  ) : (
                    ""
                  )
                }

                <p className="mt-4">Loại tài khoản</p>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Chọn loại tài khoản
                  </InputLabel>

                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Chọn loại tài khoản"
                    onChange={handleChange}
                    name="account_type"
                  >
                    <MenuItem value={"personal"}>Cá nhân</MenuItem>
                    <MenuItem value={"business"}>Nhà môi giới</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox name="agree" value="true" color="primary" />
                  }
                  onChange={(e) => setAgree(e.target.checked)}
                  label="Bằng cách tạo một tài khoản, tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật của trang web"
                />

                {agree ? (
                  <Button
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
                    Đăng ký
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled
                  >
                    Đăng ký
                  </Button>
                )}
                <Grid container>
                  <Grid item>
                    Đã có tài khoản?
                    <Link
                      to={"/login"}
                      variant="body2"
                      className="link-underline-light text-dark"
                    >
                      <span className="text-danger">Đăng nhập</span>
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default Register;

{
  /* <Form
component="form"
noValidate
onSubmit={onSubmit}
sx={{ mt: 1 }}
>
<p>Họ và tên</p>
<TextField
  required
  fullWidth
  id="full_name"
  label="Full Name"
  name="full_name"
  autoComplete="full_name"
  autoFocus
/>
<p className="mt-4">Địa chỉ email</p>
<TextField
  required
  fullWidth
  id="email"
  label="Email Address"
  name="email"
  autoComplete="email"
  autoFocus
/>
<p className="mt-4">Mật khẩu</p>
<TextField
  required
  fullWidth
  name="password"
  label="Password"
  type="password"
  id="password"
  autoComplete="current-password"
/>
<p className="mt-4">Nhập lại mật khẩu</p>
<TextField
  required
  fullWidth
  name="confirm_password"
  label="Password"
  type="password"
  id="confirm_password"
  autoComplete="current-password"
/>
<p className="mt-4">Loại tài khoản</p>
<FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">
    Chọn loại tài khoản
  </InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    label="Chọn loại tài khoản"
    onChange={handleChange}
  >
    <MenuItem value={10}>Cá nhân</MenuItem>
    <MenuItem value={20}>Nhà môi giới</MenuItem>
  </Select>
</FormControl>
{console.log(full_name, email, password, confirm_password)}
<FormControlLabel
  control={
    <Checkbox name="agree" value="true" color="primary" />
  }
  onChange={(e) => setAgree(e.target.checked)}
  label="By creating an account, I agree to our Terms of use 
  and Privacy Policy "
/>

{agree ? (
  // <Link
  //   // to={"/login"}
  //   className="text-white link-offset-2 link-underline link-underline-opacity-0"
  // >
  <Button
    type="submit"
    fullWidth
    variant="contained"
    sx={{ mt: 3, mb: 2 }}
    // onClick={() => AlertMessage()}
  >
    Đăng ký
  </Button>
) : (
  // </Link>
  <Button
    type="submit"
    fullWidth
    variant="contained"
    sx={{ mt: 3, mb: 2 }}
    disabled
  >
    Đăng ký
  </Button>
)}
<Grid container>
  <Grid item>
    Đã có tài khoản?
    <Link
      to={"/login"}
      variant="body2"
      className="link-underline-light text-dark"
    >
      <span className="text-danger">Đăng nhập</span>
    </Link>
  </Grid>
</Grid>
</Form> */
}
