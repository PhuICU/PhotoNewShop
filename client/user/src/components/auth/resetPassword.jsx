import React from "react";

import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { notification } from "antd";

import { resetPassword } from "../../api/authApi";

function ResetPassword() {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = React.useState("");

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirm_password) {
      setError("Mật khẩu không khớp");
      return;
    }
    try {
      const response = await resetPassword(user);
      console.log(response);
      // alert("Đổi mật khẩu thành công");
      notification["success"]({
        message: "Thông báo",
        description: "Đổi mật khẩu thành công",
        duration: 2,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-center">
        <h1>Đổi mật khẩu</h1>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            onChange={handleChange}
            required
            value={user.email}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Mật khẩu mới"
            name="password"
            onChange={handleChange}
            required
            type="password"
            value={user.password}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nhập lại mật khẩu mới"
            name="confirm_password"
            onChange={handleChange}
            required
            type="password"
            value={user.confirm_password}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            color="primary"
            fullWidth
            onClick={onSubmit}
            variant="contained"
          >
            Đổi mật khẩu
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography color="error">{error}</Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default ResetPassword;
