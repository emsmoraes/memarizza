"use client";

import { Button } from "@/app/_components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { FiArrowLeft } from "react-icons/fi";

function ModulePageHeader({ moduleName }: { moduleName: string }) {
  const router = useRouter();

  const handleNavigate = () => {
    router.back();
  };

  return (
    <div className="mb-5 flex items-center gap-3">
      <Button size={"icon"} onClick={handleNavigate}>
        <FiArrowLeft className="cursor-pointer" />
      </Button>
      <h1 className="text-2xl font-semibold">{moduleName}</h1>
    </div>
  );
}

export default ModulePageHeader;
