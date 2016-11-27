 var locations = [{
     title: 'Park Ave Penthouse',
     location: {
         lat: 40.7713024,
         lng: -73.9632393
     }
 }, {
     title: 'Chelsea Loft',
     location: {
         lat: 40.7444883,
         lng: -73.9949465
     }
 }, {
     title: 'Union Square open Floor Plan',
     location: {
         lat: 40.7347062,
         lng: -73.9895759
     }
 }, {
     title: 'East Villge Hip Studio',
     location: {
         lat: 40.7281777,
         lng: -73.984377
     }
 }, {
     title: 'TriBeCa Artsy Bacelor Pad',
     location: {
         lat: 40.7195264,
         lng: -74.0089934
     }
 }, {
     title: 'Chinatown Homey Space',
     location: {
         lat: 40.7180628,
         lng: -73.9961237
     }
 }];


 // Global variables
 var map;
 var markers = [];
 infoWindow = new google.maps.InfoWindow();
 var input;

 var viewModel = function() {
     var self = this;
     this.search = ko.observable('');
     this.places = ko.observableArray([]);

     map = new google.maps.Map(document.getElementById('map'), {
         zoom: 12,
         center: {
             lat: 40.7413549,
             lng: -73.9980244
         },
         mapTypeControl: false,
     });

     locations.forEach(function(loc) {
         self.places.push(new place(loc));
     });

     self.places().forEach(function(place) {
         var marker = new google.maps.Marker({
             map: map,
             position: place.position(),
             title: place.title(),
             animation: google.maps.Animation.DROP,
             icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
         });
         markers.push(marker);

         place.marker = marker;

         marker.addListener('click', function() {
             // Set image of all the markers to red
             markers.forEach(function(mark) {
                 mark.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
             });
             // set image of clicked marker to blue
             this.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
             var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=220x120&location=' + place.lat() + ',' + place.lng();
             infoWindow.setContent('<img src=' + streetviewUrl + '>' + '<p>' + place.title() + '</p>');
             infoWindow.open(map, marker);
             map.setZoom(14);
             map.setCenter(marker.getPosition());
             infoWindow.addListener('closeclick', function() {
                 infoWindow.close();
                 infoWindow.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
             });
         });
         marker.addListener('mouseover', function() {
             markers.forEach(function(mark) {
                 mark.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
             });
             // set image of mouseover marker to yellow
             this.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png')
         });
         // marker.addListener('mouseout', function() {
         //infoWindow.close();
         //});
     });
     this.filter = ko.computed(function() {
         input = self.search().toLowerCase();
         if (!input) {
             self.places().forEach(function(place) {
                 place.visibility(true);
                 place.marker.setMap(map);
             });
         } else {
             self.places().forEach(function(place) {
                 if (place.title().toLowerCase().indexOf(input) !== -1) {
                     place.visibility(true);
                     place.marker.setMap(map);
                 } else {
                     place.visibility(false);
                     place.marker.setMap(null);
                 }
             });
         }
     });

     this.openInfo = function(place) {
         infoWindow.close();
         google.maps.event.trigger(place.marker, 'click');
     };
 }

 var place = function(loc) {
     var self = this;
     this.title = ko.observable(loc.title);
     this.lat = ko.observable(loc.location.lat);
     this.lng = ko.observable(loc.location.lng);
     this.position = ko.observable(loc.location);
     this.visibility = ko.observable(true);
 }
 ko.applyBindings(new viewModel())