import { sql } from "../lib/db";

export async function fetchProjectItems(project_id: string) {
    try {
        const items = await sql`
          SELECT *
          FROM items i
          JOIN projects p ON i.project_id = p.id
          WHERE p.id = ${project_id};
        `;
    
        return items;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch project items.');
    }
}