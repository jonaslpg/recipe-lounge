// import { useState } from 'react';

export function useItemActions() {
    
    function handleDeleteIngredient(id: string){
        id = "";
    }

    function handleAmountChangeIngredient(id: string, newAmount: string) {
        id = "";
        newAmount = "";
    }

    function handleDeleteDirection(id: string){
        id = "";
    }


    return {
        handleDeleteIngredient,
        handleAmountChangeIngredient,
        handleDeleteDirection
    };
}