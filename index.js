/*
	wordToNumber Class
		converts human readable word-numbers into (string) digits
*/

function WordToNumber() {

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

	return this.languages;
};

/*
	setLanguage (string)
		changes the default language
		returns FALSE if it doesn't exist
*/
WordToNumber.prototype.setLanguage = function( language ) {

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

	return this.languages[ language ];
};

/*
	updateLanguageData
		create or replaces a language's data
*/
WordToNumber.prototype.updateLanguageData = function( language, data ) {

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

	if ( ! this.validate_blacklist.length )
		for ( let i = 0; i < this.validate_blacklist.length; i++ )
			if ( string.match( this.validate_blacklist[ i ] ) )
				return false;

	if ( ! this.validate_whitelist )
		return true;

	for ( let i = 0; i < this.validate_whitelist.length; i++ ) {
		if ( string.match( this.validate_whitelist[ i ] ) )
			return true;
	}

	return true;

};

/*
	createNumber
		Creates a number with len zeros in it
		then prepends the specified number to the in place of the first zero
		ex. createNumber( 23, 5 )
			= 230000
*/
WordToNumber.prototype.createNumber = function( pre_number, len ) {

	var number = ( len > 0 ) ? "0".repeat( len ) : "";
	if ( pre_number )
		number = pre_number + number.substr( 1 );
	return number;
};

/*
	appendNumber
		Creates a number with len zeros in it
			then right-aligned overwrites number with it
		ex. appendNumber( 111, 5, 230000 )
			= 230111
*/
WordToNumber.prototype.appendNumber = function( pre_number, len, number ) {

	var insert = this.createNumber( pre_number, len );
	return number.substr( 0, ( number.length - insert.length ) ) + insert;
};

/*
	mergeObjects
		Merges two or more objects
			duplicate indices will be overwritten with last value
		ex. mergeObjects( { a: 1, c: 3 }, { b: 2, c: 4 } )
			= { a: 1, b: 2, c: 4 }
*/
WordToNumber.prototype.mergeObjects = function() {

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

		if ( pre_number.length > 1 ) {
			return {
				break_number: pre_number[0],
				word: text,
			}
		}

		number = this.createNumber( pre_number[0], 3 );
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

	var return_word;
	if ( ! number ) {
		console.log( "post_number a [%s]", post_number );
		number = this.parseSingle( post_number )[0];
		if ( number.length > 1 ) {
			return {
				break_number: number[0],
				word: text,
			}
		}
		if ( ! isNaN( number ) ) {
			console.log( "getKeyByValue [%s]", getKeyByValue( this.languages[ this.language ].single, number ) );
			return_word = post_number.replace( new RegExp( getKeyByValue( this.languages[ this.language ].single, number ), "i" ), "" );
		}
	}
	else if ( post_number ) {
		console.log( "post_number b [%s]", post_number );
		var single = this.parseSingle( post_number )[0];
		if ( number.length > 1 ) {
			return {
				break_number: number[0],
				word: text,
			}
		}
		number = this.appendNumber( single, 1, ( number ) ? number : "" );
	}


	if ( do_return_word ) {
		return {
			number: number,
			word: return_word,
		};
	}

	return number;

};

function getKeyByValue( object, value ) {

	for ( var prop in object ) {

		if ( ! object.hasOwnProperty( prop ) )
			continue;

		if ( object[ prop ] === value )
			return prop;

	}

	return false;
}

/*
	parseSingle
		Attempts to parse a string as a single digit
*/
WordToNumber.prototype.parseSingle = function( text ) {
	console.log( "parseSingle [%s]", text )

	let single = this.languages[ this.language ].single;

	let list = [];

	for ( let word in single ) {

		if ( ! single.hasOwnProperty( word ) )
			continue;

		let number = single[ word ];

		while ( ( pos = text.indexOf( word ) ) !== -1 ) {
			list.push( number );
			text = text.replace( new RegExp( word, "i" ), "" );
		}
	}

	console.log( "list, ", list )

	return list;

};

/*
	replaceOne
		replace a single (first) instance of a string within a string
*/
WordToNumber.prototype.replaceOne = function( haystack, string ) {
	let pos = haystack.indexOf( string );
	if ( pos !== -1 ) {
		let first_half = haystack.slice( 0, pos );
		let last_half = haystack.slice( ( pos + haystack.length ) );
		return first_half + last_half;
	}
	return haystack;
}

/*
	splitOne
		split the first occurrence of a string within a string
			this is differnet from string.split( needle, 1 ), 
			because it returns the entire last half of the string,
			not just up to the next match
*/
WordToNumber.prototype.splitOne = function( haystack, string ) {
	console.log( "splitOne [%s] [%s]", haystack, string )
	let pos = haystack.indexOf( string );
	if ( pos !== -1 ) {
		let first_half = haystack.slice( 0, pos );
		let last_half = haystack.slice( ( pos + string.length ) );
		return [ first_half, last_half ];
	}
	return [];
}

/*
	parseTens
		Attempts to parse a string for the tens place
		If a tens is found, it will continue and try to match the single place,
		otherwise will return false;
*/
WordToNumber.prototype.parseTens = function( text ) {
	console.log( "parseTens [%s]", text )

	let number = false;
	let tens = this.languages[ this.language ].tens;
	let list = [];
	for ( let word in tens ) {

		if ( ! tens.hasOwnProperty( word ) )
			continue;

		let val = tens[ word ];
		while ( ( pos = text.indexOf( word ) ) !== -1 ) {
			console.log( "text >>", text, word );
			let break_pre = [];
			let parts = this.splitOne( text, word );
			let post;
			let pre_word;
			let post_word;

			console.log( "parts >>", parts );

			if ( parts[0] && parts.length > 1 )
				pre_word = parts[0];
			else
				post_word = parts[0];
				
			if ( parts[1] )
				post_word = parts[1];

			// if we have a pre-word, and it parses, then it is a separate number
			if ( pre_word ) {
				console.log( "break_pre" )
				break_pre = this.parseTens( pre_word );
				if ( break_pre.length )
					list = list.concat( break_pre );
				text = text.replace( pre_word, "" );
			}

			if ( post_word ) {
				console.log( "post_word" )
				post = this.parseTens( post_word );
				text = text.replace( post_word, "" );
				console.log( "post, ", post )
			}

			if ( post && post.length ) {
				if ( post[0] <= 9 ) {
					val = parseInt( val ) + parseInt( post[0] );
				}
			}


			list.push( val );

			if ( post && post.length > 1 ) {
				post.splice( 0, 1 );
				console.log( "post >> ", post )
				list = list.concat( post );
			}

			text = text.replace( word, "" );
		}
	}

	let singles = this.parseSingle( text );

	list = list.concat( singles );

	return list;
};

/*
	parse
		The main function of this class.
		Takes a string as input,
		attempts to parse it to numbers,
		then returns a number or false
*/
WordToNumber.prototype.parse = function( text ) {

	if ( ! this.validate( text ) )
		return false;

	var pre_number_parsed;

	text = text.toLowerCase();

	// loop thorugh all our "large numbers" longest to shortest
	var number = false;
	var large = this.languages[ this.language ].large;
	var large_keys = Object.keys( large ).sort( ( a, b ) => {
		return large[ b ] - large[ a ];
	});
	for ( let i = 0; i < large_keys.length; i++ ) {
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

	console.log( "number [%s]", number );


	// this is to catch any remaining numbers (tens and/or singles) at the end of the string
	// also if the entire word-number is only single/double digit
	pre_number_parsed = this.parsePreNumber( this.trimSeparators( text ), ( number !== false ), true );
	console.log( "text [%s]", text );
	console.log( "pre_number_parsed [%s] [%s]", pre_number_parsed.number, pre_number_parsed.word );
	
	if ( pre_number_parsed.word ) {
		let new_pre_number_parsed = this.parsePreNumber( this.trimSeparators( pre_number_parsed.word ), ( number !== false ), true );
		console.log( "new_pre_number_parsed [%s] [%s]", new_pre_number_parsed.number, new_pre_number_parsed.word );
		if ( ! isNaN( new_pre_number_parsed.number ) )
			pre_number_parsed.number = new_pre_number_parsed.number;
		console.log( "word [%s]", word );
		console.log( "pre_number_parsed [%s] [%s]", pre_number_parsed.number, pre_number_parsed.word );
	}

	if ( pre_number_parsed.number !== false ) {
		if ( number )
			number = this.appendNumber( pre_number_parsed.number, ( pre_number_parsed.number.length - 1 ), number );
		else
			number = pre_number_parsed.number;
	}

	return number;
};


/*
	trimArray
		Trims each element in an array
*/
WordToNumber.prototype.trimArray = function( array ) {

	return array.map(function( x ) {
		return x.trim();
	});
};

/*
	trimSeparators
		Trims the things like spaces and the word "and"
*/
WordToNumber.prototype.trimSeparators = function( str ) {

	return str.replace( /^([\s.,-]+)?((and)([\s.,-]+))?/i, "" ).replace( /(([\s.,-]+)(and)?)([\s.,-]+)?$/i, "" );
};

/*
	startsWith
		checks if a string starts with a string
*/
WordToNumber.prototype.startsWith = function( str, needle ) {

	return str.match( needle );
};

module.exports = WordToNumber;