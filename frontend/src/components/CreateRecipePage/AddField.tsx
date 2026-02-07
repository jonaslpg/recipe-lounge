import { useState } from "react";

interface AddFieldProps {
    addFieldPlaceholderText: string;
    onAdd: (value: string) => void;
}

function AddField({ addFieldPlaceholderText, onAdd }: AddFieldProps) {
    const [inputValue, setInputValue] = useState("");

    function handleAddClick() {
        if (inputValue.trim() === "") return;
        onAdd(inputValue);
        setInputValue("");
    };

    return (
        <div className="add-field">
            <input 
                placeholder={`${addFieldPlaceholderText}`}
                spellCheck={false}
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
                style={{cursor: "pointer"}}
            />
        </div>
    );
}

export default AddField;
