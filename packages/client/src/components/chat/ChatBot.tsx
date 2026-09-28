import type React from "react";
import axios from "axios";

import { FaArrowUp } from "react-icons/fa";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import TypingIndicator from "./TypingIndicator";
import type { Message } from "./ChatMessages";
import ChatMessages from "./ChatMessages";

type FormData = {
	prompt: string;
};

type ChatResponse = {
	message: string;
};

const ChatBot = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isBotTyping, setIsBotTyping] = useState(false);
	const [error, setError] = useState("");

	const conversationId = useRef(crypto.randomUUID());
	const { register, handleSubmit, reset, formState } =
		useForm<FormData>();

	const onSubmit = async (formData: FormData) => {
		try {
			setMessages((prev) => [
				...prev,
				{ content: formData.prompt, role: "user" },
			]);
			setIsBotTyping(true);
			setError("");
			reset({ prompt: "" });

			const { data } = await axios.post<ChatResponse>(
				"/api/chat",
				{
					prompt: formData.prompt,
					conversationId: conversationId.current,
				},
			);
			setMessages((prev) => [
				...prev,
				{ content: data.message, role: "bot" },
			]);
		} catch (error: any) {
			console.error(error);
			setError("Something went wrong. Try again!");
		} finally {
			setIsBotTyping(false);
		}
	};
	const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(onSubmit)();
		}
	};

	return (
		<div className='flex flex-col h-full'>
			<div className='flex flex-col flex-1 gap-3 mb-10 overflow-y-auto'>
				<ChatMessages messages={messages} />
				{isBotTyping && <TypingIndicator />}
				{error && (
					<p className='text-red-500'>{error}</p>
				)}
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				onKeyDown={onKeyDown}
				className='flex flex-col gap-2 items-end border-2 p-4 rounded-lg'>
				<textarea
					{...register("prompt", {
						required: true,
						validate: (data) =>
							data.trim().length > 0,
					})}
					autoFocus
					className='w-full border-0 focus:outline-0 resize-none'
					placeholder='Ask anything'
					maxLength={1000}
				/>

				<Button
					type='submit'
					disabled={!formState.isValid}
					className='rounded-full size-9'>
					<FaArrowUp />
				</Button>
			</form>
		</div>
	);
};

export default ChatBot;
