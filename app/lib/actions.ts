"use server";

import { redirect } from "next/navigation";
import { editItemVersion } from "@/app/lib/data";

export async function updateItemVersionAction(
  projectId: string,
  itemId: string,
  versionId: string,
  formData: FormData
) {
  const version_number = String(formData.get("version_number") ?? "").trim();
  const detailsRaw = String(formData.get("details") ?? "").trim();
  const details = detailsRaw.length ? detailsRaw : null;

  if (!version_number) {
    throw new Error("version_number is required");
  }

  await editItemVersion({ versionId, version_number, details });

  // Redirect back to wherever you show the version history (adjust if different)
  redirect(`/dashboard/projects/${projectId}/items/${itemId}`);
}
