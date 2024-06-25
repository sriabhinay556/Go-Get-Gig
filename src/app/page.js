'use client';
import { useState } from "react";

export default function Home() {
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

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <main className="flex min-h-screen p-24">
            <div className="w-1/4 pr-4">
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
                        {isCachedData === "true" && <p className="text-yellow-500">Data which is older than 30 minutes</p>}
                        <ol className="mt-6 space-y-4">
                            {data.map((item, index) => (
                                <li
                                    key={index}
                                    className="border border-gray-300 p-4 rounded-md shadow-sm bg-white"
                                >
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-500">{item.source}</span>
                                        <a
                                            href={item.link}
                                            className="text-blue-500 hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            🔗
                                        </a>
                                    </div>
                                    <p className="text-gray-500 mb-2">{formatDate(item.pubDate)}</p>
                                    <p className="text-gray-700">
                                        {item.description[0].split('<br>')[0]}... 
                                        <a
                                            href={item.link}
                                            className="text-blue-500 hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Read more
                                        </a>
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
        </main>
    );
}
