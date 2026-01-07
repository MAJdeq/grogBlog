import type { Request, Response } from "express";
import * as userService from "../services/UserService";
import { prisma } from "../lib/db";
import { Role } from "@prisma/client";


export const get_subscribers = async (req: Request, res: Response) => {

  try {

    const { subscribers } = await userService.getSubscribers();

    res.json({ subscribers: subscribers })
    
  } catch (e: any) {
    res.status(401).json({ message: e.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const cursor = req.query.cursor as string | undefined;
    
    const result = await userService.getUsers(cursor, limit);
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// controllers/UserController.ts
export const updateRole = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.body;
    
    // Get the target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent changing ADMIN or SUPERADMIN roles
    if (targetUser.role === 'ADMIN' || targetUser.role === 'SUPERADMIN') {
      return res.status(403).json({ 
        error: 'Cannot modify admin or super admin roles' 
      });
    }

    // Validate that role is a valid Role enum value
    if (!Object.values(Role).includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    const result = await userService.updateUserRole(userId, role);
    
    res.json(result);
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
};

export const unsubscribe = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        if (!token) {
          return res.status(400).json({ message: "Missing token" });
        }

        const { message } = await userService.unsubscribe(token);
        
        res.status(200).json({ message: message })
    } catch (e: any) {
        res.status(401).json({message: e.message})
    }
}

export const subscribe = async (req: Request, res: Response) => {
  try {
    const { id, email } = req.body;

    const { token } = await userService.subscribe(id, email);

    res.status(200).json({ 
      message: "Subscribed successfully!",
      token: token
     });

  } catch (e: any) {
    res.status(400).json({ message: e.message || "Subscription failed." });
  }
}
