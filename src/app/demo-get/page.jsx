'use client';
import React, { useState } from 'react';

function Page() {
    const [data, setData] = useState([]);
    const [clicked,setClicked] = useState(false);
    const apiCall = async () => {
        setClicked(true)
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
        <div className="container mx-auto p-4">
            <button
                onClick={apiCall}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                API Call - Software Developer
            </button>
            {clicked && data.length == 0 && (
                <div>429 error</div>
            )}
            {data.length > 0 && (
                <ol className="mt-6 space-y-4">
                    {data.map((item, index) => (
                        <li
                            key={index}
                            className="border border-gray-300 p-4 rounded-md shadow-sm bg-white"
                        >
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            {/* <p className="mb-2">{item.description}</p> */}
                            <a
                                href={item.link}
                                className="text-blue-500 hover:underline"
                            >
                                {item.link}
                            </a>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}

export default Page;
