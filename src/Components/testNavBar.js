import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarData } from "./SideBarData";
import "./testNavbar.css";
import { IconContext } from "react-icons";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";

export default function TestNavBar() {
  const { isAuthenticated } = useAuth0();
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div>
          <div className="navbar">
            <Link to="#" className="menu-bars"></Link>
            <FaIcons.FaBars onClick={showSidebar} />{" "}
            <div className="navbar-logout">
              {isAuthenticated ? (
                <div className="navbar-logout-icon">
                  <LogoutButton />
                  Logout
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}
