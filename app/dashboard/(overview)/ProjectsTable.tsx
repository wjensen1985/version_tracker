import Link from "next/link";
import type { Project } from "@/app/lib/definitions";
import ConfirmDeleteButton from "@/app/components/ConfirmDeleteButton";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function ProjectsTable({
  projects,
  deleteProjectAction,
}: {
  projects: Project[];
  deleteProjectAction: (formData: FormData) => Promise<void>;
}) {
  if (!projects?.length) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Projects</h2>
        <p className="mt-2 text-sm text-gray-600">
          No projects yet. Create one to get started.
        </p>
        <Link
          href="/dashboard/projects/new"
          className="mt-4 inline-flex items-center rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
        >
          New project
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white">
      <div className="flex items-center justify-between p-4">
        <div>
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="text-sm text-gray-600">{projects.length} total</p>
        </div>

        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          New project
        </Link>
      </div>

      <div className="overflow-x-auto border-t">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  <Link className="hover:underline" href={`/dashboard/projects/${p.id}`}>
                    {p.name}
                  </Link>
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {p.description?.trim() ? p.description : <span className="text-gray-400">—</span>}
                </td>

                <td className="px-4 py-3 text-gray-700">{formatDate(p.created_at)}</td>

                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/dashboard/projects/${p.id}`}
                      className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-white"
                    >
                      Open
                    </Link>

                    <Link
                      href={`/dashboard/projects/${p.id}/edit`}
                      className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-white"
                    >
                      Edit
                    </Link>

                    <form action={deleteProjectAction}>
                      <input type="hidden" name="projectId" value={p.id} />
                      <ConfirmDeleteButton label="Delete" />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}