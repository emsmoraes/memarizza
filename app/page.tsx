'use client'

import { signIn, useSession } from "next-auth/react";
import { Button } from "./_components/ui/button";

export default function Home() {

  const handleLogin = () => {
    signIn()
  }

  const { data } = useSession()

  return (
  <div>
    <Button onClick={handleLogin}>Clique</Button>
    {data?.user &&
    <p>{data.user.name}</p>
    }
    </div>
  );
}
