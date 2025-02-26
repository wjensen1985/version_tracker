import { fetchUserProjects, fetchProjectItems } from "../lib/data";

export default async function Dashboard() {
    const test_user_id = 1;
    const projects = await fetchUserProjects(test_user_id.toString());

    const test_project_id = 2;
    const items = await fetchProjectItems(test_project_id.toString());

    return (
      <main>
        <div>Hello Dashboard!</div>
        <div>{JSON.stringify(projects)}</div>
        <div>{JSON.stringify(items)}</div>
      </main>
    );
  }