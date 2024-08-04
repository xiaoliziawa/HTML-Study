const waterLevel = document.getElementById('waterLevel');
const water = document.querySelector('.water');
const waterLevelValue = document.getElementById('waterLevelValue');
const ocean = document.querySelector('.ocean');

const creatures = ['🐟', '🪼', '🦞', '🦪', '🐢', '🐬'];

function createCreature(emoji) {
    const creature = document.createElement('div');
    creature.className = 'sea-creature';
    creature.textContent = emoji;
    creature.style.left = Math.random() * 100 + '%';
    creature.style.bottom = Math.random() * 50 + '%';
    ocean.appendChild(creature);
    return creature;
}

function moveCreature(creature) {
    const x = Math.random() * 100;
    const y = Math.random() * 50;
    creature.style.left = x + '%';
    creature.style.bottom = y + '%';
}

creatures.forEach(emoji => {
    const creature = createCreature(emoji);
    setInterval(() => moveCreature(creature), Math.random() * 5000 + 5000);
});

// 添加珊瑚
const coral = document.createElement('div');
coral.className = 'coral';
coral.textContent = '🪸';
coral.style.left = '10%';
ocean.appendChild(coral);

// 添加气泡
function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = '🫧';
    bubble.style.left = (Math.random() * 20 + 5) + '%';
    bubble.style.bottom = '0';
    ocean.appendChild(bubble);

    bubble.addEventListener('animationend', () => {
        ocean.removeChild(bubble);
    });
}

setInterval(createBubble, 2000);

waterLevel.addEventListener('input', function () {
    const level = 100 - this.value;
    water.style.top = level + '%';
    waterLevelValue.textContent = 100 - level;

    document.querySelectorAll('.sea-creature').forEach(creature => {
        const creatureBottom = parseFloat(creature.style.bottom);
        const maxBottom = 100 - level - 5;
        if (creatureBottom > maxBottom) {
            creature.style.bottom = Math.min(maxBottom, Math.random() * maxBottom) + '%';
        }
    });
});