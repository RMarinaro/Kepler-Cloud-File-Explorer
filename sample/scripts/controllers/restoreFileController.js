angular.module('cloudDemo').controller('restoreFileController', function ($scope, $uibModalInstance, file) {
  $scope.file = file;
  $scope.ok = function () {
    $uibModalInstance.close($scope.file);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});