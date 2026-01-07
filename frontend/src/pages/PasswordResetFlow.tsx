import * as z from "zod";
import { useState } from "react";
import { requestOtpForm, verifyOtpForm, resetPassword } from "@/validation/valSchema";
import { VerifyOtpForm } from "@/forms/VerifyOtpForm";
import { RequestOtpForm } from "@/forms/RequestOtpForm";
import { ResetPasswordForm } from "@/forms/ResetPasswordForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const PasswordResetFlow = () => { 
  const [step, setStep] = useState(1);
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const handleRequestOtp = async (values: z.infer<typeof requestOtpForm>) => {
    try {
      const response = await fetch(`${apiUrl}/otp/generate_otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
          purpose: "request_password"
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        toast(data.message)
        return;
      }
      setEmail(values.email);
      setStep(2);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyOtp = async (values: z.infer<typeof verifyOtpForm>) => {
    try {
      console.log("GOING")
      const response = await fetch(`${apiUrl}/otp/verify_otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          otp: values.otp,
          purpose: "request_password"
        }),
      });
      if (!response.ok) {
        toast("Otp verification failed")
        return;
      }

      const data = await response.json();

      setResetToken(data.resetToken)
      setStep(3);
    } catch (err) {
      console.error(err);
    }
  }

  const handleReset = async (values: z.infer<typeof resetPassword>) => {
    try {
      console.log("GOING")
      const response = await fetch(`${apiUrl}/auth/reset_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          password: values.password,
          resetToken: resetToken
        }),
      });
      if (!response.ok) {
        toast("Password reset failed")
        return;
      }
      navigate('/sign_in');
    } catch (err) {
      console.error(err);
    }
  }
  
  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: "url('/golden-hour.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="min-h-screen w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-50/95 to-slate-100/95 lg:from-slate-50 lg:to-slate-100 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {step == 1 && (
            <RequestOtpForm handler={handleRequestOtp}/>
          )}
          {step == 2 && (
            <VerifyOtpForm handler={handleVerifyOtp} />
          )}
          {step == 3 && (
            <ResetPasswordForm handler={handleReset} />
          )}
        </div>
      </div>
    </div>
  );
};