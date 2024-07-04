document.addEventListener('DOMContentLoaded', function() {
    var fuelRows = document.querySelectorAll('.fuel_row');
    var previousfuelRow = null;
    var selectedfuelId = null;
    var contextmenufuel = document.getElementById('contextmenufuel');
    var changefuel_modal = document.getElementById('changefuel_modal');
    var link_changefuel_modal = document.getElementById('link_changefuel_modal');
    var close_changefuel_modal = document.getElementById('close_changefuel_modal');
    var remove_fuel = document.getElementById('remove_fuel');

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
            remove_fuel.disabled = true;
            link_changefuel_modal.disabled = true;
        } else {
            // Если строка не активна, добавить классы и установить previousfuelRow
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
                remove_fuel.disabled = true;
                link_changefuel_modal.disabled = false;
            } else if (index === fuelRows.length - 1 || index === fuelRows.length - 3) {
                remove_fuel.disabled = true;
                link_changefuel_modal.disabled = true;
            } else {
                remove_fuel.disabled = false;
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
    

    var link_addfuel_modal = document.querySelector('[data-action="link_addfuel_modal"]');
    var addfuel_modal = document.getElementById('addfuel_modal');
    var close_addfuel_modal = addfuel_modal.querySelector('.close');

    link_addfuel_modal.addEventListener('click', function() {
        contextmenufuel.style.display = 'none';
        addfuel_modal.style.display = 'block';
    });

    close_addfuel_modal.addEventListener('click', function() {
        addfuel_modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        contextmenufuel.style.display = 'none';
        if (event.target == addfuel_modal) {
            addfuel_modal.style.display = 'none';
        }
    });

    var nameOfProductInput = document.querySelector('input[name="name_of_product"]');
    var chooseProductArea = document.querySelector('.choose-product_area');
    var chooseProdTableBody = document.getElementById('chooseProdTableBody');
    var noResultsRow = document.getElementById('noResultsRow');
    
    nameOfProductInput.addEventListener('focus', function() {
        chooseProductArea.style.display = 'block';
    });
    
    chooseProdTableBody.addEventListener('click', function(event) {
        if (event.target.tagName === 'TD') {
            var productName = event.target.parentNode.querySelector('td:nth-child(2)').textContent;
            nameOfProductInput.value = productName;
            chooseProductArea.style.display = 'none';
        }
    });
    
    nameOfProductInput.addEventListener('input', function() {
        var filterText = this.value.trim().toLowerCase();
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
                hasResults = true;
            } else {
                row.style.display = 'none';
            }
        });
        if (!hasResults && filterText.length > 0) {
            noResultsRow.style.display = 'block';
        } else {
            noResultsRow.style.display = 'none';
        }
    });
    
    document.addEventListener('click', function(event) {
        if (!chooseProductArea.contains(event.target) && event.target !== nameOfProductInput) {
            chooseProductArea.style.display = 'none';
        }
    });

    remove_fuel.addEventListener('click', function() {
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
        xhr.open('POST', '/remove_fuel/' + fuelId, true);
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
