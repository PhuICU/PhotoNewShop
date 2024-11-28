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

import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
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
      });
  };

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

  return (
    <div>
      <div className="d-flex justify-content-end container-fluid">
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
