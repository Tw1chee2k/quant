document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
    } else {
        body.classList.add('light-mode');
    }
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
    
        let theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
    
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
        var timeoutId;
    
        if (userImg && hoverPanel) {
            userImg.addEventListener('mouseenter', function() {
                clearTimeout(timeoutId);
                hoverPanel.style.display = 'block';
            });
    
            userImg.addEventListener('mouseleave', function() {
                timeoutId = setTimeout(function() {
                    hoverPanel.style.display = 'none';
                }, 200);
            });
    
            hoverPanel.addEventListener('mouseenter', function() {
                clearTimeout(timeoutId);
                hoverPanel.style.display = 'block';
            });
    
            hoverPanel.addEventListener('mouseleave', function() {
                timeoutId = setTimeout(function() {
                    hoverPanel.style.display = 'none';
                }, 200);
            });
        }
    })();
});