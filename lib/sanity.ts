import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SanityImageSource = any;

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2025-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN, // Only needed for mutations
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ── GROQ Queries ────────────────────────────────────────────────

export const GET_ALL_POSTS = `*[_type == "post" && status == "published"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  "category": category->{ name, slug },
  mainImage,
  readTime
}`;

export const GET_POST_BY_SLUG = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  content,
  publishedAt,
  "category": category->{ name, slug },
  mainImage,
  readTime,
  "related": *[_type == "post" && status == "published" && slug.current != $slug] | order(publishedAt desc)[0..2] {
    _id, title, slug, mainImage, publishedAt
  }
}`;

export const GET_ALL_TOURS = `*[_type == "tour" && status == "active"] | order(_createdAt asc) {
  _id,
  name,
  slug,
  shortDescription,
  price,
  duration,
  "destination": destination->{ name, slug },
  mainImage,
  highlights,
  difficulty,
  minAge
}`;

export const GET_TOUR_BY_SLUG = `*[_type == "tour" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  shortDescription,
  description,
  price,
  duration,
  "destination": destination->{ name, slug },
  mainImage,
  gallery,
  highlights,
  included,
  notIncluded,
  difficulty,
  minAge,
  maxGuests,
  meetingPoint
}`;

export const GET_ALL_DESTINATIONS = `*[_type == "destination"] | order(name asc) {
  _id,
  name,
  slug,
  tagline,
  description,
  mainImage,
  "tourCount": count(*[_type == "tour" && references(^._id) && status == "active"])
}`;

export const GET_HOMEPAGE_DATA = `{
  "featuredTours": *[_type == "tour" && status == "active" && featured == true] | order(_createdAt asc)[0..5] {
    _id, name, slug, price, duration, mainImage,
    "destination": destination->{ name, slug }
  },
  "recentPosts": *[_type == "post" && status == "published"] | order(publishedAt desc)[0..2] {
    _id, title, slug, excerpt, publishedAt, mainImage,
    "category": category->{ name }
  }
}`;
