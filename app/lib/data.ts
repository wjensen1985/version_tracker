import { sql } from "./db";
import type { Project, ProjectItemRow } from "./definitions";

export async function fetchUserProjects(user_id: string) {
      try {
      const projects = await sql`
        SELECT
          p.id,
          p.name,
          p.description,
          p.created_at
        FROM projects p
        WHERE p.owner_user_id = ${user_id}
        ORDER BY p.created_at DESC;
      `;
  
      return projects as Project[];
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch projects.');
    }
}

export async function createProject(project_name: String, user_name: String, description: String){
        try {
        
        const res = await sql`
            WITH u AS (
            SELECT id
            FROM users
            WHERE username = ${user_name}
            )
            INSERT INTO projects (name, description, owner_user_id, created_at)
            SELECT ${project_name}, ${description}, u.id, NOW()
            FROM u
            RETURNING *;
        `;
        
        return;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create new project');
    }  
}

export async function deleteProject(project_id: String, user_id: String){
    try {const res = await sql`
            BEGIN;

            DELETE FROM projects
            WHERE id = ${project_id}
            AND owner_user_id = ${user_id};

            COMMIT;
        `;
        return;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create new project');
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
        throw new Error('Failed to update item version history.');
    }   
    
}

export async function createItem(
    projectId: number, 
    name: string, 
    initialVersion: string, 
    details?: String | null,
    item_type?: String | null
) {
  try {
    await sql`BEGIN`;

    // 1) Create the item
    const itemRows = await sql`
      INSERT INTO items (project_id, name, created_at, item_type)
      VALUES (${projectId}, ${name}, NOW(), ${item_type})
      RETURNING id
    `;

    if (itemRows.length !== 1) {
      throw new Error("Failed to create item");
    }

    const itemId = itemRows[0].id;

    // 2) Create initial version
    const versionRows = await sql`
      INSERT INTO item_versions (item_id, version_number, details, updated_at)
      VALUES (${itemId}, ${initialVersion}, ${details ?? null}, NOW())
      RETURNING id
    `;

    if (versionRows.length !== 1) {
      throw new Error("Failed to create item version");
    }

    const versionId = versionRows[0].id;

    // 3) Point item to current version
    await sql`
      UPDATE items
      SET current_item_version_id = ${versionId}
      WHERE id = ${itemId}
    `;

    await sql`COMMIT`;

    return {
      itemId,
      versionId,
    };
  } catch (error) {
    await sql`ROLLBACK`;
    console.error("createItem failed:", error);
    throw error;
  }
}

export async function deleteItem(itemId: number, ownerUserId: number) {
    try {
        const deletedRows = await sql`
            DELETE FROM items
            WHERE i.id = ${itemId}
            AND i.project_id = p.id
            AND p.owner_user_id = ${ownerUserId}
        `;

        if (deletedRows.length === 0) {
            throw new Error("Item not found");
        }

        return { success: true };
    } catch (error) {
        console.error("deleteItem failed:", error);
        throw error;
    }
}

export async function fetchProjectDashboard(projectId: number, ownerUserId: string) {
  try {
    const rows = await sql`
      SELECT
        i.id,
        i.project_id,
        i.name,
        i.item_type,
        iv.version_number AS current_version,
        iv.updated_at     AS current_version_updated_at,
        iv.details        AS current_version_details
      FROM projects p
      JOIN items i
        ON i.project_id = p.id
      LEFT JOIN item_versions iv
        ON iv.id = i.current_item_version_id
      WHERE p.id = ${projectId}
        AND p.owner_user_id = ${ownerUserId}
      ORDER BY i.id;
    `;

    return rows as ProjectItemRow[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch project dashboard.");
  }
}

export async function fetchProjectById(projectId: number, ownerUserId: string) {
  try {
    const rows = await sql`
      SELECT id, name, description, created_at
      FROM projects
      WHERE id = ${projectId}
        AND owner_user_id = ${ownerUserId}
      LIMIT 1;
    `;

    if (rows.length === 0) return null;
    return rows[0] as Project;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch project.");
  }
}

/* 
Todos:
Implement/write:
Project view:
    - [x] get all items for a project (and display current version)
    - [x] add item (to project)
    - [x] delete item (from project)
    - [x] view specific item version history
    - [x] update item (new version)

User view:
    - [x] view list of all user projects
    - [x] create new project
        - main db migrations needed:
            ALTER TABLE projects
            ADD COLUMN owner_user_id BIGINT NULL;

            UPDATE projects p
            SET owner_user_id = u.id
            FROM users u
            WHERE p.owner = u.username AND p.owner_user_id IS NULL;

            SELECT p.id, p.owner
            FROM projects p
            WHERE p.owner_user_id IS NULL;

            ALTER TABLE projects
            ADD CONSTRAINT projects_owner_user_fk
            FOREIGN KEY (owner_user_id)
            REFERENCES users(id)
            ON UPDATE CASCADE
            ON DELETE RESTRICT;

            ALTER TABLE projects
            ALTER COLUMN owner_user_id SET NOT NULL;

            ALTER TABLE projects
            DROP COLUMN owner;

            CREATE INDEX IF NOT EXISTS idx_projects_owner_user_id
            ON projects (owner_user_id);

    - [x] delete current project
        db changes:
            ALTER TABLE "items"
            DROP CONSTRAINT "items_project_id_fkey",
            ADD CONSTRAINT "items_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE;

            ALTER TABLE "item_versions"
            DROP CONSTRAINT "item_versions_item_id_fkey",
            ADD CONSTRAINT "item_versions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items" ("id") ON DELETE CASCADE;


Test:
    - [] get all items for a project (and display current version)
    - [] add item (to project)
    - [] delete item (from project)
    - [] view specific item version history
    - [] update item (new version)
    - [] view list of all user projects
    - [] create new project
    - [] delete current project

*/