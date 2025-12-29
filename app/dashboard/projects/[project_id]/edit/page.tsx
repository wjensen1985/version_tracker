import { getCurrentUserId } from "@/app/lib/auth";
import { fetchProjectById } from "@/app/lib/data";
import { updateProjectAction } from "@/app/lib/actions";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ project_id: string }>;
}) {
  const userId = await getCurrentUserId();
  const { project_id } = await params;
  
  const projectId = Number.parseInt(project_id, 10);
  console.log(`Value: ${projectId}, Type: ${typeof projectId}`);
  if (!Number.isInteger(projectId)) {
    throw new Error("Invalid project id");
  }

  // Prefill form (and also doubles as an authorization check)
  const project = await fetchProjectById(projectId, userId);

  return (
    <main className="p-6">
      <div className="max-w-xl rounded-xl border bg-white p-6">
        <h1 className="text-lg font-semibold">Edit project</h1>

        <form action={updateProjectAction} className="mt-4 space-y-4">
          <input type="hidden" name="projectId" value={project.id} />

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              defaultValue={project.name}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              defaultValue={project.description ?? ""}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <a
              href="/dashboard"
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