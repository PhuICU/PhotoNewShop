import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  Button,
} from "@mui/material";

import { red } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

import SearchIcon from "@mui/icons-material/Search";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";

import { getProperties } from "../../api/propertiesApi";
import { getProvinces, getDistricts, getWards } from "../../api/addressApi";

import { useTranslation } from "react-i18next";
import "../../utils/Language/i18n";

function FilterPost() {
  const [properties, setProperties] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const { t } = useTranslation();

  // const handleProvinceChange = (provinceId) => {
  console.log("Selected Province:", selectedProvince);
  const [searchItem, setSearchItem] = useState({
    province: "",
    district: "",
    ward: "",
    price: "",

    property: "",
    content: "",
  });
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchItem({ ...searchItem, [name]: value });
  };

  const onSearch = () => {
    localStorage.setItem("searchItem", JSON.stringify(searchItem));
    navigate("/search");
  };

  const clearSearch = () => {
    setSearchItem((prev) => ({
      ...prev,
      province: "",
      district: "",
      ward: "",
      street: "",
      price: "",

      property: "",
      content: "",
    }));

    setAddress((prev) => ({
      ...prev,
      province: "",
      district: "",
    }));

    selectedProvince("");
    selectedDistrict("");
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getProperties();
        setProperties(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchProvinces = async () => {
      try {
        const response = await getProvinces();
        setProvinces(response);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchDistricts = async () => {
      const districtsData = await getDistricts();
      // Check if districtsData is an array before filtering
      if (Array.isArray(districtsData)) {
        const data = districtsData.filter(
          (district) => district.idProvince === selectedProvince
        );
        setDistricts(data);
      } else {
        setDistricts([]);
      }
    };

    const fetchWards = async () => {
      const wardsData = await getWards();
      // Check if wardsData is an array before filtering
      if (Array.isArray(wardsData)) {
        const data = wardsData.filter(
          (ward) =>
            ward.district_id === selectedDistrict &&
            ward.province_id === selectedProvince
        );
        setWards(data);
      } else {
        setWards([]);
      }
    };

    fetchProperties();
    fetchProvinces();
    fetchDistricts();
    fetchWards();
  }, []);

  // Update searchItem when selectedProvince or selectedDistrict changes
  useEffect(() => {
    if (selectedProvince || selectedDistrict) {
      const selectedProvinceData = Array.isArray(provinces) && provinces.length > 0 
        ? provinces.find((item) => item.idProvince === selectedProvince)?.name 
        : "";
      
      const selectedDistrictData = Array.isArray(districts) && districts.length > 0 
        ? districts.find((item) => item.idDistrict === selectedDistrict)?.name 
        : "";

      setSearchItem(prev => ({
        ...prev,
        province: selectedProvinceData,
        district: selectedDistrictData,
      }));
    }
  }, [selectedProvince, selectedDistrict, provinces, districts]);

  const districtFilter = Array.isArray(districts) 
    ? districts.filter((district) => district.idProvince === selectedProvince)
    : [];

  const wardFilter = Array.isArray(wards)
    ? wards.filter((ward) => ward.idDistrict === selectedDistrict)
    : [];

  const ColorButton1 = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    "&:hover": { backgroundColor: red[700] },
  }));

  const handleProvinceChange = async (provinceId) => {
    setSelectedProvince(provinceId);
    const data = await getDistricts(provinceId);
    setDistricts(data);
  };

  const handleDistrictChange = async (districtId) => {
    setSelectedDistrict(districtId);
    const data = await getWards(districtId);
    setWards(data);
  };

  const navigate = useNavigate();

  // Create formatAddress object from current searchItem
  const formatAddress = {
    province: searchItem.province,
    district: searchItem.district,
    ward: searchItem.ward,
    street: searchItem.street,
  };
  return (
    <div
      className=" d-flex justify-content-center mt-2"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "240px",
        width: "100%",
        position: "relative",
      }}
    >
      <div className="mt-4">
        <div
          style={{
            position: "absolute",
            top: "17%",
            left: "23%",
            bottom: "17%",
            color: "white",
            textAlign: "center",
            backgroundColor: "rgba(2, 2, 0, 0.8)",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          <div className="container-fluid mt-4 d-flex justify-content-center">
            <FormControl>
              <TextField
                placeholder={t("  Tìm kiếm")}
                size="small"
                sx={{ width: "670px" }}
                variant="outlined"
                className="bg-white"
                name="content"
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <div className="dropdown col">
                      <select
                        name="property"
                        id=""
                        className="form-select"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          width: "150px",
                          backgroundColor: "rgba(0, 0, 0, 0)",
                        }}
                        onChange={handleSearchChange}
                      >
                        {searchItem.property === "" ? (
                          <option selected value="" className="">
                            <Typography variant="caption">
                              {t("Kiểu máy")}
                            </Typography>
                          </option>
                        ) : (
                          <Typography variant="caption">
                            {t(searchItem.property)}
                          </Typography>
                        )}

                        {properties?.map((item, index) => (
                          <option value={item.name} key={index}>
                            {t(item.name)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ),
                  endAdornment: (
                    <InputAdornment position="start">
                      <ColorButton1 onClick={onSearch}>
                        <Typography variant="caption">
                          <SearchIcon /> {t("Tìm kiếm")}
                        </Typography>
                      </ColorButton1>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </div>

          <div className="row mt-4 container-fluid">
            <div className="dropdown col">
              <Button
                className="dropdown-toggle text-white border border-white"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  width: "280px",
                }}
              >
                                        {searchItem.province ? (
                          <Typography variant="caption">
                            {formatAddress.province},{formatAddress.district},
                            {formatAddress.ward},{formatAddress.street}
                          </Typography>
                        ) : (
                  <Typography variant="caption">
                    {t("Trên toàn quốc")}
                  </Typography>
                )}
              </Button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <a className="dropdown-item">
                    <h4>{t("Khu vực")} </h4>
                    <form>
                      <div>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          name="province"
                          onChange={(e) => handleProvinceChange(e.target.value)}
                          // onClick={handleAddressChange}
                          value={selectedProvince}
                        >
                          <option selected>{t("Chọn tỉnh, thành phố")}</option>
                          {provinces && provinces.length > 0
                            ? provinces.map((item, index) => {
                                return (
                                  <option
                                    key={item.idProvince}
                                    value={item.idProvince}
                                  >
                                    {item.name}
                                  </option>
                                );
                              })
                            : null}
                        </select>
                      </div>
                      <br />
                      <div>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          value={selectedDistrict}
                          name="district"
                          onChange={(e) => handleDistrictChange(e.target.value)}
                          disabled={!selectedProvince}
                        >
                          <option value="" selected>
                            {t("Chọn quận, huyện")}
                          </option>
                          {districtFilter && districtFilter.length > 0
                            ? districtFilter.map((item, index) => {
                                return (
                                  <option
                                    key={item.idDistrict}
                                    value={item.idDistrict}
                                  >
                                    {item.name}
                                  </option>
                                );
                              })
                            : null}
                        </select>
                      </div>
                      <br />
                      <div>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          disabled={!selectedDistrict}
                          onClick={handleSearchChange}
                          name="ward"
                        >
                          <option value="" selected>
                            {t("Chọn phường, xã")}
                          </option>
                          {wardFilter && wardFilter.length > 0
                            ? wardFilter.map((item, index) => {
                                return (
                                  <option key={item.name} value={item.name}>
                                    {item.name}
                                  </option>
                                );
                              })
                            : null}
                        </select>
                      </div>
                      <br />
                      <div>
                        <input
                          type="text"
                          name="street"
                          className="form-control"
                          placeholder={t("Chọn địa chỉ")}
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            width: "220px",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                          }}
                          value={searchItem.street}
                          onChange={handleSearchChange}
                        />
                      </div>
                      <br />

                      <br />
                    </form>
                  </a>
                </li>
              </ul>
            </div>
            <div className="dropdown col">
              <select
                name="price"
                id=""
                className="form-select text-white text-center w-full border px-2 "
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  width: "150px",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                }}
                onChange={handleSearchChange}
              >
                {searchItem.price === "" ? (
                  <option selected value="" className="">
                    <Typography variant="caption">{t("Mức giá")}</Typography>
                  </option>
                ) : (
                  <Typography variant="caption">{searchItem.price}</Typography>
                )}

                <option className="text-dark" value="1">
                  {t("Dưới 1 triệu")}
                </option>
                <option className="text-dark" value="1-3">
                  {t("1 - 3 triệu")}
                </option>
                <option className="text-dark" value="3-5">
                  {t("3 - 5 triệu")}
                </option>
                <option className="text-dark" value="5-10">
                  {t("5 - 10 triệu")}
                </option>
                <option className="text-dark" value="10-40">
                  {t("10 - 40 triệu")}
                </option>
                <option className="text-dark" value="40-70">
                  {t("40 - 70 triệu")}
                </option>
                <option className="text-dark" value="70-100">
                  {t("70 - 100 triệu")}
                </option>
              </select>
            </div>
            <div className="col">
              <IconButton className="text-white" onClick={clearSearch}>
                <AutorenewOutlinedIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FilterPost;
