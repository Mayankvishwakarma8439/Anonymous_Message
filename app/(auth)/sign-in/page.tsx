'use client'
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signinSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const page = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    try {
      setIsSigningIn(true)
      const response = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      })
      console.log(response);
      if (response?.error) {
        toast.error(response.error.slice(7));
      }
      if (response?.ok) {
        toast.success("User Signed In Successfully");

        setTimeout(() => {
          router.replace('/dashboard');
        }, 100);
      }

    } catch (error) {
      console.log("Error in signing in", error)
    }
    finally {
      setIsSigningIn(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">Sign In</div>
          <p className="text-purple-200 mt-2">Sign in to your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-100">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      className="bg-white/20 border border-white/30 text-white !placeholder-white/60 focus:ring-2 focus:ring-purple-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-100">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      className="bg-white/20 border border-white/30 text-white !placeholder-white/60 focus:ring-2 focus:ring-purple-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSigningIn}
              className="w-full bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white hover:opacity-90 shadow-lg"
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Signin'
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-sm text-purple-200">
            New User?{" "}
            <Link href={'/sign-up'} className="text-yellow-400 hover:underline">
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
