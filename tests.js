var gmp_tests = {
generateTests: function () {
	var singleNotes = ['_la', '_sa', '_si', 'do', 're', 'mi', 'fa', 'sol', 'la', 'sa', 'si', 'DO', 'RE', 'MI', 'FA'];
	var modes = {};
	
	// single notes test
	line="";
	for(var i = 0; i < singleNotes.length; i++) {
		if(i != 0) line += ' ';
		line += singleNotes[i];
	}
	modes["single notes test"] = line;

	singleNotes = ['do', 're', 'mi', 'fa', 'sol', 'la', 'sa', 'si', 'DO', 'RE', 'MI', 'FA'];

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

	// single subpuncti test
	var singleNotes = [ 're', 'mi', 'fa', 'sol', 'la', 'sa', 'si', 'DO', 'RE', 'MI', 'FA'];
	line="";
	for(var i = 0; i < singleNotes.length; i++) {
		if(i != 0) line += ' ';
		line += (singleNotes[i] +'*');
	}
	modes["single subpuncti (non-mandatory)"] = line;

	// climaci test
	var singleNotes = ['do', 're', 'mi', 'fa', 'sol', 'la', 'sa', 'si', 'DO', 'RE', 'MI', 'FA'];
	line="";
	for(var i = 0; i < singleNotes.length; i++) {
		if(i != 0) line += ' ';
		line += (singleNotes[i] +'**');
	}
	modes["climaci test"] = line;

	// subtripuncti test
	var singleNotes = ['do', 're', 'mi', 'fa', 'sol', 'la', 'sa', 'si', 'DO', 'RE', 'MI', 'FA'];
	line="";
	for(var i = 0; i < singleNotes.length; i++) {
		if(i != 0) line += ' ';
		line += (singleNotes[i] +'***');
	}
	modes["subtripuncti test"] = line;

	line="";
	var singleNotes = ['fa', 'sol', 'la', 'sa', 'DO'];
	for(var i = 0; i < singleNotes.length; i++) {
		if(i != 0) line += ' | ';
		for(var j = i+1; j < singleNotes.length; j++) {
			if(j != 0) line += ' ';			
			line += (singleNotes[i] + '-' + singleNotes[j] + '**');
		}
	}
	modes["pes subbipuncti test"] = line;
	return modes;
	
}
};