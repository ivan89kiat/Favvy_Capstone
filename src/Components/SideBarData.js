import React from "react";
import * as AiIcons from "react-icons/ai";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <AiIcons.AiOutlineHome />,
    cName: "nav-text",
  },
  {
    title: "Transaction",
    path: "/history",
    icon: <AiIcons.AiOutlineHistory />,
    cName: "nav-text",
  },
  {
    title: "Budget",
    path: "/budget",
    icon: <AiIcons.AiOutlineWallet />,
    cName: "nav-text",
  },
  {
    title: "Investment",
    path: "/investment",
    icon: <AiIcons.AiOutlineLineChart />,
    cName: "nav-text",
  },
  {
    title: "Debt Management",
    path: "/loan",
    icon: <AiIcons.AiOutlineCreditCard />,
    cName: "nav-text",
  },
  {
    title: "Profile",
    path: "/profile",
    icon: <AiIcons.AiOutlineProfile />,
    cName: "nav-text",
  },
];
