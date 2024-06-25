'use client';
import React, { useState } from 'react';

function Page() {
    const [data, setData] = useState([]);
    const [clicked, setClicked] = useState(false);
    const [isCachedData, setIsCachedData] = useState();
    const [isFetchFailed, setIsFetchFailed] = useState();
    const categories = ['Software Developer', 'Cyber Security', 'AI and Machine Learning', 'Data Engineer', 'UI/UX', 'Data Scientist'];

    const apiCall = async (category) => {
        setClicked(true);
        try {
            let response = await fetch(`/api/demo-route?category=${encodeURIComponent(category)}`, {
                method: 'GET'
            });
            if (response.ok) {
                let jsonData = await response.json(); // Convert the response to JSON
                setData(jsonData); // Set the JSON data to state
                console.log("Cached Data - ", response.headers.get('isCachedData'));
                setIsCachedData(response.headers.get('isCachedData'));
                setIsFetchFailed(response.headers.get('isFetchFailed'));
            } else {
                console.log('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="container mx-auto p-4 justify-center">
            <div className="flex">
                <div className="w-1/4">
                    <div className="space-y-2">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                onClick={() => apiCall(category)}
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-3/4 ml-4">
                    {data.length > 0 && (
                        <div>
                            <ol className="mt-6 space-y-4">
                                {data.map((item, index) => (
                                    <li
                                        key={index}
                                        className="border border-gray-300 p-4 rounded-md shadow-sm bg-white"
                                    >
                                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                        <a
                                            href={item.link}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {item.link}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Page;
