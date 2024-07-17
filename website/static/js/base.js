document.addEventListener('DOMContentLoaded', function () {
    
    const header = document.querySelector('.fixed-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            if (currentTheme === 'dark') {
                header.style.backgroundColor = '#333';
           
            }
            else{
                header.style.backgroundColor = 'aliceblue';
                // header.style.color = 'black';
            }
        } else {
            header.style.backgroundColor = 'transparent';
            // header.style.color = 'white';
        }
    });

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
        location.reload();
    });
    
    (function() {
        var alertBox = document.querySelector('.custom-alert');
        if (alertBox) {
            var progressBar = alertBox.querySelector('.notif-progress');
            if (progressBar) {
                progressBar.style.animation = 'runProgress-mes 2.7s linear forwards';
            }
            setTimeout(function() {
                alertBox.classList.add('show');
            }, 100); 
    
            setTimeout(function() {
                alertBox.classList.remove('show');
                alertBox.classList.add('hidden');
            }, 2700); 
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

    var numericInputs = document.querySelectorAll('.numericInput');
    numericInputs.forEach(function(input) {
        input.addEventListener('input', function(event) {
            this.value = this.value.replace(/\D/g, '');
        });
    });

    var numeric_dotInputs = document.querySelectorAll('.numeric_dotInput');
    numeric_dotInputs.forEach(function(input) {
        input.addEventListener('input', function(event) {
            var value = this.value.replace(/[^\d.]/g, '');
            var parts = value.split('.');
            if (parts.length > 1) {
                value = parts[0] + '.' + parts[1].slice(0, 2); 
            }

            this.value = value;
        });
    });
});


document.addEventListener('DOMContentLoaded', (event) => {
    const headers = document.querySelectorAll(".change-position");
    headers.forEach(header => {
        const modal = header.closest('.modal-content');

        let isDragging = false;
        let startX, startY, initialX, initialY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = modal.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            modal.style.position = "absolute";
            modal.style.margin = 0;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                modal.style.left = `${initialX + dx}px`;
                modal.style.top = `${initialY + dy}px`;
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = 'auto';
        });
    });
});