
function InterceptionCounterTable() {
    var self = this;
    this.counters = null;

    this.html_countDay = $('#countDay');
    this.html_countWeek = $('#countWeek');
    this.html_countMonth = $('#countMonth');
    this.html_countTotal = $('#countTotal');

    this.setData = function(data){
        self.counters = data;
    };

    this.render = function(){
        self.html_countDay.text(self.counters.countDay);
        self.html_countWeek.text(self.counters.countWeek);
        self.html_countMonth.text(self.counters.countMonth);
        self.html_countTotal.text(self.counters.countTotal);
    };

    this.setDataAndRender = function(data){
        Promise.resolve(this.setData(data)).then(self.render());
    }
}



