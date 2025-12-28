"use server";

import { redirect } from "next/navigation";
import { getCurrentUserId } from "./auth";
import { editItemVersion } from "./data";
import { revalidatePath } from "next/cache";

export async function updateItemVersionAction(
  formData: FormData
) {
    const userId = await getCurrentUserId();

    const projectId = Number.parseInt(String(formData.get("projectId") ?? ""), 10);
    const itemId = Number.parseInt(String(formData.get("itemId") ?? ""), 10);
    const versionId = Number.parseInt(String(formData.get("versionId") ?? ""), 10);

    if (!Number.isInteger(projectId) || !Number.isInteger(itemId) || !Number.isInteger(versionId)) {
      throw new Error("Invalid ids");
    }

    const versionNumber = String(formData.get("version_number") ?? "").trim();
    const detailsRaw = String(formData.get("details") ?? "");
    const details = detailsRaw.trim() ? detailsRaw.trim() : null;

    if (!versionNumber) {
      throw new Error("Version number is required");
    }

    await editItemVersion(
      userId,
      projectId,
      itemId,
      versionId,
      {version_number: versionNumber, details: details},
    );

    revalidatePath(`/dashboard/projects/${projectId}/items/${itemId}`);
    redirect(`/dashboard/projects/${projectId}/items/${itemId}`);
}