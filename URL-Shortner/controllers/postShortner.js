import crypto from "crypto";
import path from "path";
import fs from "fs/promises";
import { loadLinks, saveLinks } from "../models/utlShortner.models.js";

export const postURLShortener = async (req, res) => {
  try {
    const { url, shortCode } = req.body;
    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

    const links = await loadLinks();
    if (links[finalShortCode]) {
      res.status(400).send("Short code Already Exists");
    }

    links[finalShortCode] = url;
    await saveLinks(links);
    return res.redirect("/");
  } catch (error) {
    res.status(500).send("Error adding the file.");
  }
};

export const getURLShortener = async (req, res) => {
  try {
    const file = await fs.readFile(path.join("views", "index.html"));
    const links = await loadLinks();

    const content = file.toString().replace(
      "{{shortend-urls}}",
      Object.entries(links)
        .map(
          ([shortCode, url]) =>
            `<li><a href="/${shortCode}" target="_blank">${req.host}/${shortCode}</a> -> ${url} </li>`
        )
        .join("")
    );

    res.send(content);
  } catch (error) {
    res.status(500).send("Error loading the file.");
  }
};

export const getURLShortCode = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const links = await loadLinks();

    if (!links[shortCode]) return res.status(404).send("404 error occurred");
    return res.redirect(links[shortCode]);
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  }
};
