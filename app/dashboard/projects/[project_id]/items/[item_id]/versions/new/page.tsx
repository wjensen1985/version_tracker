import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getCurrentUserId } from "@/app/lib/auth";
import { fetchItemWithVersions, updateItemVersion } from "@/app/lib/data";

export default async function NewVersionPage({
  params,
}: {
  params: Promise<{ project_id: string; item_id: string }>;
}) {
  const { project_id, item_id } = await params;

  const projectId = Number.parseInt(project_id, 10);
  const itemId = Number.parseInt(item_id, 10);

  if (!Number.isInteger(projectId) || !Number.isInteger(itemId)) {
    return <div className="p-6">Invalid route params.</div>;
  }

  const userId = await getCurrentUserId();

  // Use your secure helper so this page is protected
  const itemData = await fetchItemWithVersions(projectId, itemId, userId);
  if (!itemData) {
    return <div className="p-6">Item not found (or you don’t have access).</div>;
  }

  async function createNewVersionAction(formData: FormData) {
    "use server";

    const userId = await getCurrentUserId();

    const newVersion = String(formData.get("version_number") ?? "").trim();
    const detailsRaw = String(formData.get("details") ?? "");
    const details = detailsRaw.trim() ? detailsRaw.trim() : null;

    // Basic validation (keep it simple for now)
    if (!newVersion) {
      throw new Error("Version number is required.");
    }

    await updateItemVersion(projectId, itemId, userId, newVersion, details);

    // ensure item page + project dashboard refresh after mutation
    revalidatePath(`/dashboard/projects/${projectId}`);
    revalidatePath(`/dashboard/projects/${projectId}/items/${itemId}`);

    // back to item history page
    redirect(`/dashboard/projects/${projectId}/items/${itemId}`);
  }

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">New version</h1>
        <p className="mt-1 text-sm text-gray-600">
          For <span className="font-medium">{itemData.item.name}</span>
        </p>
      </div>

      <form action={createNewVersionAction} className="rounded-xl border bg-white p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">Version number</label>
          <input
            name="version_number"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="e.g. 1.0.1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Details (optional)</label>
          <textarea
            name="details"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            rows={5}
            placeholder="What changed in this version?"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/dashboard/projects/${projectId}/items/${itemId}`}
            className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Create version
          </button>
        </div>
      </form>
    </div>
  );
}