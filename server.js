'use strict';

const express = require("express");
const mapnik = require("mapnik");
//Enable GZIP compression.
//This should easily reduce page loads time to the order of 15-20%.
const compression = require("compression");
// Module used to convert tile xyz value to Mapnik envelope.
const mercator = require('./sphericalmercator.js');
const fs = require('fs');
const path = require("path");

const PORT = 8888;
const TILE_SIZE = 256;
mapnik.register_datasource(path.join(mapnik.settings.paths.input_plugins, 'shape.input'));

var app = express();
app.use(compression());
// URL format http://localhost:8888/{i}/{z}/{x}/{y}.png'
// i   -> layer
// z   -> zoom
// x,y -> coordinates
app.get('/:layer/:z/:x/:y', function(req, res) {

    const layer = req.params.layer;
    const z = req.params.z;
    const x = req.params.x;
    const y = req.params.y.split(".")[0]; // Get rid of the image extension 'png'.

    var map = new mapnik.Map(TILE_SIZE, TILE_SIZE);
    const map_stylesheet = "style-" + layer + ".xml";

    map.load(map_stylesheet, function(err, map) {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.end(err.message);
        }

        var bbox = mercator.xyz_to_envelope(parseInt(x), parseInt(y), parseInt(z), false);
        map.extent = bbox;
        var im = new mapnik.Image(TILE_SIZE, TILE_SIZE);

        map.render(im, function(err, im) {
            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end(err.message);
            } else {
                im.encode('png', function(err, buffer) {
                    if (err) {
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        res.end(err.message);
                    } else {
                        res.writeHead(200, {
                            'Content-Type': 'image/png'
                        });
                        res.end(buffer);
                    }
                });
            }
        });
    });
});

app.listen(PORT);