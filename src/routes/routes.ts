import Router from 'express';
import { createAuthor } from '../controller/author.controller';
import { createGenre } from '../controller/genre.controller';

const router = Router();

// Author routes
router.post('/authors', createAuthor);

// Genre routes
router.post('/genres', createGenre);

export default router;
