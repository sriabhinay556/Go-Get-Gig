'use client';
import React, { useState } from 'react';

function Page() {
    const [data, setData] = useState([]);

    const apiCall = async () => {
        try {
            let response = await fetch('/api/demo-route', {
                method: 'GET',
            });
            if (response.ok) {
                let jsonData = await response.json(); // Convert the response to JSON
                console.log(jsonData); // Log the JSON data
                setData(jsonData); // Set the JSON data to state
            } else {
                console.log('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <button onClick={apiCall}>API Call</button>
            {data && (
                <ul>
                    {data.map((item, index) => (
                        <li key={index}>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <a href={item.link}>{item.link}</a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Page;
