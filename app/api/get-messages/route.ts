//Route to get messages using aggregation pipelines of Mongodb
import { getServerSession } from "next-auth";
import UserModel from "@/model/User";
import connectDb from "@/lib/dbConnect";
import { authoptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(req: Request) {
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
  const userID = new mongoose.Types.ObjectId(user._id); //As for aggregation pipelines user id must be in the form of objectid of mongoose
  try {
    const user = await UserModel.aggregate([
      {
        $match: { id: userID },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: { _id: "$_id", messages: { $push: "$messages" } },
      },
    ]);
    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {}
}
