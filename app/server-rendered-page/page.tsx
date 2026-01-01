import { neonAuth } from "@neondatabase/auth/next/server";

export default async function ServerRenderedPage() {
    const { session, user } = await neonAuth();

    return (
        <div className="max-w-xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Server Rendered Page</h1>

            <p className="text-gray-400">
                Authenticated:{" "}
                <span className={session ? "text-green-500" : "text-red-500"}>
                    {session ? "Yes" : "No"}
                </span>
            </p>

            {user && <p className="text-gray-400">User ID: {user.id}</p>}

            <p className="font-medium text-gray-700 dark:text-gray-200">Session and User Data:</p>

            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto text-gray-800 dark:text-gray-200">
                {JSON.stringify({ session, user }, null, 2)}
            </pre>
        </div>
    );
}