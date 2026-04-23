import { prisma } from '../config/prisma';
import { ValidationError } from '../utils/AppError';

export interface GenreDTO {
  name: string;
  description?: string;
}

export const genreService = {
  /**
   * Create a new genre
   */
  async createGenre(data: GenreDTO) {
    if (!data.name) {
      throw new ValidationError('Name is required');
    }

    return await prisma.genre.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
  },

  /**
   * Get all genres
   */
  async getAllGenres() {
    return await prisma.genre.findMany({
      include: {
        books: {
          include: {
            book: true,
          },
        },
      },
    });
  },

  /**
   * Get genre by ID
   */
  async getGenreById(id: string) {
    const genre = await prisma.genre.findUnique({
      where: { id },
      include: {
        books: {
          include: {
            book: {
              include: {
                author: true,
              },
            },
          },
        },
      },
    });

    if (!genre) {
      throw new ValidationError('Genre not found');
    }

    return genre;
  },

  /**
   * Update a genre
   */
  async updateGenre(id: string, data: Partial<GenreDTO>) {
    // Check if genre exists
    await this.getGenreById(id);

    return await prisma.genre.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    });
  },

  /**
   * Delete a genre
   * Note: BookGenre entries will be automatically deleted due to schema cascade
   */
  async deleteGenre(id: string, options?: { force?: boolean }) {
    const genre = await this.getGenreById(id);
    const force = options?.force || false;

    // Check if genre is associated with books
    if (genre.books && genre.books.length > 0) {
      if (!force) {
        throw new ValidationError(
          `Cannot delete genre associated with ${genre.books.length} book(s). Use force=true to delete anyway.`,
        );
      }
      // If force=true, proceed with deletion
      // BookGenre entries will be automatically deleted by Prisma due to onDelete: Cascade
    }

    return await prisma.genre.delete({
      where: { id },
    });
  },
};
