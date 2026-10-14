const projectId = 'mxq3x3cp';
const dataset = 'production';
const apiVersion = '2023-05-03';
const endpoint = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`;

const categoryTitleExpression =
  'coalesce(categoryRef->titleI18n[$locale], categoryRef->titleI18n.ptBr, categoryRef->titleI18n.en, categoryRef->title, "")';

const categoryKindExpression = `coalesce(
  categoryRef->kind,
  select(
    lower(${categoryTitleExpression}) match "*pesquisa*" => "study",
    lower(${categoryTitleExpression}) match "*estudo*" => "study",
    lower(${categoryTitleExpression}) match "*research*" => "study",
    lower(${categoryTitleExpression}) match "*study*" => "study",
    lower(${categoryTitleExpression}) match "*ux*" => "study",
    "ui"
  )
)`;

const projectFields = `
  _id,
  slug,
  mainImage,
  thumbnail,
  gallery[]{
    ...,
    _type == "image" => {
      "caption": coalesce(caption[$locale], caption.ptBr, caption.en),
      "alt": coalesce(alt[$locale], alt.ptBr, alt.en)
    },
    _type == "solution" => {
      ...,
      "text": coalesce(textI18n[$locale], textI18n.ptBr, textI18n.en, text, "")
    }
  },
  "stack": select(
    defined(technologyStack) && count(technologyStack) > 0 => technologyStack[]->{ "label": coalesce(labelI18n[$locale], labelI18n.ptBr, labelI18n.en, name, "") }.label,
    stack
  ),
  year,
  "metric": coalesce(metricI18n[$locale], metricI18n.ptBr, metricI18n.en, metric, ""),
  color,
  order,
  "solutionPlacement": coalesce(solutionPlacement, "afterChallenge"),
  "title": coalesce(titleI18n[$locale], titleI18n.ptBr, titleI18n.en, title, ""),
  "category": ${categoryTitleExpression},
  "categoryKind": ${categoryKindExpression},
  "metricLabel": coalesce(metricLabelI18n[$locale], metricLabelI18n.ptBr, metricLabelI18n.en, metricLabel),
  "role": coalesce(roleI18n[$locale], roleI18n.ptBr, roleI18n.en, role, ""),
  "client": coalesce(clientI18n[$locale], clientI18n.ptBr, clientI18n.en, client, ""),
  "description": coalesce(descriptionI18n[$locale], descriptionI18n.ptBr, descriptionI18n.en, description, ""),
  "challenge": coalesce(challengeI18n[$locale], challengeI18n.ptBr, challengeI18n.en, challenge, ""),
  "solution": coalesce(solutionI18n[$locale], solutionI18n.ptBr, solutionI18n.en, solution, "")
`;

const projectsQuery = `*[_type == "project"] | order(order asc) {
  ${projectFields}
}`;

const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0]{
  ${projectFields}
}`;

const navigationQuery = '*[_type == "project"] | order(order asc) { _id, slug }';

async function querySanity(query, params, fetchImpl) {
  const url = new URL(endpoint);
  url.searchParams.set('query', query);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  }

  const response = await fetchImpl(url, {
    headers: {Accept: 'application/json'},
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('Sanity query failed.');

  const payload = await response.json();
  if (!payload || typeof payload !== 'object' || !Object.hasOwn(payload, 'result')) {
    throw new Error('Sanity returned an invalid response.');
  }
  return payload.result;
}

export function createSanityProjectsGateway({fetchImpl = fetch} = {}) {
  return {
    async list(locale) {
      const result = await querySanity(projectsQuery, {locale}, fetchImpl);
      if (!Array.isArray(result)) throw new Error('Sanity returned an invalid project list.');
      return result;
    },
    async bySlug(slug, locale) {
      const result = await querySanity(projectBySlugQuery, {slug, locale}, fetchImpl);
      if (result !== null && (typeof result !== 'object' || Array.isArray(result))) {
        throw new Error('Sanity returned an invalid project.');
      }
      return result || undefined;
    },
    async adjacent(currentId) {
      const result = await querySanity(navigationQuery, {}, fetchImpl);
      if (!Array.isArray(result)) throw new Error('Sanity returned an invalid project list.');
      if (!result.length) return {prevId: null, nextId: null};

      const currentIndex = result.findIndex(
        project => project?._id === currentId || project?.slug?.current === currentId,
      );
      if (currentIndex === -1) return {prevId: null, nextId: null};

      const prevProject = currentIndex > 0 ? result[currentIndex - 1] : result[result.length - 1];
      const nextProject = currentIndex < result.length - 1 ? result[currentIndex + 1] : result[0];
      return {
        prevId: prevProject.slug?.current || prevProject._id || null,
        nextId: nextProject.slug?.current || nextProject._id || null,
      };
    },
  };
}

export function sanityLocaleFromAppLanguage(language) {
  if (language === 'pt-br') return 'ptBr';
  if (language === 'en') return 'en';
  return null;
}

export function isValidProjectSlug(value) {
  return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9._-]{0,159}$/.test(value);
}
