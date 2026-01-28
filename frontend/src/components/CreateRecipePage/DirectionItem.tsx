import './create-recipe-page.css'

function DirectionItem( 
{
    step,
    descr
}:
    {
        step: number,
        descr: string
    }
) {
   

    return (
        <div className="nutrition-item">
            <div className="direction-texts">
                <p className='direction-step'>STEP {step}</p>
                <p>{descr}</p>
            </div>
            <img src='src/assets/trash-icon.svg'></img>
        </div>
    )
}

export default DirectionItem