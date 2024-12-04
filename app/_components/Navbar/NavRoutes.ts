import { LuCalendar, LuHome, LuSearch, LuSettings } from "react-icons/lu";
import { BsViewList } from "react-icons/bs";

export const links = [
  {
    title: "Home",
    url: "/",
    icon: LuHome,
  },
  {
    title: "Categorias",
    url: "/categories",
    icon: BsViewList,
  },
  {
    title: "Calendar",
    url: "/?hgbds",
    icon: LuCalendar,
  },
  {
    title: "Search",
    url: "/fbd",
    icon: LuSearch,
  },
  {
    title: "Settings",
    url: "/iubn",
    icon: LuSettings,
  },
];
