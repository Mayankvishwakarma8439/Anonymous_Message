import connectDb from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";


export async function POST(req: Request){
    await connectDb();
    const {username,content} = await req.json();
    try{
        const user= await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{
                status: 404
            })
        }
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User is not accepting messages"
            },{
                status: 400
            })
        }
        const newMessage = {content, createdAt: new Date()};
        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json({
            success: true,
            message: "Message sent successfully to the user."
        },{
            status:200
        })
    }
    catch(error){
        console.log("Error in sending message ",error);
        return Response.json({
            success:false,
            message:"Error occured in sending message !"
        },{
            status: 500
        })
    }
}