'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { verifySchema } from '@/schemas/verifyMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const page = () => {
  const router= useRouter();
  const [isVerifyingCode,setIsVerifyingCode] = useState(false);
  const params = useParams<{username: string}>();
  const form = useForm<z.infer <typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues:{
      code:""
    }
  })
  const onSubmit = async (data: z.infer <typeof verifySchema>)=>{
    setIsVerifyingCode(true);
    try{
      const response = await axios.post<ApiResponse>('/api/verify-code',{
        username: params.username,
        verifyCode: data.code
      })
      toast.success(response.data.message, {
  action: {
    label: "Continue",
    onClick: () => router.replace(`/sign-in`)
  },
});
    }
    catch(error){
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message);
    }
    finally{
      setIsVerifyingCode(false);
    }
  }
  return (
 <div>
    <div>
      <div></div>
      <h1>Verification Code</h1>
      <p>Kindly Verify your account using OTP sent on your email.</p>
    </div>
    <div>
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OTP</FormLabel>
              <FormControl>
                <Input placeholder="code" type='text' {...field} onChange={(e)=>{
                  field.onChange(e);
                  
                }} />
              </FormControl>
              {/* {isVerifyingCode && <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>} */}
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        
        <Button type="submit" disabled={isVerifyingCode}>{
          isVerifyingCode? <> <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</> :('Signup')
          }</Button>
      </form>
    </Form>
    
    </div>
  </div>);
  
}

export default page
