import express, { type Request, type Response } from "express";
import { chatController } from "./controllers/chat.controller";
import { reviewController } from "./controllers/review.controller";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
	res.json({ message: "Hello World!!!" });
});

router.post("/api/chat", chatController.sendMessage);

router.get("/api/products/:id/reviews", reviewController.getReviews);

export default router;
