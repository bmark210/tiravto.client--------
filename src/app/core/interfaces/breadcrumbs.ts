export interface Breadcrumbs {
  title: string;
  url: string;
  links: BreadcrumbsLinked[];
  linkType: number;
}

export interface BreadcrumbsLinked {
  title: string;
  url: string;
  linkType: number;
}
