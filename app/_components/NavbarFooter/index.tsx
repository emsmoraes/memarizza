"use client";
import React from "react";
import {
  SidebarFooter,
  SidebarMenuButton,
  SidebarTrigger,
} from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "next-auth/react";
import { LuLogOut } from "react-icons/lu";

function NavbarFooter() {
  const { data } = useSession();

  const user = data?.user;

  return (
    <SidebarFooter className="border-t border-border p-2">
      <SidebarMenuButton asChild className="w-full justify-center">
        <SidebarTrigger className="mb-2 hidden group-data-[collapsible=icon]:block" />
      </SidebarMenuButton>
      {user && (
        <SidebarMenuButton size="lg" className="w-full justify-start gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? ""} alt="User" />
            <AvatarFallback>{user.name![0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
          <LuLogOut className="ml-auto h-4 w-4" />
        </SidebarMenuButton>
      )}
    </SidebarFooter>
  );
}

export default NavbarFooter;
