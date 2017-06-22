'use strict';

const fs = require('fs');
const mapnik = require('mapnik');
const path = require('path');

mapnik.register_datasource(path.join(mapnik.settings.paths.input_plugins, 'shape.input'));

const TILE_SIZE = 256;

const map = new mapnik.Map(TILE_SIZE, TILE_SIZE);
map.load('./style-admin0.xml', function(err, map) {
    map.zoomAll();
    const im = new mapnik.Image(TILE_SIZE, TILE_SIZE);
    map.render(im, function(err, im) {
        im.encode('png', function(err, buffer) {
            fs.writeFile('map.png', buffer);
         });
    });
});
