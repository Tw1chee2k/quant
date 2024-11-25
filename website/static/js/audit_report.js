document.addEventListener('DOMContentLoaded', function() {
    var urladdComment_modal = new URLSearchParams(window.location.search);
    if (urladdComment_modal.get('addCommentModal') === 'true') {
        var addCommentModal = document.getElementById('addCommentModal');
        if (addCommentModal) {
            addCommentModal.style.display = 'block';
        }
    }

    /* всплывающее окно с респондентом */
    /* модальное окно показа комментариев */
    /* модальное окно добавления комментария */
    /* всплывающее окно с единицами измерения */
    /* всплывающее окно с продуктами */
    /* всплывающее окно с inf vers */

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

    handleModal(document.getElementById('RespondentModal'), document.getElementById('RespondentLink'), document.getElementById('CloseRespondent'));
    handleModal(document.getElementById('addCommentModal'), document.getElementById('addCommentLink'), document.getElementById('CloseaddComment'));
    handleModal(document.getElementById('showCommentsModal'), document.getElementById('showCommentsLink'), document.getElementById('CloseshowComments'));
    handleModal(document.getElementById('DirUnitModal'), document.getElementById('DirUnitLink'), document.getElementById('CloseDirUnit'));
    handleModal(document.getElementById('DirProductModal'), document.getElementById('DirProductLink'), document.getElementById('CloseDirProduct'));
    handleModal(document.getElementById('INFModal'), document.getElementById('INFLink'), document.getElementById('CloseINF'));
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

    var section_row = document.querySelectorAll('.section_row');
    var previousfuelRow = null;
    var selectedfuelId = null;

    section_row.forEach(function(row, index) {
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
});

document.getElementById('export-table-btn').addEventListener('click', function() {
    document.getElementById('export-table-form').submit();
});


