import './create-recipe-page.css'
import UnitInput from "./UnitInput";

function NutritionItem( 
{
    nutritionName,
    unit
}:
    {
        nutritionName: string,
        unit: string
    }
) {
   

    return (
        <div className="nutrition-item">
            <div className="calories_unit-input">
                <UnitInput unit={unit}></UnitInput>
                <p>{nutritionName}</p>
            </div>
            <img src='src/assets/trash-icon.svg'></img>
        </div>
    )
}

export default NutritionItem