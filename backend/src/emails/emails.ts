import { getSubscribers } from "../services/UserService";
import { resend } from "./resend";

export const CreationNotis = async (ctx: string, itemTitle: string) => {
  console.log("=== CreationNotis START ===");
  console.log("ctx:", ctx);
  console.log("itemTitle:", itemTitle);
  
  try {
    console.log("Fetching subscribers...");
    const { subscribers } = await getSubscribers();
    console.log("Subscribers fetched:", subscribers);
    
    if (subscribers.length === 0) {
      console.log("No subscribers to notify");
      return { success: true, message: "No subscribers" };
    }
  
    
    console.log("About to call resend.batch.send...");
    
    const { data, error } = await resend.batch.send(
      subscribers.map(sub => ({
        from: 'Ethan Ford <mail@mail.grogblog.xyz>',
        to: [sub.email],
        subject: `New ${ctx}: ${itemTitle}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hey there! 👋</h2>
            
            <p>A new ${ctx} just dropped on GrogBlog:</p>
            
            <h3 style="color: #2563eb;">${itemTitle}</h3>
            
            <a href="https://grogblog.xyz" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Read Now
            </a>
            
            <p style="color: #666; font-size: 14px; margin-top: 40px;">
              You're receiving this because you subscribed to GrogBlog updates.
              <br/>
              <a href="${process.env.FRONTEND_URL}/unsubscribe" style="color: #666;">Unsubscribe</a>
            </p>
          </div>
        `,
      }))
    );

    
    console.log("resend.batch.send completed");
    console.log("Data:", data);
    console.log("Error:", error);
    
    if (error) {
      console.error("Error sending notification emails:", error);
      return { success: false, error };
    }
    
    console.log("Notification emails sent successfully!");
    return { success: true, data };
    
  } catch (err) {
    console.error("!!! CAUGHT ERROR in CreationNotis !!!", err);
    return { success: false, error: err };
  } finally {
    console.log("=== CreationNotis END ===");
  }
};

export const OTP = async (otp :string, email: string) => {
  try {
    console.log(email)
    const { data, error } = await resend.emails.send({
      from: 'Ethan Ford <mail@mail.grogblog.xyz>',
      to: [email],
      subject: "Your One-Time Password (OTP) for GrogBlog",
      html: `
        <div style="
          font-family: 'Helvetica', Arial, sans-serif; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background-color: #f9fafb; 
          border-radius: 10px;
          text-align: center;
        ">
          <h2 style="color: #111827;">Hello there! 👋</h2>
          <p style="color: #374151; font-size: 16px;">
            Use the following one-time password to continue your login or reset your password. 
            It will expire in <strong>5 minutes</strong>.
          </p>
          
          <div style="
            display: inline-block; 
            margin: 20px auto; 
            padding: 20px 40px; 
            font-size: 32px; 
            font-weight: bold; 
            color: #ffffff; 
            background-color: #111827; 
            border-radius: 8px; 
            letter-spacing: 4px;
          ">
            ${otp}
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
            If you didn't request this, you can safely ignore this email.
          </p>

          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
            — GrogBlog Team
          </p>
        </div>
      `,
    });


      if (error) {
        console.error("Error sending otp emails:", error);
        return { success: false, error };
      }
      
      console.log("Otp emails sent successfully!");
      return { success: true, data };
  } catch (e: any) {
    console.error("!!! CAUGHT ERROR in CreationNotis !!!", e);
    return { success: false, error: e };
  }
}