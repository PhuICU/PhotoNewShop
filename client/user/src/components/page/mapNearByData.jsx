import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button, Drawer, notification } from "antd";
import axios from "axios";
import useScrollToTop from "../../hook/useScrollToTop.js";
import useQueryParams from "../../hook/useQueryParam";
import instance from "../../api/instanApi.js";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { pink } from "@mui/material/colors";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { getProperties } from "../../api/propertiesApi.js";

const MapComponent = () => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [detail, setDetail] = useState({
    _id: "",
    title: "",
    description: "",
    price: {
      value: 0,
      unit: "VND",
    },
    contact_info: {
      contact_name: "",
      contact_phone: "",
      contact_email: "",
    },

    property_type_id: "",
    address: {
      province: "",
      district: "",
      ward: "",
    },
  });

  const [open, setOpen] = useState(false);
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const query = useQueryParams();
  const { data, isLoading } = useQuery({
    queryKey: ["photo-news", query],
    queryFn: async () => {
      const response = await axios.get(`/photo-news`);
      return response.data;
    },
  });

  const dataNew = Array.isArray(data?.data?.data?.items)
    ? data.data.data.items
    : [];

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await getProperties();
      setPropertyTypes(response.data.data);
    };

    fetchProperties();
  }, []);

  const [userCoords, setUserCoords] = useState([10.045222, 105.746857]);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setUserCoords([position.coords.latitude, position.coords.longitude]);
        });
      }
    };
    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const newMarkers = await Promise.all(
        dataNew.map(async (item) => {
          const {
            address,
            title,
            description,
            contact_info,
            price,
            _id,
            type,
          } = item;
          const { province, district, ward } = address;
          const { contact_phone } = contact_info;

          const addressString = `${ward}, ${district || ""}, ${
            province || ""
          }, Vietnam`.trim();

          console.log(addressString);

          const [lat, lon] = await getCoordinates(addressString);
          return {
            lat,
            lon,
            title,
            description,
            address,
            price,
            contact_info,
            property_type_id: item.property_type_id,
            _id,
            images: item.images,
            type,
          };
        })
      );
      const validMarkers = newMarkers.filter(
        (marker) => marker.lat && marker.lon
      );
      setMarkers(validMarkers);
    };
    if (dataNew.length > 0) {
      fetchCoordinates();
    }
  }, [dataNew]);

  const getCoordinates = async (address) => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        { params: { q: address, format: "json" } }
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return [parseFloat(lat), parseFloat(lon)];
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
    return [0, 0]; // Fallback to a default valid value
  };

  const queryClient = useQueryClient();
  const { data: favoritesData } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => instance.get(`http://localhost:5010/favorites/user`),
  });
  const likeMutation = useMutation({
    mutationFn: (data) =>
      instance.post("http://localhost:5010/favorites/create", {
        post_id: data,
      }),
  });
  const unlikeMutation = useMutation({
    mutationFn: (data) => instance.delete(`/favorites/delete/${data}`),
  });

  const favoritesPostIds = favoritesData?.data?.data?.post_ids || [];

  const handleUnFavorite = async (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    unlikeMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["favorites"]);
      },
    });
  };

  const handleFavorite = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    likeMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["favorites"]);
      },
      onError: () => {
        notification["error"]({
          message: "Thông báo",
          description: "Bạn cần đăng nhập để thực hiện chức năng này",
          duration: 2,
        });
      },
    });
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "N/A"; // Or any default value
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const typeArr = [
    {
      value: "camera",
      label: "Máy ảnh",
    },
    {
      value: "lens",
      label: "Ống kính",
    },
    {
      value: "camcorder",
      label: "Máy quay phim",
    },
    {
      value: "accessories",
      label: "Phụ kiện",
    },
  ];

  useScrollToTop();

  if (isLoading) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <div className="">
      <MapContainer
        center={userCoords}
        zoom={13}
        style={{ height: "500px", width: "1270px" }}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker
          position={userCoords}
          icon={L.icon({
            iconUrl:
              "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
            iconSize: [35, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          })}
        >
          <Popup
          //color red
          >
            Vị trí của bạn
          </Popup>
        </Marker>
        {Array.isArray(markers) &&
          markers.map(
            ({
              lat,
              lon,
              title,
              description,
              address,
              price,
              contact_info,
              property_type_id,
              type,
              images,
              _id,
            }) => (
              <Marker key={_id} position={[lat, lon]}>
                <Popup>
                  <div>
                    <h5>{title}</h5>
                    <Button
                      onClick={(e) => {
                        showDrawer();
                        setDetail({
                          title,
                          description,
                          address,
                          price,
                          contact_info,
                          _id,
                          property_type_id,
                          images,
                          type,
                        });
                      }}
                    >
                      Xem thông tin
                    </Button>
                  </div>
                </Popup>
              </Marker>
            )
          )}
      </MapContainer>{" "}
      {console.log(detail)}
      <Drawer title="Thông tin vị trí" onClose={onClose} open={open}>
        <div>
          <div>
            <div className="row mt-4">
              <div className="col-5 ">
                {detail.images &&
                  detail.images.slice(0, 1).map((image, index) => (
                    <div key={index}>
                      <img
                        src={image.url}
                        alt="image"
                        style={{
                          width: "140px",
                          height: "195px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
              </div>

              <div className="col-3 d-flex flex-row bd-highlight mb-3">
                <div>
                  {detail.images &&
                    detail.images?.slice(1, 3)?.map((image, index) => (
                      <div key={index}>
                        <img
                          src={image.url}
                          alt="image"
                          style={{
                            width: "100px",
                            height: "100px",
                            padding: "5px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ))}
                </div>
                <div>
                  {detail.images &&
                    detail.images?.slice(3, 5)?.map((image, index) => (
                      <div key={index}>
                        <img
                          src={image.url}
                          alt="image"
                          style={{
                            width: "100px",
                            height: "100px",
                            padding: "5px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
            {console.log(detail)}
          </div>
          <h3> Thông tin máy</h3>
          <h5 className="mt-4">{detail.title}</h5>
          <p>{detail.description}</p>
          <p>
            <span className="fw-bolder">Kiểu máy:</span>{" "}
            {propertyTypes.find((p) => p._id === detail.property_type_id)?.name}
          </p>
          <p>
            <span className="fw-bolder">Loại máy:</span>{" "}
            {typeArr.find((t) => t.value === detail.type)?.label}
          </p>
          <p>
            <span className="fw-bolder">Giá:</span>{" "}
            {formatPrice(detail.price?.value)}{" "}
            {detail.price?.unit === "VND" ? "VNĐ" : detail.price?.unit}
          </p>

          <p>
            {" "}
            <span className="fw-bolder">Địa chỉ: </span>
            {detail.address.province},{detail.address.district},
            {detail.address.ward}
          </p>
        </div>
        <hr />
        <div>
          {" "}
          <h3>Thông tin liên hệ:</h3>
          <p>
            <span className="fw-bolder">Người liên hệ:</span>{" "}
            {detail.contact_info?.contact_name}
          </p>
          <p>
            <span className="fw-bolder">Số điện thoại:</span>{" "}
            {localStorage.getItem("user1")
              ? detail.contact_info?.contact_phone
              : "**********" + detail.contact_info.contact_phone.slice(7, 10)}
            <br />
            <span className="fw-bolder">Email:</span>{" "}
            {localStorage.getItem("user1")
              ? detail.contact_info?.contact_email
              : "Đăng nhập để xem thông tin liên hệ"}
          </p>
        </div>
        <div className="d-flex justify-content-between">
          <div>
            <Button
              type="link"
              onClick={() => {
                window.location.href = `/post/${detail._id}`;
              }}
            >
              Xem chi tiết
            </Button>
          </div>
          <div>
            {" "}
            {favoritesPostIds.includes(detail._id) ? (
              <IconButton
                aria-label="add to favorites"
                onClick={(e) => handleUnFavorite(e, detail._id)}
              >
                <FavoriteIcon style={{ color: pink[500] }} />
              </IconButton>
            ) : (
              <IconButton
                aria-label="add to favorites"
                onClick={(e) => handleFavorite(e, detail._id)}
              >
                <FavoriteIcon />
              </IconButton>
            )}
          </div>
          <div></div>
        </div>
      </Drawer>
    </div>
  );
};

export default MapComponent;
