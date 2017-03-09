/*
	wordToNumber Class
		converts human readable word-numbers into (string) digits
*/

function WordToNumber() {
	console.log( "WordToNumber" )

	/*
		(string) language
			current language
	*/
	this.language = "english";

	/*
		(array) validate_whitelist
		(array) validate_blacklist
			regexes to determine whether a string should be parsed
	*/
	this.validate_whitelist = [];
	this.validate_blacklist = [];

	/*o
		(array) languages
			array of necessary number [ name => value ] pairs
				for single, tens, and place separators
				in the "large" category, the value for each key
				is the total number of digits, aka the nubmer of zeros plus one
	*/
	this.languages = {
		english: {
			single: {
				zero: "0",
				one: "1",
				two: "2",
				three: "3",
				four: "4",
				five: "5",
				six: "6",
				seven: "7",
				eight: "8",
				nine: "9"
			},
			tens: {
				ten: "10",
				eleven: "11",
				twelve: "12",
				thirteen: "13",
				fourteen: "14",
				fifteen: "15",
				sixteen: "16",
				seventeen: "17",
				eighteen: "18",
				nineteen: "19",
				twenty: "20",
				thirty: "30",
				forty: "40",
				fourty: "40",
				fifty: "50",
				sixty: "60",
				seventy: "70",
				eighty: "80",
				ninety: "90"
			},
			large: {
				hundred: 3,
				thousand: 4,
				million: 7,
				billion: 10,
				trillion: 13,
				quadrillion: 16,
				quintillion: 19,
				sextillion: 22,
				septillion: 23,
				octillion: 28,
				nonillion: 31,
				decillion: 34,
				undecillion: 37,
				duodecillion: 40,
				tredecillion: 41,
				quattuordecillion: 46,
				quindecillion: 49,
				sexdecillion: 52,
				septendecillion: 53,
				octodecillion: 58,
				novemdecillion: 61,
				vigintillion: 64,
				unvigintillion:  67,
				duovigintillion: 70,
				tresvigintillion: 73,
				quattuorvigintillion: 76,
				quinquavigintillion: 79,
				sesvigintillion: 82,
				septemvigintillion: 85,
				octovigintillion: 88,
				novemvigintillion: 91,
				trigintillion: 94,
				untrigintillion: 97,
				duotrigintillion: 100,
				googol: 101,
				trestrigintillion: 103,
				quattuortrigintillion: 106,
				quinquatrigintillion: 110,
				sestrigintillion: 112,
				septentrigintillion: 115,
				octotrigintillion: 118,
				noventrigintillion: 121,
				quadragintillion: 124,
				quinquagintillion: 154,
				sexagintillion: 184,
				septuagintillion: 214,
				octogintillion: 244,
				nonagintillion: 274,
				centillion: 304,
				uncentillion: 307,
				duocentillion: 310,
				trescentillion: 313,
				decicentillion: 334,
				undecicentillion: 337,
				viginticentillion: 364,
				unviginticentillion: 367,
				trigintacentillion: 394,
				quadragintacentillion: 424,
				quinquagintacentillion: 454,
				sexagintacentillion: 484,
				septuagintacentillion: 514,
				octogintacentillion: 544,
				nonagintacentillion: 574,
				ducentillion: 604,
				trecentillion: 904,
				quadringentillion: 1204,
				quingentillion: 1504,
				sescentillion: 1804,
				septingentillion: 2104,
				octingentillion: 2404,
				nongentillion: 2704,
				millinillion: 3004
			}
		}
	};

}

/*
	listLanguages
		return array of available languages
*/
WordToNumber.prototype.listLanguages = function() {
	console.log( "listLanguages" )

	return this.languages;
};

/*
	setLanguage (string)
		changes the default language
		returns FALSE if it doesn't exist
*/
WordToNumber.prototype.setLanguage = function( language ) {
	console.log( "setLanguage ["+ language +"]" )

	if ( ! this.languages[ language ] )
		return false;

	this.language = language;
	return true;
};

/*
	getLanguageData
		return a language's data
*/
WordToNumber.prototype.getLanguageData = function( language ) {
	console.log( "getLanguageData ["+ language +"]" )

	return this.languages[ language ];
};

/*
	updateLanguageData
		create or replaces a language's data
*/
WordToNumber.prototype.updateLanguageData = function( language, data ) {
	console.log( "updateLanguageData ["+ language +"] >>" )
	console.log( data )

	this.languages[ language ] = data;
};

/*
	setValidatorWhitelist
		Takes a single, or array of regex strings
		to test numbers against before parsing.
		Only matching values will be included.
		This is run before setValidatorWhitelist.
		Passing a falsey value will clear thie list.
*/
WordToNumber.prototype.setValidatorWhitelist = function( list ) {
	console.log( "setValidatorWhitelist >>" )
	console.log( list )

	if ( ! list.length )
		this.validate_whitelist = [];
	else if ( Array.isArray( list ) )
		this.validate_whitelist = list;
	else
		this.validate_whitelist = [ list ];
};

/*
	setValidatorBlacklist
		Takes a single, or array of regex strings
		to test numbers against before parsing.
		Matching values will be exluded.
		This is run before setValidatorWhitelist.
		Passing a falsey value will clear thie list.
*/
WordToNumber.prototype.setValidatorBlacklist = function( list ) {
	console.log( "setValidatorBlacklist >>" )
	console.log( list )

	if ( ! list.length )
		this.validate_blacklist = [];
	else if ( Array.isArray( list ) )
		this.validate_blacklist = list;
	else
		this.validate_blacklist = [ list ];
};

/*
	validate
		Validates a string against the setValidatorBlacklist
		and then the setValidatorWhitelist to test numberstrings
		against before parsing
*/
WordToNumber.prototype.validate = function( string ) {
	console.log( "validate ["+ string +"]" )

	if ( ! this.validate_blacklist.length )
		for ( var i = 0; i < this.validate_blacklist.length; i++ )
			if ( string.match( this.validate_blacklist[ i ] ) )
				return false;

	if ( ! this.validate_whitelist )
		return true;

	for ( var i = 0; i < this.validate_whitelist.length; i++ ) {
		if ( string.match( this.validate_whitelist[ i ] ) )
			return true;
	}

	return true;

};

/*
	createNumber
		Creates a number with len zeros in it
		and prepends the specified number to the in place of the first zero
		ex. createNumber( 23, 5 )
			= 230000
*/
WordToNumber.prototype.createNumber = function( pre_number, len ) {
	console.log( "createNumber ["+ pre_number +"]["+ len +"]" )

	var number = ( len > 0 ) ? "0".repeat( len ) : "";
	if ( pre_number )
		number = pre_number + number.substr( 1 );
	return number;
};

/*
	appendNumber
		Creates a number with len zeros in it
			and right-aligned overwrites number with it
		ex. appendNumber( 111, 5, 230000 )
			= 230111
*/
WordToNumber.prototype.appendNumber = function( pre_number, len, number ) {
	console.log( "appendNumber ["+ pre_number +"]["+ len +"]["+ number +"]" )

	var insert = this.createNumber( pre_number, len );
	return number.substr( 0, ( number.length - insert.length ) ) + insert;
};

/*
	mergeObjects
		Merges two or more objects
			duplicate indices will be overwritten
		ex. mergeObjects( { a: 1, c: 3 }, { b: 2, c: 4 } )
			= { a: 1, b: 2, c: 4 }
*/
WordToNumber.prototype.mergeObjects = function() {
	console.log( "mergeObjects ["+ arguments.length +"]" )

	var object = {};
	for ( var i = 0; i < arguments.length; i++ ) {
		for ( var index in arguments[i] ) {
			if ( ! arguments[i].hasOwnProperty( index ) )
				continue;
			object[ index ] = arguments[i][ index ];
		}
	}
	return object;
};

/*
	parsePreNumber
		Attempts to parse a string and return the hundreds number for it
		This is used to generate the amount for each number separator ( thousand, million... )
		Will match hundreds, tens, and singles
		Returns number or false

		// one hundred and seventy-three
*/
WordToNumber.prototype.parsePreNumber = function( text, do_check ) {
	console.log( "parsePreNumber ["+ text +"]["+ do_check +"]" )

	var number = false;
	var pre_number = false;
	var post_number = text;

	if ( do_check ) {
		var check = false;
		var check_array = this.mergeObjects(
			{ "hundred": 1 },
			this.languages[ this.language ].single,
			this.languages[ this.language ].tens
		);
		for ( var key in check_array ) {
			if ( ! check_array.hasOwnProperty( key ) )
				continue;
			if ( this.startsWith( text, key ) ) {
				check = true;
				break;
			}
		}
		if ( ! check )
			return false;
	}

	if ( text.indexOf( "hundred" ) !== -1 ) {

		var matches = this.trimArray( text.split( "hundred" ) );
		if ( matches[0].length )
			pre_number = this.parseSingle( matches[0] );

		number = this.createNumber( pre_number, 3 );
		post_number = this.trimSeparators( matches[1] );

	}
	if ( post_number.length ) {

		var tens = this.parseTens( post_number );
		if ( tens.length ) {
			if ( number )
				number = this.appendNumber( tens, 1, ( number ) ? number : "" );
			else
				number = tens;
			post_number = false;
		}

	}
	if ( ! number ) {
		number = this.parseSingle( post_number );
	}
	else if ( post_number ) {
		var single = this.parseSingle( post_number );
		number = this.appendNumber( single, 1, ( number ) ? number : "" );
	}

	return number;

};

/*
	parseSingle
		Attempts to parse a string as a single digit
*/
WordToNumber.prototype.parseSingle = function( text ) {
	console.log( "parseSingle ["+ text +"]" )

	for ( var word in this.languages[ this.language ].single ) {
		if ( ! this.languages[ this.language ].single.hasOwnProperty( word ) )
			continue;
		var val = this.languages[ this.language ].single[ word ];
		if ( text.indexOf( word ) !== -1 )
			return val;
	}

	return false;

};

/*
	parseTens
		Attempts to parse a string for the tens place
		Will match for single digit only if a tens is found
		otherwise returns false;
*/
WordToNumber.prototype.parseTens = function( text ) {
	console.log( "parseTens ["+ text +"]" )

	var number = false;
	var tens = this.languages[ this.language ].tens;
	console.log( tens )
	for ( var word in tens ) {
		if ( ! tens.hasOwnProperty( word ) )
			continue;
		var val = tens[ word ];
		var match = text.split( word );
		console.log( "match >>" )
		console.log( match )

		if ( match && match[1] ) {
			number = val;
			var single = ( ! match[1] ) ? this.parseSingle( match[1] ) : false;
			return ( single ) ? number( 0, 1 ) + single : number;
		}
	}

	return false;
};

/*
	parse
		The main function of this class.
		Takes a string as input,
		attempts to parse it to numbers,
		then returns a number or false
*/
WordToNumber.prototype.parse = function( text ) {
	console.log( "parse ["+ text +"]" )

	if ( ! this.validate( text ) )
		return false;

	var pre_number_parsed;

	text = text.toLowerCase();

	// loop thorugh all our "large numbers" longest to shortest
	var number = false;
	var large = this.languages[ this.language ].large;
	var large_keys = Object.keys( large ).reverse();
	for ( var i = 0; i < large_keys; i++ ) {
		var word = large_keys[ i ];
		if ( ! large.hasOwnProperty( word ) )
			continue;
		var val = large[ word ];

		if ( text.indexOf( word ) !== -1 ) {

			// parse the "pre-number" eg. (one hundred)
			// and add it to our full number in the current "large" place
			var match = this.trimArray( text.split( word ) );
			var pre_number = ( match && match[0] ) ? match[0] : false;
			text = match[1];

			pre_number_parsed = ( this.parsePreNumber( this.trimSeparators( pre_number ), ( number !== false ) ) ) || "";

			if ( number === false )
				number = this.createNumber( pre_number_parsed, val );
			else
				number = this.appendNumber( pre_number_parsed, val, number );
		}
	}

	// this is to catch any remaining numbers (tens and/or singles) at the end of the string
	pre_number_parsed = this.parsePreNumber( this.trimSeparators( text ), ( number !== false ) );
	if ( pre_number_parsed !== false ) {
		if ( number )
			number = this.appendNumber( pre_number_parsed, ( pre_number_parsed.length - 1 ), number );
		else
			number = pre_number_parsed;
	}

	return number;
};


/*
	trimArray
		Trims each element in an array
*/
WordToNumber.prototype.trimArray = function( array ) {
	console.log( "trimArray >>" )
	console.log( array )

	return array.map(function( x ) {
		return x.trim();
	});
};

/*
	trimSeparators
		Trims the things like spaces and the word "and"
*/
WordToNumber.prototype.trimSeparators = function( str ) {
	console.log( "trimSeparators ["+ str +"]" )

	return str.replace( /^([\s.,-]+)?((and)([\s.,-]+))?/i, "" ).replace( /(([\s.,-]+)(and)?)([\s.,-]+)?$/i, "" );
};

/*
	startsWith
		checks if a string starts with a string
*/
WordToNumber.prototype.startsWith = function( str, needle ) {
	console.log( "startsWith ["+ str +"] ["+ needle +"]" )

	return str.match( needle );
};
