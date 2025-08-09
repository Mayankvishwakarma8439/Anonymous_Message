'use client'

import {
  Button
} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Input
} from '@/components/ui/input';
import {
  verifySchema
} from '@/schemas/verifyMessageSchema';
import {
  ApiResponse
} from '@/types/ApiResponse';
import {
  zodResolver
} from '@hookform/resolvers/zod';
import axios, {
  AxiosError
} from 'axios';
import {
  Loader2
} from 'lucide-react';
import {
  useParams,
  useRouter
} from 'next/navigation';
import React, {
  useState
} from 'react';
import {
  useForm
} from 'react-hook-form';
import {
  toast
} from 'sonner';
import z from 'zod';

const page = () => {
  const router = useRouter();
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsVerifyingCode(true);
    try {
      const response = await axios.post<ApiResponse>('/api/verify-code', {
        username: params.username,
        verifyCode: data.code
      });
      toast.success(response.data.message, {
        action: {
          label: 'Continue',
          onClick: () => router.replace(`/sign-in`)
        }
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-white px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">Verification Code</h1>
          <p className="text-purple-200 text-sm">
            Kindly verify your account using the OTP sent to your email.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">OTP</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your code"
                      type="text"
                      className="bg-white/20 border border-white/30 text-white placeholder-purple-200 !placeholder-purple-200 focus:ring-2 focus:ring-purple-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isVerifyingCode}
              className="w-full bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white hover:opacity-90 focus:ring-2 focus:ring-purple-500"
            >
              {isVerifyingCode ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Verify'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default page;
