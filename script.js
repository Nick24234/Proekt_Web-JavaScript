
let bookData = null
let currentCategory = "all"
let searchTerm = ""
let userName = ""
let gameScore = 0
let currentGameWord = ""
let guessedLetters = []


const gameWords = [
  "GATSBY",
  "MOCKINGBIRD",
  "ORWELL",
  "AUSTEN",
  "THRILLER",
  "DUNE",
  "TOLKIEN",
  "POTTER",
  "ROMANCE",
  "SAPIENS",
]


const navLinks = document.querySelectorAll(".nav-link")
const mobileMenuBtn = document.getElementById("mobile-menu-btn")
const navMenu = document.getElementById("nav-menu")
const nameForm = document.getElementById("name-form")
const userNameInput = document.getElementById("user-name")
const searchInput = document.getElementById("search-input")
const booksGrid = document.getElementById("books-grid")
const categoryDescription = document.getElementById("category-description")
const categoryTitle = document.getElementById("category-title")
const categoryDesc = document.getElementById("category-desc")
const noResults = document.getElementById("no-results")
const greetingModal = document.getElementById("greeting-modal")
const greetingText = document.getElementById("greeting-text")
const userGreeting = document.getElementById("user-greeting")
const footerUserInfo = document.getElementById("footer-user-info")
const gameBtn = document.getElementById("game-btn")
const gameModal = document.getElementById("game-modal")
const closeGameBtn = document.getElementById("close-game")
const gameWordElement = document.getElementById("game-word")
const gameScoreElement = document.getElementById("game-score")
const gameLettersElement = document.getElementById("game-letters")
const gameCompleteElement = document.getElementById("game-complete")
const newGameBtn = document.getElementById("new-game-btn")


document.addEventListener("DOMContentLoaded", async () => {
  await loadBookData()
  renderBooks()
  setupEventListeners()
  createGameLetters()
})


async function loadBookData() {
  try {
    const response = await fetch("books.json")
    bookData = await response.json()
  } catch (error) {
    console.error("Error loading book data:", error)

    bookData = {
      categories: [
        {
          id: "fiction",
          name: "Fiction",
          description: "Imaginative stories and novels",
          books: [
            {
              id: 1,
              title: "The Great Gatsby",
              author: "F. Scott Fitzgerald",
              description: "A classic American novel about the Jazz Age and the American Dream.",
              image: "img\\error.bmp",
              rating: 4.5,
              year: 1925,
            },
          ],
        },
      ],
    }
  }
}


function setupEventListeners() {

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const category = this.getAttribute("data-category")
      setActiveCategory(category)
    })
  })


  mobileMenuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("show")
  })

  nameForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const name = userNameInput.value.trim()
    if (name) {
      userName = name
      showGreeting(name)
      updateUserInfo()
    }
  })


  searchInput.addEventListener("input", function () {
    searchTerm = this.value
    renderBooks()
  })

 
  gameBtn.addEventListener("click", startGame)
  closeGameBtn.addEventListener("click", closeGame)
  newGameBtn.addEventListener("click", startNewGame)


  greetingModal.addEventListener("click", function (e) {
    if (e.target === this) {
      this.classList.remove("show")
    }
  })

  gameModal.addEventListener("click", function (e) {
    if (e.target === this) {
      closeGame()
    }
  })
}


function setActiveCategory(category) {
  currentCategory = category


  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("data-category") === category) {
      link.classList.add("active")
    }
  })


  if (category === "all") {
    categoryDescription.classList.add("hidden")
  } else {
    const categoryData = bookData.categories.find((cat) => cat.id === category)
    if (categoryData) {
      categoryTitle.textContent = categoryData.name
      categoryDesc.textContent = categoryData.description
      categoryDescription.classList.remove("hidden")
    }
  }


  navMenu.classList.remove("show")


  renderBooks()
}


function getFilteredBooks() {
  if (!bookData) return []

  let books = []

  if (currentCategory === "all") {
    books = bookData.categories.flatMap((cat) => cat.books)
  } else {
    const category = bookData.categories.find((cat) => cat.id === currentCategory)
    books = category ? category.books : []
  }

  if (searchTerm) {
    books = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  return books
}


function highlightText(text, highlight) {
  if (!highlight) return text

  const regex = new RegExp(`(${highlight})`, "gi")
  return text.replace(regex, '<span class="highlight">$1</span>')
}


function renderBooks() {
  const books = getFilteredBooks()

  if (books.length === 0) {
    booksGrid.style.display = "none"
    noResults.classList.remove("hidden")
    return
  }

  booksGrid.style.display = "grid"
  noResults.classList.add("hidden")

  booksGrid.innerHTML = books
    .map(
      (book) => `
    <div class="book-card">
      <div class="book-image-container">
        <img src="${book.image}" alt="${book.title}" class="book-image" onerror="this.src='https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop'">
        <div class="book-year">${book.year}</div>
      </div>
      <div class="book-content">
        <h3 class="book-title">${highlightText(book.title, searchTerm)}</h3>
        <p class="book-author">by ${highlightText(book.author, searchTerm)}</p>
        <div class="book-rating">
          <div class="stars">
            ${generateStars(book.rating)}
          </div>
          <span class="rating-value">${book.rating}</span>
        </div>
        <p class="book-description">${book.description}</p>
      </div>
    </div>
  `,
    )
    .join("")
}


function generateStars(rating) {
  const fullStars = Math.floor(rating)
  const emptyStars = 5 - fullStars

  let stars = ""
  for (let i = 0; i < fullStars; i++) {
    stars += '<span class="star">★</span>'
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += '<span class="star empty">★</span>'
  }

  return stars
}


function showGreeting(name) {
  greetingText.textContent = `Hello, ${name}! Welcome to BookVerse! 📚`
  greetingModal.classList.add("show")

  setTimeout(() => {
    greetingModal.classList.remove("show")
  }, 3000)
}


function updateUserInfo() {
  if (userName) {
    userGreeting.textContent = `Welcome, ${userName}!`
    footerUserInfo.innerHTML = `
      <p>Welcome back, ${userName}!</p>
      <p>Game Score: ${gameScore}</p>
    `
  }
}


function createGameLetters() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  gameLettersElement.innerHTML = alphabet
    .split("")
    .map((letter) => `<button class="letter-btn" data-letter="${letter}">${letter}</button>`)
    .join("")


  gameLettersElement.addEventListener("click", (e) => {
    if (e.target.classList.contains("letter-btn")) {
      const letter = e.target.getAttribute("data-letter")
      guessLetter(letter)
    }
  })
}

function startGame() {
  gameModal.classList.add("show")
  startNewGame()
}

function startNewGame() {
  currentGameWord = gameWords[Math.floor(Math.random() * gameWords.length)]
  guessedLetters = []
  gameCompleteElement.classList.add("hidden")
  updateGameDisplay()
  resetLetterButtons()
}

function guessLetter(letter) {
  if (guessedLetters.includes(letter)) return

  guessedLetters.push(letter)

  if (currentGameWord.includes(letter)) {
    gameScore += 10
    gameScoreElement.textContent = gameScore
    updateUserInfo()
  }

  updateGameDisplay()


  const button = document.querySelector(`[data-letter="${letter}"]`)
  button.disabled = true


  if (isWordComplete()) {
    gameCompleteElement.classList.remove("hidden")
    gameScore += 50 
    gameScoreElement.textContent = gameScore
    updateUserInfo()
  }
}

function updateGameDisplay() {
  gameWordElement.textContent = currentGameWord
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ")
}

function isWordComplete() {
  return currentGameWord.split("").every((letter) => guessedLetters.includes(letter))
}

function resetLetterButtons() {
  const buttons = gameLettersElement.querySelectorAll(".letter-btn")
  buttons.forEach((button) => {
    button.disabled = false
  })
}

function closeGame() {
  gameModal.classList.remove("show")
}
