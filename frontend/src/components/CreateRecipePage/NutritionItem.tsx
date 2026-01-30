import './create-recipe-page.css'
import UnitInput from "./UnitInput";

function NutritionItem( 
{
    nutritionName,
    unit,
    amount,
    id,
    onDelete,
    onAmountChange
}:
    {
        nutritionName: string;
        unit: string;
        amount: string;
        id: string;
        onDelete: (id: string) => void;
        onAmountChange: (id: string, newAmount: string) => void;
    }
) {

    function handleDeleteClick() {
        onDelete(id);
    };

    return (
        <div className="nutrition-item">
            <div className="calories_unit-input">
                <UnitInput id={id} unit={unit} amount={amount} onAmountChange={onAmountChange}></UnitInput>
                <p>{nutritionName}</p>
            </div>
            <img 
                src='src/assets/trash-icon.svg'
                onClick={handleDeleteClick}
            />
        </div>
    )
}

export default NutritionItem