// BUGS:
// pause to be added!
// the length of double notes!
// space gaps after double notes!


// punctum (eg. "fa") - done
// pes (eg. "fa"-"sol") - done
// clivis (eg. "sol"-"fa") - done

// torculus (the middle note is the highest)
// porrectus (the middle note is the lowest) - improve
// climacus - implemented other way round... fix the *** notes!
// scandicus - done
// additional line for above/below!

var currentTimeout = 0;
var soundLength = 400;
var soundGap = 100;
var CANV_MARGIN_TOP=100;
var CANV_LINE_HEIGHT = 14;
var canv;
var canvCtx;

function playSingleNote(name, length, gap) {
	if(!(name in frequencies) && name != '|') return;
	
	setTimeout(
		function() {
			var gain_values = [ 1.0, 0.5, 0.9, 0.3, 0.1, 0.1, 0.05 ];
			console.log('no gain');
			var sines = [];
			var gains = [];
			for(var i = 0; i < gain_values.length; i++) {
				sines[i] = audioCtx.createOscillator();
				gains[i] = audioCtx.createGain();
				gains[i].gain.value = gain_values[i];
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

var notesDrawn = 0;
var noteHeight = 6;
var noteWidth = 10;
var punctumWidth = 6;
var virgaWidth = 2;
var virgaHeight = 14;
var porrectusLength = 30;
var linkWidth = 2;
var noteGap = 5;
var scoreMargin = 20;
var notePosition = 0;

function initCanvas() {
	canv = document.getElementById('canv')
	canvCtx = canv.getContext('2d');
}

function drawLines() {
	canvCtx.clearRect(0, 0, 800, 600);
	canvCtx.beginPath();
	for(var i = 0; i < 4; i++) {
		canvCtx.moveTo(10, CANV_LINE_HEIGHT*i + CANV_MARGIN_TOP);
		canvCtx.lineTo(800, CANV_LINE_HEIGHT*i + CANV_MARGIN_TOP);
		canvCtx.stroke();
		canvCtx.stroke();
	}
	canvCtx.closePath();
	//drawKey('C', 3);
}

var altitudeBase = {'FA' : -1.5, 'MI' : -1, 'RE' : -0.5, 'DO' : 0, 'si' : 0.5, 'la' : 1, 'sol' : 1.5, 'fa' : 2, 'mi': 2.5, 're' : 3, 'do' : 3.5};
var altitude = {'FA' : -1.5, 'MI' : -1, 'RE' : -0.5, 'DO' : 0, 'si' : 0.5, 'la' : 1, 'sol' : 1.5, 'fa' : 2, 'mi': 2.5, 're' : 3, 'do' : 3.5};
var lastDrawnNote;

function drawSingleNote(name) {
	deepen = altitude[name];
	
	canvCtx.fillRect(notePosition, CANV_MARGIN_TOP + deepen*(CANV_LINE_HEIGHT) - noteHeight/2, noteWidth, noteHeight);
	notesDrawn++;
	lastDrawnNote = name;
	lastWasPunctum = false;
}

function drawVirga(name) {
	deepen = altitude[name];
	canvCtx.fillRect(notePosition, CANV_MARGIN_TOP + deepen*(CANV_LINE_HEIGHT) - noteHeight/2, virgaWidth, virgaHeight);
}

var lastWasPunctum = false; // todo - the puncti treated differently...

// todo reuse in accords (
function drawPunctum() {
	console.log('draw p~tm');
	var name = noteBelowMap[lastDrawnNote];
	console.log('draw note: ' + name);


	deepen = altitude[name];

	canvCtx.beginPath();
	canvCtx.moveTo(notePosition, CANV_MARGIN_TOP + deepen*(CANV_LINE_HEIGHT));
	canvCtx.lineTo(notePosition + 0.7 * punctumWidth, - 0.7 * punctumWidth + CANV_MARGIN_TOP + deepen*(CANV_LINE_HEIGHT));
	canvCtx.lineTo(notePosition + 2*0.7 * punctumWidth, 0 + CANV_MARGIN_TOP + deepen*(CANV_LINE_HEIGHT));
	canvCtx.lineTo(notePosition + 0.7 * punctumWidth, + 0.7 * punctumWidth + CANV_MARGIN_TOP + deepen*(CANV_LINE_HEIGHT));
	canvCtx.closePath();
	canvCtx.fill();
	
	lastDrawnNote = name;
	lastWasPunctum = true;
	notePosition += (punctumWidth/2 + virgaWidth);
}

function connectNotes(higher, lower) {
	deepen_higher = altitude[higher];
	deepen_lower = altitude[lower];
	canvCtx.fillRect(notePosition + noteWidth - virgaWidth, CANV_MARGIN_TOP + deepen_higher*(CANV_LINE_HEIGHT) - noteHeight/2, virgaWidth, (deepen_lower-deepen_higher)*CANV_LINE_HEIGHT);	
}

function connectNotesWithPorrectus(higher, lower) {
	deepen_higher = altitude[higher];
	deepen_lower = altitude[lower];
	//canvCtx.fillRect(notePosition + noteWidth - virgaWidth, CANV_MARGIN_TOP + deepen_higher*(CANV_LINE_HEIGHT) - noteHeight/2, virgaWidth, (deepen_lower-deepen_higher)*CANV_LINE_HEIGHT);	
	canvCtx.beginPath();
	canvCtx.moveTo(notePosition, CANV_MARGIN_TOP + deepen_higher*(CANV_LINE_HEIGHT)  - noteHeight/2);
	canvCtx.lineTo(notePosition + porrectusLength, CANV_MARGIN_TOP + deepen_lower*(CANV_LINE_HEIGHT) - noteHeight/2);
	canvCtx.lineTo(notePosition + porrectusLength, CANV_MARGIN_TOP + deepen_lower*(CANV_LINE_HEIGHT) + noteHeight/2);
	canvCtx.lineTo(notePosition, CANV_MARGIN_TOP + deepen_higher*(CANV_LINE_HEIGHT)  + noteHeight/2);
	canvCtx.closePath();
	canvCtx.fill();
	notePosition += porrectusLength - noteWidth;
}


function drawNote(name) {
	if(name == '*') {
		drawPunctum();
	} else if(!name.includes('-')) {
		drawSingleNote(name);
		notePosition += (noteWidth + noteGap);
	} else {
		subnotes = name.split('-');
		switch(subnotes.length) {
		case 3:
		//	break;
		// if(porrectus) {
		// break;
		// }
		case 2:
		
		default: // this is just application of "pes" and "clivis" rules - not cannonical, but understandable
		for(var i = 0; i < subnotes.length; i++) {
			//drawSingleNote(subnotes[i]);
			if(i+1 < subnotes.length) {
				if(altitude[subnotes[i+1]] > altitude[subnotes[i]]) {
					if(i == 0) drawVirga(subnotes[i]);
					if(i == 0 && subnotes.length > 2 && altitude[subnotes[i+2]] < altitude[subnotes[i+1]])
						connectNotesWithPorrectus(subnotes[i], subnotes[i+1]);
					else {
						drawSingleNote(subnotes[i]);
						connectNotes(subnotes[i+1], subnotes[i]);
					}
					notePosition += (noteWidth - virgaWidth);
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

// todo this function should reset all
function drawKey(name, level) {
	// td level might be Nan
	if(name == 'C') {
		canvCtx.fillRect(scoreMargin, (4-level) * CANV_LINE_HEIGHT + CANV_MARGIN_TOP - CANV_LINE_HEIGHT / 2 - noteHeight/2, noteWidth, noteHeight);
		canvCtx.fillRect(scoreMargin, (4-level) * CANV_LINE_HEIGHT + CANV_MARGIN_TOP + CANV_LINE_HEIGHT / 2 - noteHeight/2, noteWidth, noteHeight);
		canvCtx.fillRect(scoreMargin, (4-level) * CANV_LINE_HEIGHT + CANV_MARGIN_TOP - CANV_LINE_HEIGHT / 2 - noteHeight/2, linkWidth, CANV_LINE_HEIGHT);
		
		for(i in altitudeBase) altitude[i] = altitudeBase[i] + (4-level);
	} else if(name == 'F') {
		canvCtx.fillRect(scoreMargin - noteWidth, (4-level) * CANV_LINE_HEIGHT + CANV_MARGIN_TOP - noteHeight/2, noteWidth - virgaWidth, noteHeight);
		canvCtx.fillRect(scoreMargin, (4-level) * CANV_LINE_HEIGHT + CANV_MARGIN_TOP - CANV_LINE_HEIGHT / 2 - noteHeight/2, noteWidth - virgaWidth, noteHeight);
		canvCtx.fillRect(scoreMargin, (4-level) * CANV_LINE_HEIGHT + CANV_MARGIN_TOP + CANV_LINE_HEIGHT / 2 - noteHeight/2, noteWidth - virgaWidth, noteHeight);
		canvCtx.fillRect(scoreMargin, (4-level) * CANV_LINE_HEIGHT + CANV_MARGIN_TOP - CANV_LINE_HEIGHT / 2 - noteHeight/2, linkWidth, CANV_LINE_HEIGHT * 2.5);

		for(i in altitudeBase) altitude[i] = altitudeBase[i] + (2-level);
	}
}

function onDraw() {
	var score = document.getElementById('score');
	drawLines();
	notesDrawn = 0;
	notes = score.value.split(' ');
	drawLines();
	notePosition = scoreMargin + 2 * (noteWidth + noteGap);
	for(var i = 0; i < notes.length; i++) {
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
}

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

function load() {
console.log('javascript ...');
    frequencies={'do' : 261,
				 're' : 293,
				 'mi' : 330,
				 'fa' : 349,
				 'sol' : 392,
				 'la' : 440,
				 'si': 494,
				 'DO' : 523,
				 'RE' : 587,
				 'MI' : 659,
				 'FA' : 698
				 }
	// C4 is the default key
	modes={
		  // 'test': "fa la DO | fa-la la-fa | fa-sol-la la * * | fa-DO-fa sol-la-si | si-la-sol | DO-sol-la",
		   'I a': "fa sol-la la la la la la la sol sol | la la la la la si la sol la | la la la la sol fa sol-la sol * * * ",
		   'I b': "fa sol-la la la la la la la sol sol | la la la la la si la sol la | la la la la sol fa sol-la sol",
		   'I c': "fa sol-la la la la la la la sol sol | la la la la la si la sol la | la la la la sol fa sol la",
		   'III': "sol la-DO DO DO DO DO DO DO si si | DO DO DO DO DO DO DO RE DO SI DO | DO DO DO DO-si la-si la sol-la",
		   'V':   "C3 fa la DO DO DO DO DO DO DO DO la la | DO DO DO DO DO DO DO DO RE DO | DO DO DO DO DO DO RE si DO la",
		   'VIIa': "C3 DO DO-RE RE RE RE RE RE RE DO DO | RE RE RE RE RE RE FA MI RE MI | RE RE RE RE RE RE MI RE DO si-la",
		   'VIIb': "C3 DO DO-RE RE RE RE RE RE RE DO DO | RE RE RE RE RE RE FA MI RE MI | RE RE RE RE RE RE MI RE DO si-RE",
		   'II': "F3 do re fa fa fa fa fa fa re re | fa fa fa fa fa fa sol fa | fa fa fa fa fa fa mi do re",
		   'IVa': "la sol-la la la la la la sol sol | la la la la sol la si la | la la la la la sol la si-la sol-fa mi",
		   'IVb': "C3 RE DO-RE RE RE RE RE RE RE DO DO | RE RE RE RE RE RE DO RE MI RE | RE RE RE RE RE DO RE MI DO si-la",
		   'VI' : "fa sol-la la la la la la la la sol sol | la la la la la si la sol la | la la la la la la la fa-la sol fa",
		   'VIIIa': "sol la DO DO DO DO DO DO la la | DO DO DO DO DO DO RE DO | DO DO DO DO si DO la sol",
		   'VIIIb': "sol la DO DO DO DO DO DO la la | DO DO DO DO DO DO RE DO | DO DO DO DO la DO RE DO"
		   };
		   
	
	audioCtx = new (window.AudioContext || window.webkitAudioContext);
	sine = audioCtx.createOscillator();
	sine.connect(audioCtx.destination);
	document.getElementById('buttons').innerHTML += "Notes: ";
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
	document.getElementById('score').value = modes['I a']; onDraw();
	setInterval(onDraw, 5000);
}
