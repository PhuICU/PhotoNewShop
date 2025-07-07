import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, notification } from "antd";
import { useTranslation } from "react-i18next";
import { getProvinces, getDistricts, getWards } from "../../api/addressApi";
import { updateProfile } from "../../api/authApi";
import { CameraOutlined } from "@ant-design/icons";
import "../../utils/Language/i18n";
import { useFetchUser } from "../../hook/useFetchUser";

function editUserModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setPayloadUpdate((prev) => ({
      ...prev,
      full_name: user?.full_name,
      phone: user?.phone,
      tax_code: user?.tax_code,
      email: user?.email,
      address: user?.address,
    }));
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [districts1, setDistricts1] = useState([]);
  const [payloadUpdate, setPayloadUpdate] = useState({});
  const [infoUpdate, setInfoUpdate] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState("");
  const { data: user } = useFetchUser(); // Fetch user data using the custom hook
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <CameraOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const { t } = useTranslation();
  const handleProvinceChange = async (provinceId) => {
    setSelectedProvince(provinceId);
    const data = await getDistricts(provinceId);
    setDistricts(data);
  };

  console.log("districts", selectedProvince);

  const handleDistrictChange = async (districtId) => {
    setSelectedDistrict(districtId);
    const data = await getWards(districtId);
    setWards(data);
  };
  const districtFilter = districts.filter(
    (district) => district.idProvince === selectedProvince
  );

  const wardFilter = wards.filter(
    (ward) => ward.idDistrict === selectedDistrict
  );

  const handleUpdateProfile = () => {
    try {
      const res = updateProfile(payloadUpdate);

      console.log(res);
      notification["success"]({
        message: "Thông báo",
        description: "Cập nhật thông tin thành công",
        duration: 2,
      });
      setInfoUpdate({ _id: user._id, ...payloadUpdate });
      localStorage.setItem(
        "user",
        JSON.stringify({ _id: user._id, ...payloadUpdate })
      );
      setPayloadUpdate({});
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  console.log(infoUpdate);

  const handleAddressUserChange = (e) => {
    const { name, value } = e.target;
    setPayloadUpdate((prevValue) => ({
      ...prevValue,
      address: {
        ...prevValue.address,
        [name]: value,
      },
    }));
  };

  console.log(user);

  useEffect(() => {
    if (user) {
      setPayloadUpdate({
        full_name: user.full_name || "",
        tax_code: user.tax_code || "",
        phone: user.phone || "",
        email: user.email || "",
        address: {
          details: user.address?.details || "",
          province: user.address?.province || "",
          district: user.address?.district || "",
          ward: user.address?.ward || "",
        },
      });
      setSelectedProvince(user.address?.province || "");
      setSelectedDistrict(user.address?.district || "");
    }
    const fetchProvinces = async () => {
      const provincesData = await getProvinces();
      setProvinces(provincesData);
    };

    const fetchDistricts = async () => {
      const districtsData = await getDistricts();
      const data = districtsData?.filter(
        (district) => district.idProvince === selectedProvince
      );
      setDistricts(data);
    };

    const fetchWards = async () => {
      const wardsData = await getWards();
      const data = wardsData?.filter(
        (ward) =>
          ward.idDistrict === selectedDistrict &&
          ward.idProvince === selectedProvince
      );
      setWards(data);
    };

    const fetchDistricts1 = async () => {
      const districtsData = await getDistricts();
      setDistricts1(districtsData);
    };

    fetchDistricts1();
    fetchProvinces();
    fetchDistricts();
    fetchWards();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setPayloadUpdate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="align-self-end">
      <Button
        variant="outlined"
        className="bg-white text-dark mt-4 fw-bolder"
        onClick={handleOpen}
      >
        {t("Cập nhật thông tin")}
      </Button>
      <Modal
        open={open}
        onOk={handleUpdateProfile}
        onCancel={handleClose}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form>
          <div className="">
            <h6>Thông tin cá nhân</h6>

            <div className="row mt-4">
              <div className="col">
                <p>Họ và tên</p>
                <Form.Item>
                  <Input
                    placeholder="Họ và tên"
                    value={payloadUpdate.full_name}
                    onChange={onChange}
                    name="full_name"
                  />
                </Form.Item>
              </div>
              <div className="col">
                <p>Mã thuế cá nhân</p>
                <Form.Item>
                  <Input
                    placeholder="Mã thuế cá nhân"
                    value={payloadUpdate.tax_code}
                    name="tax_code"
                    onChange={onChange}
                  />
                </Form.Item>
                <span className="text-muted">MST gồm 10 chữ số</span>
              </div>
            </div>
          </div>
          <hr />
          <div>
            <h6>Thông tin liên hệ</h6>
            <div className=" mt-4">
              <div>
                <p>Số điện thoại</p>
                <Form.Item>
                  <Input
                    placeholder="Số điện thoại"
                    value={payloadUpdate.phone}
                    name="phone"
                    onChange={onChange}
                  />
                </Form.Item>
              </div>{" "}
              <div>
                <p>Email</p>
                <Form.Item>
                  <Input
                    placeholder="Email"
                    value={payloadUpdate.email}
                    name="email"
                    onChange={onChange}
                  />
                </Form.Item>
              </div>
              <div>
                <p className="fw-bold">Địa chỉ</p>
                <div className="container">
                  <div>
                    <p>Tỉnh/Thành phố</p>
                    <Form.Item>
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        name="province"
                        onChange={(e) => handleProvinceChange(e.target.value)}
                        onClick={handleAddressUserChange}
                        value={selectedProvince}
                      >
                        <option selected>Chọn tỉnh, thành phố</option>
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
                    </Form.Item>
                  </div>
                  <div>
                    <p>Quận/Huyện</p>
                    <Form.Item>
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        value={selectedDistrict}
                        name="district"
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        onClick={handleAddressUserChange}
                        disabled={!selectedProvince}
                      >
                        <option value="" selected>
                          Chọn quận, huyện
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
                    </Form.Item>

                    <div>
                      <p>Phường/Xã</p>
                      <Form.Item>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          disabled={!selectedDistrict}
                          name="ward"
                          onClick={handleAddressUserChange}
                        >
                          <option value="" selected>
                            Chọn phường, xã
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
                      </Form.Item>
                    </div>
                    <div>
                      <p>Địa chỉ cụ thể</p>
                      <Form.Item>
                        <Input
                          placeholder="Địa chỉ cụ thể"
                          value={payloadUpdate?.address?.details}
                          name="details"
                          onChange={handleAddressUserChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </Form>
      </Modal>
    </div>
  );
}
export default editUserModal;
