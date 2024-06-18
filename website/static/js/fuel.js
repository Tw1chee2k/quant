document.addEventListener('DOMContentLoaded', function () {

    var fuelRows = document.querySelectorAll('.fuel_row');
    var previousfuelRow = null;
    var selectedfuelId = null;
    var contextmenufuel = document.getElementById('contextmenufuel');
    var changefuel_modal = document.getElementById('changefuel_modal');
    
    fuelRows.forEach(function(row) {
        row.addEventListener('click', function(event) {
            if (event.button === 0 && this.dataset.id) {
                selectRow(this);
            }
        });
    
        row.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            if (this.dataset.id) {
                selectRow(this);
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
    
    function selectRow(row) {
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
    }
    
    function openModal() {
        var activeRow = document.querySelector('.fuel_row.active-report');
        if (activeRow) {
            document.getElementById('modal_product_name').value = activeRow.querySelector('.product-name_fuel').value;
            document.getElementById('modal_oked').value = activeRow.querySelector('input[name="Oked_fuel"]').value;
            document.getElementById('modal_produced').value = activeRow.querySelector('input[name="produced_fuel"]').value;
            document.getElementById('modal_Consumed_Quota').value = activeRow.querySelector('input[name="Consumed_Quota_fuel"]').value;
            document.getElementById('modal_Consumed_Fact').value = activeRow.querySelector('input[name="Consumed_Fact_fuel"]').value;
            document.getElementById('modal_Consumed_Total_Quota').value = activeRow.querySelector('input[name="Consumed_Total_Quota_fuel"]').value;
            document.getElementById('modal_Consumed_Total_Fact').value = activeRow.querySelector('input[name="Consumed_Total_Fact_fuel"]').value;
            document.getElementById('modal_note').value = activeRow.querySelector('input[name="note_fuel"]').value;
            document.getElementById('modal_id').value = selectedfuelId;
            changefuel_modal.style.display = 'block';
        }
    }
    



    var link_addfuel_modal = document.getElementById('link_addfuel_modal');
    var addfuel_modal = document.getElementById('addfuel_modal'); 
    var close_addfuel_modal = addfuel_modal.querySelector('.close'); 
    link_addfuel_modal.addEventListener('click', function() {
        contextmenufuel.style.display = 'none';
        addfuel_modal.style.display = 'block';
        contextMenu.style.display = 'none';
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


    var link_changefuel_modal = document.getElementById('link_changefuel_modal');
    var changefuel_modal = document.getElementById('changefuel_modal'); 
    var close_changefuel_modal = changefuel_modal.querySelector('.close'); 
    link_changefuel_modal.addEventListener('click', function() {
        changefuel_modal.style.display = 'block';
        contextMenu.style.display = 'none';
    });
    close_changefuel_modal.addEventListener('click', function() {
        changefuel_modal.style.display = 'none';
    });
    window.addEventListener('click', function(event) {
        if (event.target == changefuel_modal) {
            changefuel_modal.style.display = 'none';
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
});