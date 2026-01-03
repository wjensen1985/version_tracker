import Link from "next/link";
import { createProjectAction } from "@/app/lib/actions";

export default async function NewProjectPage() {

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">New project</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Create a project to start tracking items and versions.</p>
      </div>

      <form action={createProjectAction} className="rounded-xl border border-gray-200 bg-white p-4 space-y-4 dark:border-gray-800 dark:bg-gray-900">
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
            className="rounded-lg border-2 border-gray-700 px-3 py-2 text-sm font-medium hover:bg-gray-700 hover:text-white dark:border-gray-300 dark:hover:bg-gray-300 dark:hover:text-gray-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg border-2 border-gray-700 px-3 py-2 text-sm font-medium hover:bg-gray-700 hover:text-white dark:border-gray-300 dark:hover:bg-gray-300 dark:hover:text-gray-900"
          >
            Create project
          </button>
        </div>
      </form>
    </div>
  );
}
