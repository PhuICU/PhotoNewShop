import React from "react";

import {
  TextField,
  Typography,
  InputAdornment,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { red } from "@mui/material/colors";

import { GlobalOutlined } from "@ant-design/icons";

import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";

import {
  FacebookShareButton,
  EmailShareButton,
  FacebookIcon,
  EmailIcon,
} from "react-share";

function footer() {
  const onSearch = () => {
    console.log("Search");
  };
  const ColorButton1 = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    "&:hover": { backgroundColor: red[700] },
  }));

  const shareUrl = window.location.href;

  return (
    <footer
      style={{
        marginTop: "20px",
        borderTop: "1px solid #e7e7e7",
        marginBottom: "30px",

        position: "relative",
        bottom: "0",
        width: "100%",

        padding: "20px",
      }}
      className="mt-4 App-header"
    >
      <div className="container mt-4">
        <div></div>
      </div>
      <div className="row ">
        <div className="col-3 container">
          <div>
            <Typography variant="" className="fw-bold">
              Photo GUY
            </Typography>
          </div>
          <div className="mt-4">
            <Typography>
              <FmdGoodOutlinedIcon />
              Đường 3/2, quận Ninh Kiều, Tp Cần Thơ
            </Typography>
          </div>
          <div className="mt-4 d-flex justify-content-start">
            <span>
              <LocalPhoneOutlinedIcon />
              {"   "}
            </span>
            <Typography>(029) 0909 0909 - (032) 0120 2100</Typography>
          </div>
        </div>
        <div className="col-2">
          <div>
            <Typography className="fw-bold">HƯỚNG DẪN</Typography>
          </div>
          <div className="mt-2">
            <ul className="navbar-nav">
              <li className="mt-2">Về chúng tôi</li>
              <li className="mt-2">Báo giá & hỗ trợ</li>
              <li className="mt-2">Câu hỏi thường gặp</li>
              <li className="mt-2">Góp ý báo lỗi</li>
            </ul>
          </div>
        </div>
        <div className="col-3">
          <div>
            <Typography className="fw-bold">QUY ĐỊNH</Typography>
          </div>
          <div className="mt-2">
            <ul className="navbar-nav">
              <li className="mt-2">Quy định đăng tin</li>
              <li className="mt-2">Quy chế hoạt động</li>
              <li className="mt-2">Điều khoản thỏa thuận</li>
              <li className="mt-2">Chính sách bảo mật</li>
              <li className="mt-2">Giải quyết khiếu nại</li>
            </ul>
          </div>
        </div>
        <div className="col-3">
          <div>
            <Typography className="fw-bold">GỬI PHẢN HỒI</Typography>
            <TextField
              size="small"
              sx={{
                width: 260,
              }}
              label="Nhập gửi tin cho tôi"
              className="mt-2"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <ColorButton1 onClick={onSearch}>
                      <Typography variant="caption">
                        <i className="fa fa-paper-plane" aria-hidden="true"></i>
                      </Typography>
                    </ColorButton1>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="mt-4">
            <Typography className="fw-bold">QUỐC GIA & NGÔN NGỮ</Typography>
            <FormControl
              fullWidth
              sx={{
                width: 170,
              }}
              size="small"
              className="mt-2"
            >
              <InputLabel id="demo-simple-select-label">
                <GlobalOutlined />
                <span> Quốc gia</span>
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
              >
                <MenuItem value={10}>Việt Nam</MenuItem>
                <MenuItem value={20}>Singapore</MenuItem>
                <MenuItem value={30}>Malaysia</MenuItem>
                <MenuItem value={40}>ThaiLan</MenuItem>
                <MenuItem value={50}>Indonesia</MenuItem>
                <MenuItem value={60}>Australia</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <hr />
      <div className=""></div>
      <div className=" container">
        <Typography variant="caption" className="text-center">
          © 2024 PHOTOGRAPHER GUY. All rights reserved.
        </Typography>
        <div className="row mt-4">
          <div className="col-5">
            <div>
              <Typography variant="body2">
                Giấy DKKD số 1234567890 do Sở KHTĐ Cần Thơ cấp lần đầu ngày
                30/7/2024{" "}
              </Typography>
            </div>
            <div>
              <Typography variant="body2">
                Giấy phép thiết lập trang thông tin điện tử tổng hợp trên mạng
                số 191/GP-TTĐT do Sở TTTT Cần Thơ cấp ngày 30/7/2024
              </Typography>
            </div>
          </div>
          <div className="col-3">
            <Typography variant="body2">
              Quy chế, quy định giao dịch có hiệu lực từ 08/08/2028 Ghi rõ nguồn
              "PhotoGuy.com.vn" khi phát hành lại thông tin từ website này.
            </Typography>
          </div>
          <div className="col-2">
            <img
              src="https://cdn.dangkywebsitevoibocongthuong.com/wp-content/uploads/2018/06/logo.png"
              alt=""
              width="150"
            />
          </div>
          <div className="d-flex justify-content-between col-2">
            <div className="">
              <FacebookShareButton url={shareUrl}>
                <FacebookIcon size={40} round={true} />
              </FacebookShareButton>
            </div>
            <div>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_4N37TIgWC_QLpspNwGddZH8DhzljeYMFnA&s"
                alt=""
                width="40"
              />
            </div>
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/2048px-Icon_of_Zalo.svg.png"
                alt=""
                width="30"
              />
            </div>
            <div>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png"
                alt=""
                width="30"
              />
            </div>
          </div>
        </div>
      </div>
      <br />
    </footer>
  );
}

export default footer;
