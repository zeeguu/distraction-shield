export default class BasicTable {
    constructor(html_element) {
        this._html_element = html_element;
        this._data = null;
    }

    setData(data) {
        this._data = data;
    }

    createTable(data) {
        this._html_element.append(data.map(this.generateTableRow));
    }

    generateTableRow(dataElement) {
        return $("<tr class='table-row'></tr>");
    }

    render() {
        this.createTable(this._data);
    }

    setDataAndRender(data) {
        Promise.resolve(this.setData(data)).then(this.render());
    }
}