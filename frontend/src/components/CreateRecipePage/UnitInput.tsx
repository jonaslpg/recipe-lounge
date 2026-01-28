import './create-recipe-page.css'

function UnitInput( 
{
    unit
}:
    {
        unit: string
    }
) {
   

    return (
        <div className="unit-input">
            <div className="input-div">
                <input placeholder='0'></input>
            </div>

            <div className="unit-div">
                <p>{unit}</p>
            </div>
        </div>
    )
}

export default UnitInput