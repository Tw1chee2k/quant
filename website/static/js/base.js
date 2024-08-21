document.addEventListener('DOMContentLoaded', function () {
    const clearButtons = document.querySelectorAll('.clear-btn');
    clearButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input && input.tagName === 'INPUT') {
                input.value = '';
            }
        });
    });


    /*показ панели для выбора периода account*/
    var link_period = document.getElementById('link_period');
    var period_modal = document.getElementById('period_modal');
    var close_period_modal = period_modal.querySelector('.close');


    link_period.addEventListener('click', function() {
        period_modal.style.display = 'block';
        contextMenuReport.style.display = 'none';
    });

  
    close_period_modal.addEventListener('click', function() {
        period_modal.style.display = 'none';

    });


    period_modal.addEventListener('click', function(event) {
        if (event.target === period_modal) {
            period_modal.style.display = 'none';
        }
    });
    /*end*/




    function setupPasswordToggle(passwordFieldId, showIconClass, hideIconClass) {
        const passwordField = document.querySelector(`#${passwordFieldId}`);
        const showPasswordIcon = document.querySelector(`.${showIconClass}`);
        const hidePasswordIcon = document.querySelector(`.${hideIconClass}`);
    
        if (passwordField && showPasswordIcon && hidePasswordIcon) {
            function updateIconsVisibility() {
                if (passwordField.type === 'password') {
                    showPasswordIcon.style.display = 'inline';
                    hidePasswordIcon.style.display = 'none';
                } else {
                    showPasswordIcon.style.display = 'none';
                    hidePasswordIcon.style.display = 'inline';
                }
            }

            passwordField.addEventListener('input', updateIconsVisibility);
            showPasswordIcon.addEventListener('click', function() {
                passwordField.type = 'text';
                updateIconsVisibility();
            });
    
            hidePasswordIcon.addEventListener('click', function() {
                passwordField.type = 'password';
                updateIconsVisibility();
            });
    
            updateIconsVisibility();
        }
    }
    
    setupPasswordToggle('password-field', 'show-icon', 'hide-icon');
    setupPasswordToggle('password-field1', 'show-icon1', 'hide-icon1');


    var full_name_common = document.querySelector('input[name="full_name_common"]');
    var okpo_common = document.querySelector('input[name="okpo_common"]');
    var ynp_common = document.querySelector('input[name="ynp_common"]');
    var district_common = document.querySelector('input[name="district_common"]');
    var city_common = document.querySelector('input[name="city_common"]');
    var ministry_common = document.querySelector('input[name="ministry_common"]');

    var chooseOrganizationArea = document.querySelector('.choose-organization_area');
    var chooserOganizationTableBody = document.getElementById('chooserOganizationTableBody');
    
    full_name_common.addEventListener('focus', function() {
        chooseOrganizationArea.style.display = 'block';
    });
    
    chooserOganizationTableBody.addEventListener('click', function(event) {
        if (event.target.tagName === 'TD') {
            chooseOrganizationArea.style.display = 'none';
            var OrganizationName = event.target.parentNode.querySelector('td:nth-child(1)').textContent;
            var OrganizationOked = event.target.parentNode.querySelector('td:nth-child(2)').textContent;

            var OrganizationYNP = event.target.parentNode.querySelector('td:nth-child(3)').textContent;
            var OrganizationRAI = event.target.parentNode.querySelector('td:nth-child(4)').textContent;
            var OrganizationGOR = event.target.parentNode.querySelector('td:nth-child(5)').textContent;
            var OrganizationMIN = event.target.parentNode.querySelector('td:nth-child(6)').textContent;
            
            full_name_common.value = OrganizationName;
            okpo_common.value = OrganizationOked;
            ynp_common.value = OrganizationYNP;
            district_common.value = OrganizationRAI;
            city_common.value = OrganizationGOR;
            ministry_common.value = OrganizationMIN;
        } 
    });
    
    document.addEventListener('click', function(event) {
        var search_organization = document.querySelector('input[name="search_organization"]');
        if (!chooseOrganizationArea.contains(event.target) && event.target !== full_name_common) {
            chooseOrganizationArea.style.display = 'none';
            search_organization.value = '';
        }
    });

    document.querySelector('input[name="search_organization"]').addEventListener('input', function() {
        var filterText = this.value.trim().toLowerCase();   
        var chooserOganizationTableBody = document.querySelector('#chooserOganizationTableBody');

        Array.from(chooserOganizationTableBody.querySelectorAll('tr')).forEach(function(row) {      
            var OrgName = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
            var codeOrg = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            if (codeOrg.includes(filterText) || OrgName.includes(filterText)) {
                row.style.display = '';
            } else { 
                row.style.display = 'none';
            }
        });

    });

    // function updateUserActivity() {
    //     fetch('/update_activity', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ action: 'update_activity' })
    //     });
    // }
    
    // document.addEventListener('mousemove', updateUserActivity);
    // document.addEventListener('keydown', updateUserActivity);


    
});

function filterSentedReports() {
    var year = document.getElementById('quantity_year').value;
    var quarter = document.getElementById('quantity_quarter').value;
    var url = `/audit_area?year=${year}&quarter=${quarter}`;
    window.location.href = url;
}

function increment_year() {
    var input = document.getElementById("quantity_year");
    input.value = parseInt(input.value) + 1;
}

function decrement_year() {
    var input = document.getElementById("quantity_year");
    if (parseInt(input.value) > 0) {
        input.value = parseInt(input.value) - 1;
    }
}

function increment_quarter() {
    var input = document.getElementById("quantity_quarter");
    var value = parseInt(input.value);

    if (value < 4) {
        input.value = value + 1;
    }
}

function decrement_quarter() {
    var input = document.getElementById("quantity_quarter");
    var value = parseInt(input.value);

    if (value > 1) {
        input.value = value - 1;
    }
}

function coppy_increment_year() {
    var input = document.getElementById("coppy_quantity_year");
    input.value = parseInt(input.value) + 1;
}

function coppy_decrement_year() {
    var input = document.getElementById("coppy_quantity_year");
    if (parseInt(input.value) > 0) {
        input.value = parseInt(input.value) - 1;
    }
}

function coppy_increment_quarter() {
    var input = document.getElementById("coppy_quantity_quarter");
    var value = parseInt(input.value);

    if (value < 4) {
        input.value = value + 1;
    }
}

function coppy_decrement_quarter() {
    var input = document.getElementById("coppy_quantity_quarter");
    var value = parseInt(input.value);

    if (value > 1) {
        input.value = value - 1;
    }
}

function edit_increment_year() {
    var input = document.querySelector('input[name="modal_change_report_year"]');
    input.value = parseInt(input.value) + 1;
}

function edit_decrement_year() {
    var input = document.querySelector('input[name="modal_change_report_year"]');
    if (parseInt(input.value) > 0) {
        input.value = parseInt(input.value) - 1;
    }
}

function edit_increment_quarter() {
    var input = document.querySelector('input[name="modal_change_report_quarter"]');
    var value = parseInt(input.value);

    if (value < 4) {
        input.value = value + 1;
    }
}

function edit_decrement_quarter() {
    var input = document.querySelector('input[name="modal_change_report_quarter"]');
    var value = parseInt(input.value);

    if (value > 1) {
        input.value = value - 1;
    }
}


document.addEventListener('DOMContentLoaded', function () {

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

    // function updateOnlineUsers() {
    //     fetch('/online_users')
    //         .then(response => response.text())
    //         .then(html => {
    //             document.getElementById('online-users-list').innerHTML = html;
    //         });
    // }
    // setInterval(updateOnlineUsers, 60000); 

    const themeToggle = document.getElementById('darkmode-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Устанавливаем начальное состояние темы
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.checked = true; 
    } else {
        body.classList.add('light-mode');
        themeToggle.checked = false;
    }
    
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
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
    

    const userImgs = document.querySelectorAll('.icon_black, .icon_white');
    const user_hover_navigation = document.getElementById('user_hover_navigation');
    let timeoutId;

    function showUserHoverNavigation() {
        if (user_hover_navigation) {
            user_hover_navigation.classList.remove('hidden');
            user_hover_navigation.classList.add('show');
        }
    }

    function hideUserHoverNavigation() {
        if (user_hover_navigation) {
            user_hover_navigation.classList.remove('show');
            user_hover_navigation.classList.add('hidden');
        }
    }

    function setupEventListeners(element) {
        element.addEventListener('mouseenter', function() {
            clearTimeout(timeoutId);
            showUserHoverNavigation();
        });

        element.addEventListener('mouseleave', function() {
            timeoutId = setTimeout(hideUserHoverNavigation, 1000);
        });
    }

    if (userImgs.length > 0 && user_hover_navigation) {
        userImgs.forEach(setupEventListeners);

        user_hover_navigation.addEventListener('mouseenter', function() {
            clearTimeout(timeoutId);
            showUserHoverNavigation();
        });

        user_hover_navigation.addEventListener('mouseleave', function() {
            timeoutId = setTimeout(hideUserHoverNavigation, 1000);
        });
    }
    


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

let sortOrder = 'asc';
function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.querySelector(".table_report-area tbody");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 0; i < (rows.length - 3 - 1); i++) {
            shouldSwitch = false;
            var input1 = rows[i].querySelector('input[name="row_total_differents"]');
            var input2 = rows[i + 1].querySelector('input[name="row_total_differents"]');
            if (input1 && input2) {
                x = input1.value;
                y = input2.value;
                if (sortOrder === 'asc') {
                    if (parseFloat(x) > parseFloat(y)) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if (parseFloat(x) < parseFloat(y)) {
                        shouldSwitch = true;
                        break;
                    }
                }
            } else {
                console.error("One of the inputs is missing. Check the 'name' attribute.");
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        } else {
            sortOrder = (sortOrder === 'asc') ? 'desc' : 'asc';
        }
    }
    console.log('end');
    
}
