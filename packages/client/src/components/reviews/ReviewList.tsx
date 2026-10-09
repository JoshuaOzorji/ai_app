import StarRating from "./StarRating";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { HiSparkles } from "react-icons/hi2";
import ReviewSkeleton from "./ReviewSkeleton";
import {
	reviewsApi,
	type GetReviewsResponse,
	type SummarizeResponse,
} from "./reviewsApi";

type Props = {
	productId: number;
};

const ReviewList = ({ productId }: Props) => {
	// const {
	// 	mutate: handleSummarize,
	// 	isPending: isSummaryLoading,
	// 	isError: isSummaryError,
	// 	data: summarizeResponse,
	// }
	const summaryMutation = useMutation<SummarizeResponse>({
		mutationFn: () => reviewsApi.summarizeReviews(productId),
	});

	// const
	// {
	// 	data: reviewData,
	// 	isLoading,
	// 	error,
	// }
	const reviewsQuery = useQuery<GetReviewsResponse>({
		queryKey: ["reviews", productId],
		queryFn: () => reviewsApi.fetchReviews(productId),
	});

	if (reviewsQuery.isLoading) {
		return (
			<div className='flex flex-col gap-1'>
				{[1, 2, 3].map((i) => (
					<ReviewSkeleton key={i} />
				))}
			</div>
		);
	}

	if (reviewsQuery.isError) {
		return (
			<p className='text-red-500'>
				Could not fetch reviews. Try again!
			</p>
		);
	}

	if (!reviewsQuery.data?.reviews.length) {
		return null;
	}

	// const currentSummary = reviewData.summary || summarizeResponse?.summary;

	const currentSummary =
		reviewsQuery.data?.summary || summaryMutation.data?.summary;

	return (
		<div>
			<div>
				{currentSummary ? (
					<p>{currentSummary}</p>
				) : (
					<div>
						<Button
							onClick={() =>
								summaryMutation.mutate()
							}
							disabled={
								summaryMutation.isPending
							}
							className='cursor-pointer'>
							<HiSparkles />
							Summarize
						</Button>
						<div className='py-3'>
							{summaryMutation.isPending && (
								<ReviewSkeleton />
							)}
						</div>
						{summaryMutation.isError && (
							<p className='text-red-500'>
								Could not
								summarize
								reviews. Try
								again!
							</p>
						)}
					</div>
				)}
			</div>
			<div className='flex flex-col gap-5'>
				{reviewsQuery.data?.reviews.map((review) => (
					<div key={review.id}>
						<div className='font-semibold'>
							{review.author}
						</div>
						<div>
							<StarRating
								value={
									review.rating
								}
							/>
						</div>
						<div className='py-2'>
							{review.content}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ReviewList;
