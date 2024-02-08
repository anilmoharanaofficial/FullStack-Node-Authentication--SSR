import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const MONGO_URI =
  process.env.MONGO_URI;

const connectToDB = async () => {
  try {
    const { connection } = await mongoose.connect(MONGO_URI);

    if (connection) {
      console.log(`DB CONNECTED TO: ${connection.host}`);
    }
  } catch (error) {
    console.log(error, "Error in Database Connection");
    process.exit(1);
  }
};

export default connectToDB;
