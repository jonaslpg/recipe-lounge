import './create-recipe-page.css'

function AddDirection( 
{
    step
}:
    {
        step: number
    }
) {
   

    return (
        <div className="add-field">
            <input placeholder={'Add Step ' + step}></input>
            <img src='src/assets/plus-icon.svg'></img>
        </div>
    )
}

export default AddDirection