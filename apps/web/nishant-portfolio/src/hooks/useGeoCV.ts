import { useState, useCallback } from "react";

async function detectRegion(): Promise<"india" | "eu"> {
  try {
    const res = await fetch("https://api.country.is/", { signal: AbortSignal.timeout(3000) });
    const { country } = await res.json() as { country: string };
    return country === "IN" ? "india" : "eu";
  } catch {
    return "eu"; // fallback to EU if detection fails
  }
}

export function useGeoCV() {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const downloadCV = useCallback(async () => {
    setStatus("loading");
    const region = await detectRegion();
    const file   = region === "india" ? "/cv-india.pdf" : "/cv-eu.pdf";
    const name   = region === "india" ? "Nishant_Chaudhary_CV.pdf" : "Nishant_Chaudhary_CV_EU.pdf";

    const a = document.createElement("a");
    a.href     = file;
    a.download = name;
    a.click();
    setStatus("done");

    setTimeout(() => setStatus("idle"), 2000);
  }, []);

  return { downloadCV, status };
}
