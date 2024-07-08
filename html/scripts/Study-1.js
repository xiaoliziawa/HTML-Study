const progressCircle = document.getElementById('progress-circle');
const progressInner = document.getElementById('progress-inner');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;

    progressCircle.style.background = `conic-gradient(#4CAF50 ${scrollPercentage * 3.6}deg, #f0f0f0 ${scrollPercentage * 3.6}deg)`;
    progressInner.textContent = `${Math.round(scrollPercentage)}%`;
});