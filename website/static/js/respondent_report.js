document.addEventListener('DOMContentLoaded', function() {
    var section_row = document.querySelectorAll('.section_row');
    var previousfuelRow = null;
    var selectedfuelId = null;
    var contextMenu_report = document.getElementById('contextMenu_report');
    var remove_section = document.getElementById('remove_section');

    section_row.forEach(function(row, index) {
        row.addEventListener('click', function(event) {
            if (event.button === 0 && this.dataset.id) {
                selectRow(this, index);
            }
        });

        row.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            if (this.dataset.id) {
                if (!this.classList.contains('active-report')) {
                    selectRow(this, index);
                }
                contextMenu_report.style.top = event.pageY + 'px';
                contextMenu_report.style.left = event.pageX + 'px';
                contextMenu_report.style.display = 'block';
            }
        });
    });

    document.addEventListener('click', function(event) {
        if (!contextMenu_report.contains(event.target)) {
            contextMenu_report.style.display = 'none';
        }
    });

    function selectRow(row, index) {
        selectedfuelId = row.dataset.id;
        if (row.classList.contains('active-report')) {
            row.classList.remove('active-report');
            row.querySelectorAll('input').forEach(function(input) {
                input.classList.remove('active-input');
            });
            previousfuelRow = null;
            remove_section.disabled = true;
            link_changefuel_modal.disabled = true;
        } else {
            if (previousfuelRow !== null) {
                previousfuelRow.classList.remove('active-report');
                previousfuelRow.querySelectorAll('input').forEach(function(input) {
                    input.classList.remove('active-input');
                });
            }
            row.classList.add('active-report');
            row.querySelectorAll('input').forEach(function(input) {
                input.classList.add('active-input');
            });
            previousfuelRow = row;
            if (index === section_row.length - 2) {
                remove_section.disabled = true;
                link_changefuel_modal.disabled = false;
            } else if (index === section_row.length - 1 || index === section_row.length - 3) {
                remove_section.disabled = true;
                link_changefuel_modal.disabled = true;
            } else {
                remove_section.disabled = false;
                link_changefuel_modal.disabled = false;
            }
        }
    }

    var nameOfProductInput = document.querySelector('input[name="name_of_product"]');
    var add_id_productInput = document.querySelector('input[name="add_id_product"]');
    var chooseProductArea = document.querySelector('.choose-product_area');
    var chooseProdTableBody = document.getElementById('chooseProdTableBody');
    var nameOfProductButton = document.getElementById('nameOfProductButton');

    nameOfProductButton.addEventListener('click', function() {
        if (chooseProductArea.style.display === 'none' || chooseProductArea.style.display === '') {
            chooseProductArea.style.display = 'block';
            nameOfProductButton.textContent = '-';
        } else {
            chooseProductArea.style.display = 'none';
            nameOfProductButton.textContent = '+';
        }
    });

    chooseProdTableBody.addEventListener('click', function(event) {
        if (event.target.tagName === 'TD') {
            var productName = event.target.parentNode.querySelector('td:nth-child(2)').textContent;
            var productId = event.target.parentNode.querySelector('td:nth-child(4)').textContent;
            nameOfProductInput.value = productName;
            nameOfProductInput.title = productName;
            add_id_productInput.value = productId;
            chooseProductArea.style.display = 'none';
            nameOfProductButton.textContent = '+';
        }   
    });

    remove_section.addEventListener('click', function() {
        var activefuel = document.querySelector('.section_row.active-report');
        if (activefuel !== null) {
            var fuelId = activefuel.dataset.id;
            Remove_fuel(fuelId);
        } else {
            alert('Выберите продукцию для удаления');
        }
    });

    function Remove_fuel(fuelId) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/remove_section/' + fuelId, true);
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

    function openChangefuel_modal() {
        var activeRow = document.querySelector('.section_row.active-report');
        if (activeRow) {

            var productCode = activeRow.querySelector('.product-cod_fuel').value;
            var productName = activeRow.querySelector('.product-name_fuel').value;

            document.getElementById('modal_product_name').value = productName;
            document.getElementById('modal_oked').value = activeRow.querySelector('input[name="Oked_fuel"]').value;
            document.getElementById('modal_produced').value = activeRow.querySelector('input[name="produced_fuel"]').value;
            document.getElementById('modal_Consumed_Quota').value = activeRow.querySelector('input[name="Consumed_Quota_fuel"]').value;
            document.getElementById('modal_Consumed_Fact').value = activeRow.querySelector('input[name="Consumed_Fact_fuel"]').value;
            document.getElementById('modal_Consumed_Total_Quota').value = activeRow.querySelector('input[name="Consumed_Total_Quota_fuel"]').value;
            document.getElementById('modal_Consumed_Total_Fact').value = activeRow.querySelector('input[name="Consumed_Total_Fact_fuel"]').value;
            document.getElementById('modal_note').value = activeRow.querySelector('input[name="note_fuel"]').value;
            document.getElementById('modal_id').value = selectedfuelId;
    
            var inputs = document.querySelectorAll('#changefuel_modal input[type="text"]');
            var isOtherConsumption = productCode === "9010";
            var is7000 = productCode === "7000";
            
            var is0020 = productCode === "0020";
            var is0021 = productCode === "0021";
            var is0024 = productCode === "0024";
            var is0025 = productCode === "0025";
            var is0026 = productCode === "0026";
            var is0027 = productCode === "0027";
            var is0030 = productCode === "0030";
            var is0031 = productCode === "0031";
       
            inputs.forEach(function(input, index) {
                if (isOtherConsumption) {
                    if (index < inputs.length - 2) {
                        input.style.color = "rgb(132, 132, 132)";
                        input.readOnly = true;
                    } else {
                        input.style.color = "";
                        input.readOnly = false;
                    }
                    input.required = index >= inputs.length - 2;
                } 
                else if (is7000 || is0020 || is0021 || is0024 || is0025 || is0026 || is0027 || is0030 || is0031){
                    if (index === 5 || index === 6 || index === 7) {
                        input.readOnly = false;
                        input.style.color = "";
                    }
                    else {
                        input.style.color = "rgb(132, 132, 132)";
                        input.readOnly = true;
                    }
                }
                else {
                    if (index === 0 || index === 1 || index === 4 || index === 5) {
                        input.style.color = "rgb(132, 132, 132)";
                        input.readOnly = true;
                    }
                    else {
                        input.style.color = "";
                        input.readOnly = false;
                    }
                }            
            });
            changefuel_modal.classList.add('active');
        }
    }
    
    document.getElementById('link_changefuel_modal').addEventListener('click', function() {
        if (selectedfuelId) {
            contextMenu_report.style.display = 'none';
            openChangefuel_modal();
        }
    });


    handleModal(document.getElementById('changefuel_modal'), document.getElementById('link_changefuel_modal'), changefuel_modal.querySelector('.close'));
    handleModal(document.getElementById('addSection_modal'), document.querySelector('[data-action="link_addSection_modal"]'), addSection_modal.querySelector('.close'));

    handleModal(document.getElementById('DirProductModal'), document.getElementById('DirProductLink'), DirProductModal.querySelector('.close'));
    handleModal(document.getElementById('DirUnitModal'), document.getElementById('DirUnitLink'), DirUnitModal.querySelector('.close'));
    handleModal(document.getElementById('INFModal'), document.getElementById('INFLink'), INFModal.querySelector('.close'));
});

document.querySelector('input[name="search_product"]').addEventListener('input', function() {
    var filterText = this.value.trim().toLowerCase();
    var chooseProdTableBody = document.querySelector('#chooseProdTableBody');
    const noResultsproduct = document.getElementById('noResultsRow');
    var hasVisibleRows = false;

    Array.from(chooseProdTableBody.querySelectorAll('tr')).forEach(function(row) {
        var codeProduct = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
        var productName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
    
        if (codeProduct.includes(filterText) || productName.includes(filterText)) {
            row.style.display = '';
            hasVisibleRows = true;
        } else {
            row.style.display = 'none'; 
        }
    });
    
    if (!hasVisibleRows) {
        noResultsproduct.style.display = 'block';
    } else {
        noResultsproduct.style.display = 'none';
    }
});

document.querySelector('#chooseProdTableBody').addEventListener('click', function(event) {
    var selectedRow = event.target.closest('tr');
    var productCode= selectedRow.querySelector('td:nth-child(1)').textContent;
    var is7000 = productCode === "7000";
    var is0020 = productCode === "0020";
    var is0021 = productCode === "0021";
    var is0024 = productCode === "0024";
    var is0025 = productCode === "0025";
    var is0026 = productCode === "0026";
    var is0027 = productCode === "0027";
    var is0030 = productCode === "0030";
    var is0031 = productCode === "0031";

    if (is7000) {
        var inputs = document.querySelectorAll('.modal_table input');
        inputs.forEach(function(input) {
            var inputName = input.getAttribute('name');
            if (inputName !== 'oked_add' && inputName !== 'Consumed_Total_Quota_add' && inputName !== 'Consumed_Total_Fact_add' && inputName !== 'note_add' && inputName !== 'current_version' &&  inputName !== 'add_id_product' &&  inputName !== 'search_product' &&  inputName !== 'section_number') {
                input.readOnly = true;
                if (inputName !== 'name_of_product'){
                    input.style.color = "rgb(132, 132, 132)";
                    input.value = '0.00';
                }
            } else {
                input.readOnly = false;
                input.style.color = "";
            }   
        });
    }
    else if (is0020 || is0021 || is0024 || is0025 || is0026 || is0027 || is0030 || is0031){
        var inputs = document.querySelectorAll('.modal_table input');
        inputs.forEach(function(input) {
            var inputName = input.getAttribute('name');
            if (inputName !== 'Consumed_Total_Quota_add' && inputName !== 'Consumed_Total_Fact_add' && inputName !== 'note_add' && inputName !== 'current_version' &&  inputName !== 'add_id_product' &&  inputName !== 'search_product' &&  inputName !== 'section_number') {
                input.readOnly = true;
                if (inputName !== 'name_of_product' && inputName !== 'oked_add'){
                    input.style.color = "rgb(132, 132, 132)";
                    input.value = '0.00';     
                }
                else if(inputName === 'oked_add'){
                    input.readOnly = true;  
                    input.value = '';
                    input.style.color = "rgb(132, 132, 132)";
                }
            } else {
                input.readOnly = false;
                input.style.color = "";   
            }   
        });
    } 
    else {
        var inputs = document.querySelectorAll('.modal_table input');
        inputs.forEach(function(input) {
            var inputName = input.getAttribute('name');
            if (inputName !== 'oked_add' && inputName !== 'produced_add' && inputName !== 'Consumed_Quota_add' && inputName !== 'Consumed_Total_Fact_add' && inputName !== 'note_add' && inputName !== 'current_version' &&  inputName !== 'add_id_product' &&  inputName !== 'search_product' &&  inputName !== 'section_number') {
                input.readOnly = true;
                if (inputName !== 'name_of_product'){
                    input.style.color = "rgb(132, 132, 132)";
                    input.value = '0.00';
                }
            } else {
                input.readOnly = false;
                input.style.color = "";
            }
        });
    }
});

document.getElementById('control-report-btn').addEventListener('click', function() {
    document.getElementById('control-report-form').submit();
});

document.getElementById('export-table-btn').addEventListener('click', function() {
    document.getElementById('export-table-form').submit();
});

function handleModal(modalElement, openLink, closeLink) {
    openLink.addEventListener('click', function(event) {
        if (openLink.style.opacity === '0.5') {
            event.preventDefault();
        } else {
            modalElement.classList.add('active');
        }
    });

    closeLink.addEventListener('click', function() {
        modalElement.classList.remove('active');
    });

    window.addEventListener('click', function(event) {
        if (event.target === modalElement) {
            modalElement.classList.remove('active');
        }
    });
}

