import './create-recipe-page.css'

function AddField( 
{
    addFieldPlaceholderText
}:
    {
        addFieldPlaceholderText: string
    }
) {
   

    return (
        <div className="add-field">
            <input placeholder={"e.g. ''" + addFieldPlaceholderText + "''"}></input>
            <img src='src/assets/plus-icon.svg'></img>
        </div>
    )
}

export default AddField