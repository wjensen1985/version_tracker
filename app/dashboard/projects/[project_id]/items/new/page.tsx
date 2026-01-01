import { getCurrentUserId } from "@/app/lib/auth";
import { fetchProjectById } from "@/app/lib/data";
import { createItemAction } from "@/app/lib/actions";


export default async function NewItemPage({
  params,
}: {
  params: Promise<{ project_id: string }>;
}) {
  const { project_id } = await params;
  const projectId = Number.parseInt(project_id, 10);
  if (!Number.isInteger(projectId)) return <div className="p-6">Invalid project id.</div>;

  const userId = await getCurrentUserId();
  const project = await fetchProjectById(projectId, userId);
  if (!project) return <div className="p-6">Project not found (or no access).</div>;

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold">New item</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Create an item in <span className="font-medium">{project.name}</span>.
      </p>

      <form action={createItemAction} className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <input type="hidden" name="projectId" value={projectId} />
        <div>
          <label className="block text-sm font-medium">Item name</label>
          <input
            name="name"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="e.g. BrakeController"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Item Type</label>
          <input
            name="item_type"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            defaultValue=""
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Initial version</label>
          <input
            name="initialVersion"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            defaultValue="1.0.0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Details (optional)</label>
          <textarea
            name="details"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-mono"
            rows={5}
            placeholder='Extra Notes...'
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <a
            href={`/dashboard/projects/${projectId}`}
            className="rounded-lg border border-gray-700 px-3 py-2 text-sm font-medium hover:bg-gray-900 hover:text-white dark:border-gray-300 dark:hover:bg-gray-100 dark:hover:text-gray-900"
          >
            Cancel
          </a>
          <button
            type="submit"
            className="rounded-lg border border-gray-900 bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-900 hover:text-white dark:border-gray-200 dark:bg-white dark:text-black dark:hover:bg-gray-100 dark:hover:text-gray-900"
          >
            Create item
          </button>
        </div>
      </form>
    </div>
  );
}
