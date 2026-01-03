import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpForm } from "@/validation/valSchema";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "@/stores/AuthStore";

export const SignUpForm = () => {
  const navigate = useNavigate();
  const { authorized } = useAdminStore();

  const form = useForm<z.infer<typeof signUpForm>>({
    resolver: zodResolver(signUpForm),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  const onSubmit = async (values: z.infer<typeof signUpForm>) => {
    try {
      const response = await fetch(`${apiUrl}/auth/sign_up`, {
        method: "POST", // typically sign-in is POST
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: values.email,
          name: values.name,
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

  if (authorized) {
    navigate("/")
  }
  return (
    <>
      <div className="flex items-center justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Input placeholder="Email" {...form.register("email")} required />
          <Input placeholder="Name" {...form.register("name")} required />
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
