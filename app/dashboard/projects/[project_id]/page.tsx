import Link from "next/link";
import { fetchProjectById, fetchProjectDashboard } from "@/app/lib/data";
import type { ProjectItemRow } from "@/app/lib/definitions";
import { getCurrentUserId } from "@/app/lib/auth";


function fmt(iso: string | null) {
  if (!iso) return "—";
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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ project_id: string }>;
}) {
  const { project_id } = await params;

  // console.log("params.project_id =", project_id);

  const userId = await getCurrentUserId();
  // console.log("userId =", userId);

  const projectId = Number.parseInt(project_id, 10);
  // console.log("projectId =", projectId);

  if (!Number.isFinite(projectId)) {
    return <div className="p-6">Invalid project id.</div>;
  }

  const project = await fetchProjectById(projectId, userId);
  if (!project) {
    return <div className="p-6">Project not found (or you don’t have access).</div>;
  }

  const items = await fetchProjectDashboard(projectId, userId);
  console.log(items);

  return (
    <div className="p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          {project.description ? (
            <p className="mt-1 text-sm text-gray-600">{project.description}</p>
          ) : null}
        </div>

        <Link
          href="/dashboard"
          className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Back to dashboard
        </Link>
      </div>

      <div className="rounded-xl border bg-white">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-lg font-semibold">Items</h2>
            <p className="text-sm text-gray-600">{items.length} total</p>
          </div>

          <Link
            href={`/dashboard/projects/${projectId}/items/new`}
            className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            New item
          </Link>
        </div>

        <div className="overflow-x-auto border-t">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Current version</th>
                <th className="px-4 py-3">Current version details</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {items.map((it: ProjectItemRow) => (
                <tr key={it.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      className="hover:underline"
                      href={`/dashboard/projects/${projectId}/items/${it.id}`}
                    >
                      {it.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{it.item_type ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-700">{it.current_version ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-700">{it.current_version_details ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-700">{fmt(it.current_version_updated_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/projects/${projectId}/items/${it.id}`}
                      className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-white"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}

              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-600" colSpan={5}>
                    No items yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}