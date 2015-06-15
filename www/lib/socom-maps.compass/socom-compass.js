var layer;
var divcompass;
// ############################
// Compass
// ############################
L.Control.Compass = L.Control.extend({
    includes: L.Mixin.Events,
    options: {
        position: 'topright',
        title: 'Compass'
    },

    onAdd: function (map) {
        console.log('-----------------------------------------------');
        this.map = map;
        var container = L.DomUtil.create('div', 'leaflet-control-bsl');
        this._container = container;

        divcompass = this._container;
        if (navigator.compass) {
            this.startWatch();
        }
        return this._container;
    },
    startWatch: function () {
        // Update compass every 3 seconds
        var options = {
            frequency: 3000
        };
        divcompass.style.display = 'compact';
        watchID = navigator.compass.watchHeading(this.onSuccess, this.onError, options);
    },
    onSuccess: function (heading) {
        //divcompass.innerHTML = 'Heading: ' + (360 - heading.magneticHeading);
        //	this.rotateCompassImage(heading);
        var magneticHeading = 360 - heading.magneticHeading;
        var rotation = "rotate(" + magneticHeading + "deg)";
        divcompass.style.webkitTransform = rotation;
    },
    onError: function (compassError) {
        alert('Compass error: ' + compassError.code);
    }
});
L.control.compass = function (map) {
    return new L.Control.Compass(map);

};
