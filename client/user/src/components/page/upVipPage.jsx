import { useState, useEffect } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import {
  Box,
  Button,
  Grid,
  Radio,
  FormControl,
  NativeSelect,
  InputLabel,
  Typography,
} from "@mui/material";

import { Row, Col, Card, Tag, Modal, notification } from "antd";

import { grey } from "@mui/material/colors";

import { styled } from "@mui/material/styles";

import { getVips, deleteVipById } from "../../api/vipApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import instance from "../../api/instanApi";
import { Link, useNavigate } from "react-router-dom";

function UpVIPPage() {
  const [vip, setVip] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedVip, setSelectedVip] = useState({
    _id: "",
    packageName: "",
    description: "",
    price: 0,
    duration: "",
    discount: {
      discountPercentage: 0,
      discountAmount: 0,
      conditions: "",
    },
    status: "",
    features: [],
    specialBenefits: [],
    currency: "",
    vip_score: 0,
    priviLeges: {
      postingLimit: {
        totalPost: 0,
        durationPerPost: 0,
      },
      commentPrivileges: {
        canComment: true,
        commentLimit: 0,
      },
      trendingPrivileges: {
        canTrend: true,
        trendingLimit: 0,
      },
    },
  });

  const [payment, setPayment] = useState({
    is_paid: false,
    package_id: "",
    payment_method: "paypal",
    amount: 0,
    currency: "",
    payment_date: new Date().toISOString(),
  });

  const [open1, setOpen1] = useState(false);
  const showModal1 = () => {
    setOpen1(true);
  };
  const handleClose1 = () => {
    setOpen1(false);
  };

  useEffect(() => {
    const vipChoosed = vip.find((item) => item._id === selectedPackage?._id);
    if (vipChoosed) {
      setSelectedPackage(vipChoosed);
      setPayment({
        ...payment,
        package_id: vipChoosed._id,
        amount: vipChoosed.price - vipChoosed.discount.discountAmount,
        currency: "VND",
      });
      localStorage.setItem("selectedPackage", JSON.stringify(vipChoosed));
    }
  }, [selectedPackage, vip]);
  const { data: vipSelectedData, isLoading } = useQuery({
    queryKey: ["selectedVip", selectedPackage?._id],
    queryFn: () =>
      instance.get(
        `http://localhost:5010/vip-packages/${selectedPackage?._id}`
      ),
    enabled: !!selectedPackage?._id,
  });
  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[800]),
    backgroundColor: grey[800],
    "&:hover": {
      backgroundColor: grey[900],
    },
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVip({ ...vip, [name]: value });
  };
  const navigate = useNavigate();
  const handlePayment = (e) => {
    const { name, value } = e.target;
    setPayment({ ...payment, [name]: value });
  };

  const createOrder = async () => {
    const packageVip = localStorage.getItem("selectedPackage");
    const parstData = JSON.parse(packageVip);
    const response = await fetch("http://localhost:5010/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // use the "body" param to optionally pass additional order information
      // like product ids and quantities
      body: JSON.stringify({
        _id: parstData._id,
        name: parstData.packageName,
        price: parstData.price - parstData.discount.discountAmount,
      }),
    });

    const orderData = await response.json();

    if (orderData.id) {
      return orderData.id;
    }
  };

  const deleteVipMutation = useMutation({
    mutationFn: (id) => deleteVipById(id),
  });

  const handleDeleteVip = (id) => {
    deleteVipMutation.mutate(id, {
      onSuccess: (data) => {},
      onError: (error) => {
        console.log("Delete vip failed: ", error);
      },
    });
  };

  const createPaymentMutation = useMutation({
    mutationFn: (data) =>
      instance.post("http://localhost:5010/payments/create", data),
  });

  const handleCreatePayment = (payment) => {
    createPaymentMutation.mutate(payment, {
      onSuccess: (data) => {
        notification["success"]({
          message: "Thông báo",
          description: "Mua vip thành công",
          duration: 2,
        });
        console.log("Create payment success: ", data);
      },
      onError: (error) => {
        console.log("Create payment failed: ", error);
      },
    });
  };
  const onApprove = async (data, actions) => {
    const packageVip = localStorage.getItem("selectedPackage");
    const parstData = JSON.parse(packageVip);
    const paymentOrder = {
      is_paid: true,
      package_id: parstData._id,
      payment_method: "paypal",
      amount: parstData.price - parstData.discount.discountAmount,
      currency: "VND",
      payment_date: new Date().toISOString(),
    };
    return fetch(`http://localhost:5010/api/orders/${data.orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderID: data.orderID,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        handleDeleteVip(parstData._id);
        console.log("Chi tết thanh toán", data);
        handleCreatePayment(paymentOrder);
      });
  };
  // console.log("Payment: ", payment);

  useEffect(() => {
    const fetchVips = async () => {
      try {
        const response = await getVips();
        setVip(response?.data?.data || []);
      } catch (error) {
        console.log("Failed to fetch vips: ", error);
      }
    };

    fetchVips();
  }, []);

  const typeArr = [
    {
      duration: "1 day",
      label: "mỗi ngày",
      label2: "1 ngày",
    },
    {
      duration: "1 week",
      label: "mỗi tuần",
      label2: "1 tuần",
    },
    {
      duration: "1 month",
      label: "mỗi tháng",
      label2: "1 tháng",
    },
    {
      duration: "1 year",
      label: "mỗi năm",
      label2: "1 năm",
    },
  ];

  const selectVip = (id, duration, price, packageName, discount) => {
    setSelectedVip({ id, duration, price, packageName, discount });
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="container">
      <h1>Tài khoản VIP</h1>
      <div>
        <p>
          Tài khoản Pro là tài khoản cao cấp dành cho nhà môi giới chuyên
          nghiệp, cung cấp tính năng đăng và quản lý tin nâng cao giúp bạn tăng
          hiệu suất và tiết kiệm thời gian đăng tin. Tài khoản Pro cũng cung cấp
          cho bạn các thông tin về thị trường, báo cáo phân tích hiệu quả tin
          đăng.
        </p>
      </div>
      <div>
        <h3>Ưu điểm của tài khoản Pro</h3>
        <ul>
          <li>Đăng tin không giới hạn</li>
          <li>Hiển thị tin đăng nổi bật</li>
          <li>Thống kê hiệu quả tin đăng</li>
          <li>Chăm sóc khách hàng 24/7</li>
        </ul>
      </div>
      <Grid item xs={12} sm={4}>
        <Box sx={{ bgcolor: "text.disabled", color: "background.paper", p: 2 }}>
          <Row gutter={16}>
            {vip.length > 0 ? (
              vip?.map((item) => (
                <Col key={item._id} span={8}>
                  <Card
                    className="d-flex justify-content-center mt-4"
                    style={{ width: 300, height: 580 }}
                  >
                    <div>
                      {item.duration === "1 week" ? (
                        <Box sx={{ color: "success.main" }}>
                          <h3 className="text-center">{item.packageName}</h3>
                        </Box>
                      ) : item.duration === "1 month" ? (
                        <Box sx={{ color: "warning.main" }}>
                          <h3 className="text-center">{item.packageName}</h3>
                        </Box>
                      ) : (
                        <Box sx={{ color: "error.main" }}>
                          <h3 className="text-center">{item.packageName}</h3>
                        </Box>
                      )}

                      <p className=" text-center">Các tính năng cơ bản</p>

                      <h3 className="mt-4 text-center">
                        {formatPrice(item.price)} {item.currency}
                      </h3>
                      <ul className="navbar-nav ">
                        <li className="text-center">
                          {
                            typeArr.find(
                              (type) => type.duration === item.duration
                            )?.label
                          }
                        </li>
                        <li className="text-center">(Không bao gồm VAT)</li>
                      </ul>
                      <div className="d-flex justify-content-center mt-4">
                        <ColorButton
                          sx={{ width: 200 }}
                          onClick={() => {
                            setSelectedPackage(item);
                          }}
                          id={item._id}
                          value={item._id}
                          data-bs-toggle="modal"
                          data-bs-target=".bd-example-modal-lg"
                        >
                          Mua
                        </ColorButton>
                      </div>
                      <div className="d-flex justify-content-center">
                        <Button
                          onClick={() => {
                            setSelectedVip(item);
                            showModal1();
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                    <hr />
                    <div>
                      <Typography variant="subtitle2" className="text-center">
                        {item.description}
                      </Typography>
                      {item?.features?.map((feature, index) => (
                        <p key={index} className="text-center">
                          {feature}
                        </p>
                      ))}
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <div>
                <h2>Không có gói VIP nào</h2>
              </div>
            )}
          </Row>
        </Box>
      </Grid>

      <div
        className="modal fade bd-example-modal-lg"
        id="exampleModal1"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Đăng ký tài khoản VIP
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Bạn đang chọn gói </p>
              <div className="container-fluid">
                {selectedPackage?.duration === "1 week" ? (
                  <Box sx={{ color: "success.main" }}>
                    <h5>{selectedPackage.packageName}</h5>
                  </Box>
                ) : selectedPackage?.duration === "1 month" ? (
                  <Box sx={{ color: "warning.main" }}>
                    <h5>{selectedPackage.packageName}</h5>
                  </Box>
                ) : (
                  <Box sx={{ color: "error.main" }}>
                    <h5>{selectedPackage?.packageName}</h5>
                  </Box>
                )}
              </div>
              <p>Thời lượng</p>
              <div>
                <Row gutter={16}>
                  {vip.length > 0 ? (
                    vip?.map((item) => (
                      <Col
                        key={item._id}
                        className="d-flex justify-content-center"
                      >
                        <Card className="mt-4">
                          <div className="row container-fluid">
                            <div className="col-10">
                              <nav className="navbar navbar-expand-lg navbar-light">
                                <ul className="navbar-nav">
                                  <li className="nav-item">
                                    <p className="fw-bolder">
                                      {
                                        typeArr.find(
                                          (type) =>
                                            type.duration === item.duration
                                        )?.label2
                                      }
                                    </p>
                                  </li>
                                  &emsp;
                                  <li className="nav-item">
                                    {item.duration === "1 month" ? (
                                      <Tag color="#87d068">
                                        {item.discount?.discountPercentage}%
                                      </Tag>
                                    ) : item.duration === "1 year" ? (
                                      <Tag color="#f50">
                                        {item.discount?.discountPercentage}%
                                      </Tag>
                                    ) : item.duration === "" ? (
                                      <Tag></Tag>
                                    ) : (
                                      <Tag color="#2db7f5">
                                        {item.discount?.discountPercentage}%
                                      </Tag>
                                    )}
                                  </li>
                                </ul>
                              </nav>
                            </div>
                            <div className="col-2">
                              <Radio
                                checked={selectedPackage?._id === item._id}
                                onChange={() => setSelectedPackage(item)}
                              />
                            </div>
                          </div>
                          <p className="text-muted">
                            {formatPrice(item.price)} {item.currency}
                          </p>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <div>
                      <h2 className="text-center">Không có gói VIP nào</h2>
                    </div>
                  )}
                </Row>
              </div>{" "}
              <Box sx={{ minWidth: 120 }} className="mt-4">
                <FormControl fullWidth>
                  <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    Phương thức thanh toán
                  </InputLabel>
                  <NativeSelect
                    defaultValue={30}
                    inputProps={{
                      name: "payment_method",
                      id: "uncontrolled-native",
                    }}
                    sx={{ width: 100 }}
                    onChange={(e) =>
                      setPayment({
                        ...payment,
                        payment_method: e.target.value,
                      })
                    }
                  >
                    <option value="paypal">PayPal</option>
                    <option value="vnpay">VNPay</option>
                    <option value="momo">Momo</option>
                  </NativeSelect>
                </FormControl>
              </Box>
              <p className="mt-4">Chi tiết thanh toán</p>
              <div>
                <Card>
                  <div className="row">
                    <div className="col">Bạn trả:</div>
                    <div className="col-3">
                      {" "}
                      {(
                        selectedPackage?.price -
                        selectedPackage?.discount?.discountAmount
                      ).toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </div>
                  </div>
                  <hr />
                  <div>
                    {selectedPackage?.duration === "1 week" ? (
                      <li>- Mỗi tuần tương đương 7 ngày</li>
                    ) : selectedPackage?.duration === "1 month" ? (
                      <li>- Mỗi tháng tương đương 30 ngày</li>
                    ) : selectedPackage?.duration === "1 day" ? (
                      <li>- Mỗi ngày tương đương 1 ngày</li>
                    ) : (
                      <li>- Mỗi năm tương đương 365 ngày</li>
                    )}
                    <li>- Hệ thống sẽ tính phí ngay tại thời điểm đăng ký.</li>
                    <li>
                      - Gói dịch vụ sẽ được tự động gia hạn vào cuối kì. Sau khi
                      đăng ký, bạn có thể tắt chế độ tự động nếu không có nhu
                      cầu.
                    </li>
                  </div>
                </Card>
              </div>
              <div className="modal-footer">
                <Button type="button" className="" data-bs-dismiss="modal">
                  Hủy
                </Button>
                <PayPalButtons
                  createOrder={(data, actions) => createOrder(data, actions)}
                  onApprove={(data, actions) => onApprove(data, actions)}
                ></PayPalButtons>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open1}
        onClose={handleClose1}
        footer={
          <Button type="primary" onClick={handleClose1}>
            Đóng
          </Button>
        }
      >
        {" "}
        <Typography variant="button" gutterBottom sx={{ display: "block" }}>
          Thông tin chi tiết
        </Typography>
        <hr />
        <p className="fw-bolder">{selectedVip?.description}</p>
        <ul>
          {selectedVip?.features?.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <p className="container text-center">
          Giá gói:{" "}
          <span className="fw-bolder">
            {formatPrice(selectedVip?.price)} {selectedVip?.currency}
          </span>
        </p>
        <p className="container text-center">
          Thời gian:{" "}
          <span className="fw-bolder">
            {
              typeArr.find((type) => type.duration === selectedVip?.duration)
                ?.label2
            }
          </span>
        </p>
        <p className="container text-center">
          Số tin đăng tối đa:{" "}
          <span className="fw-bolder">
            {" "}
            {selectedVip?.priviLeges?.postingLimit?.totalPost}
          </span>
        </p>
        <p className="container text-center">
          Số bình luận tối đa:{" "}
          <span className="fw-bolder">
            {" "}
            {selectedVip?.priviLeges?.commentPrivileges?.commentLimit}
          </span>
        </p>
      </Modal>
    </div>
  );
}

export default UpVIPPage;
