import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import axios from "axios";
import { useParams } from "react-router-dom";
import useScrollToTop from "../../hook/useScrollToTop";
import { z } from "zod";

// Custom marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Vietnamese localization for routing
L.Routing.Localization["vi"] = {
  directions: {
    north: "bắc",
    northEast: "bắc đông",
    east: "đông",
    southEast: "nam đông",
    south: "nam",
    southWest: "nam tây",
    west: "tây",
    northWest: "bắc tây",
  },
  instructions: {
    goStraight: "Đi thẳng",
    turnRight: "Rẽ phải",
    turnleft: "Rẽ trái",
    turnSharpRight: "Rẽ phải dốc",
    turnSharpLeft: "Rẽ trái dốc",
    uTurn: "Quay đầu",
    turnSlightRight: "Rẽ phải nhẹ",
    turnSlightLeft: "Rẽ trái nhẹ",
    rampRight: "Ramp phải",
    rampLeft: "Ramp trái",
    merge: "Merge",
    mergeLeft: "Merge trái",
    mergeRight: "Merge phải",
    enterRoundabout: "Vào vòng xoay",
    take: "Take {exitNumber} exit",
    exitRoundabout: "Rời vòng xoay",
    stayOnRoundabout: "Stay on roundabout",
    startAt: "Bắt đầu từ {waypoint}",
    arriveAt: "Đến {waypoint}",
    continue: "Tiếp tục",
    follow: "Theo {sign} {wayName}",
    followAt: "Theo {sign} {wayName} {wayName2}",
  },
  formatOrder: function (n) {
    return n + ".";
  },
  ui: {
    startPlaceholder: "Bắt đầu",
    viaPlaceholder: "Qua {viaNumber}",
    endPlaceholder: "Đích",
  },
  units: {
    meters: "m",
    kilometers: "km",
    yards: "yd",
    miles: "mi",
    hours: "giờ",
    minutes: "phút",
    seconds: "giây",
  },
  error: {
    server: "Lỗi máy chủ",
    notFound: "Không tìm thấy đường đi",
    forbidden: "Không được phép truy cập",
    unknown: "Lỗi không xác định",
  },
};

const MapComponent = () => {
  const { province, district, ward } = useParams();

  const [userCoords, setUserCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const mapRef = useRef(null);

  // Get coordinates from Nominatim API based on the provided address
  const getCoordinates = async (address) => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: `${address.ward}, ${address.district}, ${address.province}, Vietnam`,
            format: "json",
          },
        }
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return [parseFloat(lat), parseFloat(lon)];
      }
    } catch (error) {
      console.error("Error fetching coordinates: ", error);
      return null;
    }
  };

  // Get user's current location
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const userLocation = await getUserLocation();
        setUserCoords(userLocation);
        const destinationAddress = { province, district, ward };
        const destinationLocation = await getCoordinates(destinationAddress);
        setDestinationCoords(destinationLocation);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };
    fetchCoordinates();
  }, [province, district, ward]);

  useEffect(() => {
    if (userCoords && destinationCoords && !mapRef.current) {
      // Initialize the map only once
      //zoom  20.5
      mapRef.current = L.map("map").setView(userCoords, 20.5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        mapRef.current
      );
      L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);

      // Add routing control with Vietnamese localization
      L.Routing.control({
        language: "vi",

        waypoints: [
          L.latLng(userCoords[0], userCoords[1]),
          L.latLng(destinationCoords[0], destinationCoords[1]),
        ],

        lineOptions: {
          styles: [
            {
              color: "blue",
              weight: 4,
              opacity: 0.7,
            },
          ],
        },

        zoomControl: false,

        zoom: 20.5,

        //đường phụ đổi màu
        altLineOptions: {
          styles: [
            {
              color: "gray",
              weight: 4,
              opacity: 0.7,
            },
          ],
        },

        useZoomParameter: false,
        show: true,
        collapsible: true,
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: true,
      }).addTo(mapRef.current);
    }
  }, [userCoords, destinationCoords]);

  useScrollToTop();

  return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
};

export default MapComponent;
