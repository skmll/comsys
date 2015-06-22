/*
 *  Simple navigation control that allows back and forward navigation through map's view history
 */

(function () {
    L.Control.ViewMode = L.Control.extend({
        options: {
            position: 'bottomleft',
            //center:,
            //zoom :,
            operatorTitle: 'Center on operator',
            squadTitle: 'Center on squad',
        },

        _centerOnOperator: function () {
            console.log(this.options.operator);
            console.log(this._map.getMaxZoom());
            this._map.setView(this.options.operator, this._map.getMaxZoom(), {animation: true});
        },

        _centerOnSquad: function () {
            //this._updateDisabled();
            //this._map.panTo(this.options.squad);
            if (this.options.squad.getBounds().getNorthEast() && this.options.squad.getBounds().getNorthWest()) {
                this._map.fitBounds(this.options.squad.getBounds());
                //console.log(this.options.squad.getBounds());
            }
        },

        _createButton: function (title, className, container, fn) {
            // Modified from Leaflet zoom control

            var link = L.DomUtil.create('a', className, container);
            link.href = '#';
            link.title = title;

            L.DomEvent
                .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
                .on(link, 'click', L.DomEvent.stop)
                .on(link, 'click', fn, this)
                .on(link, 'click', this._refocusOnMap, this);

            return link;
        },

        onAdd: function (map) {
            // Set options
            //if (!this.options.operator) {
            //    this.options.operator = operator;
            //}
            //if (!this.options.squad) {
            //    this.options.squad = squad;
            //}
            var options = this.options;

            // Create toolbar
            var controlName = 'leaflet-control-viewmode',
                container = L.DomUtil.create('div', 'leaflet-control-viewmode leaflet-bar');

            // Add toolbar buttons
            this._operatorButton = this._createButton(options.operatorTitle, 'operator', container, this._centerOnOperator);
            this._squadButton = this._createButton(options.squadTitle, 'squad', container, this._centerOnSquad);

            // Set intial view to home
            //map.setView(options.center, options.zoom);
            this._map = map;
            console.log(options);
            this._centerOnSquad();
            return container;
        },

        setOperator: function(operator){
            this.options.operator = operator;
        },
        setSquad: function(squad){
            this.options.squad = squad;
        }

    });

    L.control.viewmode = function (options) {
        return new L.Control.ViewMode(options);
    };

})();