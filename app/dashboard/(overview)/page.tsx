import { fetchUserProjects } from '../../lib/data';
import ProjectsTable from './ProjectsTable';

//dashboard Home (my recent projects/search_all/create)
export default async function Dashboard() {
    const test_user_id = 2;
    const projects = await fetchUserProjects(test_user_id.toString());

    // const test_project_id = 2;
    // const dashboard_info = await fetchDashboardInfo(test_project_id.toString());

    // const test_item_id = 3;
    // const versions = await fetchItemVersionHistory(test_item_id.toString());

    return (
      <main>
        <div>Hello Dashboard!</div>
        <br />
        <div>{JSON.stringify(projects)}</div>
        <br />
        <div className="p-6">
          <ProjectsTable projects={projects} />
        </div>
        <br />
        {/* <br></br>
        <div>{JSON.stringify(versions)}</div>
        <br></br>
        <div>{JSON.stringify(dashboard_info)}</div> */}
      </main>
    );
  }