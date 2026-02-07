import './recipe-page.css';
import MeasuredItem from "../CreateRecipePage/MeasuredItem";
import DirectionItem from "../CreateRecipePage/DirectionItem";
import type { RecipeData } from "../../types/RecipeData";

import { useItemActions } from "./hooks/useItemActions";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function RecipePage() {

    const { id } = useParams();
    const [recipe, setRecipe] = useState<RecipeData | null>(null);
    const [loading, setLoading] = useState(true);

    const { handleDeleteIngredient, handleAmountChangeIngredient, handleDeleteDirection } = useItemActions();
   
    useEffect(() => {
        fetch(`http://localhost:8080/api/recipes/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Recipe not found");
                return res.json();
            })
            .then(data => setRecipe(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p>Loading…</p>;
    if (!recipe) return <p>Recipe not found</p>;

    return (
    <div className='page-wrapper'>
        <div className="recipe-page_container">
            <div className="column-1">
                <div className="recipe-header">
                    <img src={`http://localhost:8080${recipe.image}`}></img> 
                    {/* NOTE: only temporary with localhost*/}
                    <div className="recipe-header-content">
                        <h3>{recipe.name}</h3>
                        {recipe.description && <p>{recipe.description}
                        <span> More</span></p>}
                        <div className="header-settings">
                            <div className="servings">
                                <img src='/src/assets/minus-iconV2.svg'/>
                                <div className="servings-text">
                                    <p>Servings</p>
                                    <p className='amount'>{recipe.servings}</p>
                                </div>
                                <img src='/src/assets/plus-iconV2.svg'/>
                            </div>
                            {recipe.cookDuration &&
                            <div className="cook-duration">
                                <p>Cook Duration</p>
                                <p className='amount'>{recipe.cookDuration}</p>
                            </div>}
                            {/* TODO: maybe extend this section later? */}
                        </div>
                    </div>
                </div>

                <div className="recipe-items" style={{marginTop: 16}}>
                    <div className="recipe-items-header">
                        <h4>Ingredients</h4>
                        <img src='/src/assets/plus-icon.svg' />
                    </div>
                    {recipe.ingredients.length !== 0 && <div className="item_container">
                        {recipe.ingredients.map(item => (
                            <MeasuredItem 
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
                    </div>}
                </div>
            </div>

            <div className="column-2">
                <div className="recipe-items">
                    <div className="recipe-items-header">
                        <h4>Directions</h4>
                        <img src='/src/assets/plus-icon.svg' />
                    </div>
                    {recipe.directions.length !== 0 && <div className="item_container">
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
                    </div>}
                </div>

                <div className="recipe-items" style={{marginTop: 16}}>
                    <div className="recipe-items-header">
                        <h4>Nutritions</h4>
                        <img src='/src/assets/plus-icon.svg' />
                    </div>
                    {recipe.nutritions.length !== 0 && <div className="item_container">
                        {recipe.nutritions.map(item => (
                            <MeasuredItem 
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
                    </div>}
                </div>
            </div>
        </div>
    </div>
    )
}

export default RecipePage