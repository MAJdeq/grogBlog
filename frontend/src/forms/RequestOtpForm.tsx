import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { requestOtpForm } from "@/validation/valSchema";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";

export const RequestOtpForm = ({ handler }: { handler: SubmitHandler<{ email: string;}> }) => {  
  const form = useForm<z.infer<typeof requestOtpForm>>({
    resolver: zodResolver(requestOtpForm),
    defaultValues: {
      email: "",
    },
  });
  
  const {
    formState: { errors }, // <-- destructure errors here
  } = form;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Request a Code
        </h1>
        <p className="text-slate-600 text-sm">Enter your email to request a code</p>
      </div>
      
      <form onSubmit={form.handleSubmit(handler)} className="space-y-4 sm:space-y-5">
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
        
        <Button type="submit" className="w-full h-11 text-base font-medium">
          Request
        </Button>
      </form>
    </div>
  );
};