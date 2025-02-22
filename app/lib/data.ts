import { sql } from '@vercel/postgres';

export async function fetchUserProjects(user: string) {
  
    try {
      const projects = await sql`
        SELECT p.name,
            p.description,
            p.created_at,
            up.role
        FROM projects p
        JOIN user_projects up ON p.id = up.project_id
        WHERE up.user_id = ${user};
      `;
  
      return projects.rows;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch projects.');
    }
}