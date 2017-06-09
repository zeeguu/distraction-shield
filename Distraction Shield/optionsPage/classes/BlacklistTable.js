import {removeBlockedSiteFromStorage, updateBlockedSiteInStorage} from '../../modules/storage/storageModifier'
import {logToFile} from '../../modules/logger'
import * as constants from '../../constants.js'

/**
 * The table holding the blockedSites and all of its functionality.
 * Every row has the corresponding BlockedSite Object attached to it in order to have easy acces and manipulation.
 */
export default class BlacklistTable {
    constructor(html_element) {
        this.table = html_element;
        this.setCheckboxFunction();
        this.setDeleteButtonFunction();
    }

    addToTable(tableRow) {
        tableRow.appendTo(this.table);
    }

    addToTableWithFadeIn(tableRow) {
        tableRow.hide().appendTo(this.table).fadeIn();
    }

    removeAllFromTable(){
        this.table.find('tr:not(:has(th))').remove();
    }

    /**
     * this function removes all table rows, compares the old list with the new list and fades in new elements.
     * @param newList {BlockedSiteList} the new list of blockedsites
     * @param oldList {BlockedSiteList} the old list of blockedsites
     */
    render(newList, oldList){
        this.removeAllFromTable();
        newList.forEach((value, key) => {
            if (key in oldList)
                this.addToTable(this.generateTableRow(value));
            else
                this.addToTableWithFadeIn(this.generateTableRow(value));
        });
    }


    /**
     * set functionality for all checkboxes found within the html_table
     */
    setCheckboxFunction() {
        this.table.on('change', 'input[type="checkbox"]', data => {
            //Clicking the checkbox automatically selects the row, so we use this to our advantage
            let clicked_checkbox = data.target;
            let selected_row = $(clicked_checkbox).closest('tr');
            let selected_blockedSite = selected_row.data('blockedSite');
            selected_blockedSite.checkboxVal = !selected_blockedSite.checkboxVal;
            logToFile(constants.logEventType.changed, selected_blockedSite.name, (selected_blockedSite.checkboxVal ? 'enabled' : 'disabled'), constants.logType.settings);
            updateBlockedSiteInStorage(selected_blockedSite);
        });
    }

    /**
     *  if a delete button is clicked, the closest tr element is deleted.
     */
    setDeleteButtonFunction() {
        this.table.on('click', '.delete-button', data => {
            let clicked_button = data.target;
            let rowToDelete = $(clicked_button).closest('tr');
            let blockedSiteToDelete = rowToDelete.data('blockedSite');
            rowToDelete.fadeOut(() => removeBlockedSiteFromStorage(blockedSiteToDelete));
        });
    }

    /**
     * Takes a BlockedSiteObject and constructs a table row from it, together with attaching this item to the row.
     * @param {BlockedSite} blockedSite the item for which we want to construct a TableRow
     * @returns Table row to be inserted into the table.
     */
    generateTableRow(blockedSite) {
        let tableRow =
            $("<tr class='table-row' >" +
                "<td width='50'>" + blockedSite.icon + "</td>" +
                "<td class='pageTitle'>" + blockedSite.name + "</td>" +
                "<td width='25'>" + "<input class='checkbox-toggle' type='checkbox' name='state'>" + "</td>" +
                "<td width='25'>" + "<img class='delete-button' type='deleteButton' src='/assets/images/tableRow_delete_button.png' width='16' height='16'>" + "</td>" +
                "</tr>");
        tableRow.find('.checkbox-toggle').prop('checked', blockedSite.checkboxVal);
        //add the actual object to the html_element
        tableRow.data('blockedSite', blockedSite);
        return tableRow;
    }
}
