const CARD_CLASS = 'card'
const CARD_SOLVED_CLASS = 'card card-solved'

const CLOSE_ICON_DATA = {
    className: 'card__close',
    html: '✘'
}
const SOLVE_ICON_DATA = {
    className: 'card__solve',
    html: '✓'
}

const ARR_LIMIT = 32
const MESSAGES = {
    errorType: 'Invalid value type.',
    maxLengthExceeded: 'Cards array exceeded length limit (max 32 items).'
}

const titleInput = document.querySelector('#title')
const descriptionTextarea = document.querySelector('#description')
const addButton = document.querySelector('button')
const cards = document.querySelector('.cards')

const cardsArr = {
    value: [],
    set(newValue) {
        if (!Array.isArray(newValue)) {
            alert(MESSAGES.errorType)
            return false
        }

        addButton.disabled = newValue.length === ARR_LIMIT

        if (newValue.length > ARR_LIMIT) {
            alert(MESSAGES.maxLengthExceeded)
            return false
        }

        this.value = newValue
        localStorage.cards = JSON.stringify(this.value)

        drawCards()
        return true
    }
}

try {
    if (localStorage.cards && !cardsArr.set(JSON.parse(localStorage.cards))) throw null
} catch {
    localStorage.cards = ''
}

function createCard(i, cardObj) {
    const now = new Date()

    const card = document.createElement('article')

    card.className = cardObj.solved ? CARD_SOLVED_CLASS : CARD_CLASS

    const h2 = document.createElement('h2')
    const p = document.createElement('p')
    const small = document.createElement('small')

    h2.innerHTML = cardObj.title
    p.innerHTML = cardObj.description
    small.innerHTML = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`

    const icons = document.createElement('div')
    
    const closeIcon = document.createElement('i')
    const solveIcon = document.createElement('i')

    closeIcon.className = CLOSE_ICON_DATA.className
    solveIcon.className = SOLVE_ICON_DATA.className

    closeIcon.innerHTML = CLOSE_ICON_DATA.html
    solveIcon.innerHTML = SOLVE_ICON_DATA.html

    closeIcon.addEventListener('click', () => {
        const cardsTemp = [...cardsArr.value]
        cardsTemp.splice(i, 1)

        cardsArr.set(cardsTemp)
    })

    solveIcon.addEventListener('click', () => {
        const cardTemp = cardsArr.value.splice(i, 1)[0]
        cardTemp.solved = true

        cardsArr.set([...cardsArr.value, cardTemp])
    })

    icons.appendChild(closeIcon)
    icons.appendChild(solveIcon)

    card.appendChild(h2)
    card.appendChild(p)
    card.appendChild(small)
    card.appendChild(icons)

    return card
}

function drawCards() {
    cards.innerHTML = ''

    for (const i in cardsArr.value) {
        const card = cardsArr.value[i]
        cards.appendChild(createCard(i, card))
    }
}

addButton.addEventListener('click', () => {
    const title = titleInput.value
    const description = descriptionTextarea.value

    if (title.length === 0 || description.length === 0) return

    cardsArr.set([
        {
            title,
            description,
            solved: false
        }, ...cardsArr.value
    ])

    titleInput.value = ''
    descriptionTextarea.value = ''
})