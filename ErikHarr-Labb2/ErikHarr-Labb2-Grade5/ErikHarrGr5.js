// Array to store all quiz questions
const questions = JSON.parse(localStorage.getItem("quizQuestions")) || [];

// Render questions in quiz creation container
function renderQuizContainer() {
    const quizContainer = document.getElementById("quizContainer");
    quizContainer.innerHTML = ""; // Clear previous entries

    // Synchronize with localStorage
    const storedQuestions = JSON.parse(localStorage.getItem("quizQuestions")) || [];
    questions.length = 0;
    questions.push(...storedQuestions);

    questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("quizQuestion");

        const questionText = document.createElement("p");
        questionText.innerText = `${index + 1}. ${question.text}`;
        questionDiv.appendChild(questionText);

        question.answers.forEach(answer => {
            const answerText = document.createElement("p");
            answerText.innerText = `Answer: ${answer.text} - ${answer.correct ? "Correct" : "Incorrect"}`;
            questionDiv.appendChild(answerText);
        });

        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete Question";
        deleteButton.onclick = () => deleteQuestion(index); // Call delete function
        questionDiv.appendChild(deleteButton);

        quizContainer.appendChild(questionDiv);
    });
}

// Delete question function
function deleteQuestion(index) {
    questions.splice(index, 1); // Remove question at the specified index
    localStorage.setItem("quizQuestions", JSON.stringify(questions)); // Update local storage
    renderQuizContainer(); // Re-render the container to reflect changes
}

// Handle answer type selection to display correct input fields
function handleAnswerTypeChange() {
    const answerContainer = document.getElementById("answerContainer");
    answerContainer.innerHTML = ""; // Clear previous inputs
    const answerType = document.getElementById("answerType").value;

    if (answerType === "text") {
        const textAnswerInput = document.createElement("input");
        textAnswerInput.type = "text";
        textAnswerInput.placeholder = "Correct answer for textbox";
        textAnswerInput.name = "correctAnswer";
        textAnswerInput.required = true;
        answerContainer.appendChild(textAnswerInput);
    } else {
        const addAnswerButton = document.createElement("button");
        addAnswerButton.type = "button";
        addAnswerButton.innerText = "Add Answer";
        addAnswerButton.onclick = addAnswer;
        answerContainer.appendChild(addAnswerButton);
    }
}

// Add a new answer field for multiple-choice or radio answers
function addAnswer() {
    const answerContainer = document.getElementById("answerContainer");
    const answerType = document.getElementById("answerType").value;

    const answerDiv = document.createElement("div");
    answerDiv.classList.add("answerInput");

    const answerInput = document.createElement("input");
    answerInput.type = "text";
    answerInput.name = "answer";
    answerInput.placeholder = "Answer text";
    answerInput.required = true;

    const correctCheckbox = document.createElement("input");
    correctCheckbox.type = answerType === "radio" ? "radio" : "checkbox";
    correctCheckbox.name = answerType === "radio" ? "correctAnswerRadio" : "correctAnswer";
    correctCheckbox.title = "Mark as correct";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.innerText = "Remove Answer";
    removeButton.onclick = () => answerDiv.remove();

    answerDiv.appendChild(answerInput);
    answerDiv.appendChild(correctCheckbox);
    answerDiv.appendChild(removeButton);
    answerContainer.appendChild(answerDiv);
}

// Save question to the questions array and local storage
function saveQuestion(event) {
    event.preventDefault();

    const questionText = document.getElementById("questionText").value.trim();
    const answerType = document.getElementById("answerType").value;

    if (!questionText) { //question validation
        alert("Please enter a question.");
        return;
    }

    let answers = [];
    if (answerType === "text") {
        const correctAnswerInput = document.querySelector("input[name='correctAnswer']");
        const correctAnswer = correctAnswerInput ? correctAnswerInput.value.trim() : "";

        if (correctAnswer) {
            answers.push({ text: correctAnswer, correct: true });
        } else {
            alert("Please provide a correct answer for the textbox question.");
            return;
        }
    } else {
        answers = Array.from(document.querySelectorAll("#answerContainer .answerInput"))
            .map(answerDiv => {
                const text = answerDiv.querySelector("input[name='answer']").value.trim();
                const correct = answerDiv.querySelector(answerType === "radio" ? "input[type='radio']" : "input[type='checkbox']").checked;
                return text ? { text, correct } : null;
            })
            .filter(Boolean); // Only keeps non-null answers
    }

    const questionObj = {
        text: questionText,
        type: answerType,
        answers: answers
    };

    questions.push(questionObj);
    localStorage.setItem("quizQuestions", JSON.stringify(questions));
    renderQuizContainer();
    resetQuestionForm();
}

// Reset form and render default answer options
function resetQuestionForm() {
    document.getElementById("newQuestionForm").reset();
    handleAnswerTypeChange(); // Render answer options based on default answer type
}

// Start the quiz by displaying each question in quiz mode
function startQuiz() {
    const quizContainer = document.getElementById("quizContainer");
    quizContainer.innerHTML = ""; // Clear previous entries for quiz mode

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

// Evaluate quiz answers and display the score
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

            if (correctAnswers.length === userAnswers.length && correctAnswers.every(ans => userAnswers.includes(ans))) {
                score++;
            }
        }
    });

    const scoreContainer = document.getElementById("scoreContainer");
    scoreContainer.innerHTML = `Your score: ${score} out of ${questions.length}`;
}

renderQuizContainer();
handleAnswerTypeChange();
