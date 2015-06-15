angular.module('hudModule', [])
    .controller('HudController', function($scope, $rootScope) {

      var default_config = {
        bg_color: "rgba(0, 0, 0, 0.3)",
        fg_color: "rgba(20, 200, 20, 0.7)",
        type: "mf", // h=hidden, m=mini, f=full > hmf, hf, mf
        compass: {
//      extend_lines: true,
          //  lines_color: "rgba(180, 180, 180, 0.6)",
          lines_color: "rgba(20, 200, 20, 0.7)",
          height: 30,
          fov: 270,
          scaling: "sin"
        },
        ruler: {
          //  lines_color: "rgba(180, 180, 180, 0.6)",
          lines_color: "rgba(20, 200, 20, 0.7)",
          height: 120,
          //  max_dist: 1500,
          //  scaling: "linear",
          //  steps: 5
          scaling: "steps",
          steps: [10, 100, 1000, 10000]
        }
      };
      window.config = default_config;

      var resources = {
        imgRoot : "lib/socom-maps/img/",
        images : {
          hostile : [
            "direction_n.png",
            "HOS-NOSPEC.png"
          ],
          specializations : [
            "anti_tank.png",
            "armour.png",
            "artillery.png",
            "bridging.png",
            "engineer.png",
            "infantry.png",
            "maintenance.png",
            "medic.png",
            "mortar.png",
            "no_spec.png",
            "radar.png",
            "recon.png",
            "sf.png",
            "signals.png",
            "sof.png",
            "transportation.png"
          ],
          squads : [
            "fire_maneuver.png",
            "fireteam.png",
            "patrol.png",
            "platoon.png",
            "squad.png"
          ]
        }
      };

      $scope.init = function () {
        new Hud(default_config);
        window.a = $scope
      };

      DEBUG = true;


      // Credit to http://blog.mackerron.com/2011/01/01/javascript-cubic-splines/
      var CubicSpline, MonotonicCubicSpline;
      MonotonicCubicSpline = function () {
        function p(f, d) {
          var e, k, h, j, b, l, i, a, g, c, m;
          i = f.length;
          h = [];
          l = [];
          e = [];
          k = [];
          j = [];
          a = [];
          b = 0;
          for (g = i - 1; 0 <= g ? b < g : b > g; 0 <= g ? b += 1 : b -= 1) {
            h[b] = (d[b + 1] - d[b]) / (f[b + 1] - f[b]);
            if (b > 0)l[b] = (h[b - 1] + h[b]) / 2
          }
          l[0] = h[0];
          l[i - 1] = h[i - 2];
          g = [];
          b = 0;
          for (c = i - 1; 0 <= c ? b < c : b > c; 0 <= c ? b += 1 : b -= 1)h[b] === 0 && g.push(b);
          c = 0;
          for (m = g.length; c < m; c++) {
            b = g[c];
            l[b] = l[b + 1] = 0
          }
          b = 0;
          for (g = i - 1; 0 <= g ? b < g : b > g; 0 <= g ? b += 1 : b -= 1) {
            e[b] = l[b] / h[b];
            k[b] = l[b + 1] / h[b];
            j[b] = Math.pow(e[b], 2) + Math.pow(k[b], 2);
            a[b] = 3 / Math.sqrt(j[b])
          }
          g = [];
          b = 0;
          for (c = i - 1; 0 <= c ? b < c : b > c; 0 <= c ? b += 1 : b -= 1)j[b] > 9 && g.push(b);
          j = 0;
          for (c = g.length; j < c; j++) {
            b = g[j];
            l[b] = a[b] * e[b] * h[b];
            l[b + 1] = a[b] * k[b] * h[b]
          }
          this.x = f.slice(0, i);
          this.y = d.slice(0, i);
          this.m = l
        }

        p.prototype.interpolate = function (f) {
          var d, e, k, h;
          for (e = d = this.x.length - 2; d <= 0 ? e <= 0 : e >= 0; d <= 0 ? e += 1 : e -= 1)if (this.x[e] <= f)break;
          d = this.x[e + 1] - this.x[e];
          f = (f - this.x[e]) / d;
          k = Math.pow(f, 2);
          h = Math.pow(f, 3);
          return (2 * h - 3 * k + 1) * this.y[e] + (h - 2 * k + f) * d * this.m[e] + (-2 * h + 3 * k) * this.y[e + 1] + (h - k) * d * this.m[e + 1]
        };
        return p
      }();
      CubicSpline = function () {
        function p(f, d, e, k) {
          var h, j, b, l, i, a, g, c, m, o, n;
          if (f != null && d != null) {
            b = e != null && k != null;
            c = f.length - 1;
            i = [];
            o = [];
            g = [];
            m = [];
            n = [];
            j = [];
            h = [];
            l = [];
            for (a = 0; 0 <= c ? a < c : a > c; 0 <= c ? a += 1 : a -= 1)i[a] = f[a + 1] - f[a];
            if (b) {
              o[0] = 3 * (d[1] - d[0]) / i[0] - 3 * e;
              o[c] = 3 * k - 3 * (d[c] - d[c - 1]) / i[c - 1]
            }
            for (a = 1; 1 <= c ? a < c : a > c; 1 <= c ? a += 1 : a -= 1)o[a] = 3 / i[a] * (d[a + 1] - d[a]) - 3 / i[a - 1] * (d[a] - d[a - 1]);
            if (b) {
              g[0] = 2 * i[0];
              m[0] = 0.5;
              n[0] = o[0] / g[0]
            } else {
              g[0] = 1;
              m[0] = 0;
              n[0] = 0
            }
            for (a = 1; 1 <= c ? a < c : a > c; 1 <= c ? a += 1 : a -= 1) {
              g[a] = 2 * (f[a + 1] - f[a - 1]) - i[a - 1] * m[a - 1];
              m[a] = i[a] / g[a];
              n[a] = (o[a] - i[a - 1] * n[a - 1]) / g[a]
            }
            if (b) {
              g[c] = i[c - 1] * (2 - m[c - 1]);
              n[c] = (o[c] - i[c - 1] * n[c - 1]) / g[c];
              j[c] = n[c]
            } else {
              g[c] = 1;
              n[c] = 0;
              j[c] = 0
            }
            for (a = e = c - 1; e <= 0 ? a <= 0 : a >= 0; e <= 0 ? a += 1 : a -= 1) {
              j[a] = n[a] - m[a] * j[a + 1];
              h[a] = (d[a + 1] - d[a]) / i[a] - i[a] * (j[a + 1] + 2 * j[a]) / 3;
              l[a] = (j[a + 1] - j[a]) / (3 * i[a])
            }
            this.x = f.slice(0, c + 1);
            this.a = d.slice(0, c);
            this.b = h;
            this.c = j.slice(0, c);
            this.d = l
          }
        }
      }();

      var compass_points = {
        0: {
          height: 50,
          name: "N"
        },
        45: {
          height: 40,
          name: "NE"
        },
        90: {
          height: 50,
          name: "E"
        },
        135: {
          height: 40,
          name: "SE"
        },
        180: {
          height: 50,
          name: "S"
        },
        225: {
          height: 40,
          name: "SW"
        },
        270: {
          height: 50,
          name: "W"
        },
        315: {
          height: 40,
          name: "NW"
        }
      };

      var requestAnimFrame =
              window.requestAnimationFrame
              || window.webkitRequestAnimationFrame
              || window.mozRequestAnimationFrame
              || window.oRequestAnimationFrame
              || window.msRequestAnimationFrame
              || function (callback) {
                window.setTimeout(callback, 1000 / 60);
              }
          ;

      var getDist = function (lat1, lon1, lat2, lon2) {
        // Credit  http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
        var R = 6378100; // Radius of the earth in m
        var dLat = Math.toRad(lat2 - lat1);
        var dLon = Math.toRad(lon2 - lon1);
        var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRad(lat1)) * Math.cos(Math.toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in m
        return d;
      };

      var getAlpha = function (lat1, lon1, lat2, lon2) {
        // http://gis.stackexchange.com/questions/29239/calculate-bearing-between-two-decimal-gps-coordinates
        var startLat = Math.toRad(lat1);
        var startLong = Math.toRad(lon1);
        var endLat = Math.toRad(lat2);
        var endLong = Math.toRad(lon2);

        var dLong = endLong - startLong;

        var dPhi = Math.log(Math.tan(endLat / 2 + Math.PI / 4) / Math.tan(startLat / 2 + Math.PI / 4));
        if (Math.abs(dLong) > Math.PI)
          if (dLong > 0)
            dLong = -(2 * Math.PI - dLong);
          else
            dLong = (2 * Math.PI + dLong);

        var alpha = (Math.toDeg(Math.atan2(dLong, dPhi)) + 360) % 360;

        return alpha;
      };

      Math.toRad = function (deg) {
        return deg * (Math.PI / 180)
      };
      Math.toDeg = function (rad) {
        return rad * (180 / Math.PI)
      };

      var PoIHandler = function (cntx, hud){
        this.cntx = cntx;
        this.hud = hud;
        this.getAngle = this.hud.compass.getAngle;
        this.pois = {};
        this.pos = { latitude: 0, longitude: 0 };
        this.resources = {};
        this.ready = false;

        this.setupEvents();
        this.preloadResources();
      }
      PoIHandler.prototype.preloadResources = function(){
        var baseUrl = resources.imgRoot;
        var total =
            resources.images.hostile.length +
            resources.images.specializations.length +
            resources.images.squads.length;
        var loaded = 0;
        var onLoad = function(){
          loaded++;
          DEBUG && console.log("Loaded " + loaded + " of " + total + ".");
          if(loaded === total)
            this.ready = true;
        }
        this.resources["hostile"] = {};
        resources.images.hostile.forEach(function(v){
          var img = new Image();
          img.onload = onLoad.bind(this);
          img.src = baseUrl + "hostile/" + v
          this.resources["hostile"][v] = img;
        }, this);
        this.resources["specializations"] = {};
        resources.images.specializations.forEach(function(v){
          var img = new Image();
          img.onload = onLoad.bind(this);
          img.src = baseUrl + "specializations/" + v;
          console.log(baseUrl + "specializations/" + v);
          this.resources["specializations"][v] = img;
        }, this);
        this.resources["squads"] = {};
        resources.images.squads.forEach(function(v){
          var img = new Image();
          img.onload = onLoad.bind(this);
          img.src = baseUrl + "squads/" + v
          this.resources["squads"][v] = img;
        }, this);
      };
      PoIHandler.prototype.setupEvents = function(){
        $scope.$on('operatorAdded'  ,this.addPoI.bind(this));
        $scope.$on('operatorUpdated',this.updatePoI.bind(this));
        $scope.$on('operatorRemoved',this.removePoI.bind(this));

        $scope.$on('hostileAdded'   ,this.addPoI.bind(this));
        $scope.$on('hostileUpdated' ,this.updatePoI.bind(this));
        $scope.$on('hostileRemoved' ,this.removePoI.bind(this));

        $scope.$on("userPositionUpdated", this.updateSelf.bind(this));
      };
      PoIHandler.prototype.draw = function(){
        if(!this.ready)
          return;

        Object.keys(this.pois).forEach(function(k){
          var poi = this.pois[k];
          var dir = getAlpha(this.pos.latitude, this.pos.longitude, poi.latitude, poi.longitude);
          var dist = getDist(this.pos.latitude, this.pos.longitude, poi.latitude, poi.longitude);

          var x = this.hud.compass.alphaToX(dir);
          var y = 0;
          var img = null;
          if(poi.specialization){
            img = this.resources.specializations[poi.specialization];
          } else if(poi.squad){
            img = this.resources.squad[poi.squad];
          } else {
            img = this.resources.hostile["HOS-NOSPEC.png"];
          }
          this.cntx.save();
          switch(this.hud.currentState){
            case 'm':
              this.cntx.globalAlpha = 1-(dist / Math.max.apply(null, this.hud.conf.ruler.steps));
              y = this.cntx.canvas.height/2;
              break;
            case 'f':
              y = this.hud.conf.ruler.height - (this.hud.conf.ruler.height * this.hud.ruler.getY(dist) / this.hud.conf.ruler.steps.length);
              break;
          }

          this.cntx.drawImage(
              img
              , x - img.width/4
              , y - img.height/4
              , img.width/2
              , img.height/2
          );
          this.cntx.restore();
        }.bind(this));
      };
      PoIHandler.prototype.addPoI = function(ev, poi){
        console.log(poi);
        this.pois[poi.id || poi.nickname] = poi;
      };
      PoIHandler.prototype.updatePoI = function(ev, poi){
        this.pois[poi.id || poi.nickname] = poi;
      };
      PoIHandler.prototype.removePoI = function(ev, poi, id){
        console.log(ev, poi);
        delete this.pois[id || poi.nickname];
      };
      PoIHandler.prototype.updateSelf = function(ev, pos){
        this.pos = pos;
      };

      var Compass = function (cntx, conf, points, hud) {
        this.cntx = cntx;
        this.conf = conf;
        this.points = points;
        this.hud = hud;
        this.smoothingFactor = 0.9;
        this.lastSin = 0;
        this.lastCos = 0;
        this.compassOptions = {
          filter: 3
        };

        this.lastChange = 0;
        this.oldDir = 0;
        this.newDir = 0;

        window.addEventListener("deviceorientation", this.onHtmlOrientationEvent.bind(this));

        document.addEventListener("deviceready", function () {
          console.log("hiasdasd");
          console.log( navigator.compass);
          if (typeof navigator.compass !== "undefined") {
            console.log("cordovating");
            var watchID = navigator.compass.watchHeading(this.onCordovaOrientationEvent.bind(this), console.error, this.compassOptions);
            window.removeEventListener("deviceorientation", this.onHtmlOrientationEvent);
          }
        }.bind(this));
      };
      Compass.prototype.getAngle = function(){
        // Smoothing based on delta time
        return Math.toDeg(this.newDir);
        var ttr = 400;
        var sinceLastChange = Date.now() - this.lastChange;
        var d = sinceLastChange / ttr;
        if(d>1)
          d=1;
        return Math.toDeg(this.oldDir + (Math.sin(d*Math.PI/2))*(this.newDir - this.oldDir));
      };
      Compass.prototype.onSensorChanged = function(angle){
//		console.log(Math.toDeg(angle));

        this.oldDir = this.newDir;
        this.newDir = angle;
        this.lastChange = Date.now();
      };

      Compass.prototype.alphaToX = function (a) {
        // get position relative to width

        var k = 360 - (a - this.getAngle());
        if (k < -360 / 2)
          k += 360;
        if (k > 360 / 2)
          k -= 360
        var rel = k / this.conf.compass.fov;
        if (rel < -0.5 || rel > 0.5)
          return;

        if (this.conf.compass.scaling === "sin")
          rel = -1 * Math.sin(Math.toRad(180 * rel)) / 2;

        return this.cntx.canvas.width / 2 + rel * this.cntx.canvas.width;
      };

      Compass.prototype.onHtmlOrientationEvent = function (event) {
        // Simulate cordova's plugin filter option
        var dir = event.alpha;
        if(dir > 180)
          dir = dir - 360;
        if (this.compassOptions.filter && Math.abs(dir - this.getAngle()) >= this.compassOptions.filter) {
          this.onSensorChanged(Math.toRad(dir*-1));
        }
      };
      Compass.prototype.onCordovaOrientationEvent = function (heading) {
        var dir = heading.magneticHeading;
        if(dir > 180)
          dir = dir - 360;
        this.onSensorChanged(Math.toRad(dir*-1));
      };
      Compass.prototype.draw = function () {
        var alpha = this.getAngle();
        var w = this.cntx.canvas.width;
        var h = this.cntx.canvas.height;

        if (DEBUG) {
          this.cntx.save();
          this.cntx.fillStyle = "rgba(255,0,0,1)";
          this.cntx.fillText("Dir: " + alpha, w / 2, h / 2);
          this.cntx.restore();
        }

        // draw compass separator
        this.cntx.beginPath();
        this.cntx.moveTo(0, h - this.conf.compass.height);
        this.cntx.lineTo(w, h - this.conf.compass.height);
        this.cntx.stroke();

        // draw compass points lines

        Object.keys(this.points).forEach(function (a) {
          var x = this.alphaToX(a);
          if (x === null)
            return;
          this.cntx.beginPath();
          this.cntx.moveTo(x, h - this.conf.compass.height);
          this.cntx.lineTo(x, h - this.conf.compass.height + (this.conf.compass.height * this.points[a].height / 100));
          this.cntx.stroke();


          if (this.points[a].name) {
            this.cntx.fillText(this.points[a].name, x, h - 5);
          }
        }.bind(this));

        if (this.conf.compass.extend_lines) {
          this.cntx.save();
          this.cntx.strokeStyle = this.conf.compass.lines_color;
          Object.keys(this.points).forEach(function (a) {
            var x = this.alphaToX(a);
            if (x === null)
              return;
            this.cntx.beginPath();
            this.cntx.moveTo(x, 0);
            this.cntx.lineTo(x, h - this.conf.compass.height);
            this.cntx.stroke();
          }.bind(this));
          this.cntx.restore();
        }
      };

      var Ruler = function (cntx, conf, hud) {
        this.cntx = cntx;
        this.conf = conf;
        this.hud = hud;
        var base = ([0]).concat(this.conf.ruler.steps.map(function (v, i) {
          return i + 1;
        })); // [0, 1, 2, 3, ...]
        this.spline = new MonotonicCubicSpline(([0]).concat(this.conf.ruler.steps), base);
      };
      Ruler.prototype.draw = function () {
        if (this.hud.currentState !== "f")
          return;
        var w = this.cntx.canvas.width;
        var h = this.cntx.canvas.height;


        this.cntx.save();
        this.cntx.strokeStyle = this.conf.ruler.lines_color;
        this.cntx.font = "9px Arial";
        this.cntx.textAlign = 'right';

        if (this.conf.ruler.scaling === "linear") {
          for (var i = 0, y = 0; i < this.conf.ruler.steps; i++) {
            // draw line
            y = (this.conf.ruler.height / this.conf.ruler.steps) * i;
            this.cntx.beginPath();
            this.cntx.moveTo(0, y);
            this.cntx.lineTo(w, y);
            this.cntx.stroke();

            this.cntx.fillText((this.conf.ruler.max_dist / this.conf.ruler.steps) * (this.conf.ruler.steps - i) + "m", w, y + 9);
          }
        }

        if (this.conf.ruler.scaling === "steps") {
          for (var i = 0, y = 0; i < this.conf.ruler.steps.length; i++) {
            // draw line
            y = (this.conf.ruler.height / this.conf.ruler.steps.length) * i;
            this.cntx.beginPath();
            this.cntx.moveTo(0, y);
            this.cntx.lineTo(w, y);
            this.cntx.stroke();

            this.cntx.fillText(this.conf.ruler.steps[this.conf.ruler.steps.length - i - 1] + "m", w, y + 9);
          }
        }
        this.cntx.restore();
      };
      Ruler.prototype.getY = function (dist) {
        return this.spline.interpolate(dist);
      };


      var Hud = function (conf, map) {
        this.map = map;
        this.conf = conf;
        this.currentState = this.conf.type === "mf" ? "m" : "h"; //h=hidden, m=mini, f=full
        this.stateMap = {
          "hmf": {
            "h": {
              "down": "m",
            },
            "m": {
              "up": "h",
              "down": "f"
            },
            "f": {
              "up": "m"
            }
          },
          "mf": {
            "m": {
              "down": "f"
            },
            "f": {
              "up": "m"
            }
          },
          "hf": {
            "h": {
              "down": "f"
            },
            "f": {
              "up": "h"
            }
          }
        };
        this.sizeFrom = document.getElementById("hud_container").parentNode.parentNode;
        this.container = document.getElementById("hud_container");
        this.canvas = document.getElementById("hud_canvas");
        this.canvas.height = 0;
        this.cntx = this.canvas.getContext("2d");

        this.compass = new Compass(this.cntx, this.conf, compass_points, this);
        this.ruler = new Ruler(this.cntx, this.conf, this);
        this.poihandler = new PoIHandler(this.cntx, this);

        ionic.onGesture("swipe", this.swipeHandler.bind(this), document);
        if(this.currentState === "m"){
          this.start();
        }
      };
      Hud.prototype.update = function () {
        this.cntx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.cntx.save();
        this.cntx.fillStyle = this.conf.bg_color;
        this.cntx.fillRect(0, 0, this.w, this.h);
        this.cntx.restore();

        this.compass.draw();
        this.ruler.draw();
        this.poihandler.draw();

        if (this.currentState !== "h")
          requestAnimFrame(this.update.bind(this));
      };
      Hud.prototype.start = function () {
        DEBUG && console.log("Hud activated.");
        $rootScope.$broadcast("hudOff", true);

        this.setupCanvas();
        this.setupEvents();
        this.update();
      };
      Hud.prototype.stop = function () {
        DEBUG && console.log("Hud deactivated.");
        $rootScope.$broadcast("hudOn", true);
        window.removeEventListener("resize", this.setupCanvas);
      };
      Hud.prototype.setupEvents = function () {
        window.addEventListener("resize", this.setupCanvas.bind(this));
        window.addEventListener("userPositionUpdated", function(v){console.log(v);});
      };
      Hud.prototype.setupCanvas = function () {
        this.setSize();
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.cntx.fillStyle = this.conf.fg_color;
        this.cntx.font = "12px Arial";
        this.cntx.lineWidth = 2;
        this.cntx.miterLimit = 3;
        this.cntx.textAlign = 'center';
        this.cntx.strokeStyle = this.conf.fg_color;
      };
      Hud.prototype.setSize = function () {
        this.w = Math.max(this.sizeFrom.clientWidth || 0);
        this.h = 0;
        switch (this.currentState) {
          case 'f':
            this.h += this.conf.ruler.height;
          case 'm':
            this.h += this.conf.compass.height;
        }
      };
      Hud.prototype.swipeHandler = function (ev) {
        var oldState = this.currentState;

        this.currentState = this.stateMap[this.conf.type][this.currentState][ev.gesture.direction] || this.currentState;
        this.setupCanvas();

        if (oldState === "h" && this.currentState !== "h")
          this.start();
        if (oldState !== "h" && this.currentState === "h")
          this.stop();
      };

    })
    .directive('hud', function () {
      return {
        restrict: 'E',
        template: "<div id=\"hud_container\" ng-controller=\"HudController\" ng-init=\"init()\" style=\"z-index: 5555;top:0;position:absolute;\">" +
        "<canvas id=\"hud_canvas\"></canvas>" +
        "</div> "
      };
    });
