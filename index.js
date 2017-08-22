const BigNumber = require( "bignumber.js" );

// this needs to be larger than our largest exponenent
// currently largest is hundred millinillion, at 3005
BigNumber.config({ EXPONENTIAL_AT: 3006 });

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

	/*
		(regex) side_char_regex
			characters not allowed at the start of a word-number
			useful for not matching word-numbers inside words like "attend",
			which would otherwise match the ten
	*/
	this.side_char_regex = /[a-z]/i;

	/*
		(regex) before_parse_strip_regex
			allowed delimiters for word-numbers, used to strip them
			leaving only word-numbers and non-allowed characters
			currently strips: spaces, periods, commas, dashes, and "and"s
	*/
	this.before_parse_strip_regex = /(\s+|\.|,|-|\s?and\s?)/ig;

	/*
		(int) max_delim_length
			max characters allowed between words
			if this is too high, we can match unrelated word-numbers
			that just so happen to fit the normal pattern like
			"one hundred pears, and six grean beans", would match as 106, not [ 100, 6 ]
	*/
	this.max_delim_length = 1;

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
WordToNumber.prototype.parseSingle = function( text, is_invalid, pre_allow_invalid ) {
//	console.log( "parseSingle", text, is_invalid );

	if ( pre_allow_invalid )
		this.is_first = true;

	let singles = this.languages[ this.language ].single;
	let list = [];
	for ( let word in singles ) {

		if ( ! singles.hasOwnProperty( word ) )
			continue;

		let val = new BigNumber( singles[ word ] );
		while ( ( pos = text.indexOf( word ) ) !== -1 ) {
			
			if ( this.is_first ) {

				if ( pos !== 0 && ! this.isValidSideChar( text.substring( 0, pos ), "start" ) )
					is_invalid = true;
				else if ( pos === 0 || pre_allow_invalid )
					is_invalid = false;

				pre_allow_invalid = true;
				this.is_first = false;
			}

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
				break_pre = this.parseSingle( pre_word, is_invalid );
				if ( break_pre.length )
					list = list.concat( break_pre );
				text = text.replace( pre_word, "" );
			}

			if ( post_word ) {
				post = this.parseSingle( post_word, is_invalid );
				text = text.replace( post_word, "" );
			}

			if ( ! is_invalid )
				list.push( val.toString() );

			if ( post && post.length )
				list = list.concat( post );

			text = text.replace( word, "" );
		}
	}

//	console.log( "parseSingle", list );

	return list;

};

/*
	splitOne
		split the first occurrence of a string within a string
			this is different from string.split( needle, 1 ), 
			because it returns the entire last half of the string,
			not just up to the next match
*/
WordToNumber.prototype.splitOne = function( haystack, string ) {
//	console.log( "splitOne", haystack, string );
	let pos = haystack.indexOf( string );
	if ( pos !== -1 ) {
		let first_half = haystack.slice( 0, pos );
		let last_half = haystack.slice( ( pos + string.length ) );
//		console.log( "splitOne", [ first_half, last_half ] );
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
let level = 0;
WordToNumber.prototype.parseTens = function( text, is_invalid, pre_allow_invalid ) {
//	console.log( "parseTens ["+ level++ +"]", text, is_invalid );

	if ( pre_allow_invalid )
		this.is_first = true;

	let original = ( " " + text ).slice( 1 );

	let tens = this.languages[ this.language ].tens;
	let list = [];
	for ( let word in tens ) {

		if ( ! tens.hasOwnProperty( word ) )
			continue;

		let val = new BigNumber( tens[ word ] );
		while ( ( pos = text.indexOf( word ) ) !== -1 ) {

//			console.log( "word", word );

			if ( this.is_first ) {

				if ( pos !== 0 && ! this.isValidSideChar( text.substring( 0, pos ), "start" ) )
					is_invalid = true;
				else if ( pos === 0 || pre_allow_invalid )
					is_invalid = false;

				pre_allow_invalid = true;
				this.is_first = false;
			}

			let break_pre = [];
			let parts = this.splitOne( text, word );
			let post;
			let pre_word;
			let post_word;

//			console.log( "parts", parts );

			if ( parts[0] && parts.length > 1 )
				pre_word = parts[0];
			else
				post_word = parts[0];
				
			if ( parts[1] )
				post_word = parts[1];

			text = text.replace( word, "" );

//			console.log( "text", text );

			// if we have a pre-word, and it parses, then it is a separate number
			if ( pre_word ) {
//				console.log( "pre_word", pre_word );
				break_pre = this.parseTens( pre_word, is_invalid, pre_allow_invalid );
				if ( break_pre.list.length )
					list = list.concat( break_pre.list );
				text = this.splitOne( text, pre_word ).join( "" );
//				console.log( "text a", text );
			}

			let break_post = false
			if ( post_word ) {
//				console.log( "post_word", post_word );
				post = this.parseTens( post_word, is_invalid );
				if ( ! this.isValidSideChar( post_word, "end" ) )
					break_post = true;
//				console.log( "post", post.list );
				text = this.splitOne( text, post_word ).join( "" );
//				console.log( "text b", text );
			}

			let post_push;
			if ( post && post.list && post.list.length && ! break_post ) {
				if ( post.list[0] <= 9 && val >= 20 ) {
					val = val.plus( post.list[0] );
					if ( post.list.length > 1 )
						post_push = post.list.splice( 1 );
				}
				else {
					post_push = post.list;
				}
			}

			if ( ! is_invalid )
				list.push( val.toString() );

			if ( post_push )
				list = list.concat( post_push );

//			console.log( "text c", text );
		}
	}

	let singles = this.parseSingle( text, is_invalid, pre_allow_invalid );

	list = list.concat( singles );

//	console.log( "parseTens", list );

	return {
		list: list,
		text: text,
		original: original,
	};
};

/*
	parseHundreds
		Attempts to parse a string for the hundreds
*/
WordToNumber.prototype.parseHundreds = function( text, hundred, is_invalid, pre_allow_invalid ) {
//	console.log( "parseHundreds", text );

	if ( pre_allow_invalid )
		this.is_first = true;

	let original = ( " " + text ).slice( 1 );
	let list = [];

	let word = hundred || "hundred";
	while ( ( pos = text.indexOf( word ) ) !== -1 ) {

		if ( this.is_first ) {

			if ( pos !== 0 && ! this.isValidSideChar( text.substring( 0, pos ), "start" ) )
				is_invalid = true;
			else if ( pos === 0 || pre_allow_invalid )
				is_invalid = false;

			pre_allow_invalid = true;
			this.is_first = false;
		}

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
			break_pre = this.parseHundreds( pre_word, null, is_invalid, pre_allow_invalid ).list;
			if ( break_pre.length ) {

				if ( pre_allow_invalid )
					is_invalid = false;

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

//		console.log( "is_invalid", is_invalid );

		let break_post = false
		if ( post_word ) {
//			console.log( "post_word", post_word );
			post = this.parseHundreds( post_word, null, is_invalid ).list;
			text = text.replace( post_word, "" );
			if ( ! this.isValidSideChar( post_word, "end" ) ) {
				break_post = true;
			}
		}

		if ( post && post.length && ! break_post ) {
			if ( post[0] <= 99 ) {
				val = val.plus( post[0] );
			}
		}
		else if ( break_post ) {
			post.unshift( "" );
		}

		if ( ! is_invalid )
			list.push( val.toString() );

//		console.log( "break_post", break_post )

		if ( post && post.length > 1 ) {
			post.splice( 0, 1 );
			list = list.concat( post );
		}

		text = text.replace( word, "" );
	}

	let tens = this.parseTens( text, is_invalid, pre_allow_invalid );

	list = list.concat( tens.list );

//	console.log( "parseHundreds", list );

	return {
		list: list,
		text: text,
		original: original,
	};
};

/*
	isValidSideChar
		regex function for testing the characters surrounding the word-number
*/
WordToNumber.prototype.isValidSideChar = function( text, side ) {
//	console.log( "isValidSideChar", text, side );
	let all_word_numbers = Object.keys( this.languages[ this.language ].single ).concat( Object.keys( this.languages[ this.language ].tens ), Object.keys( this.languages[ this.language ].large ) );
	let valid = false;
	all_word_numbers.forEach( ( word ) => {
		if ( valid )
			return;
		let regex = ( side == "start" ) ? new RegExp( word + "$" ) : new RegExp( "^" + word );
		//console.log( "regex", regex );
		if ( regex.test( text ) )
			valid = true;
	});

	if ( ! valid ) {
		let char = ( side == "start" ) ? text[ text.length - 1 ] : text[0];
//		console.log( "char", char );
		valid = ! this.side_char_regex.test( char );
	}
//	console.log( "valid", valid );
	return valid;
};

/*
	setSideChars
		takes a regex of allowed characters surrounding the word-number
		this MUST include *at least* /a-z/i, so that you aren't matching words
		like "attend", or "tone", that would otherwise match as 10, and 1
*/
WordToNumber.prototype.setSideChars = function( regex ) {
	this.side_char_regex = regex;
};

/*
	beforeParseStrip
		regex function to strip out allowed delimiters so we don't have to deal with them

		* we have to use a hacky reverse here because javascript doesn't have negative lookbehinds
*/
WordToNumber.prototype.beforeParseStrip = function( str ) {
//	console.log( "beforeParseStrip", str );
	let placeholder = "{WORD_TO_NUMBER_PLACEHOLDER}";
	str = str.replace( /thousand/g, placeholder );
//	console.log( "str a", str );
	str = str.replace( this.before_parse_strip_regex, "" );
//	console.log( "str b", str );
	str = str.replace( new RegExp( placeholder, "g" ), "thousand" );
//	console.log( "str c", str );
	return str;
};

WordToNumber.prototype.parseLarge = function( text, is_invalid, pre_allow_invalid ) {
//	console.log( "parseLarge", text );

	if ( pre_allow_invalid )
		this.is_first = true;

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

			if ( this.is_first ) {

				if ( pos !== 0 && ! this.isValidSideChar( text.substring( 0, pos ), "start" ) )
					is_invalid = true;
				else if ( pos === 0 || pre_allow_invalid )
					is_invalid = false;

				pre_allow_invalid = true;
				this.is_first = false;
			}

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
				break_pre = this.parseLarge( pre_word, is_invalid, pre_allow_invalid );
				if ( break_pre.length ) {

					if ( pre_allow_invalid )
						is_invalid = false;

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
				post = this.parseLarge( post_word, is_invalid );
				text = text.replace( post_word, "" );
			}
			
			if ( post && post.length ) {
				if ( post[0] <= ( val - 1 ) ) {
					val = val.plus( post[0] );
				}
			}

			if ( ! is_invalid )
				list.push( val.toString() );

			if ( post && post.length > 1 ) {
				post.splice( 0, 1 );
				list = list.concat( post );
			}

			text = text.replace( word, "" );
		}
	}

	let hundreds = this.parseHundreds( text, null, is_invalid, pre_allow_invalid );

	text = text.replace( hundreds.original, "" );

	list = list.concat( hundreds.list );

//	console.log( "parseLarge", list )

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

	this.is_first = true;

	let stripped_text = this.beforeParseStrip( text );
//	console.log( "text", text );
//	console.log( "stripped_text", stripped_text );
//	console.log( "equals", stripped_text === text );
	let result = this.parseLarge( stripped_text, false );
	//let result = this.parseLarge( text, false );

	return ( ! result || result.length === 0 ) ? false : result;
};

module.exports = WordToNumber;