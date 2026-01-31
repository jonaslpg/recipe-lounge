import './create-recipe-page.css'

function DirectionItem( 
{
    id,
    step,
    descr,
    onDelete
}:
    {
        id: string;
        step: number;
        descr: string;
        onDelete: (id: string) => void;
    }
) {

    function handleDeleteClick() {
        onDelete(id);
    };

    return (
        <div className="nutrition-item">
            <div className="direction-texts">
                <p className='direction-step'>STEP {step}</p>
                <p>{descr}</p>
            </div>
            <img 
                src='src/assets/trash-icon.svg'
                onClick={handleDeleteClick}
            />
        </div>
    )
}

export default DirectionItem