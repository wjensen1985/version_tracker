import Link from "next/link";
import { fetchItemVersionById } from "@/app/lib/data";
import { updateItemVersionAction } from "@/app/lib/actions";

export default async function EditVersionPage({
  params,
}: {
  params: { project_id: string; item_id: string; version_id: string };
}) {
  const v = await fetchItemVersionById(params.version_id);

  if (!v) return <div className="p-6">Version not found</div>;

  return (
    <main className="p-6 max-w-xl">
      <h1 className="text-xl font-semibold mb-4">Edit Version</h1>

      <form
        action={updateItemVersionAction.bind(
          null,
          params.project_id,
          params.item_id,
          params.version_id
        )}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm mb-1">Version number</label>
          <input
            name="version_number"
            defaultValue={v.version_number}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Details</label>
          <textarea
            name="details"
            defaultValue={v.details ?? ""}
            className="w-full border rounded px-3 py-2"
            rows={5}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Link
            className="px-3 py-2 border rounded"
            href={`/dashboard/projects/${params.project_id}/items/${params.item_id}`}
          >
            Cancel
          </Link>
          <button className="px-3 py-2 border rounded" type="submit">
            Save
          </button>
        </div>
      </form>
    </main>
  );
}