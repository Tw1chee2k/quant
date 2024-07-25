document.addEventListener('DOMContentLoaded', function () {
    const clearButtons = document.querySelectorAll('.clear-btn');

    clearButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            input.value = '';
        });
    });
    
    function expandText(input) {
        if (!input.originalWidth) {
            input.originalWidth = input.style.width;
        }
        if (input.style.whiteSpace === 'nowrap') {
            input.style.whiteSpace = 'normal';
            input.style.overflow = 'visible';
            input.style.textOverflow = 'clip';
            input.style.width = 'auto';
        } else {
            input.style.whiteSpace = 'nowrap';
            input.style.overflow = 'hidden';
            input.style.textOverflow = 'ellipsis';
            input.style.width = input.originalWidth;
        }
    }
    
    const header = document.querySelector('.fixed-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            if (currentTheme === 'dark') {
                header.style.backgroundColor = '#252525';
           
            }
            else{
                header.style.backgroundColor = 'white';
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
        var userImgs = document.querySelectorAll('.icon_black, .icon_white');
        var hoverPanel = document.querySelector('.hoverPanel');
        var timeoutId;
    
        function showhoverPanel() {
            if (hoverPanel) {
                hoverPanel.classList.remove('hidden');
                hoverPanel.classList.add('show');
            }
        }
    
        function hidehoverPanel() {
            if (hoverPanel) {
                hoverPanel.classList.remove('show');
                hoverPanel.classList.add('hidden');
            }
        }
    
        function setupEventListeners(element) {
            element.addEventListener('mouseenter', function() {
                clearTimeout(timeoutId);
                showhoverPanel();
            });
    
            element.addEventListener('mouseleave', function() {
                timeoutId = setTimeout(hidehoverPanel, 1000); // Задержка перед началом скрытия
            });
        }
    
        if (userImgs.length > 0 && hoverPanel) {
            userImgs.forEach(setupEventListeners);
    
            hoverPanel.addEventListener('mouseenter', function() {
                clearTimeout(timeoutId);
                showhoverPanel();
            });
    
            hoverPanel.addEventListener('mouseleave', function() {
                timeoutId = setTimeout(hidehoverPanel, 1000); // Задержка перед началом скрытия
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
            var oldValue = this.value;
            var selectionStart = this.selectionStart;
            var selectionEnd = this.selectionEnd;
            
            var value = oldValue.replace(/[^\d.]/g, '');
            var parts = value.split('.');
            if (parts.length > 1) {
                value = parts[0] + '.' + parts[1].slice(0, 2);
            }
            
            if (value.startsWith('0') && value.length > 1 && value[1] !== '.') {
                value = value.substring(1);
            }
    
            if (!value.includes('.')) {
                value += '.00';
            }

            var oldDotIndex = oldValue.indexOf('.');
            var newDotIndex = value.indexOf('.');
    
            this.value = value;
    

            if (selectionEnd - selectionStart > 1) {
                this.setSelectionRange(selectionEnd, selectionEnd);
            } else if (selectionStart <= oldDotIndex) {
                var cursorPos = selectionStart + (newDotIndex - oldDotIndex);
                this.setSelectionRange(cursorPos, cursorPos);
            } else {
                this.setSelectionRange(selectionStart, selectionStart);
            }
        });
    
        input.addEventListener('focus', function(event) {
            if (this.value === '') {
                this.value = '0.00';
            }
    
            var dotIndex = this.value.indexOf('.');
            if (dotIndex !== -1) {
                this.setSelectionRange(dotIndex, dotIndex);
            }
        });
    
        input.addEventListener('click', function(event) {
            this.select();
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

document.addEventListener('DOMContentLoaded', function() {
    const table = document.querySelector('.table_report-area');
    const thElements = table.querySelectorAll('th.resizable');
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;
    let currentTh = null;

    thElements.forEach(th => {
        const resizer = th.querySelector('.resizer');
        if (resizer) {
            resizer.addEventListener('mousedown', function(e) {
                isResizing = true;
                startX = e.clientX;
                startWidth = th.offsetWidth;
                currentTh = th;
                document.body.style.cursor = 'col-resize';
                e.preventDefault();
            });
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isResizing) {
            const newWidth = startWidth + (e.clientX - startX);
            currentTh.style.width = newWidth + 'px';
            currentTh.style.minWidth = newWidth + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
        }
    });
});

