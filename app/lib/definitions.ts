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

export type Item = {
  id: number;
  project_id: number;
  name: string;
  item_type: string | null;
  created_at: string;
  current_item_version_id: number | null;
};

export type ItemVersionRow = {
  id: number;
  item_id: number;
  version_number: string;
  details: string | null;
  updated_at: string;
};

export type ItemWithVersions = {
  item: Item;
  versions: ItemVersionRow[];
};
