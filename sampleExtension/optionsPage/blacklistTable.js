
function BlacklistTable (html_element) {
    this.table = html_element;
    var self = this;

    this.addToTable = function(tableRow) {
        this.table.append(tableRow);
    };

    this.getSelected = function() {
        return this.table.find('.selected');
    };

    this.removeSelected = function() {
        this.getSelected().remove();
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

    // this function makes the table single row selectable
    this.enableTableSelection = function () {
        this.table.on('click', 'tr', function () {
            $(this).addClass('selected').siblings().removeClass('selected');
        });
    };

    // set functionality for all checkboxes found within the html_table
    this.setCheckboxFunction = function () {

        this.table.on('change', 'input[type="checkbox"]', function () {
            //Clicking the checkbox automatically selects the row, so we use this to our advantage
            var selected_row = self.table.find('.selected');
            var selected_blockedSite = selected_row.data('blockedSite');
            selected_blockedSite.checkboxVal = !selected_blockedSite.checkboxVal;
            //no need to set links cause it holds pointers so they get updated automatically
            updateStorageBlacklist();
        });
    };

    this.initTable = function () {
        this.enableTableSelection();
        this.setCheckboxFunction();
    };

}

//Returns an html table row object
generateTableRow = function (blockedSite) {
    var tableRow =
        $("<tr class='table-row' >" +
            "<td>" + blockedSite.icon + "</td>" +
            "<td>" + blockedSite.name + "</td>" +
            "<td>" + "<input class='checkbox-toggle' type=\"checkbox\" name=\"state\">" + "</td>" +
            "</tr>");
    tableRow.find('.checkbox-toggle').prop('checked', blockedSite.checkboxVal);
    //add the actual object to the html_element
    tableRow.data('blockedSite', blockedSite);
    return tableRow;
};