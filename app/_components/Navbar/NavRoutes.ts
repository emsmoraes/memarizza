import { LuHome } from "react-icons/lu";
import { PiTreeViewDuotone } from "react-icons/pi";
import { IoSchoolOutline } from "react-icons/io5";
import { IoFileTrayFullOutline } from "react-icons/io5";

export const links = [
  {
    title: "Principal",
    url: "/",
    icon: LuHome,
  },
  {
    title: "Disciplinas",
    url: "/subjects",
    icon: IoSchoolOutline,
  },
  {
    title: "Modulos",
    url: "/modules",
    icon: PiTreeViewDuotone,
  },
  {
    title: "Sessões de estudo",
    url: "/sessions",
    icon: IoFileTrayFullOutline,
  },
];
