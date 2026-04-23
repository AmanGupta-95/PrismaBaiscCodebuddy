import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const createGenre = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
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
  } catch (error) {
    console.error('Error creating genre:', error);

    // Handle unique constraint violation (duplicate genre name)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return res.status(409).json({
        success: false,
        message: 'Genre with this name already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create genre',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
