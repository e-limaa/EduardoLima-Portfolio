import { client, urlFor } from "./sanity";
import { Project } from "./sanity-types";

export const getProjects = async (): Promise<Project[]> => {
  return await client.fetch(`*[_type == "project"] | order(order asc) {
    ...,
    "category": categoryRef->title
  }`);
};

export const getProjectBySlug = async (slug: string): Promise<Project | undefined> => {
  const query = `*[_type == "project" && slug.current == $slug][0]{
    ...,
    "category": categoryRef->title
  }`;
  return await client.fetch(query, { slug });
};

export const getImageUrl = (image: any): string => {
  if (!image) return "";
  if (typeof image === 'string') return image;
  return urlFor(image).url();
};

export const getAdjacentProjects = async (currentId: string): Promise<{ prevId: string | null, nextId: string | null }> => {
  // Note: We might want to switch this to slugs too, but let's keep it compatible or handle both.
  // Given the request is to switch URLs, we should return slugs here.
  // Let's refactor this to take an ID (or slug) and return SLUGS.

  const query = `*[_type == "project"] | order(order asc) { _id, slug }`;
  const projects = await client.fetch(query);

  const currentIndex = projects.findIndex((p: any) => p._id === currentId || p.slug.current === currentId);

  if (currentIndex === -1) return { prevId: null, nextId: null };

  const getSlugOrId = (index: number) => projects[index].slug?.current || projects[index]._id;

  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1];
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];

  return {
    prevId: prevProject.slug?.current || prevProject._id,
    nextId: nextProject.slug?.current || nextProject._id
  };
};
