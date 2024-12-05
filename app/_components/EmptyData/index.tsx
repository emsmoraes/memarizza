import React from "react";
import Empty from "../../../public/empty.svg";
import Image from "next/image";

function EmptyData() {
  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center">
        <h3 className="mb-10 text-center text-xl">
          Não encontramos nada por aqui
        </h3>

        <Image
          src={Empty}
          alt="Empty state"
          className="w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg"
          width={500}
          height={300}
          objectFit="contain"
        />
      </div>
    </div>
  );
}

export default EmptyData;
