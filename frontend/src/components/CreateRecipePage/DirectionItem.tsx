import './create-recipe-page.css'

function DirectionItem( 
{
    id,
    step,
    descr,
    onDelete,
    isLastOne
}:
    {
        id: string;
        step: number;
        descr: string;
        onDelete: (id: string) => void;
        isLastOne: boolean;
    }
) {

    function handleDeleteClick() {
        onDelete(id);
    };

    return (
        <div className={`nutrition-item ${isLastOne ? "last" : ""}`}>
            <div className="direction-texts">
                <p className='direction-step'>STEP {step}</p>
                <p>{descr}</p>
            </div>
            <img 
                className='trash-icon'
                src='src/assets/trash-icon.svg'
                onClick={handleDeleteClick}
            />
        </div>
    )
}

export default DirectionItem