import type React from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { FaArrowUp } from "react-icons/fa";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";

type FormData = {
	prompt: string;
};

type ChatResponse = {
	message: string;
};

type Message = {
	content: string;
	role: "user" | "bot";
};

const ChatBot = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isBotTyping, setIsBotTyping] = useState(false);
	const [error, setError] = useState("");
	const lastMessageRef = useRef<HTMLDivElement | null>(null);
	const conversationId = useRef(crypto.randomUUID());
	const { register, handleSubmit, reset, formState } =
		useForm<FormData>();

	useEffect(() => {
		lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

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

	const OnCopyMessage = (e: React.ClipboardEvent): void => {
		const selection = window.getSelection()?.toString().trim();
		if (selection) {
			e.preventDefault();
			e.target;
			e.clipboardData.setData("text/plain", selection);
		}
	};
	return (
		<div className='flex flex-col h-full'>
			<div className='flex flex-col flex-1 gap-3 mb-10 overflow-y-auto'>
				{messages.map((message, index) => (
					<div
						key={index}
						onCopy={OnCopyMessage}
						ref={
							index ===
							messages.length - 1
								? lastMessageRef
								: null
						}
						className={`px-3 py-1 rounded-xl ${message.role === "user" ? "bg-blue-600 text-white self-end" : "bg-gray-100 text-black self-start"}`}>
						<ReactMarkdown>
							{message.content}
						</ReactMarkdown>
					</div>
				))}
				{isBotTyping && (
					<div className='flex self-start gap-1 p-3 bg-gray-200 rounded-xl'>
						<div className='size-1 rounded-b-full bg-gray-800 animate-pulse'>
							.
						</div>
						<div className='size-1 rounded-b-full bg-gray-800 animate-pulse [animation-delay:0.2s]'>
							.
						</div>
						<div className='size-1 rounded-b-full bg-gray-800 animate-pulse [animation-delay:0.4s]'>
							.
						</div>
					</div>
				)}
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
