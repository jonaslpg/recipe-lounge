import type { DirectionData } from "../../../types/DirectionData";
import { useState } from 'react';

export function useDirectionItems() {
    
    const [directionItems, setDirectionItems] = useState<DirectionData[]>([
        // { descr: "Test", step: 1, id: crypto.randomUUID() }
    ]);

    // DIRECTION //
    function handleDeleteDirection(id: string) {
        setDirectionItems(prev =>
            prev
                .filter(item => item.id !== id)
                .map((item, index) => ({
                    ...item,
                    step: index + 1
                }))
        );
    }

    function handleAddDirection(input: string){
        const newItem: DirectionData = ({
            id: crypto.randomUUID(),
            step: directionItems.length+1,
            descr: input
        });

        setDirectionItems(prev => [...prev, newItem])
    }


    return {
        handleDeleteDirection,
        handleAddDirection,
        directionItems
    };
}