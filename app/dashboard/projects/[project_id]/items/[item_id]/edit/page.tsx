import { getCurrentUserId } from "@/app/lib/auth";
import { fetchItem } from "@/app/lib/data";
import { updateItemAction } from "@/app/lib/actions";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ project_id: string; item_id: string }>;
}) {
  const { project_id, item_id } = await params;

  const userId = await getCurrentUserId();

  const projectId = Number.parseInt(project_id, 10);
  const itemId = Number.parseInt(item_id, 10);

  if (!Number.isInteger(projectId) || !Number.isInteger(itemId)) {
    throw new Error("Invalid route params");
  }

  // Prefill + authorization
  const item = await fetchItem(userId, projectId, itemId);

  return (
    <main className="p-6">
      <div className="max-w-xl rounded-xl border bg-white p-6">
        <h1 className="text-lg font-semibold">Edit item</h1>

        <form action={updateItemAction} className="mt-4 space-y-4">
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="itemId" value={itemId} />

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              defaultValue={item.name}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Item Type</label>
            <textarea
              name="description"
              defaultValue={item.item_type ?? ""}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <a
              href={`/dashboard/projects/${projectId}`}
              className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}