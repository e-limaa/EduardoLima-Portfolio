import { client, urlFor } from "./sanity";
import { Project } from "./sanity-types";

export const getProjects = async (): Promise<Project[]> => {
  return await client.fetch(`*[_type == "project"]`);
};

export const getProjectById = async (id: string | number): Promise<Project | undefined> => {
  // If id is numeric (legacy), we might need to handle it differently or assume it's not in Sanity yet
  // For now, we'll try to fetch by _id. 
  // Note: Sanity IDs are strings. If the app passes a number, we convert it to string.
  // Ideally, the app should be updated to use string IDs everywhere.
  const query = `*[_type == "project" && id == $id][0]`;
  // We parse to int because the schema expects a number
  return await client.fetch(query, { id: parseInt(id.toString()) });
};

export const getImageUrl = (image: any): string => {
  if (!image) return "";
  if (typeof image === 'string') return image;
  return urlFor(image).url();
};
