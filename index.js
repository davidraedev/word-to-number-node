const BigNumber = require( "bignumber.js" );

// this needs to be larger than our largest exponenent
BigNumber.config({ EXPONENTIAL_AT: 10000 });

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
				in the "large" category, the value for each key is
				the total number of digits, aka the number of zeros plus one
				so for exponents, just subtract one
	*/
	this.languages = {
		english: {
			single: {
				zero: 0,
				one: 1,
				two: 2,
				three: 3,
				four: 4,
				five: 5,
				six: 6,
				seven: 7,
				eight: 8,
				nine: 9,
			},
			tens: {
				ten: 10,
				eleven: 11,
				twelve: 12,
				thirteen: 13,
				fourteen: 14,
				fifteen: 15,
				sixteen: 16,
				seventeen: 17,
				eighteen: 18,
				nineteen: 19,
				twenty: 20,
				thirty: 30,
				forty: 40,
				fourty: 40,
				fifty: 50,
				sixty: 60,
				seventy: 70,
				eighty: 80,
				ninety: 90,
			},
			large: {
				thousand: 4,
				million: 7,
				billion: 10,
				trillion: 13,
				quadrillion: 16,
				quintillion: 19,
				sextillion: 22,
				septillion: 25,
				octillion: 28,
				nonillion: 31,
				decillion: 34,
				undecillion: 37,
				duodecillion: 40,
				tredecillion: 43,
				quattuordecillion: 46,
				quindecillion: 49,
				sexdecillion: 52,
				septendecillion: 55,
				octodecillion: 58,
				novemdecillion: 61,
				vigintillion: 64,
				unvigintillion: 67,
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
	parseSingle
		Attempts to parse a string as a single digit
*/
WordToNumber.prototype.parseSingle = function( text ) {

	let singles = this.languages[ this.language ].single;
	let list = [];
	for ( let word in singles ) {

		if ( ! singles.hasOwnProperty( word ) )
			continue;

		let val = new BigNumber( singles[ word ] );
		while ( ( pos = text.indexOf( word ) ) !== -1 ) {
			let break_pre = [];
			let parts = this.splitOne( text, word );
			let post;
			let pre_word;
			let post_word;

			if ( parts[0] && parts.length > 1 )
				pre_word = parts[0];
			else
				post_word = parts[0];
				
			if ( parts[1] )
				post_word = parts[1];

			// if we have a pre-word, and it parses, then it is a separate number
			if ( pre_word ) {
				break_pre = this.parseSingle( pre_word );
				if ( break_pre.length )
					list = list.concat( break_pre );
				text = text.replace( pre_word, "" );
			}

			if ( post_word ) {
				post = this.parseSingle( post_word );
				text = text.replace( post_word, "" );
			}

			list.push( val.toString() );

			if ( post && post.length ) {
				list = list.concat( post );
			}

			text = text.replace( word, "" );
		}
	}

	return list;

};

/*
	splitOne
		split the first occurrence of a string within a string
			this is differnet from string.split( needle, 1 ), 
			because it returns the entire last half of the string,
			not just up to the next match
*/
WordToNumber.prototype.splitOne = function( haystack, string ) {
	let pos = haystack.indexOf( string );
	if ( pos !== -1 ) {
		let first_half = haystack.slice( 0, pos );
		let last_half = haystack.slice( ( pos + string.length ) );
		return [ first_half, last_half ];
	}
	return [];
};

/*
	parseTens
		Attempts to parse a string for the tens place
		If a tens is found, it will continue and try to match the single place,
		otherwise will return false;
*/
WordToNumber.prototype.parseTens = function( text ) {

	let tens = this.languages[ this.language ].tens;
	let list = [];
	for ( let word in tens ) {

		if ( ! tens.hasOwnProperty( word ) )
			continue;

		let val = new BigNumber( tens[ word ] );
		while ( ( pos = text.indexOf( word ) ) !== -1 ) {
			let break_pre = [];
			let parts = this.splitOne( text, word );
			let post;
			let pre_word;
			let post_word;

			if ( parts[0] && parts.length > 1 )
				pre_word = parts[0];
			else
				post_word = parts[0];
				
			if ( parts[1] )
				post_word = parts[1];

			// if we have a pre-word, and it parses, then it is a separate number
			if ( pre_word ) {
				break_pre = this.parseTens( pre_word );
				if ( break_pre.length )
					list = list.concat( break_pre );
				text = text.replace( pre_word, "" );
			}

			if ( post_word ) {
				post = this.parseTens( post_word );
				text = text.replace( post_word, "" );
			}

			let post_push;
			if ( post && post.length ) {
				if ( post[0] <= 9 && val >= 20 ) {
					val = val.plus( post[0] );
					if ( post.length > 1 )
						post_push = post.splice( 1 );
				}
				else {
					post_push = post;
				}
			}

			list.push( val.toString() );

			if ( post_push ) {
				list = list.concat( post_push );
			}

			text = text.replace( word, "" );
		}
	}

	let singles = this.parseSingle( text );

	list = list.concat( singles );

	return list;
};

/*
	parseHundreds
		Attempts to parse a string for the hundreds
*/
WordToNumber.prototype.parseHundreds = function( text, hundred ) {

	let original = ( " " + text ).slice( 1 );
	let list = [];

	let word = hundred || "hundred";
	while ( ( pos = text.indexOf( word ) ) !== -1 ) {
		let val = new BigNumber( 100 );
		let break_pre = [];
		let parts = this.splitOne( text, word );
		let post;
		let pre_word;
		let post_word;

		if ( parts[0] && parts.length > 1 )
			pre_word = parts[0];
		else
			post_word = parts[0];
			
		if ( parts[1] )
			post_word = parts[1];

		if ( pre_word ) {
			break_pre = this.parseHundreds( pre_word ).list;
			if ( break_pre.length ) {
				if ( break_pre.length > 1 ) {
					for ( let i = 0; i < ( break_pre.length - 1 ); i++ ) {
						list = list.concat( break_pre[ i ] );
					}
				}
				if ( break_pre[ break_pre.length - 1 ] > 9 ) {
					list = list.concat( break_pre[ break_pre.length - 1 ] );
				}
				else {
					val = val.times( break_pre[ break_pre.length - 1 ] );
				}
			}
			text = text.replace( pre_word, "" );
		}

		if ( post_word ) {
			post = this.parseHundreds( post_word ).list;
			text = text.replace( post_word, "" );
		}

		if ( post && post.length ) {
			if ( post[0] <= 99 ) {
				val = val.plus( post[0] );
			}
		}

		list.push( val.toString() );

		if ( post && post.length > 1 ) {
			post.splice( 0, 1 );
			list = list.concat( post );
		}

		text = text.replace( word, "" );
	}

	let tens = this.parseTens( text );

	list = list.concat( tens );

	return {
		list: list,
		text: text,
		original: original,
	};
};

WordToNumber.prototype.parseLarge = function( text ) {

	let list = [];

	let large = this.languages[ this.language ].large;
	let large_keys = Object.keys( large ).sort( ( a, b ) => {
		return large[ b ] - large[ a ];
	});

	for ( let i = 0; i < large_keys.length; i++ ) {

		let word = large_keys[ i ];

		if ( ! large.hasOwnProperty( word ) )
			continue;

		while ( ( pos = text.indexOf( word ) ) !== -1 ) {
			let val = new BigNumber( 10 ).toPower( ( large[ word ] - 1 ) );
			let break_pre = [];
			let parts = this.splitOne( text, word );
			let post;
			let pre_word;
			let post_word;

			if ( parts[0] && parts.length > 1 )
				pre_word = parts[0];
			else
				post_word = parts[0];
				
			if ( parts[1] )
				post_word = parts[1];

			if ( pre_word ) {
				break_pre = this.parseLarge( pre_word );
				if ( break_pre.length ) {

					if ( break_pre.length > 1 )
						for ( let i = 0; i < ( break_pre.length - 1 ); i++ )
							list = list.concat( break_pre[ i ] );

					if ( break_pre[ break_pre.length - 1 ] > 999 )
						list = list.concat( break_pre[ break_pre.length - 1 ] );
					else
						val = val.times( break_pre[ break_pre.length - 1 ] );
					
				}
				text = text.replace( pre_word, "" );
			}

			if ( post_word ) {
				post = this.parseLarge( post_word );
				text = text.replace( post_word, "" );
			}
			
			if ( post && post.length ) {
				if ( post[0] <= ( val - 1 ) ) {
					val = val.plus( post[0] );
				}
			}

			list.push( val.toString() );

			if ( post && post.length > 1 ) {
				post.splice( 0, 1 );
				list = list.concat( post );
			}

			text = text.replace( word, "" );
		}
	}

	let hundreds = this.parseHundreds( text );

	text = text.replace( hundreds.original, "" );

	list = list.concat( hundreds.list );

	return list;
};

/*
	parse
		Attempt to parse a string to an as many word-numbers as it can find
		or false
*/
WordToNumber.prototype.parse = function( text ) {

	if ( ! this.validate( text ) )
		return false;

	text = text.toLowerCase();

	return this.parseLarge( text );
};

module.exports = WordToNumber;