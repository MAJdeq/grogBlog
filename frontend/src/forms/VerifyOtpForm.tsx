import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { verifyOtpForm } from "@/validation/valSchema";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import type { SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";

export const VerifyOtpForm = ({ handler }: { handler: SubmitHandler<{otp: string}> }) => {  
  const form = useForm<z.infer<typeof verifyOtpForm>>({
    resolver: zodResolver(verifyOtpForm),
    defaultValues: {
      otp: "",
    },
  });
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          Verify
        </h1>
        <p className="text-slate-600 text-sm">We've sent a code to your email</p>
      </div>
      
      <form
        onSubmit={form.handleSubmit(
          handler,
          (errors) => {
            console.log("FORM ERRORS", errors);
          }
        )}
      >

        <div className="space-y-2">
          <Label
            htmlFor="otp"
            className="text-sm font-medium text-slate-700"
          >
            One Time Password
          </Label>
            <Controller
              name="otp"
              control={form.control}
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  className="flex justify-center space-x-2" // Center the whole OTP block
                >
                  <InputOTPGroup className="flex space-x-2 justify-center"> {/* first 3 slots */}
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>

                  <InputOTPSeparator />

                  <InputOTPGroup className="flex space-x-2 justify-center"> {/* last 3 slots */}
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />

        </div>

        {form.formState.errors.otp && (
          <p className="text-sm text-red-500">
            {form.formState.errors.otp.message}
          </p>
        )}

        
        <Button
          type="submit"
          disabled={form.watch("otp")?.length !== 6}
          className="w-full h-11"
        >
          Verify
        </Button>
      </form>
    </div>
  );
};