import './recipe-page.css'
import NutritionItem from "../CreateRecipePage/NutritionItem"
import DirectionItem from "../CreateRecipePage/DirectionItem"
import type { RecipeData } from "../../types/RecipeData";

function RecipePage( 
{
    recipe
}:
    {
        recipe: RecipeData | null;
    }
) {

    function handleDeleteIngredient(id: string){
        
    }

    function handleAmountChangeIngredient(id: string, newAmount: string) {

    }

    function handleDeleteDirection(id: string){

    }
   
    if (!recipe) {
        return <p>No recipe found</p>;
    }

    return (
    <div className='page-wrapper'>
        <div className="recipe-page_container">
            <div className="column-1">
                <div className="recipe-header">
                    <img src='src/assets/image-dummy-1.png'></img>
                    <div className="recipe-header-content">
                        <h3>{recipe.name}</h3>
                        <p>{recipe.description}
                        <span> More</span></p>
                        <div className="header-settings">
                            <div className="servings">
                                <img src='src/assets/minus-iconV2.svg'/>
                                <div className="servings-text">
                                    <p>Servings</p>
                                    <p className='amount'>{recipe.servings}</p>
                                </div>
                                <img src='src/assets/plus-iconV2.svg'/>
                            </div>
                            <div className="cook-duration">
                                <p>Cook Duration</p>
                                <p className='amount'>{recipe.cookDuration}</p>
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
                        {recipe.ingredients.map(item => (
                            <NutritionItem 
                                key={item.id} 
                                id={item.id}
                                nutritionName={item.name} 
                                unit={item.unit} 
                                amount={item.amount}
                                onDelete={handleDeleteIngredient}
                                onAmountChange={handleAmountChangeIngredient}
                                withCheckmark={false}
                                isLastOne={recipe.ingredients[recipe.ingredients.length-1] === item ? true : false}
                            />
                        ))}
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
                        {recipe.directions.map(item => (
                            <DirectionItem 
                                key={item.id} 
                                id={item.id}
                                descr={item.descr}
                                step={item.step}
                                onDelete={handleDeleteDirection}
                                isLastOne={recipe.directions[recipe.directions.length-1] === item ? true : false}
                            />
                        ))}
                    </div>

                </div>


                <div className="recipe-ingredients" style={{marginTop: 16}}>
                    <div className="ingredients-header">
                        <h4>Nutritions</h4>
                        <img src='src/assets/plus-icon.svg' />
                    </div>
                    <div className="nutrition-item_container">
                        {recipe.nutritions.map(item => (
                            <NutritionItem 
                                key={item.id} 
                                id={item.id}
                                nutritionName={item.name} 
                                unit={item.unit} 
                                amount={item.amount}
                                onDelete={handleDeleteIngredient}
                                onAmountChange={handleAmountChangeIngredient}
                                withCheckmark={false}
                                isLastOne={recipe.nutritions[recipe.nutritions.length-1] === item ? true : false}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    </div>
    )
}

export default RecipePage