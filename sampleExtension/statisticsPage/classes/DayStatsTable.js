
function DayStatsTable(html_element) {
    var self = this;
    this.table = html_element;
    this.timeSpentData = null;

    this.setData = function(data){
        self.timeSpentData = data;
    };

    this.addToTable = function(tableRow) {
        html_element.append(tableRow);

    };

    this.generateDayStatisticHtmlRow = function(dayStatistic) {
        var tableRow =
            $("<tr>" +
                "<td>"+dayStatistic.date+"</td>" +
                "<td>"+bg.dateUtil.secondsToHHMMSS(dayStatistic.timespent)+"</td>" +
                "</tr>");
        //add the actual object to the html_element
        return tableRow;
    };

    this.createDayStatisticsTable = function(list) {
        list = list.reverse();
        $.each(list, function(key, value) {
            if(value != null){
                self.addToTable(self.generateDayStatisticHtmlRow(value));
            }
        });
    };

    this.render = function(){
        self.createDayStatisticsTable(self.timeSpentData);
    };

    this.setDataAndRender = function(data){
        Promise.resolve(this.setData(data)).then(self.render());
    };
}



