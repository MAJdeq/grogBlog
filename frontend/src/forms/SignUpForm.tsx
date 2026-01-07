import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpForm } from "@/validation/valSchema";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/stores/AuthStore";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const SignUpForm = () => {
  const navigate = useNavigate();
  const { authorized } = useUserStore();

  const form = useForm<z.infer<typeof signUpForm>>({
    resolver: zodResolver(signUpForm),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      isSubscriber: false,
    },
  });

  const {
    formState: { errors }, // <-- destructure errors here
  } = form;

  const apiUrl = import.meta.env.VITE_API_URL;

  const onSubmit = async (values: z.infer<typeof signUpForm>) => {
    try {
      const response = await fetch(`${apiUrl}/auth/sign_up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
          name: values.name,
          password: values.password,
          isSubscriber: values.isSubscriber
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast(data.message);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      navigate("/");
    } catch (error) {
      console.error("There was an error fetching the data:", error);
    }
  };

  if (authorized) {
    navigate("/")
  }

  return (
    <div 
      className="min-h-screen w-full"
      style={{ 
        backgroundImage: "url('/golden-hour.png')", 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat' 
      }}
    >
      <div className="min-h-screen w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-50/95 to-slate-100/95 lg:from-slate-50 lg:to-slate-100 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Create an account
              </h1>
              <p className="text-slate-600 text-sm">
                Join GrogBlog and start your journey
              </p>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                </Label>
                <Input 
                  id="email"
                  className="h-11" 
                  placeholder="you@example.com" 
                  type="email"
                  {...form.register("email")} 
                  required 
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Name
                </Label>
                <Input 
                  id="name"
                  className="h-11" 
                  placeholder="Your full name" 
                  {...form.register("name")} 
                  required 
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <Input
                  id="password"
                  className="h-11"
                  placeholder="Create a strong password"
                  type="password"
                  {...form.register("password")}
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <Checkbox 
                  id="isSubscriber"
                  checked={form.watch("isSubscriber")}
                  onCheckedChange={(checked) => {
                    form.setValue("isSubscriber", checked === true);
                  }}
                  className="mt-1"
                />
                <Label 
                  htmlFor="isSubscriber" 
                  className="text-sm text-slate-600 leading-relaxed cursor-pointer"
                >
                  Subscribe to the GrogBlog newsletter for updates and insights
                </Label>
              </div>

              <Button 
                onClick={form.handleSubmit(onSubmit)}
                className="w-full h-11 text-base font-medium"
              >
                Create Account
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <a 
                  href="/sign_in" 
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Log in
                </a>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 mt-4 sm:mt-6 px-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};