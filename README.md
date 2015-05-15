Wordist
=============

Wordist is an open source dictionary with incremental search **hosted entirely on a static web server**.

Try out wordist here http://akumpf.github.io/wordist/

There's no backend logic doing anything fancy; it's just a big folder full of little javascipt snippets with corresponding definitions, parts of speech, etc. so you can experiment with language without 3rd-party APIs.

The entire dataset is a bit hefty to access directly (> 20MB), but breaking it up into 3000+ little pages of words and definitions keeps it light-weight and speedy for the web. Big thanks to the GNU Collaborative International Dictionary of English for the data that makes Wordist possible.

## Usage

### including wordist.js

First things first! You'll need to add a script tag to your HTML to get the party started.

```
<script src="http://akumpf.github.io/wordist/dist/wordist.js"></script>
```

You'll probably want to download your own copy and put it on your server to ensure things are fast, but for testing you can just pull in the javascript remotely as shown above.

### wordist.init(options)

Before you make calls to wordist, you should tell it where things are. Do this by calling `init`.

```
options = {
  path: "PATH_TO_DICTIONARY_DIST" // default is "./dist"
}
```

### wordist.getDef(word, callback)

Get a definition for a word.

```
// get the definition of "apple"
wordist.getDef("apple", function exampleDefHandler(err, root, data){
  if(err)   return console.warn(err); 
  if(!root) return console.warn("Unexpected result?", root, data);
  if(!data) return console.log("No def for: "+root);
  // --
  var entries = data.e||[];
  var alts    = data.a||[];
  console.log(root, alts, entries);
});
```

### wordist.getDefClosest(word, callback)

If you want to try harder to find a definition (in case the word is not a direct hit in the dictionary) use `getDefClosest()`. 

```
//This will fallback to the definition for "apple".
wordist.getDefClosest("applely", function exampleDefHandler(err, root, data){
  if(err)   return console.warn(err); 
  if(!root) return console.warn("Unexpected result?", root, data);
  if(!data) return console.log("No def for: "+root);
  // --
  var entries = data.e||[];
  var alts    = data.a||[];
  console.log(root, alts, entries);
});
```

### wordist.getDefRandom(callback)

Sometimes you just want a random word, and `getDefRandom` will do that for you.

```
// Get a random word.
wordist.getDefRandom(function exampleDefHandler(err, root, data){
  if(err)   return console.warn(err); 
  if(!root) return console.warn("Unexpected result?", root, data);
  if(!data) return console.log("No def for: "+root);
  // --
  var entries = data.e||[];
  var alts    = data.a||[];
  console.log(root, alts, entries);
});
```

### wordist.getPoSAll(partOfSpeech, callback)

Wordist contains lists of all defined words grouped by part of speech (like noun, verb, adjective, etc.).

None of the lists are enormous in size, but nouns and adjectives are a few hundred kB, so be aware of that if you are looking to keep your site fast.

Note that `partOfSpeech` is just the first 4 lettters of the part of speech you are interested in.

```
// get all the adjectives!
wordist.getPoSAll("adje", function(err, allAdjectives){
  if(err) return console.warn(err);
  console.log(allAdjectives);
});
```

### wordist.getPoSRandom(partOfSpeech, callback)

You can also just get a random word within a part of speech. 

This is handy for generating creative output (e.x. Mad Libs).

```
wordist.getPoSRandom("adje", function(err, randAdjective){
  if(err) return console.warn(err);
  console.log(randAdjective);
});
```

### wordist.getFindable(percent, callback)

Wordist computes the findability of each word in the dictionary. 

Findability is a measure of how many times a word is included other definitions (without double counting). It can be used to get a general sense of how common a word is in the language.

The findable words are pre-sorted into 100 sections. 1 will return the most common words. 100 will return the least common words that are still findable (occurance >= 2).  

```
// Get the most findable words in the dictioary!
wordist.getFindable(1, function(err, findableWords){
   if(err) return console.warn(err);
   console.log(findableWords);
});
```

### example code

You can also see wordist in action by checking out `index.html` or play with the demo here http://akumpf.github.io/wordist/

## Building wordist from source

To use wordist, you shouldn't need to build anything. 

But in case you want to monkey with the internals and add functionality to wordist...

* Download the source
* run `node build.js` for each stage (currently 3, set this in build.js). This takes about an hour.
* load `index.html` and make sure it worked!

## License

Wordist is licensed under Creative Commons 0 (Public Domain) except where otherwise noted (the libraries, for example, have their own terms). 

Wordist is backed by dictionary data from the GNU Collaborative International Dictionary of English (or GCIDE). See http://gcide.gnu.org.ua/.

GCIDE is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3, or (at your option) any later version.

On top of GCIDE, Wordist also makes use of a cleanly parsed version of the dictionary by javierjulio https://github.com/javierjulio/dictionary.

Wordist is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.


