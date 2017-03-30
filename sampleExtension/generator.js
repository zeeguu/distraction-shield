/** Modular Zeeguu Exercise Generator @authors Martin Avagyan, Vlad Turbureanu
 *  @initialize it using: new Generator(args); 
 *  @param args is matrix of exercise name and number of bookmarks,
 *         example: [[1,3],[2,4]] 3 bookmarks for ex1 and 4 bookmarks for ex2
 *  @customize it by using prototypal inheritance 
**/
Generator = function(set){
	this.init(set);
};

Generator.prototype = {
	/************************** SETTINGS ********************************/	
	data: 0,		//bookmakrs from zeeguu api
	set: 0,			//matrix for initialaizer
	size: 0,		//total count of bookmakrs
	index: 0,		//current index from set
	startTime: 0,	
	session: 34563456  , //for now hardcoded session number 34563456 or 11010001
	bookmarksURL: "https://zeeguu.unibe.ch/api/bookmarks_to_study/",
	templateURL: 'static/template/exercise.html',	
	submitResutsUrl: "https://www.zeeguu.unibe.ch/api/report_exercise_outcome/Too easy/Recognize/1000/",

	
	/**
	*	Saves the common dom in chache
	**/
	cacheDom: function(){
		this.$elem 				= $("#ex-module");		
		this.$container  		= this.$elem.find("#ex-container");
		this.$loader 			= this.$elem.find('#loader');
	},
	
	/**
	*	Generator initialaizer
	**/
	init: function(set){		
		this.set = set;
		var _this = this;	
		
		// "bind" event
		this.$eventFunc = function(){_this.nextEx()};		
		events.on('exerciseCompleted',this.$eventFunc);
		
		// Create the DOM and initialize
		$.when(this.createDom()).done(function(){
			_this.cacheDom();
			_this.start();			
		});
	},	
	
	
	restart: function(){
		this.start();
	},
	
	/**
	*	Call to load the data from API
	**/
	start: function ()
	{
		var _this = this;
		this.size = this.calcSize(this.set,this.set.length);			
		ProgressBar.init(0,this.size);
		$.when(this.getBookmarks()).done(function (ldata) {		
			_this.data = (ldata); 												
			_this._constructor();	
		});			
	},
	
	filterArray: function(bookmarksData)
	{		
		for(var i = 0; i< bookmarksData.length;i++){
			var tempIdx = indexOf(bookmarksData[i]);
			if(tempIdx == -1 || tempIdx == i){
				continue;
			}
			bookmarksData.splice(i, 1);
		}
		console.log(bookmarksData);
		return bookmarksData;
	},
		
	
	/**
	*	The main constructor
	**/
	_constructor: function (){			
		this.index = 0;		
		this.startTime = new Date();			
		this.nextEx();
	},
	
	/**
	*	Add Ex here
	**/
	nextEx: function(){
		if(this.index === this.set.length){
			this.onExSetComplete();
			return;
		}
		var ex = this.set[this.index][0];
		var size = this.set[this.index][1];
		var startingIndex = this.calcSize(this.set,this.index);
		
		this.$currentEx = null;
		delete this.$currentEx;
		switch(ex) {
			case 1:
				this.$currentEx = new Ex1(this.data,startingIndex,size);
				break;
			case 2:
				this.$currentEx = new Ex2(this.data,startingIndex,size);
				break;
			case 3:
				this.$currentEx = new Ex3(this.data,startingIndex,size);
				break;
			case 4:
				this.$currentEx = new Ex4(this.data,startingIndex,size);
				break;
		}
		
		this.index++;
	},
	
	calcSize: function(set,length){
		var sum = 0;
		for(var i = 0; i<length; i++){
		  sum += set[i][1];
		}
		return sum;
			
	},
	
	/**
	*	Request the submit API
	**/
	submitResults: function(){
		for(var i = 0; i< this.data.length;i++){
			$.post(this.submitResutsUrl+this.data[i].id+"?session="+this.session);		

		}
	},
	
	/**
	*	Check selected answer with success condition
	**/
	calcSessionTime: function (){
		var endTime = new Date();
		var total = endTime.getMinutes()-this.startTime.getMinutes();
		return (total <= 1)?"1 minute":total + " minutes";
	},
	
	/**
	*	When the ex are done perform an action
	**/
	onExSetComplete: function (){
		var _this = this;
		var redirect = _this.distractionShield();
		swal({
			  title: "You rock!",
			  text: "That took less than "+ _this.calcSessionTime() + ". practice more?",
			  type: "success",
			  showCancelButton: true,
			  confirmButtonColor: "#7eb530",
			  confirmButtonText: "Let's do it!",
			  cancelButtonText: redirect!=null?"Take me away!":"Go home!",
			  closeOnConfirm: true
			},
			function(isConfirm){
				if(isConfirm){					
					_this.restart();
					return;
				}				
				_this.terminateGenerator();
				if (redirect!=null) {
				    window.location = redirect;
				}
			});
	},
	
	terminateGenerator: function(){
		events.off('exerciseCompleted',this.$eventFunc);
		events.emit('generatorCompleted');
	},
	/**
	*	Loads the HTML general exercise template from static
	**/
	createDom: function(){
		var _this = this;
		return $.ajax({	  
		  type: 'GET',
		  dataType: 'html',
		  url: _this.templateURL,
		  data: this.data,
		  success: function(data) {
			$("#main-content").html(data);	
		  },
		  async: true
		});
	},
	
	
	/**
	*	Ajax get request to the Zeeguu API to get new bookmarks
	**/
	getBookmarks: function(){
		var _this = this;
		this.loadingAnimation(true);
		address = this.bookmarksURL+this.size+"?session="+this.session;
		return $.ajax({	  
		  type: 'GET',
		  dataType: 'json',
		  url: address,
		  data: this.data,
		  success: function(data) {
			_this.loadingAnimation(false);
		  },
		  async: true
		});
	},
	
	/**
	*	Animation used for loading
	**/
	loadingAnimation: function(activate){	
		if(activate === true){			
			this.$container.addClass('hide');
			this.$loader.removeClass('hide');
		}else{
			this.$container.removeClass('hide');
			this.$loader.addClass('hide');
		}
	},

	/**
	*   Extraction of url for Distraction Shield redirect
	**/
	distractionShield: function() {
        url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]redirect(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
        if (!results || !results[2]) return null;
        return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
}	
