
function StatisticsStorage() {
    var self = this;

    this.getStatisticsData = function(){
        return self.getStorage(["tds_interceptCounter", "tds_interceptDateList"]);
    };

    // General function which is used to set items stored in the storage of the chrome api.
    this.setStorage = function(ind, data) {
        var newObj= {};
        newObj[ind] = data;
        chrome.storage.sync.set(newObj, function() {
            handleRuntimeError();
        })
    };

    // General function which is used to retrieve items stored in the storage of the chrome api.
    // This function returns a Promise, to account for possible delays which might exist between the requesting of
    // the things in the storage and the actual retrieving of it.
    this.getStorage = function(index){
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(index, function (output) {
                if (handleRuntimeError()) {
                    resolve(output);
                } else {
                    reject(Error("Data cannot be found."));
                }
            })
        });
    };
}

var statsStorage = new StatisticsStorage();
