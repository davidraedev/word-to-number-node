# word-to-number-node [![Build Status](https://travis-ci.org/daraeman/word-to-number-node.svg?branch=master)](https://travis-ci.org/daraeman/word-to-number-node)

## Convert any word-number to a number
WordToNumber lets you parse a string for all of its word-numbers into their digit representation.

```"five" => "5"```

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

```
