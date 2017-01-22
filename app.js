(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective)

function FoundItemsDirective() {
  var ddo = {
    templateUrl:'foundItems.html',
    scope: {
      found: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };
  return ddo;
}


function FoundItemsDirectiveController() {
  var list = this;

  list.isEmpty = function () {
    return list.found.length === 0;
  }
}

NarrowItDownController.$inject = ['MenuSearchService', '$scope']
function NarrowItDownController(MenuSearchService, $scope) {
  var narrow = this;
  narrow.foundItems = [];

  narrow.getSearchResults = function() {
    var promise = MenuSearchService.getMatchedMenuItems(narrow.searchTerm);

    promise.then(function (result) {
      narrow.foundItems = result;
    })
    .catch(function (error) {
      console.log("Something went terribly wrong.");
    });;

  }

  narrow.onRemove = function(itemIndex) {
    narrow.foundItems.splice(itemIndex, 1);
  }
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;
  this.getMatchedMenuItems = function(searchTerm)  {
    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    })

    .then(function (result) {
      var foundItems = []
      var resultItems = result.data.menu_items;

      for (var i = 0; i < resultItems.length; i++) {
        if (containsWord(resultItems[i].description, searchTerm)) {
          foundItems.push(resultItems[i]);
        }
      }
      return foundItems;
    })
    .catch(function (error) {
      console.log("Something went terribly wrong.");
    });;
  }

  function containsWord(phrase, searchTerm) {
    if (searchTerm && phrase.toLowerCase().indexOf(searchTerm) !== -1 ) {
      return true;
    }
    return false;
  }
}

})();
