import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signInForm } from "@/validation/valSchema";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/stores/AuthStore";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { toast } from "sonner";
export const SignInForm = () => {
  const navigate = useNavigate();
  const { authorized } = useUserStore();
  
  useEffect(() => {
    if (authorized) {
      navigate("/");
    }
  }, [authorized, navigate]);
  
  const form = useForm<z.infer<typeof signInForm>>({
    resolver: zodResolver(signInForm),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { errors }, // <-- destructure errors here
  } = form;
  
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const onSubmit = async (values: z.infer<typeof signInForm>) => {
    try {
      const response = await fetch(`${apiUrl}/auth/sign_in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) {
        toast(data.message)
        throw new Error("Sign-in failed");
      }
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  
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
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Welcome back
              </h1>
              <p className="text-slate-600 text-sm">Sign in to your account</p>
            </div>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  className="h-11"
                  placeholder="you@example.com"
                  type="email"
                  {...form.register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  className="h-11"
                  placeholder="Enter your password"
                  type="password"
                  {...form.register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full h-11 text-base font-medium">
                Sign In
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <a
                  href="/sign_up"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Sign up
                </a>
              </p>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Forgot your Password ?{" "}
                <a
                  href="/forgot_password"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Reset Password  
                </a>
              </p>
            </div>
          </div>
          
          <p className="text-center text-xs text-slate-500 mt-4 sm:mt-6 px-4">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};