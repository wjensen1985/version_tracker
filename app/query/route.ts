import { db } from '@vercel/postgres';

const client = await db.connect();

async function getTestProjects() {
	const data = await client.sql`
    SELECT p.id,
       p.name,
       p.description,
       p.created_at
    FROM projects p
    JOIN user_projects up ON p.id = up.project_id
    WHERE up.user_id = 1;
  `;

	return data.rows;
}

export async function GET() {
    // return Response.json({
    //   message:
    //     'Uncomment this file and remove this line. You can delete this file when you are finished.',
    // });
    try {
        return Response.json(await getTestProjects());
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
  }