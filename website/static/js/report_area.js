document.addEventListener('DOMContentLoaded', function () {
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

    /*показ панели для редактирования параметров отчета*/
    var link_change_report = document.getElementById('link_change_report');
    var link_add_report = document.getElementById('link_add_report');

    var change_report_modal = document.getElementById('change_report_modal');
    var add_report_modal = document.getElementById('add_report_modal');
    
    var close_change_report_modal = change_report_modal.querySelector('.close');
    var close_add_report_modal = add_report_modal.querySelector('.close');


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
        change_report_modal.style.display = 'block';
        contextMenuReport.style.display = 'none';
    });

    link_add_report.addEventListener('click', function() {
    
        add_report_modal.style.display = 'block';
        contextMenuReport.style.display = 'none';
    });


    close_change_report_modal.addEventListener('click', function() {
        change_report_modal.style.display = 'none';

    });

    close_add_report_modal.addEventListener('click', function() {
        add_report_modal.style.display = 'none';

    });

    change_report_modal.addEventListener('click', function(event) {
        if (event.target === change_report_modal) {
            change_report_modal.style.display = 'none';
        }
    });

    add_report_modal.addEventListener('click', function(event) {
        if (event.target === add_report_modal) {
            add_report_modal.style.display = 'none';
        }
    });
    /*end*/






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

    // Обработчик клика по кнопке "Печать"
    PrintTicketButton.addEventListener('click', function(event) {
        if (activePrintRow === null) {
            event.preventDefault();
        } else {
            var ticketId = activePrintRow.dataset.id;
            if (ticketId) {
                printForm.action = '/' + ticketId;
                printForm.submit();
            }
        }
    });

    // Обработчик клика по кнопке "Согласовать"
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

    // Обработчик клика по кнопке "Контроль версии"
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




});  


