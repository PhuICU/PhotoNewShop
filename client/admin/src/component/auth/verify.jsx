import { useState, useLocation, useEffect } from "react";
import useQuery from "../../hook/useQueryParams";

import { resendEmailVerification, verifyEmail } from "../../api/authApi";
import { useParams, useNavigate } from "react-router-dom";

function Verify() {
  const data = JSON.parse(localStorage.getItem("user"));
  console.log(data.data.insertedId);

  const query = useQuery();
  console.log(query.token);

  const navigate = useNavigate();
  const resend = () => {
    resendEmailVerification(data.data.insertedId)
      .then((response) => {
        console.log(response);
        alert("Đã gửi lại email xác thực");
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
        alert("Xác thực thành công");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="verify">
      <h1>Cảm ơn bạn đã đăng ký</h1>
      <button onClick={resend}>Gửi lại</button>
    </div>
  );
}

export default Verify;
