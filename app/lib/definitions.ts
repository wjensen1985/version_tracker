export type Project = {
  id: number;
  name: string;
  description: string | null;
  created_at: string; // ISO string
};

export type ProjectItemRow = {
  id: number;
  project_id: number;
  name: string;
  item_type: string | null;
  current_version: string | null;
  current_version_updated_at: string | null; // ISO string
  current_version_details: string | null;
};