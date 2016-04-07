angular.module('blog', []);

angular.module('blog')
  .controller('DashboardController', DashboardController);

function DashboardController() { 
  $rootScope.pageTitle = "TEST";
}



