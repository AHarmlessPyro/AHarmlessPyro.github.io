//insert global variables in here
var lastYscrollPos = window.pageYOffset;





//functions start here

window.onscroll = function(){scrollfunction()}

function scrollfunction(){
	if(lastYscrollPos > scrollY){
		window.scrollto(0,this.lastYscrollPos + window.innerHeight);
		this.lastYscrollPos += window.innerHeight;
	}else{
		window.scrollto(0,this.lastYscrollPos - window.innerHeight);
		this.lastYscrollPos -= window.innerHeight;
	}
}
