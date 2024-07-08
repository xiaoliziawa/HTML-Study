const slider = document.getElementById('waterLevel');
const water = document.querySelector('.water');
const levelValue = document.getElementById('levelValue');

slider.oninput = function () {
    const level = this.value;
    water.style.transform = `translate(0, ${100 - level}%)`;
    levelValue.textContent = level;
}