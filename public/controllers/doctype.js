app.config(function ($stateProvider) {
    $stateProvider.state('doctypes', {
        url: '/doctypes'
        , templateUrl: 'views/doctype/doctypes.html'
        , controller: 'DoctypesController'
    }).state('doctype', {
        url: '/doctype'
        , templateUrl: 'views/doctype/doctype.html'
        , controller: 'DoctypeController'
    });
});
app.controller('DoctypesController', function ($scope, $http, Modal) {
    $scope.init = function () {
        $http({
            url: 'api/doctypes'
        }).then(function (response) {
            console.log(response.data)
            $scope.doctypes = response.data.doctypes;
        }, function (response) {})
    }
    $scope.init();
    $scope.deleteDoctype = function (docid) {
        Modal.confirm('Alert', 'Are you sure', function () {
            $http({
                url: 'api/doctype/' + docid
                , method: 'DELETE'
            , }).then(function (response) {
                Modal.alert('Success','Successfully Deleted');
                $scope.init();
            }, function (response) {})
        },null,'sm');
    }
});
app.controller('DoctypeController', function ($scope, $http, Modal, $location) {
    $scope.init = function () {
        $http({
            url: 'api/docs'
        }).then(function (response) {
            console.log(response.data)
            $scope.docdesigns = response.data.docs;
        }, function (response) {})
    }
    $scope.init();
    $scope.submitForm = function () {
        console.log($scope.doctype)
        $http({
            url: 'api/doctype'
            , method: 'POST'
            , data: $scope.doctype
        }).then(function (response) {
            Modal.alert('Alert', 'Successfully Added', 'sm');
            $location.path('/doctypes')
        })
    };
});
