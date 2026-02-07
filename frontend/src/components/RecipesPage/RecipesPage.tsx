import './recipes-page.css';
import { useNavigate } from "react-router-dom";
import type { RecipeData } from "../../types/RecipeData";
import { useState, useEffect } from 'react';
import RecipePreview from "./RecipePreview";

function RecipesPage() {

    const navigate = useNavigate();

    const [recipeItems, setRecipeItems] = useState<RecipeData[]>([]);

    useEffect(() => {
        fetch("/api/recipes")
            .then(res => res.json())
            .then(setRecipeItems);
    }, []);

    function handleClickCreate(){
        navigate("/create");
    }

    return (
    <div className='recipes-page_container'>
        <div className="recipes-top-part">
            <div className="top-part-left-side">
                <h3>Home</h3>
                <p className='line'>|</p>
                <p>{`${recipeItems?.length} Recipe${recipeItems?.length !== 1 ? "s" : ""} collected`}</p>
            </div>
            <div className="top-part-right-side">
                <button 
                    className='create-btn'
                    onClick={handleClickCreate}
                >
                    <img src='src/assets/plus-icon.svg'/>Create Recipe
                </button>
                <button className='settings-btn'>
                    <img src='src/assets/settings.svg'/>
                </button>
                <button className='filter-btn'>
                    <img src='src/assets/filter-lines.svg'/>Filter
                </button>
            </div>
        </div>
        <div className="all-recipes">
            {/* <div className="single-recipe">
                <img 
                    src='src/assets/recipe-image-dummy-1.png'
                    className='thumb'
                />
                <div className="single-recipe-content">
                    <p className='recipe-name'>Honey Pancakes</p>
                    <div className="recipe-info">
                        <div className="info-1">
                            <img src='src/assets/fire.svg'/>
                            <p>433kcal</p>
                        </div>
                        <div className="info-2">
                            <img src='src/assets/alarm-clock.svg'/>
                            <p>15m</p>
                        </div>
                        <div className="info-3">
                            <img src='src/assets/blossom.svg'/>
                            <p>15g protein</p>
                        </div>
                    </div>
                </div>
            </div> */}

            {recipeItems.map((item, i) => (
                <RecipePreview key={i} recipe={item}/>
            ))}
        </div>
    </div>
    )
}

export default RecipesPage