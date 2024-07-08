let customTime = null;

function updateClock() {
    const now = customTime || new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    document.getElementById('digital-clock').textContent =
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    updateRing('hour-ring', (hours % 12 + minutes / 60) / 12, 879.6);
    updateRing('minute-ring', (minutes + seconds / 60) / 60, 753.6);
    updateRing('second-ring', (seconds + milliseconds / 1000) / 60, 628);

    const isDay = hours >= 6 && hours < 18;
    document.getElementById('sun-moon').textContent = isDay ? '☀️' : '🌙';
    document.body.style.backgroundColor = isDay ? '#f0f5f9' : '#1e2022';
    document.querySelector('.clock-container').style.backgroundColor = isDay ? '#ffffff' : '#3a4750';
    document.getElementById('digital-clock').style.color = isDay ? '#1e2022' : '#f0f5f9';

    if (customTime) {
        customTime.setMilliseconds(customTime.getMilliseconds() + 16);
    }
}

function updateRing(id, fraction, circumference) {
    const ring = document.getElementById(id);
    const offset = circumference - (fraction * circumference);
    ring.style.strokeDasharray = `${circumference} ${circumference}`;
    ring.style.strokeDashoffset = offset;
}

function enableDragging(element, updateFunction) {
    let isDragging = false;
    let startAngle, startValue;

    element.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    function startDrag(e) {
        isDragging = true;
        const rect = analog_clock.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        startValue = getCurrentValue(element);
        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging) return;
        const rect = analog_clock.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const delta = (angle - startAngle) / (2 * Math.PI);
        let newValue = (startValue + delta + 1) % 1;
        updateFunction(newValue);
    }

    function endDrag() {
        isDragging = false;
    }
}

function getCurrentValue(element) {
    const offset = parseFloat(element.style.strokeDashoffset);
    const array = element.style.strokeDasharray.split(' ');
    const circumference = parseFloat(array[0]);
    return 1 - (offset / circumference);
}

function updateHourRing(value) {
    customTime = customTime || new Date();
    customTime.setHours(value * 12);
    customTime.setMinutes(0);
    customTime.setSeconds(0);
    customTime.setMilliseconds(0);
    updateClock();
}

function updateMinuteRing(value) {
    customTime = customTime || new Date();
    customTime.setMinutes(value * 60);
    customTime.setSeconds(0);
    customTime.setMilliseconds(0);
    updateClock();
}

function updateSecondRing(value) {
    customTime = customTime || new Date();
    customTime.setSeconds(value * 60);
    customTime.setMilliseconds(0);
    updateClock();
}

enableDragging(document.getElementById('hour-ring'), updateHourRing);
enableDragging(document.getElementById('minute-ring'), updateMinuteRing);
enableDragging(document.getElementById('second-ring'), updateSecondRing);

document.getElementById('clock-center').addEventListener('click', () => {
    customTime = null;
    updateClock();
});

function animateClock() {
    updateClock();
    requestAnimationFrame(animateClock);
}

animateClock();