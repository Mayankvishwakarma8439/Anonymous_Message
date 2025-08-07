import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User";
import connectDb from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDb();
  try {
    const { username, email, password } = await req.json(); //extracting body from request
     const otp = Math.floor(100000 + Math.random() * 900000).toString(); //otp generation
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    let finalUsername= username;
    if (existingVerifiedUserByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }
    const userExistsByEmail = await UserModel.findOne({
      email,
    });
    if (userExistsByEmail) {
      if (userExistsByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User already exists with this email.",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        userExistsByEmail.password = hashedPassword;
        userExistsByEmail.verifyCode = otp;
        userExistsByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await userExistsByEmail.save();
        finalUsername= userExistsByEmail.username;
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
     
      const user = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: otp,
        isVerified: false,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
      });
      await user.save();
      
    }
    const emailResponse = await sendVerificationEmail(finalUsername, email, otp);
      if (emailResponse.success) {
        return NextResponse.json(
          {
            success: true,
            message:
              "User registered successfully, kindly verify your email with the verification code.",
          },
          {
            status: 200,
          }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            message: emailResponse.message,
          },
          {
            status: 500,
          }
        );
      }
  } catch (error) {
    console.log("Error in signup", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in registering user",
      },
      { status: 500 }
    );
  }
}
