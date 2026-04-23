import { Request, Response } from 'express';
import { BookDTO, bookService } from '../services/book.service.js';

export const createBook = async (req: Request, res: Response) => {
  const book = await bookService.createBook(req.body as BookDTO);

  return res.status(201).json({
    success: true,
    message: 'Book created successfully',
    data: book,
  });
};

export const getAllBooks = async (req: Request, res: Response) => {
  const { authorId, genreId } = req.query;

  const books = await bookService.getAllBooks({
    authorId: authorId as string,
    genreId: genreId as string,
  });

  return res.status(200).json({
    success: true,
    data: books,
  });
};

export const getBookById = async (req: Request, res: Response) => {
  const book = await bookService.getBookById(req.params.id as string);

  return res.status(200).json({
    success: true,
    data: book,
  });
};

export const updateBook = async (req: Request, res: Response) => {
  const book = await bookService.updateBook(req.params.id as string, req.body);

  return res.status(200).json({
    success: true,
    message: 'Book updated successfully',
    data: book,
  });
};

export const deleteBook = async (req: Request, res: Response) => {
  await bookService.deleteBook(req.params.id as string);

  return res.status(200).json({
    success: true,
    message: 'Book deleted successfully',
  });
};
