import './create-recipe-page.css'
import NutritionItem from "./NutritionItem";
import DirectionItem from "./DirectionItem";
import AddField from "./AddField";
import AddDirection from "./AddDirection";

function CreateRecipePage( 
{
}:
    {
    }
) {
   

    return (
        <div className="create-recipe-page_container">
            <div className="create-recipe-top-part">
                <p className="create-recipe-title">Create new recipe</p>
                <button className="primary-btn">Save Recipe</button>
            </div>
            <div className="create-recipe-page_container-wrapper">
                <div className="column-1">
                    {/* ==== GENERATE RECIPE INFORMATION ====*/}
                    <div className="create-recipe-box" style={{marginBottom: "12px"}}>
                        <div className="gen-recipe-info_container">
                            <p className="sub-heading-1">GENERATE RECIPE INFORMATION</p>

                            <div className="sub-heading-input-box">
                                <p className="sub-heading-2">Import a recipe with URL</p>
                                <div className="import-box">
                                    <input className='primary-input url-input' placeholder="paste an URL link..."></input>
                                    <button className="secondary-btn">Save Recipe</button>
                                </div>
                            </div>
                            <div className="sub-heading-input-box">
                                <p className="sub-heading-2">Generate information with AI</p>
                                <button className="generative-ai-btn">Generate Recipe</button>
                            </div>
                        </div>
                    </div>

                    {/* ==== GENERAL INFORMATION ====*/}
                    <div className="create-recipe-box">
                        <div className="general-info_container">

                            <p className="sub-heading-1">GENERAL INFORMATION</p>

                            <div className="sub-heading-input-box">
                                <p className="sub-heading-2">Recipe name</p>
                                <input className='primary-input' placeholder="e.g: Chocolate Pie"></input>
                            </div>
                            <div className="sub-heading-input-box">
                                <p className="sub-heading-2">Description</p>
                                <input 
                                    className="description-input primary-input" 
                                    placeholder="e.g: This Chocolate Pie is very delicious."
                                />
                            </div>
                            <div className="sub-heading-input-box">
                                <p className="sub-heading-2">Image</p>
                                <div className="drop-area-image">
                                    <img></img>
                                    <p>Drop your image here, or select Click to browse</p>
                                </div>
                            </div>

                            <div className="sub-heading-input-box">
                                <p className="sub-heading-2">Number of serving</p>
                                <div className="input_container">
                                    <input
                                        className='primary-input'
                                        placeholder="1"
                                    />
                                    <p className='input-overlay-text'>person</p>
                                </div>
                            </div>

                            <div className="sub-heading-input-box">
                                <p className="sub-heading-2">Cook duration</p>
                                <div className="input_container">
                                    <input
                                        className='primary-input'
                                        placeholder="30"
                                    />
                                    <p className='input-overlay-text'>minutes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column-2">
                    {/* ==== DETAIL INFORMATION ====*/}
                    <div className="create-recipe-box">
                        <div className="detail-info_container">

                            <p className="sub-heading-1">DETAIL INFORMATION</p>

                            <div className="sub-heading-input-box">
                                <p className="sub-heading-2">Add nutritions</p>
                                <div className="nutrition-item_container">
                                    <NutritionItem nutritionName='Calories' unit='kcal'></NutritionItem>
                                    <NutritionItem nutritionName='Carbonhydrates' unit='kcal'></NutritionItem>
                                    <AddField addFieldPlaceholderText='45g protein'></AddField>
                                </div>
                            </div>

                            <div className="sub-heading-input-box"
                            style={{marginTop: "28px"}}>
                                <p className="sub-heading-2">Add ingredients</p>
                                <div className="nutrition-item_container">
                                    <NutritionItem nutritionName='dark chocolate (at least 60% cocoa)' unit='g'></NutritionItem>
                                    <NutritionItem nutritionName='baking powder' unit='g'></NutritionItem>
                                    <AddField addFieldPlaceholderText='200g sugar, 1 tsp salt'></AddField>
                                </div>
                            </div>

                            <div className="sub-heading-input-box"
                            style={{marginTop: "28px"}}>
                                <p className="sub-heading-2">Add Directions</p>
                                <div className="nutrition-item_container">
                                    <DirectionItem step={1} descr='test'></DirectionItem>
                                    <DirectionItem step={2} descr='testtesttesttest'></DirectionItem>
                                    <AddDirection step={3}></AddDirection>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CreateRecipePage