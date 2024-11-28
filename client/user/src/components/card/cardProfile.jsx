import React, { useState, useEffect } from "react";

function CardProfile(props) {
  const [dataUser, setDataUser] = useState({
    full_name: "",
    phone: "",
    tax_code: "",
    email: "",
    address: {
      province: "",
      district: "",
      ward: "",
      details: "",
    },
    invoice_info: {
      i_name: "",
      i_email: "",
      i_company: "",
      i_tax_code: "",
    },
  });

  const [HistoryVip, setHistoryVip] = useState({
    package: {
      vip_score: 0,
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile();
        setDataUser(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (localStorage.getItem("user1")) {
      const user = JSON.parse(localStorage.getItem("user1"));
      setPayloadUpdate((prev) => ({
        ...prev,
        full_name: user.full_name,
        phone: user.phone,
        tax_code: user.tax_code,
        email: user.email,
        address: user.address,
        invoice_info: {
          i_name: user.invoice_info.i_name,
          i_email: user.invoice_info.i_email,
          i_company: user.invoice_info.i_company,
          i_tax_code: user.invoice_info.i_tax_code,
        },
      }));
    }

    const fetchHistoryVip = async () => {
      try {
        const res = await getCurrentActiveVip();
        setHistoryVip(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
    fetchHistoryVip();
  }, [setDataUser, setHistoryVip, setDataFavorites]);

  return (
    <div className="card">
      <Paper>
        <div className="grad1 container">
          <div className="d-flex justify-content-between container-fluid  ">
            <nav className="navbar navbar-expand-lg navbar-light ">
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Avatar
                      alt="Travis Howard"
                      src="https://mui.com/static/images/avatar/2.jpg"
                    />
                  </li>
                  <li className="nav-item">
                    <h4 className="col">
                      <span> {dataUser.full_name}</span>
                    </h4>
                    <Typography
                      variant="caption"
                      display="block"
                      gutterBottom
                      className="text-muted"
                    >
                      <span className="fw-bold text-warning">
                        <CrownFilled />{" "}
                      </span>
                      {HistoryVip ? HistoryVip?.package?.vip_score : 0}
                    </Typography>
                  </li>
                </ul>
              </div>
            </nav>
            <div className="align-self-end">
              <Button
                variant="outlined"
                className="bg-white text-dark mt-4 fw-bolder"
                onClick={handleOpen}
              >
                Cập nhật thông tin
              </Button>
            </div>
          </div>
          <br />
        </div>
        <div className="mt-4 container-fluid">
          <h4>Thông tin cá nhân</h4>
          <div>
            <p>
              <span className="fw-bold">Họ và tên: </span> {dataUser?.full_name}
            </p>
            <p>
              <span className="fw-bold">Số điện thoại: </span> {dataUser?.phone}
            </p>
            <p>
              <span className="fw-bold">Email: </span> {dataUser?.email}
            </p>
            <p>
              <span className="fw-bold">Địa chỉ: </span>{" "}
              {dataUser?.address?.province &&
              dataUser?.address?.district &&
              dataUser?.address?.ward
                ? provinces.find(
                    (province) =>
                      province.idProvince === dataUser?.address?.province
                  )?.name +
                  ", " +
                  districts1.find(
                    (district) =>
                      district.idDistrict === dataUser?.address?.district
                  )?.name +
                  ", " +
                  dataUser?.address?.ward +
                  ", " +
                  dataUser?.address?.details
                : ""}
            </p>
          </div>
          <div className="row mt-4">
            <div className="col-3">
              <Link to={"/pay"}>
                <ColorButton3>Nạp tiền</ColorButton3>
              </Link>
            </div>
            <div className="col-3">
              <Link to={"/up-vip"}>
                <ColorButton3>Nâng VIP</ColorButton3>
              </Link>
            </div>
            <div className="col-3">
              <Link to={"/instruction"}>
                <ColorButton3>Hướng dẫn</ColorButton3>
              </Link>
            </div>
            <div className="col-3">
              <Link to={"/post"}>
                <ColorButton3>Đăng tin</ColorButton3>
              </Link>
            </div>
          </div>
          <br />
        </div>
      </Paper>
    </div>
  );
}

export default CardProfile;
