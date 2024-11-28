import { useState, useLocation, useEffect } from "react";
import useQuery from "../../hook/useQueryParam";
import { notification } from "antd";

import { resendEmailVerification, verifyEmail } from "../../api/authApi";
import { useParams, useNavigate } from "react-router-dom";

function Verify() {
  const data = JSON.parse(localStorage.getItem("user"));
  console.log(data.data.insertedId);

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

  return (
    <div>
      <div className="verify d-flex justify-content-center">
        <h1>Cảm ơn bạn đã đăng ký</h1>
      </div>
      <br />{" "}
      <div>
        <button onClick={resend}>Gửi lại</button>
      </div>
    </div>
  );
}

export default Verify;
