"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

const PRIMARY = "#0C2468";

function BkashCallbackContent() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [trxID, setTrxID] = useState("");

  useEffect(() => {
    const paymentID = params.get("paymentID");
    const statusParam = params.get("status");

    if (!paymentID || statusParam === "cancel" || statusParam === "failure") {
      setStatus("failed");
      return;
    }

    api
      .post<{ data: { trxID: string } }>("/bkash/execute-payment", { paymentID })
      .then((r) => {
        setTrxID(r.data.trxID);
        setStatus("success");
      })
      .catch(() => setStatus("failed"));
  }, [params]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-sm w-full text-center flex flex-col items-center gap-4">
        {status === "loading" && (
          <>
            <Loader2 size={48} className="animate-spin text-blue-500" />
            <p className="text-slate-600 font-medium">পেমেন্ট প্রক্রিয়া হচ্ছে...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle size={44} className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">পেমেন্ট সফল!</h2>
            {trxID && <p className="text-sm text-slate-500">Transaction ID: <span className="font-mono font-semibold">{trxID}</span></p>}
            <Link href="/" className="mt-2 text-sm font-semibold underline" style={{ color: PRIMARY }}>
              হোমে ফিরে যান
            </Link>
          </>
        )}
        {status === "failed" && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
              <XCircle size={44} className="text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">পেমেন্ট ব্যর্থ হয়েছে</h2>
            <p className="text-sm text-slate-500">পেমেন্ট বাতিল বা ব্যর্থ হয়েছে। আবার চেষ্টা করুন।</p>
            <Link href="/book-service" className="mt-2 text-sm font-semibold underline" style={{ color: PRIMARY }}>
              আবার বুকিং করুন
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function BkashCallbackPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 size={48} className="animate-spin text-blue-500" /></div>}>
      <BkashCallbackContent />
    </Suspense>
  );
}
