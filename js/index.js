let rightAnswersPositions = []

const getApiCategories = async () => {
    const response = await fetch('https://opentdb.com/api_category.php')
    const responseJSON = await response.json()
    const triviaCategoriesArray = responseJSON.trivia_categories
    createCategories(triviaCategoriesArray)
}

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
    let paramNames = ["category", "difficulty", "type"]
    let params = [category, difficulty, answerType]
    for (let paramPosition in params){
        if(params[paramPosition]!="default"){
            triviaURL += "&" + paramNames[paramPosition] + "=" + params[paramPosition]
        }
    }
    createQuestions(triviaURL)

}

const createQuestions = async (triviaURL) => {
    const response = await fetch(triviaURL)
    const responseJSON = await response.json()
    if(responseJSON.response_code!=0){
        alert("No se ha podido generar la trivia. Intenta nuevamente con otros parámetros.")
    }else{
        const questionsArray = responseJSON.results
        console.log(questionsArray)
        document.querySelector("#questions-container-js").innerHTML = ""
        for(let i = 0; i < 10; i++){
            let options = []
            if (questionsArray[i].type=="boolean"){
                if(questionsArray[i].correct_answer=="True"){
                    rightAnswersPositions[i] = 0
                } else {
                    rightAnswersPositions[i] = 1
                }
                options = ["True", "False"]
            } else {
                let rightAnswer = Math.floor(4*Math.random())
                rightAnswersPositions[i] = rightAnswer
                let possibleAnswers = questionsArray[i].incorrect_answers
                possibleAnswers.push(questionsArray[i].correct_answer)
                for(let j = 0; j < 4; j++){
                    options[j] = possibleAnswers[(j-rightAnswer-1+4)%4]
                }
            }
            createQuestionCard(questionsArray[i].question, i, options, questionsArray[i].category, questionsArray[i].difficulty)
        }
    }
}

const createQuestionCard = (question, i, options, category, difficulty) => {
    const questionsContainer = document.querySelector("#questions-container-js")
    
    let questionCard = document.createElement("div")
    let cardBody = document.createElement("div")
    let titleContainer = document.createElement("div")
    let cardTitle = document.createElement("h5")
    let circlesContainer = document.createElement("div")
    let redCircle = document.createElement("div")
    let yellowCircle = document.createElement("div")
    let greenCircle = document.createElement("div")

    let subtitle = document.createElement("h6")
    let questionText = document.createElement("p")

    questionCard.appendChild(cardBody)
    cardBody.appendChild(titleContainer)
    titleContainer.appendChild(cardTitle)
    titleContainer.appendChild(circlesContainer)
    circlesContainer.appendChild(redCircle)
    circlesContainer.appendChild(yellowCircle)
    circlesContainer.appendChild(greenCircle)

    cardBody.appendChild(subtitle)
    cardBody.appendChild(questionText)
    for(let j = 0; j < options.length; j++){
        let formCheck = document.createElement("div")
        let input = document.createElement("input")
        let label = document.createElement("label")

        input.setAttribute("type", "radio")
        input.setAttribute("name", `answer${i}-js`)
        input.setAttribute("id", `option${j}-q${i}`)
        input.setAttribute("value", j)
        label.setAttribute("for", `option${j}-q${i}`)

        if(j==0){
            input.required = true
        }

        formCheck.classList.add("form-check")
        input.classList.add("form-check-input")
        label.classList.add("form-check-label")

        label.innerHTML = options[j]

        formCheck.appendChild(input)
        formCheck.appendChild(label)
        cardBody.appendChild(formCheck)
    }

    cardTitle.textContent = `Pregunta ${i+1}`
    subtitle.textContent = category
    questionText.innerHTML = question

    questionCard.setAttribute("id", `question-card-${i}`)

    questionCard.classList.add("card", "question-card", "form-control")
    cardBody.classList.add("card-body")
    titleContainer.classList.add("title-container")
    cardTitle.classList.add("card-title")
    circlesContainer.classList.add("circles-container")
    redCircle.classList.add("circle", "circle-red", "opaque")
    yellowCircle.classList.add("circle", "circle-yellow", "opaque")
    greenCircle.classList.add("circle", "circle-green", "opaque")

    switch (difficulty) {
        case "easy":
            greenCircle.classList.remove("opaque")
            break
        case "medium":
            yellowCircle.classList.remove("opaque")
            break
        case "hard":
            redCircle.classList.remove("opaque")
            break
    }

    subtitle.classList.add("card-subtitle", "mb-2", "text-body-secondary")
    questionText.classList.add("card-text")

    questionsContainer.appendChild(questionCard)
}

const checkAnswers = () => {
    let score = 0
    for(let i = 0; i < 10; i++){
        const questionCard = document.querySelector(`#question-card-${i}`)
        const answerName = `answer${i}-js`
        const answer = document.querySelector('input[name='+answerName+']:checked').value
        if(answer == rightAnswersPositions[i]){
            score +=100
            questionCard.classList.add("is-valid")
            questionCard.classList.remove("is-invalid")
        } else {
            questionCard.classList.add("is-invalid")
            questionCard.classList.remove("is-valid")
        }
    }
    alert(`Tu puntaje es: ${score}`)
}

const resetAnswers = () => {
    for(let i = 0; i < 10; i++){
        const questionCard = document.querySelector(`#question-card-${i}`)
        questionCard.classList.remove("is-valid", "is-invalid")
    }
}

getApiCategories()

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#type-form-js").addEventListener("submit", (event)=>{
        event.preventDefault()
        generateTrivia()
    })
    document.querySelector("#questions-form-js").addEventListener("submit", (event)=>{
        event.preventDefault()
        checkAnswers()
    })
    document.querySelector("#questions-form-js").addEventListener("reset", ()=>{
        resetAnswers()
    })
})