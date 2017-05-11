var app = angular.module('myapp', ['ngMessages', 'ngSanitize', 'ui.router', 'ui.bootstrap']);
app.constant('base_url',window.location.origin+'/');
app.config(function ($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/templates')
    $locationProvider.html5Mode(true);
});
app.run(function ($rootScope, $timeout) {
    $rootScope.$on("$stateChangeSuccess", function () {
        $rootScope.setMaterialForm();
    });
    $rootScope.setMaterialForm = function () {
        $timeout(function () {
            $.material.init();
            $.material.ripples();
            $.material.input();
            $.material.checkbox();
            $.material.radio();
        }, 10)
    }
});
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A'
        , link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
