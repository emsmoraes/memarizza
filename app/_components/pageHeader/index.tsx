"use client"
import { links } from "../Navbar/NavRoutes";
import { usePathname } from "next/navigation";

const PageHeader = () => {
  const pathname = usePathname();
  const location = pathname?.split("/")[1];

  const currentRoute = links.find((route) => route.url === `/${location}`);

  return (
    currentRoute && (
      <div className="flex w-full flex-wrap items-center justify-start gap-2 laptop:gap-0 mb-5">
        <h1 className="text-2xl font-semibold">
          {currentRoute.title}
        </h1>
      </div>
    )
  );
};

export default PageHeader;
