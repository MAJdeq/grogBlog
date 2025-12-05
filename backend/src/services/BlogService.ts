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