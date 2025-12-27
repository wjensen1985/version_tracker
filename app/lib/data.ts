import { sql } from "./db";
import type { Project, ProjectItemRow, ItemWithVersions, Item, ItemVersionRow } from "./definitions";

export async function fetchUserProjects(
    user_id: number
) {
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


export async function createProject(
  ownerUserId: number,
  name: string,
  description?: string | null
): Promise<Project> {
  try {
    const rows = await sql`
      INSERT INTO projects (name, description, owner_user_id, created_at)
      VALUES (${name}, ${description ?? null}, ${ownerUserId}, NOW())
      RETURNING id, name, description, created_at;
    `;

    if (rows.length !== 1) {
      throw new Error("Failed to create project");
    }

    return rows[0] as Project;
  } catch (error) {
    console.error("createProject failed:", error);
    throw error;
  }
}

export async function deleteProject(
    projectId: number, 
    ownerUserId: number
) {
  try {
    const rows = await sql`
      DELETE FROM projects
      WHERE id = ${projectId}
        AND owner_user_id = ${ownerUserId}
      RETURNING id;
    `;

    if (rows.length === 0) {
      throw new Error("Project not found (or you don’t have access).");
    }

    return { success: true, deletedProjectId: rows[0].id };
  } catch (error) {
    console.error("deleteProject failed:", error);
    throw error;
  }
}

export async function fetchItemWithVersions(
  projectId: number,
  itemId: number,
  ownerUserId: number
): Promise<ItemWithVersions | null> {
  try {
    // 1) Fetch the item (secured by project ownership)
    const itemRows = await sql`
      SELECT
        i.id,
        i.project_id,
        i.name,
        i.item_type,
        i.created_at,
        i.current_item_version_id::int AS current_item_version_id
      FROM projects p
      JOIN items i
        ON i.project_id = p.id
      WHERE p.id = ${projectId}
        AND i.id = ${itemId}
        AND p.owner_user_id = ${ownerUserId}
      LIMIT 1;
    `;

    if (itemRows.length === 0) return null;
    const item = itemRows[0] as Item;

    // 2) Fetch version history
    const versionRows = await sql`
      SELECT
        iv.id::int AS id,
        iv.item_id::int AS item_id,
        iv.version_number,
        iv.details,
        iv.updated_at
      FROM item_versions iv
      WHERE iv.item_id = ${itemId}
      ORDER BY iv.updated_at DESC, iv.id DESC;
    `;

    return {
      item,
      versions: versionRows as ItemVersionRow[],
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch item version history.");
  }
}

export async function updateItemVersion(
  projectId: number,
  itemId: number,
  ownerUserId: number,
  newVersion: string,
  details?: string | null
) {
try {
    await sql`BEGIN`;

    // 1) Authorization + existence check: item must belong to user's project
    const okRows = await sql`
      SELECT 1
      FROM projects p
      JOIN items i ON i.project_id = p.id
      WHERE p.id = ${projectId}
        AND i.id = ${itemId}
        AND p.owner_user_id = ${ownerUserId}
      LIMIT 1;
    `;

    if (okRows.length === 0) {
      throw new Error("Not authorized (or item not found).");
    }

    // 2) Create the new version row
    const newVerRows = await sql`
      INSERT INTO item_versions (item_id, version_number, details, updated_at)
      VALUES (${itemId}, ${newVersion}, ${details ?? null}, NOW())
      RETURNING id;
    `;

    if (newVerRows.length !== 1) {
      throw new Error("Failed to create new version.");
    }

    const newVersionId = newVerRows[0].id;

    // console.log(
    //     "NEW VERSION ID:",
    //     newVersionId,
    //     typeof newVersionId
    // );


    // 3) Point item to that new version as the current version
    await sql`
      UPDATE items
      SET current_item_version_id = ${newVersionId}
      WHERE id = ${itemId};
    `;

    await sql`COMMIT`;

    return { versionId: newVersionId };
  } catch (error) {
    await sql`ROLLBACK`;
    console.error("updateItemVersion failed:", error);
    throw error;
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

export async function deleteItem(
  projectId: number,
  itemId: number,
  ownerUserId: number
) {
  try {
    // Ownership-safe delete:
    // Only deletes if:
    // - item belongs to projectId
    // - project belongs to ownerUserId
    const deletedRows = await sql`
      DELETE FROM items i
      USING projects p
      WHERE i.id = ${itemId}
        AND i.project_id = ${projectId}
        AND p.id = i.project_id
        AND p.owner_user_id = ${ownerUserId}
      RETURNING i.id;
    `;

    if (deletedRows.length === 0) {
      throw new Error("Item not found (or you don’t have access).");
    }

    return { success: true, deletedItemId: deletedRows[0].id };
  } catch (error) {
    console.error("deleteItem failed:", error);
    throw error;
  }
}

export async function fetchProjectDashboard(
    projectId: number, 
    ownerUserId: number
) {
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

export async function fetchProjectById(
    projectId: number, 
    ownerUserId: number
) {
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