var app = angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope) {
      // Form data for the login modal
      $scope.loginData = {};

      $rootScope.items = [];


        $rootScope.output = "0";

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {

})

.controller('CalculatorCtrl', function($scope, $rootScope) {

        $scope.newNumber = true;

        $scope.pendingOperation = null;

        $scope.operationToken = "+";

        $scope.runningTotal = 0;

        $scope.pendingValue = null;

        $scope.calculateTotal = function() {
            $scope.setOperation();
            $scope.runningTotal = 0;
            for(var i in $rootScope.items) {
                if($rootScope.items[i].operator == '-') {
                    $scope.runningTotal -= $rootScope.items[i].amount;
                } else {
                    $scope.runningTotal += $rootScope.items[i].amount;
                }
            }
            $rootScope.output = $scope.runningTotal;
        };

        $scope.updateOutput = function (btn) {
            if ($rootScope.output == "0" || $scope.newNumber) {
                $rootScope.output = btn;
                $scope.newNumber = false;
            } else {
                if(btn === "." && $rootScope.output.match(/\./g)) return false;
                $rootScope.output += String(btn);
            }
            $scope.pendingValue = toNumber($rootScope.output);
        };

        $scope.setOperation = function (op) {
            if($scope.pendingValue !== "") {
                $scope.operationToken = $scope.operationToken ? $scope.operationToken : '+';
                $rootScope.items.push({
                    operator: $scope.operationToken,
                    amount: $scope.pendingValue
                });
            }
            clearLast();
            $scope.operationToken = op;

        };

        $scope.clearItems = function() {
            //clearLast();
            $rootScope.output = '0';
            $rootScope.items = [];

        };

        clearLast = function() {
            $scope.operationToken = "";
            $scope.pendingValue = "";
            $rootScope.output = "";
            $scope.newNumber = true;
        };

        toNumber = function (numberString) {
            var result = 0;
            if (numberString) {
                result = numberString * 1;
            }
            return result;
        };

});

app.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});