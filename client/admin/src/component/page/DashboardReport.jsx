import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useQueryParams from "../../hook/useQueryParams";
import instance from "../../api/instanApi";
import { Link } from "react-router-dom";
import { notification, Modal, Form, Radio, Space, Tag } from "antd";
import { Button } from "@mui/material";
import {
  FormControl,
  InputAdornment,
  TextField,
  TablePagination,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import { deleteComment } from "../../api/commentApi";
import { getReports, updateReportStatus } from "../../api/reportApi";
import { getAllUserVipDetails } from "../../api/vipApi";
import { getAllUsers } from "../../api/authApi";

function DashboardFeedback() {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [userVip, setUserVip] = useState([]);
  const [reportId, setReportId] = useState({
    report_id: "",
    status: "",
  });

  console.log(reportId);
  const [page, setPage] = useState(0); // Pagination page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  const [form] = Form.useForm();

  const { search } = "search";

  const handleChange = (e) => {
    console.log(e.target.value);
  };

  const handleClick = () => {
    console.log("Clear search");
  };

  const showClearIcon = "none";

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getReports();
        console.log(response);
        setData(response.data.data);
      } catch (error) {
        console.log("Failed to fetch data: ", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        console.log(response);
        setUsers(response.data.data);
      } catch (error) {
        console.log("Failed to fetch data: ", error);
      }
    };

    const fetchUserVip = async () => {
      try {
        const response = await getAllUserVipDetails();
        console.log(response);
        setUserVip(response.data.data);
      } catch (error) {
        console.log("Failed to fetch data: ", error);
      }
    };

    fetchUsers();
    fetchData();
    fetchUserVip();
  }, []);

  const onChangeStatus = async (e) => {
    const { value } = e.target;
    setReportId((PrevState) => ({
      ...PrevState,
      status: value,
    }));
  };

  const updateReport = async () => {
    try {
      const response = await updateReportStatus(reportId);
      console.log(response);
      notification.success({
        message: "Cập nhật trạng thái thành công",
      });
    } catch (error) {
      console.log("Failed to fetch data: ", error);
    }
  };

  const deleteCommentHandler = async (id) => {
    try {
      const response = await deleteComment(id);
      console.log(response);
      notification.success({
        message: "Xóa bình luận thành công",
      });
    } catch (error) {
      console.log("Failed to fetch data: ", error);
    }
  };

  const query = useQueryParams();
  const { data: newData, isLoading } = useQuery({
    queryKey: ["photo-news", query],
    queryFn: async () => await instance.get(`/photo-news`),
  });

  const post = newData?.data?.data?.items;

  console.log(userVip);

  return (
    <div className="mt-4">
      <h5>QUẢN LÝ BÁO CÁO </h5>
      <div className="mt-4">
        <FormControl className={search}>
          <TextField
            placeholder="Tìm kiếm"
            size="small"
            variant="outlined"
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  position="end"
                  style={{ display: showClearIcon }}
                  onClick={handleClick}
                >
                  <ClearIcon />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </div>
      <div className="mt-4">
        <div>
          <table className="table">
            <thead>
              <tr>
                <td>Loại báo cáo</td>
                <td>Khách hàng</td>
                <td>Tiêu đề đăng tin</td>
                <td>Nội dung báo cáo</td>
                <td>Thao tác</td>
              </tr>
            </thead>
            <tbody>
              {console.log(data, post)}
              {data && data.length > 0 ? (
                data.map((item) =>
                  post?.find((post) => post._id === item.report_item_id) ? (
                    <tr>
                      <td>{item.report_type}</td>
                      <td>
                        {
                          users?.find((user) => user._id === item.reported_id)
                            ?.full_name
                        }
                        {
                          userVip?.find(
                            (user) => user.user._id === item.reported_id
                          )?.user.full_name
                        }
                      </td>
                      <td>
                        {post?.find((post) => post._id === item.report_item_id)
                          ? post?.find(
                              (post) => post._id === item.report_item_id
                            )?.title
                          : "Tin đã bị xóa"}
                        {post?.find(
                          (post) => post._id === item.report_item_id
                        ) ? (
                          <Link
                            className="nav-link"
                            to={`http://localhost:5173/post/${item.report_item_id}`}
                          >
                            <p className="text-muted text-primary">Theo dõi</p>
                          </Link>
                        ) : null}
                      </td>
                      <td style={{ width: 200 }}>
                        {item.content.map((content) => (
                          <p>- {content}</p>
                        ))}
                      </td>
                      <td>
                        <div>
                          {item.status === "PENDING" ? (
                            <Button
                              type="primary"
                              color="error"
                              onClick={() => {
                                if (item.report_type === "COMMENT") {
                                  handleOpen();
                                } else {
                                  handleOpen1();
                                }
                                setReportId((PrevState) => ({
                                  ...PrevState,
                                  report_id: item._id,
                                }));
                              }}
                            >
                              Xử lý
                            </Button>
                          ) : (
                            <div>
                              <Button type="primary" color="success" disabled>
                                Đã xử lý
                              </Button>{" "}
                              <br />
                              {item.status === "UNRESOLVED" ? (
                                <Tag color="purple">Không giải quyết</Tag>
                              ) : item.status === "WARNING" ? (
                                <Tag color="orange">Cảnh báo</Tag>
                              ) : (
                                <Tag color="magenta">Gỡ bỏ bài đăng</Tag>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : null
                )
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    Chưa có phản hồi nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count}`
          }
        />
      </div>
      {console.log(reportId)}
      <Modal
        visible={open}
        onOk={updateReport}
        onCancel={handleClose}
        okText="Xác nhận"
        cancelText="Hủy"
        width={350}
      >
        <IconButton variant="outlined">
          <OutlinedFlagIcon />
        </IconButton>
        <br />
        <div className="mt-4">
          <h5>Xủ lý bình luận</h5>
          <p className="text-muted">
            Đảm bảo cung cấp thông tin chính xác và đáng tin cậy cho người dùng.
          </p>
        </div>
        <div>
          <Form
            form={form}
            name="dependencies"
            autoComplete="off"
            style={{
              maxWidth: 600,
            }}
            layout="vertical"
          >
            <Form.Item>
              <Radio.Group name="status" onChange={onChangeStatus}>
                <Space direction="vertical">
                  <Radio value={"UNRESOLVED"}>Không xử lý</Radio>
                  <Radio value={"WARNING"}>Cảnh báo</Radio>
                  <Radio
                    value={"REMOVE_POST"}
                    onClick={() => deleteCommentHandler(reportId.report_id)}
                  >
                    Gỡ bỏ bài đăng
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Modal
        visible={open1}
        onOk={updateReport}
        onCancel={handleClose1}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
        width={350}
      >
        <IconButton variant="outlined">
          <OutlinedFlagIcon />
        </IconButton>
        <br />
        <div className="mt-4">
          <h5>Xủ lý bài đăng</h5>
          <p className="text-muted">
            Đảm bảo cung cấp thông tin chính xác và đáng tin cậy cho người dùng.
          </p>
        </div>
        <div>
          <Form
            form={form}
            name="dependencies"
            autoComplete="off"
            style={{
              maxWidth: 600,
            }}
            layout="vertical"
          >
            <Form.Item>
              <Radio.Group name="status" onChange={onChangeStatus}>
                <Space direction="vertical">
                  <Radio value={"UNRESOLVED"}>Không xử lý</Radio>
                  <Radio value={"WARNING"}>Cảnh báo</Radio>
                  <Radio value={"REMOVE_POST"}>Gỡ bỏ bài đăng</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
}

export default DashboardFeedback;
