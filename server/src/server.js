import { app } from "./app.js";
import { config } from "./config/config.js";
import { connectDB } from "./db/db.js";

const port = config.port;
const startServer = async () => {
  connectDB()
    .then(() => {
      app.listen(config.port, () => {
        console.log(`Server is running on port http://localhost:${port}`);
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

startServer();
