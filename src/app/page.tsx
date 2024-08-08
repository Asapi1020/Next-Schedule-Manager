"use client"

import { useEffect, useState } from 'react';

const Home = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://script.google.com/macros/s/AKfycbyTXv8ZbLducUra2X6d9-Sg5VHRFWdhjxBKUXb2VD7s363TAAfMEypjoTd7MaqcEuK3/exec?customHeader=Monyo',{
                  method: "GET",
                  redirect: "follow"
                });
                const result = await response.json();
                console.log(result);
                console.log(result.status);
                console.log(result.receivedHeaders);
                setData(result.receivedHeaders);
            } catch (error) {
                console.error('Error fetching data:', error);
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
