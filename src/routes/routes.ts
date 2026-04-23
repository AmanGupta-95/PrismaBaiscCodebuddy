import Router from 'express';
import {
  createAuthor,
  deleteAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
} from '../controller/author.controller';
import {
  createGenre,
  deleteGenre,
  getAllGenres,
  getGenreById,
  updateGenre,
} from '../controller/genre.controller';
import { asyncHandler } from '../utils/asyncHandler';

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

export default router;
