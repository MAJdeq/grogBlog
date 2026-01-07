import { Resend } from 'resend';

if (!process.env.RESEND_KEY) {
  console.warn('⚠️ RESEND_KEY is not set. Email notifications will not work.');
}

export const resend = new Resend(process.env.RESEND_KEY || 'dummy-key');