document.addEventListener('DOMContentLoaded', function () {

    function createNewReport() {
        fetch('/create_new_report', {
            method: 'POST'
        })
        .then(function(response) {
            if (response.ok) {
                window.location.reload();
            } else {
                console.error('Ошибка при добавлении отчета');
            }
        })
        .catch(function(error) {
            console.error('Ошибка при отправке запроса:', error);
        });
    }
    var createReport = document.querySelectorAll('[data-action="createReport"]');
    createReport.forEach(function(button) {
        button.addEventListener('click', createNewReport);
    });
    /*end*/

    /*удаления активного отчета*/
    var deleteReportButtons = document.querySelectorAll('[data-action="deleteReport"]');
    deleteReportButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var activeRow = document.querySelector('.report_row.active-report');
            if (activeRow !== null) {
                var reportId = activeRow.dataset.id;
                deleteReport(reportId);
            } else {
                alert('Выберите отчет для удаления');
            }
        });
    });
    function deleteReport(reportId) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/delete_report/' + reportId, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    window.location.reload();
                } else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.send();
    }
    /*end*/

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


    /*создание новой версии*/
    var newVersionButton = document.querySelector('[data-action="new-version"]');
    newVersionButton.addEventListener('click', function() {
    var selectedReportId = document.querySelector('.report_row.active-report').dataset.id;
    if (selectedReportId) {
        fetch('/create_new_report_version/' + selectedReportId, {
            method: 'POST'
        })
        .then(function(response) {
            if (response.ok) {
                window.location.reload();
            } else {
                console.error('Ошибка при добавлении версии');
            }
        })
        .catch(function(error) {
            console.error('Ошибка при отправке запроса:', error);
        });
    } else {
        console.error('Выберите отчет для добавления версии');
    }
    });
    /*end*/

    /*удаление версии*/
    var del_version = document.getElementById('del_version');
    del_version.addEventListener('click', function() {
        var activeRow = document.querySelector('.version-row.active-report_version');
        if (activeRow !== null) {
            var varsionId = activeRow.dataset.id;
            Delete_version(varsionId);
        } else {
            alert('Выберите версию для удаления');
        }
    });
    function Delete_version(varsionId) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/delete_version/' + varsionId, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    window.location.reload();
                } else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.send();
    }
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
    const showCheksButtons = document.querySelectorAll('.show-cheks_button');       
    showCheksButtons.forEach(button => {
        button.addEventListener('click', function () {
            const checkRow = this.closest('.version-row').nextElementSibling;
            if (checkRow.style.display === 'none' || checkRow.style.display === '') {
                checkRow.style.display = 'table-row';
            } else {
                checkRow.style.display = 'none';
            }
        });
    });
    /*end*/

    /*всплывающее окно с единицами измерения*/
    var myUOM = document.getElementById('myUOM');
    var modalUOM = document.getElementById('myModalUOM');
    var spanmyModalUOM = document.getElementsByClassName('close')[0];
    myUOM.addEventListener('click', function() {
        modalUOM.style.display = 'block';
    });

    spanmyModalUOM.addEventListener('click', function() {
        modalUOM.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modalUOM) {
            modalUOM.style.display = 'none';
        }
    });
    /*end*/

    /*всплывающее окно с продуктами*/
    var myTOP = document.getElementById('myTOP');
    var modalTOP = document.getElementById('myModalTOP');
    var spanmyModalTOP = document.getElementsByClassName('close')[1];
    myTOP.addEventListener('click', function() {
        modalTOP.style.display = 'block';
    });

    spanmyModalTOP.addEventListener('click', function() {
        modalTOP.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modalTOP) {
            modalTOP.style.display = 'none';
        }
    });
    /*end*/

    /* открытие страницы в новой вкладке*/
    function openNewWindow(url) {
        window.open(url, '_blank');
    }
    /*end*/
});  
 /*end*/   

