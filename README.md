# CARTO Node.js code test

## Introduction

At CARTO, among other things, we render maps, just check this [example of Map with countries and USA states](https://team.carto.com/u/rochoa/builder/f819f6b9-fadd-47cf-b0a3-ced1e31999c5/embed).

In order to limit the scope of the challenge, we are gonna use [Mapnik](http://mapnik.org/) and Node.js. Within this repository, we are providing all the pieces you need to reproduce that map. Well, all pieces except the map tile server.

An example of how to create an image with Mapnik:

```js
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
```

To run that code, you have to install the dependencies with `npm install` (you need Node.js 6 LTS and NPM). If everything went OK, you can run the example yourself using `npm run mapnik-example`, and you will get something like:

![map.png](https://gist.githubusercontent.com/rochoa/9a7a3f4c91e8ea20458f87b8861d0ba2/raw/860b177d3287f527535090f38014cea3e000f3e2/map.png)

There are a couple of Mapnik styles: `style-admin0.xml` and `style-admin1.xml` that represents the two layers used in the [original example](https://team.carto.com/u/rochoa/builder/f819f6b9-fadd-47cf-b0a3-ced1e31999c5/embed). You can modify `mapnik-example.js` to see the different results.

Now, if you open `index.html` in your browser, you will see a Map that does not show anything. That's because it expects to have a server returning tiles from `http://localhost:8888/`. You can check the type of URLs it requests.


## The challenge

Build a basic Map Tile Server with [Mapnik](http://mapnik.org/) and Node.js that provides the basic service to render a map like the presented above. Use `server.js` as your main file.


## References
 - https://msdn.microsoft.com/en-us/library/bb259689.aspx
 - http://wiki.openstreetmap.org/wiki/Zoom_levels
