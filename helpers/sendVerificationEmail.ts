import { resend } from "../lib/resend";
import { VerificationEmail } from "@/emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(username: string, email: string , otp: string): Promise<ApiResponse>{
try{
await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: "Mystery Message | Verification Code",
    react: VerificationEmail({username, otp}),
  });
return {success: true, message:"Verification email sent successfully."}
}
catch(emailError){
    console.log("Error in sending verification email!!")
    return { success: false, message: "Failed to send verification email."}
}
}
