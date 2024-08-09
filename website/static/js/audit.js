document.addEventListener('DOMContentLoaded', function () {
    var reportRows = document.querySelectorAll('.report_row');
    var navigationItems = document.querySelectorAll('.profile_navigation li');

    var previousReportRow = null;
    var selectedReportId = null;
    var contextMenuReport = document.getElementById('contextMenu_report');
    var form = document.getElementById('change-category-form');
    var reportIdInput = document.getElementById('report-id-input');
    var actionInput = document.getElementById('action-input');


    var showFilterButton = document.getElementById('show-filter');
    var filterSection = document.getElementById('filtr_section');

    showFilterButton.addEventListener('click', function () {
        if (filterSection.style.display === 'none' || filterSection.style.display === '') {
            filterSection.style.display = 'block';
        } else {
            filterSection.style.display = 'none';
        }
    });

    function filterTable() {
        const okpoValue = document.getElementById('okpo-filter').value.toLowerCase();
        const organizationValue = document.getElementById('organization-filter').value.toLowerCase();

        document.querySelectorAll('.report_row').forEach(row => {
            const okpoText = row.querySelector('#report_okpo') ? row.querySelector('#report_okpo').value.toLowerCase() : '';
            const organizationText = row.querySelector('#report_organization_name') ? row.querySelector('#report_organization_name').value.toLowerCase() : '';

            const okpoMatch = okpoText.includes(okpoValue);
            const organizationMatch = organizationText.includes(organizationValue);

            if (okpoMatch && organizationMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    document.getElementById('okpo-filter').addEventListener('input', filterTable);
    document.getElementById('organization-filter').addEventListener('input', filterTable);

    document.querySelectorAll('#status-reportList li').forEach(item => {
        item.addEventListener('click', function() {
            const action = this.getAttribute('data-action');         
            document.querySelectorAll('.report-area > div').forEach(container => {
                container.style.display = 'none';
            });
            
            const activeContainer = document.getElementById(action);
            if (activeContainer) {
                activeContainer.style.display = 'block';
            }
            
            document.querySelectorAll('#status-reportList li').forEach(li => {
                li.classList.remove('active_li');
            });
            
            this.classList.add('active_li');
        });
    });

    function hideContextMenu() {
        contextMenuReport.style.display = 'none';
    }

    function setDraggingState(isDragging) {
        var imgs = document.querySelectorAll('.count-img');
        var texts = document.querySelectorAll('.count-text');
    
        imgs.forEach((img, index) => {
            if (isDragging) {
                img.style.display = 'inline';
                texts[index].style.display = 'none';
            } else {
                img.style.display = 'none';
                texts[index].style.display = 'inline';
            }
        });
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
            this.classList.add('dragging');
            setDraggingState(true);
            if (previousReportRow !== null) {
                previousReportRow.classList.remove('active-report');
            }
            this.classList.add('active-report');
            previousReportRow = this;
        });

        row.addEventListener('dragend', function(event) {
            this.classList.remove('dragging');
            setDraggingState(false);
        });

        row.addEventListener('dblclick', function() {
            var reportId = this.dataset.id;
            var url = "/audit_area/report/" + reportId;
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
                this.classList.add('dragging');
            });

            item.addEventListener('dragleave', function(event) {
                event.preventDefault();
                this.classList.remove('dragging');
            });

            item.addEventListener('drop', function(event) {
                event.preventDefault();
                this.classList.remove('dragging');
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
        }
    });

    document.addEventListener('click', function(event) {
        if (!contextMenuReport.contains(event.target)) {
            hideContextMenu();
        }
    });

    hideContextMenu();
});

document.getElementById('douwnload_readyreports_link').addEventListener('click', function() {
    document.getElementById('douwnload_readyreports_form').submit();
});
