import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { ValidationError } from '../utils/AppError';

export const createAuthor = async (req: Request, res: Response) => {
  const { name, bio, birthDate, nationality } = req.body;

  // Validate required fields
  if (!name) {
    throw new ValidationError('Name is required');
  }

  // Create the author
  const author = await prisma.author.create({
    data: {
      name,
      bio,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      nationality,
    },
  });

  return res.status(201).json({
    success: true,
    message: 'Author created successfully',
    data: author,
  });
};
