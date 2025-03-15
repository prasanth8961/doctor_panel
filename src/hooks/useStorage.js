import { useState , useEffect } from "react";

const useStorage = (key , initialValue) => {
    const [value , setValue] = useState(()=>{
        const storeValue = localStorage.getItem(key);
        return storeValue ? JSON.parse(storeValue) : initialValue;
    });

    useEffect(()=>{
        localStorage.setItem(key , JSON.stringify(value));
    }, [value , setValue]);

    return [value, setValue];
}

export default useStorage;