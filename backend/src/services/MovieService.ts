import { prisma } from "../lib/db";

export const addMovie = async (title: string, content: string, rating: number, bannerUrl: string) => {
  const newMovie = await prisma.movieReview.create({
    data: {
      title,
      content,
      rating,     // number now
      bannerUrl
    }
  });

  return { newMovie };
};


export const getMovies = async () => {
  const movies = await prisma.movieReview.findMany();

  return movies
}

export const getMovie = async (id: string) => {
  const movie = await prisma.movieReview.findUnique({
    where: {
      id: id
    }
  })

  return movie
}

export const deleteMovie = async (id: string) => {
  if (!id) throw new Error("Invalid blog ID");
  const movie = await prisma.movieReview.delete({
    where: {
      id: id
    }
  })

  return movie
}


export const updateMovie = async (id: string, data: {
  title?: string;
  content?: string;
  bannerUrl?: string;
  rating?: number;
  updatedAt?: Date;
}) => {
  return prisma.movieReview.update({
    where: { id },
    data,
  });
};
