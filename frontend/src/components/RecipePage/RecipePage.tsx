import './recipe-page.css'
import NutritionItem from "../CreateRecipePage/NutritionItem"
import DirectionItem from "../CreateRecipePage/DirectionItem";

function RecipePage( 
{
}:
    {
    }
) {

    function handleDeleteIngredient(id: string){
        
    }

    function handleAmountChangeIngredient(id: string, newAmount: string) {

    }

    function handleDeleteDirection(id: string){

    }
   

    return (
    <div className='page-wrapper'>
        <div className="recipe-page_container">
            <div className="column-1">
                <div className="recipe-header">
                    <img src='src/assets/image-dummy-1.png'></img>
                    <div className="recipe-header-content">
                        <h3>Chocolate Pie</h3>
                        <p>Soft, fluffy chocolate cake with a smooth texture and intense chocolate taste
                        <span> More</span></p>
                        <div className="header-settings">
                            <div className="servings">
                                <img src='src/assets/minus-iconV2.svg'/>
                                <div className="servings-text">
                                    <p>Servings</p>
                                    <p className='amount'>1</p>
                                </div>
                                <img src='src/assets/plus-iconV2.svg'/>
                            </div>
                            <div className="cook-duration">
                                <p>Cook Duration</p>
                                <p className='amount'>20m</p>
                            </div>
                            {/* maybe extend this section later? */}
                        </div>
                    </div>
                </div>

                <div className="recipe-ingredients" style={{marginTop: 16}}>
                    <div className="ingredients-header">
                        <h4>Ingredients</h4>
                        <img src='src/assets/plus-icon.svg' />
                    </div>
                    <div className="nutrition-item_container">
                        <NutritionItem 
                            id={"1"}
                            nutritionName={"apples"} 
                            unit={"kg"} 
                            amount={"3"}
                            onDelete={handleDeleteIngredient}
                            onAmountChange={handleAmountChangeIngredient}
                            withCheckmark={true}
                            isLastOne={false}
                        />
                        <NutritionItem 
                            id={"2"}
                            nutritionName={"bananas"} 
                            unit={"kg"} 
                            amount={"2"}
                            onDelete={handleDeleteIngredient}
                            onAmountChange={handleAmountChangeIngredient}
                            withCheckmark={true}
                            isLastOne={true}
                        />
                    </div>
                </div>
            </div>

            <div className="column-2">
                <div className="recipe-ingredients">
                    <div className="ingredients-header">
                        <h4>Directions</h4>
                        <img src='src/assets/plus-icon.svg' />
                    </div>
                    <div className="nutrition-item_container">
                        <DirectionItem            
                            id={"1"}
                            descr={"teeeest"}
                            step={1}
                            onDelete={handleDeleteDirection}
                            isLastOne={false}
                        />
                        <DirectionItem            
                            id={"2"}
                            descr={"teeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeest"}
                            step={2}
                            onDelete={handleDeleteDirection}
                            isLastOne={true}
                        />
                    </div>

                </div>


                <div className="recipe-ingredients" style={{marginTop: 16}}>
                    <div className="ingredients-header">
                        <h4>Nutritions</h4>
                        <img src='src/assets/plus-icon.svg' />
                    </div>
                    <div className="nutrition-item_container">
                        <NutritionItem 
                            id={"3"}
                            nutritionName={"Calories"} 
                            unit={"kcal"} 
                            amount={"450"}
                            onDelete={handleDeleteIngredient}
                            onAmountChange={handleAmountChangeIngredient}
                            withCheckmark={false}
                            isLastOne={false}
                        />
                        <NutritionItem 
                            id={"4"}
                            nutritionName={"Saturated Fat"} 
                            unit={"g"} 
                            amount={"8"}
                            onDelete={handleDeleteIngredient}
                            onAmountChange={handleAmountChangeIngredient}
                            withCheckmark={false}
                            isLastOne={true}
                        />
                    </div>
                </div>

            </div>
        </div>
    </div>
    )
}

export default RecipePage