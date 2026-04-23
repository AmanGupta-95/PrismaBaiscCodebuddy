import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { ValidationError } from '../utils/AppError';

export const createGenre = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  // Validate required fields
  if (!name) {
    throw new ValidationError('Name is required');
  }

  // Create the genre
  const genre = await prisma.genre.create({
    data: {
      name,
      description,
    },
  });

  return res.status(201).json({
    success: true,
    message: 'Genre created successfully',
    data: genre,
  });
};
