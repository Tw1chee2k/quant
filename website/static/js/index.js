document.addEventListener('DOMContentLoaded', function () {
/*появляющиеся сообщения*/
    var alertBox = document.querySelector('.custom-alert');
    setTimeout(function() {
        alertBox.classList.add('hidden');
    }, 2000);
/*end*/
    
/*появляющаяся панель при навидении на иконку пользователя*/
    var userImg = document.getElementById('user-img');
    var hoverPanel = document.getElementById('hoverPanel');
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
    });  
 /*end*/   

/*создание нового отчета*/
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
            // Находим активную строку отчета
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

/*активный отчет*/
    var reportRows = document.querySelectorAll('.report_row');
    var previousRow = null;
    var selectedReportId = null;
    reportRows.forEach(function(row) {
        row.addEventListener('click', function() {
            if (this.dataset.id) {
                selectedReportId = this.dataset.id;

                if (this.classList.contains('active-report')) {
                    this.classList.remove('active-report');
                    previousRow = null;
                } else {
                    if (previousRow !== null) {
                        previousRow.classList.remove('active-report');
                    }
                    this.classList.add('active-report');
                    previousRow = this;
                }
            }
        });
        row.addEventListener('contextmenu', function(event) {
            event.preventDefault();

            if (previousRow !== null) {
                previousRow.classList.remove('active-report');
            }
            this.classList.add('active-report');
            previousRow = this;
            contextMenu.style.top = event.clientY + 'px';
            contextMenu.style.left = event.clientX + 'px';
            contextMenu.style.display = 'flex';
        });
    });
    var contextMenu = document.getElementById('contextMenu');
    document.addEventListener('click', function(event) {
        if (!contextMenu.contains(event.target)) {
            contextMenu.style.display = 'none';
        }
    });
/*end*/

/*показ панели для редактирования параметров отчета при двойном клике на строку в таблице*/
    var report_row = document.querySelectorAll('.report_row');
    report_row.forEach(function(row) {
        row.addEventListener('dblclick', function() {
            var change_input_row = this.nextElementSibling;
            if (change_input_row.style.display === 'none' || change_input_row.style.display === '') {
                change_input_row.style.display = 'table-row';
            } else {
                change_input_row.style.display = 'none';
            }
        });
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
    

    



 /*активная версия*/
    var rowsWithVersions = document.querySelectorAll(".version-row");
    var previousRow = null;
    rowsWithVersions.forEach(function(row) {
        row.addEventListener('click', function() {
            selectedversionId = this.dataset.id;
            console.log(selectedversionId);
        
            if (this.classList.contains('active-report_version')) {
                this.classList.remove('active-report_version');
                this.style.backgroundColor = '';
            } else {
                if (previousRow !== null) {
                    previousRow.classList.remove('active-report_version');
                    previousRow.style.backgroundColor = '';
                }
                this.classList.add('active-report_version');
                previousRow = this;
            }
        }); 
    });

/*end*/
    
    document.querySelectorAll('.version-row').forEach(function(row) {
        row.addEventListener('dblclick', function() {
            var id = this.dataset.id;
            var url = "/report/fuel/" + id;
            console.log(id);
            window.open(url, '_blank');
        });
    });

/* реализация удаления версии, *активной строки*/
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
    
/*отображение панели по кнопке*/

/*end*/

/*заперт на ввод всего кроме чисел в input*/

/*end*/




