document.addEventListener('DOMContentLoaded', function () {
    var reportRows = document.querySelectorAll('.report_row');
    var navigationItems = document.querySelectorAll('.content-podmenu li');
    var previousReportRow = null;
    var selectedReportId = null;
    var contextMenuReport = document.getElementById('contextMenu_report');
    var form = document.getElementById('change-category-form');
    var reportIdInput = document.getElementById('report-id-input');
    var actionInput = document.getElementById('action-input');

    function hideContextMenu() {
        contextMenuReport.style.display = 'none';
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
            if (previousReportRow !== null) {
                previousReportRow.classList.remove('active-report');
            }
            this.classList.add('active-report');
            previousReportRow = this;
        });

        row.addEventListener('dblclick', function() {
            var reportId = this.dataset.id;
            var url = "/report_area/fuel/" + reportId;
            window.location.href = url;
        });
    });

    navigationItems.forEach(function(item) {
        var action = item.dataset.action;
        if (action === 'not_viewed' || action === 'remarks' || action === 'to_download' || action === 'to_delete') {
            item.addEventListener('dragover', function(event) {
                event.preventDefault();
            });

            item.addEventListener('dragenter', function(event) {
                event.preventDefault(); // Предотвращаем действия по умолчанию
                if (action === 'to_delete') {
                    this.style.backgroundColor = '#fd0404'; // фон для элемента с data-action="to_delete"
                } else {
                    this.style.backgroundColor = '#51ff00';
                }
            });

            item.addEventListener('dragleave', function(event) {
                this.style.backgroundColor = ''; 
            });

            item.addEventListener('drop', function(event) {
                event.preventDefault();
                var reportId = event.dataTransfer.getData('text/plain');
                var action = this.dataset.action;

                reportIdInput.value = reportId;
                actionInput.value = action;

                form.submit();

                if (previousReportRow !== null) {
                    previousReportRow.classList.remove('active-report');
                    previousReportRow = null;
                }

                this.style.backgroundColor = ''; 
            });
        }
    });

    document.addEventListener('click', function(event) {
        if (!contextMenuReport.contains(event.target)) {
            hideContextMenu();
        }
    });

    hideContextMenu();
});
