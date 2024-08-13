"use client";

import { useEffect, useState } from "react";

import GasApi from "@/lib/gasApi";

const Home = () => {
	const [data, setData] = useState<string>("");
	const gasApi = new GasApi();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await gasApi.execGas("myFunction");
				console.log(data);
				if (data.error) {
					throw new Error(`Error GAS: ${data.error.message}`);
				}
				setData(data.response.result);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div>
			<h1>Data from Backend</h1>
			{data ? <p>{data}</p> : <p>Loading...</p>}
		</div>
	);
};

export default Home;
