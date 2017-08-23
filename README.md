# word-to-number-node [![Build Status](https://travis-ci.org/daraeman/word-to-number-node.svg?branch=master)](https://travis-ci.org/daraeman/word-to-number-node)

## Convert any phrase word-numbers to all their digitd
WordToNumber lets you parse any string for all of its word-numbers into an array of their digit representations.
Covers all possibilities up to millinillion

```
"five" => [ "5" ]
"Four score and seven years ago..." => [ "4", "7" ]
```

## Table of contents

- [Usage](#usage)
- [Languages](#languages)
- [Validation](#validation)

## Usage
The main function you'll be using with WordToNumber is the parse function.  
It takes a string, and will return an array of all the numbers it finds in their digit form, as a string

```js
var WordToNumber = require( "word-to-number-node" );
var w2n = new WordToNumber();

w2n.parse( "fifteen" ); // [ "15" ]
w2n.parse( "sixty-nine thousand and three" ); // [ "69003" ]
w2n.parse( "One Fish, Two Fish, Red Fish, Blue Fish " ); // [ "1", "2" ]
```

## Languages
WordToNumber comes with US English by default, with several convenience functions to manipulate that data.

```js
listLanguages()
//  return an array of the available languages
  
setLanguage ( (string) language )
//  set the current language

getLanguageData( (string) language )
//  return the data for the specified/current language

updateLanguageData( (string) language, (object) data )
//  replace the specified language data with your own

Note: While it may possible to drop in new languages and have them work (Like UK English for example),
the algorithm is tuned for US English, and as such other languages would have to follow the same pattern to work correctly
```

## Validation
WordToNumber allows you to set custom white/blacklists to validate against

```js
setValidatorWhitelist( (array/string) regex )
//		Takes a single, or array of regexes to test numbers against before parsing.
//		Only matching values will be included.
//		Blacklist takes precedence over Whitelist
//		Passing a falsey value will clear this list.

setValidatorBlacklist( (array/string) regex )
//		Takes a single, or array of regexes to test numbers against before parsing.
//		Matching values will be excluded.
//		Blacklist takes precedence over Whitelist
//		Passing a falsey value will clear this list.

setSideChars( (string) regex )
//		takes a regex of allowed characters surrounding the word-number
//		this MUST include *at least* /a-z/i, so that you aren't matching words
//		like "attend", or "tone", that would otherwise match as 10, and 1
```

## Scientific Notation
Optionally output scientific notation at the specified exponent level

```js
setExponent ( number )
//		takes a number that signifies the exponent at which scientific notation starts
```