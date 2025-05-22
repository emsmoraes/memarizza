import React, { Suspense } from "react";
import PageHeader from "../_components/pageHeader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoginButton from "./components/LoginButton";
import { GetChart, GetResume } from "./actions/analytics";
import ResumeItem from "./components/ResumeItem";
import ResumeChart from "./components/ResumeChart";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const chartRes = await GetChart();
  const chartData = await chartRes.json();

  const resumeRes = await GetResume();
  const resumeData = await resumeRes.json();

  if (!session?.user) {
    return (
      <>
        <h1 className="text-xl font-semibold">
          Faça login e tenha acesso a uma experiência de aprendizado
          personalizada, no seu ritmo e do seu jeito!
        </h1>

        <LoginButton />
      </>
    );
  }

  const Skeleton = () => (
    <div className="flex h-full flex-col">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="mt-6 min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );

  return (
    <Suspense fallback={<Skeleton />}>
      <div className="flex h-full flex-col">
        <PageHeader />

        <div className="no-scrollbar mb-5 flex items-center justify-between gap-3 overflow-x-scroll">
          {Object.entries(resumeData).map(([nome, valor]) => (
            <ResumeItem key={nome} nome={nome} valor={valor as number} />
          ))}
        </div>

        <ResumeChart data={chartData} />
      </div>
    </Suspense>
  );
}
