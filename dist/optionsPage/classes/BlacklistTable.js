'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _synchronizer = require('../../modules/synchronizer');

var synchronizer = _interopRequireWildcard(_synchronizer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BlacklistTable = function () {
    function BlacklistTable(html_element, syncFunction, removeFunction) {
        _classCallCheck(this, BlacklistTable);

        this.table = html_element;
        this._syncBlockedSiteListFunc = syncFunction;
        this._removeBlockedSiteFunc = removeFunction;

        this.setCheckboxFunction();
        this.setDeleteButtonFunction();
        this.enableTableSelection();
    }

    _createClass(BlacklistTable, [{
        key: 'addToTable',
        value: function addToTable(tableRow) {
            tableRow.hide().appendTo(this.table).fadeIn();
        }
    }, {
        key: 'removeFromTable',
        value: function removeFromTable(html_item) {
            html_item.fadeOut(function () {
                html_item.remove();
            });
        }
    }, {
        key: 'getSelected',
        value: function getSelected() {
            return this.table.find('.highlight');
        }
    }, {
        key: 'enableTableSelection',


        //this function makes the passed table single row selection only
        value: function enableTableSelection() {
            this.table.on('click', '.table-row', function () {
                var row = $(this);
                if (row.hasClass('highlight')) row.removeClass('highlight');else row.addClass('highlight').siblings().removeClass('highlight');
            });
        }
    }, {
        key: 'setCheckboxFunction',


        // set functionality for all checkboxes found within the html_table
        value: function setCheckboxFunction() {
            this.table.on('change', 'input[type="checkbox"]', function () {
                //Clicking the checkbox automatically selects the row, so we use this to our advantage
                var selected_row = $(this).parent().parent();
                var selected_blockedSite = selected_row.data('blockedSite');
                selected_blockedSite.checkboxVal = !selected_blockedSite.checkboxVal;
                //no need to set localBlacklist cause it holds pointers so they get updated automatically
                this.blacklistTable._syncBlockedSiteListFunc();
            });
        }
    }, {
        key: 'setDeleteButtonFunction',


        // if a delete button is clicked, the closest tr element is deleted.
        value: function setDeleteButtonFunction() {
            this.table.on('click', '.delete-button', function () {
                var rowToDelete = $(this).closest('tr');
                this.blacklistTable._removeBlockedSiteFunc(rowToDelete);
                this.blacklistTable.removeFromTable(rowToDelete);
            });
        }
    }, {
        key: 'generateTableRow',


        //Returns an html table row object
        value: function generateTableRow(blockedSite) {
            var tableRow = $("<tr class='table-row' >" + "<td width='50'>" + blockedSite.icon + "</td>" + "<td class='pageTitle'>" + blockedSite.name + "</td>" + "<td width='25'>" + "<input class='checkbox-toggle' type='checkbox' name='state'>" + "</td>" + "<td width='25'>" + "<img class='delete-button' type='deleteButton' src='../optionsPage/classes/tableRow_delete_button.png' width='16' height='16'>" + "</td>" + "</tr>");
            tableRow.find('.checkbox-toggle').prop('checked', blockedSite.checkboxVal);
            tableRow.find('.delete-button').prop('blacklistTable', this);
            tableRow.find('.checkbox-toggle').prop('blacklistTable', this);
            //add the actual object to the html_element
            tableRow.data('blockedSite', blockedSite);
            return tableRow;
        }
    }]);

    return BlacklistTable;
}();

exports.default = BlacklistTable;