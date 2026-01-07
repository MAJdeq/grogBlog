import type { Request, Response } from "express";
import * as subscriberService from "../services/SubscriberService";


export const get_subscribers = async (req: Request, res: Response) => {

  try {

    const { subscribers } = await subscriberService.getSubscribers();

    res.json({ subscribers: subscribers })
    
  } catch (e: any) {
    res.status(401).json({ message: e.message });
  }
};

export const unsubscribe = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        if (!token) {
          return res.status(400).json({ message: "Missing token" });
        }

        const { message } = await subscriberService.unsubscribe(token);
        
        res.status(200).json({ message: message })
    } catch (e: any) {
        res.status(401).json({message: e.message})
    }
}

export const subscribe = async (req: Request, res: Response) => {
  try {
    const { id, email } = req.body;

    const { token } = await subscriberService.subscribe(id, email);

    res.status(200).json({ 
      message: "Subscribed successfully!",
      token: token
     });

  } catch (e: any) {
    res.status(400).json({ message: e.message || "Subscription failed." });
  }
}
