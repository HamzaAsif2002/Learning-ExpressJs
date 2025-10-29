import express from "express";
import path from "path"
import crypto from "crypto"

import fs from "fs/promises";

const app = express();
const DATA_FILE = path.join("data", "links.json");
app.use(express.urlencoded({ extended: true }));


app.use(express.static("public"));

const PORT = 3021;
const loadLinks = async () => {
    try {
        const data = await fs.readFile(DATA_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        if(error.code == "ENOENT"){
            await fs.writeFile(DATA_FILE, JSON.stringify({}));
            return {};
        }
        throw error;
    }
}

const saveLinks = async (links) => {
    await writeFile(DATA_FILE, JSON.stringify(links), "utf-8")
}

app.get("/",  async (req, res) => {
    try {
        const file = await fs.readFile(path.join("views", "index.html"))
        const links = await loadLinks();

        const content = file.toString().replace("{{shortend-urls}}",
            Object.entries(links).map(([shortCode,url]) => `<li><a href="/${shortCode}" target="_blank">${req.host}/${shortCode}</a> -> ${url} </li>`).join("")
         );

         res.send(content);
    } catch (error) {
            res.status(500).send("Error loading the file.");
    }
     
});
app.post("/", async (req, res) => {
      try {
        const {url, shortCode} = req.body;
        const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

        const links = await loadLinks();
        if(links[finalShortCode]){
             res.status(400).send("Short code Already Exists");
        }

        links[finalShortCode] = url;
        await saveLinks(links);
      } catch (error) { }
})

app.get("/:shortCode", async (req, res) => {
    try {
        const {shortCode} = req.params;
        const links = await loadLinks();

        if(!links[shortCode]) return res.status(404).send("404 error occurred");
        return res.redirect(links[shortCode]);
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error");
    }
})


app.listen( PORT, () => {
    console.log(`Server is listening at http:localhost:${PORT}`);    
});