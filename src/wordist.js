var wordist = (function(){
  var exports = {};
  // --
  var path  = "../dist";
  // --
  var RHYME_GROUP_MAX_CHARS = 5;
  function getSubPhonesRhymeKeyFromPhones(phones){
    let startAtPhoneIndex = -1;
    for(let p=phones.length-1; p>=0; p--){
      if(phones[p].indexOf("1")>0){
        startAtPhoneIndex = p;
        break;
      }
    }
    if(startAtPhoneIndex == -1){
      //console.log("No primary vowel stress?",line);
      for(let p=phones.length-1; p>=0; p--){
        if(phones[p].indexOf("2")>0){
          startAtPhoneIndex = p;
          break;
        }
      }
      if(startAtPhoneIndex == -1){
        //console.log("No secondary vowel stress?",line);
        for(let p=phones.length-1; p>=0; p--){
          if(phones[p].indexOf("3")>0){
            startAtPhoneIndex = p;
            break;
          }
        }
        if(startAtPhoneIndex == -1){
          //console.log("No tertiary vowel stress?",line);
          for(let p=phones.length-1; p>=0; p--){
            if(phones[p].indexOf("0")>0){
              startAtPhoneIndex = p;
              break;
            }
          }
          if(startAtPhoneIndex == -1){
            //console.log("No zero vowel stress?",line);
            return null;
          }
        }
      }
    }
    // --
    let subPhones = phones.slice(startAtPhoneIndex);
    let subPhonesKey = subPhones.join("-");
    return subPhonesKey;
  }
  // --
  var dataReqd  = {};
  var dataCache = {};
  var dataCbs   = {};
  // --
  let unhelpfulWords = [
    // articles
    "a","an","the",
    // conjunctions
    "albeit","altho","although","an","and","because","both","cause","either","except","excepting","for","forasmuch","gin","howbeit","however","if","lest","ma","neither","nisi","nor","only","or","provided","qua","save","saving","seeing","since","so","syne","than","then","tho","though","till","unless","until","where","whereas","whether","while","whiles","without","yet",
    // pronouns and common placeholders
    "cestuy","he","hers","herself","him","himself","his","i","it","its","itself","me","myself","one","oneself","our","ours","ourselves","she","thee","them","themselves","these","they","those","thou","thy","thyself","us","we","what","when","whate'er","whatever","whatsoe'er","whether","which","whilk","who","whoever","whom","whomsoever","whose","whosesoever","whoso","whosoever","ye","you","yours","yourself","that","my","your","her","their","theirs","mine","why","how","there",
    // prepositions
    "a","abaft","aboard","aboon","about","above","across","adown","afore","after","against","along","amid","amidst","among","anenst","around","aslant","at","athwart","bating","before","behind","below","beneath","beside","besides","between","betwixt","beyond","but","by","concerning","cross","cum","dehors","despite","down","durante","during","except","for","foreby","forenenst","forth","from","'gainst","gin","in","inside","into","malgre","mauger","mid","midst","'mongst","near","nigh","notwithstanding","o'","of","off","on","onto","over","overthwart","par","past","pending","per","pro","regarding","respecting","rising","round","sans","senza","since","sine","through","throughout","thwart","till","to","touching","toward","under","underneath","until","unto","up","upon","uptill","versus","via","vice","while","with","within","without",
    // helping verbs
    "am","is","are","was","were","being","been","be","have","has","had","do","does","did","will","would","shall","should","may","might","must","can","could",
    // negation
    "not","no",
    // too common
    "as","like","unlike","if","similar","especially","typically","commonly","specifically","often","usually","called","used","former","latter","also","pertaining","anything","something","other","supposed","any","resemble","resembling","differs","different","etc","few","many","containing","contains","termed","term","collectively","belonging","use","sets","set","see","esp",
  ];
  function distillTextToMeaningfulWordArr(txt,otherUnhelpfulWordsArr){
    otherUnhelpfulWordsArr = otherUnhelpfulWordsArr||[];
    let txtArr = (txt||"").toLowerCase().replace(/\s\s+/g, ' ').replace(/[^A-Za-z0-9\' ]/g, '').trim().split(" ");
    let meaningfulWords = [];
    for(let i=0; i<txtArr.length; i++){
      let w = txtArr[i]||"";
      // only keep if helpful and not a contraction.
      if(unhelpfulWords.indexOf(w) < 0 && w.indexOf("'") < 0 && otherUnhelpfulWordsArr.indexOf(w) < 0 && w.length > 1) meaningfulWords.push(w);
    }
    return meaningfulWords;
  }
  // --
  exports._dataCache = dataCache;
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
  exports.replaceDiacritics = replaceDiacritics;
  // --
  function unfilenameWord(w){
    return (w||"").replace(/\_/g, " ").replace(/\~/g, "'");
  }
  function filenameWord(w){
    return replaceDiacritics(w||"").toLowerCase().replace(/[^a-z0-9\-\.\ \']/g, "").replace(/\ /g, "_").replace(/\'/g, "~");
  }
  // --
  //var scriptPreDefID = "wordist_st_defs_";
  function addDataScript(rid, url, id, cb){
    var st = document.createElement("script");
    st.setAttribute("src", url);
    st.setAttribute("id",  rid);
    st.onerror = function(err){cb(null,id);removeDataScript(rid);};
    addDataCbForRid(rid,cb);
    document.body.appendChild(st);
    dataReqd[rid] = 1;
  }
  function removeDataScript(rid){
    var st = document.getElementById(rid);
    if(st) st.remove();
  }
  function addDataCbForRid(rid,cb){
    dataCbs[rid] = dataCbs[rid]||[];
    dataCbs[rid].push(cb);
  }
  function callDataCbsAndRemoveScript(rid,id){
    var cbs = dataCbs[rid]||[];
    delete dataCbs[rid];
    for(var i=0; i<cbs.length; i++){
      cbs[i](null, id);
    }
    // --
    removeDataScript(rid);
  }
  // --
  var dataRootID = "wordist_d_";
  function requestData(pre, key, cb){
    var rid = dataRootID+pre+key;
    if(dataReqd[rid]){
      if(!dataCbs[rid]) cb(null,key);
      else addDataCbForRid(rid,cb);
      return;
    }
    var url = path;
    switch(pre){
      case _DEFS:   url += "/defs/"+key+".js";   break;
      case _RHYMES: url += "/rhymes/"+key+".js";   break;
      case _POS:    url += "/pos/"+key+".js";    break;
      case _FIND:   url += "/sort_f/"+key+".js"; break;
      case _FIELD:  url += "/fields/"+key+".js"; break;
      case _TOC:    url += "/toc.js";            break;
      case _FIELDS: url += "/fields.js"; break;
      default: console.log("Unknown request pre:", pre);
    }
    addDataScript(rid, url, key, cb);
  }
  // --
  var _DEFS   = "defs_";
  var _RHYMES = "rhymes_";
  var _POS    = "pos_";
  var _FIND   = "find_";
  var _TOC    = "toc_";
  var _FIELD  = "field_";
  var _FIELDS = "fields_";
  window.on_defs_cb     = function(key, data){
    var pre = _DEFS;
    var rid = dataRootID+pre+key;
    // --
    $.each(data,function(key2,val){
      var k2 = key2.substring(1);
      dataCache[_DEFS+key+k2] = val;
    });
    // --
    callDataCbsAndRemoveScript(rid,key);
  };
  window.on_pos_cb      = function(key, data){
    var pre = _POS;
    var rid = dataRootID+pre+key;
    // --
    dataCache[pre+key] = data||[];
    // --
    callDataCbsAndRemoveScript(rid,key);
  };
  window.on_field_cb    = function(key, data){
    var pre = _FIELD;
    var rid = dataRootID+pre+key;
    // --
    dataCache[pre+key] = data||[];
    // --
    callDataCbsAndRemoveScript(rid,key);
  };
  window.on_sort_f_cb   = function(key, data){
    var pre = _FIND;
    var rid = dataRootID+pre+key;
    // --
    dataCache[pre+key] = data||[];
    // --
    callDataCbsAndRemoveScript(rid,key);
  };
  window.on_toc_cb      = function(key, data){
    var pre = _TOC;
    var rid = dataRootID+pre+key;
    // --
    dataCache[pre+key] = data||{};
    // --
    callDataCbsAndRemoveScript(rid,key);
  };
  window.on_fields_cb   = function(key, data){
    var pre = _FIELDS;
    var rid = dataRootID+pre+key;
    // --
    dataCache[pre+key] = data||[];
    // --
    callDataCbsAndRemoveScript(rid,key);
  };
  window.on_rhymes_cb   = function(key, data){
    var pre = _RHYMES;
    var rid = dataRootID+pre+key;
    // --
    //console.log("rhymes winddow cb!",key,data);
    $.each(data,function(key2,val){
      //var k2 = key2.substring(1);
      let v2 = val||[];
      let prettyVals = [];
      for(let i=0; i<v2.length-1; i+=2){
        prettyVals.push({w:v2[i],f:v2[i+1]});
      }
      dataCache[_RHYMES+key2] = prettyVals;
    });
    // --
    callDataCbsAndRemoveScript(rid,key);
  };
  // --
  exports.getDef        = function(word, cb, _dontRedirect, _tryFallbacks){
    if(!word || word.search(/[a-zA-Z]/) != 0) return cb(null,word);
    //console.log("looking up word: ", word);
    var wf     = filenameWord(word.replace(/\./g,""));
    var prefix = wf.substring(0,3);
    if(dataCache[_TOC+"toc"] && dataCache[_TOC+"toc"].defs && dataCache[_TOC+"toc"].defs.indexOf(prefix) < 0){
      //console.log("Shouldn't try to fetch def for word prefix that doesn't have a TOC entry.");
      return cb(null, unfilenameWord(wf), null);
    }
    requestData(_DEFS, prefix, function(err){
      if(err) return console.warn(err);
      var data = dataCache[_DEFS+wf];
      // --
      if(!_dontRedirect && typeof(data) == "string"){
        // Alternate/similar word redirect!
        return exports.getDef(unfilenameWord(data.substring(1)),cb,true);
      }
      if(!data){
        if(_tryFallbacks){
          var z = wf;
          if(wf.search(/(s|y)$/) > 0){
            if(!data){ z = wf.substring(0,wf.length-1);      data = dataCache[_DEFS+z];}
          }
          if(wf.search(/(ly)$/) > 0){
            if(!data){ z = wf.substring(0,wf.length-1);      data = dataCache[_DEFS+z];}
            if(!data){ z = wf.substring(0,wf.length-2);      data = dataCache[_DEFS+z];}
            if(!data){ z = wf.substring(0,wf.length-1)+"e";  data = dataCache[_DEFS+z];}
          }
          if(wf.search(/(er|al|es)$/) > 0){
            if(!data){ z = wf.substring(0,wf.length-1);      data = dataCache[_DEFS+z];}
            if(!data){ z = wf.substring(0,wf.length-2);      data = dataCache[_DEFS+z];}
          }
          if(wf.search(/(ed)$/) > 0){
            if(!data){ z = wf.substring(0,wf.length-1);      data = dataCache[_DEFS+z];}
            if(!data){ z = wf.substring(0,wf.length-2);      data = dataCache[_DEFS+z];}
            if(!data){ z = wf.substring(0,wf.length-3);      data = dataCache[_DEFS+z];}
          }
          if(wf.search(/(est|ish)$/) > 0){
            if(!data){ z = wf.substring(0,wf.length-3);      data = dataCache[_DEFS+z];}
          }
          if(wf.search(/(ing)$/) > 0){
            if(!data){ z = wf.substring(0,wf.length-3);      data = dataCache[_DEFS+z];}
            if(!data){ z = wf.substring(0,wf.length-4);      data = dataCache[_DEFS+z];}
            if(!data){ z = wf.substring(0,wf.length-3)+"e";  data = dataCache[_DEFS+z];}
          }
          if(wf.search(/(like|ness|ment|able)$/) > 0){
            if(!data){ z = wf.substring(0,wf.length-4);      data = dataCache[_DEFS+z];}
          }
          if(wf.search(/(un|in)/) == 0){
            if(!data) return exports.getDef(unfilenameWord(wf.substring(2)),cb,false,false);
          }
          // --
          if(data){
            if(typeof(data) == "string"){
              // Alternate/similar word redirect!
              return exports.getDef(unfilenameWord(data.substring(1)),cb,true);
            }else{
              wf = z;
            }
          }
        }
        // --
        if(!data) return cb(null, unfilenameWord(wf), null);
      }
      // --
      let root = unfilenameWord(wf);
      let entries = data.e||[];
      let seeAlso = {
				words: [],
				phrases: [],
				usedBy: []
			};
			for(var i=0; i<entries.length; i++){
				var defs = entries[i][1]||[];
				for(var j=0; j<defs.length; j++){
					var def = defs[j]||"";
					let semis = def.split(";");
					if(semis.length > 1){
						for(let k=0; k<semis.length; k++){
							let semiA = semis[k].toLowerCase();
							let semiAs = semiA.split(",");
							for(let m=0; m<semiAs.length; m++){
								let semi = $.trim(semiAs[m]);
								semi = semi.replace(/(^)(a|as|an|in|the|or|to|and)(\s|$)/g, "");
                semi = semi.replace(/(^)(a|as|an|in|the|or|to)(\s|$)/g, "");
								semi = semi.replace(/(\.|\!|\?|\-)/g, "");
								semi = $.trim(semi).toLowerCase();
								// --
								let semiWords = (semi.split(" ")||[]).length;
								if(k == 0 && semiWords > 1) continue; // most definitions start with a phrase/sentence, and then provide similar words and examples...
								// --
								semi = semi.replace(/(^)(usually|popularly|often|sometimes)(\s|$)/g, "");
                semi = semi.replace(/(^)(also)(\s|$)/g, "");
                semi = semi.replace(/(^)(typically|especially|specifically)(\s|$)/g, "");
                semi = semi.replace(/(^)(like)(\s|$)/g, "");
                semi = semi.replace(/(^)(so)(\s|$)/g, "");
								semi = semi.replace(/(^)(called)(\s|$)/g, "");
                semi = semi.replace(/(^)(used)(\s|$)/g, "");
                semi = semi.replace(/(^)(whether)(\s|$)/g, "");
                semi = semi.replace(/(^)(see (above|below|synonym|definition|def|defs|image|picture|entry))(\s|$)/g, "");
                semi = semi.replace(/(^)(above|below)(\s|$)/g, "");
                // --
                semi = semi.replace(/(^)(a|as|an|in|so|the|that|is|or|to|with|esp|of)(\s|$)/g, ""); // esp = "especially" in dictionary speak
								semi = semi.replace(/(^)(a|as|an|in|so|the|that|is|or|to|with|esp|of)(\s|$)/g, ""); // esp = "especially" in dictionary speak
                semi = semi.replace(/(^)(plural|singular)(\s|$)/g, "");
								// --
								if(semi.length < 2) continue; // entry is blank after cleaning.
								if(semi == root) continue; // entry is same as root after cleaning.
								if(semiWords > 5) continue; // seems too long.
								if(semi.indexOf(",")>=0) continue; // looks like multiples.
								if(semi.indexOf("etc")>=0) continue; // looks like etc.
								if(semi.indexOf(")")>=0) continue; // something is not quite right
								if(semi.indexOf("(")>=0) continue; // something is not quite right
                if(semi.indexOf("{")>=0) continue; // something is not quite right
                if(semi.indexOf("}")>=0) continue; // something is not quite right
								// --
								if(semi.indexOf(root) >= 0){
									if(seeAlso.usedBy.indexOf(semi) < 0) seeAlso.usedBy.push(semi);
								}else if(semi.indexOf(" ") > 0){
									if(seeAlso.phrases.indexOf(semi) < 0) seeAlso.phrases.push(semi);
								}else{
									if(seeAlso.words.indexOf(semi) < 0) seeAlso.words.push(semi);
								}
							}
						}
					}
				}
			}
      data.seeAlso = seeAlso;
      // --
      let keyWordsTxt = "";
      let des = data.e||[];
      for(let i=0; i<des.length; i++){
        let de = (des[i]||[])[1]||[];
        for(let j=0; j<de.length; j++){
          keyWordsTxt += (de[j]||"")+" ";
        }
      }
      data.keyWords = [... new Set(distillTextToMeaningfulWordArr(keyWordsTxt,(data.a||[]).concat([root])))];
      // --
      let r = [];
      let ps = data.p||[];
      for(let i=0; i<ps.length; i++){
        let pron = ps[i];
        let subPhonesKeys = [];
        for(let x=0; x<pron.length; x++){
          subPhonesKeys.push(getSubPhonesRhymeKeyFromPhones((pron[x]||"").split("-"))||"");
        }
        r.push(subPhonesKeys);
      }
      data.r = r;
      // --
      return cb(null, root, data);
    });
  };
  exports.getDefClosest = function(word, cb){
    exports.getDef(word, cb, false, true);
  }
  exports.getPoSAll     = function(pos, cb){
    requestData(_POS, pos, function(err){
      if(err) return console.warn(err);
      return cb(null, pos, dataCache[_POS+pos]);
    });
  };
  exports.getPoSRandom  = function(pos, cb){
    exports.getPoSAll(pos, function(err,pos,words){
      if(err) return cb(err);
      words = words||[];
      return cb(null, words[Math.floor(words.length*Math.random())]);
    });
  };
  exports.getFieldAll   = function(field, cb){
    requestData(_FIELD, field, function(err){
      if(err) return console.warn(err);
      return cb(null, field, dataCache[_FIELD+field]);
    });
  };
  exports.getFindable   = function(percent, cb){
    percent = Math.round(percent||1);
    requestData(_FIND, percent, function(err){
      if(err) return console.warn(err);
      return cb(null, percent, dataCache[_FIND+percent]);
    });
  };
  exports.getTOC        = function(cb){
    requestData(_TOC, "toc", function(err){
      if(err) return console.warn(err);
      return cb(null, dataCache[_TOC+"toc"]);
    });
  };
  exports.getFields     = function(cb){
    requestData(_FIELDS, "fields", function(err){
      if(err) return console.warn(err);
      return cb(null, dataCache[_FIELDS+"fields"]);
    });
  };
  exports.getPage       = function(pg, cb){
    exports.getDef(pg, function(err, data){
      if(err) return console.warn(err);
      var pgs = [];
      var pgHeader = _DEFS+(pg||"").toLowerCase();
      for(rid in dataCache){
        if(rid.indexOf(pgHeader) == 0) pgs.push(rid.substring(_DEFS.length));
      }
      return cb(null, pgs);
    });
  }
  exports.getDefRandom  = function(cb){
    exports.getTOC(function(err,toc){
      if(err) return console.warn(err);
      var pg = toc[Math.floor(toc.length*Math.random())];
      exports.getPage(pg, function(err,words){
        if(err) return console.warn(err);
        var word = words[Math.floor(words.length*Math.random())];
        exports.getDef(word, cb);
      });
    })
  };
  // --
  exports.getRhymes     = function(rhymeKey, cb){
    if(!rhymeKey) return cb(null,rhymeKey,null);
    //console.log("looking up word: ", word);
    var rk      = filenameWord(rhymeKey.replace(/\./g,""));
    var rkGroup = rk.substring(0,RHYME_GROUP_MAX_CHARS);
    if(dataCache[_TOC+"toc"] && dataCache[_TOC+"toc"].rhymes && dataCache[_TOC+"toc"].rhymes.indexOf(rkGroup) < 0){
      //console.log("Shouldn't try to fetch def for word prefix that doesn't have a TOC entry.");
      return cb(null, unfilenameWord(rk), null);
    }
    requestData(_RHYMES, rkGroup, function(err){
      if(err) return console.warn(err);
      var data = dataCache[_RHYMES+rk];
      // --
      let root = unfilenameWord(rk);
      //console.log("rhyme data!",data);
      // --
      return cb(null, root, data);
    });
  };
  // --
  exports.prettyPoS     = function(pos){
    switch(pos){
      case "noun": return "noun";
      case "verb": return "verb";
      case "adje": return "adjective";
      case "adve": return "adverb";
      case "pron": return "pronoun";
      case "prep": return "preposition";
      case "conj": return "conjunction";
      case "inte": return "interjection";
      case "arti": return "article";
      case "unkn": return "";
    }
    return pos;
  }
  // --
  exports.distillText   = distillTextToMeaningfulWordArr;
  // --
  exports.init = function(options){
    path = options.path || "../dist";
    // We fetch the TOC on init so we can check if a prfix exists before trying to
    // request it, but wordist is ready to run immedidately (there's just a chance of
    // a returned error / page-not-found before the TOC is loaded).
    exports.getTOC(function(err,toc){
      if(err) return console.warn(err);
    });
  };
  // --
  return exports;
})();
