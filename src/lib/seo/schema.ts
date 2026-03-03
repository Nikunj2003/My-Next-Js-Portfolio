import { PROJECTS_CARD } from "@/data/projects";
import { siteMetadata } from "@/data/siteMetaData.mjs";

const personId = `${siteMetadata.siteUrl}#person`;
const websiteId = `${siteMetadata.siteUrl}#website`;

export function toJsonLd(schema: Record<string, unknown>): string {
  return JSON.stringify(schema);
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    url: siteMetadata.siteUrl,
    name: siteMetadata.siteName,
    inLanguage: siteMetadata.locale,
  };
}

export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: siteMetadata.author,
    url: siteMetadata.siteUrl,
    image: `${siteMetadata.siteUrl}${siteMetadata.image}`,
    sameAs: [siteMetadata.github, siteMetadata.linkedin],
    jobTitle: siteMetadata.description,
    email: siteMetadata.email,
  };
}

export function getAboutProfilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteMetadata.siteUrl}/about#profile-page`,
    url: `${siteMetadata.siteUrl}/about`,
    name: `About ${siteMetadata.author}`,
    isPartOf: {
      "@id": websiteId,
    },
    about: {
      "@id": personId,
    },
    mainEntity: {
      "@id": personId,
    },
  };
}

export function getProjectsCollectionPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteMetadata.siteUrl}/projects#collection-page`,
    url: `${siteMetadata.siteUrl}/projects`,
    name: `${siteMetadata.author} Projects`,
    isPartOf: {
      "@id": websiteId,
    },
    about: {
      "@id": personId,
    },
  };
}

export function getProjectsItemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteMetadata.siteUrl}/projects#item-list`,
    itemListElement: PROJECTS_CARD.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.name,
        description: project.description,
        url: project.liveWebsiteHref || project.sourceCodeHref,
        creator: {
          "@id": personId,
        },
        keywords: project.technologies.join(", "),
      },
    })),
  };
}

export function getAboutBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteMetadata.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: `${siteMetadata.siteUrl}/about`,
      },
    ],
  };
}

export function getProjectsBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteMetadata.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${siteMetadata.siteUrl}/projects`,
      },
    ],
  };
}
