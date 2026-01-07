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
