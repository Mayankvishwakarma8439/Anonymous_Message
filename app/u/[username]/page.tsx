"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card,CardContent } from "@/components/ui/card";
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
import suggestedMessages from "@/data/suggested-messages.json"

export default function Page() {
  const [messageErrorMessage, setMessageErrorMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
 

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
  
  const handleMessageClick = (message: string) => {
   form.setValue('content',message,{shouldValidate:true})
  };
   const nextMessages = () => {
    setStartIndex((prev) => (prev + 3) % suggestedMessages.length);
  };

  const displayedMessages = suggestedMessages.slice(startIndex, startIndex + 3);

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
                      }
                    }
                    value={field.value}
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

 <div className="relative w-[90%] mx-auto flex flex-col items-center p-6 pb-15 space-y-6">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900" />
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_50%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-6 w-full">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-lg font-bold text-yellow-400">
            Click on any message below to select it.
          </h2>
          <Button
            onClick={nextMessages}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold shadow-lg hover:shadow-xl transition"
          >
            Suggest Messages
          </Button>
        </div>

        <div className="space-y-3 w-full">
          {displayedMessages.map((msg, idx) => (
            <Card
              key={idx}
              onClick={() => handleMessageClick(msg)}
              role="button"
              tabIndex={0}
              
              className="w-full cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow hover:bg-white/20 transition active:scale-95"
            >
              <CardContent className="p-4 text-white font-semibold">
                {msg}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
      </div>
    </div>
  );
}
