//insert global variables in here
var lastYscrollPos = window.pageYOffset;

//functions start here

//window.onscroll = function(){scrollfunction()}

function scrollfunction(){
	alert("last windows position was "+lastYscrollPos+" scrollY was "+scrollY);
	alert("Value of check was "+(lastYscrollPos>scrollY));
	if(lastYscrollPos > scrollY){
		window.scrollTo(0,this.lastYscrollPos - window.innerHeight);
		this.lastYscrollPos -= window.innerHeight;
	}else{
		window.scrollTo(0,this.lastYscrollPos + window.innerHeight);
		this.lastYscrollPos += window.innerHeight;
	}
}
