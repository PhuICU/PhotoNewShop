import Sidebars from "../navigation/sidebar";

import { Outlet } from "react-router-dom";

function managerLayout({ children }) {
  return (
    <div className="row">
      <div className="col-3">
        <Sidebars />
      </div>
      <div className="col-9">
        <Outlet />
      </div>
    </div>
  );
}

export default managerLayout;
