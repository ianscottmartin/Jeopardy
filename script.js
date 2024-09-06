document.addEventListener('DOMContentLoaded', () => {
  // Define the category IDs to fetch
  const categoryIds = [2, 11, 12, 13, 14, 15];
  const apiUrl = 'https://rithm-jeopardy.herokuapp.com/api/category?id=';

  let categoriesData = [];

  async function fetchCategories() {
    try {
      // Fetch data for each category
      const categoryPromises = categoryIds.map((id) =>
        fetch(`${apiUrl}${id}`).then((res) => res.json())
      );
      const categories = await Promise.all(categoryPromises);

      // Process each category and get the top 5 questions
      categoriesData = categories.map((category) => ({
        title: category.title,
        questions: category.clues.slice(0, 5).map((clue) => ({
          value: clue.value || 200, // Default value if null
          question: clue.question,
          answer: clue.answer
        }))
      }));

      createBoard(); // create the board with all categories
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  const board = document.getElementById('jeopardy-board');

  function createBoard() {
    board.innerHTML = ''; // Clear the board

    // Create the columns for each category
    categoriesData.forEach((category) => {
      const categoryElement = document.createElement('div');
      categoryElement.classList.add('category');
      categoryElement.textContent = category.title;
      board.appendChild(categoryElement);
    });

    // Add the questions for each category
    for (let i = 0; i < 5; i++) {
      // Each category has 5 questions
      categoriesData.forEach((category) => {
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

        questionElement.dataset.answer = category.questions[i].answer;
        questionElement.dataset.value = category.questions[i].value;

        board.appendChild(questionElement);
      });
    }

    // Add event listeners for question clicks
    document.querySelectorAll('.question').forEach((question) => {
      question.addEventListener('click', handleQuestionClick);
    });
  }

  let playerScores = {
    player1: 0,
    player2: 0,
    player3: 0
  };

  let currentPlayer = 'player1';
  let currentQuestion = null;

  function handleQuestionClick() {
    if (!this.classList.contains('flipped')) {
      currentQuestion = this;
      this.classList.add('flipped');
    }
  }

  document.getElementById('submit-answer').addEventListener('click', () => {
    if (!currentQuestion) return;

    const answerInput = document
      .getElementById('answer-input')
      .value.trim()
      .toLowerCase();
    const correctAnswer = currentQuestion.dataset.answer.trim().toLowerCase();
    const questionValue = parseInt(currentQuestion.dataset.value);

    const backContent = currentQuestion.querySelector('.back');

    if (answerInput === correctAnswer) {
      backContent.innerHTML = `Correct! <br> ${currentQuestion.dataset.answer}`;
      playerScores[currentPlayer] += questionValue;
    } else {
      backContent.innerHTML = `Incorrect! The correct answer was: <br> ${currentQuestion.dataset.answer}`;
      playerScores[currentPlayer] -= questionValue;
    }

    updatePlayerScore(currentPlayer);

    document.getElementById('answer-input').value = '';

    currentPlayer = nextPlayer(currentPlayer);
  });

  function updatePlayerScore(playerId) {
    document.getElementById(`${playerId}-score`).textContent =
      playerScores[playerId];
  }

  function nextPlayer(currentPlayer) {
    if (currentPlayer === 'player1') return 'player2';
    if (currentPlayer === 'player2') return 'player3';
    return 'player1';
  }

  document.getElementById('reset-button').addEventListener('click', () => {
    playerScores = {
      player1: 0,
      player2: 0,
      player3: 0
    };

    currentPlayer = 'player1';
    currentQuestion = null;

    document.querySelectorAll('.player div').forEach((scoreDiv) => {
      scoreDiv.textContent = '0';
    });

    createBoard();
  });

  fetchCategories(); // Fetch all categories and clues on page load
});
