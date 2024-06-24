'use client';
import React, { useState } from 'react';

function Page() {
    const [data, setData] = useState([]);
    const [clicked,setClicked] = useState(false);
    const [isCachedData,setIsCachedData] = useState();
    const [isFetchedFailed,setisFetchedFailed] = useState();

    const apiCall = async () => {
        setClicked(true)
        try {
            let response = await fetch('/api/demo-route', {
                method: 'GET',
            });
            if (response.ok) {
                let jsonData = await response.json(); // Convert the response to JSON
                setData(jsonData); // Set the JSON data to state
                console.log("Cached Data - ",response.headers.get('isCachedData'));
                setIsCachedData(response.headers.get('isCachedData'))
                setisFetchedFailed(response.headers.get('isFetchedFailed'))
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
            {clicked && isFetchedFailed &&(
                <div>429 error</div>
            )}
            
            {data.length > 0 && (
                <div>
                    {/* {console.log("is cached data  - this is inside jsx: ", isCachedData)} */}
                    {/* {isCachedData && <p>Data which is older than 30 minutes</p>} */}
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
                </div>
            )}
        </div>
    );
}

export default Page;
