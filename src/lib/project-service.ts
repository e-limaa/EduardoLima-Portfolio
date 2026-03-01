import useSWR from 'swr';
import { client, urlFor } from "./sanity";
import { Project } from "./sanity-types";

const projectsQuery = `*[_type == "project"] | order(order asc) {
    ...,
    "category": categoryRef->title,
    thumbnail
}`;

const getAdjacentFromList = (
  list: Array<{ _id: string; slug?: { current?: string } }>,
  currentId: string
): { prevId: string | null; nextId: string | null } => {
  if (!list.length) return { prevId: null, nextId: null };

  const currentIndex = list.findIndex(
    (project) => project._id === currentId || project.slug?.current === currentId
  );

  if (currentIndex === -1) return { prevId: null, nextId: null };

  const prevProject = currentIndex > 0 ? list[currentIndex - 1] : list[list.length - 1];
  const nextProject = currentIndex < list.length - 1 ? list[currentIndex + 1] : list[0];

  return {
    prevId: prevProject.slug?.current || prevProject._id,
    nextId: nextProject.slug?.current || nextProject._id,
  };
};

export const getProjects = async (): Promise<Project[]> => {
  const remoteProjects = await client.fetch<Project[]>(projectsQuery);
  return Array.isArray(remoteProjects) ? remoteProjects : [];
};

export const useProjects = () => {
  const { data, error, isLoading } = useSWR('projects', () => getProjects(), {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryCount: 0,
  });
  return {
    projects: data || [],
    isLoading,
    isError: error
  };
};

export const getProjectBySlug = async (slug: string): Promise<Project | undefined> => {
  const query = `*[_type == "project" && slug.current == $slug][0]{
    ...,
    "category": categoryRef->title
  }`;
  const project = await client.fetch<Project | undefined>(query, { slug });
  return project;
};

export const useProjectBySlug = (slug?: string) => {
  const { data, error, isLoading } = useSWR(
    slug ? ['project', slug] : null,
    () => (slug ? getProjectBySlug(slug) : null),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 0,
    }
  );
  return {
    project: data,
    isLoading,
    isError: error
  };
};

export const getImageUrl = (image: any): string => {
  if (!image) return "";
  if (typeof image === 'string') return image;
  return urlFor(image).url();
};

export const getAdjacentProjects = async (currentId: string): Promise<{ prevId: string | null, nextId: string | null }> => {
  const query = `*[_type == "project"] | order(order asc) { _id, slug }`;
  const projects = await client.fetch<Array<{ _id: string; slug?: { current?: string } }>>(query);
  return getAdjacentFromList(Array.isArray(projects) ? projects : [], currentId);
};

export const useAdjacentProjects = (currentId?: string) => {
  const { data, error, isLoading } = useSWR(
    currentId ? ['adjacent', currentId] : null,
    () => (currentId ? getAdjacentProjects(currentId) : null),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 0,
    }
  );
  return {
    navigation: data || { prevId: null, nextId: null },
    isLoading,
    isError: error
  };
};
