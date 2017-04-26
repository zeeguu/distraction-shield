
function BlacklistStatsTable(html_element) {
    var self = this;
    this.table = html_element;
    this.blacklist = null;

    this.setData = function(data){
        self.blacklist = data;
    };

    this.createBlockedSiteTable = function(siteList){
        $.each(siteList, function(k, site) {
            self.table.append(self.generateTableRow(site));
        });
    };

    this.generateTableRow = function(site) {
        var row =
            $("<tr class='table-row' >" +
                "<td>"+site.getIcon()+"</td>" +
                "<td>"+site.getName()+"</td>" +
                "<td>"+site.getCounter()+"</td>" +
                "<td>"+bg.dateUtil.secondsToHHMMSS(site.getTimeSpent())+"</td>" +
                "</tr>");
        return row;
    };

    this.render = function(){
        self.createBlockedSiteTable(self.blacklist);
    };

    this.setDataAndRender = function(data){
        Promise.resolve(this.setData(data)).then(self.render());
    };
}



