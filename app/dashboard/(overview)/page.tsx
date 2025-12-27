import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/app/lib/auth";
import { fetchUserProjects, deleteProject } from "@/app/lib/data";
import ProjectsTable from "./ProjectsTable";

export default async function Dashboard() {
  const userId = await getCurrentUserId();
  const projects = await fetchUserProjects(userId);

  async function deleteProjectAction(formData: FormData) {
    "use server";

    const userId = await getCurrentUserId();

    const projectIdRaw = String(formData.get("projectId") ?? "");
    const projectId = Number.parseInt(projectIdRaw, 10);
    if (!Number.isInteger(projectId)) {
      throw new Error("Invalid project id");
    }

    await deleteProject(projectId, userId);
    revalidatePath("/dashboard");
  }

  return (
    <main className="p-6">
      <ProjectsTable projects={projects} deleteProjectAction={deleteProjectAction} />
    </main>
  );
}