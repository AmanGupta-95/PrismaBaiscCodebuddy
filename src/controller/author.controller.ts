import { Request, Response } from 'express';
import { AuthorDTO, authorService } from '../services/author.service.js';

export const createAuthor = async (req: Request, res: Response) => {
  const author = await authorService.createAuthor(req.body as AuthorDTO);

  return res.status(201).json({
    success: true,
    message: 'Author created successfully',
    data: author,
  });
};

export const getAllAuthors = async (req: Request, res: Response) => {
  const authors = await authorService.getAllAuthors();

  return res.status(200).json({
    success: true,
    data: authors,
  });
};

export const getAuthorById = async (req: Request, res: Response) => {
  const author = await authorService.getAuthorById(req.params.id as string);

  return res.status(200).json({
    success: true,
    data: author,
  });
};

export const updateAuthor = async (req: Request, res: Response) => {
  const author = await authorService.updateAuthor(
    req.params.id as string,
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: 'Author updated successfully',
    data: author,
  });
};

export const deleteAuthor = async (req: Request, res: Response) => {
  await authorService.deleteAuthor(req.params.id as string);

  return res.status(200).json({
    success: true,
    message: 'Author deleted successfully',
  });
};
