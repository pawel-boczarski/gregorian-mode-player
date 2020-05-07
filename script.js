// BUGS:
// pause to be added!
// the length of double notes!
// space gaps after double notes!
// P1 !!!! bemol in compound notes!
// lowered notes!


// punctum (eg. "fa") - done
// pes (eg. "fa"-"sol") - done
// clivis (eg. "sol"-"fa") - done

// torculus (the middle note is the highest)
// porrectus (the middle note is the lowest) - improve
// climacus - implemented other way round... fix the *** notes!
// scandicus - done

// todo don't draw second bemol in phrase , distinguish phrase and simple pause
// http://www.lphrc.org/Chant/ - todo implement all notes

// multiline!



var currentTimeout = 0;
var soundLength = 400;
var soundGap = 100;

function playSingleNote(name, length, gap) {
	if(!(name in frequencies) && name != '|') return;
	
	setTimeout(
		function() {
			var gain_values = [ 1.0, 0.5, 0.8, 0.3, 0.1, 0.1, 0.05 ];
			console.log('no gain');
			var sines = [];
			var gains = [];
			for(var i = 0; i < gain_values.length; i++) {
				sines[i] = audioCtx.createOscillator();
				gains[i] = audioCtx.createGain();
				gains[i].gain.value = gain_values[i];
				//gains[i].gain.setValueAtTime(gain_values[i], audioCtx.currentTime);
				//gains[i].gain.linearRampToValueAtTime(0.3 * gain_values[i], audioCtx.currentTime + soundLength);
				sines[i].connect(gains[i]).connect(audioCtx.destination);
				sines[i].frequency.value = frequencies[name] * (i+1);
			}
			console.log('frequency : ' + frequencies[name]);
			for(var i = 0; i < gain_values.length; i++) sines[i].start();
			setTimeout(function() { for(var i = 0; i < gain_values.length; i++) sines[i].stop(); }, soundLength);
		},
	currentTimeout);
	currentTimeout += length;
	currentTimeout += gap;
}

var lastScheduledNote;
var noteBelowMap = {'MI' : 'RE', 'RE' : 'DO', 'DO' : 'si', 'si' : 'la', 'la' : 'sol',  'sol' : 'fa',
                    'fa' : 'mi', 'mi': 're', 're' : 'do', 'do' : '_si'};

function playNote(name) {
	if(name == '*') {
		return playNote(noteBelowMap[lastScheduledNote], soundLength, 0);
	}
	if(!name.includes('-')) {
		playSingleNote(name, soundLength, soundGap);
	} else {
		names = name.split('-');
		for(var i = 0; i < names.length; i++) {
			playSingleNote(names[i], soundLength, 0);			
		}
	}
	lastScheduledNote = name;
}

// todo away with globals
var CANV_MARGIN_TOP=100;
var CANV_LINE_HEIGHT = 14;
var INTER_LINE_GAP = 100;
var canv;
var canvCtx;

var notesDrawn = 0;
var noteHeight = 6;
var noteWidth = 10;
var additionalLineWidth = 16;
var punctumWidth = 6;
var virgaWidth = 2;
var virgaHeight = 14;
var porrectusLength = 30;
var bistrophaSpace = 3;
var linkWidth = 2;
var pauseGap = 15;
var pauseWidth = 1;
var noteGap = 10;
var scoreMargin = 20;
var notePosition = 0;

var bemolAdvance = 10;

var bemolStartRelativeFourthLine = -5;

var linePositionThreshold = 750;


function initCanvas() {
	canv = document.getElementById('canv')
	canvCtx = canv.getContext('2d');
}

// todo multiline support
function drawLines() {
	canvCtx.beginPath();
	for(var i = 0; i < 4; i++) {
		canvCtx.save();
		canvCtx.translate(0, CANV_LINE_HEIGHT*i + CANV_MARGIN_TOP);
		canvCtx.moveTo(10, 0);
		canvCtx.lineTo(800, 0);
		canvCtx.stroke();
		canvCtx.stroke();
		canvCtx.restore();
	}
	canvCtx.closePath();
}

var altitudeBase = {'FA' : -1.5, 'MI' : -1, 'RE' : -0.5, 'DO' : 0, 'sa' : 0.5, 'si' : 0.5, 'la' : 1, 'sol' : 1.5, 'fa' : 2, 'mi': 2.5, 're' : 3, 'do' : 3.5};
var altitude = {'FA' : -1.5, 'MI' : -1, 'RE' : -0.5, 'DO' : 0, 'sa' : 0.5, 'si' : 0.5, 'la' : 1, 'sol' : 1.5, 'fa' : 2, 'mi': 2.5, 're' : 3, 'do' : 3.5};
var lastDrawnNote;

// todo don't draw second bemol in phrase
function drawBemol() {
	var bemolStrokes = [[0,10], [5, 3], [0, -3], [-5, -3]];
	
	canvCtx.save();
	canvCtx.beginPath();
	canvCtx.translate(notePosition, CANV_MARGIN_TOP);
	var pt = [0, bemolStartRelativeFourthLine];
	canvCtx.moveTo(pt[0], pt[1]);
	for(var i = 0; i < bemolStrokes.length; i++) {
		pt[0] += bemolStrokes[i][0]; pt[1] += bemolStrokes[i][1];
		canvCtx.lineTo(pt[0], pt[1]);
	}
	canvCtx.closePath();
	canvCtx.stroke();
	canvCtx.stroke(); // for the slanted line to be bolder, improve this
	canvCtx.restore();

    // todo should it be here?
	notePosition += bemolAdvance;
}

// for now let's say 'sa' is not a single note ;)
function drawSingleNote(name) {
	deepen = altitude[name];
	
	canvCtx.save();
	canvCtx.translate(notePosition, CANV_MARGIN_TOP);
	canvCtx.fillRect(0, deepen*(CANV_LINE_HEIGHT) - noteHeight/2, noteWidth, noteHeight);
	if(deepen < -0.5 || deepen > 3.5) {
	canvCtx.fillRect(-(additionalLineWidth - noteWidth) / 2, deepen*(CANV_LINE_HEIGHT) - 1, additionalLineWidth, 2);
	}
	canvCtx.restore();
	notesDrawn++;
	lastDrawnNote = name;
	lastWasPunctum = false;
}

function drawVirga(name) {
	deepen = altitude[name];
	canvCtx.save();
	canvCtx.translate(notePosition, CANV_MARGIN_TOP);
	canvCtx.fillRect(0, deepen*(CANV_LINE_HEIGHT) - noteHeight/2, virgaWidth, virgaHeight);
	canvCtx.restore();
}

var lastWasPunctum = false; // todo - the puncti treated differently...

// todo reuse in accords (
function drawPunctum() {
	console.log('draw p~tm');
	var name = noteBelowMap[lastDrawnNote];
	console.log('draw note: ' + name);


	deepen = altitude[name];

	canvCtx.save();
	canvCtx.translate(notePosition, CANV_MARGIN_TOP);
	canvCtx.beginPath();
	canvCtx.moveTo(0, deepen*(CANV_LINE_HEIGHT));
	canvCtx.lineTo(0.7 * punctumWidth, - 0.7 * punctumWidth + deepen*(CANV_LINE_HEIGHT));
	canvCtx.lineTo(2*0.7 * punctumWidth, 0 + deepen*(CANV_LINE_HEIGHT));
	canvCtx.lineTo(0.7 * punctumWidth, + 0.7 * punctumWidth + deepen*(CANV_LINE_HEIGHT));
	canvCtx.closePath();
	canvCtx.fill();
	canvCtx.restore();
	
	lastDrawnNote = name;
	lastWasPunctum = true;
	notePosition += (punctumWidth/2 + virgaWidth);
}

function connectNotes(higher, lower) {
	deepen_higher = altitude[higher];
	deepen_lower = altitude[lower];
	
	canvCtx.save();
	canvCtx.translate(notePosition, CANV_MARGIN_TOP);
	canvCtx.fillRect(noteWidth - virgaWidth, deepen_higher*(CANV_LINE_HEIGHT) - noteHeight/2, virgaWidth, (deepen_lower-deepen_higher)*CANV_LINE_HEIGHT);	
	canvCtx.restore();
}

function connectNotesWithPorrectus(higher, lower) {
	deepen_higher = altitude[higher];
	deepen_lower = altitude[lower];
	//canvCtx.fillRect(notePosition + noteWidth - virgaWidth, CANV_MARGIN_TOP + deepen_higher*(CANV_LINE_HEIGHT) - noteHeight/2, virgaWidth, (deepen_lower-deepen_higher)*CANV_LINE_HEIGHT);	
	canvCtx.save();
	canvCtx.translate(notePosition, CANV_MARGIN_TOP);
	canvCtx.beginPath();
	canvCtx.moveTo(0, deepen_higher*(CANV_LINE_HEIGHT)  - noteHeight/2);
	canvCtx.lineTo(porrectusLength, deepen_lower*(CANV_LINE_HEIGHT) - noteHeight/2);
	canvCtx.lineTo(porrectusLength, deepen_lower*(CANV_LINE_HEIGHT) + noteHeight/2);
	canvCtx.lineTo(0, deepen_higher*(CANV_LINE_HEIGHT)  + noteHeight/2);
	canvCtx.closePath();
	canvCtx.fill();
	canvCtx.restore();
	// todo should it be here?
	notePosition += porrectusLength - noteWidth;
}

function drawPause() {
	canvCtx.fillRect(notePosition + pauseGap, CANV_MARGIN_TOP, virgaWidth, 3 * CANV_LINE_HEIGHT, pauseWidth);
}

// maybe the canvas translation functions should be here?
function drawNote(name) {
	if(name.includes('sa'))
		drawBemol(); // todo still need to implement the one-bemol-in-phrase rule
	if(name == '|') {
		drawPause();
		notePosition += (pauseGap + pauseWidth);
	}
	if(name == '*') {
		drawPunctum();
	} else if(!name.includes('-')) {
		drawSingleNote(name);
		notePosition += (noteWidth + noteGap);
	} else {
		subnotes = name.split('-');
		switch(subnotes.length) {
		default: // this is just application of "pes" and "clivis" rules - not cannonical, but understandable
		for(var i = 0; i < subnotes.length; i++) {
			if(i+1 < subnotes.length) {
				if(altitude[subnotes[i+1]] > altitude[subnotes[i]]) {
					if(i == 0 || altitude[subnotes[i-1]] == altitude[subnotes[i]])
						drawVirga(subnotes[i]);
					if(subnotes.length - i > 2 && altitude[subnotes[i+2]] < altitude[subnotes[i+1]])
						connectNotesWithPorrectus(subnotes[i], subnotes[i+1]);
					else {
						console.log('In here...');
						drawSingleNote(subnotes[i]);
						connectNotes(subnotes[i+1], subnotes[i]);
					}
					notePosition += (noteWidth - virgaWidth);
				} else if(altitude[subnotes[i+1]] == altitude[subnotes[i]]) {
					console.log('In here');
					drawSingleNote(subnotes[i]);
					notePosition += (noteWidth + bistrophaSpace);	
				} else if(i < subnotes.length - 2) {
						drawSingleNote(subnotes[i]);
					connectNotes(subnotes[i+1], subnotes[i]);
					notePosition += (noteWidth - virgaWidth);
			    } else {
						drawSingleNote(subnotes[i]);
					connectNotes(subnotes[i], subnotes[i+1]);
				}
			} else 
				drawSingleNote(subnotes[i]);
		}
		}
		notePosition += (noteWidth + noteGap);
	}
}

var keyName;
var keyLevel;
// todo this function should reset all
function drawKey(name, level) {
	// td level might be Nan
	
	canvCtx.save();
	canvCtx.translate(0, CANV_MARGIN_TOP);
	
	if(name == 'C') {
		canvCtx.fillRect(scoreMargin, (4-level) * CANV_LINE_HEIGHT - CANV_LINE_HEIGHT / 2 - noteHeight/2, noteWidth, noteHeight);
		canvCtx.fillRect(scoreMargin, (4-level) * CANV_LINE_HEIGHT + CANV_LINE_HEIGHT / 2 - noteHeight/2, noteWidth, noteHeight);
		canvCtx.fillRect(scoreMargin, (4-level) * CANV_LINE_HEIGHT  - CANV_LINE_HEIGHT / 2 - noteHeight/2, linkWidth, CANV_LINE_HEIGHT);
		
		for(i in altitudeBase) altitude[i] = altitudeBase[i] + (4-level);
	} else if(name == 'F') {
		canvCtx.fillRect(scoreMargin - noteWidth, (4-level) * CANV_LINE_HEIGHT - noteHeight/2, noteWidth - virgaWidth, noteHeight);
		canvCtx.fillRect(scoreMargin, (4-level) * CANV_LINE_HEIGHT - CANV_LINE_HEIGHT / 2 - noteHeight/2, noteWidth - virgaWidth, noteHeight);
		canvCtx.fillRect(scoreMargin, (4-level) * CANV_LINE_HEIGHT + CANV_LINE_HEIGHT / 2 - noteHeight/2, noteWidth - virgaWidth, noteHeight);
		canvCtx.fillRect(scoreMargin, (4-level) * CANV_LINE_HEIGHT - CANV_LINE_HEIGHT / 2 - noteHeight/2, linkWidth, CANV_LINE_HEIGHT * 2.5);

		for(i in altitudeBase) altitude[i] = altitudeBase[i] + (2-level);
	}
	
	canvCtx.restore();
	keyName = name;
	keyLevel = level;
}

function onDraw() {
	var score = document.getElementById('score');
	canvCtx.clearRect(0, 0, 800, 600);
	drawLines();
	notesDrawn = 0;
	notes = score.value.split(' ');
	drawLines();
	notePosition = scoreMargin + 2 * (noteWidth + noteGap);
	canvCtx.save();
	for(var i = 0; i < notes.length; i++) {
		if(notePosition > linePositionThreshold) {
			notePosition = scoreMargin + 2 * (noteWidth + noteGap);
			canvCtx.translate(0, INTER_LINE_GAP);
			drawLines();
			drawKey(keyName, keyLevel);
		}
			if(i == 0) {
				if(notes[i].match(/^[C,F][1-4]$/) != null) {
					drawKey(notes[i][0], parseInt(notes[i][1]));
					continue;
				}
				else
					drawKey('C', 4);
			}
		drawNote(notes[i]);
	}
	canvCtx.restore();
}

// end drawing

function onPlay() {
	var score = document.getElementById('score');
	currentTimeout = 0;
	notes = score.value.split(' ');
	for(i in notes) {
		playNote(notes[i]);
	}
}

function onKeyChangeClicked(name) {
	console.log('here!');
	var score = document.getElementById('score');
	notes = score.value.split(' ');
	if(notes[0].match(/^[C,F][1-4]$/) != null)
	{
		notes.splice(0, 1, name);
	} else {
		notes.splice(0, 0, name);
	}
	
	score.value = notes.join(' ');
}

function generateTests() {
	var singleNotes = ['do', 're', 'mi', 'fa', 'sol', 'la', 'sa', 'si', 'DO', 'RE', 'MI', 'FA'];
	var modes = {};
	
	// single notes test
	line="";
	for(var i = 0; i < singleNotes.length; i++) {
		if(i != 0) line += ' ';
		line += singleNotes[i];
	}
	modes["single notes test"] = line;

    // bistropha test
	line="";
	for(var i = 0; i < singleNotes.length; i++) {
		if(i != 0) line += ' ';
		line += (singleNotes[i] + '-' + singleNotes[i]);
	}
	modes["bistropha test"] = line;
	
	// tristropha test
	line="";
	for(var i = 0; i < singleNotes.length; i++) {
		if(i != 0) line += ' ';
		line += (singleNotes[i] + '-' + singleNotes[i] + '-' + singleNotes[i]);
	}
	modes["tristropha test"] = line;
	
	// podatus test
	line="";
	for(var i = 0; i < singleNotes.length; i++) {
		if(i != 0) line += ' | ';
		for(var j = i+1; j < singleNotes.length; j++) {
			if(j != 0) line += ' ';			
			line += (singleNotes[i] + '-' + singleNotes[j]);
		}
	}
	modes["podatus test"] = line;
	
	// podatus test
	line="";
	for(var i = 0; i < singleNotes.length; i++) {
		if(i != 0) line += ' | ';
		for(var j = i+1; j < singleNotes.length; j++) {
			if(j != 0) line += ' ';			
			line += (singleNotes[j] + '-' + singleNotes[i]);
		}
	}
	modes["clivis test"] = line;
	
	singleNotes = ['fa', 'sol', 'la', 'sa', 'DO'];
	line = "";
	// some scandici test
	for(var i = 0; i < singleNotes.length; i++) {
		for(var j = i+1; j < singleNotes.length; j++) {
				if(j != i+1) line += ' ';
			for(var k = j+1; k < singleNotes.length; k++) {
				if(k != j+1) line += ' ';
				line += (singleNotes[i] + '-' + singleNotes[j] + '-' + singleNotes[k]);
			}
		}
	}
	
	modes["some scandici test"] = line;
	line = "";
	// some torculi test
	for(var i = 0; i < singleNotes.length; i++) {
		for(var j = i; j < singleNotes.length; j++) {
				if(j != i) line += ' ';
			for(var k = j+1; k < singleNotes.length; k++) {
				if(k != j+1) line += ' ';
				line += (singleNotes[i] + '-' + singleNotes[k] + '-' + singleNotes[j]);
			}
		}
	}
	
	modes["some torculi test"] = line;
	line = "";
	// some porrecti test
	for(var i = 0; i < singleNotes.length; i++) {
		for(var j = i+1; j < singleNotes.length; j++) {
				if(j != i+1) line += ' ';
			for(var k = j; k < singleNotes.length; k++) {
				line += ' ';
				line += (singleNotes[j] + '-' + singleNotes[i] + '-' + singleNotes[k]);
			}
		}
	}
	
	modes["some porrecti test"] = line;
	line = "";

	return modes;
}

function load() {
console.log('javascript ...');
    frequencies={'do' : 261,
				 're' : 293,
				 'mi' : 330,
				 'fa' : 349,
				 'sol' : 392,
				 'la' : 440,
				 'sa': 466,
				 'si': 494,
				 'DO' : 523,
				 'RE' : 587,
				 'MI' : 659,
				 'FA' : 698
				 }
	// C4 is the default key
	modes={
		   'I a': "fa sol-la la la la la la la sol sol | la la la la la sa la sol la | la la la la sol fa sol-la sol * * * |",
		   'I b': "fa sol-la la la la la la la sol sol | la la la la la sa la sol la | la la la la sol fa sol-la sol |",
		   'I c': "fa sol-la la la la la la la sol sol | la la la la la sa la sol la | la la la la sol fa sol la |",
		   'II': "F3 do re fa fa fa fa fa fa re re | fa fa fa fa fa fa sol fa | fa fa fa fa fa fa mi do re |",
		   'III a': "sol la-DO DO DO DO DO DO DO la la | DO DO DO DO DO DO DO RE DO si DO | DO DO DO DO-si la-si la sol-la |",
		   'III b': "sol la-DO DO DO DO DO DO DO la la | DO DO DO DO DO DO DO RE DO si DO | DO DO DO la DO si-la |",
		   'IV a': "la sol-la la la la la la sol sol | la la la la sol la si la | la la la la la sol la si-la sol-fa mi |",
		   'IV b': "C3 RE DO-RE RE RE RE RE RE RE DO DO | RE RE RE RE RE RE DO RE MI RE | RE RE RE RE RE DO RE MI DO si-la |",
		   'V':   "C3 fa la DO DO DO DO DO DO la la | DO DO DO DO DO DO DO RE DO | DO DO DO DO DO DO RE si DO la |",
		   'VI' : "fa sol-la la la  la la la sol sol | la la la la la sa la sol la | la la la la la la la fa fa-la sol fa |",
		   'VII a': "C3 DO DO-RE RE RE RE RE RE RE DO DO | RE RE RE RE RE RE FA MI RE MI | RE RE RE RE RE RE MI RE DO si-la |",
		   'VII b': "C3 DO DO-RE RE RE RE RE RE RE DO DO | RE RE RE RE RE RE FA MI RE MI | RE RE RE RE RE RE MI RE DO si-RE |",
		   'VIIIa': "sol la DO DO DO DO DO DO la la | DO DO DO DO DO DO RE DO | DO DO DO DO si DO la sol |",
		   'VIIIb': "sol la DO DO DO DO DO DO la la | DO DO DO DO DO DO RE DO | DO DO DO DO la DO RE DO |"
		   };
		
		if(window.location.href.includes('user=OPs&password=panskipies')) { // ;-)
			modes = generateTests();
		}
	
	audioCtx = new (window.AudioContext || window.webkitAudioContext);
	sine = audioCtx.createOscillator();
	sine.connect(audioCtx.destination);
	document.getElementById('buttons').innerHTML += "Notes: ";
	// todo fix below, this should not work like this!
	for(var i of Object.keys(frequencies)) {
		document.getElementById('buttons').innerHTML +=
		('<button onClick="score.value=score.value+\'' + i + ' \';">' + i + '</button>');
	}
	
	document.getElementById('buttons').innerHTML += '<br>Keys: '
	
	var keys = ['C4', 'C3', 'F4', 'F3'];
	for(var i in keys) {
		document.getElementById('buttons').innerHTML +=
		('<button onClick="onKeyChangeClicked(\'' + keys[i] + '\');">' + keys[i] + '</button>');
	}
	
	document.getElementById('buttons').innerHTML += '<span style="font-size: 24px;"><label for="mode">Select Gregorian mode:&nbsp;</label>'
	document.getElementById('buttons').innerHTML +=
	'<select id="mode"></select>';
	Object.keys(modes).forEach( function(i) {
	document.getElementById('mode').innerHTML += ('<option value="'+ i + '">' + i + '</option>')});
	document.getElementById('mode').innerHTML += "</select></span>";
	console.log(document.getElementById('mode').innerHTML);
	
	document.getElementById('mode').setAttribute('onchange', "m=document.getElementById('mode').value; document.getElementById('score').value = modes[m]; onDraw();");

	initCanvas();
	drawLines();
	document.getElementById('mode').onchange(); onDraw();
	setInterval(onDraw, 5000);
}
