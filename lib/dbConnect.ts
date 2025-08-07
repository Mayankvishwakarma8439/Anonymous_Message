import mongoose from "mongoose";
type DbConnection={
    isConnected?: number
}

const connection: DbConnection= {};
async function connectDb(): Promise<void>{
    if(connection.isConnected){
        console.log("Database is already connected");
    }
    try{
        if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
}
        const db = await mongoose.connect(process.env.MONGO_URI);
        connection.isConnected= db.connections[0].readyState
        console.log("Database successfully connected")
        
    }
    catch(error){
        console.log("Database connection failed",error )
        process.exit(1);
    }
}
export default connectDb;