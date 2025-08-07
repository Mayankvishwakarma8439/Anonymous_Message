import connectDb from "@/lib/dbConnect";
import { verifySchema } from "@/schemas/verifyMessageSchema";
import UserModel from "@/model/User";



export async function POST(req: Request){
    await connectDb();
    try{
        const {username, verifyCode} =await req.json();

        const decodedUsername = decodeURIComponent(username);
        const result = verifySchema.safeParse({code: verifyCode});
        if(result.success){
            const code= result.data.code;
            const user =await UserModel.findOne({username:decodedUsername});
            if(user?.isVerified== true){
                return Response.json({
                    success:false,
                    message:"User is already verified."
                },{
                    status:400
                })
            }
            if(!user){
                return Response.json({
                    success:false,
                    message:"User not found"
                },{
                    status:400
                })
            }
            const userOTPexpired = new Date(user.verifyCodeExpiry) < new Date();
            const userOTPcorrect = user.verifyCode === code;
            if(!userOTPexpired && userOTPcorrect){
                user.isVerified=true;
                await user.save();
                return Response.json({
                    success:true,
                    message:"User verified successfully !"
                },{status:200})
            }
            else if(!userOTPcorrect){
                  return Response.json({
                    success:false,
                    message:"Incorrect OTP"
                },{
                    status:400
                })
                
            }
            else{
                return Response.json({
                    success:false,
                    message:"OTP has expired. Please signup again to get new OTP"
                },{
                    status:400
                })
            }
            // if(new Date(user.verifyCodeExpiry) < new Date()){
            //     console.log("OTP is expired")
            //      return Response.json({
            //         success:false,
            //         message:"OTP has expired. Please sign-up again to get new code."
            //     },{
            //         status:400
            //     }) 
            // }
            // if(user.verifyCode == code){
            //     user.isVerified=true;
            //     await user.save();
            //     return Response.json({
            //         success:true,
            //         message:"User verified successfully !"
            //     },{status:200})
            // }
            // else{
            //     return Response.json({
            //         success:false,
            //         message:"Incorrect OTP"
            //     },{
            //         status:400
            //     })
            // }
        }
        else{
            return Response.json({
                success:false,
                message:"Invalid OTP"
            },{status:400})
        }
    }
    catch(error){
        console.log("Error in verifying user ",error);
        return Response.json({
            success:false,
            message:"Error occured while verifying the OTP."
        },{
            status:500
        })
    }
}