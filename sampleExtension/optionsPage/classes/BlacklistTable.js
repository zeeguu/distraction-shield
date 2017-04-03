
function BlacklistTable (html_element) {
    var self = this;
    this.table = html_element;

    this.addToTable = function(tableRow) {
        this.table.append(tableRow);
    };

    this.getSelected = function() {
        return this.table.find('.selected');
    };

    this.removeSelected = function() {
        this.getSelected().remove();
    };

    this.removeFromTable = function (html_item) {
        html_item.remove();
    };

    this.sortTableOnChecked = function () {
        var rows = this.table.find('tr').get();
        rows.sort(function (checkboxA, checkboxB) {
            var valueOfA = $(checkboxA).find('.checkbox-toggle')["0"].checked;
            var valueOfB = $(checkboxB).find('.checkbox-toggle')["0"].checked;
            if (valueOfA && !valueOfB)
                return -1;
            if (!valueOfA && valueOfB)
                return 1;
            return 0;
        });
        $.each(rows, function (index, row) {
            self.table.append(row);
        });
    };

    // this function makes the passed table single row selection only
    this.enableTableSelection = function () {
        this.table.on('click', 'tr', function () {
            var row = $(this);
            if (row.hasClass('selected'))
                row.removeClass('selected');
            else
                row.addClass('selected').siblings().removeClass('selected');
        });
    };

    // set functionality for all checkboxes found within the html_table
    this.setCheckboxFunction = function () {
        this.table.on('change', 'input[type="checkbox"]', function () {
            //Clicking the checkbox automatically selects the row, so we use this to our advantage
            var selected_row = self.table.find('.selected');
            var selected_blockedSite = selected_row.data('blockedSite');
            selected_blockedSite.setCheckboxVal(!selected_blockedSite.getCheckboxVal());
            //no need to set localBlacklist cause it holds pointers so they get updated automatically
            synchronizer.syncBlacklist(blacklist);
        });
    };

    // if a delete button is clicked, the closest tr element is deleted.
    this.setDeleteButtonFunction = function () {
        this.table.on('click', '.delete-button', function () {
            var rowToDelete = $(this).closest('tr');
            removeBlockedSiteFromAll(rowToDelete);
        });
    };

    //Returns an html table row object
    this.generateTableRow = function (blockedSite) {
        var tableRow =
            $("<tr class='table-row' >" +
                "<td width='50'>" + blockedSite.getIcon ()+ "</td>" +
                "<td class='pageTitle' width='480'>" + blockedSite.getName() + "</td>" +
                "<td width='25'>" + "<input class='checkbox-toggle' type=\"checkbox\" name=\"state\">" + "</td>" +
                "<td width='25'>" + "<img class='delete-button' type='deleteButton' src='classes/tableRow_delete_button.png' width='16' height='16'>" + "</td>" +
                "</tr>");
        tableRow.find('.checkbox-toggle').prop('checked', blockedSite.getCheckboxVal());
        //add the actual object to the html_element
        tableRow.data('blockedSite', blockedSite);
        return tableRow;
    };

    this.enableTableSelection();
    this.setCheckboxFunction();
    this.setDeleteButtonFunction();
}



