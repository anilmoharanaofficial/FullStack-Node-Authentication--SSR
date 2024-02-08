import app from "./app.js";
import connectToDB from "./config/database.js";
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 3056;

app.listen(PORT, async () => {
  await connectToDB();
  console.log(`SERVER IS RUNNING AT: localhost:${PORT}`);
});
