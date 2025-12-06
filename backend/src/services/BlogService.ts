import { prisma } from "../lib/db";

export const addBlog = async (title: string, content: string, bannerUrl: string) => {
  const newBlog = await prisma.blog.create({
    data: {
        title,
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