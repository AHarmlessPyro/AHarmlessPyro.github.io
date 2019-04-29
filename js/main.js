//insert global variables in here
var lastYscrollPos = window.pageYOffset;

//functions start here

const emptyEntry = [""," "];

function dieValueEntry(){
	var listOfEntries = new Map();
	if ((!(emptyEntry.includes(document.getElementById("runCount").value))) &&
	   (!(emptyEntry.includes(document.getElementById("diceCount").value))) &&
	   (!(emptyEntry.includes(document.getElementById("diceSize").value)))){
		var rerolls = new Set(document.getElementById("rerollOn").value.split(/,|;/).filter(num => num != "")); // remove any stray empty strings and multiple occurances
		var rerollsNew = [];
		rerolls.forEach(num => rerollsNew.push(parseInt(num)));
		console.log(rerollsNew);
		var rerollCount = document.getElementById("rerollCount").value;
		if(!(emptyEntry.includes(document.getElementById("diceDrop").value))){			
			delegate(listOfEntries,(document.getElementById("runCount").value),(document.getElementById("diceCount").value),(document.getElementById("diceSize").value),(document.getElementById("diceDrop").value),rerollsNew,rerollCount);
		}else{
			delegate(listOfEntries,(document.getElementById("runCount").value),(document.getElementById("diceCount").value),(document.getElementById("diceSize").value),0,rerollsNew,rerollCount);
		}
		console.log("Printing entries");
		console.log(listOfEntries);
		for (var key in listOfEntries){
			console.log("" + key.toString());
			alert(key);
			console.log("" + key + " : " + listOfEntries[key]);
		}		
	}		
}

function delegate(listOfEntries,runs,dice,size,drops,rerolls,rerollCount){
	for(var i = 0; i < runs;i++){
		var diceRolls = rollDice(dice,size,drops,rerolls,rerollCount);
		console.log("Entring number " + diceRolls.toString());
		if(listOfEntries.has(diceRolls)){
			console.log("Key exists" + diceRolls.toString());
			listOfEntries.set(diceRolls,listOfEntries.get(diceRolls) + 1);
		}else{
			console.log("Key doesn't exists" + diceRolls.toString());
			listOfEntries.set(diceRolls,1);
		}
	}
}

function rollDice(diceCount,diceSize,drops = 0,rerollOn = [0],rerollCount = 0){
	var list_ret = [];
	for (i = 0;i < diceCount; i++){
		list_ret.push(Math.floor(Math.random() * (diceSize)) + 1); // generate value from 1 to diceSize
	}	
	var rerolls = 0;
	for (var i = 0;(i < diceCount) &&(rerolls <= rerollCount); i++){		
		if(list_ret[i] in rerollOn){
			rerolls++;
			console.log("Rerolling" + list_ret[i]);
			list_ret[i] = Math.floor(Math.random() * (diceSize)) + 1;
		}
	}
	list_ret.sort(function(a, b){return b - a});
	var totalDrops = 0;
	if (list_ret.length - drops >= 1){
		totalDrops = drops;
	}else{
		throw RangeError;
	}
	console.log("Slicing list");
	//debugger;
	console.log(list_ret);
	console.log(list_ret.slice(0,list_ret.length - totalDrops));
	var lst = list_ret.slice(0,list_ret.length - totalDrops );
	console.log("Dropping " + (list_ret.length - drops ));
	console.log(lst);
	return lst;
}

function sanitize(){
	var regex = /^\d+[,;]?(\d+[,;]?)*$/;
	var string = document.getElementById("rerollOn").value;
	console.clear();
	console.log(regex.test(string));
	if(regex.test(string)){
		console.log("Input is fine");
	}else{
		console.log("Input error");
		document.getElementById("rerollOn").value = string.slice(0,string.length - 1);
	}
	console.log("Final input is " + document.getElementById("rerollOn").value);
}