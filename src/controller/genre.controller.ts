import { Request, Response } from 'express';
import { GenreDTO, genreService } from '../services/genre.service';

export const createGenre = async (req: Request, res: Response) => {
  const genre = await genreService.createGenre(req.body as GenreDTO);

  return res.status(201).json({
    success: true,
    message: 'Genre created successfully',
    data: genre,
  });
};

export const getAllGenres = async (req: Request, res: Response) => {
  const genres = await genreService.getAllGenres();

  return res.status(200).json({
    success: true,
    data: genres,
  });
};

export const getGenreById = async (req: Request, res: Response) => {
  const genre = await genreService.getGenreById(req.params.id as string);

  return res.status(200).json({
    success: true,
    data: genre,
  });
};

export const updateGenre = async (req: Request, res: Response) => {
  const genre = await genreService.updateGenre(
    req.params.id as string,
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: 'Genre updated successfully',
    data: genre,
  });
};

export const deleteGenre = async (req: Request, res: Response) => {
  // Allow force deletion via query parameter
  const force = req.query.force === 'true';

  await genreService.deleteGenre(req.params.id as string, { force });

  return res.status(200).json({
    success: true,
    message: 'Genre deleted successfully',
  });
};
