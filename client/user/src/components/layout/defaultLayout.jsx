import Navigation from "../navigation/header";
import Footer from "../navigation/footer";
import { Outlet } from "react-router-dom";

function DefaultLayout({ children }) {
  return (
    <div>
      <Navigation />
      <main>
        <Outlet />
      </main>
      <div
        style={{
          position: "sticky",
          top: "0",
        }}
      >
        <Footer />
      </div>
    </div>
  );
}

export default DefaultLayout;
