"use server";

import { redirect } from "next/navigation";
import { getCurrentUserId } from "./auth/auth";
import { 
  editItemVersion, deleteProject, 
  createProject, deleteItem, 
  editProject, fetchProjectById, 
  createItem, deleteItemVersion,
  editItem, updateItemVersion
} from "./data";
import { revalidatePath } from "next/cache";

export async function updateItemVersionAction(
  formData: FormData
) {
    const userId = await getCurrentUserId();

    const projectId = Number.parseInt(String(formData.get("projectId") ?? ""), 10);
    const itemId = Number.parseInt(String(formData.get("itemId") ?? ""), 10);
    const versionId = Number.parseInt(String(formData.get("versionId") ?? ""), 10);

    if (!Number.isInteger(projectId) || !Number.isInteger(itemId) || !Number.isInteger(versionId)) {
      throw new Error("Invalid ids");
    }

    const versionNumber = String(formData.get("version_number") ?? "").trim();
    const detailsRaw = String(formData.get("details") ?? "");
    const details = detailsRaw.trim() ? detailsRaw.trim() : null;

    if (!versionNumber) {
      throw new Error("Version number is required");
    }

    await editItemVersion(
      userId,
      projectId,
      itemId,
      versionId,
      {version_number: versionNumber, details: details},
    );

    revalidatePath(`/dashboard/projects/${projectId}/items/${itemId}`);
    redirect(`/dashboard/projects/${projectId}/items/${itemId}`);
}

export async function deleteProjectAction(formData: FormData) {

  const userId = await getCurrentUserId();

  const projectIdRaw = String(formData.get("projectId") ?? "");
  const projectId = Number.parseInt(projectIdRaw, 10);
  if (!Number.isInteger(projectId)) {
    throw new Error("Invalid project id");
  }

  await deleteProject(projectId, userId);
  revalidatePath("/dashboard");
}

export   async function createProjectAction(formData: FormData) {
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

export async function deleteItemAction(formData: FormData) {
  const userId = await getCurrentUserId();

  const projectIdRaw = String(formData.get("projectId") ?? "");
  const projectId = Number.parseInt(projectIdRaw, 10);
  if (!Number.isInteger(projectId)) {
    throw new Error("Invalid project id");
  }

  const itemId = Number.parseInt(String(formData.get("itemId") ?? ""), 10);
  if (!Number.isInteger(itemId)) {
    throw new Error("Invalid item id");
  }

  await deleteItem(projectId, itemId, userId);
  revalidatePath(`/dashboard/projects/${projectId}`);
  redirect(`/dashboard/projects/${projectId}`);
}

export async function updateProjectAction(formData: FormData) {
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

export async function createItemAction(formData: FormData) {
  const userId = await getCurrentUserId();

  const projectIdRaw = String(formData.get("projectId") ?? "");
  const projectId = Number.parseInt(projectIdRaw, 10);
  if (!Number.isInteger(projectId)) throw new Error("Invalid project id");

  const project = await fetchProjectById(projectId, userId);
  if (!project) throw new Error("Not authorized.");

  const name = String(formData.get("name") ?? "").trim();
  const initialVersion = String(formData.get("initialVersion") ?? "").trim();
  const details = String(formData.get("details") ?? "").trim();
  const detailsOrNull = details.length ? details : null;
  const itype = String(formData.get("item_type") ?? "").trim();
  const itypeOrNull = itype.length ? itype : null;

  if (!name) throw new Error("Name is required.");
  if (!initialVersion) throw new Error("Initial version is required.");

  const { itemId } = await createItem(projectId, name, initialVersion, detailsOrNull, itypeOrNull);

  revalidatePath(`/dashboard/projects/${projectId}`);
  redirect(`/dashboard/projects/${projectId}`);
}

export async function deleteItemVersionAction(formData: FormData) {
  const userId = await getCurrentUserId();

  const itemVersionId = Number.parseInt(String(formData.get("itemVersionId") ?? ""), 10);
  const itemIdFromForm = Number.parseInt(String(formData.get("itemId") ?? ""), 10);
  const projectIdFromForm = Number.parseInt(String(formData.get("projectId") ?? ""), 10);
  const projectIdRaw = String(formData.get("projectId") ?? "");
  const projectId = Number.parseInt(projectIdRaw, 10);

  if (
    !Number.isInteger(itemVersionId) ||
    !Number.isInteger(itemIdFromForm) ||
    !Number.isInteger(projectIdFromForm) ||
    !Number.isInteger(projectId)
  ) {
    throw new Error("Invalid ids");
  }

  await deleteItemVersion(itemVersionId, itemIdFromForm, projectId, userId);
  revalidatePath(`/dashboard/projects/${projectId}/items/${itemIdFromForm}`);
  redirect(`/dashboard/projects/${projectId}/items/${itemIdFromForm}`);
}

export async function updateItemAction(formData: FormData) {
  const userId = await getCurrentUserId();

  const projectId = Number.parseInt(String(formData.get("projectId") ?? ""), 10);
  const itemId = Number.parseInt(String(formData.get("itemId") ?? ""), 10);

  const name = String(formData.get("name") ?? "").trim();
  const itRaw = String(formData.get("description") ?? "");
  const item_type = itRaw.trim() ? itRaw.trim() : null;

  if (!Number.isInteger(projectId) || !Number.isInteger(itemId)) {
    throw new Error("Invalid ids");
  }
  if (!name) throw new Error("Item name is required");

  await editItem(userId, projectId, itemId, {name, item_type});

  // Refresh the items list page and return there
  revalidatePath(`/dashboard/projects/${projectId}`);
  redirect(`/dashboard/projects/${projectId}`);
}

export async function createNewVersionAction(formData: FormData) {
  const userId = await getCurrentUserId();

  const newVersion = String(formData.get("version_number") ?? "").trim();
  const detailsRaw = String(formData.get("details") ?? "");
  const details = detailsRaw.trim() ? detailsRaw.trim() : null;

  const projectId = Number.parseInt(String(formData.get("projectId") ?? ""), 10);
  const itemId = Number.parseInt(String(formData.get("itemId") ?? ""), 10);

  if (!Number.isInteger(projectId) || !Number.isInteger(itemId)) {
    throw new Error("Invalid ids");
  }

  if (!newVersion) {
    throw new Error("Version number is required.");
  }

  await updateItemVersion(projectId, itemId, userId, newVersion, details);

  // ensure item page + project dashboard refresh after mutation
  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath(`/dashboard/projects/${projectId}/items/${itemId}`);

  // back to item history page
  redirect(`/dashboard/projects/${projectId}/items/${itemId}`);
}