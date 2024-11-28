import React, { useEffect, useState } from "react";
import { Checkbox, Tag, Button, Popconfirm } from "antd";
import {
  FormControl,
  InputAdornment,
  TextField,
  TableRow,
  TableCell,
  Table,
  TableHead,
  TableBody,
  IconButton,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { updatePostStatus } from "../../api/photoNewApi";
import { useQuery } from "@tanstack/react-query";
import useQueryParams from "../../hook/useQueryParams";
import instance from "../../api/instanApi";
import { getProperties } from "../../api/propertiesApi";

function DashboardBrowseNew() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showClearIcon, setShowClearIcon] = useState("none");
  const { search } = "search";
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(0); // Pagination page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  const handleUpdatePostStatus = async (id, status) => {
    try {
      const res = await updatePostStatus(id, status);
      console.log(res);
      alert("Cập nhật trạng thái thành công");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setShowClearIcon(event.target.value ? "flex" : "none");
  };

  const handleClick = () => {
    setSearchTerm("");
    setShowClearIcon("none");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  const query = useQueryParams();
  const { data, isLoading } = useQuery({
    queryKey: ["photo-news", query],
    queryFn: async () => await instance.get(`/photo-news/admin/all`),
  });

  const news = data?.data?.data?.items || [];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        setProperties(response.data.data);
      } catch (error) {
        console.log("Failed to fetch data: ", error);
      }
    };
    fetchProperties();
  }, []);

  const typeArray = [
    { value: "camera", label: "Máy ảnh" },
    { value: "lens", label: "Ống kính" },
    { value: "accessory", label: "Phụ kiện" },
    { value: "camcorder", label: "Máy quay" },
  ];

  const filteredItems = news.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.contact_info.contact_name.toLowerCase().includes(term) ||
      typeArray
        .find((type) => type.value === item.type)
        ?.label.toLowerCase()
        .includes(term) ||
      item.type.toLowerCase().includes(term) ||
      item.title.toLowerCase().includes(term) ||
      properties
        .find((property) => property._id === item.property_type_id)
        ?.name.toLowerCase()
        .includes(term) ||
      "" ||
      item.contact_info.contact_email.toLowerCase().includes(term) ||
      item.price.value.toString().toLowerCase().includes(term)
    );
  });

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Paginate the filtered items
  const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="mt-4">
      <h5>DUYỆT TIN</h5>
      <div className="mt-4">
        <FormControl className={search}>
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

      <div className="mt-4">
        <div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox>Khách hàng</Checkbox>
                </TableCell>
                <TableCell>Loại tin</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Loại hình</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox>{item.contact_info.contact_name}</Checkbox>
                  </TableCell>
                  <TableCell>
                    {typeArray.find((type) => type.value === item.type)?.label}
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    {
                      properties.find(
                        (property) => property._id === item.property_type_id
                      )?.name
                    }
                  </TableCell>
                  <TableCell>
                    {formatPrice(item.price.value) + " " + item.price.unit}
                  </TableCell>
                  <TableCell>
                    {item.status === "confirmed" ? (
                      <div className="row">
                        <div className="col">
                          <Tag color="green">Đã duyệt</Tag>
                        </div>
                        <div className="col">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleUpdatePostStatus(item._id, "pending")
                            }
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                        </div>
                      </div>
                    ) : item.status === "rejected" ? (
                      <div className="row">
                        <div className="col">
                          <Tag color="red">Đã từ chối</Tag>
                        </div>
                        <div className="col">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleUpdatePostStatus(item._id, "pending")
                            }
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                        </div>
                      </div>
                    ) : (
                      <div className="row">
                        <Popconfirm
                          title="Bạn có chắc chắn muốn duyệt?"
                          onConfirm={() =>
                            handleUpdatePostStatus(item._id, "confirmed")
                          }
                          okText="Có"
                          cancelText="Không"
                        >
                          <Button className="col" color="blue" type="link">
                            Duyệt
                          </Button>
                        </Popconfirm>
                        <Popconfirm
                          title="Bạn có chắc chắn muốn từ chối?"
                          onConfirm={() =>
                            handleUpdatePostStatus(item._id, "rejected")
                          }
                          okText="Có"
                          cancelText="Không"
                        >
                          <Button className="col" type="link" danger>
                            Từ chối
                          </Button>
                        </Popconfirm>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Add Pagination */}
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
      </div>
    </div>
  );
}

export default DashboardBrowseNew;
