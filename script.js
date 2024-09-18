document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('jeopardy-board');
  const apiUrl = 'https://rithm-jeopardy.herokuapp.com/api/category?id=';
  let categories = [];
  let currentQuestion = null;
  let playerScores = [0, 0, 0];
  let currentPlayerIndex = 0;
  let attemptedPlayers = [];
  let answeredQuestions = 0;
  let totalQuestions = 0;

  async function fetchCategories() {
    const categoryIds = [2, 11, 12, 13, 14, 15];
    try {
      const categoryPromises = categoryIds.map((id) =>
        axios.get(`${apiUrl}${id}`).then((res) => res.data)
      );
      const fetchedCategories = await Promise.all(categoryPromises);
      categories = fetchedCategories.map((category) => ({
        title: category.title,
        questions: category.clues.slice(0, 5).map((clue) => ({
          value: clue.value || 200,
          question: clue.question,
          answers: clue.answer.split(',').map((answer) => answer.trim())
        }))
      }));
      totalQuestions = categories.length * 5;
      createBoard();
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  const createBoard = () => {
    board.innerHTML = '';
    categories.forEach((category) => {
      const categoryElement = document.createElement('div');
      categoryElement.classList.add('category');
      categoryElement.textContent = category.title;
      board.appendChild(categoryElement);
    });
    for (let i = 0; i < 5; i++) {
      categories.forEach((category) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        const front = document.createElement('div');
        front.classList.add('question-content', 'front');
        front.textContent = `$${category.questions[i].value}`;
        const back = document.createElement('div');
        back.classList.add('question-content', 'back');
        back.textContent = category.questions[i].question;
        questionElement.appendChild(front);
        questionElement.appendChild(back);
        questionElement.dataset.answer =
          category.questions[i].answers.join(',');
        questionElement.dataset.value = category.questions[i].value;
        board.appendChild(questionElement);
        questionElement.setAttribute('tabindex', 0);
      });
    }
    document.querySelectorAll('.question').forEach((question) => {
      question.addEventListener('click', handleQuestionClick);
    });
    resetInputField();
  };

  const handleQuestionClick = function () {
    if (!this.classList.contains('flipped')) {
      currentQuestion = this;
      this.classList.add('flipped');
      resetInputField();
      resetAttemptedPlayers();
    }
  };

  const submitAnswer = () => {
    if (!currentQuestion) return;

    const answerInput = document.getElementById('answer-input');
    const answerValue = answerInput.value.trim().toLowerCase();
    if (!answerValue) {
      alert('Please enter an answer.');
      return;
    }

    const correctAnswers = currentQuestion.dataset.answer
      .split(',')
      .map((answer) => cleanAnswer(answer.trim().toLowerCase()));
    const questionValue = parseInt(currentQuestion.dataset.value);
    const cleanedInput = cleanAnswer(answerValue);

    const isCorrect = correctAnswers.some(
      (correctAnswer) =>
        correctAnswer.includes(cleanedInput) ||
        cleanedInput.includes(correctAnswer)
    );

    if (isCorrect) {
      displayAnswer(true, correctAnswers);
      playerScores[currentPlayerIndex] += questionValue;
      updatePlayerScore(currentPlayerIndex);
    } else {
      playerScores[currentPlayerIndex] -= questionValue;
      updatePlayerScore(currentPlayerIndex);
      attemptedPlayers.push(currentPlayerIndex);

      if (attemptedPlayers.length === 3) {
        displayAnswer(false, correctAnswers);
      } else {
        nextPlayer();
        alert(
          `Incorrect! Next player's turn: Player ${currentPlayerIndex + 1}`
        );
      }
    }
    resetInputField();
  };

  const displayAnswer = (isCorrect, correctAnswers) => {
    const message = isCorrect
      ? `Correct! ${correctAnswers.join(', ')}`
      : `No one got it right. The correct answer was: ${correctAnswers.join(
          ', '
        )}`;
    currentQuestion.querySelector('.back').innerHTML = message;
    currentQuestion = null;
    resetAttemptedPlayers();
    answeredQuestions++;
    checkGameOver();
  };

  const checkGameOver = () => {
    if (answeredQuestions === totalQuestions) {
      const winnerIndex = playerScores.indexOf(Math.max(...playerScores));
      const winnerName =
        document.querySelector(`#player-name-${winnerIndex}`).value ||
        `Player ${winnerIndex + 1}`;
      alert(
        `Game Over! ${winnerName} wins with a score of ${playerScores[winnerIndex]}!`
      );
      disableGameInteractions();
    }
  };

  const resetInputField = () => {
    const answerInput = document.getElementById('answer-input');
    answerInput.value = '';
    answerInput.focus();
  };

  const updatePlayerScore = (playerIndex) => {
    document.querySelector(
      `.player[data-player-index="${playerIndex}"] .score`
    ).textContent = playerScores[playerIndex];
  };

  const nextPlayer = () => {
    currentPlayerIndex = (currentPlayerIndex + 1) % 3;
  };

  const cleanAnswer = (str) => {
    return str
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
      .replace(/\bthe\b/g, '')
      .trim();
  };

  const resetAttemptedPlayers = () => {
    attemptedPlayers = [];
  };

  const disableGameInteractions = () => {
    document
      .querySelectorAll('.question')
      .forEach((q) => (q.style.pointerEvents = 'none'));
    document.getElementById('submit-answer').disabled = true;
    document.getElementById('answer-input').disabled = true;
  };

  const resetGame = () => {
    if (confirm('Are you sure you want to reset the game?')) {
      playerScores = [0, 0, 0];
      currentPlayerIndex = 0;
      currentQuestion = null;
      resetAttemptedPlayers();
      answeredQuestions = 0;
      totalQuestions = 0;

      document.querySelectorAll('.player .score').forEach((scoreDiv) => {
        scoreDiv.textContent = '0';
      });

      document.querySelectorAll('.question').forEach((question) => {
        question.style.pointerEvents = 'auto';
        question.classList.remove('flipped');
      });

      document.getElementById('submit-answer').disabled = false;
      document.getElementById('answer-input').disabled = false;
      fetchCategories();
    }
  };

  document
    .getElementById('submit-answer')
    .addEventListener('click', submitAnswer);
  document
    .getElementById('answer-input')
    .addEventListener('keydown', (event) => {
      if (event.key === 'Enter') submitAnswer();
    });

  document.getElementById('reset-button').addEventListener('click', resetGame);

  fetchCategories();
});
