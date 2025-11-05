import { Router } from "express";
import {
  postURLShortener,
  getURLShortener,
  getURLShortCode,
} from "../controllers/postShortner.js";

const router = Router();

router.get("/", getURLShortener);

router.post("/", postURLShortener);

router.get("/:shortCode", getURLShortCode);

export const shortenerUrl = router;
