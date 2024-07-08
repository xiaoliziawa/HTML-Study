document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 按钮功能
var backToTopButton = document.getElementById("back-to-top");

// 滚动超过20px时显示按钮
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
}

// 动画
backToTopButton.onclick = function () {
    scrollToTop(1000); // 1000ms = 1秒
}

function scrollToTop(duration) {
    // 取消之前的动画
    if (scrollToTopTimer) {
        clearInterval(scrollToTopTimer);
    }

    var start = window.pageYOffset;
    var startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

    var scrollToTopTimer = setInterval(function () {
        var now = 'now' in window.performance ? performance.now() : new Date().getTime();
        var time = Math.min(1, ((now - startTime) / duration));
        var timeFunction = easeInOutCubic(time);
        window.scroll(0, Math.ceil((1 - timeFunction) * start));
        if (window.pageYOffset === 0) {
            clearInterval(scrollToTopTimer);
        }
    }, 1000 / 60); // 60 fps
}

// 缓动函数
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}