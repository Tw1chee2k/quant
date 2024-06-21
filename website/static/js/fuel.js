document.addEventListener('DOMContentLoaded', function() {
    var fuelRows = document.querySelectorAll('.fuel_row');
    var previousfuelRow = null;
    var selectedfuelId = null;
    var contextmenufuel = document.getElementById('contextmenufuel');
    var changefuel_modal = document.getElementById('changefuel_modal');
    var link_changefuel_modal = document.getElementById('link_changefuel_modal');
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
                selectRow(this, index);
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
            var lastInput = inputs[inputs.length - 2];
            var noteInput = document.getElementById('modal_note');

            if (productName === "Прочее потребление") {
                lastInput.required = true;
                inputs.forEach(function(input, index) {
                    if (index < inputs.length - 2) {
                        input.readOnly = true;
                        input.style.color = "rgb(132, 132, 132)";
                       
                    } else {
                        input.readOnly = false;
                        input.style.color = "";
                    }
                });
                noteInput.required = true; 
            } else {
                noteInput.required = false;
            }
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
            var productName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            if (productName.includes(filterText)) {
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
        document.addEventListener('click', function(event) {
            if (!chooseProductArea.contains(event.target) && event.target !== nameOfProductInput) {
                chooseProductArea.style.display = 'none';
            }
        });
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


    
});