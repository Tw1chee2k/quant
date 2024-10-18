document.addEventListener('DOMContentLoaded', function() {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('addCommentModal') === 'true') {
        var addCommentModal = document.getElementById('addCommentModal');
        if (addCommentModal) {
            addCommentModal.style.display = 'block';
        }
    }

/* всплывающее окно с респондентом */
var RespondentModal = document.getElementById('RespondentModal');
var RespondentLink = document.getElementById('RespondentLink');
var CloseRespondent = document.getElementById('CloseRespondent');

RespondentLink.addEventListener('click', function() {
    RespondentModal.classList.add('active'); // Добавляем класс 'active'
});

CloseRespondent.addEventListener('click', function() {
    RespondentModal.classList.remove('active'); // Убираем класс 'active'
});

window.addEventListener('click', function(event) {
    if (event.target == RespondentModal) {
        RespondentModal.classList.remove('active'); // Убираем класс 'active'
    }
});
/* end */

/* модальное окно добавления комментария */
var addCommentModal = document.getElementById('addCommentModal');
var addCommentLink = document.getElementById('addCommentLink');
var CloseaddComment = document.getElementById('CloseaddComment');

addCommentLink.addEventListener('click', function(event) {
    if (addCommentLink.style.opacity === '0.5') {
        event.preventDefault();
    } else {
        addCommentModal.classList.add('active'); // Добавляем класс 'active'
    }
});

CloseaddComment.addEventListener('click', function() {
    addCommentModal.classList.remove('active'); // Убираем класс 'active'
});

window.addEventListener('click', function(event) {
    if (event.target == addCommentModal) {
        addCommentModal.classList.remove('active'); // Убираем класс 'active'
    }
});

/* end */

/* модальное окно показа комментариев */
var showCommentsModal = document.getElementById('showCommentsModal');
var showCommentsLink = document.getElementById('showCommentsLink');
var CloseshowComments = document.getElementById('CloseshowComments');

showCommentsLink.addEventListener('click', function() {
    showCommentsModal.classList.add('active'); // Добавляем класс 'active'
});

CloseshowComments.addEventListener('click', function() {
    showCommentsModal.classList.remove('active'); // Убираем класс 'active'
});

window.addEventListener('click', function(event) {
    if (event.target == showCommentsModal) {
        showCommentsModal.classList.remove('active'); // Убираем класс 'active'
    }
});
/* end */


    const sectionLinks = document.querySelectorAll('[data-section]');
    sectionLinks.forEach(link => {
        link.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section').replace('link', 'table');
            sectionLinks.forEach(item => {
                item.classList.remove('activefunctions_menu');
            });

            this.classList.add('activefunctions_menu');

            document.querySelectorAll('.report-area > div').forEach(div => {
                div.style.display = 'none';
            });

            const sectionToShow = document.getElementById(sectionId);
            if (sectionToShow) {
                sectionToShow.style.display = 'block';
            }
        });
    });

    var fuelRows = document.querySelectorAll('.section_row');
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

/* всплывающее окно с единицами измерения */
var DirUnitModal = document.getElementById('DirUnitModal');
var DirUnitLink = document.getElementById('DirUnitLink');
var CloseDirUnit = document.getElementById('CloseDirUnit');

DirUnitLink.addEventListener('click', function() {
    DirUnitModal.classList.add('active'); // Добавляем класс 'active'
});

CloseDirUnit.addEventListener('click', function() {
    DirUnitModal.classList.remove('active'); // Убираем класс 'active'
});

window.addEventListener('click', function(event) {
    if (event.target === DirUnitModal) {
        DirUnitModal.classList.remove('active'); // Убираем класс 'active'
    }
});
/* end */

/* всплывающее окно с продуктами */
var DirProductModal = document.getElementById('DirProductModal');
var DirProductLink = document.getElementById('DirProductLink');
var CloseDirProduct = document.getElementById('CloseDirProduct');

DirProductLink.addEventListener('click', function() {
    DirProductModal.classList.add('active'); // Добавляем класс 'active'
});

CloseDirProduct.addEventListener('click', function() {
    DirProductModal.classList.remove('active'); // Убираем класс 'active'
});

window.addEventListener('click', function(event) {
    if (event.target === DirProductModal) {
        DirProductModal.classList.remove('active'); // Убираем класс 'active'
    }
});
/* end */

/* всплывающее окно с inf vers */
var INFModal = document.getElementById('INFModal');
var INFLink = document.getElementById('INFLink');
var CloseINF = document.getElementById('CloseINF');

INFLink.addEventListener('click', function() {
    INFModal.classList.add('active'); // Добавляем класс 'active'
});

CloseINF.addEventListener('click', function() {
    INFModal.classList.remove('active'); // Убираем класс 'active'
});

window.addEventListener('click', function(event) {
    if (event.target === INFModal) {
        INFModal.classList.remove('active'); // Убираем класс 'active'
    }
});
/* end */


});

document.getElementById('export-table-btn').addEventListener('click', function() {
    document.getElementById('export-table-form').submit();
});


