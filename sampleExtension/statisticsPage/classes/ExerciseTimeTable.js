
function ExerciseTimeTable(html_element) {
    var self = this;
    this.table = html_element;
    this.timeSpentData = null;

    this.setData = function(data){
        self.timeSpentData = data;
    };

    this.addToTable = function(tableRow) {
        html_element.append(tableRow);

    };

    this.generateExerciseTimeHtmlRow = function(dayStatistic) {
        var tableRow =
            $("<tr>" +
                "<td>"+dayStatistic.date+"</td>" +
                "<td>"+bg.dateUtil.secondsToHHMMSS(dayStatistic.timespent)+"</td>" +
                "</tr>");
        return tableRow;
    };

    this.createExerciseTimeTable = function(list) {
        list = list.reverse();
        $.each(list, function(key, value) {
            if(value != null){
                self.addToTable(self.generateExerciseTimeHtmlRow(value));
            }
        });
    };

    this.render = function(){
        self.createExerciseTimeTable(self.timeSpentData);
    };

    this.setDataAndRender = function(data){
        Promise.resolve(this.setData(data)).then(self.render());
    };
}



