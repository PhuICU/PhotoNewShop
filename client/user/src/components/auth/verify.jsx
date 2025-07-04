import { useState, useLocation, useEffect } from "react";
import useQuery from "../../hook/useQueryParam";
import { notification } from "antd";

import { resendEmailVerification, verifyEmail } from "../../api/authApi";
import { useParams, useNavigate } from "react-router-dom";

function Verify() {
  const data = JSON.parse(localStorage.getItem("user"));

  const query = useQuery();
  console.log(query.token);

  const navigate = useNavigate();
  const resend = () => {
    // alert("Đã gửi lại email xác thực");
    notification["success"]({
      message: "Thông báo",
      description: "Đã gửi lại email xác thực",
      duration: 2,
    });
    resendEmailVerification(data.data.insertedId)
      .then((response) => {
        console.log(response);
        // alert("Đã gửi lại email xác thực");
        notification["success"]({
          message: "Thông báo",
          description: "Đã gửi lại email xác thực",
          duration: 2,
        });
        localStorage.removeItem("user");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    verifyEmail(query.token)
      .then((response) => {
        console.log(response);
        // alert("Xác thực thành công");
        notification["success"]({
          message: "Thông báo",
          description: "Xác thực thành công",
          duration: 2,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (!data) {
    notification["error"]({
      message: "Thông báo",
      description: "Tài khoản đã được xác thực, vui lòng đăng nhập",
      duration: 2,
    });
    navigate("/login");
  }

  return (
    <div
      className="mt-4"
      style={{
        borderRadius: "10px",
        backgroundColor: "#f1f1f1",
        padding: "20px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        height: "50vh",
        paddingTop: "50px",
      }}
    >
      <div className="verify d-flex justify-content-center">
        <h1>Cảm ơn bạn đã đăng ký</h1>
      </div>
      <br />{" "}
      <div className="text-center">
        <p>
          Để hoàn tất quá trình đăng ký, bấm nút bên dưới để xác nhận
          <strong>{data?.email}</strong>
        </p>
      </div>
      <br />
      <div
        className="text-center"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          style={{
            color: "white",
            backgroundColor: "green",
            borderRadius: "5px",
            padding: "10px",
            borderColor: "white",
          }}
          onClick={resend}
        >
          Gửi lại email xác thực
        </button>
      </div>
    </div>
  );
}

export default Verify;
