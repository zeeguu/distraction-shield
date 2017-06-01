import {addBlockedSiteToStorage, removeBlockedSiteFromStorage, updateBlockedSiteInStorage, getBlacklistPromise} from '../../modules/storage'

/**
 * The table holding the blockedSites and all of its functionality.
 * Every row has the corresponding BlockedSite Object attached to it in order to have easy acces and manipulation.
 */
export default class BlacklistTable {
    //TODO remove sync & remove function
    constructor(html_element, syncFunction, removeFunction) {
        this.table = html_element;
        this.syncBlockedSiteListFunc = syncFunction;
        this.removeBlockedSiteFunc = removeFunction;

        this.setCheckboxFunction();
        this.setDeleteButtonFunction();
        this.enableTableSelection();
    }

    addToTable(tableRow) {
        tableRow.hide().appendTo(this.table).fadeIn();
    }

    removeFromTable(html_item) {
        html_item.fadeOut(function () {
            html_item.remove();
        });
    }

    getSelected() {
        return this.table.find('.highlight');
    }

    /**
     * this function makes the table single row selection only
     */
    enableTableSelection() {
        this.table.on('click', '.table-row', function () {
            let row = $(this);
            if (row.hasClass('highlight'))
                row.removeClass('highlight');
            else
                row.addClass('highlight').siblings().removeClass('highlight');
        });
    }

    /**
     * set functionality for all checkboxes found within the html_table
     */
    setCheckboxFunction() {
        this.table.on('change', 'input[type="checkbox"]', data => {
            //Clicking the checkbox automatically selects the row, so we use this to our advantage
            let clicked_checkbox = data.target;
            let selected_row = $(clicked_checkbox).parent().parent();
            let selected_blockedSite = selected_row.data('blockedSite');
            selected_blockedSite.checkboxVal = !selected_blockedSite.checkboxVal;
            //TODO
            chrome.extension.getBackgroundPage().console.log(selected_blockedSite);
            updateBlockedSiteInStorage(selected_blockedSite).then( () => {
                getBlacklistPromise().then(blacklist => {
                    chrome.extension.getBackgroundPage().console.log(blacklist);
                });
            });
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
            removeBlockedSiteFromStorage(blockedSiteToDelete);
            chrome.extension.getBackgroundPage().console.log(blockedSiteToDelete);
            //TODO remove these 2


            this.removeBlockedSiteFunc(rowToDelete);
            this.removeFromTable(rowToDelete);
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
                "<td width='25'>" + "<img class='delete-button' type='deleteButton' src='../optionsPage/classes/tableRow_delete_button.png' width='16' height='16'>" + "</td>" +
                "</tr>");
        tableRow.find('.checkbox-toggle').prop('checked', blockedSite.checkboxVal);
        //add the actual object to the html_element
        tableRow.data('blockedSite', blockedSite);
        return tableRow;
    }
}
