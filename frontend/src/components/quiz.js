let currentQuiz = null;
let userAnswers = [];

async function generateQuiz() {
    const skill = document.getElementById('quiz-skill').value;
    const difficulty = document.getElementById('quiz-difficulty').value;

    if (!skill) {
        alert('Please select a skill');
        return;
    }

    // Show loading
    const container = document.getElementById('questions-container');
    container.innerHTML = '<div class="text-white text-center py-8">Generating quiz...</div>';
    document.getElementById('quiz-questions').classList.remove('hidden');
    document.getElementById('quiz-selection').style.display = 'none';

    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-quiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                skill: skill,
                difficulty: difficulty,
                question_count: 5
            })
        });

        const data = await response.json();

        if (data.success) {
            currentQuiz = data.quiz;
            userAnswers = [];
            renderQuizQuestions(currentQuiz);
        } else {
            alert('Error generating quiz: ' + data.error);
        }
    } catch (error) {
        console.error('Error generating quiz:', error);
        alert('Error generating quiz. Please try again.');
    }
}

function renderQuizQuestions(quiz) {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    quiz.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'mb-8 p-6 bg-white/5 rounded-lg border border-white/10';

        if (question.type === 'mcq') {
            questionDiv.innerHTML = `
                <div class="mb-4">
                    <span class="text-purple-400 font-semibold">Question ${index + 1}</span>
                    <h4 class="text-xl text-white mt-2">${question.question}</h4>
                </div>
                <div class="space-y-3">
                    ${Object.entries(question.options).map(([key, value]) => `
                        <label class="flex items-start p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition">
                            <input
                                type="radio"
                                name="question-${index}"
                                value="${key}"
                                class="mt-1 mr-3"
                                onchange="recordAnswer(${index}, '${key}')"
                            />
                            <span class="text-white">
                                <strong>${key}:</strong> ${value}
                            </span>
                        </label>
                    `).join('')}
                </div>
            `;
        } else if (question.type === 'coding') {
            questionDiv.innerHTML = `
                <div class="mb-4">
                    <span class="text-purple-400 font-semibold">Coding Problem ${index + 1}</span>
                    <h4 class="text-xl text-white mt-2">${question.title}</h4>
                </div>
                <div class="mb-4 text-gray-300">
                    ${question.description}
                </div>
                ${question.examples ? `
                    <div class="mb-4">
                        <h5 class="text-white font-semibold mb-2">Examples:</h5>
                        ${question.examples.map(ex => `
                            <div class="bg-black/30 p-3 rounded mb-2 text-sm">
                                <div class="text-green-400">Input: ${ex.input}</div>
                                <div class="text-blue-400">Output: ${ex.output}</div>
                                ${ex.explanation ? `<div class="text-gray-400 mt-1">${ex.explanation}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                ${question.constraints ? `
                    <div class="mb-4">
                        <h5 class="text-white font-semibold mb-2">Constraints:</h5>
                        <ul class="text-gray-300 text-sm list-disc list-inside">
                            ${question.constraints.map(c => `<li>${c}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                <div class="mb-2">
                    <h5 class="text-white font-semibold mb-2">Your Solution:</h5>
                    <div class="text-sm text-gray-400 mb-2">${question.function_signature || ''}</div>
                </div>
                <textarea
                    id="code-${index}"
                    class="code-editor w-full h-64 resize-y"
                    placeholder="Write your solution here..."
                    onchange="recordAnswer(${index}, this.value)"
                >${question.function_signature || ''}</textarea>
            `;
        }

        container.appendChild(questionDiv);
    });
}

function recordAnswer(questionIndex, answer) {
    userAnswers[questionIndex] = answer;
}

async function submitQuiz() {
    if (!currentQuiz) return;

    // Check if all questions are answered
    const allAnswered = userAnswers.length === currentQuiz.questions.length &&
                        userAnswers.every(a => a !== undefined && a !== null && a !== '');

    if (!allAnswered) {
        if (!confirm('You haven\'t answered all questions. Submit anyway?')) {
            return;
        }
    }

    // Calculate score
    let correctCount = 0;
    const results = [];

    for (let i = 0; i < currentQuiz.questions.length; i++) {
        const question = currentQuiz.questions[i];
        const userAnswer = userAnswers[i];

        if (question.type === 'mcq') {
            const isCorrect = userAnswer === question.correct_answer;
            if (isCorrect) correctCount++;

            results.push({
                question: question.question,
                userAnswer: userAnswer,
                correctAnswer: question.correct_answer,
                isCorrect: isCorrect,
                explanation: question.explanation
            });
        } else if (question.type === 'coding') {
            // For coding questions, we'll give partial credit based on effort
            // In a real implementation, you'd run the code against test cases
            const hasCode = userAnswer && userAnswer.trim().length > 50;
            if (hasCode) correctCount += 0.5; // Partial credit for attempting

            results.push({
                question: question.title,
                userAnswer: userAnswer,
                solution: question.solution,
                isCorrect: hasCode,
                type: 'coding'
            });
        }
    }

    const score = (correctCount / currentQuiz.questions.length) * 100;

    // Update progress on server
    try {
        const response = await fetch(`${API_BASE_URL}/api/submit-quiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: getUserId(),
                skill: currentQuiz.skill,
                answers: userAnswers,
                correct_answers: currentQuiz.questions.map(q =>
                    q.type === 'mcq' ? q.correct_answer : null
                )
            })
        });

        const data = await response.json();

        if (data.success) {
            showQuizResults(score, results);
            // Reload user data to update constellation
            setTimeout(() => loadUserData(), 1000);
        }
    } catch (error) {
        console.error('Error submitting quiz:', error);
        // Still show results even if API call fails
        showQuizResults(score, results);
    }
}

function showQuizResults(score, results) {
    document.getElementById('quiz-questions').classList.add('hidden');

    const scoreElement = document.getElementById('quiz-score');
    const feedbackElement = document.getElementById('quiz-feedback');

    scoreElement.textContent = `${Math.round(score)}%`;

    let feedback = '';
    if (score >= 90) {
        feedback = 'Outstanding! You have excellent mastery of this skill!';
    } else if (score >= 70) {
        feedback = 'Great job! You have a solid understanding of this skill.';
    } else if (score >= 50) {
        feedback = 'Good effort! Keep practicing to improve your skills.';
    } else {
        feedback = 'Keep learning! Review the materials and try again.';
    }

    feedbackElement.textContent = feedback;

    // Show detailed results
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'mt-6 space-y-4';

    results.forEach((result, index) => {
        const resultDiv = document.createElement('div');
        resultDiv.className = `p-4 rounded-lg ${result.isCorrect ? 'bg-green-900/30 border border-green-500/50' : 'bg-red-900/30 border border-red-500/50'}`;

        if (result.type === 'coding') {
            resultDiv.innerHTML = `
                <h5 class="text-white font-semibold mb-2">Problem ${index + 1}: ${result.question}</h5>
                <p class="text-gray-300 mb-2">${result.isCorrect ? 'Solution submitted' : 'No solution submitted'}</p>
                <details class="text-sm">
                    <summary class="text-purple-400 cursor-pointer">View sample solution</summary>
                    <pre class="code-editor mt-2 text-xs overflow-x-auto">${result.solution || 'N/A'}</pre>
                </details>
            `;
        } else {
            resultDiv.innerHTML = `
                <h5 class="text-white font-semibold mb-2">Question ${index + 1}</h5>
                <p class="text-gray-300 mb-2">${result.question}</p>
                <p class="text-sm mb-1">Your answer: <span class="font-semibold">${result.userAnswer || 'Not answered'}</span></p>
                <p class="text-sm mb-2">Correct answer: <span class="font-semibold text-green-400">${result.correctAnswer}</span></p>
                ${result.explanation ? `<p class="text-sm text-gray-400">${result.explanation}</p>` : ''}
            `;
        }

        resultsContainer.appendChild(resultDiv);
    });

    feedbackElement.appendChild(resultsContainer);

    document.getElementById('quiz-results').classList.remove('hidden');
}

function resetQuiz() {
    currentQuiz = null;
    userAnswers = [];

    document.getElementById('quiz-results').classList.add('hidden');
    document.getElementById('quiz-questions').classList.add('hidden');
    document.getElementById('quiz-selection').style.display = 'block';
    document.getElementById('questions-container').innerHTML = '';
    document.getElementById('quiz-feedback').innerHTML = '';
}

function populateQuizSkills(skills) {
    const select = document.getElementById('quiz-skill');
    select.innerHTML = '<option value="">Choose a skill...</option>';

    Object.keys(skills).sort().forEach(skill => {
        const option = document.createElement('option');
        option.value = skill;
        option.textContent = skill;
        select.appendChild(option);
    });
}
