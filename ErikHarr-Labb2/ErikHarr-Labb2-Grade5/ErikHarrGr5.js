// Stores quiz questions (loaded from localStorage)
const questions = JSON.parse(localStorage.getItem("quizQuestions")) || [];

// Renders the current quiz questions
function renderQuizContainer() {
    const quizContainer = document.getElementById("quizContainer");
    quizContainer.innerHTML = "";

    // Update local array from localStorage
    questions.length = 0;
    questions.push(...(JSON.parse(localStorage.getItem("quizQuestions")) || []));

    // Display each question with delete option
    questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("quizQuestion");

        const questionText = document.createElement("p");
        questionText.innerText = `${index + 1}. ${question.text}`;
        questionDiv.appendChild(questionText);

        // List each answer
        question.answers.forEach(answer => {
            const answerText = document.createElement("p");
            answerText.innerText = `Answer: ${answer.text} - ${answer.correct ? "Correct" : "Incorrect"}`;
            questionDiv.appendChild(answerText);
        });

        // Add delete button
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete Question";
        deleteButton.onclick = () => deleteQuestion(index);

        questionDiv.appendChild(deleteButton);

        quizContainer.appendChild(questionDiv);
    });
}

// Deletes a question by index
function deleteQuestion(index) {
    var confirmDelete = confirm("Are you sure you want to delete this item?");
    if (confirmDelete) 
    {
        questions.splice(index, 1);
        localStorage.setItem("quizQuestions", JSON.stringify(questions));
        renderQuizContainer();
    }
    
}

// Handles answer type changes to display relevant input fields
function handleAnswerTypeChange() {
    const answerContainer = document.getElementById("answerContainer");
    answerContainer.innerHTML = "";
    const answerType = document.getElementById("answerType").value;

    if (answerType === "text") {
        // Text answer input
        const textAnswerInput = document.createElement("input");
        textAnswerInput.type = "text";
        textAnswerInput.placeholder = "Correct answer for textbox";
        textAnswerInput.name = "correctAnswer";
        textAnswerInput.required = true;
        answerContainer.appendChild(textAnswerInput);
    } else {
        // Add button to create new answer inputs for radio/checkbox
        const addAnswerButton = document.createElement("button");
        addAnswerButton.type = "button";
        addAnswerButton.innerText = "Add Answer";
        addAnswerButton.onclick = addAnswer;
        answerContainer.appendChild(addAnswerButton);
    }
}

// Adds an answer input field based on selected type
function addAnswer() {
    const answerContainer = document.getElementById("answerContainer");
    const answerType = document.getElementById("answerType").value;

    const answerDiv = document.createElement("div");
    answerDiv.classList.add("answerInput");

    // Basic input field
    const answerInput = document.createElement("input");
    answerInput.type = "text";
    answerInput.name = "answer";
    answerInput.placeholder = "Answer text";
    answerInput.required = true;

    // Checkbox/radio for marking correct answers
    const correctCheckbox = document.createElement("input");
    correctCheckbox.type = answerType === "radio" ? "radio" : "checkbox";
    correctCheckbox.name = answerType === "radio" ? "correctAnswerRadio" : "correctAnswer";

    // Remove button for each answer
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.innerText = "Remove Answer";
    removeButton.onclick = () => answerDiv.remove();

    answerDiv.appendChild(answerInput);
    answerDiv.appendChild(correctCheckbox);
    answerDiv.appendChild(removeButton);
    answerContainer.appendChild(answerDiv);
}

// Saves question and answer details to localStorage
function saveQuestion(event) {
    event.preventDefault();

    const questionText = document.getElementById("questionText").value.trim();
    const answerType = document.getElementById("answerType").value;

    // Require a question
    if (!questionText) {
        alert("Please enter a question.");
        return;
    }

    let answers = [];
    if (answerType === "text") {
        // Handles textbox answer type
        const correctAnswerInput = document.querySelector("input[name='correctAnswer']");
        const correctAnswer = correctAnswerInput ? correctAnswerInput.value.trim() : "";

        if (correctAnswer) {
            answers.push({ text: correctAnswer, correct: true });
        } else {
            alert("Please provide a correct answer for the textbox question.");
            return;
        }
    } else {
        // Map answers from input fields for radio/checkbox
        answers = Array.from(document.querySelectorAll("#answerContainer .answerInput"))
            .map(answerDiv => {
                const text = answerDiv.querySelector("input[name='answer']").value.trim();
                const correct = answerDiv.querySelector(answerType === "radio" ? "input[type='radio']" : "input[type='checkbox']").checked;
                return text ? { text, correct } : null;
            })
            .filter(Boolean); // Only keeps valid answers
    }

    // Save to questions array and local storage
    const questionObj = { text: questionText, type: answerType, answers: answers };
    questions.push(questionObj);
    localStorage.setItem("quizQuestions", JSON.stringify(questions));
    renderQuizContainer();
    resetQuestionForm();
}

// Resets form inputs and re-displays answer options based on default type
function resetQuestionForm() {
    document.getElementById("newQuestionForm").reset();
    handleAnswerTypeChange();
}

// Starts the quiz display mode
function startQuiz() {
    const quizContainer = document.getElementById("quizContainer");
    quizContainer.innerHTML = "";

    questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("quizQuestion");

        const questionText = document.createElement("p");
        questionText.innerText = `${index + 1}. ${question.text}`;
        questionDiv.appendChild(questionText);

        if (question.type === "text") {
            const textInput = document.createElement("input");
            textInput.type = "text";
            textInput.dataset.questionIndex = index;
            questionDiv.appendChild(textInput);
        } else {
            question.answers.forEach((answer, answerIndex) => {
                const answerInput = document.createElement("input");
                answerInput.type = question.type === "radio" ? "radio" : "checkbox";
                answerInput.name = `question-${index}`;
                answerInput.value = answer.text;
                answerInput.dataset.questionIndex = index;
                answerInput.dataset.answerIndex = answerIndex;

                const answerLabel = document.createElement("label");
                answerLabel.innerText = answer.text;
                answerLabel.insertBefore(answerInput, answerLabel.firstChild);

                questionDiv.appendChild(answerLabel);
                questionDiv.appendChild(document.createElement("br"));
            });
        }
        quizContainer.appendChild(questionDiv);
    });

    const submitButton = document.createElement("button");
    submitButton.innerText = "Submit Quiz";
    submitButton.onclick = evaluateQuiz;
    quizContainer.appendChild(submitButton);
}

// Checks answers and calculates score
function evaluateQuiz() {
    let score = 0;

    questions.forEach((question, index) => {
        if (question.type === "text") {
            const userAnswer = document.querySelector(`input[type='text'][data-question-index='${index}']`).value.trim();
            if (userAnswer.toLowerCase() === question.answers[0].text.toLowerCase()) {
                score++;
            }
        } else {
            const selectedAnswers = Array.from(document.querySelectorAll(`input[type='${question.type}'][name='question-${index}']:checked`));
            const correctAnswers = question.answers.filter(ans => ans.correct).map(ans => ans.text);
            const userAnswers = selectedAnswers.map(input => input.value);
            // Check if user's answers match correct answers (order doesn't matter)
            if (correctAnswers.every(ans => userAnswers.includes(ans))) {
                score++;
            }
        }
    });

    // Display the score
    const scoreContainer = document.getElementById("scoreContainer");
    scoreContainer.innerHTML = `You scored ${score} out of ${questions.length}.`;
}

// Initial render of questions saved in localStorage
document.addEventListener("DOMContentLoaded", () => {
    renderQuizContainer();
    handleAnswerTypeChange(); // Sets initial answer type display
});

