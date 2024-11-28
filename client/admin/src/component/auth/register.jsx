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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import Form from "@mui/material/FormControl";

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

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(user);
      localStorage.setItem("user", JSON.stringify(response.data));
      console.log(response);
      alert(
        "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản!"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const [agree, setAgree] = React.useState(false);

  // const AlertMessage = () => {
  //   alert("Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản!");
  // };

  return (
    <div>
      <div className="d-flex justify-content-end container-fluid">
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

              <Form component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
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
                {console.log(user.account_type)}
                <FormControlLabel
                  control={
                    <Checkbox name="agree" value="true" color="primary" />
                  }
                  onChange={(e) => setAgree(e.target.checked)}
                  label="By creating an account, I agree to our Terms of use 
                  and Privacy Policy "
                />

                {agree ? (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
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
              </Form>
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
