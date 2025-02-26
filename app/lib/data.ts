import { sql } from '@vercel/postgres';

export async function fetchUserProjects(user_id: string) {
  
    try {
      const projects = await sql`
        SELECT p.name,
            p.description,
            p.created_at,
            up.role
        FROM projects p
        JOIN user_projects up ON p.id = up.project_id
        WHERE up.user_id = ${user_id};
      `;
  
      return projects.rows;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch projects.');
    }
}

export async function  fetchProjectItems(project_id: string) {
    try {
        const items = await sql`
          SELECT *
          FROM items
          JOIN projects p ON items.project_id = p.id
          WHERE p.id = ${project_id};
        `;
    
        return items.rows;
      } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch project items.');
      }
}