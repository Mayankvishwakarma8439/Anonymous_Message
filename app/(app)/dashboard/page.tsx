"use client";

import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import MessageCard from "@/components/MessageCard";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const handleDelete = (messageID: string) => {
    setMessages(messages.filter((message) => message._id !== messageID));
  };
  const { data: session } = useSession();
  const acceptMessages = watch("acceptMessage");

  const fetchAcceptMessageStatus = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessage", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError.message);
      toast.error(
        axiosError.response?.data.message || "Failed to fetch message settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        if (response.data.success) {
          setMessages(response.data.messages || []);
          if (refresh) {
            toast("Showing latest messages");
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        axiosError.response?.data.message &&
          toast.error(axiosError.response?.data.message);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessageStatus();
  }, [session, setValue, fetchAcceptMessageStatus, fetchMessages]);

  const handleSwitchMessage = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      if (response.data.success) {
        setValue("acceptMessage", !acceptMessages);
        toast(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Error occurred while changing message settings.."
      );
    }
  };

  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  const { username } = session.user as User;
  const profileURL = `${window.location.protocol}//${window.location.host}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileURL);
    toast.success("URL copied to Clipboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 p-6 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-lg space-y-4">
          <h2 className="text-2xl font-bold text-yellow-400">
            Your Public Profile URL
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <p className="text-purple-200 break-all">{profileURL}</p>
            <Button
              onClick={copyToClipboard}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
            >
              Copy URL
            </Button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Accept Messages
            </h3>
            <div className="flex items-center space-x-4">
              <Switch
                {...register("acceptMessage")}
                checked={acceptMessages}
                onCheckedChange={handleSwitchMessage}
                disabled={isSwitchLoading}
              />
              <span className="text-purple-200 font-semibold">
                {acceptMessages ? "On" : "Off"}
              </span>
            </div>
          </div>
        </div>

        <Separator className="bg-white/30" />

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-yellow-400">
              Received Messages
            </h3>
            <Button
              onClick={(e) =>{ 
                e.preventDefault();
                fetchMessages(true)}}
              disabled={isLoading}
              className="bg-white/20 text-white border border-white/30 hover:bg-white/30 font-semibold px-4 py-2 rounded-md transition"
            >
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <p className="text-purple-200">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-purple-200">No messages to display.</p>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  onMessageDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
