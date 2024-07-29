document.addEventListener('DOMContentLoaded', function () {
    var reportRows = document.querySelectorAll('.report_row');
    var navigationItems = document.querySelectorAll('.content-podmenu li');
    var sortButton = document.querySelector('.functions_menu li[onclick="sortTable()"]');
    var previousReportRow = null;
    var selectedReportId = null;
    var contextMenuReport = document.getElementById('contextMenu_report');
    var form = document.getElementById('change-category-form');
    var reportIdInput = document.getElementById('report-id-input');
    var actionInput = document.getElementById('action-input');

    function hideContextMenu() {
        contextMenuReport.style.display = 'none';
    }

    function addDraggingClass(el) {
        el.classList.add('dragging');
    }

    function removeDraggingClass(el) {
        el.classList.remove('dragging');
    }

    reportRows.forEach(function(row) {
        row.addEventListener('click', function() {
            if (this.dataset.id) {
                selectedReportId = this.dataset.id;
                if (this.classList.contains('active-report')) {
                    this.classList.remove('active-report');
                    previousReportRow = null;
                } else {
                    if (previousReportRow !== null) {
                        previousReportRow.classList.remove('active-report');
                    }
                    this.classList.add('active-report');
                    previousReportRow = this;
                }
                hideContextMenu();
            }
        });

        row.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            if (this.dataset.id) {
                selectedReportId = this.dataset.id;

                if (previousReportRow !== null) {
                    previousReportRow.classList.remove('active-report');
                }
                this.classList.add('active-report');
                previousReportRow = this;

                contextMenuReport.style.top = event.clientY + 'px';
                contextMenuReport.style.left = event.clientX + 'px';
                contextMenuReport.style.display = 'flex';
            }
        });

        row.addEventListener('dragstart', function(event) {
            event.dataTransfer.setData('text/plain', this.dataset.id);
            addDraggingClass(this);
            if (previousReportRow !== null) {
                previousReportRow.classList.remove('active-report');
            }
            this.classList.add('active-report');
            previousReportRow = this;
        });

        row.addEventListener('dragend', function(event) {
            removeDraggingClass(this);
        });

        row.addEventListener('dblclick', function() {
            var reportId = this.dataset.id;
            var url = "/audit/fuel/" + reportId;
            window.location.href = url;
        });
    });

    navigationItems.forEach(function(item) {
        var action = item.dataset.action;
        if (['not_viewed', 'remarks', 'to_download', 'to_delete'].includes(action)) {
            item.addEventListener('dragover', function(event) {
                event.preventDefault();
            });

            item.addEventListener('dragenter', function(event) {
                event.preventDefault();
                addDraggingClass(this); // Добавить стиль для перетаскивания
            });

            item.addEventListener('dragleave', function(event) {
                event.preventDefault();
                removeDraggingClass(this); // Убрать стиль для перетаскивания
            });

            item.addEventListener('drop', function(event) {
                event.preventDefault();
                removeDraggingClass(this);
                var reportId = event.dataTransfer.getData('text/plain');
                var action = this.dataset.action;

                reportIdInput.value = reportId;
                actionInput.value = action;

                form.submit();

                if (previousReportRow !== null) {
                    previousReportRow.classList.remove('active-report');
                    previousReportRow = null;
                }
            });

            item.addEventListener('mouseover', function() {
                // Удалено затемнение элементов
            });

            item.addEventListener('mouseout', function() {
                // Удалено затемнение элементов
            });
        }
    });

    if (sortButton) {
        sortButton.addEventListener('mousedown', function() {
            // Удалено затемнение элементов
        });

        sortButton.addEventListener('mouseup', function() {
            // Удалено затемнение элементов
        });
    }

    document.addEventListener('click', function(event) {
        if (!contextMenuReport.contains(event.target)) {
            hideContextMenu();
        }
    });

    hideContextMenu();
});
