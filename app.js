import express from "express";
import path from "path"

const app = express();

const PORT = process.env.PORT;

const staticPath = path.join(import.meta.dirname, "public")

app.use(express.static(staticPath));

app.get("/product", (req, res) => {
    res.send(`user search for ${req.query.search} with ${req.query.ram} ram`)
})

app.get("/", (req, res) => {
    res.sendFile(staticPath);
});
app.get("/about", (req,res) => {
    res.send("This is about page");
})
app.get("/about/:name", (req, res) => {
    res.send(`My name is ${req.params.name}`);
})
app.get("/about/:name/artical/:slug", (req, res) => {
    const adjustSlug = req.params.slug.replace(/-/g, " ");
    res.send(`My name is ${req.params.name} and my artical is ${adjustSlug}`);
})


app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
    
})