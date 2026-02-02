import './create-recipe-page.css'
import NutritionItem from "./NutritionItem";
import DirectionItem from "./DirectionItem";
import AddField from "./AddField";
import AddDirection from "./AddDirection";
import { useState } from 'react'
import type { NutritionData } from "../../types/NutritionData";
import type { IngredientData } from "../../types/IngredientData";
import type { DirectionData } from "../../types/DirectionData";
import type { RecipeData } from "../../types/RecipeData";
import { useNavigate } from "react-router-dom";


function CreateRecipePage( 
{
    onCreate
}:
    {
        onCreate: (r: RecipeData) => void;
    }
) {

    const navigate = useNavigate();
    const [nutritionItems, setNutritionItems] = useState<NutritionData[]>([
        { name: "Calories", amount: "0", unit: "kcal", id: crypto.randomUUID() },
        // { name: "Carbonhydrates", amount: "0", unit: "kcal", id: crypto.randomUUID() }
    ]);

    const [ingredientItems, setIngredientItems] = useState<IngredientData[]>([
        // { name: "sugar", amount: "200", unit: "g", id: crypto.randomUUID() }
    ]);

    const [directionItems, setDirectionItems] = useState<DirectionData[]>([
        // { descr: "Test", step: 1, id: crypto.randomUUID() }
    ]);

    const [recipeName, setRecipeName] = useState<string>("Untitled");
    const [recipeDescr, setRecipeDescr] = useState<string>("");
    const [recipeCookDuration, setRecipeCookDuration] = useState<string>("");
    const [recipeServings, setRecipeServings] = useState<number>(1);

    function handleSaveRecipe() {
        const recipeData: RecipeData = {
            name: recipeName,
            description: recipeDescr,
            ingredients: ingredientItems.map(item => ({
                id: item.id,
                name: item.name,
                amount: item.amount,
                unit: item.unit
            })),
            nutritions: nutritionItems.map(item => ({
                id: item.id,
                name: item.name,
                amount: item.amount,
                unit: item.unit
            })),
            directions: directionItems.map(item => ({
                id: item.id,
                step: item.step,
                descr: item.descr
            })),
            cookDuration: recipeCookDuration,
            servings: recipeServings,
        };

        onCreate(recipeData);
        navigate("/recipe");
    }

    // DIRECTION //
    function handleDeleteDirection(id: string) {
        setDirectionItems(prev =>
            prev
                .filter(item => item.id !== id)
                .map((item, index) => ({
                    ...item,
                    step: index + 1
                }))
        );
    }

    function handleAddDirection(input: string){
        const newItem: DirectionData = ({
            id: crypto.randomUUID(),
            step: directionItems.length+1,
            descr: input
        });

        setDirectionItems(prev => [...prev, newItem])
    }

    // NUTRITION //
    function handleAddNutrition(input: string) {
        const parts: string[] = input
            .split(",")
            .map(p => p.trim())
            .filter(Boolean); // delete all empty strings

        const newItems: NutritionData[] = [];

        for (let i = 0; i < parts.length; i++) {
            const match = parts[i].match(/^(\d+)\s*(\w+)\s*(.*)$/);
            if (!match) continue;

            const [, amount, unit, name] = match;

            newItems.push({
                id: crypto.randomUUID(),
                name,
                amount,
                unit
            });
        }

        if (newItems.length > 0) {
            setNutritionItems(prev => [...prev, ...newItems]);
        }
    }

    function handleDeleteNutrition(id: string){
        setNutritionItems(prev => prev.filter(n => n.id !== id));
    }

    // INGREDIENTS //
    function handleAddIngredient(input: string) {
        const parts: string[] = input
            .split(",")
            .map(p => p.trim())
            .filter(Boolean); // delete all empty strings

        const newItems: IngredientData[] = [];

        for (let i = 0; i < parts.length; i++) {
            const match = parts[i].match(/^(\d+)\s*(\w+)\s*(.*)$/);
            if (!match) continue;

            const [, amount, unit, name] = match;

            newItems.push({
                id: crypto.randomUUID(),
                name,
                amount,
                unit
            });
        }

        if (newItems.length > 0) {
            setIngredientItems(prev => [...prev, ...newItems]);
        }
    }

    function handleDeleteIngredient(id: string){
        setIngredientItems(prev => prev.filter(n => n.id !== id));
    }

    function handleAmountChangeNutrition(id: string, newAmount: string) {
        setNutritionItems(prev =>
            prev.map(item =>
            item.id === id
                ? { ...item, amount: newAmount }
                : item
            )
        );
    }

    function handleAmountChangeIngredient(id: string, newAmount: string) {
        setIngredientItems(prev =>
            prev.map(item =>
            item.id === id
                ? { ...item, amount: newAmount }
                : item
            )
        );
    }
   

    return (
    <>
        <div className="create-recipe-top-part">
            <p className="create-recipe-title">Create new recipe</p>
            <button 
                className="primary-btn"
                onClick={handleSaveRecipe}
            >Save Recipe</button>
            {/* <img src='/src/assets/search-icon.svg'></img> */}
        </div>

        <div className="create-recipe-page_container">
            <div className="create-recipe-page_container-wrapper">
                <div className="column-1">
                    {/* ==== GENERATE RECIPE INFORMATION ====*/}
                    <div className="create-recipe-box" style={{marginBottom: "12px"}}>
                        <div className="gen-recipe-info_container">
                            <p className="sub-heading-1">GENERATE RECIPE INFORMATION</p>

                            <div className="sub-heading-input-box">
                                <p className="sub-heading-2">Import a recipe with URL</p>
                                <div className="import-box">
                                    <input 
                                        className='primary-input url-input' 
                                        placeholder="paste an URL link..."
                                        spellCheck={false}
                                    />
                                    <button className="secondary-btn">Import</button>
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
                                <input 
                                    className='primary-input' 
                                    placeholder="e.g: Chocolate Pie"
                                    value={recipeName}
                                    spellCheck={false}
                                    onChange={(e) => setRecipeName(e.target.value)}
                                />
                            </div>
                            <div className="sub-heading-input-box">
                                <p className="sub-heading-2">Description</p>
                                <input 
                                    className="description-input primary-input" 
                                    placeholder="e.g: This Chocolate Pie is very delicious."
                                    value={recipeDescr}
                                    spellCheck={false}
                                    onChange={(e) => setRecipeDescr(e.target.value)}
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
                                        type="number"
                                        min={1}
                                        max={999}
                                        value={recipeServings}
                                        onChange={(e) => setRecipeServings(Number(e.target.value))}
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
                                        type="number"
                                        min={1}
                                        max={999}
                                        value={recipeCookDuration}
                                        onChange={(e) => setRecipeCookDuration(e.target.value)}
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
                                <p className="sub-heading-2">Add Nutritions</p>
                                <div className="nutrition-item_container">
                                    {nutritionItems.map(item => (
                                        <NutritionItem 
                                            key={item.id} 
                                            id={item.id}
                                            nutritionName={item.name} 
                                            unit={item.unit} 
                                            amount={item.amount}
                                            onDelete={handleDeleteNutrition}
                                            onAmountChange={handleAmountChangeNutrition}
                                            withCheckmark={false}
                                            isLastOne={false}
                                        />
                                    ))}
                                    {/* <NutritionItem nutritionName='Calories' unit='kcal' amount></NutritionItem>
                                    <NutritionItem nutritionName='Carbonhydrates' unit='kcal'></NutritionItem> */}
                                    <AddField addFieldPlaceholderText='45g protein' onAdd={handleAddNutrition}></AddField>
                                </div>
                            </div>

                            <div className="sub-heading-input-box"
                            style={{marginTop: "28px"}}>
                                <p className="sub-heading-2">Add Ingredients</p>
                                <div className="nutrition-item_container">
                                    {ingredientItems.map(item => (
                                        <NutritionItem 
                                            key={item.id} 
                                            id={item.id}
                                            nutritionName={item.name} 
                                            unit={item.unit} 
                                            amount={item.amount}
                                            onDelete={handleDeleteIngredient}
                                            onAmountChange={handleAmountChangeIngredient}
                                            withCheckmark={false}
                                            isLastOne={false}
                                        />
                                    ))}
                                    {/* <NutritionItem nutritionName='dark chocolate (at least 60% cocoa)' unit='g'></NutritionItem>
                                    <NutritionItem nutritionName='baking powder' unit='g'></NutritionItem> */}
                                    <AddField addFieldPlaceholderText='200g sugar, 1 tsp salt' onAdd={handleAddIngredient}></AddField>
                                </div>
                            </div>

                            <div className="sub-heading-input-box"
                            style={{marginTop: "28px"}}>
                                <p className="sub-heading-2">Add Directions</p>
                                <div className="nutrition-item_container">
                                    {directionItems.map(item => (
                                        <DirectionItem 
                                            key={item.id}
                                            id={item.id}
                                            descr={item.descr}
                                            step={item.step}
                                            onDelete={handleDeleteDirection}
                                            isLastOne={false}
                                        />
                                    ))}
                                    {/* <DirectionItem step={1} descr='test'></DirectionItem>
                                    <DirectionItem step={2} descr='testtesttesttest'></DirectionItem> */}
                                    <AddDirection 
                                        step={directionItems.length+1} 
                                        onAdd={handleAddDirection}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
        </>
    )
}

export default CreateRecipePage