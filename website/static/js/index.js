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


document.addEventListener('DOMContentLoaded', function () {
    /*активный отчет и активная версия + модальные окна соответственно*/
    var reportRows = document.querySelectorAll('.report_row');
    var versionRows = document.querySelectorAll('.version-row');
    var previousReportRow = null;
    var previousVersionRow = null;
    var selectedReportId = null;
    var selectedVersionId = null;
    var contextMenuReport = document.getElementById('contextMenu_report');
    var contextMenuVersion = document.getElementById('contextMenu_version');

    reportRows.forEach(function(row) {
    row.addEventListener('click', function() {
        contextMenuVersion.style.display = 'none';
        versionRows.forEach(function(versionRow) {
            versionRow.classList.remove('active-report_version');
        });

        if (this.dataset.id) {
            selectedReportId = this.dataset.id;

            if (this.classList.contains('active-report')) {
                this.classList.remove('active-report');
                previousReportRow = null;
            } else {
                if (previousReportRow !== null) {
                    previousReportRow.classList.remove('active-report');
                }
                this.classList.add('active-report');
                previousReportRow = this;
            }
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
        contextMenuReport.style.display = 'none';

        reportRows.forEach(function(reportRow) {
            reportRow.classList.remove('active-report');
        });

        if (this.dataset.id) {
            selectedVersionId = this.dataset.id;

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
        var url = "/report/fuel/" + id;
        console.log(id);
        window.location.href = url;
    });
    });

    document.querySelector('[data-action="checkVersionButton"]').addEventListener('click', function() {
    var activeVersionRow = document.querySelector('.version-row.active-report_version');
    if (activeVersionRow) {
        var id = activeVersionRow.dataset.id;
        var url = "/report/fuel/" + id;
        console.log(id);
        window.location.href = url;
    } else {
        alert('Нет активной версии. Пожалуйста, выберите версию.');
    }
    });
    /*end*/

    /*кнопка для отображения версий отчета*/
    var toggleButtons = document.querySelectorAll('.show-versins_button');
    toggleButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            var versionsRow = this.closest('.report_row').nextElementSibling.nextElementSibling;
            if (versionsRow.style.display === 'none' || versionsRow.style.display === '') {
                versionsRow.style.display = 'table-row';
            } else {
                versionsRow.style.display = 'none';
            }
        });
    });
    /*end*/

    /*кнопка для отображения квитанций отчета*/
    var showCheksButtons = document.querySelectorAll('.show-cheks_button');   
    showCheksButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            var checkRow = this.closest('.version-row').nextElementSibling;
            if (checkRow.style.display === 'none' || checkRow.style.display === '') {
                checkRow.style.display = 'table-row';
            } else {
                checkRow.style.display = 'none';
            }
        });
    });
    /*end*/

    /*показ панели для редактирования параметров отчета*/
    var link_change_report = document.getElementById('link_change_report');
    var change_report_modal = document.getElementById('change_report_modal');
    var close_report_modal = change_report_modal.querySelector('.close');

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

    close_report_modal.addEventListener('click', function() {
        change_report_modal.style.display = 'none';
    });

    change_report_modal.addEventListener('click', function(event) {
        if (event.target === change_report_modal) {
            change_report_modal.style.display = 'none';
        }
    });
    /*end*/



    document.getElementById('create-report-btn').addEventListener('click', function() {
        document.getElementById('new-report-form').submit();
    });



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





















});  

 

 