!function(){"use strict";angular.module("app.components",["oauth","leaflet-directive"])}(),function(){"use strict";function t(){return{scope:!1,restrict:"E",controller:"SignupController",controllerAs:"vm",templateUrl:"app/components/signup/signup.html"}}angular.module("app.components").directive("signup",t)}(),function(){"use strict";function t(t,n,e,o,a){function s(t){o.blur(),n.show({controller:"DialogController",templateUrl:"app/components/signup/signupModal.html",targetEvent:t}).then(function(t){c(t)})["finally"](function(){o.unblur()})}function c(t){e.post(t).then(function(t){console.log("data",t),a.show({controller:"AlertController",controllerAs:"vm",templateUrl:"app/components/alert/alertGreen.html",hideDelay:1e4,position:"top"})})["catch"](function(t){console.log("err",t),a.show({controller:"AlertController",controllerAs:"vm",templateUrl:"app/components/alert/alertRed.html",hideDelay:15e4,position:"top"})})}var i=this;i.showSignup=s,i.signup=c}angular.module("app.components").controller("SignupController",t),t.$inject=["$scope","$mdDialog","user","animation","$mdToast"]}(),function(){"use strict";function t(){function t(){}return{link:t,scope:!0,restrict:"E",templateUrl:"app/components/search/search.html",controller:"SearchController",controllerAs:"vm"}}angular.module("app.components").directive("search",t)}(),function(){"use strict";function t(t,n){function e(){}function o(){}function a(t){return n.globalSearch(t).then(function(t){return 0===t.length?t:t.map(function(t){if("Location"!==t.type){var n=s(t),e=c(t);return{type:t.type,name:e,location:n,image:"User"===t.type?"./assets/images/avatar.svg":"./assets/images/kit.svg"}}})})}function s(t){var n="";return t.city&&(n+=t.city),t.country&&(n+=", "+t.country),n}function c(t){var n="User"===t.type?t.username:t.name;return n?n:"No name"}var i=this;i.searchTextChange=e,i.selectedItemChange=o,i.querySearch=a,i.isIconWhite=!0,t.$on("removeNav",function(){t.$apply(function(){i.isIconWhite=!1})}),t.$on("addNav",function(){t.$apply(function(){i.isIconWhite=!0})})}angular.module("app.components").controller("SearchController",t),t.$inject=["$scope","search"]}(),function(){"use strict";function t(){function t(){}return{link:t,scope:!0,restrict:"E",templateUrl:"app/components/navbar/navbar.html",controller:"NavbarController",controllerAs:"vm"}}angular.module("app.components").directive("navbar",t)}(),function(){"use strict";function t(t){t.isShown=!0,t.$on("removeNav",function(){t.$apply(function(){t.isShown=!1})}),t.$on("addNav",function(){t.$apply(function(){t.isShown=!0})})}angular.module("app.components").controller("NavbarController",t),t.$inject=["$scope"]}(),function(){"use strict";angular.module("app.components")}(),function(){"use strict";function t(t,n){var e=this;e.center={lat:t.lat,lng:t.lng,zoom:12},e.defaults={scrollWheelZoom:!1},e.markers=[],n.getDevices(t).then(function(t){{var t=t.plain();t.map(function(t){var n={lat:t.data.location.latitude,lng:t.data.location.longitude,message:"Hola"};e.markers.push(n)})}})}angular.module("app.components").controller("MapController",t),t.$inject=["location","device"]}(),function(){"use strict";function t(){}angular.module("app.components").controller("KitController",t)}(),function(){"use strict";function t(){}angular.module("app.components").controller("HomeController",t)}(),function(){"use strict";function t(t,n){t.answer=function(t){n.hide(t)},t.hide=function(){n.hide()},t.cancel=function(){n.cancel()}}angular.module("app.components").controller("DialogController",t),t.$inject=["$scope","$mdDialog"]}(),function(){"use strict";function t(t){return t.all("users")}angular.module("app.components").factory("user",t),t.$inject=["Restangular"]}(),function(){"use strict";function t(t,n){function e(t){return n.all("search").getList({q:t})}var o={globalSearch:e};return o}angular.module("app.components").factory("search",t),t.$inject=["$http","Restangular"]}(),function(){"use strict";function t(t){return t.jsonp("http://ipinfo.io/?callback=JSON_CALLBACK")}angular.module("app.components").factory("geolocation",t),t.$inject=["$http"]}(),function(){"use strict";function t(t){function n(n){var e="";return e+=n.lat+","+n.lng,t.all("devices").getList({near:e})}var e={getDevices:n};return e}angular.module("app.components").factory("device",t),t.$inject=["Restangular"]}(),function(){"use strict";function t(t){function n(){e()}function e(){s=t.localStorage.getItem("smartcitizen.token")}function o(){return s}function a(){return!!s}var s=null;n();var c={isAuth:a,setCurrentUser:e,getCurrentUser:o};return c}angular.module("app.components").factory("auth",t),t.$inject=["$window"]}(),function(){"use strict";function t(t){function n(){t.$broadcast("blur")}function e(){t.$broadcast("unblur")}function o(){t.$broadcast("removeNav")}function a(){t.$broadcast("addNav")}var s={blur:n,unblur:e,removeNav:o,addNav:a};return s}angular.module("app.components").factory("animation",t),t.$inject=["$rootScope"]}(),function(){"use strict";function t(){function t(t,n){t.$watch("moveDown",function(t){t?n.addClass("move_down"):n.removeClass("move_down")})}return{link:t,scope:!1,restrict:"A"}}function n(t){function n(n,e){var o=e[0].offsetTop,a=64;angular.element(t).on("scroll",function(){var t=document.body.scrollTop;t+a>=o?(e.addClass("stickMenu"),n.$apply(function(){n.moveDown=!0})):(e.removeClass("stickMenu"),n.$apply(function(){n.moveDown=!1}))})}return{link:n,scope:!1,restrict:"A"}}function e(){function t(t,n){t.$on("blur",function(){n.addClass("blur")}),t.$on("unblur",function(){n.removeClass("blur")})}return{link:t,scope:!1,restrict:"A"}}function o(t){function n(n,e){e.on("focusin",function(){t.removeNav()}),e.on("focusout",function(){t.addNav()})}return{link:n}}angular.module("app.components").directive("moveDown",t).directive("stick",n).directive("blur",e).directive("focus",o),n.$inject=["$window"],o.$inject=["animation"]}(),function(){"use strict";function t(t){function n(){t.hide()}var e=this;e.close=n}angular.module("app.components").controller("AlertController",t),t.$inject=["$mdToast"]}(),function(){"use strict";angular.module("app.auth",[])}(),angular.module("app",["ngMaterial","ui.router","restangular","app.components","app.auth"]),function(){"use strict";function t(t,n,e,o){t.state("landing",{url:"/landing",template:"hola"}).state("home",{url:"/",views:{"":{templateUrl:"app/components/home/template.html"},"map@home":{templateUrl:"app/components/map/map.html",controller:"MapController",controllerAs:"vm"},"kit@home":{templateUrl:"app/components/kit/kit.html",controller:"KitController",controllerAs:"vm"}},resolve:{location:["geolocation",function(t){return t.then(function(t){var n=t.data.loc.split(","),e={lat:parseFloat(n[0]),lng:parseFloat(n[1])};return e})}],initialDevices:["device",function(){}]}}),n.otherwise("/"),e.html5Mode({enabled:!0,requireBase:!1}).hashPrefix("!"),o.setBaseUrl("https://new-api.smartcitizen.me/v0")}angular.module("app").config(t),t.$inject=["$stateProvider","$urlRouterProvider","$locationProvider","RestangularProvider"]}(),angular.module("app").run(["$templateCache",function(t){t.put("app/components/alert/alertBlue.html",'<md-toast class="blue"><md-icon md-svg-src="./assets/images/alert_icon.svg" alt="Insert Drive Icon" class="alert_icon"></md-icon><span flex="">text</span><md-button ng-click="vm.close()"><md-icon md-svg-src="./assets/images/close_icon_blue.svg" alt="Insert Drive Icon" class="close_icon"></md-icon></md-button></md-toast>'),t.put("app/components/alert/alertGreen.html",'<md-toast class="green"><md-icon md-svg-src="./assets/images/alert_icon.svg" alt="Insert Drive Icon" class="alert_icon"></md-icon><span flex="">Mu bien</span><md-button ng-click="vm.close()"><md-icon md-svg-src="./assets/images/close_icon_blue.svg" alt="Insert Drive Icon" class="close_icon"></md-icon></md-button></md-toast>'),t.put("app/components/alert/alertRed.html",'<md-toast class="red"><md-icon md-svg-src="./assets/images/alert_icon.svg" alt="Insert Drive Icon" class="alert_icon"></md-icon><span flex="">Mu mal</span><md-button ng-click="vm.close()"><md-icon md-svg-src="./assets/images/close_icon_blue.svg" alt="Insert Drive Icon" class="close_icon"></md-icon></md-button></md-toast>'),t.put("app/components/home/home.html",'<div layout="vertical" layout-fill=""><md-content><section class="content"><section class="map"><h1>Here\'s the map</h1></section><section class="kit_data"><section class="kit_menu" layout="row" layout-align="center center" stick=""><p>Bar with kit info</p></section><section class="kit_fixed" move-down=""><section class="kit_overview" layout="row" layout-align="center center"><p>Kit data overview</p></section><section class="kit_detailed" layout="row" layout-align="center center"><section class="kit_dashboard"><p>Here it\'s the data</p></section></section></section></section></section></md-content></div>'),t.put("app/components/home/template.html",'<div layout="vertical" layout-fill=""><md-content><section class="content"><div ui-view="map" class="map_state"></div><div ui-view="kit" class="kit"></div></section></md-content></div>'),t.put("app/components/kit/kit.html",'<section class="kit_data"><section class="kit_menu" layout="row" layout-align="center center" stick=""><p>Bar with kit info</p></section><section class="kit_fixed" move-down=""><section class="kit_overview" layout="row" layout-align="center center"><p>Kit data overview</p></section><section class="kit_detailed" layout="row" layout-align="center center"><section class="kit_dashboard"><p>Here it\'s the data</p></section></section></section></section>'),t.put("app/components/map/map.html",'<section class="map"><leaflet center="vm.center" markers="vm.markers" defaults="vm.defaults" width="100%" height="500px"></leaflet></section>'),t.put("app/components/navbar/navbar.html",'<md-toolbar layout="row" layout-align="end center" class="stickNav"><section flex="" layout="row" layout-align="space-around center"><a href="/" flex="20" class="logo_link"><md-icon md-svg-src="./assets/images/LogotipoSmartCitizen.svg" alt="Insert Drive Icon" class="logo_icon"></md-icon></a><md-button flex="" href="#" class="md-flat"><md-icon md-svg-src="./assets/images/map_icon.svg" ng-show="isShown" class="nav_icon"></md-icon><span ng-show="isShown">Map</span></md-button><md-button flex="" href="#" class="md-flat"><md-icon md-svg-src="./assets/images/community_icon.svg" ng-show="isShown" class="nav_icon"></md-icon><span ng-show="isShown">Community</span></md-button></section><search flex="40"></search><section flex="" layout="row" layout-align="space-around center"><md-button flex="" href="#" class="md-flat" ng-show="isShown">Get your Kit</md-button><md-button flex="" class="md-flat" ng-show="isShown">Log In</md-button><signup flex="" class="md-display-1" ng-show="isShown"></signup></section></md-toolbar>'),t.put("app/components/search/search.html",'<div class="search_icon"><md-icon md-svg-src="./assets/images/search_icon_white.svg" ng-show="vm.isIconWhite"></md-icon><md-icon md-svg-src="./assets/images/search_icon_black.svg" ng-show="!vm.isIconWhite"></md-icon></div><md-autocomplete md-selected-item="vm.selectedItem" md-selected-item-change="vm.selectedItemChange(item)" md-search-text="vm.searchText" md-search-text-change="vm.searchTextChange(vm.searchText)" md-items="item in vm.querySearch(vm.searchText)" md-item-text="" placeholder="Search" md-delay="400" focus=""><md-item-template><md-icon md-svg-src="{{ item.image }}" class="result_icon"></md-icon><span class="result_name">{{ item.name }}</span> <span class="result_location">{{ item.location }}</span></md-item-template></md-autocomplete>'),t.put("app/components/signup/signup.html",'<md-button ng-click="vm.showSignup($event)">Sign Up</md-button>'),t.put("app/components/signup/signupModal.html",'<md-dialog><md-dialog-content class="modal signup"><div><md-button class="close_icon"><md-icon md-svg-icon="./assets/images/close_icon_blue.svg" ng-click="cancel()" class=""></md-icon></md-button><h2>SIGN UP</h2><div class="modal_message"><p>People looking for a better city</p><p>You\'re part of them? Feel free to join us!</p></div><div layout="" layout-sm="column"><md-input-container flex=""><label>Username</label> <input type="text" ng-model="vm.user.username"></md-input-container></div><div layout="" layout-sm="column"><md-input-container flex=""><label>Password</label> <input type="password" ng-model="vm.user.password"></md-input-container></div><div layout="" layout-sm="column"><md-input-container flex=""><label>Email</label> <input type="email" ng-model="vm.user.email"></md-input-container></div></div><md-button class="md-raised md-primary main" ng-click="answer(vm.user)">Sign up</md-button></md-dialog-content><p class="message_below"><span class="message_below_question">Already have an account?</span><md-button class="message_below_link">LOG IN</md-button></p></md-dialog>')}]);