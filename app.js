angular.module('blog', []);

angular.module('blog')
  .controller('dashboardController', dashboardController);

function dashboardController($scope) { 
  $scope.pageTitle = "TEST";
  
}



