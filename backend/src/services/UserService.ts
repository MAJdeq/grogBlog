import { Role } from "@prisma/client";
import { prisma } from "../lib/db";
import jwt from "jsonwebtoken";
export const getSubscribers = async () => {
  const subscribers = await prisma.user.findMany({
    where: {
      isSubscriber: true
    },
    select: {
      id: true,
      email: true,
      name: true,
      subscriberToken: true,
    }
  });

  return { subscribers }
}

export const updateUserRole = async (userId: string, role: Role) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });
};

export const getUsers = async (cursor: string | undefined, limit: number) => {
  const users = await prisma.user.findMany({
    take: limit,
    ...(cursor && {
      skip: 1,
      cursor: {
        id: cursor // Use id instead of createdAt
      }
    }),
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
  
  // Use id as the next cursor
  const nextCursor = users.length === limit && users.length > 0
    ? users[users.length - 1].id
    : null;
  
  return {
    users,
    nextCursor
  };
};

export const unsubscribe = async (token: string) => {
  // Find user by token
  const user = await prisma.user.findUnique({
    where: { subscriberToken: token },
  });

  if (!user) {
    return { message: " Already unsubscribed "};
  } else {
      // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isSubscriber: false,
        subscriberToken: null,
      },
    });

    return { message: " Unsubscribed successfully "}
  }
};



export const subscribe = async (id: string, email: string) => {
  const token = jwt.sign(
      { id: id, email: email },
      email + process.env.JWT_SECRET!,
      { expiresIn: "1h" }
  );

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      isSubscriber: true,
      subscriberToken: token
    }
  })

  return { token }
}
