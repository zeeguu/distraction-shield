/**
 * Created by pieter on 16-4-17.
 */

require.config({
    baseUrl: "./",
    paths: {
        "background" : "./background.js"
    }
});

require( ['background', 'synchronizer'], function(background, synchronizer) {

});