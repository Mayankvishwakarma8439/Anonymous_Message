import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import connectDb from "@/lib/dbConnect";

export const authoptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await connectDb();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.email },
              { username: credentials.identifier},
            ],
          });
          if (!user) {
            throw new Error("User not found!");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password!");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if(user){
        token._id= user._id;
        token.isVerified= user.isVerified;
        token.isAcceptingMessages= user.isAcceptingMessages;
        token.username=user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if(token){
        session.user._id=token._id;
        session.user.isVerified=token.isVerified;
        session.user.isAcceptingMessages=token.isAcceptingMessages;
        session.user.username=token.username;

      }
      return session;
    },
    
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET_KEY,
};
