const container = document.querySelector('.container');
const toggleBtn = document.querySelector('.toggle-btn');

toggleBtn.addEventListener('click', () => {
    container.classList.toggle('expanded');
});