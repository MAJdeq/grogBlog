import { prisma } from "../lib/db";

export const addBlog = async (title: string, authorId: string, content: string, bannerUrl: string) => {
  const newBlog = await prisma.blog.create({
    data: {
        title,
        author: {
          connect: {
            id: authorId
          }
        },
        content,
        bannerUrl
    }
  })

  return { newBlog }
};

export const getBlogs = async () => {
  const blogs = await prisma.blog.findMany();

  return blogs
}

export const getBlog = async (id: string) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id: id
    }
  })

  return blog
}

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
