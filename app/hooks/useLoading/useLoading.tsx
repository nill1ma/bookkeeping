import Loading from "@/app/components/loading/loading";
import { useState } from "react";

export function useLoading() {
  const [loading, setLoading] = useState<boolean>(false);
  
  return { setLoading, Loading: loading ? Loading : null };
}