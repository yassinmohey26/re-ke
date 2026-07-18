import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJSON<T>(filename: string): Promise<T[]> {
  await ensureDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!existsSync(filePath)) return [];
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

async function writeJSON<T>(filename: string, data: T[]): Promise<void> {
  await ensureDir();
  const filePath = path.join(DATA_DIR, filename);
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äÄ]/g, 'ae').replace(/[öÖ]/g, 'oe').replace(/[üÜ]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ── Tours ─────────────────────────────────────────────────

export interface TourData {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number | null;
  duration: string;
  durationHours: number;
  maxGuests: number;
  difficulty: 'leicht' | 'mittel' | 'schwer';
  minAge: number;
  destination: string;
  destinationSlug: string;
  category: 'ganztag' | 'halbtag' | 'wassersport' | 'wuesten-safari';
  categoryLabel: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: { title: string; content: string }[];
  faqs: { question: string; answer: string }[];
  image: string;
  gallery: string[];
  meetingPoint: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getAllTours(): Promise<TourData[]> {
  return readJSON<TourData>('tours.json');
}

export async function getTourById(id: string): Promise<TourData | undefined> {
  const tours = await getAllTours();
  return tours.find(t => t.id === id);
}

export async function getTourBySlug(slug: string): Promise<TourData | undefined> {
  const tours = await getAllTours();
  return tours.find(t => t.slug === slug);
}

export async function createTour(data: Omit<TourData, 'id' | 'createdAt' | 'updatedAt'>): Promise<TourData> {
  const tours = await getAllTours();
  const tour: TourData = {
    ...data,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tours.push(tour);
  await writeJSON('tours.json', tours);
  return tour;
}

export async function updateTour(id: string, data: Partial<TourData>): Promise<TourData | null> {
  const tours = await getAllTours();
  const index = tours.findIndex(t => t.id === id);
  if (index === -1) return null;
  tours[index] = { ...tours[index], ...data, id, updatedAt: new Date().toISOString() };
  await writeJSON('tours.json', tours);
  return tours[index];
}

export async function deleteTour(id: string): Promise<boolean> {
  const tours = await getAllTours();
  const filtered = tours.filter(t => t.id !== id);
  if (filtered.length === tours.length) return false;
  await writeJSON('tours.json', filtered);
  return true;
}

// ── Blog Posts ────────────────────────────────────────────

export interface PostData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
  author: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getAllPosts(): Promise<PostData[]> {
  return readJSON<PostData>('posts.json');
}

export async function getPostById(id: string): Promise<PostData | undefined> {
  const posts = await getAllPosts();
  return posts.find(p => p.id === id);
}

export async function getPostBySlug(slug: string): Promise<PostData | undefined> {
  const posts = await getAllPosts();
  return posts.find(p => p.slug === slug);
}

export async function createPost(data: Omit<PostData, 'id' | 'createdAt' | 'updatedAt'>): Promise<PostData> {
  const posts = await getAllPosts();
  const post: PostData = {
    ...data,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  posts.push(post);
  await writeJSON('posts.json', posts);
  return post;
}

export async function updatePost(id: string, data: Partial<PostData>): Promise<PostData | null> {
  const posts = await getAllPosts();
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) return null;
  posts[index] = { ...posts[index], ...data, id, updatedAt: new Date().toISOString() };
  await writeJSON('posts.json', posts);
  return posts[index];
}

export async function deletePost(id: string): Promise<boolean> {
  const posts = await getAllPosts();
  const filtered = posts.filter(p => p.id !== id);
  if (filtered.length === posts.length) return false;
  await writeJSON('posts.json', filtered);
  return true;
}

export { slugify };
