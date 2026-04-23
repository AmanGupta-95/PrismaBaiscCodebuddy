import Router from 'express';
import { createAuthor } from '../controller/author.controller';

const router = Router();

// Author routes
router.post('/authors', createAuthor);

export default router;
