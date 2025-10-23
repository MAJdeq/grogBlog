import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { adminFormSchema } from "@/validation/valSchema";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export const AdminForm = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof adminFormSchema>) => {
    try {
      const response = await fetch("http://localhost:5000/auth/sign_in", {
        method: "POST", // typically sign-in is POST
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      navigate("/");
    } catch (error) {
      console.error("There was an error fetching the data:", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Input placeholder="Email" {...form.register("email")} required />
          <Input
            placeholder="Password"
            type="password"
            {...form.register("password")}
            required
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </>
  );
};
