import './create-recipe-page.css'

function UnitInput( 
{
    id,
    unit,
    amount,
    onAmountChange
}:
    {
        id: string;
        unit: string;
        amount: string;
        onAmountChange: (id: string, newAmount: string) => void;
    }
) {
   

    return (
        <div className="unit-input">
            <div className="input-div">
                <input 
                    placeholder='0' 
                    value={amount}
                    onChange={(e) => onAmountChange(id, e.target.value)}
                    type='number'
                />
            </div>

            <div className="unit-div">
                <p>{unit}</p>
            </div>
        </div>
    )
}

export default UnitInput