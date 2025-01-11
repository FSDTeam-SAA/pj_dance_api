import express from "express";
import cors from "cors";
import { serverPort } from "./config/index.js";
import userRouter from "./routes/user.routes.js";
import danClassRouter from "./routes/danceClass.routes.js";
import purchaseTicketRouter from "./routes/purchaseTicket.routes.js";
import newsLetterRouter from "./routes/newwsLetter.routes.js";
import configDb from "./db/configDb.js";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/dance-classes", danClassRouter);
app.use("/api/v1/purchase-ticket", purchaseTicketRouter);
app.use("/api/v1/newsletters", newsLetterRouter);

app.listen(serverPort, () => {
  configDb();
  console.log(`Server is running on port:${serverPort}`);
});
