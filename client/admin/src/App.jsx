import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./App.css";

import ManagerLayout from "./component/layout/managerLayout";

import Dashbroad from "./component/page/Dashboard";
import CensorNew from "./component/page/CensorNew";
import DashboardComment from "./component/page/DashboardComment";
import DashboardAccount from "./component/page/DashboardAccount";
import DashboardFeedback from "./component/page/DashboardReport";
import DashbroadPost from "./component/page/DashboardPost";
import DashbroadNew from "./component/page/DashboardNew";
import DashboardPay from "./component/page/DashboardPay";
import DashboardType from "./component/page/DashboardType";
import DashboardReport from "./component/page/DashboardReport";
import DashboardVip from "./component/page/DashboardVip";

import Login from "./component/auth/login";
import Verify from "./component/auth/verify";
import Register from "./component/auth/register";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<ManagerLayout />}>
              <Route path="" element={<Dashbroad />} />
              <Route path="/new" element={<DashbroadNew />} />
              <Route path="/post" element={<DashbroadPost />} />
              <Route path="/comment" element={<DashboardComment />} />
              <Route path="/account" element={<DashboardAccount />} />
              <Route path="/feedback" element={<DashboardFeedback />} />
              <Route path="/pay" element={<DashboardPay />} />
              <Route path="/censor" element={<CensorNew />} />
              <Route path="/type" element={<DashboardType />} />
              <Route path="/report" element={<DashboardReport />} />
              <Route path="/vip" element={<DashboardVip />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
