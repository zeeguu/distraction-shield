export default class BasicTable {
    constructor(html_element) {
        this._html_element = html_element;
    }

    createTable(data) {
        this._html_element.find('tr:not(:has(th))').remove();
        this._html_element.append(data.map(this.generateTableRow));
    }

    generateTableRow(dataElement) {
        return $("<tr class='table-row'></tr>");
    }

    render(data) {
        this.createTable(data);
    }
}