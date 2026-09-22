import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function App() {
	const [message, setMessage] = useState("");

	useEffect(() => {
		fetch("/api/hello")
			.then((res) => res.json())
			.then((data) => setMessage(data.message));
	}, []);

	return (
		<p className='text-2xl font-bold'>
			{message} Hello <Button>Click me</Button>
		</p>
	);
}

export default App;
