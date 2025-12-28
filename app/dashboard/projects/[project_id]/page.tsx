import Link from "next/link";
import { deleteItem, fetchProjectById, fetchProjectDashboard, fetchProjectDashboardAsOf } from "@/app/lib/data";
import type { ProjectItemRow, HistoricProjectItemRow } from "@/app/lib/definitions";
import { getCurrentUserId } from "@/app/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import ConfirmDeleteButton from "@/app/components/ConfirmDeleteButton";
import HistoricTimestampPicker from "@/app/components/HistoricTimestampPicker";

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

function toUtcIsoInput(input: string | null) {
  if (!input) return null;
  const hasTimezone = /[zZ]$/.test(input);
  let normalized = input;
  if (!hasTimezone) {
    normalized = input.length === 16 ? `${input}:00Z` : `${input}Z`;
  }
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function toDatetimeLocalValue(input: string | null) {
  if (!input) return "";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(input)) {
    return input;
  }
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  const mm = pad(d.getUTCMonth() + 1);
  const dd = pad(d.getUTCDate());
  const hh = pad(d.getUTCHours());
  const mi = pad(d.getUTCMinutes());
  const ss = pad(d.getUTCSeconds());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ project_id: string }>;
  searchParams?: Promise<{ asOf?: string }>;
}) {
  const { project_id } = await params;
  const { asOf } = (await searchParams) ?? {};

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

  const asOfIso = toUtcIsoInput(asOf ?? null);
  const asOfInputValue = toDatetimeLocalValue(asOf ?? null);
  const items = asOfIso
    ? await fetchProjectDashboardAsOf(projectId, userId, asOfIso)
    : await fetchProjectDashboard(projectId, userId);
  // console.log(items);

  async function deleteItemAction(formData: FormData) {
    "use server";

    const userId = await getCurrentUserId();

    const itemId = Number.parseInt(String(formData.get("itemId") ?? ""), 10);
    if (!Number.isInteger(itemId)) {
      throw new Error("Invalid item id");
    }

    await deleteItem(projectId, itemId, userId);
    revalidatePath(`/dashboard/projects/${projectId}`);
    redirect(`/dashboard/projects/${projectId}`);
  }

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

        <div className="border-t bg-gray-50 p-4">
          <form className="flex flex-wrap items-end gap-3" method="GET">
            <HistoricTimestampPicker initialValue={asOfInputValue} />
            <button
              className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-white"
              type="submit"
            >
              View Selected
            </button>
            {asOf ? (
              <Link
                className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-white"
                href={`/dashboard/projects/${projectId}`}
              >
                Clear
              </Link>
            ) : null}
          </form>

          {asOfIso ? (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Historic view as of <span className="font-semibold">{asOfIso}</span> UTC
            </div>
          ) : null}
        </div>

        <div className="overflow-x-auto border-t">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">{asOfIso ? "Historic version" : "Current version"}</th>
                <th className="px-4 py-3">
                  {asOfIso ? "Historic version details" : "Current version details"}
                </th>
                <th className="px-4 py-3">{asOfIso ? "Historic version updated at (UTC)" : "Version updated at (UTC)"}</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {items.map((it: ProjectItemRow | HistoricProjectItemRow) => (
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
                  <td className="px-4 py-3 text-gray-700">
                    {"historic_version" in it ? it.historic_version ?? "—" : it.current_version ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {"historic_version_details" in it
                      ? it.historic_version_details ?? "—"
                      : it.current_version_details ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {"historic_version_updated_at" in it
                      ? fmt(it.historic_version_updated_at)
                      : fmt(it.current_version_updated_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/projects/${projectId}/items/${it.id}`}
                        className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-white"
                      >
                        Open
                      </Link>
                      
                      <Link
                        href={`/dashboard/projects/${projectId}/items/${it.id}/edit`}
                        className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-white"
                      >
                        Edit
                      </Link>

                      <form action={deleteItemAction}>
                        <input type="hidden" name="itemId" value={it.id} />
                        <ConfirmDeleteButton />
                      </form>

                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-600" colSpan={6}>
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
