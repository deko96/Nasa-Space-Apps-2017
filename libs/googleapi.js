var TextSearch = require("googleplaces/lib/TextSearch.js");
var PlaceAutocomplete = require("googleplaces/lib/PlaceAutocomplete.js");
// var PlaceSearch = require("googleplaces/lib/PlaceSearch.js");
// var NearBySearch = require('googleplaces/lib/NearBySearch.js');
// var RadarSearch = require("googleplaces/lib/RadarSearch.js");
// var PlaceDetailsRequest = require("googleplaces/lib/PlaceDetailsRequest.js");
// var AddEvent = require("googleplaces/lib/AddEvent.js");
// var DeleteEvent = require("googleplaces/lib/DeleteEvent.js");
// var EventDetails = require("googleplaces/lib/EventDetails.js");
// var ImageFetch = require("googleplaces/lib/ImageFetch.js");
var GoogleAPI = function() {
    this.API_KEY = "AIzaSyBFBFV_FOquyq2MdlhJluSzBFqfhZSkJ4c";
    this.FORMAT = 'json';
    this.textSearch = new TextSearch(this.API_KEY, this.FORMAT);
    this.placeAutocomplete = new PlaceAutocomplete(this.API_KEY, this.FORMAT);
    // this.placeSearch = new PlaceSearch(this.API_KEY, this.FORMAT);    
    // this.nearBySearch = new NearBySearch(this.API_KEY, this.FORMAT);
    // this.radarSearch = new RadarSearch(this.API_KEY, this.FORMAT);
    // this.placeDetailsRequest = new PlaceDetailsRequest(this.API_KEY, this.FORMAT);
    // this.addEvent = new AddEvent(this.API_KEY, this.FORMAT);
    // this.deleteEvent = new DeleteEvent(this.API_KEY, this.FORMAT);
    // this.eventDetails = new EventDetails(this.API_KEY, this.FORMAT);
    // this.imageFetch = new ImageFetch(this.API_KEY);
}
module.exports = new GoogleAPI();