import { prisma } from '../config/prisma.js';
import { ValidationError } from '../utils/AppError.js';

export interface AuthorDTO {
  name: string;
  bio?: string;
  birthDate?: string;
  nationality?: string;
}

export const authorService = {
  async createAuthor(data: AuthorDTO) {
    if (!data.name) {
      throw new ValidationError('Name is required');
    }

    return await prisma.author.create({
      data: {
        name: data.name,
        bio: data.bio,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        nationality: data.nationality,
      },
    });
  },
  /**
   * Get all authors
   */
  async getAllAuthors() {
    return await prisma.author.findMany({
      include: {
        books: true, // Include related books if needed
      },
    });
  },

  /**
   * Get author by ID
   */
  async getAuthorById(id: string) {
    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });

    if (!author) {
      throw new ValidationError('Author not found');
    }

    return author;
  },

  /**
   * Update an author
   */
  async updateAuthor(id: string, data: Partial<AuthorDTO>) {
    // Check if author exists
    await this.getAuthorById(id);

    return await prisma.author.update({
      where: { id },
      data: {
        name: data.name,
        bio: data.bio,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        nationality: data.nationality,
      },
    });
  },

  /**
   * Delete an author
   */
  async deleteAuthor(id: string) {
    const author = await this.getAuthorById(id);

    if (author.books && author.books.length > 0) {
      throw new ValidationError('Cannot delete author with associated books');
    }

    return await prisma.author.delete({
      where: { id },
    });
  },
};
