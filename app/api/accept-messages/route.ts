import { getServerSession } from "next-auth";
import UserModel from "@/model/User";
import connectDb from "@/lib/dbConnect";
import { authoptions } from "../auth/[...nextauth]/options";


export async function POST(req: Request) {
  //This route is to update the user's message acceptance status
  await connectDb();
  const session = await getServerSession(authoptions);
  const user = session?.user;
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userID = user._id;
  const { acceptMessages } = await req.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userID,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update message acceptance status of user.",
        },
        {
          status: 500,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error in user message accepting status", error);
    return Response.json(
      {
        success: false,
        message: "Error in user message accepting status",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: Request) {
  //This route is to get the user's message acceptance status
  await connectDb();
  const session = await getServerSession(authoptions);
  const user = session?.user;
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userID = user._id;
  try {
    const userExists = await UserModel.findById(userID);
    if (!userExists) {
      return Response.json(
        {
          success: false,
          message: "User Not Found!",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json({
      success: true,
      isAcceptingMessage: userExists.isAcceptingMessage,
    });
  } catch (error) {
    console.log("Error occured while finding user's message acceptance status");
    return Response.json(
      {
        success: false,
        message: "Error occured while finding user's message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}
