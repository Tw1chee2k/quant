document.addEventListener('DOMContentLoaded', function() {
    var fuelRows = document.querySelectorAll('.fuel_row');
    var previousfuelRow = null;
    var selectedfuelId = null;

    fuelRows.forEach(function(row, index) {
        row.addEventListener('click', function(event) {
            if (event.button === 0 && this.dataset.id) {
                selectRow(this, index);
            }
        });
    });

    function selectRow(row, index) {
        selectedfuelId = row.dataset.id;
        if (row.classList.contains('active-report')) {
            row.classList.remove('active-report');
            row.querySelectorAll('input').forEach(function(input) {
                input.classList.remove('active-input');
            });
            previousfuelRow = null;

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
        }
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

    /*всплывающее окно с респондентом*/
    var RespondentModal = document.getElementById('RespondentModal');
    var RespondentLink = document.getElementById('RespondentLink');
    var CloseRespondent = document.getElementById('CloseRespondent');
    RespondentLink.addEventListener('click', function() {
        RespondentModal.style.display = 'block';
    });

    CloseRespondent.addEventListener('click', function() {
        RespondentModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == RespondentModal) {
            RespondentModal.style.display = 'none';
        }
    });
    /*end*/



});

