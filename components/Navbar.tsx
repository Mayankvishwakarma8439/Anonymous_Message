'use client'
import { User } from "next-auth";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-900 text-white shadow-xl border-b border-white/10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center py-6 md:py-8 px-6 min-h-[90px]">
        
        <a
          className="text-2xl font-extrabold tracking-wide text-yellow-400 hover:text-yellow-300 transition duration-200 mb-4 md:mb-0"
          href="#"
        >
          Mystery Message
        </a>

       
        {session ? (
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5">
            <span className="text-base md:text-lg text-purple-200 text-center md:text-left">
              Welcome, <span className="font-semibold text-white">{user?.username || user?.email}</span>
            </span>
            <Button
              className="bg-purple-700 hover:bg-purple-600 text-white text-base px-6 py-2 shadow-lg w-full md:w-auto"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-base px-6 py-2 shadow-lg w-full md:w-auto">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
