import { sql } from "./db";

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
  
      return projects;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch projects.');
    }
}

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

export async function fetchItemVersionHistory(item_id: String) {
    try {
        const item_version_history = await sql`
            SELECT *
            FROM item_versions iv
            JOIN items i ON iv.item_id = i.id
            WHERE i.id = ${item_id};
        `;
    
        return item_version_history;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch item version history.');
    }   
}

export async function udpateItemVersion(item_id: Number, new_version: string) {
    try {
        
        const res = await sql`
            BEGIN;

            WITH new_ver AS (
            INSERT INTO item_versions (item_id, version_number, details, updated_at)
            VALUES (${item_id}, ${new_version}, NOW())
            RETURNING id
            )
            UPDATE items
            SET current_item_version_id = (SELECT id FROM new_ver)
            WHERE id = ${item_id};

            COMMIT;
        `;
        
        return;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch item version history.');
    }   
    
}


export async function fetchDashboardInfo(project_id: String) {
    try {
        const dashboard_info = await sql`
            SELECT
                i.id,
                i.project_id,
                i.name,
                i.item_type,
                iv.version_number AS current_version,
                iv.updated_at    AS current_version_updated_at
            FROM items i
            LEFT JOIN item_versions iv
            ON iv.id = i.current_item_version_id
            WHERE i.project_id = ${project_id}
            ORDER BY i.id;
        `;
    
        return dashboard_info;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch item version history.');
    }   
}
