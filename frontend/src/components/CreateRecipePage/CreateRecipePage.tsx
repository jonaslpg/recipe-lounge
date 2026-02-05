import './create-recipe-page.css';
import MeasuredItem from "./MeasuredItem";
import DirectionItem from "./DirectionItem";
import AddField from "./AddField";
import AddDirection from "./AddDirection";
import { useState } from 'react';
import type { RecipeData } from "../../types/RecipeData";
import { useNavigate } from "react-router-dom";

import { useMeasuredItems } from "./hooks/useMeasuredItems";
import { useDirectionItems } from "./hooks/useDirectionItems";


function CreateRecipePage( 
{
    onCreate
}:
    {
        onCreate: (r: RecipeData) => void;
    }
) {

    const navigate = useNavigate();

    const [recipeName, setRecipeName] = useState<string>("Untitled");
    const [recipeDescr, setRecipeDescr] = useState<string>("");
    const [recipeCookDuration, setRecipeCookDuration] = useState<string>("");
    const [recipeServings, setRecipeServings] = useState<number>(1);
    const [recipeImage, setRecipeImage] = useState<string | undefined>();

    const { 
        handleAddNutrition,
        handleDeleteNutrition,
        handleAmountChangeNutrition,
        handleAddIngredient,
        handleDeleteIngredient,
        handleAmountChangeIngredient,
        nutritionItems,
        ingredientItems
    } = useMeasuredItems();

    const { handleDeleteDirection, handleAddDirection, directionItems } = useDirectionItems();

    function handleSaveRecipe() {
        const recipeData: RecipeData = {
            id: Date.now(),
            name: recipeName,
            description: recipeDescr,
            image: recipeImage,
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


    /* NOTE: only temporary */
    function handleImageFile(file: File) {
        if (!file.type.match(/image\/(png|jpeg)/)) {
            alert("Nur PNG oder JPG erlaubt");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setRecipeImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleImageFile(file);
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) handleImageFile(file);
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
                                    {/* <input 
                                        className="description-input primary-input" 
                                        placeholder="e.g: This Chocolate Pie is very delicious."
                                        value={recipeDescr}
                                        spellCheck={false}
                                        onChange={(e) => setRecipeDescr(e.target.value)}
                                    /> */}
                                    <textarea
                                    rows={1}
                                    className="description-input primary-input"
                                    placeholder="e.g: This Chocolate Pie is very delicious."
                                    value={recipeDescr}
                                    spellCheck={false}
                                    onChange={(e) => setRecipeDescr(e.target.value)}
                                    onInput={(e) => {
                                        const el = e.currentTarget;
                                        el.style.height = "auto";
                                        el.style.height = el.scrollHeight + "px";
                                    }}
                                    maxLength={300}
                                    />
                                </div>
                                {/* <div className="sub-heading-input-box">
                                    <p className="sub-heading-2">Image</p>
                                    <div className="drop-area-image">
                                        <img src='/src/assets/image-icon.svg'></img>
                                        <p>Drop your image here, or select <span>Click to browse</span></p>
                                    </div>
                                </div> */}
                                <div className="sub-heading-input-box">
                                    <p className="sub-heading-2">Image</p>

                                    <div
                                    className="drop-area-image"
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={() => document.getElementById("imageInput")?.click()}
                                    >
                                        {recipeImage ? (
                                            // <>
                                            <img src={recipeImage} alt="Recipe" className="image-preview" />
                                            /* <div className="image-overlay">Click to change</div>
                                            </> */
                                        ) : (
                                            <>
                                                <img className='image-icon' src="/src/assets/image-icon.svg" />
                                                <p>
                                                    Drop your image here, or select <span>Click to browse</span>
                                                </p>
                                            </>
                                        )}

                                        <input
                                            id="imageInput"
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            hidden
                                            onChange={handleFileSelect}
                                        />
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
                                    <div className="item_container">
                                        {nutritionItems.map(item => (
                                            <MeasuredItem 
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
                                        <AddField addFieldPlaceholderText='45g protein' onAdd={handleAddNutrition}></AddField>
                                    </div>
                                </div>

                                <div className="sub-heading-input-box"
                                style={{marginTop: "28px"}}>
                                    <p className="sub-heading-2">Add Ingredients</p>
                                    <div className="item_container">
                                        {ingredientItems.map(item => (
                                            <MeasuredItem 
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
                                        <AddField addFieldPlaceholderText='200g sugar, 1 tsp salt' onAdd={handleAddIngredient}></AddField>
                                    </div>
                                </div>

                                <div className="sub-heading-input-box"
                                style={{marginTop: "28px"}}>
                                    <p className="sub-heading-2">Add Directions</p>
                                    <div className="item_container">
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