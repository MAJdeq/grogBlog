import { prisma } from "../lib/db";


export const addBlog = async (
  title: string, 
  authorId: string, 
  content: string, 
  bannerUrl: string
) => {
  const newBlog = await prisma.blog.create({
    data: {
      title,
      content,
      bannerUrl,
      authorId, // This connects the blog to the user
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  });
  
  return { newBlog };
};

export const getBlogs = async () => {
  return await prisma.blog.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const getBlog = async (id: string) => {
  return await prisma.blog.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const deleteBlog = async (id: string) => {
  if (!id) throw new Error("Invalid blog ID");
  const blog = await prisma.blog.delete({
    where: {
      id: id
    }
  })

  return blog
}

// services/blogService.ts
export const updateBlog = async (id: string, data: {
  title?: string;
  content?: string;
  bannerUrl?: string;
  updatedAt?: Date;
}) => {
  return prisma.blog.update({
    where: { id },
    data,
  });
};
