// color variables
var start_color = '#CE3000';
var end_color = '#47B700';
// battery slider variables
var batteryLvl = 50;
var slider = document.getElementById('batteryValInp');
var batteryDisplay = document.getElementById('batteryVal');
// car type select variable
var carType = 'hatchback';

// CREDENTIALS
var platform = new H.service.Platform({
  'apikey': 'IEt8dt3NQy3h3phRpCJ_XxK_rcmpHjSlsSZ0GlfBT8U'
});

// Obtain the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(
  document.getElementById('mapContainer'),
  defaultLayers.vector.normal.map,
  {
    zoom: 5,
    center: { lat: 49.8, lng: 15.47 }
  }
);

// Adding tilt to the map:
map.getViewModel().setLookAtData({
  tilt: 45
});

// Create the default UI:
var ui = H.ui.UI.createDefault(map, defaultLayers, 'en-US');
ui.getControl('mapsettings').setDisabled(false)
ui.getControl('zoom').setDisabled(false)
ui.getControl('scalebar').setDisabled(false)

// Positions of the UI components:
var mapSettings = ui.getControl('mapsettings');
var scalebar = ui.getControl('scalebar');
mapSettings.setAlignment('top-left');
scalebar.setAlignment('bottom-right');

// Enable the event system on the map instance:
var mapEvents = new H.mapevents.MapEvents(map);
var behavior = new H.mapevents.Behavior(mapEvents);

// Emergency Contacts:
function getNumber(i) {
  /* numbers */
  var msg;
  // var countryName = i[i.length - 1].slice(1);
  var countryName = i
  $.ajax({
    url: window.location.href + "view/" + countryName,
    type: 'GET',
    dataType: 'json', // added data type
    async: false,
    success: function (data) {
      if (data['COUNTRY'] == null) {
        msg = `<div class="ui info message" style="margin-top: 0.3vh;">
                      <div class="header">
                          Not Available for this region, please click somewhere else
                      </div>
                  Click <a href="https://www.adducation.info/general-knowledge-travel-and-transport/emergency-numbers/"><b>here</b></a> for countrywise list of emergency numbers
                  </div>`
      } else {
        var printer = ["COUNTRY", "CALLCODES", "EMERGENCY", "POLICE", "AMBULANCE", "FIRE"];
        msg = `<div class="ui six tiny horizontal statistics">`;
        printer.forEach(field => {
          msg = msg + `<div class="statistic">
                  <div class="value">
                  ${emptlyValueNumbers(data[field])}
                  </div>
                  <div class="label">
                    ${field}
                  </div>
                </div>`
        });
        msg += `</div>`;
      }
    }
  });
  return msg;
}

// Emergency Contacts Helper: 
function emptlyValueNumbers(k) {
  if (k == "") {
    return `<i class="ban icon"></i>`;
  } else {
    return k;
  }
}

// Reverse GeoCode:
var geocoder = platform.getSearchService();
function revGeocode(lat, lon) {
  var sol = lat + "," + lon;
  let geocodeParam = {
    at: sol,
    lang: 'en-US'
  }

  function onResult(result) {
    if (result.items.length > 0) {
      // console.log(result.items[0].address)
      // console.log(result.items[0].address.countryName)
      var x = result.items[0].address.countryName;
      document.getElementById("status").innerHTML = '<h3>' + result.items[0].title + '</h3>';
      // var i = x.split(",");
      document.getElementById("contacts").innerHTML = getNumber(x);
    } else if (result.items.length == 0) {
      document.getElementById("status").innerHTML = "<h1>funCharge</h1>";
    }
  }

  geocoder.reverseGeocode(geocodeParam, onResult, alert);
}

// mark positions button
markPosition = () => {
  // TODO: start and end position mark logic
  document.getElementById('routeBtn').classList.remove("disabled")
}

// function to get gradient color
getGradientColor = function (start_color, end_color, percent) {
  // strip the leading # if it's there
  start_color = start_color.replace(/^\s*#|\s*$/g, '');
  end_color = end_color.replace(/^\s*#|\s*$/g, '');

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (start_color.length == 3) {
    start_color = start_color.replace(/(.)/g, '$1$1');
  }

  if (end_color.length == 3) {
    end_color = end_color.replace(/(.)/g, '$1$1');
  }

  // get colors
  var start_red = parseInt(start_color.substr(0, 2), 16),
    start_green = parseInt(start_color.substr(2, 2), 16),
    start_blue = parseInt(start_color.substr(4, 2), 16);

  var end_red = parseInt(end_color.substr(0, 2), 16),
    end_green = parseInt(end_color.substr(2, 2), 16),
    end_blue = parseInt(end_color.substr(4, 2), 16);

  // calculate new color
  var diff_red = end_red - start_red;
  var diff_green = end_green - start_green;
  var diff_blue = end_blue - start_blue;

  diff_red = ((diff_red * percent) + start_red).toString(16).split('.')[0];
  diff_green = ((diff_green * percent) + start_green).toString(16).split('.')[0];
  diff_blue = ((diff_blue * percent) + start_blue).toString(16).split('.')[0];

  // ensure 2 digits by color
  if (diff_red.length == 1) diff_red = '0' + diff_red
  if (diff_green.length == 1) diff_green = '0' + diff_green
  if (diff_blue.length == 1) diff_blue = '0' + diff_blue

  return '#' + diff_red + diff_green + diff_blue;
};

var accentColor;
// DOMcontentloaded function
document.addEventListener('DOMContentLoaded', function () {
  // battery slider
  accentColor = getGradientColor(start_color, end_color, batteryLvl / 100)
  batteryDisplay.style.color = accentColor
  batteryDisplay.innerHTML = batteryLvl
  // cartype
  document.getElementById(carType).style.backgroundColor = accentColor;
}, false);

// car type select
carSelect = (carSelected) => {
  // console.log("car clicked " + carSelected)
  if (carType != carSelected) {
    document.getElementById('hatchback').style.backgroundColor = '#FFFFFF';
    document.getElementById('sedan').style.backgroundColor = '#FFFFFF';
    document.getElementById('SUV').style.backgroundColor = '#FFFFFF';
  }
  carType = carSelected
  document.getElementById(carType).style.backgroundColor = accentColor;
};


// battery slider value update
slider.addEventListener('input', (event) => {
  // slider.style.color = getGradientColor('#FF0000', '#00FF00', slider.value / 100)
  batteryLvl = slider.value
  accentColor = getGradientColor(start_color, end_color, batteryLvl / 100)
  document.getElementById(carType).style.backgroundColor = accentColor;
  batteryDisplay.style.color = accentColor
  batteryDisplay.innerHTML = slider.value
});

function globalFncTap(evt) {
  var coord = map.screenToGeo(evt.currentPointer.viewportX,
    evt.currentPointer.viewportY);
  var lat = coord.lat.toFixed(4);
  var lon = coord.lng.toFixed(4);
  revGeocode(lat, lon);
};

// Listening to current map location:
function ClickListener(map) {
  // Attach an event listener to map display
  // obtain the coordinates and display in an alert box.
  map.addEventListener('tap', globalFncTap);

}

ClickListener(map);

var str = "not set";
var end = "not set";

// Create a style object:
var circleStyle = {

  strokeColor: 'green',
  fillColor: 'rgba(66, 245, 126, 0.25)',
  opacity: 0.5

};

function getBrowserPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      // console.log(position.coords);
      var browserPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
      // Create a marker:
      var icon = new H.map.Icon('assets/gps.png');
      let marker = new H.map.Marker(browserPosition, { icon: icon });
      // Instantiate a circle object (using the default style):
      // console.log(position.coords)
      placeRecreations(browserPosition, 20)
      var circle = new H.map.Circle({ lat: position.coords.latitude + 0.015, lng: position.coords.longitude }, 5000, { style: circleStyle });
      marker.setData("You're here!");
      // Add the circle to the map:
      map.addObject(circle);
      map.setCenter(browserPosition);
      map.addObject(marker);
    });
  } else {
    alert("Geolocation is not supported by this browser!");
  }
}

function setUpClickListener(map) {
  // Attach an event listener to map display
  // obtain the coordinates and display in an alert box.

  // hide route stats of current route
  if (document.getElementById("routeStats").style.display == 'initial') {
    document.getElementById("routeStats").style.display = "none";
  }


  document.getElementById("status").innerHTML = "<h4>Select <b>START</b> and <b>END</b> points on the map</h4>";
  var cnt = 0;
  map.addEventListener('tap', fnc);
  map.removeEventListener('tap', globalFncTap);
  function fnc(evt) {
    var coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
    let Pos = { lat: coord.lat, lng: coord.lng };


    var ans = Pos.lat + ',' + Pos.lng;
    if (cnt == 0) {
      document.getElementById("status").innerHTML = "<h4><b>START</b> point selected</h4>";
      str = ans;
      let strIcon = new H.map.Icon('assets/start.png');
      let strMarker = new H.map.Marker(Pos, { icon: strIcon });
      map.addObject(strMarker);
      strMarker.setData("START for routing!");
      console.log("START: " + str);
    }
    if (cnt == 1) {
      document.getElementById("status").innerHTML = "<h4><b>END</b> point selected</h4>";
      end = ans;
      let endIcon = new H.map.Icon('assets/end.png');
      let endMarker = new H.map.Marker(Pos, { icon: endIcon });
      map.addObject(endMarker);
      endMarker.setData("END for routing!");
      console.log("END: " + end);
    }

    cnt++;
    if (cnt == 2) {

      map.removeEventListener('tap', fnc);
      // alert("Use ROUTE button to trace your path on the map");
      map.addEventListener('tap', globalFncTap);
      $('#routeBtn').removeClass("disabled");
      $('#markBtn').addClass("disabled");
    }
    //console.log('Clicked at ' + coord.lat.toFixed(4) +
    // ((coord.lat > 0) ? 'N' : 'S') +
    /// ' ' + coord.lng.toFixed(4) +
    /// ((coord.lng > 0) ? 'E' : 'W'));
  }

}

function clickToMark() {
  // Add event listener:
  map.addEventListener('longpress', function (evt) {
    if (evt.target instanceof H.map.Marker) {
      //bubble
      // Create an info bubble object at a specific geographic location:
      var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
        content: evt.target.getData()
      });
      // Add info bubble to the UI:
      ui.addBubble(bubble);
    }
    else {
      // Log 'tap' and 'mouse' events:
      var cnt = 0;
      console.log(evt); // too much data here (try to minify)
      let pointer = evt.currentPointer;
      let imgIcon = new H.map.Icon('assets/robot.png');
      let pointerPoistion = map.screenToGeo(pointer.viewportX, pointer.viewportY);
      let pointerMarker = new H.map.Marker(pointerPoistion, { icon: imgIcon, volatility: true });
      pointerMarker.draggable = true;
      if (cnt == 0) {
        var userData = prompt("Enter some data for this pointer:");
        pointerMarker.setData(userData);
        console.log("Pointer added!");
      } else {
        pointerMarker.getData();
      }

      map.addObject(pointerMarker);
    }
  });
}

clickToMark();

function clickDragMarkers() {
  // disable the default draggability of the underlying map
  // and calculate the offset between mouse and target's position
  // when starting to drag a marker object:
  map.addEventListener('dragstart', function (ev) {
    var target = ev.target,
      pointer = ev.currentPointer;
    if (target instanceof H.map.Marker) {
      var targetPosition = map.geoToScreen(target.getGeometry());
      target['offset'] = new H.math.Point(pointer.viewportX - targetPosition.x, pointer.viewportY - targetPosition.y);
      behavior.disable();
    }
  }, false);
  // re-enable the default draggability of the underlying map
  // when dragging has completed
  map.addEventListener('dragend', function (ev) {
    var target = ev.target;
    if (target instanceof H.map.Marker) {


      behavior.enable();
    }
  }, false);
  // Listen to the drag event and move the position of the marker
  // as necessary
  map.addEventListener('drag', function (ev) {
    var target = ev.target,
      pointer = ev.currentPointer;
    if (target instanceof H.map.Marker) {
      target.setGeometry(map.screenToGeo(pointer.viewportX - target['offset'].x, pointer.viewportY - target['offset'].y));
    }
  }, false);
}

clickDragMarkers();

function distance(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist;
  }
}

// get map markers
let redChargeIcon = new H.map.Icon('assets/redPump.png'),
  greenChargeIcon = new H.map.Icon('assets/greenPump.png'),
  orangeChargeIcon = new H.map.Icon('assets/orangePump.png'),
  strIcon = new H.map.Icon('assets/start.png'),
  viaIcon = new H.map.Icon('assets/via.png')
endIcon = new H.map.Icon('assets/end.png');
let foodIcon = new H.map.Icon('assets/food.png'),
  shopIcon = new H.map.Icon('assets/shop.png'),
  sightsIcon = new H.map.Icon('assets/museums.png');

// place recreational 
function placeRecreations(position, limit) {
  const radius = 10000  // search radius
  // const limit = limit // limit on results
  let req = 'https://browse.search.hereapi.com/v1/browse?at=' + position.lat + ',' + position.lng + '&categories=100-1000,100-1100,300,600&in=circle:' + position.lat + ',' + position.lng + ';r=' + radius + '&limit=' + limit + '&apiKey=IEt8dt3NQy3h3phRpCJ_XxK_rcmpHjSlsSZ0GlfBT8U'; $.getJSON(req, (resp) => {
    resp = resp["items"]
    for (let i = 0; i < resp.length; i++) {
      let pointerMarker
      category = resp[i]["categories"][0]["id"].split("-")[0];
      // find apt map marker icon
      switch (category) {
        case '550':
          pointerMarker = new H.map.Marker({ lat: resp[i]["position"]["lat"], lng: resp[i]["position"]["lng"] }, { icon: sightsIcon, volatility: true });
        case '100':
          pointerMarker = new H.map.Marker({ lat: resp[i]["position"]["lat"], lng: resp[i]["position"]["lng"] }, { icon: foodIcon, volatility: true });
          break;
        case '300':
          pointerMarker = new H.map.Marker({ lat: resp[i]["position"]["lat"], lng: resp[i]["position"]["lng"] }, { icon: shopIcon, volatility: true });
          break;
        case '600':
          pointerMarker = new H.map.Marker({ lat: resp[i]["position"]["lat"], lng: resp[i]["position"]["lng"] }, { icon: sightsIcon, volatility: true });
          break;
      }
      if(pointerMarker){
        // add to map
        map.addObject(pointerMarker)
        pointerMarker.setData(resp[i]["title"])
      }
    }
  });
}

function route() {
  map.addLayer(defaultLayers.vector.normal.traffic);
  document.getElementById("status").innerHTML = "<h4>Traffic layer added! Routing . . .</h4>"
  $.getJSON('https://router.hereapi.com/v8/routes?departureTime=any&origin=' + str.split(',')[0] + ',' + str.split(',')[1] + '&ev[connectorTypes]=iec62196Type2Combo&transportMode=car&destination=' + end.split(',')[0] + ',' + end.split(',')[1] + '&return=polyline,actions,instructions,summary,routeHandle,passthrough&ev[freeFlowSpeedTable]=0,0.239,27,0.239,45,0.259,60,0.196,75,0.207,90,0.238,100,0.26,110,0.296,120,0.337,130,0.351,250,0.351&ev[trafficSpeedTable]=0,0.349,27,0.319,45,0.329,60,0.266,75,0.287,90,0.318,100,0.33,110,0.335,120,0.35,130,0.36,250,0.36&ev[auxiliaryConsumption]=1.8&ev[ascent]=9&ev[descent]=4.3&ev[makeReachable]=true&ev[initialCharge]=' + batteryLvl + '&ev[maxCharge]=100&ev[chargingCurve]=0,239,32,199,56,167,60,130,64,111,68,83,72,55,76,33,78,17,80,1&ev[maxChargeAfterChargingStation]=72&apiKey=IEt8dt3NQy3h3phRpCJ_XxK_rcmpHjSlsSZ0GlfBT8U', function (data) {
    let sections = data["routes"][0]["sections"];
    let nonGreenChargeIcons = [redChargeIcon, orangeChargeIcon];
    let pointerMarker;
    var duration = 0, length = 0, consumption = 0;
    for (let i = 0; i < sections.length; i++) {
      // Routes:
      // Create a linestring to use as a point source for the route line
      let linestring = H.geo.LineString.fromFlexiblePolyline(sections[i]["polyline"]);

      duration += sections[i]["summary"]["duration"]
      length += sections[i]["summary"]["length"]
      consumption += sections[i]["summary"]["consumption"]

      colors = ["#9400D3", "#f461c3", "#8B4513", "#000000"]
      // Create an outline for the route polyline:
      let routeLine = new H.map.Polyline(linestring, {
        style: {
          lineWidth: 10,
          strokeColor: colors[Math.floor(Math.random() * colors.length)],
          lineTailCap: 'arrow-tail',
          lineHeadCap: 'arrow-head'
        }
      });
      // Create a patterned polyline:
      let routeArrows = new H.map.Polyline(linestring, {
        style: {
          lineWidth: 10,
          fillColor: colors[Math.floor(Math.random() * colors.length)],
          strokeColor: 'rgb(255, 255, 255)',
          lineDash: [0, 2],
          lineTailCap: 'arrow-tail',
          lineHeadCap: 'arrow-head'
        }
      }
      );

      // Add the route polyline and the two markers to the map:
      map.addObjects([routeLine, routeArrows]);

      // Set the map's viewport to make the whole route visible:
      if (i == 0)
        map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });

      // console.log(sections[i]["departure"]["place"]["type"], " Departure : ", { lat: sections[i]["departure"]["place"]["location"].lat, lng: sections[i]["departure"]["place"]["location"].lng })
      // Departure:
      if (sections[i]["departure"]["place"]["type"] == "place") {
        if (i == 0) {
          // startIcon
          placeRecreations(sections[i]["departure"]["place"]["location"], 5)
          pointerMarker = new H.map.Marker({ lat: sections[i]["departure"]["place"]["location"].lat, lng: sections[i]["departure"]["place"]["location"].lng }, { icon: strIcon, volatility: true });
          map.addObject(pointerMarker);
          pointerMarker.setData("START");
        } else {
          // viaIcon
          pointerMarker = new H.map.Marker({ lat: sections[i]["departure"]["place"]["location"].lat, lng: sections[i]["departure"]["place"]["location"].lng }, { icon: viaIcon, volatility: true });
          map.addObject(pointerMarker);
          pointerMarker.setData("VIA");
        }
      } else if (sections[i]["departure"]["place"]["type"] == "chargingStation") {
        placeRecreations(sections[i]["departure"]["place"]["location"], 5)
        // chargingIcon
        pointerMarker = new H.map.Marker({ lat: sections[i]["departure"]["place"]["location"].lat, lng: sections[i]["departure"]["place"]["location"].lng }, { icon: greenChargeIcon, volatility: true });
        map.addObject(pointerMarker);
        pointerMarker.setData("Charging Station");
      }

      // console.log(sections[i]["arrival"]["place"]["type"], " Arrival : ", { lat: sections[i]["arrival"]["place"]["location"].lat, lng: sections[i]["arrival"]["place"]["location"].lng })
      // Arrival:
      if (sections[i]["arrival"]["place"]["type"] == "place") {
        if (i == sections.length - 1) {
          // endIcon
          placeRecreations(sections[i]["arrival"]["place"]["location"], 5)
          pointerMarker = new H.map.Marker({ lat: sections[i]["arrival"]["place"]["location"].lat, lng: sections[i]["arrival"]["place"]["location"].lng }, { icon: endIcon, volatility: true });
          map.addObject(pointerMarker);
          pointerMarker.setData("END");
        } else {
          // viaIcon
          pointerMarker = new H.map.Marker({ lat: sections[i]["arrival"]["place"]["location"].lat, lng: sections[i]["arrival"]["place"]["location"].lng }, { icon: viaIcon, volatility: true });
          map.addObject(pointerMarker);
          pointerMarker.setData("VIA");
        }
      } else if (sections[i]["arrival"]["place"]["type"] == "chargingStation") {
        placeRecreations(sections[i]["arrival"]["place"]["location"], 5)
        // chargingIcon
        pointerMarker = new H.map.Marker({ lat: sections[i]["arrival"]["place"]["location"].lat, lng: sections[i]["departure"]["place"]["location"].lng }, { icon: nonGreenChargeIcons[Math.floor(Math.random() * nonGreenChargeIcons.length)], volatility: true });
        map.addObject(pointerMarker);
        pointerMarker.setData("Charging Station");
      }
    }
    // console.log(duration, length, consumption)
    document.getElementById("status").innerHTML = "<h4>Routing done!</h4>"
    document.getElementById("routeStats").style.display = 'initial'
    document.getElementById("totalDuration").innerHTML = (duration / 3600).toFixed(2) + " hrs"
    document.getElementById("totalLength").innerHTML = (length / 1000).toFixed(2) + " km"
    document.getElementById("totalConsumption").innerHTML = consumption.toFixed(2)

  });

  $('#routeInfoModal').modal('setting', 'transition', 'drop').modal('hide');
  $('#markBtn').removeClass("disabled");

}