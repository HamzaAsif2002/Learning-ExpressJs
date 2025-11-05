import express from "express";
import { shortenerUrl } from "./routes/shortenerUrl.js";

const PORT = 3021;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(shortenerUrl);

app.set("view engine", "ejs");




app.listen( PORT, () => {
    console.log(`Server is listening at http:localhost:${PORT}`);    
});