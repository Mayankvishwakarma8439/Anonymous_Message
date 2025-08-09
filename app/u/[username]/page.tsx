"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { messageSchema } from "@/schemas/messageSchema";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

export default function Page() {
  const [messageErrorMessage, setMessageErrorMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const params = useParams<{ username: string }>();

  async function onSubmitMessage(data: z.infer<typeof messageSchema>) {
    setMessageErrorMessage("");
    setIsSendingMessage(true);
    try {
      const response = await axios.post("/api/send-message", {
        username: params.username,
        content: data.content,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        form.reset();
      } else {
        setMessageErrorMessage(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(error);
      toast.error(axiosError.response?.data.message || "Something went wrong.");
    } finally {
      setIsSendingMessage(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 p-6 pt-24">
      <div className="w-full max-w-[80%] mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-yellow-400 text-center">
          Public User Profile
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitMessage)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-200 font-semibold">
                    Send anonymous message to @{params.username}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none min-h-[150px] bg-white/20 border border-white/30 text-white !placeholder-purple-200 focus:ring-purple-500"
                      {...field}
                      onChange={(e) => {
                        setMessageErrorMessage("");
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {messageErrorMessage && (
                      <p className="text-red-400 mt-1">{messageErrorMessage}</p>
                    )}
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSendingMessage}
              className="mx-auto flex items-center justify-center px-8 py-3 text-lg bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white rounded-lg hover:from-purple-800 hover:via-indigo-800 hover:to-purple-900 focus:ring-2 focus:ring-purple-500"
            >
              {isSendingMessage ? "Sending..." : "Send"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
