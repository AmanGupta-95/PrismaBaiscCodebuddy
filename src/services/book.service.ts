import { prisma } from '../config/prisma.js';
import { ValidationError } from '../utils/AppError.js';

export interface BookDTO {
  title: string;
  isbn?: string;
  authorId: string;
  genreIds?: string[];
  publishedDate?: string;
  pages?: number;
  description?: string;
  language?: string;
}

export const bookService = {
  /**
   * Create a new book with genres
   */
  async createBook(data: BookDTO) {
    if (!data.title) {
      throw new ValidationError('Title is required');
    }

    if (!data.authorId) {
      throw new ValidationError('Author ID is required');
    }

    // Verify author exists
    const author = await prisma.author.findUnique({
      where: { id: data.authorId },
    });

    if (!author) {
      throw new ValidationError('Author not found');
    }

    // Verify all genres exist if provided
    if (data.genreIds && data.genreIds.length > 0) {
      const genres = await prisma.genre.findMany({
        where: { id: { in: data.genreIds } },
      });

      if (genres.length !== data.genreIds.length) {
        throw new ValidationError('One or more genres not found');
      }
    }

    // Create book with genres
    const book = await prisma.book.create({
      data: {
        title: data.title,
        isbn: data.isbn,
        authorId: data.authorId,
        publishedDate: data.publishedDate
          ? new Date(data.publishedDate)
          : undefined,
        pages: data.pages,
        description: data.description,
        language: data.language || 'English',
        genres: {
          create:
            data.genreIds?.map((genreId) => ({
              genreId,
            })) || [],
        },
      },
      include: {
        author: true,
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    return book;
  },

  /**
   * Get all books with optional filters
   */
  async getAllBooks(filters?: { authorId?: string; genreId?: string }) {
    const where: any = {};

    if (filters?.authorId) {
      where.authorId = filters.authorId;
    }

    if (filters?.genreId) {
      where.genres = {
        some: {
          genreId: filters.genreId,
        },
      };
    }

    return await prisma.book.findMany({
      where,
      include: {
        author: true,
        genres: {
          include: {
            genre: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Get book by ID with author's total books and genres with their total books
   */
  async getBookById(id: string) {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    if (!book) {
      throw new ValidationError('Book not found');
    }

    // Get total books by this author
    const authorBooksCount = await prisma.book.count({
      where: { authorId: book.authorId },
    });

    // Get total books for each genre
    const genresWithCount = await Promise.all(
      book.genres.map(async (bookGenre) => {
        const genreBooksCount = await prisma.bookGenre.count({
          where: { genreId: bookGenre.genreId },
        });

        return {
          id: bookGenre.genre.id,
          name: bookGenre.genre.name,
          description: bookGenre.genre.description,
          totalBooks: genreBooksCount,
        };
      }),
    );

    return {
      id: book.id,
      title: book.title,
      isbn: book.isbn,
      publishedDate: book.publishedDate,
      pages: book.pages,
      description: book.description,
      language: book.language,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
      author: {
        id: book.author.id,
        name: book.author.name,
        bio: book.author.bio,
        birthDate: book.author.birthDate,
        nationality: book.author.nationality,
        totalBooks: authorBooksCount,
      },
      genres: genresWithCount,
    };
  },

  /**
   * Update a book
   */
  async updateBook(id: string, data: Partial<BookDTO>) {
    // Check if book exists
    await this.getBookById(id);

    // If authorId is being updated, verify the new author exists
    if (data.authorId) {
      const author = await prisma.author.findUnique({
        where: { id: data.authorId },
      });

      if (!author) {
        throw new ValidationError('Author not found');
      }
    }

    // If genreIds are provided, update the genres
    if (data.genreIds !== undefined) {
      if (data.genreIds.length > 0) {
        // Verify all genres exist
        const genres = await prisma.genre.findMany({
          where: { id: { in: data.genreIds } },
        });

        if (genres.length !== data.genreIds.length) {
          throw new ValidationError('One or more genres not found');
        }
      }

      // Delete existing genre associations and create new ones
      await prisma.bookGenre.deleteMany({
        where: { bookId: id },
      });

      if (data.genreIds.length > 0) {
        await prisma.bookGenre.createMany({
          data: data.genreIds.map((genreId) => ({
            bookId: id,
            genreId,
          })),
        });
      }
    }

    // Update the book
    const book = await prisma.book.update({
      where: { id },
      data: {
        title: data.title,
        isbn: data.isbn,
        authorId: data.authorId,
        publishedDate: data.publishedDate
          ? new Date(data.publishedDate)
          : undefined,
        pages: data.pages,
        description: data.description,
        language: data.language,
      },
      include: {
        author: true,
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    return book;
  },

  /**
   * Delete a book
   * BookGenre entries will be automatically deleted due to schema cascade
   */
  async deleteBook(id: string) {
    // Check if book exists
    await this.getBookById(id);

    return await prisma.book.delete({
      where: { id },
    });
  },
};
