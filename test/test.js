const chai = require( "chai" );
const expect = chai.expect;

const WordToNumber = require( "../index.js" );
var w2n;

const tests = [
	{ word: "three", number: "3" },
	{ word: "fifteen", number: "15" },
	{ word: "sixteen", number: "16" },
	{ word: "thirty", number: "30" },
	{ word: "forty-three", number: "43" },
	{ word: "forty three", number: "43" },
	{ word: "six-", number: "6" },
	{ word: "seven.", number: "7" },
	{ word: "-one", number: "1" },
	{ word: "ninety nine", number: "99" },
	{ word: "eighty-eight", number: "88" },
	{ word: "three hundred seventy-six", number: "376" },
	{ word: "five hundred and nine", number: "509" },
	{ word: "six thousand four hundred and sixty-two", number: "6462" },
	{ word: "fifteen thousand nine", number: "15009" },
	{ word: "one thousand and eighty", number: "1080" },
	{ word: "one million seven thousand thirty-nine", number: "1007039" },
	{ word: "onemillionseventhousandthirty-nine", number: "1007039" },
];

describe( "Initialization", () => {

	it( "Should not throw an error", () => {
		w2n = new WordToNumber();
	});

});

describe( "Straight word-number tests", () => {

	it( "Should have the correct number", () => {
		
		tests.forEach( ( test ) => {
			expect( w2n.parse( test.word ) ).to.equal( test.number );
		});

	});

});

const fuzz_chars = "`~!@#$%^&*()-_=+[{]}\|;:'\",<.>/? \t";

function fuzz( input, expected, callback ) {
	for ( let i = 0, len = fuzz_chars.length; i < len; i++ ) {

		let fuzzed_input = input + fuzz_chars[ i ];
		callback( fuzzed_input, expected );

		fuzzed_input = fuzz_chars[ i ] + input;
		callback( fuzzed_input, expected );

		fuzzed_input = fuzz_chars[ i ] + input + fuzz_chars[ i ];
		callback( fuzzed_input, expected );

	}
}

describe( "Fuzzing tests", () => {

	it( "Should have the correct number", () => {
		
		tests.forEach( ( test ) => {

			fuzz( test.word, test.number, ( input, expected ) => {
				expect( w2n.parse( input ) ).to.equal( expected );
			});

		});

	});

});

describe( "Multiple word-number tests", () => {

	it( "Should match the last word-number", () => {

		let combined_tests = [];
		tests.forEach( ( test_a ) => {
			tests.forEach( ( test_b ) => {
				combined_tests.push({
					word: test_a.word + test_b.word,
					number: test_b.number,
				});
			});
		});
		
		combined_tests.forEach( ( test ) => {
			console.log( "[%s][%s]", test.word, test.number );
			expect( w2n.parse( test.word ) ).to.equal( test.number );
		});

	});

});
