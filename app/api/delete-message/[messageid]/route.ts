
import { getServerSession, User } from "next-auth";
import UserModel from "@/model/User";
import { authoptions } from "../../auth/[...nextauth]/options";
import connectDb from "@/lib/dbConnect";
import mongoose from "mongoose";


export async function DELETE(req: Request, {params} : {params : {messageid : string}}){
const messageId = params.messageid;
await connectDb();
const session =await getServerSession(authoptions);
const user : User = session?.user as User;

if (!mongoose.Types.ObjectId.isValid(messageId)) {
  return Response.json({
    success: false,
    message: "Invalid message ID format"
  }, { status: 400 });
}
if(!session || !session.user){
    return Response.json({
        success:false,
        message: "Not Authenticated"
    },{
        status: 401
    })
}


try {
    const updateResponse = await UserModel.updateOne({
        _id: user._id
    },{
        $pull : {messages : {_id : messageId}}
    })
    if(updateResponse.modifiedCount == 0){
        return Response.json({
            success:false,
            message: "Message not found or already deleted!"
        },{
            status: 400
        })
    }
    return Response.json({
        success: true,
        message: "Message deleted"
    },{
        status:200
    })

} catch (error) {
    console.log(error)
    return Response.json({
        success:false,
        message: "Unexpected Error Occurred"
    },{
        status:500
    })
}
}