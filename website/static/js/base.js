//header
const header = document.querySelector('.fixed-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        header.style.backgroundColor = 'white';
    } else {
        header.style.backgroundColor = 'transparent';
    }
});
//end


const clearButtons = document.querySelectorAll('.clear-btn');
clearButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const input = this.previousElementSibling;
        if (input && input.tagName === 'INPUT') {
            input.value = '';
        }
    });
});

function setupPasswordToggle(passwordFieldId, showIconClass, hideIconClass) {
    const passwordField = document.querySelector(`#${passwordFieldId}`);
    const showPasswordIcon = document.querySelector(`.${showIconClass}`); 
    const hidePasswordIcon = document.querySelector(`.${hideIconClass}`);
    
    if (passwordField && showPasswordIcon && hidePasswordIcon) {
        showPasswordIcon.style.display = 'none';
        hidePasswordIcon.style.display = 'none';

        function showIcons() {
            updateIconsVisibility();
            showPasswordIcon.style.visibility = 'visible';
            hidePasswordIcon.style.visibility = 'visible';
        }

        function hideIcons() {
            showPasswordIcon.style.visibility = 'hidden';
            hidePasswordIcon.style.visibility = 'hidden';
        }

        function updateIconsVisibility() {
            if (passwordField.type === 'password') {
                showPasswordIcon.style.display = 'inline';
                hidePasswordIcon.style.display = 'none';
            } else {
                showPasswordIcon.style.display = 'none';
                hidePasswordIcon.style.display = 'inline';
            }
        }

        passwordField.addEventListener('mouseover', showIcons);
        showPasswordIcon.addEventListener('mouseover', showIcons);
        hidePasswordIcon.addEventListener('mouseover', showIcons);

        passwordField.addEventListener('mouseout', hideIcons);
        showPasswordIcon.addEventListener('mouseout', hideIcons);
        hidePasswordIcon.addEventListener('mouseout', hideIcons);

        showPasswordIcon.addEventListener('click', function() {
            passwordField.type = 'text';
            updateIconsVisibility();
        });

        hidePasswordIcon.addEventListener('click', function() {
            passwordField.type = 'password';
            updateIconsVisibility();
        });
    }
}

function filterSentedReports() {
    var year = document.getElementById('quantity_year').value;
    var quarter = document.getElementById('quantity_quarter').value;
    var url = `/audit_area/all_reports?year=${year}&quarter=${quarter}`;
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

/* message-animation */
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
/* end message-animation */

/* only numbers */
var numericInputs = document.querySelectorAll('.numericInput');
numericInputs.forEach(function(input) {
    input.addEventListener('input', function(event) {
        this.value = this.value.replace(/\D/g, '');
    });
});
/* end only numbers */

/* numbers + dot only */
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
/* end numbers + dot only */



document.addEventListener('DOMContentLoaded', function () {
    /* menuButton */
    const menuButton = document.getElementById('menu-button');
    const headerCenter = document.querySelector('.header-center');
    
    function showHeaderCenter() {
        if (headerCenter) {
            headerCenter.classList.remove('hidden');
            headerCenter.classList.add('show');
        }
    }
    
    function hideHeaderCenter() {
        if (headerCenter) {
            headerCenter.classList.remove('show');
            headerCenter.classList.add('hidden');
        }
    }
    
    if (menuButton && headerCenter) {
        menuButton.addEventListener('click', function(event) {
            showHeaderCenter();
            event.stopPropagation();
        });
    
        document.addEventListener('click', function(event) {
            if (!headerCenter.contains(event.target) && !menuButton.contains(event.target)) {
                hideHeaderCenter();
            }
        });
    
        headerCenter.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
  /* end menuButton */


    /* show and hide buttons passwords */
    setupPasswordToggle('password-field', 'show-icon', 'hide-icon');
    setupPasswordToggle('password-field1', 'show-icon1', 'hide-icon1');
    /* end show and hide buttons passwords */

    /* change theme */
    // const themeToggle = document.getElementById('darkmode-toggle');
    // const body = document.body;
    // const currentTheme = localStorage.getItem('theme') || 'light';

    // if (currentTheme === 'dark') {
    //     body.classList.add('dark-mode');     
    // } else {
    //     body.classList.add('light-mode');
    // }

    // themeToggle.addEventListener('click', () => {
    //     if (body.classList.contains('dark-mode')) {
    //         body.classList.add('light-mode');
    //         body.classList.remove('dark-mode');
    //         localStorage.setItem('theme', 'light');
    //         themeToggle.textContent = 'Темная тема';
    //     } else {
    //         body.classList.add('dark-mode');
    //         body.classList.remove('light-mode');
    //         localStorage.setItem('theme', 'dark');
    //         themeToggle.textContent = 'Светлая тема';
    //     }
    // });
    /* end change theme */

    /* hoveruser panel */
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
        element.addEventListener('click', function(event) {
            clearTimeout(timeoutId);
            showUserHoverNavigation();
            event.stopPropagation(); 
        });
    }
    
    // Для всех иконок добавляем обработчик клика
    userImgs.forEach(setupEventListeners);
    
    // Обработчик клика для документа
    document.addEventListener('click', function(event) {
        if (!user_hover_navigation.contains(event.target)) {
            hideUserHoverNavigation();
        }
    });
    
    // Остановим скрытие, если клик был внутри user_hover_navigation
    user_hover_navigation.addEventListener('click', function(event) {
        event.stopPropagation();
    });
    /* end hoveruser panel */

    /* change size column in table */
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
    /* end change size column in table */


    /* for report_area*/
    var reportRows = document.querySelectorAll('.report_row');
    var versionRows = document.querySelectorAll('.version-row');
    var ticketRows = document.querySelectorAll('.ticket-row');
    
    var previousReportRow = null;
    var previousVersionRow = null;

    var previousTicketRow = null;
    var selectedReportId = null;

    var selectedVersionId = null;
    var selectedTicketId = null;

    var contextMenuReport = document.getElementById('contextMenu_report');
    var contextMenuVersion = document.getElementById('contextMenu_version');

    reportRows.forEach(function(row) {
    row.addEventListener('click', function() {
        contextMenuVersion.style.display = 'none';
        versionRows.forEach(function(versionRow) {
            versionRow.classList.remove('active-report_version');
        });
        ticketRows.forEach(function(ticketRow) {
            ticketRow.classList.remove('active-ticket');
        });
        activeRow = null;

        updateVersionButtonStyle(false, false, false, false);         
        updateTicketButtonStyle(false);
        if (this.dataset.id) {
            selectedReportId = this.dataset.id;
            if (this.classList.contains('active-report')) {
                this.classList.remove('active-report');
                previousReportRow = null;
                updateVersionButtonStyle(false, false, false, false);
                updateTicketButtonStyle(false);
            } else {
                if (previousReportRow !== null) {
                    previousReportRow.classList.remove('active-report');
                }
                this.classList.add('active-report');
                previousReportRow = this;
            }
        }
    });

    row.addEventListener('dblclick', function() {
        contextMenuVersion.style.display = 'none';
        var versionsRow = this.nextElementSibling.nextElementSibling;
        if (versionsRow.style.display === 'none' || versionsRow.style.display === '') {
            versionsRow.style.display = 'table-row';
            setTimeout(function() {
                versionsRow.classList.add('show');
            }, 10);
            contextMenuReport.style.display = 'none';
            contextMenuVersion.style.display = 'none';
        } else {
            versionsRow.classList.remove('show');
            versionsRow.addEventListener('transitionend', function handler() {
                versionsRow.style.display = 'none';
                versionsRow.removeEventListener('transitionend', handler);
            });
            contextMenuReport.style.display = 'none';
            contextMenuVersion.style.display = 'none';
        }

        var imgBlack = this.querySelector('.close_black');
        var imgWhite = this.querySelector('.close_white');
        if (imgBlack && imgWhite) {
            imgBlack.classList.toggle('rotated');
            imgWhite.classList.toggle('rotated');
        }
    });
    row.addEventListener('contextmenu', function(event) {
        contextMenuVersion.style.display = 'none';
        event.preventDefault();
        versionRows.forEach(function(versionRow) {
            versionRow.classList.remove('active-report_version');
        });

        if (this.dataset.id) {
            selectedReportId = this.dataset.id;

            if (previousReportRow !== null) {
                previousReportRow.classList.remove('active-report');
            }
            this.classList.add('active-report');
            previousReportRow = this;

            contextMenuReport.style.top = event.clientY + 'px';
            contextMenuReport.style.left = event.clientX + 'px';
            contextMenuReport.style.display = 'flex';
        }
    });
    });

    versionRows.forEach(function(row) {
    row.addEventListener('click', function() {
        contextMenuVersion.style.display = 'none';

        reportRowsd.forEach(function(versionRow) {
            versionRow.classList.remove('active-report');
        });

        if (this.dataset.id) {
            selectedVersiontId = this.dataset.id;

            if (this.classList.contains('active-report_version')) {
                this.classList.remove('active-report_version');
                previousVersionRow = null;

            } else {
                if (previousVersionRow !== null) {
                    previousVersionRow.classList.remove('active-report_version');
                }
                this.classList.add('active-report_version');
                previousVersionRow = this;
            }
        }
    });

    ticketRows.forEach(function(row) {
        row.addEventListener('click', function() {
            reportRowsd.forEach(function(ticketRow) {
                ticketRow.classList.remove('active-ticket');
            });
            if (this.dataset.id) {
                selectedTicketId = this.dataset.id;
    
                if (this.classList.contains('active-ticket')) {
                    this.classList.remove('active-ticket');
                    previousTicketRow = null;
    
                } else {
                    if (previousTicketRow !== null) {
                        previousTicketRow.classList.remove('active-ticket');
                    }
                    this.classList.add('active-ticket');
                    previousTicketRow = this;
                }
            }
        });
    });

    row.addEventListener('contextmenu', function(event) {
        contextMenuReport.style.display = 'none';
        event.preventDefault();

        reportRows.forEach(function(reportRow) {
            reportRow.classList.remove('active-report');
        });

        if (this.dataset.id) {
            selectedVersionId = this.dataset.id;

            if (previousVersionRow !== null) {
                previousVersionRow.classList.remove('active-report_version');
            }
            this.classList.add('active-report_version');
            previousVersionRow = this;

            contextMenuVersion.style.top = event.clientY + 'px';
            contextMenuVersion.style.left = event.clientX + 'px';
            contextMenuVersion.style.display = 'flex';
        }
    });
    });

    document.addEventListener('click', function(event) {
    if (!contextMenuReport.contains(event.target)) {
        contextMenuReport.style.display = 'none';
    }
    if (!contextMenuVersion.contains(event.target)) {
        contextMenuVersion.style.display = 'none';
    }
    });
    /*end*/

    /*Переход на страницу с fuel*/
    document.querySelectorAll('.version-row').forEach(function(row) {
    row.addEventListener('dblclick', function() {
        var id = this.dataset.id;
        var url = "/report_area/fuel/" + id;
        console.log(id);
        window.location.href = url;
    });
    });

    document.querySelector('[data-action="checkVersionButton"]').addEventListener('click', function() {
    var activeVersionRow = document.querySelector('.version-row.active-report_version');
    if (activeVersionRow) {
        var id = activeVersionRow.dataset.id;
        var url = "/report_area/fuel/" + id;
        console.log(id);
        window.location.href = url;
    } else {
        alert('Нет активной версии. Пожалуйста, выберите версию.');
    }
    });
    /*end*/

    /*кнопка для отображения версий отчета*/
    var toggleButtons = document.querySelectorAll('.show-versions_button');
    toggleButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            var versionsRow = this.closest('.report_row').nextElementSibling.nextElementSibling;
            if (versionsRow.style.display === 'none' || versionsRow.style.display === '') {
                versionsRow.style.display = 'table-row';
                setTimeout(function() {
                    versionsRow.classList.add('show');
                }, 10);
                contextMenuReport.style.display = 'none';
                contextMenuVersion.style.display = 'none';
                
            } else {
                versionsRow.classList.remove('show');
                versionsRow.addEventListener('transitionend', function handler() {
                    versionsRow.style.display = 'none';
                    versionsRow.removeEventListener('transitionend', handler);
                });
                contextMenuReport.style.display = 'none';
                contextMenuVersion.style.display = 'none';
            }
            
            var imgBlack = this.querySelector('.close_black');
            var imgWhite = this.querySelector('.close_white');
            if (imgBlack && imgWhite) {
                imgBlack.classList.toggle('rotated');
                imgWhite.classList.toggle('rotated');
            }
        });
    });
    /*end*/

    /*кнопка для отображения квитанций отчета*/
    var showCheksButtons = document.querySelectorAll('.show-tickets_button');   
    showCheksButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            var checkRow = this.closest('.version-row').nextElementSibling;
            if (checkRow.style.display === 'none' || checkRow.style.display === '') {
                checkRow.style.display = 'table-row';
                setTimeout(function() {
                    checkRow.classList.add('show');
                }, 10);
                contextMenuReport.style.display = 'none';
                contextMenuVersion.style.display = 'none';
            } else {
                checkRow.classList.remove('show');
                checkRow.addEventListener('transitionend', function handler() {
                    checkRow.style.display = 'none';
                    checkRow.removeEventListener('transitionend', handler);
                });
                contextMenuReport.style.display = 'none';
                contextMenuVersion.style.display = 'none';
            }
            var imgBlack = this.querySelector('.close_black');
            var imgWhite = this.querySelector('.close_white');
            if (imgBlack && imgWhite) {
                imgBlack.classList.toggle('rotated');
                imgWhite.classList.toggle('rotated');
            }
        });
    });
    /*end*/

    /* показ панели для редактирования параметров отчета */
    var link_change_report = document.getElementById('link_change_report');
    var link_add_report = document.getElementById('link_add_report');
    var link_coppy_report = document.getElementById('link_coppy_report');

    var change_report_modal = document.getElementById('change_report_modal');
    var add_report_modal = document.getElementById('add_report_modal');
    var coppy_report_modal = document.getElementById('coppy_report_modal');

    var close_change_report_modal = change_report_modal.querySelector('.close');
    var close_add_report_modal = add_report_modal.querySelector('.close');
    var close_coppy_report_modal = coppy_report_modal.querySelector('.close');

    link_change_report.addEventListener('click', function(event) {
        event.preventDefault();
        var reportRow = document.querySelector('.report_row.active-report');

        if (reportRow) {
            var reportId = reportRow.querySelector('#report_id').value;
            var reportOkpo = reportRow.querySelector('#report_okpo').value;
            var organizationName = reportRow.querySelector('#report_organization_name').value;
            var reportYear = reportRow.querySelector('#report_year').value;
            var reportQuarter = reportRow.querySelector('#report_quarter').value;
            
            document.getElementById('modal_report_id').value = reportId;
            document.getElementById('modal_organization_name').value = organizationName;
            document.getElementById('modal_report_okpo').value = reportOkpo;
            document.getElementById('modal_report_year').value = reportYear;
            document.getElementById('modal_report_quarter').value = reportQuarter;
        }
        change_report_modal.classList.add('active');
        contextMenuReport.style.display = 'none';
    });

    link_add_report.addEventListener('click', function() {
        add_report_modal.classList.add('active');
        contextMenuReport.style.display = 'none';
    });

    link_coppy_report.addEventListener('click', function(event) {
        event.preventDefault();
        var reportRow = document.querySelector('.report_row.active-report');
        if (reportRow) {
            var reportId = reportRow.querySelector('#report_id').value;
            document.getElementById('copped_id').value = reportId;
        }
        coppy_report_modal.classList.add('active');
        contextMenuReport.style.display = 'none';
    });

    close_change_report_modal.addEventListener('click', function() {
        change_report_modal.classList.remove('active');
    });

    close_coppy_report_modal.addEventListener('click', function() {
        coppy_report_modal.classList.remove('active');
    });

    close_add_report_modal.addEventListener('click', function() {
        add_report_modal.classList.remove('active');
    });

    change_report_modal.addEventListener('click', function(event) {
        if (event.target === change_report_modal) {
            change_report_modal.classList.remove('active');
        }
    });

    coppy_report_modal.addEventListener('click', function(event) {
        if (event.target === coppy_report_modal) {
            coppy_report_modal.classList.remove('active');
        }
    });

    add_report_modal.addEventListener('click', function(event) {
        if (event.target === add_report_modal) {
            add_report_modal.classList.remove('active');
        }
    });
    /* end */



    var add_versionButton = document.getElementById('add_versionButton');
    add_versionButton.addEventListener('click', function(event) {
        var activeRow = document.querySelector('.report_row.active-report');
        if (activeRow !== null) {
            var ReportId = activeRow.dataset.id;
            if (ReportId) {
                var addForm = document.getElementById('addVersion');
                addForm.action = '/create_new_report_version/' + ReportId;
            }
        } else {
            alert('Выберите отчет для добавления версии');
            event.preventDefault();
        }
    });

    var del_versionButton = document.getElementById('del_versionButton');
    del_versionButton.addEventListener('click', function(event) {
        var activeRow = document.querySelector('.version-row.active-report_version');
        if (activeRow !== null) {
            var varsionId = activeRow.dataset.id;
            if (varsionId) {
                var deleteForm = document.getElementById('deleteVersion');
                deleteForm.action = '/delete_version/' + varsionId;
            }
        } else {
            alert('Выберите версию для удаления');
            event.preventDefault();
        }
    });

    var del_reportButton = document.getElementById('del_reportButton');
    del_reportButton.addEventListener('click', function(event) {
        var activeRow = document.querySelector('.report_row.active-report');
        if (activeRow !== null) {
            var ReportId = activeRow.dataset.id;
            if (ReportId) {
                var deleteForm = document.getElementById('deleteReport');
                deleteForm.action = '/delete_report/' + ReportId;
            }
        } else {
            alert('Выберите отчет для удаления');
            event.preventDefault();
        }
    });

    var agreedVersionButton = document.getElementById('agreedVersionButton');
    var agreedForm = document.getElementById('agreed-version-form');
    var controlVersionButton = document.getElementById('control_versionButton');
    var controlForm = document.getElementById('control-version-form');
    var sentVersionButton = document.getElementById('sentVersionButton');
    var sentForm = document.getElementById('sent-version-form');

    var exportVersionButton = document.getElementById('export_versionButton');
    var exportForm = document.getElementById('export-version-form');

    function updateVersionButtonStyle(agreedActive, controlActive, sentActive, exportActive) {
        if (agreedActive) {
            agreedVersionButton.style.opacity = '1';
            agreedVersionButton.style.cursor = 'pointer';
            agreedVersionButton.querySelector('img').style.filter = 'none';
            agreedVersionButton.querySelector('a').style.filter = 'none';
        } else {
            agreedVersionButton.style.opacity = '0.5';
            agreedVersionButton.style.cursor = 'not-allowed';
            agreedVersionButton.querySelector('img').style.filter = 'grayscale(100%)';
            agreedVersionButton.querySelector('a').style.filter = 'grayscale(100%)';
        }
        if (controlActive) {
            controlVersionButton.style.opacity = '1';
            controlVersionButton.style.cursor = 'pointer';
            controlVersionButton.querySelector('img').style.filter = 'none';
            controlVersionButton.querySelector('a').style.filter = 'none';
        } else {
            controlVersionButton.style.opacity = '0.5';
            controlVersionButton.style.cursor = 'not-allowed';
            controlVersionButton.querySelector('img').style.filter = 'grayscale(100%)';
            controlVersionButton.querySelector('a').style.filter = 'grayscale(100%)';
        }
        if (sentActive) {
            sentVersionButton.style.opacity = '1';
            sentVersionButton.style.cursor = 'pointer';
            sentVersionButton.querySelector('img').style.filter = 'none';
            sentVersionButton.querySelector('a').style.filter = 'none';
        } else {
            sentVersionButton.style.opacity = '0.5';
            sentVersionButton.style.cursor = 'not-allowed';
            sentVersionButton.querySelector('img').style.filter = 'grayscale(100%)';
            sentVersionButton.querySelector('a').style.filter = 'grayscale(100%)';
        }

        if (exportActive) {
            exportVersionButton.style.opacity = '1';
            exportVersionButton.style.cursor = 'pointer';
            exportVersionButton.querySelector('img').style.filter = 'none';
            exportVersionButton.querySelector('a').style.filter = 'none';
        } else {
            exportVersionButton.style.opacity = '0.5';
            exportVersionButton.style.cursor = 'not-allowed';
            exportVersionButton.querySelector('img').style.filter = 'grayscale(100%)';
            exportVersionButton.querySelector('a').style.filter = 'grayscale(100%)';
        }
    }

    var activeAgreedRow = document.querySelector('.version-row.active-report_version');
    updateVersionButtonStyle(activeAgreedRow !== null, activeAgreedRow !== null, activeAgreedRow !== null, activeAgreedRow !== null);

    var versionRows = document.querySelectorAll('.version-row');
    versionRows.forEach(function(row) {
        row.addEventListener('click', function() {
            var isActive = this.classList.contains('active-report_version');

            versionRows.forEach(function(row) {
                row.classList.remove('active-report_version');
            });

            if (isActive) {
                activeAgreedRow = null;
                updateVersionButtonStyle(false, false, false, false);
            } else {
                this.classList.add('active-report_version');
                activeAgreedRow = this;
                updateVersionButtonStyle(true, true, true, true);
            }
        });
    });

    var PrintTicketButton = document.getElementById('PrintTicketButton');
    var printForm = document.getElementById('print-ticket-form');

    function updateTicketButtonStyle(printActive) {
        if (printActive) {
            PrintTicketButton.style.opacity = '1';
            PrintTicketButton.style.cursor = 'pointer';
            PrintTicketButton.querySelector('img').style.filter = 'none';
            PrintTicketButton.querySelector('a').style.filter = 'none';
        } else {
            PrintTicketButton.style.opacity = '0.5';
            PrintTicketButton.style.cursor = 'not-allowed';
            PrintTicketButton.querySelector('img').style.filter = 'grayscale(100%)';
            PrintTicketButton.querySelector('a').style.filter = 'grayscale(100%)';
        }
    }

    var activePrintRow = document.querySelector('.ticket-row.active-ticket');
    updateTicketButtonStyle(activePrintRow !== null);

    var ticketRows = document.querySelectorAll('.ticket-row');
    ticketRows.forEach(function(row) {
        row.addEventListener('click', function() {
            var isActive = this.classList.contains('active-ticket');

            ticketRows.forEach(function(row) {
                row.classList.remove('active-ticket');
            });

            if (isActive) {
                activeAgreedRow = null;
                updateTicketButtonStyle(false);
            } else {
                this.classList.add('active-ticket');
                activeAgreedRow = this;
                updateTicketButtonStyle(true);
               
            }
        });
    });

    agreedVersionButton.addEventListener('click', function(event) {
        if (activeAgreedRow === null) {
            event.preventDefault();
        } else {
            var versionId = activeAgreedRow.dataset.id;
            if (versionId) {
                agreedForm.action = '/agreed_version/' + versionId;
                agreedForm.submit();
            }
        }
    });

    controlVersionButton.addEventListener('click', function(event) {
        var activeControlRow = document.querySelector('.version-row.active-report_version');
        if (activeControlRow !== null) {
            var versionId = activeControlRow.dataset.id;
            if (versionId) {
                controlForm.action = '/control_version/' + versionId;
                controlForm.submit();
            }
        } else {
            event.preventDefault();
        }
    });

    sentVersionButton.addEventListener('click', function(event) {
        var activesentRow = document.querySelector('.version-row.active-report_version');
        if (activesentRow !== null) {
            var versionId = activesentRow.dataset.id;
            if (versionId) {
                sentForm.action = '/sent_version/' + versionId;
                sentForm.submit();
            }
        } else {
            event.preventDefault();
        }
    });

    exportVersionButton.addEventListener('click', function(event) {
        var activeexportRow = document.querySelector('.version-row.active-report_version');
        if (activeexportRow !== null) {
            var versionId = activeexportRow.dataset.id;
            if (versionId) {
                exportForm.action = '/export_version/' + versionId;
                exportForm.submit();
            }
        } else {
            event.preventDefault();
        }
    });

    
    PrintTicketButton.addEventListener('click', function(event) {
        var activePrintRow = document.querySelector('.ticket-row.active-ticket');
        if (activePrintRow !== null) {
            var ticketId = activePrintRow.dataset.id;
            if (ticketId) {
                printForm.action = '/print_ticket/' + ticketId;
                printForm.submit();
            }
        } else {
            event.preventDefault();
        }
    });
    /* end report_area*/
});


/* change pozition modal */
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
/* end change pozition modal */


/* sort table by tt dif */
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
/* end sort tablel by tt dif */

/* period modal */
var link_period = document.getElementById('link_period');
var period_modal = document.getElementById('period_modal');
var close_period_modal = period_modal.querySelector('.close');

link_period.addEventListener('click', function() {
    period_modal.classList.add('active'); // Добавляем класс 'active'
    contextMenuReport.style.display = 'none';
});

close_period_modal.addEventListener('click', function() {
    period_modal.classList.remove('active'); // Убираем класс 'active'
});

period_modal.addEventListener('click', function(event) {
    if (event.target === period_modal) {
        period_modal.classList.remove('active'); // Убираем класс 'active'
    }
});
/* end */





function smoothScroll(target) {
    const [path, hash] = target.split('#');
    if (window.location.pathname === path) {
        document.getElementById(hash).scrollIntoView({
            behavior: 'smooth'
        });
    } else {
        window.location.href = target;
    }
}










