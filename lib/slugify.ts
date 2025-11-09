import { prisma } from '@/lib/db';

/**
 * Generate a URL-friendly slug from a string
 * Converts to lowercase, replaces spaces with hyphens, removes special characters
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug for a ranch name
 * Checks database for existing slugs and appends number if duplicate
 * @param name - Ranch name to convert to slug
 * @returns Unique slug string
 */
export async function generateUniqueRanchSlug(name: string): Promise<string> {
  const baseSlug = createSlug(name);
  let slug = baseSlug;
  let counter = 2;

  // Check if slug already exists
  while (await slugExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Check if a slug already exists in the database
 */
async function slugExists(slug: string): Promise<boolean> {
  const existing = await prisma.ranch.findUnique({
    where: { slug },
  });
  return existing !== null;
}
