/*
Updated versions can be found at https://github.com/mikeymckay/google-spreadsheet-javascript
*/
var GoogleSpreadsheet, GoogleUrl;
GoogleUrl = (function() {
  function GoogleUrl(sheetId, title) {
    this.sheetId = sheetId;
    this.title = title || 'Sheet1';
    if (this.sheetId.match(/http(s)*:/)) {
	  this.sheetId = this.sheetId.match(/d\/(.*?)\//)[1];
    }
    this.jsonUrl = "https://sheets.googleapis.com/v4/spreadsheets/"+this.sheetId+"/values/"+this.title+"?key=AIzaSyCQ4qF8BQb88PhXyYSjnngXdCFrLPPfVFY";
  }
  return GoogleUrl;
})();
GoogleSpreadsheet = (function() {
  function GoogleSpreadsheet() {}
  GoogleSpreadsheet.prototype.load = function(callback) {
    var intervalId, safetyCounter, waitUntilLoaded;
    var url, googleUrl;
    //url = this.googleUrl.jsonCellsUrl + "&callback=GoogleSpreadsheet.callback";
    //$('body').append("<script src='" + url + "'/>");
    
    url = this.googleUrl.jsonUrl + "&callback=GoogleSpreadsheet.callback";
    $('body').append("<script src='" + url + "'/>");
    
    googleUrl = this.googleUrl;
    safetyCounter = 0;
    waitUntilLoaded = function() {
      var result;
      result = GoogleSpreadsheet.find({
        googleUrl: googleUrl
      });
      if (safetyCounter++ > 20 || ((result != null) && (result.data != null))) {
        clearInterval(intervalId);
        return callback(result);
      }
    };
    intervalId = setInterval(waitUntilLoaded, 200);
    if (typeof result != "undefined" && result !== null) {
      return result;
    }
  };
  GoogleSpreadsheet.prototype.url = function(url, gid) {
    return this.googleUrl(new GoogleUrl(url, gid));
  };
  GoogleSpreadsheet.prototype.googleUrl = function(googleUrl) {
    if (typeof googleUrl === "string") {
      throw "Invalid url, expecting object not string";
    }
    this.sheetId = googleUrl.sheetId;
    this.title = googleUrl.title;
    this.jsonUrl = googleUrl.jsonUrl;
    return this.googleUrl = googleUrl;
  };
  GoogleSpreadsheet.prototype.save = function() {
    return localStorage["GoogleSpreadsheet." + this.googleUrl.title] = JSON.stringify(this);
  };
  return GoogleSpreadsheet;
})();
GoogleSpreadsheet.bless = function(object) {
  var key, result, value;
  result = new GoogleSpreadsheet();
  for (key in object) {
    value = object[key];
    result[key] = value;
  }
  return result;
};
GoogleSpreadsheet.find = function(googleUrl) {
  var item, itemObject, key, value, _i, _len;
  try {
    for (item in localStorage) {
      if (item.match(/^GoogleSpreadsheet\./)) {
        itemObject = JSON.parse(localStorage[item]);
          if (item.title === googleUrl.title) {
            return GoogleSpreadsheet.bless(itemObject);
          }
      }
    }
  } catch (error) {
    for (_i = 0, _len = localStorage.length; _i < _len; _i++) {
      item = localStorage[_i];
      if (item.match(/^GoogleSpreadsheet\./)) {
        itemObject = JSON.parse(localStorage[item]);
          if (item.title === googleUrl.title) {
            return GoogleSpreadsheet.bless(itemObject);
          }
      }
    }
  }
  return null;
};
GoogleSpreadsheet.callback = function(data) {
  /*
  var cell, googleSpreadsheet, googleUrl;
  googleUrl = new GoogleUrl(data.feed.id.$t, data.feed.id.$t.match(/(.)\/public/)[1]);
  googleSpreadsheet = GoogleSpreadsheet.find({
    googleUrl: googleUrl
  });
  if (googleSpreadsheet === null) {
    googleSpreadsheet = new GoogleSpreadsheet();
    googleSpreadsheet.googleUrl(googleUrl);
  }
  googleSpreadsheet.data = (function() {
    var _i, _len, _ref, _results;
    _ref = data.feed.entry;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cell = _ref[_i];
      var obj = {};
      var row = cell.content.$t.split(', ');
      for(var j=0; j < row.length; j++) {
        var col = row[j];
        var val = col.split(': ');
        if(val[1].startsWith('"')) {
          obj[val[0]] =  val[1].substr(1, val[1].length-2);
        } else {
          obj[val[0]] =  val[1];  
        }
        
      }
      _results.push(obj);
    }
    return _results;
  })();
  googleSpreadsheet.save();
  */
  
  var googleSpreadsheet, googleUrl;
  googleUrl = new GoogleUrl('', data.range.substr(0, data.range.indexOf('!')));
  googleSpreadsheet = GoogleSpreadsheet.find({
    googleUrl: googleUrl
  });
  if (googleSpreadsheet === null) {
    googleSpreadsheet = new GoogleSpreadsheet();
    googleSpreadsheet.googleUrl(googleUrl);
  }

  googleSpreadsheet.data = data.values;
  
  googleSpreadsheet.save();
  
  return googleSpreadsheet;
};