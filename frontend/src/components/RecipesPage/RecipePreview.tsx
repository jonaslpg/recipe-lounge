import './recipes-page.css';
import type { RecipeData } from "../../types/RecipeData";

function RecipePreview( 
{
    recipe
}:
    {
        recipe: RecipeData | null;
    }
) {


    return (
        <div className="single-recipe">
            <img 
                src='src/assets/recipe-image-dummy-2.png'
                className='thumb'
            />
            <div className="single-recipe-content">
                <p className='recipe-name'>{recipe?.name}</p>
                <div className="recipe-info">
                    <div className="info-1">
                        <img src='src/assets/fire.svg'/>
                        <p>259kcal</p>
                    </div>
                    <div className="info-2">
                        <img src='src/assets/alarm-clock.svg'/>
                        <p>{recipe?.cookDuration ? recipe?.cookDuration : "NULL"}</p>
                    </div>
                    <div className="info-3">
                        <img src='src/assets/blossom.svg'/>
                        <p>{
                        recipe?.nutritions[0] 
                        ? 
                        recipe?.nutritions[0].amount + 
                        " " + 
                        recipe?.nutritions[0].unit + 
                        " " +
                        recipe?.nutritions[0].name
                        : 
                        "NULL"}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecipePreview