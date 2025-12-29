import { getCurrentUserId } from "@/app/lib/auth";
import { fetchUserProjects } from "@/app/lib/data";
import ProjectsTable from "../../components/ProjectsTable";
import { deleteProjectAction } from "@/app/lib/actions";

export default async function Dashboard() {
  const userId = await getCurrentUserId();
  const projects = await fetchUserProjects(userId);

  return (
    <main className="p-6">
      <ProjectsTable projects={projects} deleteProjectAction={deleteProjectAction} />
    </main>
  );
}