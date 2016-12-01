angular.module('cloudDemo').controller('emptyTrashController', function ($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});