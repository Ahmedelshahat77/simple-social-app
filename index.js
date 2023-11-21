import express from "express";
import { json } from "express";
import { connectionDB } from "./DB/connections.js";
import * as allRouters from "./modules/index.routes.js";
import { config } from "dotenv";
import { stackVar } from "./utils/ErrorHandling.js";
config({ path: "./DB/secret.env" });
const app = express();
const port = process.env.PORT;
const baseUrl = "/api/exam/v1";

app.use(json());

connectionDB();
app.use(`${baseUrl}/user`, allRouters.userrouter);
app.use(`${baseUrl}/post`, allRouters.postRouter);
app.use(`${baseUrl}/comment`, allRouters.commentRouter);

app.use("*", (req, res) => {
  res.json({ message: "In-valid Routing" });
});

app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    res
      .status(err["cause"])
      .json({ error: err.message, stack: stackVar, stackResponse: err.stack });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
