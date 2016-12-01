angular.module('cloudDemo').directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
    	console.log("change");
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});