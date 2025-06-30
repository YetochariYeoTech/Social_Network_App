import appAndServer from "./index.js";
const { app, server } = appAndServer;
import { connectDB } from "./lib/db.js";

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});