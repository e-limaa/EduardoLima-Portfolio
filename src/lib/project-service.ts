import { client, urlFor } from "./sanity";
import { Project } from "./sanity-types";

export const getProjects = async (): Promise<Project[]> => {
  return await client.fetch(`*[_type == "project"] | order(order asc) {
    ...,
    "category": categoryRef->title
  }`);
};

export const getProjectById = async (id: string): Promise<Project | undefined> => {
  const query = `*[_type == "project" && _id == $id][0]{
    ...,
    "category": categoryRef->title
  }`;
  return await client.fetch(query, { id });
};

export const getImageUrl = (image: any): string => {
  if (!image) return "";
  if (typeof image === 'string') return image;
  return urlFor(image).url();
};

export const getAdjacentProjects = async (currentId: string): Promise<{ prevId: string | null, nextId: string | null }> => {
  const query = `*[_type == "project"] | order(order asc) { _id }`;
  const projects = await client.fetch(query);

  const currentIndex = projects.findIndex((p: any) => p._id === currentId);

  if (currentIndex === -1) return { prevId: null, nextId: null };

  const prevId = currentIndex > 0 ? projects[currentIndex - 1]._id : projects[projects.length - 1]._id; // Loop to last if first
  const nextId = currentIndex < projects.length - 1 ? projects[currentIndex + 1]._id : projects[0]._id; // Loop to first if last

  return { prevId, nextId };
};
