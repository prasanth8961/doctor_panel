import { useEffect, useState } from "react"

export const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Something went wrong. try agin...");
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message || error);
            } finally{
                setLoading(false);
            }
        };

        fetchData();

    }, [url]);


    return {data, loading, error};
}