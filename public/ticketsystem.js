var app = angular.module("ticketmodule", []);
app.controller("controller", function($scope, $http, $location){
  $scope.updateTicketTable();

  $scope.openTickets = [];

  $scope.updateTicketTable = function(){
    $http({
      "method":"GET",
      "url":"/updateTable"
    }).then(function(res){
      $scope.openTickets = res.data;
      console.log("GET request for all tickets " + JSON.stringify(res.data));
    })
  }

  $scope.updateTicketTable();

})
