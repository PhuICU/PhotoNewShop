import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

// import socket from "./socket";

import DefaultLayout from "./components/layout/defaultLayout";

import HomePage from "./components/page/homePage";
import PostNewPage from "./components/page/postNewPage";
import ClassificationPage from "./components/page/classificationPage";
import ProfilePage from "./components/page/profilePage";
import NewPage from "./components/page/newPage";
import UpVIPPage from "./components/page/upVipPage";
import DetailNew from "./components/page/detail/detailNew";
import DetailPost from "./components/page/detail/detailPost";
import Instruction from "./components/page/instruction";
import SearchFilter from "./components/page/searchFilter";
import MapComponent from "./components/page/mapPage";
import RenewVip from "./components/page/renewVip";
import MapNearbyData from "./components/page/mapNearByData";
import Chatbot from "./components/page/chatBot";

import Login from "./components/auth/login";
import Register from "./components/auth/register";
import ForgotPassword from "./components/auth/forgotPassword";
import Verify from "./components/auth/verify";
import ResetPassword from "./components/auth/resetPassword";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function App() {
  const setDarkMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
  };

  const setLightMode = () => {
    document.querySelector("body").setAttribute("data-theme", "light");
  };

  useEffect(() => {
    if (localStorage.getItem("darkMode") === "dark") {
      setDarkMode();
    } else {
      setLightMode();
    }
  }, []);
  console.log(localStorage.getItem("darkMode"));

  // after 1 day delete all data in local storage
  useEffect(() => {
    const time = 1000 * 60 * 60 * 24;
    const timeOut = setTimeout(() => {
      localStorage.clear();
      console.log("clear local storage");
    }, time);
    return () => clearTimeout(timeOut);
  }, []);

  const queryClient = new QueryClient();

  const initialOptions = {
    clientId:
      "AdCHi7mZoynuuEHDbKJ5C7ftYCJ9qkUp7lhHjsmmY_hb4FYgLLu3Uhjh4J9wgKdMOytjXpoqxRWwrRtZ",
    currency: "USD",
    intent: "capture",
  };

  return (
    <div className="App-header">
      <QueryClientProvider client={queryClient}>
        <PayPalScriptProvider options={initialOptions}>
          <div>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-email" element={<Verify />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />

                <Route path="" element={<DefaultLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/post/new" element={<PostNewPage />} />
                  <Route
                    path="/classfication"
                    element={<ClassificationPage />}
                  />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/new" element={<NewPage />} />
                  <Route path="/up-vip" element={<UpVIPPage />} />
                  <Route path="/new/:id" element={<DetailNew />} />
                  <Route path="/post/:id" element={<DetailPost />} />
                  <Route path="/instruction" element={<Instruction />} />
                  <Route path="/search" element={<SearchFilter />} />
                  <Route
                    path="/map/:province/:district/:ward"
                    element={<MapComponent />}
                  />
                  <Route path="/map-nearby" element={<MapNearbyData />} />
                  <Route path="/renew" element={<RenewVip />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </div>
        </PayPalScriptProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
