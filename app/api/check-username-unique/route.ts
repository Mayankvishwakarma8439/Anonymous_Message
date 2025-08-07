//Route for checking if username schema is valid and if username is unique 

import connectDb from "@/lib/dbConnect";
import UserModel from "@/model/User";
import z, { success } from "zod";

const usernameSchema= z.string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username cannot exceed 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" });

const usernameQuerySchema= z.object({
    username : usernameSchema
})

export async function GET(req: Request){ 
    await connectDb();
try{
    const {searchParams}= new URL(req.url);
    const queryParams= {
        username: searchParams.get("username")
    }
    const result= usernameQuerySchema.safeParse(queryParams);
    
    if(result.success){    
        const {username} = result.data;
        const existingUser= await UserModel.findOne({username, isVerified:true});
        if(existingUser){
            return Response.json({
                success:false,
                message:"Username already exists!"
            },{
                status:400
            })
        }
        return Response.json({
            success:true,
            message:"Username is unique."
        },{
            status:200
        })
    }
    else{
        return Response.json({
            success:false,
            message:"Invalid Username!"
        },{
            status:400
        })
    }
}
catch(error){
    console.log("Error checking username schema ", error);
    return Response.json({
        success: false,
        message: "Error occurred during validation of username schema. " 
    },{
        status:500
    })
}
}