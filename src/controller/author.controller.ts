import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const createAuthor = async (req: Request, res: Response) => {
  try {
    const { name, bio, birthDate, nationality } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
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
  } catch (error) {
    console.error('Error creating author:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create author',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
