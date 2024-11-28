import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { TextField, Typography, Grid, Box, Button } from "@mui/material";

import { Steps, message, notification } from "antd";

import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

import { forgotPassword, resetPassword } from "../../api/authApi";

function Verity() {
  const { Step } = Steps;

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      email: data.get("email"),
    });
  };

  const [email, setEmail] = useState({
    email: "",
  });
  const [otp, setOtp] = useState({
    otp: "",
  });

  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState({
    email: email.email,
    password: "",
    confirmPassword: "",
  });

  password.email = email.email;

  const [resend, setResend] = useState(false);

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[900]),
    fontSize: "10px",

    backgroundColor: grey[900],
    "&:hover": {
      backgroundColor: grey[400],
    },
  }));

  const steps = [
    {
      title: "First",
      content: "First-content",
    },
    {
      title: "Second",
      content: "Second-content",
    },
    {
      title: "Last",
      content: "Last-content",
    },
  ];

  const items = steps.map((item, index) => (
    <Step key={index} title={item.title} />
  ));

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const [current, setCurrent] = React.useState(0);

  const resendCode = () => {
    setResend(true);

    forgotPassword(email)
      .then((response) => {
        console.log(response);
        next();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(otp.otp);

  const handleChangeOtp = (e) => {
    setOtp({ otp: e.target.value });
  };

  const verifyOtp = () => {
    if (otp.otp === otpCode) {
      notification.success({
        message: "Xác thực thành công",
        description: "Vui lòng nhập mật khẩu mới",
      });
      next();
    } else {
      notification.error({
        message: "Mã xác thực không chính xác",
        description: "Vui lòng nhập lại mã xác thực",
      });
    }
  };

  const handleEmailChange = (e) => {
    setEmail({ email: e.target.value });
  };

  console.log(email.email);
  const onSubmit = () => {
    forgotPassword(email)
      .then((response) => {
        console.log(response);
        if (response?.response?.data?.message === "Unprocessable Entity") {
          if (
            response.response.data.errors.email === "Email không được để trống"
          ) {
            notification.error({
              message: "Email không được để trống",
              description: "Vui lòng nhập email",
            });
          }
          if (response.response.data.errors.email === "Email không hợp lệ") {
            notification.error({
              message: "Email không đúng định dạng",
              description: "Vui lòng nhập email",
            });
          }
        }
        if (response?.response?.data?.message === "Email không tồn tại") {
          const error = response?.response?.data?.message;
          console.log(error);
          notification.error({
            message: error,
            description: "Vui lòng nhập lại email",
          });
        } else {
          notification.success({
            message: "Mã xác thực đã được gửi",
            description: "Vui lòng kiểm tra email của bạn",
          });

          setOtpCode(response.data.token);
          next();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePasswordChange = async (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const Navigation = useNavigate();

  const submitPassword = () => {
    if (password.password !== password.confirmPassword) {
      notification.error({
        message: "Mật khẩu không khớp",
        description: "Vui lòng nhập lại mật khẩu",
      });
    } else if (password.password.length < 6) {
      notification.error({
        message: "Mật khẩu phải có ít nhất 6 ký tự",
        description: "Vui lòng nhập lại mật khẩu",
      });
    } else {
      resetPassword(password)
        .then((response) => {
          console.log(response);
          if (response?.message === "Reset mật khẩu thành công") {
            notification.success({
              message: "Mật khẩu đã được cập nhật",
              description: "Vui lòng đăng nhập",
            });
            Navigation("/login");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  console.log(password);

  return (
    <div>
      <div className="d-flex justify-content-start container-fluid"></div>
      <div className="mt-4">
        <Grid className="mt-4">
          <Box
            sx={{
              my: 4,
              mx: 15,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="d-flex justify-content-start">
              <Typography component="h1" variant="h5">
                Quên mật khẩu
              </Typography>
            </div>
            {current === 0 && (
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <p className="text-muted">
                  Vui lòng cung cấp địa chỉ email để lấy lại mật khẩu.
                </p>
                <p className="mt-4">Địa chỉ email</p>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={handleEmailChange}
                />
                <br />
                <div style={{ marginTop: 24 }}>
                  {current < steps.length - 1 && (
                    <ColorButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={() => {
                        onSubmit();
                      }}
                    >
                      Xác nhận
                    </ColorButton>
                  )}
                </div>
              </Box>
            )}
            {current === 1 && (
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <p>Nhập mã xác thực email của bạn</p>
                <p
                  className="mt-4 text-danger d-flex justify-content-center"
                  onClick={resendCode}
                >
                  Gửi lại mã xác thực
                </p>
                <TextField
                  required
                  fullWidth
                  id="otp"
                  label="OTP"
                  name="otp"
                  autoComplete="otp"
                  autoFocus
                  onChange={handleChangeOtp}
                />

                <div style={{ marginTop: 0 }}>
                  {current < steps.length - 1 && (
                    <ColorButton
                      type="submit"
                      fullWidth
                      name="otp"
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={() => {
                        verifyOtp();
                      }}
                    >
                      Xác nhận
                    </ColorButton>
                  )}
                </div>
              </Box>
            )}
            {current === 2 && (
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <p className="mt-4">Mật khẩu mới</p>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                />
                <p className="mt-4">Nhập lại mật khẩu</p>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                />

                <ColorButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => {
                    submitPassword();
                  }}
                >
                  Xác nhận
                </ColorButton>
              </Box>
            )}
          </Box>
        </Grid>
        <div>
          <Steps current={current} items={items} className="container" />
          <div
            style={{ marginTop: 24 }}
            className="d-flex justify-content-center"
          >
            {current > 0 && (
              <Button
                variant="outlined"
                style={{ margin: "0 8px" }}
                onClick={() => prev()}
              >
                Trở lại
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verity;
