export interface MetricItem {
  label: string;
  value: string | number;
}

export interface WorkItem {
  id: string;
  slug?: string;
  body?: string;
  html?: string;
  data: {
    title: string;
    description: string;
    publishDate: string;
    tags?: string[];
    role: string;
    coverImage?: string;
    metrics?: MetricItem[];
    category?: string;
    subcategory?: string;
    parent?: string;
    subparent?: string;
    order?: number;
    title_pt?: string;
    title_en?: string;
    description_pt?: string;
    description_en?: string;
    role_pt?: string;
    role_en?: string;
  };
}

export interface StudyCaseItem {
  id: string;
  slug?: string;
  body?: string;
  html?: string;
  data: {
    title: string;
    description: string;
    publishDate: string;
    tags?: string[];
    role: string;
    coverImage?: string;
    metrics?: MetricItem[];
    category?: string;
    subcategory?: string;
    parent?: string;
    subparent?: string;
    order?: number;
    title_pt?: string;
    title_en?: string;
    description_pt?: string;
    description_en?: string;
    role_pt?: string;
    role_en?: string;
  };
}
