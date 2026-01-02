"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


type HistoricTimestampPickerProps = {
  initialValue?: string;
};

export default function HistoricTimestampPicker({
  initialValue = "",
}: HistoricTimestampPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftValue, setDraftValue] = useState(initialValue);
  const [confirmedValue, setConfirmedValue] = useState(initialValue);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // This label is ONLY for the button text.
  const buttonLabel = useMemo(() => {
    return confirmedValue ? confirmedValue : "Select timestamp";
  }, [confirmedValue]);

  // When opening, sync draft <- confirmed, so Cancel truly discards changes.
  function open() {
    setDraftValue(confirmedValue);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  // Nice UX: ESC closes the modal.
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <div className="flex flex-col">
      <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
        Historic view (UTC)
      </label>

      <div className="relative mt-1">
        <button
          className="w-full rounded-lg border-2 border-gray-700 px-3 py-2 text-left text-sm font-medium hover:bg-gray-700 hover:text-white dark:border-gray-300 dark:hover:bg-gray-300 dark:hover:text-gray-900"
          type="button"
          onClick={open}
        >
          {buttonLabel}
        </button>
      </div>

      <input type="hidden" name="asOf" value={confirmedValue} />

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            // Click outside the panel closes
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="text-sm font-semibold">
                  Select timestamp (UTC)
                </div>

                <div className="flex gap-2">
                  <button
                    className="rounded-lg border-2 border-gray-700 px-3 py-1.5 text-xs font-medium hover:bg-gray-700 hover:text-white dark:border-gray-300 dark:hover:bg-gray-300 dark:hover:text-gray-900"
                    type="button"
                    onClick={close}
                  >
                    Cancel
                  </button>

                  <button
                    className="rounded-lg border-2 border-gray-700 px-3 py-1.5 text-xs font-medium hover:bg-gray-700 hover:text-white dark:border-gray-300 dark:hover:bg-gray-300 dark:hover:text-gray-900"
                    type="button"
                    onClick={() => {
                      // Update state so the button label stays in sync
                      setConfirmedValue(draftValue);
                      close();

                      // Update the URL query (?asOf=...) to trigger server re-render
                      const params = new URLSearchParams(searchParams.toString());

                      if (draftValue) {
                        params.set("asOf", draftValue);
                      } else {
                        params.delete("asOf");
                      }

                      const qs = params.toString();
                      router.push(qs ? `${pathname}?${qs}` : pathname);
                    }}
                  >
                    Confirm
                  </button>

                </div>
              </div>

              <input
                className="w-full rounded-lg border px-3 py-2 text-sm"
                type="datetime-local"
                step="1"
                value={draftValue}
                onChange={(event) => setDraftValue(event.target.value)}
              />

              <span className="text-xs text-gray-500">
                {draftValue ? draftValue : "Select timestamp"}
              </span>
            </div>

          </div>
        </div>
      ) : null}
    </div>
  );
}
