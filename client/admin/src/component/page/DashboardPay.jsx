import React, { useState, useEffect } from "react";
import { Checkbox, Tag, Modal } from "antd";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

import { amber, grey } from "@mui/material/colors";
import {
  FormControl,
  InputAdornment,
  TablePagination,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import { getAllPayments } from "../../api/paymentApi";

import Invoice from "../invoice/invoice";

function DashboardPay() {
  const [paymentData, setPaymentData] = useState([]);

  const [showClearIcon, setShowClearIcon] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0); // Pagination page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [selectItem, setSelectItem] = useState({});

  const onchange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPayments();
        setPaymentData(response.data.data);
      } catch (error) {
        console.log("Failed to fetch data: ", error);
      }
    };

    fetchData();
  }, []);

  const ColorButton1 = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(amber[500]),
    fontSize: "10px",
    backgroundColor: amber[500],
    "&:hover": {
      backgroundColor: amber[700],
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setShowClearIcon(event.target.value ? "flex" : "none");
  };

  const handleClick = () => {
    setSearchTerm("");
    setShowClearIcon("none");
  };

  const filteredItems = paymentData.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item._id.toLowerCase().includes(term) ||
      item.user.full_name.toLowerCase().includes(term) ||
      item.payment_method.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term) ||
      item.amount.toString().toLowerCase().includes(term)
    );
  });

  const sumPayment = paymentData.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between container">
        <h5>QUẢN LÝ THANH TOÁN</h5>
        <div>
          <ColorButton2
            variant="contained"
            onClick={() => {
              handleOpen();
            }}
          >
            Tải xuống PDF
          </ColorButton2>
        </div>
      </div>
      <div className="mt-4">
        <FormControl>
          <TextField
            placeholder="Tìm kiếm"
            size="small"
            variant="outlined"
            value={searchTerm}
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

      <hr />
      <div className="mt-4">
        <div>
          <table className="table">
            <thead>
              <tr>
                <td>Mã giao dịch</td>
                <td>Tên khách hàng</td>
                <td>Ngày giao dịch</td>
                <td>Tên gói Vip</td>
                <td>Giá tiền</td>
                <td>Trạng thái </td>
              </tr>
            </thead>
            {console.log(filteredItems)}
            <tbody>
              {filteredItems && filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <Checkbox onChange={onchange}>{item._id}</Checkbox>
                    </td>
                    <td>{item.user.full_name}</td>
                    <td>{new Date(item.payment_date).toLocaleDateString()}</td>
                    <td>
                      {" "}
                      {item.package
                        ? item.package.packageName
                        : "Gói đã bị xóa"}
                    </td>

                    <td>
                      {item.amount.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>
                      {item.package ? (
                        <Tag color="green"> Đã thanh toán</Tag>
                      ) : (
                        <Tag color="red">Đã thanh toán</Tag>
                      )}
                      {/* <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          handleOpen();
                          setSelectItem(item);
                        }}
                      >
                        Xem hóa đơn
                      </Button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>{" "}
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
          <hr />
          <div className="d-flex justify-content-between container mt-4">
            <div>
              <p className="fw-bold">Tổng tiền:</p>
            </div>
            <div
              className=""
              style={{
                paddingRight: "20px",
              }}
            >
              {sumPayment.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              })}
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Xem hóa đơn"
        visible={open}
        onCancel={handleClose}
        width={550}
      >
        <Invoice item={paymentData} />
      </Modal>
    </div>
  );
}

export default DashboardPay;
