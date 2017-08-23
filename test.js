const WordToNumber = require( "./index.js" );
var w2n = new WordToNumber();

let words = [
	"ahundredthreethousanda"
];

words.forEach( ( word ) => {
	console.log( "word", word )
	let parsed = w2n.parse( word );
	//let parsed = w2n.isValidSideChar( "eight", "start" );
	console.log( "parsed", parsed )
});
