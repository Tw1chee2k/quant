document.addEventListener('DOMContentLoaded', function() {
    var fuelRows = document.querySelectorAll('.fuel_row');
    var previousfuelRow = null;
    var selectedfuelId = null;
    var contextmenufuel = document.getElementById('contextmenufuel');
    var changefuel_modal = document.getElementById('changefuel_modal');
    var link_changefuel_modal = document.getElementById('link_changefuel_modal');
    var close_changefuel_modal = document.getElementById('close_changefuel_modal');
    var remove_section = document.getElementById('remove_section');

    fuelRows.forEach(function(row, index) {
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
                contextmenufuel.style.top = event.pageY + 'px';
                contextmenufuel.style.left = event.pageX + 'px';
                contextmenufuel.style.display = 'block';
            }
        });
    });

    document.addEventListener('click', function(event) {
        if (!contextmenufuel.contains(event.target)) {
            contextmenufuel.style.display = 'none';
        }
    });

    document.getElementById('link_changefuel_modal').addEventListener('click', function() {
        if (selectedfuelId) {
            openModal();
        }
    });
    window.addEventListener('click', function(event) {
        contextmenufuel.style.display = 'none';
        if (event.target == changefuel_modal) {
            changefuel_modal.style.display = 'none';
        }
    });
    document.querySelector('.close').addEventListener('click', function() {
        changefuel_modal.style.display = 'none';
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
    
            if (index === fuelRows.length - 2) {
                remove_section.disabled = true;
                link_changefuel_modal.disabled = false;
            } else if (index === fuelRows.length - 1 || index === fuelRows.length - 3) {
                remove_section.disabled = true;
                link_changefuel_modal.disabled = true;
            } else {
                remove_section.disabled = false;
                link_changefuel_modal.disabled = false;
            }
        }
    }

    function openModal() {
        var activeRow = document.querySelector('.fuel_row.active-report');
        if (activeRow) {
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
            var isOtherConsumption = productName === "Прочее потребление";
            var is7000 = productName === "Предельный уровень потребления (объекты непроизводственного характера, коммунально-бытового назначения и другие)";
            
            var is0020 = productName === "Теплоэнергия, отпущенная электростанциями и районными котельными";
            var is0021 = productName === "Теплоэнергия, отпущенная электростанциями и районными котельными (в том числе отпущенная районными котельными)";
            var is0024 = productName === "Теплоэнергия, отпущенная промышленно-производственными котельными производительностью 10 Гкал/час и более";
            var is0025 = productName === "Теплоэнергия, отпущенная промышленно-производственными котельными производительностью от 0,5 до 10 Гкал/час";
            var is0026 = productName === "Теплоэнергия, отпущенная отопительными котельными производительностью 10 Гкал/час  и более";
            var is0027 = productName === "Теплоэнергия, отпущенная отопительными котельными производительностью от 0,5 до 10 Гкал/час";
            var is0030 = productName === "Теплоэнергия, отпущенная отопительно-производственными котельными, производительностью 10 Гкал/час и более";
            var is0031 = productName === "Теплоэнергия, отпущенная отопительно-производственными котельными производительностью от 0,5 до 10 Гкал/час";


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
                else if (is7000){
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
                        input.style.color = "";
                        input.readOnly = true;
                        input.style.color = "rgb(132, 132, 132)";
                        
                    }
                    else {
                        input.style.color = "";
                        input.readOnly = false;
                    }
                }
                
            });

            changefuel_modal.style.display = 'block';
        }
    }
    

    var link_addSection_modal = document.querySelector('[data-action="link_addSection_modal"]');
    var addSection_modal = document.getElementById('addSection_modal');
    var close_addSection_modal = addSection_modal.querySelector('.close');

    link_addSection_modal.addEventListener('click', function() {
        contextmenufuel.style.display = 'none';
        addSection_modal.style.display = 'block';
    });

    close_addSection_modal.addEventListener('click', function() {
        addSection_modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        contextmenufuel.style.display = 'none';
        if (event.target == addSection_modal) {
            addSection_modal.style.display = 'none';
        }
    });
    var nameOfProductInput = document.querySelector('input[name="name_of_product"]');
    var add_id_productInput = document.querySelector('input[name="add_id_product"]');
    var chooseProductArea = document.querySelector('.choose-product_area');
    var chooseProdTableBody = document.getElementById('chooseProdTableBody');
    var noResultsRow = document.getElementById('noResultsRow');
    
    nameOfProductInput.addEventListener('focus', function() {
        chooseProductArea.style.display = 'block';
    });
    
    chooseProdTableBody.addEventListener('click', function(event) {
        if (event.target.tagName === 'TD') {
            var productName = event.target.parentNode.querySelector('td:nth-child(2)').textContent;
            var productId = event.target.parentNode.querySelector('td:nth-child(4)').textContent;
            nameOfProductInput.value = productName;
            add_id_productInput.value = productId;
            chooseProductArea.style.display = 'none';
        }
    });

    remove_section.addEventListener('click', function() {
        var activefuel = document.querySelector('.fuel_row.active-report');
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

    /*всплывающее окно с единицами измерения*/
    var DirUnitModal = document.getElementById('DirUnitModal');
    var DirUnitLink = document.getElementById('DirUnitLink');
    var CloseDirUnit = document.getElementById('CloseDirUnit');

    DirUnitLink.addEventListener('click', function() {
        DirUnitModal.style.display = 'block';
    });

    CloseDirUnit.addEventListener('click', function() {
        DirUnitModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == DirUnitModal) {
            DirUnitModal.style.display = 'none';
        }
    });
    /*end*/

    /*всплывающее окно с продуктами*/
    var DirProductModal = document.getElementById('DirProductModal');
    var DirProductLink = document.getElementById('DirProductLink');
    var CloseDirProduct = document.getElementById('CloseDirProduct');
    DirProductLink.addEventListener('click', function() {
        DirProductModal.style.display = 'block';
    });

    CloseDirProduct.addEventListener('click', function() {
        DirProductModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == DirProductModal) {
            DirProductModal.style.display = 'none';
        }
    });
    /*end*/
});

document.querySelector('input[name="search_product"]').addEventListener('input', function() {
    var filterText = this.value.trim().toLowerCase();
    var chooseProductArea = document.querySelector('.choose-product_area');
    var chooseProdTableBody = document.querySelector('#chooseProdTableBody');
    var noResultsproduct = document.getElementById('noResultsRow');

    if (filterText.length > 0) {
        chooseProductArea.style.display = 'block';
    } else {
        chooseProductArea.style.display = 'none';
    }

    var hasResults = false;
    Array.from(chooseProdTableBody.querySelectorAll('tr')).forEach(function(row) {
        var codeProduct = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
        var productName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        if (codeProduct.includes(filterText) || productName.includes(filterText)) {
            row.style.display = '';
            noResultsproduct.style.display = 'block';
        } else { 
            row.style.display = 'none';
        }
    });



});

document.addEventListener('click', function(event) {
    var chooseProductArea = document.querySelector('.choose-product_area');
    var nameOfProductInput = document.querySelector('input[name="name_of_product"]');
    var search_productInput = document.querySelector('input[name="search_product"]')

    if (!chooseProductArea.contains(event.target) && event.target !== nameOfProductInput) {
        search_productInput.value = '';
        chooseProductArea.style.display = 'none';
        
    }
});


document.querySelector('#chooseProdTableBody').addEventListener('click', function(event) {
    var selectedRow = event.target.closest('tr');
    var productName = selectedRow.querySelector('td:nth-child(2)').textContent;
    
    var is7000 = productName === "Предельный уровень потребления (объекты непроизводственного характера, коммунально-бытового назначения и другие)";
    var is0020 = productName === "Теплоэнергия, отпущенная электростанциями и районными котельными";
    var is0021 = productName === "Теплоэнергия, отпущенная электростанциями и районными котельными (в том числе отпущенная районными котельными)";
    var is0024 = productName === "Теплоэнергия, отпущенная промышленно-производственными котельными производительностью 10 Гкал/час и более";
    var is0025 = productName === "Теплоэнергия, отпущенная промышленно-производственными котельными производительностью от 0,5 до 10 Гкал/час";
    var is0026 = productName === "Теплоэнергия, отпущенная отопительными котельными производительностью 10 Гкал/час  и более";
    var is0027 = productName === "Теплоэнергия, отпущенная отопительными котельными производительностью от 0,5 до 10 Гкал/час";
    var is0030 = productName === "Теплоэнергия, отпущенная отопительно-производственными котельными, производительностью 10 Гкал/час и более";
    var is0031 = productName === "Теплоэнергия, отпущенная отопительно-производственными котельными производительностью от 0,5 до 10 Гкал/час";



    if (is7000) {
        var inputs = document.querySelectorAll('.sectionsModal-table input');
        inputs.forEach(function(input) {
            var inputName = input.getAttribute('name');
            if (inputName !== 'oked' && inputName !== 'Consumed_Total_Quota' && inputName !== 'Consumed_Total_Fact' && inputName !== 'note' && inputName !== 'current_version' &&  inputName !== 'add_id_product' &&  inputName !== 'search_product' &&  inputName !== 'section_number') {
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
        var inputs = document.querySelectorAll('.sectionsModal-table input');
        inputs.forEach(function(input) {
            var inputName = input.getAttribute('name');
            if (inputName !== 'Consumed_Total_Quota' && inputName !== 'Consumed_Total_Fact' && inputName !== 'note' && inputName !== 'current_version' &&  inputName !== 'add_id_product' &&  inputName !== 'search_product' &&  inputName !== 'section_number') {
                input.readOnly = true;
                if (inputName !== 'name_of_product' && inputName !== 'oked'){
                    input.style.color = "rgb(132, 132, 132)";
                    input.value = '0.00';
                    
                }
                else if(inputName === 'oked'){
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
        var inputs = document.querySelectorAll('.sectionsModal-table input');
        inputs.forEach(function(input) {
            var inputName = input.getAttribute('name');
            if (inputName !== 'oked' && inputName !== 'produced' && inputName !== 'Consumed_Quota' && inputName !== 'Consumed_Total_Fact' && inputName !== 'note' && inputName !== 'current_version' &&  inputName !== 'add_id_product' &&  inputName !== 'search_product' &&  inputName !== 'section_number') {
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


