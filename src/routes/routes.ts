import Router from 'express';
import { createAuthor } from '../controller/author.controller';
import { createGenre } from '../controller/genre.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Author routes
router.post('/authors', asyncHandler(createAuthor));

// Genre routes
router.post('/genres', asyncHandler(createGenre));

export default router;
