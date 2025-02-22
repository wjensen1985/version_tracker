import { fetchUserProjects } from "../lib/data";

export default async function Dashboard() {
    const test_id = 1;
    const projects = await fetchUserProjects(test_id.toString());

    return (
      <main>
        <div>Hello Dashboard!</div>
        <div>{JSON.stringify(projects)}</div>
      </main>
    );
  }