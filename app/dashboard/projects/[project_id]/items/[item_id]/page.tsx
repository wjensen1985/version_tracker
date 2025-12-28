import Link from "next/link";
import { getCurrentUserId } from "@/app/lib/auth";
import { fetchItemWithVersions } from "@/app/lib/data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import ConfirmDeleteButton from "@/app/components/ConfirmDeleteButton";
import { deleteItemVersion } from "@/app/lib/data";

function fmt(iso: string) {
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

export default async function ItemPage({
  params,
}: {
  params: Promise<{ project_id: string; item_id: string }>;
}) {
  const { project_id, item_id } = await params;

  const projectId = Number.parseInt(project_id, 10);
  const itemId = Number.parseInt(item_id, 10);

  if (!Number.isInteger(projectId) || !Number.isInteger(itemId)) {
    return <div className="p-6">Invalid route params.</div>;
  }

  const userId = await getCurrentUserId();

  const result = await fetchItemWithVersions(projectId, itemId, userId);
  if (!result) {
    return <div className="p-6">Item not found (or you don’t have access).</div>;
  }

  const { item, versions } = result;

  async function deleteItemVersionAction(formData: FormData) {
    "use server";

    const userId = await getCurrentUserId();

    const itemVersionId = Number.parseInt(String(formData.get("itemVersionId") ?? ""), 10);
    const itemIdFromForm = Number.parseInt(String(formData.get("itemId") ?? ""), 10);
    const projectIdFromForm = Number.parseInt(String(formData.get("projectId") ?? ""), 10);

    if (
      !Number.isInteger(itemVersionId) ||
      !Number.isInteger(itemIdFromForm) ||
      !Number.isInteger(projectIdFromForm)
    ) {
      throw new Error("Invalid ids");
    }

    await deleteItemVersion(itemVersionId, itemId, projectId, userId);
    revalidatePath(`/dashboard/projects/${projectId}/items/${itemId}`);
    redirect(`/dashboard/projects/${projectId}/items/${itemId}`);
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{item.name}</h1>
          <p className="mt-1 text-sm text-gray-600">
            Type: <span className="font-medium">{item.item_type ?? "—"}</span>
          </p>
        </div>

        <Link
          href={`/dashboard/projects/${projectId}`}
          className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Back to project
        </Link>
      </div>

      <div className="rounded-xl border bg-white">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-lg font-semibold">Version history</h2>
            <p className="text-sm text-gray-600">{versions.length} versions</p>
          </div>

          <Link
            href={`/dashboard/projects/${projectId}/items/${itemId}/versions/new`}
            className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            New version
          </Link>
        </div>

        <div className="overflow-x-auto border-t">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3">Version</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Current</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {versions.map((v) => {
                const isCurrent = item.current_item_version_id === v.id;
                const canDelete = !(isCurrent && versions.length === 1);
                // console.log(
                //   "current_item_version_id:", item.current_item_version_id, typeof item.current_item_version_id,
                //   "v.id:", v.id, typeof v.id
                // );

                return (
                  <tr key={v.id} className="align-top hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {v.version_number}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{fmt(v.updated_at)}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-pre-wrap">
                      {v.details?.trim() ? v.details : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {isCurrent ? (
                        <span className="inline-flex rounded-full bg-gray-900 px-2 py-1 text-xs font-semibold text-white">
                          Current
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    
                    

                    <td className="px-4 py-3 text-gray-900">
                      <div className="flex justify-end gap-2">

                        <Link
                          href={`/dashboard/projects/${projectId}/items/${itemId}/versions/${v.id}/edit`}
                          className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-white"
                        >
                          Edit
                        </Link>

                        {canDelete ? (
                          <form action={deleteItemVersionAction}>
                            <input type="hidden" name="itemVersionId" value={v.id} />
                            <input type="hidden" name="itemId" value={itemId} />
                            <input type="hidden" name="projectId" value={projectId} />
                            <ConfirmDeleteButton />
                          </form>
                        ) : (
                          <span className="text-xs text-gray-500">Can’t delete the only version</span>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}

              {versions.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-600" colSpan={5}>
                    No versions yet.
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