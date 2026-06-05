"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function Error({ error }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex items-center gap-6">
        <div className="text-[24px] font-semibold text-black">500</div>

        <div className="w-px h-14 bg-gray-300" />
        <div>
          <p className="text-sm text-black">Something went wrong.</p>

          <p className="text-sm text-gray-500 mt-1">{error.message}</p>
        </div>
      </div>
    </div>
  );
}
