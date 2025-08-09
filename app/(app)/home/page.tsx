"use client";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/data/messages.json";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const page = () => {
  return (
    <div>
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 px-6 py-16 space-y-10">
        <div className="text-center max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide">
            Speak Freely. Stay Hidden.
          </h1>
          <p className="text-purple-200 text-lg md:text-xl font-medium">
            Send and receive anonymous messages without fear. <br /> It’s your
            space. Your voice. Unfiltered.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-md"
          >
            Start Exploring
          </Link>
        </div>

        <div className="w-full max-w-md relative">
          <Carousel plugins={[Autoplay({ delay: 4000 })]} className="w-full">
            <CarouselContent>
              {messages.map((msg, index) => (
                <CarouselItem key={index}>
                  <div className="p-2">
                    <Card className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl shadow-lg">
                      <CardContent className="p-6 text-white space-y-3">
                        <h3 className="text-xl font-bold text-yellow-400">
                          {msg.title}
                        </h3>
                        <p className="text-purple-200 italic">
                          "{msg.content}"
                        </p>
                        <span className="text-sm text-purple-300">
                          {msg.received}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="hidden md:flex absolute left-[-2.5rem] top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2">
              <ChevronLeft className="w-5 h-5 text-white" />
            </CarouselPrevious>
            <CarouselNext className="hidden md:flex absolute right-[-2.5rem] top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2">
              <ChevronRight className="w-5 h-5 text-white" />
            </CarouselNext>
          </Carousel>
        </div>
      </section>
      
    </div>
  );
};

export default page;
