import type { Review } from "../generated/prisma";
import { reviewRepository } from "../repositories/review.repository";
import { llmClient } from "../llm/client";
import template from "../prompts/summarize-reviews.txt";

export const reviewService = {
	async getReviews(productId: number): Promise<Review[]> {
		return reviewRepository.getReviews(productId);
	},

	async summarizeReviews(productId: number): Promise<string> {
		const existingSummary =
			await reviewRepository.getReviewSummary(productId);
		if (existingSummary && existingSummary.expiresAt > new Date()) {
			return existingSummary.content;
		}

		const reviews = await reviewRepository.getReviews(
			productId,
			10,
		);
		const joinedReviews = reviews
			.map((r) => r.content)
			.join("\n\n");

		const prompt = template.replace("{{reviews}}", joinedReviews);

		const { text: summary } = await llmClient.generateText({
			model: "gpt-4.1",
			prompt,
			temperature: 0.2,
			maxTokens: 200,
		});

		await reviewRepository.storeReviewSummary(productId, summary);

		return summary;
	},
};
