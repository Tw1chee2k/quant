document.addEventListener('DOMContentLoaded', function () {
    var reportRows = document.querySelectorAll('.report_row');
    var navigationItems = document.querySelectorAll('.menu_profile_audit li');

    var previousReportRow = null;
    var selectedReportId = null;
    var contextMenuReport = document.getElementById('contextMenu_report');
    var form = document.getElementById('change-category-form');
    var reportIdInput = document.getElementById('report-id-input');
    var actionInput = document.getElementById('action-input');

    var showFilterButton = document.getElementById('show-filter');
    var filterSection = document.getElementById('filtr_section');


    showFilterButton.addEventListener('click', function () {
        filterSection.classList.toggle('active');
        
        if (filterSection.classList.contains('active')) {
            showFilterButton.classList.add('activefunctions_menu');
        } else {
            showFilterButton.classList.remove('activefunctions_menu');
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

            row.style.display = okpoMatch && organizationMatch ? '' : 'none';
        });
    }


    document.getElementById('okpo-filter').addEventListener('input', filterTable);
    document.getElementById('organization-filter').addEventListener('input', filterTable);


    function hideContextMenu() {
        contextMenuReport.style.display = 'none';
    }

    function setDraggingState(isDragging) {
        var imgs = document.querySelectorAll('.count-img');
        var texts = document.querySelectorAll('.count-text');
        
        var with_remarks = document.querySelector('li[data-action="remarks"]');
        var to_conf = document.querySelector('li[data-action="to_download"]');
        var to_del = document.querySelector('li[data-action="to_delete"]');
    
        imgs.forEach((img, index) => {
            texts[index].style.display = isDragging ? 'none' : 'inline';
            
            with_remarks.style.background = isDragging ? 'rgba(255, 186, 96)' : '';
            to_conf.style.background = isDragging ? 'rgb(96, 255, 122)' : '';
            to_del.style.background = isDragging ? 'rgb(255, 96, 96)' : '';

            const colorStyle = isDragging ? 'black' : '';
            with_remarks.style.color = colorStyle;
            to_conf.style.color = colorStyle;
            to_del.style.color = colorStyle;

            const paddingStyle = isDragging ? '20px 50px' : '';
            with_remarks.style.padding = paddingStyle;
            to_conf.style.padding = paddingStyle;
            to_del.style.padding = paddingStyle;

            const marginStyle = isDragging ? '0' : '';
            with_remarks.style.marginBottom = marginStyle;
            to_conf.style.marginBottom = marginStyle;
            to_del.style.marginBottom = marginStyle;
        });
    }


    function setDraggingStatetoNonread(isDragging) {
        var imgs = document.querySelectorAll('.count-img');
        var texts = document.querySelectorAll('.count-text');
        
        var not_read = document.querySelector('li[data-action="not_viewed"]');
        imgs.forEach((img, index) => {
            texts[index].style.display = isDragging ? 'none' : 'inline';
            
            const draggingStyle = isDragging ? 'rgb(96, 255, 122)' : '';
            not_read.style.background = draggingStyle;

            const colorStyle = isDragging ? 'black' : '';
            not_read.style.color = colorStyle;

            const paddingStyle = isDragging ? '20px 50px' : '';
            not_read.style.padding = paddingStyle;

            const marginStyle = isDragging ? '0' : '';
            not_read.style.marginBottom = marginStyle;
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
            var reportId = this.dataset.id; 
            var fifthColumnValue = this.children[5].querySelector('input').value;

            if (fifthColumnValue === 'Не просмотрено') {
                event.dataTransfer.setData('text/plain', reportId);
                this.classList.add('dragging');
                setDraggingState(true);
            } else {
                event.preventDefault();
            }
            
            if (previousReportRow !== null) {
                previousReportRow.classList.remove('active-report');
            }
            this.classList.add('active-report');
            previousReportRow = this;
          
        });
        
        row.addEventListener('dragend', function(event) {
            this.classList.remove('dragging');
            setDraggingState(false);
            setDraggingStatetoNonread(false);
        });

        row.addEventListener('dblclick', function() {
            var reportId = this.dataset.id;
            var url = "/audit_area/report/" + reportId;
            window.location.href = url;
        });
    });

    navigationItems.forEach(function(item) {
        var action = item.dataset.action;
        if (['remarks', 'to_download', 'to_delete'].includes(action)) {
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
            
                var activeReport = document.querySelector('.active-report');
                if (activeReport && activeReport.dataset.id === reportId) {
                    reportIdInput.value = reportId;
                    actionInput.value = action;
                    
                    form.submit();
                 
                }
            
                if (previousReportRow !== null) {
                    previousReportRow.classList.remove('active-report');
                    previousReportRow = null;
                }
            });
            
        }
    });

/*proverka comment modal*/
var ChooseAudit_modal = document.getElementById('ChooseAuditModal');
var close_ChooseAudit_modal = ChooseAudit_modal.querySelector('.close');

close_ChooseAudit_modal.addEventListener('click', function() {
    ChooseAudit_modal.style.display = 'none';

});

ChooseAudit_modal.addEventListener('click', function(event) {
    if (event.target === ChooseAudit_modal) {
        ChooseAudit_modal.style.display = 'none';
    }
});
/*end*/

    

    document.addEventListener('click', function(event) {
        if (!contextMenuReport.contains(event.target)) {
            hideContextMenu();
        }
    });

    hideContextMenu();
});

document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.menu_profile_audit li[data-action]');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active_li'));
            item.classList.add('active_li');
            
            const action = item.getAttribute('data-action');
            window.location.href = `/audit_area/${action}?year=${getQueryParam('year')}&quarter=${getQueryParam('quarter')}`;
        });
    });
    
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param) || '';
    }
    
    const currentAction = window.location.pathname.split('/').pop();
    navItems.forEach(item => {
        if (item.getAttribute('data-action') === currentAction) {
            item.classList.add('active_li');
        }
    });
});

document.getElementById('douwnload_readyreports_link').addEventListener('click', function() {
    document.getElementById('douwnload_readyreports_form').submit();
});

window.onload = function() {
    document.getElementById('url-input').value = window.location.href;
};



