const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7d794', '#ff9ff3', '#7bed9f', '#70a1ff', '#a29bfe', '#fab1a0', '#ffeaa7', '#81ecec', '#55efc4'];
const container = document.querySelector('.container');
const cardCount = 12;
let isArranged = false;

for (let i = 0; i < cardCount; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.backgroundColor = colors[i % colors.length];
    card.style.zIndex = cardCount - i;
    card.textContent = i + 1;
    container.appendChild(card);
}

function arrangeCards() {
    if (isArranged) return;
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        const delay = index * 0.05;
        const angle = (index / cardCount) * 360;
        card.style.transition = `all 1s ease ${delay}s`;
        card.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-150px)`;
    });
    isArranged = true;
}

function resetCards() {
    if (!isArranged) return;
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.transition = 'all 1s ease';
        card.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    });
    isArranged = false;
}

resetCards();