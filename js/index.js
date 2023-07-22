const getApiCategories = async () => {
    const response = await fetch('https://opentdb.com/api_category.php')
    console.log(response)
    const responseJSON = await response.json()
    const triviaCategoriesArray = responseJSON.trivia_categories
    createCategories(triviaCategoriesArray)
}

getApiCategories()

const createCategories = (categoriesArray) => {
    const categoryContainer = document.querySelector("#category-container-js")
    for(let element of categoriesArray){
        let option = document.createElement("option")
        option.value = element.id
        option.text = element.name
        categoryContainer.appendChild(option)
    }
}

const generateTrivia = () => {
    let triviaURL = "https://opentdb.com/api.php?amount=10"
    const difficulty = document.querySelector("#difficulty-js").value
    const answerType = document.querySelector('input[name="answer-type-js"]:checked').value
    const category = document.querySelector("#category-container-js").value
    console.log(`Difficulty: ${difficulty}, Answer Type: ${answerType}, Category: ${category}`)
    let paramNames = ["category", "difficulty", "type"]
    let params = [category, difficulty, answerType]
    for (let paramPosition in params){
        if(params[paramPosition]!="default"){
            triviaURL += "&" + paramNames[paramPosition] + "=" + params[paramPosition]
        }
    }
    console.log(triviaURL)
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#type-form-js").addEventListener("submit", (event)=>{
        event.preventDefault()
        generateTrivia()
    })
})