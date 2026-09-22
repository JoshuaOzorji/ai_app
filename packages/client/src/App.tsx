import { useEffect, useState } from "react";

function App() {
	const [message, setMessage] = useState("");

	useEffect(() => {
		fetch("/api/hello")
			.then((res) => res.json())
			.then((data) => setMessage(data.message));
	}, []);

	return <p className='text-2xl font-bold'>{message} Hello</p>;
}

export default App;
