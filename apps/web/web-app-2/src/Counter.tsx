import {useState} from "react";



const Counter = () => {

    const [count, setCount] = useState(0);

    const handleCounter = () => {
        setCount(count + 1)
    }

    return (
        <div>
        <div>{count}</div>
        <button onClick = {handleCounter}>Click me !</button>
        
        </div>
    )
}


export default Counter;