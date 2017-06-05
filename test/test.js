var chai = require( "chai" );
var WordToNumber = require( "../index.js" );
var expect = chai.expect;

it( "Should have the correct number", function() {

	var parser = new WordToNumber();

	var tests = [
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
	
	tests.forEach( function( test ) {
		expect( parser.parse( test.word ) ).to.equal( test.number );
	});

});
