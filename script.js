const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const submitBtn = document.getElementById('submit-btn');

let questions = [];
let currentQuestion = 0;
let userAnswers = [];

async function fetchQuestions() {
  try {
    const res = await fetch('https://opentdb.com/api.php?amount=5&type=multiple');
    const data = await res.json();
    questions = data.results.map(q => ({
      question: q.question,
      options: shuffle([...q.incorrect_answers, q.correct_answer]),
      answer: q.correct_answer
    }));
    displayQuestion();
  } catch (err) {
    quizContainer.innerHTML = `<p>Failed to load quiz. Try again later.</p>`;
    console.error(err);
  }
}

function displayQuestion() {
  const q = questions[currentQuestion];
  if (!q) return;

  quizContainer.innerHTML = `
    <div class="question">${currentQuestion + 1}. ${q.question}</div>
    <div class="options">
      ${q.options.map((opt, i) => `
        <label>
          <input type="radio" name="answer" value="${opt}" ${userAnswers[currentQuestion] === opt ? 'checked' : ''}>
          ${opt}
        </label>
      `).join('')}
    </div>
  `;
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function saveAnswer() {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (selected) {
    userAnswers[currentQuestion] = selected.value;
    return true;
  }
  alert('Please select an option.');
  return false;
}

nextBtn.addEventListener('click', () => {
  if (saveAnswer()) {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      displayQuestion();
    }
  }
});

prevBtn.addEventListener('click', () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    displayQuestion();
  }
});

submitBtn.addEventListener('click', () => {
  if (saveAnswer()) {
    let score = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.answer) score++;
    });

    resultContainer.innerHTML = `
      <p>Total Questions: ${questions.length}</p>
      <p>Correct Answers: ${score}</p>
      <p>Incorrect Answers: ${questions.length - score}</p>
      <p>Score: ${(score / questions.length * 100).toFixed(2)}%</p>
    `;
  }
});

fetchQuestions();
