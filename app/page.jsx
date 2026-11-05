import { Suspense } from "react";
import Home from "@/components/Home";
export default function Page() {
  return (
    <Suspense
      fallback={
        <p className="p-8 text-center text-amber-900">গানের খাতা খুলছে…</p>
      }
    >
      <Home />
    </Suspense>
  );
}
