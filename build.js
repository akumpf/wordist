console.log("Running jsdict...");

var PATH_DICT     = __dirname+"/src/gcide_mod_javierjulio";
var PATH_DST      = __dirname+"/dist";
var PATH_SRC      = __dirname+"/src";
var PATH_DEBUG    = __dirname+"/debug";
var FILE_MASTER   = PATH_DST+"/master.json";
var PATH_BY_POS   = PATH_DST;

var FILE_SRC_IRVERBS    = PATH_SRC+"/ir_verbs_list.txt";

var fs          = require("fs");
var rimraf   		= require("rimraf");
var fsExtra   	= require("fs-extra");
var cheerio     = require('cheerio');
var _           = require("lodash");

var WPREFIX     = "_";

// --
var replaceDiacritics = (function(){
  var replacementList = [
    {
      base: ' ',
      chars: "\u00A0",
    }, {
      base: '0',
      chars: "\u07C0",
    }, {
      base: 'A',
      chars: "\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F",
    }, {
      base: 'AA',
      chars: "\uA732",
    }, {
      base: 'AE',
      chars: "\u00C6\u01FC\u01E2",
    }, {
      base: 'AO',
      chars: "\uA734",
    }, {
      base: 'AU',
      chars: "\uA736",
    }, {
      base: 'AV',
      chars: "\uA738\uA73A",
    }, {
      base: 'AY',
      chars: "\uA73C",
    }, {
      base: 'B',
      chars: "\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0181",
    }, {
      base: 'C',
      chars: "\uFF43\u24b8\uff23\uA73E\u1E08",
    }, {
      base: 'D',
      chars: "\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018A\u0189\u1D05\uA779",
    }, {
      base: 'Dh',
      chars: "\u00D0",
    }, {
      base: 'DZ',
      chars: "\u01F1\u01C4",
    }, {
      base: 'Dz',
      chars: "\u01F2\u01C5",
    }, {
      base: 'E',
      chars: "\u025B\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E\u1D07",
    }, {
      base: 'F',
      chars: "\uA77C\u24BB\uFF26\u1E1E\u0191\uA77B",
    }, {
      base: 'G',
      chars: "\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E\u0262",
    }, {
      base: 'H',
      chars: "\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D",
    }, {
      base: 'I',
      chars: "\u24BE\uFF29\xCC\xCD\xCE\u0128\u012A\u012C\u0130\xCF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197",
    }, {
      base: 'J',
      chars: "\u24BF\uFF2A\u0134\u0248\u0237",
    }, {
      base: 'K',
      chars: "\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2",
    }, {
      base: 'L',
      chars: "\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780",
    }, {
      base: 'LJ',
      chars: "\u01C7",
    }, {
      base: 'Lj',
      chars: "\u01C8",
    }, {
      base: 'M',
      chars: "\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C\u03FB",
    }, {
      base: 'N',
      chars: "\uA7A4\u0220\u24C3\uFF2E\u01F8\u0143\xD1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u019D\uA790\u1D0E",
    }, {
      base: 'NJ',
      chars: "\u01CA",
    }, {
      base: 'Nj',
      chars: "\u01CB",
    }, {
      base: 'O',
      chars: "\u24C4\uFF2F\xD2\xD3\xD4\u1ED2\u1ED0\u1ED6\u1ED4\xD5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\xD6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\xD8\u01FE\u0186\u019F\uA74A\uA74C",
    }, {
      base: 'OE',
      chars: "\u0152",
    }, {
      base: 'OI',
      chars: "\u01A2",
    }, {
      base: 'OO',
      chars: "\uA74E",
    }, {
      base: 'OU',
      chars: "\u0222",
    }, {
      base: 'P',
      chars: "\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754",
    }, {
      base: 'Q',
      chars: "\u24C6\uFF31\uA756\uA758\u024A",
    }, {
      base: 'R',
      chars: "\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782",
    }, {
      base: 'S',
      chars: "\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784",
    }, {
      base: 'T',
      chars: "\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786",
    }, {
      base: 'Th',
      chars: "\u00DE",
    }, {
      base: 'TZ',
      chars: "\uA728",
    }, {
      base: 'U',
      chars: "\u24CA\uFF35\xD9\xDA\xDB\u0168\u1E78\u016A\u1E7A\u016C\xDC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244",
    }, {
      base: 'V',
      chars: "\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245",
    }, {
      base: 'VY',
      chars: "\uA760",
    }, {
      base: 'W',
      chars: "\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72",
    }, {
      base: 'X',
      chars: "\u24CD\uFF38\u1E8A\u1E8C",
    }, {
      base: 'Y',
      chars: "\u24CE\uFF39\u1EF2\xDD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE",
    }, {
      base: 'Z',
      chars: "\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762",
    }, {
      base: 'a',
      chars: "\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250\u0251",
    }, {
      base: 'aa',
      chars: "\uA733",
    }, {
      base: 'ae',
      chars: "\u00E6\u01FD\u01E3",
    }, {
      base: 'ao',
      chars: "\uA735",
    }, {
      base: 'au',
      chars: "\uA737",
    }, {
      base: 'av',
      chars: "\uA739\uA73B",
    }, {
      base: 'ay',
      chars: "\uA73D",
    }, {
      base: 'b',
      chars: "\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253\u0182",
    }, {
      base: 'c',
      chars: "\u24D2\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184\u0043\u0106\u0108\u010A\u010C\u00C7\u0187\u023B",
    }, {
      base: 'd',
      chars: "\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\u018B\u13E7\u0501\uA7AA",
    }, {
      base: 'dh',
      chars: "\u00F0",
    }, {
      base: 'dz',
      chars: "\u01F3\u01C6",
    }, {
      base: 'e',
      chars: "\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u01DD",
    }, {
      base: 'f',
      chars: "\u24D5\uFF46\u1E1F\u0192",
    }, {
      base: 'ff',
      chars: "\uFB00",
    }, {
      base: 'fi',
      chars: "\uFB01",
    }, {
      base: 'fl',
      chars: "\uFB02",
    }, {
      base: 'ffi',
      chars: "\uFB03",
    }, {
      base: 'ffl',
      chars: "\uFB04",
    }, {
      base: 'g',
      chars: "\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\uA77F\u1D79",
    }, {
      base: 'h',
      chars: "\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265",
    }, {
      base: 'hv',
      chars: "\u0195",
    }, {
      base: 'i',
      chars: "\u24D8\uFF49\xEC\xED\xEE\u0129\u012B\u012D\xEF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131",
    }, {
      base: 'j',
      chars: "\u24D9\uFF4A\u0135\u01F0\u0249",
    }, {
      base: 'k',
      chars: "\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3",
    }, {
      base: 'l',
      chars: "\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747\u026D",
    }, {
      base: 'lj',
      chars: "\u01C9",
    }, {
      base: 'm',
      chars: "\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F",
    }, {
      base: 'n',
      chars: "\u24DD\uFF4E\u01F9\u0144\xF1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5\u043B\u0509",
    }, {
      base: 'nj',
      chars: "\u01CC",
    }, {
      base: 'o',
      chars: "\u24DE\uFF4F\xF2\xF3\xF4\u1ED3\u1ED1\u1ED7\u1ED5\xF5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\xF6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\xF8\u01FF\uA74B\uA74D\u0275\u0254\u1D11",
    }, {
      base: 'oe',
      chars: "\u0153",
    }, {
      base: 'oi',
      chars: "\u01A3",
    }, {
      base: 'oo',
      chars: "\uA74F",
    }, {
      base: 'ou',
      chars: "\u0223",
    }, {
      base: 'p',
      chars: "\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755\u03C1",
    }, {
      base: 'q',
      chars: "\u24E0\uFF51\u024B\uA757\uA759",
    }, {
      base: 'r',
      chars: "\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783",
    }, {
      base: 's',
      chars: "\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B\u0282",
    }, {
      base: 'ss',
      chars: "\xDF",
    }, {
      base: 't',
      chars: "\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787",
    }, {
      base: 'th',
      chars: "\u00FE",
    }, {
      base: 'tz',
      chars: "\uA729",
    }, {
      base: 'u',
      chars: "\u24E4\uFF55\xF9\xFA\xFB\u0169\u1E79\u016B\u1E7B\u016D\xFC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289",
    }, {
      base: 'v',
      chars: "\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C",
    }, {
      base: 'vy',
      chars: "\uA761",
    }, {
      base: 'w',
      chars: "\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73",
    }, {
      base: 'x',
      chars: "\u24E7\uFF58\u1E8B\u1E8D",
    }, {
      base: 'y',
      chars: "\u24E8\uFF59\u1EF3\xFD\u0177\u1EF9\u0233\u1E8F\xFF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF",
    }, {
      base: 'z',
      chars: "\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763",
    }
  ];
  // --
  var diacriticsMap = {};
  for (var i = 0; i < replacementList.length; i += 1) {
    var chars = replacementList[i].chars;
    for (var j = 0; j < chars.length; j += 1) {
      diacriticsMap[chars[j]] = replacementList[i].base;
    }
  }
  // --
  function removeDiacritics(str) {
    return str.replace(/[^\u0000-\u007e]/g, function(c) {
      return diacriticsMap[c] || c;
    });
  }
  // --
  return removeDiacritics;
})();
// --

function getDictLetterObj  (l, cb){
  fs.readFile(PATH_DICT+"/gcide_"+l.toLowerCase()+"-entries.json", {encoding: "utf8"}, function(err,data){
    if(err) return cb(err);
    try{
      data = JSON.parse(data);
    }catch(ex){
      return cb("JSON parse error:", ex);
    }
    // --
    console.log("Entries for ["+l+"]: "+_.size(data));
    return cb(null, data);
  });
}
function getGCIDELetterDict(l, cb){
  getDictLetterObj(l, function(err, lobj){
    if(err) return cb(err);
    // --
    var ldict = {};
    _.each(lobj, function(val, key){
      key = replaceDiacritics(key);
      var wkey = WPREFIX+filenameWord(replaceDiacritics(val.original_cased_word||key));
      //if(ldict[wkey]) console.log("Already had definitions for: "+key+"!");
      // --
      var defs  = (val||{}).definitions||[];
      var defsByPoS = {};
      // --
      var defaultPoSForThisWord = "unknown";
      if(key == "a" || key == "an" || key == "the") defaultPoSForThisWord = "article";
      // --
      var altWordForms = [];
      for(var i=0; i<defs.length; i++){
        var d = defs[i];
        var pos = (d.part_of_speech||defaultPoSForThisWord).substring(0,4);
        if(!defsByPoS[pos]){
          defsByPoS[pos] = [pos,[]];
          var newAlts = getAlternativesForWord(key,pos);
          for(var j=0; j<newAlts.length; j++) altWordForms.push(newAlts[j]);
        }
        var defClean = replaceDiacritics(d.definition.replace(/[\n\t]/g, "").replace(/\s{2,}/g, ' '));
        defsByPoS[pos][1].push(defClean);
      }
      // --
      ldict[wkey] = ldict[wkey]||{e:[],a:[]};
      _.each(defsByPoS,function(val2,key2){
        ldict[wkey].e.push(val2);
      });
      for(var j=0; j<altWordForms.length; j++) ldict[wkey].a.push(altWordForms[j]);
      ldict[wkey].a = _.uniq(ldict[wkey].a);
    });
    // --
    return cb(null, ldict);
  });
}
function getGCIDENumberDict(n,cb){
  getGCIDELetterDict(String.fromCharCode(n+97).toLowerCase(), cb);
}
// --
function prepareDirectories(cb){
  rimraf(PATH_DST, function(err){
  	if(err) return cb("Error cleaning dist dir.");
  	fs.mkdir(PATH_DST, function(err){
		  if(err) return cb("Error creating dist dir.");
      fs.mkdir(PATH_DST+"/pos", function(err){
        if(err) return cb("Error creating dist/pos dir.");
        fs.mkdir(PATH_DST+"/defs", function(err){
          if(err) return cb("Error creating dist/defs dir.");
          cb(null);
        });
      });
    });
  });
}

// --
function getObjAsJSInlineCallback(fam, id, obj){
  var cbname = "on_"+fam+"_cb";
  return "(function(){\n var o = "+JSON.stringify(obj)+";\n if(!window."+cbname+") console.warn(\""+cbname+"?\"); else "+cbname+"(\""+id+"\",o);\n})();";
}
function unfilenameWord(w){
  return w.replace(/\_/g, " ").replace(/\~/g, "'");
}
function filenameWord(w){
  return w.toLowerCase().replace(/\ /g, "_").replace(/\'/g, "~");
}

// --
var plurizeNoun    = (function(){
  // See: https://github.com/olooney/attache-pluralize-js/blob/master/attache.plural.js
  // --
	var userDefined = {};
  // --
	function capitalizeSame(word, sampleWord) {
		if ( sampleWord.match(/^[A-Z]/) ) {
			return word.charAt(0).toUpperCase() + word.slice(1);
		} else {
			return word;
		}
	}
	// returns a plain Object having the given keys,
	// all with value 1, which can be used for fast lookups.
	function toKeys(keys) {
		keys = keys.split(',');
		var keysLength = keys.length;
		var table = {};
		for ( var i=0; i < keysLength; i++ ) {
			table[ keys[i] ] = 1;
		}
		return table;
	}

	// words that are always singular, always plural, or the same in both forms.
	var uninflected = toKeys("aircraft,advice,blues,corn,molasses,equipment,gold,information,cotton,jewelry,kin,legislation,luck,luggage,moose,music,offspring,rice,silver,trousers,wheat,bison,bream,breeches,britches,carp,chassis,clippers,cod,contretemps,corps,debris,diabetes,djinn,eland,elk,flounder,gallows,graffiti,headquarters,herpes,high,homework,innings,jackanapes,mackerel,measles,mews,mumps,news,pincers,pliers,proceedings,rabies,salmon,scissors,sea,series,shears,species,swine,trout,tuna,whiting,wildebeest,pike,oats,tongs,dregs,snuffers,victuals,tweezers,vespers,pinchers,bellows,cattle,asparagus");

	var irregular = {
		// pronouns
		I: 'we',
		you: 'you',
		he: 'they',
		it: 'they',  // or them
		me: 'us',
		you: 'you',
		him: 'them',
		them: 'them',
		myself: 'ourselves',
		yourself: 'yourselves',
		himself: 'themselves',
		herself: 'themselves',
		itself: 'themselves',
		themself: 'themselves',
		oneself: 'oneselves',

		child: 'children',
		human: 'humans',
		dwarf: 'dwarfs',  // dwarfs are real; dwarves are fantasy.
		mongoose: 'mongooses',
		mythos: 'mythoi',
		ox: 'oxen',
		soliloquy: 'soliloquies',
		trilby: 'trilbys',
		person: 'people',
		forum: 'forums', // fora is ok but uncommon.

		// latin plural in popular usage.
		syllabus: 'syllabi',
		alumnus: 'alumni', 
		genus: 'genera',
		viscus: 'viscera',
		stigma: 'stigmata'
	};

	var suffixRules = [
		// common suffixes
		[ /man$/i, 'men' ],
		[ /([lm])ouse$/i, '$1ice' ],
		[ /tooth$/i, 'teeth' ],
		[ /goose$/i, 'geese' ],
		[ /foot$/i, 'feet' ],
		[ /zoon$/i, 'zoa' ],
		[ /([tcsx])is$/i, '$1es' ],
		[ /oaf$/i, 'oaves' ],

		// fully assimilated suffixes
		[ /ix$/i, 'ices' ],
		[ /^(cod|mur|sil|vert)ex$/i, '$1ices' ],
		[ /^(agend|addend|memorand|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi)um$/i, '$1a' ],
		[ /^(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|\w+hedr)on$/i, '$1a' ],
		[ /^(alumn|alg|vertebr)a$/i, '$1ae' ],
		
		// churches, classes, boxes, etc.
		[ /([cs]h|ss|x)$/i, '$1es' ],

		// words with -ves plural form
		[ /([aeo]l|[^d]ea|ar)f$/i, '$1ves' ],
		[ /([nlw]i)fe$/i, '$1ves' ],

		// -y
		[ /([aeiou])y$/i, '$1ys' ],
		[ /y$/i, 'ies' ],

		// -o
		[ /([aeiou])o$/i, '$1os' ],
		[ /^(pian|portic|albin|generalissim|manifest|archipelag|ghett|medic|armadill|guan|octav|command|infern|phot|ditt|jumb|pr|dynam|ling|quart|embry|lumbag|rhin|fiasc|magnet|styl|alt|contralt|sopran|bass|crescend|temp|cant|sol|kimon)o$/i, '$1os' ],
		[ /o$/i, 'oes' ],

		// words ending in s...
		[ /s$/i, 'ses' ]
	];

	// plural(String noun, Number count?, String plural?) -> String
	// 
	// pluralizes the given singular noun.  There are three ways to call it:
	//   plural(noun) -> pluralNoun
	//     Returns the plural of the given noun.
	//   Example: 
	//     plural("person") -> "people"
	//     plural("me") -> "us"
	//
	//   plural(noun, count) -> plural or singular noun
	//   Inflect the noun according to the count, returning the singular noun
	//   if the count is 1.
	//   Examples:
	//     plural("person", 3) -> "people"
	//     plural("person", 1) -> "person"
	//     plural("person", 0) -> "people"
	//
	//   plural(noun, count, plural) -> plural or singular noun
	//   you can provide an irregular plural yourself as the 3rd argument.
	//   Example:
	//     plural("château", 2 "châteaux") -> "châteaux"
	function plural(word, count, plural) {
		// handle the empty string reasonably.
		if ( word === '' ) return '';

		// singular case.
		if ( count === 1 ) return word;

    // Special protected word(s).
    if(word == "constructor") return "constructors";

		// life is very easy if an explicit plural was provided.
		if ( typeof plural === 'string' ) return plural;

		var lowerWord = word.toLowerCase();

		// user defined rules have the highest priority.
		if ( lowerWord in userDefined ) {
			return capitalizeSame(userDefined[lowerWord], word);
		}

		// single letters are pluralized with 's, "I got five A's on
		// my report card."
		if ( word.match(/^[A-Z]$/) ) return word + "'s";

		// some word don't change form when plural.
		if ( word.match(/fish$|ois$|sheep$|deer$|pox$|itis$/i) ) return word;
		if ( word.match(/^[A-Z][a-z]*ese$/) ) return word;  // Nationalities.
		if ( lowerWord in uninflected ) return word;

		// there's a known set of words with irregular plural forms.
		if ( lowerWord in irregular ) {
			return capitalizeSame(irregular[lowerWord], word);
		}
		
		// try to pluralize the word depending on its suffix.
		var suffixRulesLength = suffixRules.length;
		for ( var i=0; i < suffixRulesLength; i++ ) {
			var rule = suffixRules[i];
			if ( word.match(rule[0]) ) {
				return word.replace(rule[0], rule[1]);
			}
		}

		// if all else fails, just add s.
		return word + 's';
	}

	// plural.define(String singular, String plural) -> String
	//   Define your own plurals. User defined plurals
	//   have priority over all other rules.
	// 
	//   Example:
	//     plural.define('emacs', 'emacsen')
	plural.define = function(singular, plural) {
		userDefined[singular.toLowerCase()] = plural;
	}

  return plural;

})();
var alternateVerbs = (function(){
  // --
  console.log("Building Irregular Verbs table.");
  var data = fs.readFileSync(FILE_SRC_IRVERBS, {encoding: "utf-8"});
  if(!data) return console.log("couldn't read ir verbs file.");
  // --
  var lines = (data||"").split("\n");
  // --
  var irverbs = {};
  for(var i=0; i<lines.length; i++){
    var words = (lines[i]||"").toLowerCase().split(" ");
    for(var x=0; x<words.length; x++){
      for(var y=0; y<words.length; y++){
        if(x != y && words[x] != words[y]){
          irverbs[words[x]] = irverbs[words[x]]||[]
          var alreadyHaveIt = false;
          for(var z=0; z<irverbs[words[x]].length; z++){
            if(irverbs[words[x]][z] == words[y]) alreadyHaveIt = true;
          }
          if(!alreadyHaveIt) irverbs[words[x]].push(words[y]);
        }
      }
    }
  }
  // --
  // fs.writeFileSync(PATH_DST+"/irverbs.json", JSON.stringify(irverbs));
  // --
  function conjugate(w){
    w = w||"";
    // --
    if(irverbs[w]) return irverbs[w];
    // --
    var wl = w.charAt(w.length-1);
    var ws = w.substring(0,w.length-1);
    // http://www.scientificpsychic.com/grammar/regular.html
    // 4. ending in sibilants
    if(w.search(/(ss|x|sh|ch)$/) >= 0) return [w+"ed",w+"ing",w+"es"];
    // 1. long vowel or diphthong followed by consonant
    if(w.search(/([ao]y|[^aeioum](er|it)|[aeiou][aeiou][^aeiou]|[aeiou]w|[^aeiou][^aeiouy])$/) >= 0) return [w+"ed",w+"ing",w+"s"];
    // 2. short vowel followed by consonant
    if(w.search(/([aeiou][^aeiou])$/) >= 0) return [w+wl+"ed",w+wl+"ing",w+"s"];
    // 3. consonant followed by an "e"
    if(w.search(/([^aeiou]e)$/) >= 0) return [w+"d",ws+"ing",w+"s"];
    // 5. ending in consonant followed by "y"
    if(w.search(/([^aeiou]y)$/) >= 0) return [ws+"ied",w+"ing",ws+"ies"];
    // --
    return [];
  };
  return conjugate;
})();
function getAlternativesForWord(w,pos){
  if(pos == "noun") return [plurizeNoun(w)];
  if(pos == "verb") return alternateVerbs(w);
  return [];
}

// ------------------
// masterDict.json quick dictionary is one big object that contains key:value pairs of the form...
//
// _word: _data,
// where _data = { 
//    e: [[part_of_speech, [array of definitions]], ...  ],
//    a: [array of alternative spellings, conjugations, plural, ...],
//    u: # of definitions this word appears in.
//  }
// --
// part_of_speech can be: (noun,verb,adje,adve,conj,prep,inte,pron,arti)
// --
// Note that "_word" is simply the word:
// 1. lowercased
// 2. space replaced by "_" 
// 3. apostroophe (') replaced by "~"
// 4. prefixed with WPREFIX = "_"
// ------------------
  
// --
var masterDict    = {};
var revLookup = {};
// --
function buildMasterDict(cb){
  console.log("Building Master Dictionary 1...\n- - - - - - - - - -");
  // --
  var nextPageIndex = 0;
  // --
  function runNext(){
    if(nextPageIndex >= 26) return runDone();
    // --
    getGCIDENumberDict(nextPageIndex++, function(err,dict){
      if(err) console.log(err);
      // --
      _.each(dict, function(val, key){
        masterDict[key] = val;
      });
      // --
      runNext();
    });
  }
  function runDone(){
    // --
    console.log("MasterDict.size() = ", _.size(masterDict));
    //fs.writeFileSync(FILE_MASTER, JSON.stringify(masterDict));
    // --
    if(cb) cb();
  }
  // --
  runNext();
}
function buildPartOfSpeechDict(cb){
  var wordsByPoS = {};
  // --
  _.each(masterDict,function(_data, _word){
    var word    = _word.substring(1);
    var entries = _data.e||[];
    for(var i=0; i<entries.length; i++){
      var pos = (entries[i]||[])[0]||"unkn";
      wordsByPoS[pos] = wordsByPoS[pos]||[];
      wordsByPoS[pos].push(unfilenameWord(word));
    }
  });
  // --
   _.each(wordsByPoS,function(val,key){
     fs.writeFileSync(PATH_DST+"/pos/"+key+".js",  getObjAsJSInlineCallback("pos", key, val));
   });
   // --
   if(cb) cb();
}
function buildReverseLookup(cb){
  // --
  // MANUAL LOOKUPS; JUST FOR GLARING DISCONNECTS
  ((masterDict[WPREFIX+"et_cetera"]||{}).a||[]).push("etc");
  ((masterDict[WPREFIX+"especially"]||{}).a||[]).push("esp");
  // --
  _.each(masterDict,function(_data, _word){
    revLookup[_word] = _word;
    var alts = _data.a||[];
    for(var j=0; j<alts.length; j++){
      if(!alts[j]) console.log("Bad alt for: "+_word);
      var _alt = WPREFIX+filenameWord(alts[j]||"");
      revLookup[_alt] = _word;
    }
  });
  // --
  console.log("revLookup size: ", _.size(revLookup));
  //fs.writeFileSync(PATH_DST+"/reverse.json", JSON.stringify(revLookup));
  // --
  if(cb) cb();
}
function findUndefinedWordsAndUpdateRev(cb){
  var unWords             = {};
  var defTotWords         = 0;
  var revLookupAdditions  = 0;
  // --
  _.each(masterDict,function(_data, _word){
    var entries = _data.e||[];
    // --
    for(var i=0; i<entries.length; i++){
      var defs = (entries[i][1])||[];
      for(var j=0; j<defs.length; j++){
        var d = (defs[j]||"").split(" ");
        for(var k=0; k<d.length; k++){
          var w2 = d[k];
          if(w2){
            var fw2  = filenameWord(w2.replace(/[^a-zA-Z0-9\ \'\-]/g, ""));
            var hasLetters = (fw2.search(/[a-z]/) >= 0);
            var hasNumbers = (fw2.search(/[0-9]/) >= 0);
            if(fw2 && hasLetters && !hasNumbers){
              defTotWords++;
              // --
              var root = revLookup[WPREFIX+fw2];
              var foundOrig = !!root;
              // --
              if(!root && fw2.length > 3 && fw2.lastIndexOf("ly") == fw2.length-2){
                // ends in ly. try falling back.
                root = revLookup[WPREFIX+fw2.substring(0,fw2.length-1)];
                if(!root) root = revLookup[WPREFIX+fw2.substring(0,fw2.length-2)];
                if(!root) root = revLookup[WPREFIX+fw2.substring(0,fw2.length-1)+"e"];
              }
              if(!root && fw2.length > 3 && fw2.lastIndexOf("er") == fw2.length-2){
                // ends in er. try falling back.
                root = revLookup[WPREFIX+fw2.substring(0,fw2.length-1)];
                if(!root) root = revLookup[WPREFIX+fw2.substring(0,fw2.length-2)];
              }
              if(!root && fw2.length > 3 && fw2.lastIndexOf("al") == fw2.length-2){
                // ends in al. try falling back.
                root = revLookup[WPREFIX+fw2.substring(0,fw2.length-1)];
                if(!root) root = revLookup[WPREFIX+fw2.substring(0,fw2.length-2)];
              }
              if(!root && fw2.length > 4 && fw2.lastIndexOf("ed") == fw2.length-2){
                // ends in al. try falling back.
                root = revLookup[WPREFIX+fw2.substring(0,fw2.length-1)];
                if(!root) root = revLookup[WPREFIX+fw2.substring(0,fw2.length-2)];
                if(!root) root = revLookup[WPREFIX+fw2.substring(0,fw2.length-3)];
              }
              if(!root && fw2.length > 4 && fw2.lastIndexOf("est") == fw2.length-3){
                // ends in est. try falling back.
                root = revLookup[WPREFIX+fw2.substring(0,fw2.length-3)];
              }
              if(!root && fw2.length > 5 && fw2.lastIndexOf("ing") == fw2.length-3){
                // ends in ing. try falling back.
                root = revLookup[WPREFIX+fw2.substring(0,fw2.length-3)];
                if(!root) root = revLookup[WPREFIX+fw2.substring(0,fw2.length-4)];
                if(!root) root = revLookup[WPREFIX+fw2.substring(0,fw2.length-3)+"e"];
              }
              if(!root && fw2.length > 6 && fw2.lastIndexOf("ness") == fw2.length-4){
                // ends in ness. try falling back.
                root = revLookup[WPREFIX+fw2.substring(0,fw2.length-4)];
              }
              if(!root && fw2.length > 6 && fw2.lastIndexOf("ment") == fw2.length-4){
                // ends in ment. try falling back.
                root = revLookup[WPREFIX+fw2.substring(0,fw2.length-4)];
              }
              if(!root && fw2.length > 6 && fw2.lastIndexOf("like") == fw2.length-4){
                // ends in like. try falling back.
                root = revLookup[WPREFIX+fw2.substring(0,fw2.length-4)];
              }
              if(!root && fw2.length > 2 && fw2.lastIndexOf("s") == fw2.length-1){
                // ends in "s". try falling back.
                root = revLookup[WPREFIX+fw2.substring(0,fw2.length-1)];
              }
              if(!root && fw2.length > 2 && fw2.lastIndexOf("y") == fw2.length-1){
                // ends in "s". try falling back.
                root = revLookup[WPREFIX+fw2.substring(0,fw2.length-1)+"e"];
              }
              if(!root && fw2.length > 2 && fw2.lastIndexOf("es") == fw2.length-2){
                // ends in "es". try falling back.
                root = revLookup[WPREFIX+fw2.substring(0,fw2.length-2)];
              }
              if(!root && fw2.length > 3 && (fw2.indexOf("un") == 0 || fw2.indexOf("in") == 0)){
                // starts with "un". try falling back.
                root = revLookup[WPREFIX+fw2.substring(2)];
              }
              if(!root && fw2.indexOf("-") > 0){
                // contains "~" = "'". try dropping it.
                root = revLookup[WPREFIX+fw2.substring(0,fw2.indexOf("-"))];
              }
              // ------------------
              // -- UPDATE REVERSE LOOKUP AT THIS POINT IF WE'VE FOUND SOMETHING --
              if(!foundOrig && root){
                //console.log("Update RevLookup: "+fw2+" -> "+root);
                revLookup[WPREFIX+fw2] = root;
                revLookupAdditions++;
                // Also add this to the alts part of the masterDict entry.
                masterDict[root].a.push(unfilenameWord(fw2));
              }
              // ------------------
              // Last effort. Check for possesive; apostrophes.
              if(!root && fw2.indexOf("~") > 0){
                // contains "~" = "'". try dropping it.
                root = revLookup[WPREFIX+fw2.substring(0,fw2.indexOf("~"))];
              }
              // --
              var couldBeAbbrev = (w2.lastIndexOf(".") != w2.length-1);
              if(!root && !couldBeAbbrev) unWords[WPREFIX+fw2] = (unWords[WPREFIX+fw2]||0)+1;
            }
          }
        }
      }
    }
  });
  // --
  console.log("revLookupAdditions = "+revLookupAdditions);
  // --
  console.log("Total words in all definitions: "+Math.round(defTotWords/1000)/1000.0+" Million");
  console.log("Undefined (abbreviations / proper nouns) used in defs = "+_.size(unWords));
  // --
  // var sorter = [];
  // _.each(unWords, function(val,key){
  //   sorter.push({k:key,v:val});
  // });
  // sorter.sort(function(a,b){
  //   if(a.v < b.v) return  1;
  //   if(a.v > b.v) return -1;
  //   return 0;
  // });
  // console.log(sorter.slice(0,100));
  // --
  var allUndef = [];
  _.each(unWords, function(val,key){
    if(val > 1) allUndef.push(key);
  });
  allUndef.sort();
  console.log("Missing Words (undef > 1 instance) used in defs = "+allUndef.length);
  fs.writeFileSync(PATH_DST+"/undef.json", JSON.stringify(allUndef));
  // --
  if(cb) cb();
}
function buildMasterDictPages(cb){
  console.log("Building all master dictionary pages");
  var pages = {};
  // --
  _.each(masterDict, function(_data, _word){
    var h = _word.substring(1,4); // first 3 letters ~ 20:1 grouping, first 4 letters ~ 5:1
    if(!h || h.search(/[a-z]/) > 0) return; // doesn't start with a letter. 
    var s = WPREFIX+_word.substring(4);
    pages[h]    = pages[h]||{};
    pages[h][s] = _data;
  });
  // --
  _.each(masterDict,function(_data, _word){
    var alts = _data.a||[];
    for(var j=0; j<alts.length; j++){
      if(!alts[j]) console.log("Bad alt for: "+_word);
      var _alt = WPREFIX+filenameWord(alts[j]||"");
      if(!masterDict[_alt]){
        // provide a redirect to entry link
        var h = _alt.substring(1,4); // first 3 letters ~ 20:1 grouping, first 4 letters ~ 5:1
        if(!h || h.search(/[a-z]/) > 0) return; // doesn't start with a letter. 
        var s = WPREFIX+_alt.substring(4);
        pages[h]    = pages[h]||{};
        pages[h][s] = _word;
      }
    }
  });
  // --
  console.log("Total pages: "+_.size(pages));
  // --
  _.each(pages,function(pageData,pname){
    //if(pname.indexOf("a") != 0) return;
    fs.writeFileSync(PATH_DST+"/defs/"+pname+".js", getObjAsJSInlineCallback("defs", pname, pageData));
  });
  // --
  if(cb) cb();
}
// --
function buildMasterDictConnectedness(cb){
  console.log("Building Master Dictionary Connectedness...\n- - - - - - - - - -");
  // --
  console.log("Flattening defs for faster search.");
  var flattenedDefs = {};
  _.each(masterDict,function(_data, _word){
    var entries  = _data.e||[];
    var flatDefs = "";
    for(var i=0; i<entries.length; i++){
      var defs = entries[i][1]||[];
      for(var j=0; j<defs.length; j++){
        flatDefs += defs[j]+" ";
      }
    }
    flattenedDefs[_word] = flatDefs.toLowerCase();
  });
  // --
  function getDefs(w){
    return masterDict[WPREFIX+filenameWord(w)]||[];
  }
  function getUsedCount(w){
    var _word = WPREFIX+filenameWord(w);
    var _data = masterDict[_word]||{};
    var alts  = _data.a||[];
    // --
    var rePreWord   = "(^|[^a-zA-Z])";
    var rePostWord  = "($|[^a-zA-Z])";
    var reWords     = w;
    // --
    for(var j=0; j<alts.length; j++) reWords += "|"+alts[j];
    // --
    // for(var i=0; i<wdefs.length; i++){
    //   var alts = (wdefs[i][2])||[];
    //   for(var j=0; j<alts.length; j++) reWords += "|"+alts[j];
    // }
    // --
    //console.log("Words -> "+reWords);
    var re = new RegExp(rePreWord + "("+reWords+")" + rePostWord);
    // --
    var hits = 0;
    _.each(flattenedDefs,function(flatDefs,key){
      if(key == _word) return;
      var o = flatDefs.search(re);
      if(o >= 0) hits++;
    });
    // --
    return hits;
  }
  // function getUsesOutCount(w){
  //   var _word = WPREFIX+filenameWord(w);
  //   var _data = masterDict[_word]||{};
  //   var entries = _data.e||[];
  //   // --
  //   var dwords = {};
  //   // --
  //   var totalRefU = 0;
  //   // --
  //   for(var i=0; i<entries.length; i++){
  //     var defs = (entries[i][1])||[];
  //     for(var j=0; j<defs.length; j++){
  //       var d = (defs[j]||"").split(" ");
  //       for(var k=0; k<d.length; k++){
  //         var w2 = d[k];
  //         if(w2){
  //           var fw2  = filenameWord(w2.replace(/[^a-zA-Z0-9\'\-]/g, ""));
  //           var root = revLookup[WPREFIX+fw2];
  //           //if(!root) console.log("?? "+ fw2);
  //           if(root) dwords[root] = 1;
  //         }
  //       }
  //     }
  //   }
  //   _.each(dwords,function(val,root){
  //     //console.log("root", root);
  //     if(root == _word) return;
  //     var refU = (masterDict[root]||{}).f||0;
  //     totalRefU += refU;
  //   });
  //   // --
  //   return totalRefU;
  // }
  // Ballpark calculations...
  // * time to traverse dictionary ~ 100ms
  // * words in dictionary ~ 100,000
  // * n^2 traversal ~ 10,000 seconds = 2.8 hours
  function dictReady(){
    console.log("Start!");
    var indexStart =    0;
    var indexEnd   =   100*9000;
    var index      =    0;
    var t0 = new Date().getTime();
    // FINDABILITY
    _.each(masterDict,function(_data, _word){
      if(index >= indexStart && index < indexEnd){
        //metaDict[key] = metaDict[key]||{};
        if(masterDict[_word].f === undefined){
          var w = unfilenameWord(_word.substring(1));
          var hits = getUsedCount(w)||0;
          masterDict[_word].f = hits;
          // --
          if(index % 1000 === 0) console.log("@"+index+", f Hits for: "+w+" = "+hits);
        }
      }
      index++;
    });
    var t1 = new Date().getTime();
    console.log("Time to traverse: "+Math.floor((t1-t0)/6000)/10.0+" minutes.", "Indexed "+indexStart+" to "+indexEnd);
    // --
    var somewhatFindable = 0;
    _.each(masterDict,function(_data, _word){
      if(_data.f >= 5) somewhatFindable++;
    });
    console.log("Total somewhat findable words = "+somewhatFindable);
    console.log("-----------------------------------");
    // // --
    // // BRANCHING POTENTIAL
    // index = 0;
    // _.each(masterDict,function(_data, _word){
    //   if(index >= indexStart && index < indexEnd){
    //     //metaDict[key] = metaDict[key]||{};
    //     if(masterDict[_word].b === undefined){
    //       var w = unfilenameWord(_word.substring(1));
    //       var hits = getUsesOutCount(w)||0;
    //       masterDict[_word].b = hits;
    //       // --
    //       if(index % 10 === 0) console.log("@"+index+", o Hits for: "+w+" = "+hits);
    //     }
    //   }
    //   index++;
    // });
    // // --
   //  index = 0;
   //  _.each(masterDict,function(defs,key){
   //    if(index >= indexStart && index < indexEnd){
   //      metaDict[key] = metaDict[key]||{};
   //      if(metaDict[key].uo === undefined){
   //        metaDict[key].uo = (metaDict[key].u||0) * (metaDict[key].o||0) | 0; // force int32
   //      }
   //    }
   //    index++;
   //  });
   //  // --
   //  index = 0;
   //  _.each(masterDict,function(defs,key){
   //    if(index >= indexStart && index < indexEnd){
   //      metaDict[key] = metaDict[key]||{};
   //      if(metaDict[key].pos === undefined){
   //        var pdef = masterDict[key]||[];
   //        var ppos = {};
   //        for(var i=0; i<pdef.length; i++){
   //          var def = pdef[i]||[];
   //          var pos = def[0];
   //          if(pos && pos != "unkn") ppos[pos] = 1;
   //        }
   //        metaDict[key].pos = ppos;
   //      }
   //    }
   //    index++;
   //  });
   //  // ---------------------------------------------------
   //  var sorter = [];
   //  _.each(metaDict, function(val, key){
   //    sorter.push({k:key,v:val});
   //  });
   //  // --
   //  function sorterFn(key, desc, key2){
   //    if(desc){
   //      return function(a,b){
   //        if(a.v[key] < b.v[key]) return  1;
   //        if(a.v[key] > b.v[key]) return -1;
   //        if(key2){
   //          if(a.v[key2] < b.v[key2]) return  1;
   //          if(a.v[key2] > b.v[key2]) return -1;
   //        }
   //        return 0;
   //      }
   //    }else{
   //      return function(a,b){
   //        if(a.v[key] > b.v[key]) return  1;
   //        if(a.v[key] < b.v[key]) return -1;
   //        if(key2){
   //          if(a.v[key2] > b.v[key2]) return  1;
   //          if(a.v[key2] < b.v[key2]) return -1;
   //        }
   //        return 0;
   //      }
   //    }
   //  }
   //  function sorterLog(arr){
   //    var str = " * ";
   //    for(var i=0; i<arr.length; i++) str += (arr[i].k||"").substring(1)+" ";
   //    console.log(str);
   //  }
   //  // --
   //  var SHOW = 50;
   //  // --
   //  console.log("Greatest U - Used most in other definitions.");
   //  sorter.sort(sorterFn("u",true));
   //  sorterLog(sorter.slice(0,SHOW));
   //  // // --
   //  console.log("Least U");
   //  sorter.sort(sorterFn("u",false));
   //  sorterLog(sorter.slice(0,SHOW));
   //  // --
   //  console.log("Greatest O -- Defined with words that are frequently used.");
   //  sorter.sort(sorterFn("o",true));
   // sorterLog(sorter.slice(0,SHOW));
   //  // --
   //  console.log("Least O");
   //  sorter.sort(sorterFn("o",false));
   //  sorterLog(sorter.slice(0,SHOW));
   //  // --
   //  console.log("Least U,O");
   //  sorter.sort(sorterFn("u",false,"o"));
   //  sorterLog(sorter.slice(0,SHOW));
   //  // --
   //  console.log("Greatest U*O -- Often used and is also defined by frequently used words.");
   //  sorter.sort(sorterFn("uo",true));
   //  sorterLog(sorter.slice(0,SHOW));
   //  // --
   //  sorter = [];
   //  _.each(metaDict, function(val, key){
   //    if(val.pos.adje) sorter.push({k:key,v:val});
   //  });
   //  console.log("Greatest O Adjectives - Used most in other definitions.");
   //  sorter.sort(sorterFn("o",true));
   //  sorterLog(sorter.slice(0,SHOW));
   //  // ---------------------------------------------------
   //  fs.writeFileSync(FILE_META, JSON.stringify(metaDict));
    // --
    console.log("DONE");
    if(cb) cb();
  }
  // --
  dictReady();
}
// --
var STAGE = 3;
console.log("STAGE: "+STAGE);
// --
if(STAGE == 1){
  prepareDirectories(function(){
    buildMasterDict(function(){
      buildPartOfSpeechDict(function(){
        buildReverseLookup(function(){
          findUndefinedWordsAndUpdateRev(function(){
            // --
            console.log("Saving master and reverse dictionaries...");
            fs.writeFileSync(FILE_MASTER,              JSON.stringify(masterDict));
            fs.writeFileSync(PATH_DST+"/reverse.json", JSON.stringify(revLookup));
            // --
            buildMasterDictConnectedness(function(){
              // --
              console.log("Saving master and reverse dictionaries...");
              fs.writeFileSync(FILE_MASTER,              JSON.stringify(masterDict));
              // --
              buildMasterDictPages(function(){
                console.log("DONE");
                // var word = "compelling";
                // var root = revLookup[WPREFIX+filenameWord(word)];
                // var data = masterDict[root];
                // console.log(word,root,data.a,data.e);
                // console.log("repeat",masterDict[WPREFIX+"repeat"]);
                // console.log("admit", masterDict[WPREFIX+"admit"]);
                // console.log("usual", masterDict[WPREFIX+"usual"]);
              });
            });
          });
        });
      });
    });
  });
}
if(STAGE == 2){
  fs.readFile(FILE_MASTER, {}, function(err, data) {
    if (err) console.log(err);
    try{
      masterDict = JSON.parse(data);
      // --
      fs.readFile(FILE_MASTER, {}, function(err, data) {
        if(err){
          console.log("Note: No Previous masterDict yet...");
          runStage();
          return;
        }
        // --
        try{
          masterDict = JSON.parse(data);
          // --
          fs.readFile(PATH_DST+"/reverse.json", {}, function(err, data) {
            if(err){
              console.log("Note: No Previous reverse yet...");
              runStage();
              return;
            }
            // --
            try{
              revLookup = JSON.parse(data);
              runStage();
            }catch (err3){
              console.log("", err3);
            }
          });
          // --
        }catch (err2){
          console.log("", err2);
        }
      });
      // --
    }catch (err2){
      console.log("", err2);
    }
  });
  // --
  function runStage(){
    console.log("Running...");
    console.log("masterDict: "+_.size(masterDict)+", revLookup: "+_.size(revLookup));
    console.log("-------------------------------------");
    // --
    var sorter = [];
    _.each(masterDict,function(_data, _word){
      if(_data.f > 1) sorter.push([unfilenameWord(_word.substring(1)),_data.f]);
    });
    sorter.sort(function(a,b){
      if(a[1] < b[1]) return  1;
      if(a[1] > b[1]) return -1;
      return 0;
    });
    var len  = sorter.length;
    var step = Math.floor(len/100);
    for(var i=0; i<100; i++){
      var s = sorter.slice(step*i, step*(i+1));
      //var s2 = [];
      //for(var j=0; j<s.length; j++) s2.push(unfilenameWord(s[j][0].substring(1)));
      fs.writeFileSync(PATH_DST+"/sort_f/"+(i+1)+".js", getObjAsJSInlineCallback("sort_f", (i+1), s));
    }
    console.log("Total findable words = "+sorter.length);
    // --
    console.log("Building Table of Contents (TOC)");
    fs.readdir(PATH_DST+"/defs", function(err, files) {
    	if (err) return;
      var toc = [];
    	files.forEach(function(f){
        if(f && f.lastIndexOf(".js") == f.length-3){
          toc.push(f.substring(0,f.length-3));
        }
    	});
      toc.sort();
      fs.writeFileSync(PATH_DST+"/toc.js", getObjAsJSInlineCallback("toc", "toc", toc));
    });
  }
}
if(STAGE == 3){
	fsExtra.copy(__dirname+"/src/wordist.js", PATH_DST+"/wordist.js", function(err){
		if(err) console.log(err);
    // --
    console.log("DONE!");
  });
}

