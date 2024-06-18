document.addEventListener('DOMContentLoaded', function () {
    (function() {
        var alertBox = document.querySelector('.custom-alert');
        if (alertBox) {
            setTimeout(function() {
                alertBox.classList.add('hidden');
            }, 2000);
        }
    })();

    (function() {
        var userImg = document.getElementById('user-img');
        var hoverPanel = document.getElementById('hoverPanel');
        if (userImg && hoverPanel) {
            userImg.addEventListener('mouseenter', function() {
                hoverPanel.style.display = 'block';
            });
            userImg.addEventListener('mouseleave', function() {
                hoverPanel.style.display = 'none';
            });
            hoverPanel.addEventListener('mouseenter', function() {
                hoverPanel.style.display = 'block';
            });
            hoverPanel.addEventListener('mouseleave', function() {
                hoverPanel.style.display = 'none';
            });
        }
    })();
});