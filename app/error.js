"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function Error({ error, unstable_retry }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error.message);
  }, [error]);

  return (
    <div>
      <h2>{error.message}</h2>
      <button
        onClick={
          // Attempt to recover by re-fetching and re-rendering the segment
          () => unstable_retry()
        }
      >
        Try again
      </button>
    </div>
  );
}
