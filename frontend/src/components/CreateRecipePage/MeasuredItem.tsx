import './create-recipe-page.css';
import UnitInput from "./UnitInput";

function MeasuredItem( 
{
    nutritionName,
    unit,
    amount,
    id,
    onDelete,
    onAmountChange,
    withCheckmark,
    isLastOne
}:
    {
        nutritionName: string;
        unit: string;
        amount: string;
        id: string;
        onDelete: (id: string) => void;
        onAmountChange: (id: string, newAmount: string) => void;
        withCheckmark: boolean;
        isLastOne: boolean;
    }
) {

    function handleDeleteClick() {
        onDelete(id);
    };

    return (
        <div className={`single-item ${isLastOne ? "last" : ""}`}>
            <div className="left-side">
                {withCheckmark && <img src='src/assets/uncheck-square.svg' />}
                <div className="calories_unit-input">
                    <UnitInput id={id} unit={unit} amount={amount} onAmountChange={onAmountChange}></UnitInput>
                    <p>{nutritionName}</p>
                </div>
            </div>
            <img
                className='trash-icon'
                src='src/assets/trash-icon.svg'
                onClick={handleDeleteClick}
            />
        </div>
    )
}

export default MeasuredItem