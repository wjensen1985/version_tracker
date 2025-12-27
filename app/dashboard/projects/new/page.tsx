import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getCurrentUserId } from "@/app/lib/auth";
import { createProject } from "@/app/lib/data";

export default async function NewProjectPage() {
  const userId = await getCurrentUserId();

  async function createProjectAction(formData: FormData) {
    "use server";

    const userId = await getCurrentUserId();

    const name = String(formData.get("name") ?? "").trim();
    const descriptionRaw = String(formData.get("description") ?? "");
    const description = descriptionRaw.trim() ? descriptionRaw.trim() : null;

    if (!name) {
      throw new Error("Project name is required");
    }

    const project = await createProject(userId, name, description);

    revalidatePath("/dashboard");
    redirect(`/dashboard/projects/${project.id}`);
  }

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">New project</h1>
        <p className="mt-1 text-sm text-gray-600">Create a project to start tracking items and versions.</p>
      </div>

      <form action={createProjectAction} className="rounded-xl border bg-white p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">Project name</label>
          <input
            name="name"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="e.g. Brake ECU"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description (optional)</label>
          <textarea
            name="description"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            rows={4}
            placeholder="What is this project tracking?"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Link
            href="/dashboard"
            className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Create project
          </button>
        </div>
      </form>
    </div>
  );
}