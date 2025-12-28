import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/app/lib/auth";
import { editProject, fetchProjectById } from "@/app/lib/data";

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

  async function updateProjectAction(formData: FormData) {
    "use server";

    const userId = await getCurrentUserId();

    const projectIdRaw = String(formData.get("projectId") ?? "");
    const projectId = Number.parseInt(projectIdRaw, 10);
    if (!Number.isInteger(projectId)) throw new Error("Invalid project id");

    const name = String(formData.get("name") ?? "").trim();
    const descriptionRaw = String(formData.get("description") ?? "");
    const description = descriptionRaw.trim() ? descriptionRaw.trim() : null;

    if (!name) throw new Error("Project name is required");

    await editProject(projectId, userId, { name, description });

    // Refresh any pages that show this data, then go back to dashboard
    revalidatePath("/dashboard");
    redirect("/dashboard");
  }

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