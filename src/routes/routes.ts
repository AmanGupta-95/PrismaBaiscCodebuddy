import { Router } from 'express';
import {
  createAuthor,
  deleteAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
} from '../controller/author.controller.js';
import {
  createGenre,
  deleteGenre,
  getAllGenres,
  getGenreById,
  updateGenre,
} from '../controller/genre.controller.js';
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from '../controller/book.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Author routes
router.post('/authors', asyncHandler(createAuthor));
router.get('/authors', asyncHandler(getAllAuthors));
router.get('/authors/:id', asyncHandler(getAuthorById));
router.put('/authors/:id', asyncHandler(updateAuthor));
router.delete('/authors/:id', asyncHandler(deleteAuthor));

// Genre routes
router.post('/genres', asyncHandler(createGenre));
router.get('/genres', asyncHandler(getAllGenres));
router.get('/genres/:id', asyncHandler(getGenreById));
router.put('/genres/:id', asyncHandler(updateGenre));
router.delete('/genres/:id', asyncHandler(deleteGenre));

// Book routes
router.post('/books', asyncHandler(createBook));
router.get('/books', asyncHandler(getAllBooks)); // Supports ?authorId=xxx or ?genreId=xxx
router.get('/books/:id', asyncHandler(getBookById));
router.put('/books/:id', asyncHandler(updateBook));
router.delete('/books/:id', asyncHandler(deleteBook));

export default router;
