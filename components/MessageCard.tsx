"use client";

import { X, CalendarDays } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardDescription, CardHeader } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageID: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

  const handleDeleteConfirm = async () => {
    try{
      const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    );
    if (response.data.success) {
      toast.success(response.data.message);
    }
    onMessageDelete(message._id);
    }catch(error){
      const axiosError = error as AxiosError<ApiResponse>
      console.log(axiosError)
      toast.error(axiosError.response?.data.message || "Something went wrong while deleting messages.")
    }
    
  };

  const formattedDate = new Date(message.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <Card className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-5 text-white transition-all duration-300 hover:shadow-purple-500/40 hover:scale-[1.02]">
      <div className="absolute top-3 right-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="destructive"
              className=" w-7 h-7 flex items-center justify-center shadow-md hover:shadow-lg hover:bg-red-600/90 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white/95 text-black">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                message from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <CardHeader>
        <CardDescription className="text-lg font-semibold text-purple-200 leading-relaxed">
          {message.content}
        </CardDescription>
        <div className="flex items-center gap-2 mt-3 text-sm text-yellow-400">
          <CalendarDays className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;
