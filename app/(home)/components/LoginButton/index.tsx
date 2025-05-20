"use client";

import { Button } from "@/app/_components/ui/button";
import React from "react";
import { signIn } from "next-auth/react";
import { LuLogIn } from "react-icons/lu";

function LoginButton() {
  const handleLogin = () => {
    signIn();
  };

  return (
    <Button
      onClick={handleLogin}
      className="justify-start gap-3 truncate group-data-[collapsible=icon]:justify-center mt-4"
    >
      <LuLogIn className="h-8 w-8" />
      <span className="block font-medium">ENTRAR</span>
    </Button>
  );
}

export default LoginButton;
