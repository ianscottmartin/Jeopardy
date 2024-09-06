document.addEventListener('DOMContentLoaded', () => {
  const categoriesData = [
    {
      title: 'History',
      questions: [
        {
          value: 200,
          question: 'Who was the first president of the United States?',
          answer: 'George Washington'
        },
        {
          value: 400,
          question: 'What year did the Titanic sink?',
          answer: '1912'
        },
        {
          value: 600,
          question: 'Who discovered America?',
          answer: 'Christopher Columbus'
        },
        {
          value: 800,
          question:
            'Which war was fought between the north and south regions in the United States?',
          answer: 'Civil War'
        },
        {
          value: 1000,
          question: 'Who was the British monarch during World War II?',
          answer: 'George VI'
        }
      ]
    },
    {
      title: 'Science',
      questions: [
        {
          value: 200,
          question: 'What planet is known as the Red Planet?',
          answer: 'Mars'
        },
        {
          value: 400,
          question: 'What is the chemical symbol for water?',
          answer: 'H2O'
        },
        {
          value: 600,
          question: 'What gas do plants absorb from the atmosphere?',
          answer: 'Carbon dioxide'
        },
        {
          value: 800,
          question: 'What is the powerhouse of the cell?',
          answer: 'Mitochondria'
        },
        {
          value: 1000,
          question: 'What element does "O" represent on the periodic table?',
          answer: 'Oxygen'
        }
      ]
    },
    {
      title: 'Literature',
      questions: [
        {
          value: 200,
          question: 'Who wrote "Romeo and Juliet"?',
          answer: 'William Shakespeare'
        },
        {
          value: 400,
          question: 'What is the title of the first Harry Potter book?',
          answer: "The Philosopher's Stone"
        },
        { value: 600, question: 'Who wrote "1984"?', answer: 'George Orwell' },
        {
          value: 800,
          question: 'What is the name of the Hobbit in J.R.R. Tolkien’s books?',
          answer: 'Bilbo Baggins'
        },
        {
          value: 1000,
          question: 'Who is the author of "To Kill a Mockingbird"?',
          answer: 'Harper Lee'
        }
      ]
    },
    {
      title: 'Geography',
      questions: [
        {
          value: 200,
          question: 'What is the capital of France?',
          answer: 'Paris'
        },
        {
          value: 400,
          question: 'Which continent is the Sahara Desert located on?',
          answer: 'Africa'
        },
        {
          value: 600,
          question: 'What is the longest river in the world?',
          answer: 'Nile'
        },
        {
          value: 800,
          question: 'Which country has the largest population?',
          answer: 'China'
        },
        {
          value: 1000,
          question: 'What is the smallest country in the world?',
          answer: 'Vatican City'
        }
      ]
    },
    {
      title: 'Sports',
      questions: [
        {
          value: 200,
          question: 'How many players are there in a soccer team?',
          answer: '11'
        },
        {
          value: 400,
          question: 'Which country won the FIFA World Cup in 2018?',
          answer: 'France'
        },
        {
          value: 600,
          question: 'How many rings are there on the Olympic flag?',
          answer: '5'
        },
        {
          value: 800,
          question: 'What sport is known as the "king of sports"?',
          answer: 'Soccer'
        },
        {
          value: 1000,
          question:
            'Who is considered the greatest basketball player of all time?',
          answer: 'Michael Jordan'
        }
      ]
    },
    {
      title: 'Music',
      questions: [
        {
          value: 200,
          question: 'Who is known as the "King of Pop"?',
          answer: 'Michael Jackson'
        },
        {
          value: 400,
          question: 'What is the highest-selling album of all time?',
          answer: 'Thriller'
        },
        {
          value: 600,
          question: 'Who composed the Four Seasons?',
          answer: 'Antonio Vivaldi'
        },
        {
          value: 800,
          question:
            'What is the name of the band that recorded "Hotel California"?',
          answer: 'Eagles'
        },
        {
          value: 1000,
          question: 'Who is the lead singer of the rock band Queen?',
          answer: 'Freddie Mercury'
        }
      ]
    }
  ];

  const board = document.getElementById('jeopardy-board');

  function createBoard() {
    // Clear the board first
    board.innerHTML = '';

    // Create categories row
    categoriesData.forEach((category) => {
      const categoryElement = document.createElement('div');
      categoryElement.classList.add('category');
      categoryElement.textContent = category.title;
      board.appendChild(categoryElement);
    });

    // Create questions columns
    for (let i = 0; i < 5; i++) {
      categoriesData.forEach((category) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');

        // Create front and back elements for the flip effect
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

    // Add event listeners to questions
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

  // Handle answer submission
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

    // Update player score display
    updatePlayerScore(currentPlayer);

    // Clear the answer input
    document.getElementById('answer-input').value = '';

    // Move to the next player
    currentPlayer = nextPlayer(currentPlayer);
  });

  // Function to update player score display
  function updatePlayerScore(playerId) {
    document.getElementById(`${playerId}-score`).textContent =
      playerScores[playerId];
  }

  // Function to determine the next player
  function nextPlayer(currentPlayer) {
    if (currentPlayer === 'player1') return 'player2';
    if (currentPlayer === 'player2') return 'player3';
    return 'player1';
  }

  // Reset game
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

  createBoard();
});
