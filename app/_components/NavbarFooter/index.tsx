"use client";
import React from "react";
import {
  SidebarFooter,
  SidebarMenuButton,
  SidebarTrigger,
} from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "next-auth/react";
import { LuLogIn, LuLogOut } from "react-icons/lu";
import { signOut, signIn } from "next-auth/react";

function NavbarFooter() {
  const { data } = useSession();

  const user = data?.user;

  const handleLogout = () => {
    signOut();
  };

  const handleLogin = () => {
    signIn();
  };

  return (
    <SidebarFooter className="border-t border-border p-2">
      <SidebarMenuButton asChild className="w-full justify-center">
        <SidebarTrigger className="mb-2 hidden group-data-[collapsible=icon]:block" />
      </SidebarMenuButton>
      {user ? (
        <SidebarMenuButton
          onClick={handleLogout}
          size="lg"
          className="w-full justify-start gap-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? ""} alt="User" />
            <AvatarFallback>{user.name![0]}</AvatarFallback>
          </Avatar>
          <div className="flex w-full flex-col items-start truncate text-left group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium">{user.name}</span>
            <span className="w-full truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
          <LuLogOut className="ml-auto h-4 w-4 group-data-[collapsible=icon]:ml-0" />
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton
          onClick={handleLogin}
          size="lg"
          className="w-full justify-start gap-2 truncate group-data-[collapsible=icon]:justify-center"
        >
          <LuLogIn className="h-8 w-8" />
          <div className="flex flex-col items-start text-left group-data-[collapsible=icon]:hidden">
            <span className="block font-medium">ENTRAR</span>
            <span className="block truncate text-xs">
              Entre para começar os estudos
            </span>
          </div>
        </SidebarMenuButton>
      )}
    </SidebarFooter>
  );
}

export default NavbarFooter;
