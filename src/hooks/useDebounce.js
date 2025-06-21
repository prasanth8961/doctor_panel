import { useState, useEffect } from "react";


export const useDebounce = (input, delay) => {
    const [value, setValue] = useState(input);
    useEffect(()=>{
        const timeOut = setTimeout(()=> setValue(input), delay);
        return ()=>clearTimeout(timeOut)
    }, [input, delay]);
    return value;
}