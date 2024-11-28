import { Tag, Typography, Row, Col, Select } from "antd";
import React, { useEffect, useState } from "react";

import { Card } from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useQuery } from "@tanstack/react-query";
import useQueryParams from "../../hook/useQueryParams";
import instance from "../../api/instanApi";

// import { getNews } from "../../api/";

import { getAllUsers } from "../../api/authApi";
import {
  getAllUserVipDetails,
  getVips,
  getAllVipUserDetails,
} from "../../api/vipApi";
import { getAllPayments } from "../../api/paymentApi";
import { getReports } from "../../api/reportApi";

function Dashbroad() {
  const [news, setNews] = useState([]);
  const [vips, setVips] = useState([]);
  const [allVip, setAllVip] = useState([]);
  const [vipsStatusData, setVipsStatusData] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [userVip, setUserVip] = useState([]);
  const [reports, setReports] = useState([]);
  const [month, setMonth] = useState(
    new Date().getMonth() + 1 < 10
      ? `0${new Date().getMonth() + 1}`
      : new Date().getMonth() + 1
  );

  const [year, setYear] = useState(
    new Date().getFullYear() < 10
      ? `0${new Date().getFullYear()}`
      : new Date().getFullYear()
  );
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filteredPosts1, setFilteredPosts1] = useState([]);
  const { Text } = Typography;

  useEffect(() => {
    // getNews().then((res) => {
    //   setNews(res.data.data);
    // });

    getAllUsers().then((res) => {
      setUsers(res.data.data);
      console.log(res);
    });

    getAllPayments().then((res) => {
      setPayments(res.data.data);
    });

    getAllUserVipDetails().then((res) => {
      setUserVip(res.data.data);
    });

    getReports().then((res) => {
      setReports(res.data.data);
    });

    getVips().then((res) => {
      setVips(res.data.data);
    });

    getAllVipUserDetails().then((res) => {
      setAllVip(res.data.data);
    });
  }, []);

  console.log(vips, allVip);

  const query = useQueryParams();

  const { data: NewData, isLoading } = useQuery({
    queryKey: ["photo-news", query],
    queryFn: async () => await instance.get("/photo-news/admin/all"),
  });

  const post = NewData?.data?.data?.items;

  console.log(users);

  useEffect(() => {
    if (year) {
      const yearPosts = post?.filter((post) => {
        const postDate = new Date(post.create_at);
        return postDate.getFullYear() === Number(year);
      });

      const monthCount = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        Tin: yearPosts?.filter(
          (post) => new Date(post.create_at).getMonth() === i
        ).length,
      }));

      setFilteredPosts1(monthCount);
    } else {
      setFilteredPosts1([]);
    }
  }, [year, post]);

  useEffect(() => {
    if (year) {
      if (month) {
        const monthPosts = post?.filter((post) => {
          const postDate = new Date(post.create_at);
          return (
            postDate.getFullYear() === Number(year) &&
            postDate.getMonth() + 1 === Number(month)
          );
        });

        const dayCount = Array.from({ length: 31 }, (_, i) => ({
          day: i + 1,

          Tin: monthPosts?.filter(
            (post) => new Date(post.create_at).getDate() === i + 1
          ).length,
        }));

        setFilteredPosts(dayCount);
      } else {
        setFilteredPosts([]);
      }
    }
  }, [year, month, post]);

  const newsStatusData = [
    {
      name: "Đang chờ duyệt",
      value: post?.filter((post) => post.status === "pending").length,
    },
    {
      name: "Đã duyệt",
      value: post?.filter((post) => post.status === "confirmed").length,
    },
    {
      name: "Từ chối",
      value: post?.filter((post) => post.status === "rejected").length,
    },
    {
      name: "Hết hạn",
      value: post?.filter((post) => post.status === "expired").length,
    },
  ];

  useEffect(() => {
    // Count users per packageId in allVip
    const packageUsageCount = allVip.reduce((acc, vipUser) => {
      const { package_id } = vipUser;
      acc[package_id] = (acc[package_id] || 0) + 1;
      return acc;
    }, {});

    // Map package counts to package names from vips
    const chartData = vips.map((vip) => ({
      name: vip.packageName,
      value: packageUsageCount[vip._id] || 0,
    }));

    setVipsStatusData(chartData);
  }, [allVip, vips]);

  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 31536000;

    return interval;
  };

  const typeArray = [
    {
      value: "camera",
      label: "Máy ảnh",
    },
    {
      value: "lens",
      label: "Ống kính",
    },
    {
      value: "accessory",
      label: "Phụ kiện",
    },
    {
      value: "camcorder",
      label: "Máy quay",
    },
  ];

  return (
    <div className="container-fluid">
      <h5 className="mt-4">Xin chào Admin</h5>
      <div className="mt-4">
        <Row gutter={20}>
          <Col>
            <Card
              sx={{
                maxWidth: 345,

                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
              }}
            >
              <p>
                SL TIN ĐĂNG{" "}
                <span className="fw-bolder">
                  ({post?.length ? post.length : 0})
                </span>{" "}
              </p>
            </Card>
          </Col>
          {console.log(post)}
          <Col>
            <Card
              sx={{
                maxWidth: 345,

                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
              }}
            >
              <p>
                SL THANH TOÁN{" "}
                <span className="fw-bolder">({payments?.length})</span>
              </p>
            </Card>
          </Col>
          <Col>
            <Card
              sx={{
                maxWidth: 345,

                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
              }}
            >
              <p>
                SL BÁO CÁO{" "}
                <span className="fw-bolder">
                  (
                  {reports?.length
                    ? reports?.filter((report) =>
                        report.status === "PENDING" ? report : null
                      ).length
                    : 0}
                  )
                </span>{" "}
              </p>

              {console.log(reports)}
            </Card>
          </Col>
          <Col>
            <Card
              sx={{
                maxWidth: 345,

                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
              }}
            >
              <p>
                SL TÀI KHOẢN{" "}
                <span className="fw-bolder">
                  ({users?.length + userVip?.length})
                </span>
              </p>
            </Card>
          </Col>
          <Col>
            <Card
              sx={{
                maxWidth: 345,

                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
              }}
            >
              <p>
                TIN CHỜ DUYỆT{" "}
                <span className="fw-bolder">
                  ({" "}
                  {post?.length
                    ? post?.filter((post) =>
                        post.status === "pending" ? post : null
                      ).length
                    : 0}
                  )
                </span>
              </p>
            </Card>
          </Col>
        </Row>
        <div className="mt-4">
          <div className="card mb-6 mb-md-0">
            <div className="card-body">
              <h5 className="mb-4 fw-bold">Biểu đồ</h5>
            </div>
            <div className="row ">
              <div className="col-6 container">
                <p
                  style={{
                    textAlign: "center",
                  }}
                  className="mb-4 fw-bold"
                >
                  Biểu đồ tin đăng
                </p>
                <PieChart width={400} height={400}>
                  <Pie
                    data={newsStatusData}
                    cx={200}
                    cy={200}
                    labelLine={false}
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {newsStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][
                            index % 4
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
              <div className="col-6 container">
                <p style={{ textAlign: "center" }} className="mb-4 fw-bold">
                  Biểu đồ gói VIP
                </p>
                <PieChart width={400} height={400}>
                  <Pie
                    data={vipsStatusData}
                    cx={200}
                    cy={200}
                    labelLine={false}
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {vipsStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][
                            index % 4
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="mt-4">
          <div className="card mb-6 mb-md-0">
            <div className="card-body">
              <p className="mb-4 fw-bold">Thống kê theo năm</p>
            </div>
            <div className="d-flex justify-content-end container">
              <Select
                showSearch
                placeholder="Chọn năm cần xem"
                optionFilterProp="label"
                onChange={(e) => setYear(e)}
                options={[
                  { label: "2021", value: "2021" },
                  { label: "2022", value: "2022" },
                  { label: "2023", value: "2023" },
                  { label: "2024", value: "2024" },
                  { label: "2025", value: "2025" },
                  { label: "2026", value: "2026" },
                  { label: "2027", value: "2027" },
                  { label: "2028", value: "2028" },
                  { label: "2029", value: "2029" },
                  { label: "2030", value: "2030" },
                ]}
              />
            </div>
            <div className="mt-4">
              {" "}
              {filteredPosts1 && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredPosts1}>
                    <XAxis
                      dataKey="month"
                      label={{
                        value: "Tháng",
                        angle: 0,
                        position: "insideBottom",
                      }}
                    />
                    <YAxis
                      label={{
                        value: "Số tin",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Tin" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="card mb-6 mb-md-0">
            <div className="card-body ">
              <div>
                <p className="mb-4 fw-bold">Thống kê theo tháng</p>
              </div>
              <div className="d-flex justify-content-end">
                <Select
                  showSearch
                  placeholder="Chọn tháng cần xem"
                  optionFilterProp="label"
                  onChange={(e) => setMonth(e)}
                  options={[
                    { label: "Tháng 1", value: "1" },
                    { label: "Tháng 2", value: "2" },
                    { label: "Tháng 3", value: "3" },
                    { label: "Tháng 4", value: "4" },
                    { label: "Tháng 5", value: "5" },
                    { label: "Tháng 6", value: "6" },
                    { label: "Tháng 7", value: "7" },
                    { label: "Tháng 8", value: "8" },
                    { label: "Tháng 9", value: "9" },
                    { label: "Tháng 10", value: "10" },
                    { label: "Tháng 11", value: "11" },
                    { label: "Tháng 12", value: "12" },
                  ]}
                />
              </div>
            </div>

            <div>
              {filteredPosts && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredPosts}>
                    <XAxis dataKey="day" />
                    <YAxis
                      label={{
                        value: "Số tin",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Tin" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6"></div>

          <div className="col-md-6">
            <div className="card mb-6 mb-md-0">
              <div className="card-body">
                <p className="mb-4 fw-bold">Khách hàng gần đây</p>
                <table className="table">
                  <thead>
                    {
                      //tạo tài khoản mới nhất

                      users?.map((user) =>
                        // chỉ hiển thị số nhỏ nhất timeSince(user.updated_at) trong array user

                        timeSince(user.updated_at) ===
                        Math.min(
                          ...users.map((user) => timeSince(user.updated_at))
                        ) ? (
                          <tr>
                            <td>
                              <Tag color="green">
                                <i class="fa fa-circle" aria-hidden="true"></i>{" "}
                                Mới nhất
                              </Tag>
                            </td>
                            <td>
                              <Text strong>{user.full_name}</Text>
                              <br />
                            </td>
                            <td>
                              <Text strong>{user.email}</Text>
                            </td>
                          </tr>
                        ) : (
                          ""
                        )
                      )
                    }
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashbroad;
