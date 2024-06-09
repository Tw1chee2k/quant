document.addEventListener('DOMContentLoaded', function () {
/*появляющиеся сообщения*/
    var alertBox = document.querySelector('.custom-alert');
    alertBox.style.display = 'block';
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
/*end*/
    });  
    
      
/*создание нового отчета*/
    var newReportItem = document.getElementById('newReportItem');
    newReportItem.addEventListener('click', function() {
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
    });
/*end*/
    
/*создание новой организации в справочнике*/
    var new_Organization = document.getElementById('new_Organization');
    new_Organization.addEventListener('click', function() {
        fetch('/create_new_organization', {
            method: 'POST'
        })
        .then(function(response) {
            if (response.ok) {
                window.location.reload();
            } else {
                console.error('Ошибка при добавлении организации');
            }
        })
        .catch(function(error) {
            console.error('Ошибка при отправке запроса:', error);
        });
    });
/*end*/
    
/*при клике на строку - активный отчет*/
    var report_row = document.querySelectorAll('.report_row');
    var previousRow = null;
    var selectedReportId = null;
    report_row.forEach(function(row) {
        row.addEventListener('click', function() {
            selectedReportId = this.dataset.id;
            console.log(selectedReportId);
            
            if (this.classList.contains('active_stroka')) {
                this.classList.remove('active_stroka');
            } else {
                if (previousRow !== null) {
                    previousRow.classList.remove('active_stroka');
                }
                this.classList.add('active_stroka');
                previousRow = this;
            }
        });
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
    var row_with_versions = document.querySelectorAll('.row_with_versions');
    var previousRow = null;
    var selectedversionId = null;

    var toggleButtons = document.querySelectorAll('.show_versins_button');
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
    
/*создание новой версии*/
    var new_version = document.getElementById('new_version');
    new_version.addEventListener('click', function() {
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
    
/*кнопка для отображения квитанций*/
    var buttons = document.querySelectorAll(".show_cheks_button");

    buttons.forEach(function(button) {
        button.addEventListener("click", function(event) {
            event.stopPropagation();
            var row = this.closest(".row_with_versions");
            var nextRow = row.nextElementSibling;

            if (nextRow && nextRow.classList.contains("check_row")) {

                if (nextRow.style.display === "none" || nextRow.style.display === "") {
                    nextRow.style.display = "block";
                } else {
                    nextRow.style.display = "none";
                }
            }
        });
    });
/*end*/
    
/*активная версия*/
    var rowsWithVersions = document.querySelectorAll(".row_with_versions");
    var previousRow = null;
    rowsWithVersions.forEach(function(row) {
        row.addEventListener('click', function() {
            selectedversionId = this.dataset.id;
            console.log(selectedversionId);
            
            if (this.classList.contains('active_stroka_version')) {
                this.classList.remove('active_stroka_version');
                this.style.backgroundColor = '';
            } else {
                if (previousRow !== null) {
                    previousRow.classList.remove('active_stroka_version');
                    previousRow.style.backgroundColor = '';
                }
                this.classList.add('active_stroka_version');
                previousRow = this;
            }
        }); 
    });
    document.querySelectorAll('.row_with_versions').forEach(function(row) {
        row.addEventListener('dblclick', function() {
            var id = this.dataset.id;
            var url = "/report/fuel/" + id;
            window.open(url, '_blank');
        });
    });
/*end*/
    
/* реализация удаления версии, *активной строки*/
    var del_version = document.getElementById('del_version');
    del_version.addEventListener('click', function() {
        var activeRow = document.querySelector('.row_with_versions.active_stroka_version');
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
    
/*удаления активного отчета*/
    var deleteReportButton = document.getElementById('del_this_report');
    deleteReportButton.addEventListener('click', function() {
        var activeRow = document.querySelector('.report_row.active_stroka');
        if (activeRow !== null) {
            var reportId = activeRow.dataset.id;
            deleteReport(reportId);
        } else {
            alert('Выберите отчет для удаления');
        }
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
    
    
/*удаление активной реализации*/
    var DeleteOrgButton = document.getElementById('del_this_org');
    DeleteOrgButton.addEventListener('click', function() {
        var activeRow = document.querySelector('.report_row.active_stroka');
        if (activeRow !== null) {
            var orgId = activeRow.dataset.id;
            deleteOrg(orgId);
        } else {
            alert('Выберите строку для удаления');
        }
    });

    function deleteOrg(orgId) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/delete_organization/' + orgId, true);
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

/*всплывающее окно с предприятиями*/
    var myLi = document.getElementById('myLi');
    var modal = document.getElementById('myModal');
    var spanmyModal = document.getElementsByClassName('close')[0];
    myLi.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    spanmyModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
/*end*/
    
/*всплывающее окно с единицами измерения*/
    var myUOM = document.getElementById('myUOM');
    var modalUOM = document.getElementById('myModalUOM');
    var spanmyModalUOM = document.getElementsByClassName('close')[1];
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
    var spanmyModalTOP = document.getElementsByClassName('close')[2];
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

/*подставка окпо организации при выборе оргниазации в select*/   
    function setOkpo(event) {
        var selectElement = event.target;
        var inputElement = selectElement.parentElement.parentElement.querySelector('input[name="okpo"]');
        var selectedOption = selectElement.options[selectElement.selectedIndex];
        if (selectedOption.value !== "") { 
            inputElement.value = parseInt(selectedOption.value, 10);
        } else {
            inputElement.value = "";
        }
    }
    var selectElements = document.querySelectorAll('select[name="okpo_select"]');
    selectElements.forEach(function(selectElement) {
        selectElement.addEventListener('change', setOkpo);
    });
/*end*/
    
/* открытие страницы в новой вкладке*/
    function openNewWindow(url) {
        window.open(url, '_blank');
    }
/*end*/
    
/*отображение панели по кнопке*/
    function showPanel(panelId) {
        const panels = document.querySelectorAll('.panel_dop_report');
        panels.forEach(panel => panel.style.display = 'none');
        const selectedPanel = document.getElementById(panelId);
        selectedPanel.style.display = 'block';
    }
    window.onload = function() {
        showPanel('Toplivo');
    };
/*end*/

/*заперт на ввод всего кроме чисел в input*/
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
}
/*end*/




