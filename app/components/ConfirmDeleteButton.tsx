"use client";

import { useState } from "react";

type Props = {
  label?: string;
};

export default function ConfirmDeleteButton({ label = "Delete" }: Props) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
      >
        {label}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="submit"
        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
      >
        Confirm
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-lg border px-2 py-1 text-xs hover:bg-gray-50"
      >
        Cancel
      </button>
    </div>
  );
}