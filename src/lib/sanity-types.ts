
export interface SanityImage {
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

export interface Project {
  _id: string | number; // Compatibilidade com dados atuais (number) e Sanity (string)
  title: string;
  slug: { current: string };
  category: string;
  role: string;
  year: string;
  client: string;
  description: string; // No futuro pode ser PortableTextBlock[]
  challenge: string;
  solution: string;
  // Permitir string (URL direta atual) ou objeto SanityImage
  mainImage: string | SanityImage; 
  gallery: Array<string | SanityImage>;
  metric: string;
  color: string;
  stack: string[];
}
