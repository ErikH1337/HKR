// Helper function to check if the correct checkboxes are selected
function isCheckboxAnswerCorrect(questionId, correctValues) {
    const checkedCheckboxes = [];
    document.querySelectorAll(`input[name="${questionId}"]:checked`).forEach(checkbox => {
        checkedCheckboxes.push(checkbox.value.toLowerCase());
    }); 
    return arraysEqual(checkedCheckboxes, correctValues.map(value => value.toLowerCase()));
}

// Helper function to compare two arrays for equality
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
}

document.getElementById("quizForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let isFormValid = true;
    let score = 0;
    let correctAnswersList = "";

    // First Name Validation
    const firstName = document.getElementById("Fname").value.trim();
    if (!/^[A-Za-zåäöÅÄÖ\s]+$/.test(firstName)) {
        document.getElementById("firstNameError").innerText = "First name is required and should only contain letters.";
        isFormValid = false;
    } else {
        document.getElementById("firstNameError").innerText = "";
    }

    // Last Name Validation
    const lastName = document.getElementById("Lname").value.trim();
    if (!/^[A-Za-zåäöÅÄÖ\s]+$/.test(lastName)) {
        document.getElementById("lastNameError").innerText = "Last name is required and should only contain letters.";
        isFormValid = false;
    } else {
        document.getElementById("lastNameError").innerText = "";
    }

    // Question 1 Validation (single-choice)
    const q1 = document.querySelector('input[name="q1"]:checked');
    if (!q1) {
        document.getElementById("q1Error").innerHTML = "Please select an answer for question 1.";
        isFormValid = false;
    } else {
        document.getElementById("q1Error").innerText = "";
        if (q1.value === "Paris") {
            score++;
        }
        correctAnswersList += "<p>Question 1: The correct answer is 'Paris'</p>";
    }

    // Question 2 Validation (multiple-choice)
    if (!isCheckboxAnswerCorrect("q2", ["Apple", "Banana"])) {
        const checkedFruits = document.querySelectorAll('input[name="q2"]:checked');
        if (checkedFruits.length === 0) {
            document.getElementById("q2Error").innerText = "Please select at least one fruit.";
            isFormValid = false;
        }
    } else {
        document.getElementById("q2Error").innerText = ""; 
        score++; 
    }
    correctAnswersList += "<p>Question 2: The correct answers are 'Apple' and 'Banana'</p>";

    // Favorite Color Validation (optional)
    const favoriteColor = document.getElementById("q3").value.trim().toLowerCase();
    if (favoriteColor === "blue") {
        score++; 
    }
    correctAnswersList += "<p>Question 3: The correct answer is 'blue'</p>";

    // Question 4 Validation (single-choice)
    const q4 = document.querySelector('input[name="q4"]:checked');
    if (q4) {  
        if (q4.value === "19") {
            score++;
        }
    }
    correctAnswersList += "<p>Question 4: The correct answer is '19'</p>";

    // Question 5 Validation (multiple-choice)
    if (!isCheckboxAnswerCorrect("q5", ["Johan", "UC", "Robert", "Oscar"])) {
        const checkedIndividuals = document.querySelectorAll('input[name="q5"]:checked');
        if (checkedIndividuals.length === 0) {
            document.getElementById("q5Error").innerText = "Please select at least one individual.";
            isFormValid = false;
        } 
    } else {
        document.getElementById("q5Error").innerText = ""; 
        score++; 
    }
    correctAnswersList += "<p>Question 5: The correct answers are 'Johan', 'UC', 'Robert', and 'Oscar'</p>";

    // Display score and correct answers if the form is valid
    if (isFormValid) {
        alert(`Your form was submitted successfully! Your score is ${score} out of 5.`);
        document.getElementById("scoreDisplay").innerText = `Your last score: ${score}`;
        document.getElementById("correctAnswersDisplay").innerHTML = "<h3>Correct Answers:</h3>" + correctAnswersList;
    } else {
        document.getElementById("scoreDisplay").innerText = "Form is invalid";
        document.getElementById("correctAnswersDisplay").innerHTML = ""; // Clear correct answers if form is invalid
    }
});
