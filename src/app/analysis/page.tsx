'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LoadingScreen from "@/components/analysis/loading-screen";
import DashboardAnalysis from "@/components/analysis/dashboard/detailed-analysis";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [projectData, setProjectData] = useState({});
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const router = useRouter();

  useEffect(() => {
    const savedProjectData = sessionStorage.getItem(`kumpas-session-${sessionId}`);
    if (savedProjectData) {
      const parsedData = JSON.parse(savedProjectData);
      setProjectData(parsedData);
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <>
      { isLoading 
        ? <LoadingScreen finishLoading={() => setIsLoading(false)} /> 
        : <DashboardAnalysis data={projectData} /> }
    </>
  );
}