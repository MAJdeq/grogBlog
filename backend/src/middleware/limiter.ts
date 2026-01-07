import { Request, Response, NextFunction } from "express";

// Configuration
const BUCKET_CAPACITY = 20;   // Max tokens per IP
const REFILL_INTERVAL = 2000; // 2 seconds
const REFILL_AMOUNT = 1;      // Tokens added per interval

// Token bucket per IP
type Bucket = {
  tokens: number;
  lastRefill: number;
};

// Map to store buckets per IP
const buckets = new Map<string, Bucket>();

export function limiter(req: Request, res: Response, next: NextFunction) {
  const clientIp = req.ip || req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress;

  if (!clientIp) {
    // fallback if we can't determine IP
    return res.status(400).json({ message: "Cannot determine client IP" });
  }

  let bucket = buckets.get(clientIp);

  const now = Date.now();

  if (!bucket) {
    bucket = {
      tokens: BUCKET_CAPACITY,
      lastRefill: now,
    };
    buckets.set(clientIp, bucket);
  } else {
    // Refill tokens based on elapsed time
    const elapsed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor(elapsed / REFILL_INTERVAL) * REFILL_AMOUNT;
    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(bucket.tokens + tokensToAdd, BUCKET_CAPACITY);
      bucket.lastRefill = now;
    }
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1; // consume token
    next();
  } else {
    res.status(429).json({ message: "Too many requests, slow down!" });
  }
}
