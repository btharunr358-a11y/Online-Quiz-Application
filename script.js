// Helper to shuffle array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Full question bank with explanations
const questionBank = [
  { question: "What is the capital of France?", choices: ["Paris", "London", "Berlin", "Madrid"], answer: "Paris", explanation: "Paris is the capital and most populous city of France." },
  { question: "Which planet is known as the Red Planet?", choices: ["Earth", "Venus", "Mars", "Jupiter"], answer: "Mars", explanation: "Mars is called the Red Planet due to iron oxide on its surface." },
  { question: "Which language is used for web apps?", choices: ["PHP", "Python", "JavaScript", "All of the above"], answer: "All of the above", explanation: "Web apps can be built with PHP, Python, JavaScript, and more." },
  { question: "Who wrote 'Hamlet'?", choices: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], answer: "William Shakespeare", explanation: "Hamlet was written by William Shakespeare around 1600." },
  { question: "What is the largest mammal?", choices: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], answer: "Blue Whale", explanation: "The Blue Whale is the largest mammal, reaching up to 30 meters in length." },
  { question: "What is the smallest prime number?", choices: ["1", "2", "3", "0"], answer: "2", explanation: "2 is the smallest and only even prime number." },
  { question: "Which gas do plants absorb from the atmosphere?", choices: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Carbon Dioxide", explanation: "Plants absorb carbon dioxide for photosynthesis." },
  { question: "In which country were the Olympic Games invented?", choices: ["Italy", "France", "Greece", "USA"], answer: "Greece", explanation: "The Olympic Games were first held in Olympia, Greece, in 776 BC." },
  { question: "What does HTML stand for?", choices: ["Hyperlinks and Text Markup Language", "Home Tool Markup Language", "Hyper Text Markup Language", "Hyper Text Main Language"], answer: "Hyper Text Markup Language", explanation: "HTML stands for Hyper Text Markup Language, used for structuring web pages." },
  { question: "Which ocean is the largest?", choices: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: "Pacific", explanation: "The Pacific Ocean is the largest and deepest ocean on Earth." }
];

// Pick 5 random questions
const questions = shuffle([...questionBank]).slice(0, 5);

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;
let userAnswers = [];

const quiz = document.getElementById("quiz");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const nextBtn = document.getElementById("next-btn");
const timeDisplay = document.getElementById("time");

function showQuestion() {
  resetState();
  startTimer();
  const question = questions[currentQuestion];
  questionEl.textContent = question.question;

  question.choices.forEach(choice => {
    const button = document.createElement("button");
    button.textContent = choice;
    button.onclick = () => selectAnswer(button, choice);
    choicesEl.appendChild(button);
  });
}

function resetState() {
  clearInterval(timer);
  nextBtn.style.display = "none";
  choicesEl.innerHTML = "";
  timeLeft = 15;
  timeDisplay.textContent = timeLeft;
  timeDisplay.style.color = "black";
}

function selectAnswer(button, selected) {
  if (choicesEl.querySelector(".correct, .wrong")) return;
  const correct = questions[currentQuestion].answer;
  const buttons = choicesEl.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.classList.add("correct");
    else if (btn.textContent === selected) btn.classList.add("wrong");
  });
  if (selected === correct) score++;
  userAnswers.push({
    question: questions[currentQuestion].question,
    selected: selected,
    correct: correct
  });
  clearInterval(timer);
  nextBtn.style.display = "inline-block";
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) showQuestion();
  else showFinalResults();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 5) timeDisplay.style.color = "red";
    if (timeLeft <= 0) {
      clearInterval(timer);
      autoRevealAnswer();
    }
  }, 1000);
}

function autoRevealAnswer() {
  const correct = questions[currentQuestion].answer;
  const buttons = choicesEl.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.classList.add("correct");
    else btn.classList.add("wrong");
  });
  userAnswers.push({
    question: questions[currentQuestion].question,
    selected: "⏱️ Time Out",
    correct: correct
  });
  nextBtn.style.display = "inline-block";
}

function showFinalResults() {
  quiz.innerHTML = `
    <h2>Your Score: ${score} / ${questions.length}</h2>
    <h3>Review Your Answers:</h3>
    <div class="review">
      ${userAnswers.map((q, index) => {
        const questionData = questions[index];
        const isCorrect = q.selected === q.correct;
        return `
          <div class="review-item">
            <p><strong>Q${index + 1}:</strong> ${q.question}</p>
            <p>
              Your Answer: 
              <span class="${isCorrect ? 'correct' : 'wrong'}">${q.selected}</span>
              ${isCorrect ? " ✅ Correct" : " ❌ Wrong"}
            </p>
            ${!isCorrect ? `<p>Correct Answer: <span class="correct">${q.correct}</span></p>` : ""}
            <p class="explanation">💡 ${questionData.explanation}</p>
          </div>
        `;
      }).join("")}
    </div>
    <button onclick="location.reload()">Restart Quiz</button>
  `;
}

// Start quiz
showQuestion();

