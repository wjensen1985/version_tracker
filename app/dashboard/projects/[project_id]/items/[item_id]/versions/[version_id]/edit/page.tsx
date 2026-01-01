import { fetchItemVersionInfo } from "@/app/lib/data";
import { updateItemVersionAction } from "@/app/lib/actions";
import { getCurrentUserId } from "@/app/lib/auth";

export default async function EditVersionPage({
  params,
}: {
    params: Promise<{
    project_id: string;
    item_id: string;
    version_id: string;
  }>;
}) {

  const { project_id, item_id, version_id } = await params;

  const projectId = Number(project_id);
  const itemId = Number(item_id);
  const versionId = Number(version_id);
  
  if (
    !Number.isInteger(projectId) ||
    !Number.isInteger(itemId) ||
    !Number.isInteger(versionId)
  ) {
    throw new Error("Invalid route params");
  }

  const userId = await getCurrentUserId();

  const version = await fetchItemVersionInfo(userId, projectId, itemId, versionId);

  return (
    <main className="p-6">
      <div className="max-w-xl rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-lg font-semibold">Edit version</h1>

        <form action={updateItemVersionAction} className="mt-4 space-y-4">
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="versionId" value={versionId} />
          <input type="hidden" name="itemId" value={itemId} />
          <div>
            <label className="block text-sm font-medium">Version number</label>
            <input
              name="version_number"
              defaultValue={version.version_number}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-800 dark:focus:ring-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Details</label>
            <textarea
              name="details"
              defaultValue={version.details ?? ""}
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-800 dark:focus:ring-white"
            />
          </div>

          <div className="flex justify-end gap-2">
            <a
              href={`/dashboard/projects/${projectId}/items/${itemId}`}
              className="rounded-lg border border-gray-700 px-3 py-2 text-sm hover:bg-gray-900 hover:text-white dark:border-gray-300 dark:hover:bg-gray-100 dark:hover:text-gray-900"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="rounded-lg border border-gray-900 bg-black px-3 py-2 text-sm text-white hover:bg-gray-900 hover:text-white dark:border-gray-200 dark:bg-white dark:text-black dark:hover:bg-gray-100 dark:hover:text-gray-900"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
