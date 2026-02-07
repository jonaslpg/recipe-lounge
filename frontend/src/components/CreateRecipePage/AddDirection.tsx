import './create-recipe-page.css'
import { useState } from 'react'

function AddDirection( 
{
    step,
    onAdd
}:
    {
        step: number;
        onAdd: (input: string) => void;
    }
) {

    const [inputValue, setInputValue] = useState<string>("");

    function handleAddClick(){
        if (inputValue.trim() === "") return;
        onAdd(inputValue);
        setInputValue("");
    }
   

    return (
        <div className="add-field">
            <input 
                placeholder={`Add Step ${step}`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleAddClick();
                    }
                }}
            />
            <img 
                src='/src/assets/plus-icon.svg'
                onClick={handleAddClick}
            />
        </div>
    )
}

export default AddDirection