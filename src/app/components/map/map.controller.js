(function() {
  'use strict';

  angular.module('app.components')
    .controller('MapController', MapController);
    
    MapController.$inject = ['$scope', '$state', '$timeout', 'location', 'markers', 'device', 'marker', '$mdDialog', 'leafletData', 'mapUtils', 'markerUtils', 'alert'];
    function MapController($scope, $state, $timeout, location, markers, device, marker, $mdDialog, leafletData, mapUtils, markerUtils, alert) {
    	var vm = this;
      var updateType;

      var initialLocation = markers[0];
      var markersByIndex = _.indexBy(markers, function(marker) {
        return marker.myData.id;
      });
      var focusedMarkerID = markersByIndex[parseInt($state.params.id)].myData.id;

      // vm.markers = markers;
      vm.markers = markersByIndex;
      vm.currentMarker = marker.getCurrentMarker();

      vm.tiles = {
        url: 'https://api.tiles.mapbox.com/v4/mapbox.streets-basic/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidG9tYXNkaWV6IiwiYSI6ImRTd01HSGsifQ.loQdtLNQ8GJkJl2LUzzxVg'
      };
      //'https://a.tiles.mapbox.com/v4/tomasdiez.jnbhcnb2/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidG9tYXNkaWV6IiwiYSI6ImRTd01HSGsifQ.loQdtLNQ8GJkJl2LUzzxVg'

      vm.layers = {
        baselayers: {
          osm: {
            name: 'OpenStreetMap',
            type: 'xyz',
            url: 'https://api.tiles.mapbox.com/v4/mapbox.streets-basic/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidG9tYXNkaWV6IiwiYSI6ImRTd01HSGsifQ.loQdtLNQ8GJkJl2LUzzxVg'
          }
        },
        overlays: {
          realworld: {
            name: 'Real world data',
            type: 'markercluster',
            visible: true,
            layerOptions: {
              showCoverageOnHover: false            
            }
          }
        }
      };

      vm.center = {
        lat: initialLocation.lat,
        lng: initialLocation.lng,
        zoom: 12
      };


    	vm.defaults = {
        dragging: true, 
        touchZoom: true, 
        scrollWheelZoom: false, 
        doubleClickZoom: true
    	};

    	vm.events = {
    	  map: {
    	  	enable: ['dragend', 'zoomend', 'moveend', 'popupopen', 'popupclose', 'mousedown', 'dblclick', 'click', 'touchstart'],
    	  	logic: 'broadcast' // might have to use emit later
    	  }
    	};

      $scope.$on('leafletDirectiveMarker.click', function(event, data) {
        var id = data.leafletEvent.target.options.myData.id; 

        vm.kitLoading = true;
        vm.center.lat = data.leafletEvent.latlng.lat;
        vm.center.lng = data.leafletEvent.latlng.lng;

        if(id === parseInt($state.params.id)) {
          $timeout(function() {
            vm.kitLoading = false;
          }, 0);
          return;
        }

        focusedMarkerID = data.leafletEvent.target.options.myData.id;
        
        updateType = 'map';
        var id = data.leafletEvent.target.options.myData.id; 
        $state.go('layout.home.kit', {id: id});
      });    

      $scope.$on('leafletDirectiveMarker.popupclose', function(event, data) {
        if(focusedMarkerID) {
          var marker = vm.markers[focusedMarkerID]; 
          if(marker) {
            vm.markers[focusedMarkerID].focus = false;                          
          }
        }
      });

      $scope.$on('kitLoaded', function(event, data) {
        vm.kitLoading = false;
        if(updateType === 'map') {
          updateType = undefined;
          return;
        }

        vm.center.lat = data.lat;
        vm.center.lng = data.lng; 

        

        $timeout(function() {
          leafletData.getMarkers()
            .then(function(markers) {
              var currentMarker = _.find(markers, function(marker) {
                return data.id === marker.options.myData.id;
              });

              leafletData.getLayers()
                .then(function(layers) {
                  layers.overlays.realworld.zoomToShowLayer(currentMarker, function() {
                    var selectedMarker = vm.markers[data.id];

                    if(selectedMarker) {
                      // focusedMarkerID = data.id;
                      selectedMarker.focus = true;
                    }
                    $scope.$digest();
                  });
                });
            });
        }, 3000);
      });
      
      /*
       $scope.$on('leafletDirectiveMap.touchstart', function(event, otro) {
        console.log('touch', event, otro);
        alert('touch');
      });  
      $scope.$on('leafletDirectiveMap.mousedown', function(event) {
        console.log('popup', event);
        alert('click');
      });
      */
      var defaultFilters = {
        exposure: null,
        status: null
      };

      vm.filterData = {
        indoor: true,
        outdoor: true,
        online: true,
        offline: true
      };

      vm.openFilterPopup = openFilterPopup;
      vm.removeFilter = removeFilter;

      initialize();

      /////////////////////

      function initialize() {
        checkFiltersSelected();
      }

      function checkFiltersSelected() {
        var allFiltersSelected = _.every(vm.filterData, function(filterValue) {
          return filterValue;
        });
        if(allFiltersSelected) {
          vm.allFiltersSelected = true;
        } else {
          vm.allFiltersSelected = false;
        }
      }

      function openFilterPopup() {
        $mdDialog.show({
          hasBackdrop: true,
          controller: 'MapFilterDialogController',
          templateUrl: 'app/components/map/mapFilterPopup.html',
          //targetEvent: ev,
          clickOutsideToClose: true,
          locals: {
            filterData: vm.filterData
          }
        })
        .then(function(data, defaultFiltersFromModal) {
          _.extend(vm.filterData, data);
          _.extend(defaultFilters, defaultFiltersFromModal);
          updateMarkers(data);
          checkFiltersSelected();
          $timeout(function() {
            checkMarkersLeftOnMap();            
          });
        });
      }

      function removeFilter(filterName) {
        if(!mapUtils.canFilterBeRemoved(vm.filterData, filterName)) {
          return;
        }
        vm.filterData[filterName] = false;
        _.extend(defaultFilters, mapUtils.setDefaultFilters(vm.filterData, defaultFilters));
        updateMarkers(vm.filterData);
        checkFiltersSelected();
        $timeout(function() {
          checkMarkersLeftOnMap();
        });
      }

      function filterMarkers(filterData) {
        return markers.filter(function(marker) {        
          var labels = marker.myData.labels;
          return _.every(labels, function(label) {
            return filterData[label];
          });
        });
      }

      function updateMarkers(filterData) {
        vm.markers = [];
        $timeout(function() {
          $scope.$apply(function() {
            vm.markers = filterMarkers(filterData);           
          });
        });
      }

      function checkMarkersLeftOnMap() {
        return leafletData.getMarkers()
          .then(function(markers) {
            return leafletData.getLayers()
              .then(function(layers) {
                var isThereMarkers = mapContainsAnyMarker(layers, markers);

                if(!isThereMarkers) {
                  leafletData.getMap()
                    .then(function(map) {
                      var center = L.latLng(vm.center.lat, vm.center.lng);
                      var closestMarker = _.reduce(markers, function(closestMarkerSoFar, marker) {
                        var distanceToMarker = center.distanceTo(marker.getLatLng());
                        var distanceToClosest = center.distanceTo(closestMarkerSoFar.getLatLng());
                        return distanceToMarker < distanceToClosest ? marker : closestMarkerSoFar;
                      }, markers[0]);

                      if(closestMarker) {
                        zoomOutWhileNoMarker(layers, closestMarker);                        
                      } else {
                        alert.info('No markers found with those filters', 5000);
                      }
                    });
                }
              });
          });
      }
      function mapContainsAnyMarker(layers, data) {
        var bounds = layers.overlays.realworld._currentShownBounds;              
        return _.some(data, function(marker) {
          return mapContainsMarker(bounds, marker);
        });              
      }

      function mapContainsMarker(bounds, marker) {
        return bounds.contains(marker.getLatLng());
      }

      function zoomOutWhileNoMarker(layers, marker) {
        var bounds = layers.overlays.realworld._currentShownBounds;

        if(!mapContainsMarker(bounds, marker)) {
          zoomOutMap();
          leafletData.getLayers()
            .then(function(newLayers) {
              $timeout(function() {
                zoomOutWhileNoMarker(newLayers, marker);                
              });
            });
        }
      }

      function zoomOutMap() {
        if(vm.center.zoom === 0) {
          return;
        }
        vm.center.zoom = vm.center.zoom - 3;
      }
    }

})();
