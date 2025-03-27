// Complete Class 9 Question Bank (All Subjects)
const subjects = {
    "Science": ["Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules"],
    "Mathematics": ["Number Systems", "Polynomials", "Coordinate Geometry"],
    "Social Science": ["The French Revolution", "Socialism in Europe", "Nazism and Hitler"],
    "English": ["The Fun They Had", "The Sound of Music", "The Little Girl"],
    "Hindi": ["दो बैलों की कथा", "ल्हासा की ओर", "उपभोक्तावाद की संस्कृति"]
};

// AI Question Generator Simulation
function generateAIQuestion(subject, chapter, difficulty) {
    const difficultyLevels = {
        easy: { options: 3, complexity: 1 },
        medium: { options: 4, complexity: 2 },
        hard: { options: 4, complexity: 3 }
    };
    
    const level = difficultyLevels[difficulty] || difficultyLevels.medium;
    const optionsCount = level.options;
    
    // This would be replaced with actual AI API call in production
    const questionTemplates = {
        Science: [
            `What is the main concept of ${chapter}?`,
            `Which principle explains ${chapter}?`,
            `Identify the correct statement about ${chapter}`
        ],
        Mathematics: [
            `Solve this problem related to ${chapter}`,
            `Which formula applies to ${chapter}?`,
            `Calculate the value based on ${chapter} principles`
        ],
        "Social Science": [
            `What was the significance of ${chapter}?`,
            `Which event preceded ${chapter}?`,
            `Identify the correct chronology for ${chapter}`
        ],
        English: [
            `What is the theme of ${chapter}?`,
            `Which literary device is used in ${chapter}?`,
            `What was the author's purpose in ${chapter}?`
        ],
        Hindi: [
            `'${chapter}' पाठ का मुख्य विषय क्या है?`,
            `'${chapter}' में किस भावना को दर्शाया गया है?`,
            `'${chapter}' पाठ के लेखक कौन हैं?`
        ]
    };
    
    const question = questionTemplates[subject][Math.floor(Math.random() * questionTemplates[subject].length)];
    const options = [];
    const correctAnswer = Math.floor(Math.random() * optionsCount);
    
    for (let i = 0; i < optionsCount; i++) {
        options.push(`Option ${i + 1} for ${question}`);
    }
    
    const explanations = {
        Science: "This is the correct answer based on scientific principles.",
        Mathematics: "The calculation leads to this result when applying the correct formula.",
        "Social Science": "Historical evidence supports this as the correct answer.",
        English: "Textual analysis confirms this interpretation.",
        Hindi: "पाठ के विश्लेषण से यह उत्तर सही सिद्ध होता है।"
    };
    
    return {
        question,
        options,
        correct: correctAnswer,
        explanation: explanations[subject],
        difficulty,
        subject,
        chapter
    };
}

// DOM Elements
const userPanel = document.getElementById('user-panel');
const quizContainer = document.getElementById('quiz-container');
const usernameInput = document.getElementById('username');
const loginBtn = document.getElementById('login-btn');
const displayUsername = document.getElementById('display-username');
const logoutBtn = document.getElementById('logout-btn');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const subjectSelect = document.getElementById('subject-select');
const chapterSelect = document.getElementById('chapter-select');
const difficultySelect = document.getElementById('difficulty-select');
const startBtn = document.getElementById('start-quiz');
const quizArea = document.getElementById('quiz-area');
const quiz = document.getElementById('quiz');
const results = document.getElementById('results');
const submitBtn = document.getElementById('submit');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const timerDisplay = document.getElementById('timer');
const leaderboard = document.getElementById('leaderboard');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

// Quiz Variables
let currentUser = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let timer;
let timeLeft = 30;

// Initialize the app
function initApp() {
    // Populate subjects
    for (const subject in subjects) {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    }
    
    // Check for existing user
    const savedUser = localStorage.getItem('mcqUser');
    if (savedUser) {
        currentUser = savedUser;
        displayUsername.textContent = savedUser;
        userPanel.style.display = 'none';
        quizContainer.style.display = 'block';
        updateLeaderboard();
    }
}

// User Authentication
loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        currentUser = username;
        localStorage.setItem('mcqUser', username);
        displayUsername.textContent = username;
        userPanel.style.display = 'none';
        quizContainer.style.display = 'block';
        updateLeaderboard();
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('mcqUser');
    location.reload();
});

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = darkModeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
});

// Subject Selection
subjectSelect.addEventListener('change', function() {
    const subject = this.value;
    chapterSelect.innerHTML = '<option value="">Select Chapter</option>';
    chapterSelect.disabled = !subject;

    if (subject) {
        subjects[subject].forEach(chapter => {
            const option = document.createElement('option');
            option.value = chapter;
            option.textContent = chapter;
            chapterSelect.appendChild(option);
        });
    }
});

// Start Quiz
startBtn.addEventListener('click', function() {
    const subject = subjectSelect.value;
    const chapter = chapterSelect.value;
    const difficulty = difficultySelect.value;
    
    if (!subject || !chapter) {
        alert('Please select both subject and chapter!');
        return;
    }
    
    // Generate AI questions (simulated)
    currentQuestions = [];
    const questionCount = 20; // 20 questions per quiz
    
    for (let i = 0; i < questionCount; i++) {
        // For demo, we alternate difficulties if "all" is selected
        const qDifficulty = difficulty === 'all' 
            ? ['easy', 'medium', 'hard'][i % 3]
            : difficulty;
        
        currentQuestions.push(generateAIQuestion(subject, chapter, qDifficulty));
    }
    
    startQuiz();
});

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    
    startBtn.classList.add('hidden');
    submitBtn.classList.remove('hidden');
    quizArea.style.display = 'block';
    
    loadQuestion();
}

// Timer Functions
function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    timerDisplay.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        if (timeLeft <= 5) {
            timerDisplay.style.color = '#e74c3c';
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    wrongSound.play();
    userAnswers[currentQuestionIndex] = null;
    moveToNextQuestion();
}

// Question Navigation
function moveToNextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        finishQuiz();
    }
}

// Load Question
function loadQuestion() {
    clearInterval(timer);
    startTimer();
    
    quiz.innerHTML = '';
    updateProgress();
    
    const questionData = currentQuestions[currentQuestionIndex];
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    
    // Add difficulty badge
    const difficultyMap = {
        easy: { class: 'easy', text: 'Easy' },
        medium: { class: 'medium', text: 'Medium' },
        hard: { class: 'hard', text: 'Hard' }
    };
    const difficulty = difficultyMap[questionData.difficulty] || difficultyMap.medium;
    
    questionDiv.innerHTML = `
        <h3>
            ${currentQuestionIndex + 1}. ${questionData.question}
            <span class="difficulty-badge ${difficulty.class}">${difficulty.text}</span>
        </h3>
        <div class="options">
            ${questionData.options.map((option, index) => `
                <label class="option">
                    <input type="radio" name="question" value="${index}">
                    ${option}
                </label>
            `).join('')}
        </div>
        <button class="audio-btn" onclick="playExplanation('${questionData.explanation.replace(/'/g, "\\'")}')">
            <i class="fas fa-volume-up"></i> Hear Explanation
        </button>
    `;
    
    quiz.appendChild(questionDiv);
}

// Play Audio Explanation
window.playExplanation = function(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
    } else {
        alert("Text-to-speech not supported in your browser");
    }
};

// Update Progress
function updateProgress() {
    const progress = ((currentQuestionIndex) / currentQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${currentQuestionIndex}/${currentQuestions.length}`;
}

// Submit Answer
submitBtn.addEventListener('click', () => {
    const selectedOption = document.querySelector('input[name="question"]:checked');
    
    if (selectedOption) {
        userAnswers[currentQuestionIndex] = parseInt(selectedOption.value);
        const isCorrect = userAnswers[currentQuestionIndex] === currentQuestions[currentQuestionIndex].correct;
        
        if (isCorrect) {
            score++;
            correctSound.play();
        } else {
            wrongSound.play();
        }
    } else {
        userAnswers[currentQuestionIndex] = null;
        wrongSound.play();
    }
    
    moveToNextQuestion();
});

// Finish Quiz
function finishQuiz() {
    clearInterval(timer);
    submitBtn.classList.add('hidden');
    
    // Save result to leaderboard
    saveResult();
    
    // Show results
    showResults();
    
    // Update leaderboard
    updateLeaderboard();
}

// Show Results
function showResults() {
    let output = `
        <div class="result-summary">
            <h2><i class="fas fa-poll"></i> Your Score: ${score} / ${currentQuestions.length}</h2>
            <p>${getPerformanceMessage(score, currentQuestions.length)}</p>
        </div>
    `;
    
    currentQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correct;
        
        output += `
            <div class="result-item ${isCorrect ? 'correct' : 'incorrect'}">
                <h4>${index + 1}. ${question.question}</h4>
                <p>Your answer: ${userAnswer !== null ? question.options[userAnswer] : 'Not answered'}</p>
                <p>Correct answer: ${question.options[question.correct]}</p>
                ${!isCorrect ? `
                    <div class="feedback">
                        <p>${question.explanation}</p>
                        <button class="audio-btn" onclick="playExplanation('${question.explanation.replace(/'/g, "\\'")}')">
                            <i class="fas fa-volume-up"></i> Hear Explanation
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    // Add restart button
    output += `
        <button id="restart-quiz" onclick="location.reload()">
            <i class="fas fa-redo"></i> Take Another Quiz
        </button>
    `;
    
    results.innerHTML = output;
}

function getPerformanceMessage(score, total) {
    const percentage = (score / total) * 100;
    
    if (percentage >= 80) return "Excellent work! You've mastered this material.";
    if (percentage >= 60) return "Good job! You have a solid understanding.";
    if (percentage >= 40) return "Not bad! Review the explanations to improve.";
    return "Keep practicing! Review the chapter and try again.";
}

// Leaderboard Functions
function saveResult() {
    if (!currentUser) return;
    
    const result = {
        username: currentUser,
        score,
        total: currentQuestions.length,
        subject: subjectSelect.value,
        chapter: chapterSelect.value,
        date: new Date().toISOString()
    };
    
    let leaderboardData = JSON.parse(localStorage.getItem('mcqLeaderboard') || []);
    leaderboardData.push(result);
    localStorage.setItem('mcqLeaderboard', JSON.stringify(leaderboardData));
}

function updateLeaderboard() {
    const leaderboardData = JSON.parse(localStorage.getItem('mcqLeaderboard') || '[]');
    
    // Get top 10 scores
    const topScores = leaderboardData
        .sort((a, b) => (b.score / b.total) - (a.score / a.total))
        .slice(0, 10);
    
    leaderboard.innerHTML = '';
    
    if (topScores.length === 0) {
        leaderboard.innerHTML = '<p>No scores yet. Be the first!</p>';
        return;
    }
    
    topScores.forEach((entry, index) => {
        const percentage = Math.round((entry.score / entry.total) * 100);
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        item.innerHTML = `
            <span class="leaderboard-rank">${index + 1}</span>
            <span class="leaderboard-name">${entry.username}</span>
            <span class="leaderboard-score">${percentage}%</span>
        `;
        leaderboard.appendChild(item);
    });
}

// Initialize the app
initApp();