import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/app/_components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo.png";
import { links } from "./NavRoutes";
import NavbarFooter from "../NavbarFooter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoginSvg from "../../../public/login.svg";

async function Desktop() {
  const session = await getServerSession(authOptions);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border px-2 py-4">
        <div className="flex items-center justify-between">
          <Image
            src={Logo}
            alt="Logo"
            width={30}
            height={30}
            className="rounded-md"
          />
          <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {session?.user ? (
          <SidebarGroup>
            <SidebarGroupLabel>Maristudy</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {links.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <div className="flex flex-col items-center justify-center mt-10 group-data-[collapsible=icon]:hidden">
            <Image src={LoginSvg} alt="Login image" width={180}/>
            <h2 className="text-xl mt-6 w-[90%] text-center">Entre para começar os estudos!</h2>
          </div>
        )}
      </SidebarContent>

      <NavbarFooter />
    </Sidebar>
  );
}

export default Desktop;
