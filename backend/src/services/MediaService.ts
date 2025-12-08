import { prisma } from "../lib/db";

export const addMedia = async (title: string, content: string, rating: number, type: string, bannerUrl: string) => {
  const newMedia = await prisma.mediaReview.create({
    data: {
      title,
      content,
      type,
      rating,     // number now
      bannerUrl
    }
  });

  return { newMedia };
};


export const getMediaTypes = async (type?: string) => {
  return prisma.mediaReview.findMany({
    where: type ? { type } : undefined,
  });
};


export const getMediaType = async (id: string) => {
  const media = await prisma.mediaReview.findUnique({
    where: {
      id: id
    }
  })

  return media
}

export const deleteMedia = async (id: string) => {
  if (!id) throw new Error("Invalid blog ID");
  const media = await prisma.mediaReview.delete({
    where: {
      id: id
    }
  })

  return media
}


export const updateMedia = async (id: string, data: {
  title?: string;
  content?: string;
  bannerUrl?: string;
  rating?: number;
  updatedAt?: Date;
}) => {
  return prisma.mediaReview.update({
    where: { id },
    data,
  });
};
