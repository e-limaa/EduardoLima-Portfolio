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
