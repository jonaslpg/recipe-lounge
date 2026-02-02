import './recipes-page.css'

function RecipesPage( 
{
}:
    {
    }
) {

    return (
    <div className='recipes-page_container'>
        <div className="recipes-top-part">
            <div className="top-part-left-side">
                <h3>Home</h3>
                <p className='line'>|</p>
                <p>2 Recipes collected</p>
            </div>
            <div className="top-part-right-side">
                <button className='create-btn'>
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
            <div className="single-recipe">
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
            </div>

            <div className="single-recipe">
                <img 
                    src='src/assets/recipe-image-dummy-2.png'
                    className='thumb'
                />
                <div className="single-recipe-content">
                    <p className='recipe-name'>Quick Breakfast</p>
                    <div className="recipe-info">
                        <div className="info-1">
                            <img src='src/assets/fire.svg'/>
                            <p>259kcal</p>
                        </div>
                        <div className="info-2">
                            <img src='src/assets/alarm-clock.svg'/>
                            <p>5m</p>
                        </div>
                        <div className="info-3">
                            <img src='src/assets/blossom.svg'/>
                            <p>10g protein</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    )
}

export default RecipesPage