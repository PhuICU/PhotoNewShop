import React, { useState, useEffect } from "react";
import { Checkbox, Tag, Modal, Form, Input, Popconfirm } from "antd";

import {
  FormControl,
  InputAdornment,
  TextField,
  Button,
  IconButton,
  Stack,
  TablePagination,
  createSvgIcon,
} from "@mui/material";

import { green, grey } from "@mui/material/colors";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import ReportUser from "../report/reportUser";

import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";

import { Autocomplete } from "@mui/material";

import { styled } from "@mui/material/styles";

import { getAllUsers, lockAccount, unlockAccount } from "../../api/authApi";
import { getAllUserVipDetails, getAllVipUserDetails } from "../../api/vipApi";

function DashboardUser() {
  const [users, setUsers] = useState([]);
  const [vip, setVip] = useState([]);
  const [vipUsers, setVipUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchItem1, setSearchItem1] = useState("");
  const [showClearIcon, setShowClearIcon] = useState("none");
  const { search } = "search";
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [page, setPage] = useState(0); // Pagination page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

  const [accountType, setAccountType] = useState("normal");

  const onchange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setSearchItem1(event.target.value);
    setShowClearIcon(event.target.value ? "flex" : "none");
  };

  const handleClick = () => {
    setSearchTerm("");
    setSearchItem1("");
    setShowClearIcon("none");
  };

  const submitLockAccount = async (user_id) => {
    try {
      const response = await lockAccount(user_id);
      console.log(response);
      alert("Khóa tài khoản thành công");

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const submitUnlockAccount = async (user_id) => {
    try {
      const response = await unlockAccount(user_id);
      console.log(response);
      alert("Mở khóa tài khoản thành công");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredItems = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.full_name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.phone.toLowerCase().includes(term)
    );
  });

  const filteredItems1 = vipUsers.filter((user) => {
    const term = searchItem1.toLowerCase();
    return (
      user.user.full_name.toLowerCase().includes(term) ||
      user.user.email.toLowerCase().includes(term) ||
      user.package.packageName.toLowerCase().includes(term) ||
      user.start_date.toLowerCase().includes(term) ||
      user.end_date.toLowerCase().includes(term)
    );
  });

  const [form] = Form.useForm();

  const PlusIcon = createSvgIcon(
    // credit: plus icon from https://heroicons.com/
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>,
    "Plus"
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  const ColorButton1 = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(green[900]),
    fontSize: "10px",

    backgroundColor: green[900],
    "&:hover": {
      backgroundColor: green[700],
    },
  }));

  const ColorButton2 = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[400]),
    fontSize: "10px",

    backgroundColor: grey[400],
    "&:hover": {
      backgroundColor: grey[700],
    },
  }));

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getAllUsers();
      setUsers(response.data.data);
      console.log(response);
    };
    const fetchVipUsers = async () => {
      const response = await getAllUserVipDetails();
      setVipUsers(response.data.data);
      console.log(response);
    };

    const fetchVip = async () => {
      const response = await getAllVipUserDetails();
      setVip(response.data.data);
      console.log(response);
    };

    fetchVip();

    fetchVipUsers();

    fetchUsers();
  }, []);

  console.log(vip, vipUsers);

  const VisuallyHiddenInput = styled("input")({
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    width: 1,
  });
  return (
    <div className="mt-4">
      <div className="row">
        <div className="col">
          <h5>QUẢN LÝ TÀI KHOẢN</h5>
        </div>
        <div className="col">
          <ColorButton1
            variant="contained"
            color="success"
            onClick={handleOpen2}
          >
            <PlusIcon fontSize="90" />
            Thêm mới tài khoản
          </ColorButton1>
          &emsp;
          <ColorButton2 variant="contained">
            Tải xuống tài khoản PDF
          </ColorButton2>
        </div>
      </div>
      <div className="mt-4">
        <nav className="navbar navbar-expand-lg navbar-light ">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li
                className="nav-item"
                onClick={() => setAccountType("normal")}
                style={{
                  borderBottom: accountType === "normal" && "2px solid red",
                }}
              >
                Tài khoản thường
              </li>
              &emsp;
              <li
                className="nav-item"
                onClick={() => setAccountType("Vip")}
                style={{
                  borderBottom: accountType === "Vip" && "2px solid red",
                }}
              >
                Tài khoản Pro
              </li>
              &emsp;
              <li
                className="nav-item"
                onClick={() => setAccountType("Blacklist")}
                style={{
                  borderBottom: accountType === "Blacklist" && "2px solid red",
                }}
              >
                Tài khoản bị khóa
              </li>
            </ul>{" "}
          </div>
        </nav>{" "}
        <hr />
      </div>
      <div className="mt-4">
        <FormControl className={search}>
          <TextField
            size="small"
            placeholder="Tìm kiếm "
            variant="outlined"
            onChange={handleSearchChange}
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
        {accountType === "normal" ? (
          <div>
            <div>
              <h5>Tài khoản thường</h5>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <td>Tên tài khoản</td>
                  <td>Email</td>
                  <td>Số điện thoại</td>
                  <td>Trạng thái</td>
                  <td>Khóa tài khoản</td>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(
                  (user) =>
                    user.verify === "verified" && (
                      <tr key={user._id}>
                        <td>
                          <Checkbox onChange={onchange}>
                            {user.full_name}
                          </Checkbox>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>

                        <ReportUser user={user} />

                        <td>
                          <Stack alignItems="center" spacing={1}>
                            <Button
                              className="nav-link text-danger col"
                              onClick={() => submitLockAccount(user._id)}
                              aria-label="edit"
                              variant="outlined"
                              color="danger"
                            >
                              <i
                                class="fa fa-user-times"
                                aria-hidden="true"
                              ></i>
                            </Button>
                          </Stack>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        ) : accountType === "Vip" ? (
          <div>
            <div>
              <h5>Tài khoản Pro</h5>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <td>Tên tài khoản</td>
                  <td>Email</td>
                  <td>Ngày đăng ký</td>
                  <td>Ngày hết hạn</td>
                  <td>Gói Vip</td>
                  <td>Giới hạn tin đăng</td>
                  <td>Trạng thái</td>
                  <td>Khóa tài khoản</td>
                </tr>
              </thead>
              <tbody>
                {filteredItems1.map(
                  (user) =>
                    user.user.verify === "verified" && (
                      <tr key={user._id}>
                        <td>
                          <Checkbox onChange={onchange}>
                            {user.user.full_name}
                          </Checkbox>
                        </td>
                        <td>{user.user.email}</td>
                        <td>
                          {new Date(user.start_date).toLocaleDateString()}
                        </td>
                        <td>{new Date(user.end_date).toLocaleDateString()}</td>
                        <td>{user.package.packageName}</td>

                        {user.package.packageName === "Gói VIP Năm" ? (
                          <td> Không giới hạn</td>
                        ) : user.package.packageName === "Gói VIP Tháng" ? (
                          <td>
                            {
                              vip.find((item) => item.user_id === user.user._id)
                                .posting_used
                            }
                            /200
                          </td>
                        ) : user.package.packageName === "Gói VIP Tuần" ? (
                          <td>
                            {
                              vip.find((item) => item.user_id === user.user._id)
                                .posting_used
                            }
                            /50
                          </td>
                        ) : (
                          <td>
                            {
                              vip.find((item) => item.user_id === user.user._id)
                                .posting_used
                            }
                            /10
                          </td>
                        )}

                        <td>
                          <ReportUser user={user.user} />
                        </td>
                        <td>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Button
                              className="nav-link text-danger col"
                              onClick={() => submitLockAccount(user.user._id)}
                              aria-label="edit"
                              variant="outlined"
                              color="danger"
                            >
                              <i
                                class="fa fa-user-times"
                                aria-hidden="true"
                              ></i>
                            </Button>
                          </Stack>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <div>
              <h5>Tài khoản bị khóa</h5>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <td>Tên tài khoản</td>
                  <td>Email</td>
                  <td>Số điện thoại</td>
                  <td>Trạng thái</td>
                  <td>Thao tác</td>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(
                  (user) =>
                    user.verify === "locked" && (
                      <tr key={user._id}>
                        <td>
                          <Checkbox onChange={onchange}>
                            {user.full_name}
                          </Checkbox>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>
                          <Tag color="red">Đã bị khóa</Tag>
                        </td>
                        <td>
                          <Stack alignItems="center" spacing={1}>
                            <Popconfirm
                              title="Bạn có chắc chắn muốn gỡ khóa tài khoản này?"
                              onConfirm={() => submitUnlockAccount(user._id)}
                              okText="Có"
                              cancelText="Không"
                            >
                              <Button color="blue" type="link">
                                Gỡ khóa
                              </Button>
                            </Popconfirm>
                          </Stack>
                        </td>
                      </tr>
                    )
                )}
                {filteredItems1.map(
                  (user) =>
                    user.verify === "locked" && (
                      <tr key={user._id}>
                        <td>
                          <Checkbox onChange={onchange}>
                            {user.user.full_name}
                          </Checkbox>
                        </td>
                        <td>{user.user.email}</td>
                        <td>{user.user.phone}</td>
                        <td>
                          <Tag color="red">{user.status}</Tag>
                        </td>
                        <td>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Popconfirm
                              title="Bạn có chắc chắn muốn gỡ khóa tài khoản này?"
                              onConfirm={() =>
                                submitUnlockAccount(user.user._id)
                              }
                              okText="Có"
                              cancelText="Không"
                            >
                              <Button className="col" color="blue" type="link">
                                Mở khóa
                              </Button>
                            </Popconfirm>
                          </Stack>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="d-flex justify-content-center">
        {" "}
        <TablePagination
          component="div"
          count={filteredItems.length}
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

      <Modal
        title="Khóa tài khoản"
        open={open1}
        onOk={handleClose1}
        onCancel={handleClose1}
        okText="Khóa"
        cancelText="Hủy"
        okButtonProps={{ color: "error" }}
      >
        <div>
          <h5>Bạn có chắc chắn muốn khóa tài khoản này?</h5>
          <p className="text-muted">
            Khi bạn khóa tài khoản, người dùng sẽ vĩnh viễn không thể đăng tin
            mới
          </p>
        </div>
      </Modal>
      <Modal
        open={open2}
        onOk={handleClose2}
        onCancel={handleClose2}
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{ color: "success" }}
      >
        <IconButton variant="outlined">
          <OutlinedFlagIcon />
        </IconButton>
        <div>
          <h5>Thêm tài khoản mới</h5>
          <p className="text-muted">Start your 30-day free trial.</p>
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
            <Form.Item className="" label="Họ tên">
              <Input placeholder="Nhập họ tên" size="large" />
            </Form.Item>
            <Form.Item className="" label="Email">
              <Input placeholder="Nhập email" size="large" />
            </Form.Item>
            <Form.Item className="" label="Mật khẩu">
              <Input placeholder="Tạo mật khẩu" size="large" />
            </Form.Item>
            <Form.Item className="" label="Loại tài khoản">
              <Autocomplete
                id="combo-box-demo"
                size="small"
                options={[]}
                sx={{ width: 470 }}
                renderInput={(params) => (
                  <TextField {...params} label="Tài khoản cá nhân" />
                )}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
}

export default DashboardUser;
