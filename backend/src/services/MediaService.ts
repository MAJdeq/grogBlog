import { prisma } from "../lib/db";

export const addMedia = async (title: string, authorId: string, content: string, rating: number, type: string, bannerUrl: string) => {
  const newMedia = await prisma.mediaReview.create({
    data: {
      title,
      authorId,
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

export const like = async (userId: string, itemId: string, itemType: string) => {
  if (!userId || !itemId || !itemType) {
    throw new Error("Missing required parameters for like");
  }

  const existing = await prisma.like.findUnique({
    where: { userId_itemId_itemType: { userId, itemId, itemType } }
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return { liked: false };
  }

  await prisma.like.create({ data: { userId, itemId, itemType } });
  return { liked: true };
};


export const checkLike = async (id: string, blogId: string, type: string) => {
  const isLiked =  await prisma.like.findUnique({
    where: {
      userId_itemId_itemType: {
        userId: id,
        itemId: blogId,
        itemType: type
      }
    }
  })
  const likedCount = await prisma.like.count({
    where: {
      itemId: blogId,
      itemType: type
    }
  })

  if (isLiked) {
    return { liked: true, likedCount };
  } else {
    return { liked: false, likedCount };
  }
}


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
