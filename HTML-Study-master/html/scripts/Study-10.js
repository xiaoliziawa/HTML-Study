const colors = ['#e57373', '#f06292', '#ba68c8', '#9575cd', '#7986cb', '#64b5f6', '#4fc3f7', '#4dd0e1', '#4db6ac', '#81c784', '#aed581', '#dce775'];
const container = document.getElementById('card-container');
let selectedCards = [];

colors.forEach((color, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.backgroundColor = color;
    setCardPosition(card, index);
    card.addEventListener('click', (e) => selectCard(card, index, e));
    container.appendChild(card);
});

function setCardPosition(card, index) {
    card.style.left = `${index * 50}px`;
    card.style.transform = `rotate(${(index - 6) * 5}deg)`;
}

function selectCard(card, index, event) {
    event.stopPropagation();
    if (!event.ctrlKey) {
        resetAllCards();
    }

    if (selectedCards.includes(card)) {
        resetCard(card);
    } else {
        selectedCards.push(card);
        card.style.left = `${200 + selectedCards.length * 50}px`;
        card.style.transform = `rotate(0deg) translateY(-100px)`;
        card.classList.add('selected');
    }
}

function resetCard(card) {
    const cardIndex = selectedCards.indexOf(card);
    if (cardIndex > -1) {
        selectedCards.splice(cardIndex, 1);
        const originalIndex = Array.from(container.children).indexOf(card);
        setCardPosition(card, originalIndex);
        card.classList.remove('selected');
    }
}

function resetAllCards() {
    selectedCards.forEach(card => resetCard(card));
    selectedCards = [];
}

document.addEventListener('click', resetAllCards);
container.addEventListener('click', resetAllCards);

container.addEventListener('click', (e) => {
    if (e.target.classList.contains('card')) {
        e.stopPropagation();
    }
});