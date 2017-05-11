app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.state('templates', {
        url: '/templates'
        , templateUrl: 'views/template/templates.html'
        , controller: 'TemplatesController'
    }).state('template', {
        url: '/template'
        , templateUrl: 'views/template/template.html'
        , controller: 'TemplateController'
    });
});
app.controller('TemplatesController', function ($scope, $http, Modal,$location) {
    $scope.init=function(){
        $http({
        url: 'api/docs'
    }).then(function (response) {
        $scope.docdesigns = response.data.docs;
    }, function () {});
    }
    $scope.init();
    $scope.deleteDoc = function (docid) {
        Modal.confirm('Alert', 'Are you sure?', function () {
            $http({
                url: 'api/docs/' + docid,
                method:'DELETE'
            }).then(function(){
                Modal.alert('Alert','Successfully Deleted','sm');
                $scope.init();
            },function(response){
                console.log(response.data)
            })
        });
    }
});
app.controller('TemplateController', function ($scope, $http, $timeout, $location) {
    $scope.state = 1;
    var canvas = new fabric.Canvas('c');

    $scope.submitForm = function () {
        $scope.state = 2;
        // create a rectangle object
        var rect = new fabric.Rect({
            left: 100
            , top: 100
            , fill: 'red'
            , width: 20
            , height: 20
        });
        // "add" rectangle onto canvas
        canvas.add(rect);
        var reader = new FileReader();
        reader.addEventListener("loadend", function () {
            $scope.imageurl = reader.result;
            canvas.setBackgroundImage($scope.imageurl, canvas.renderAll.bind(canvas), {
                backgroundImageOpacity: 0.5
                , backgroundImageStretch: true
                , width: canvas.width
                , height: canvas.height, // Needed to position backgroundImage at 0/0
                originX: 'left'
                , originY: 'top'
            });
        });
        reader.readAsDataURL($scope.docdesign.background);
    }
    $scope.saveDoc = function () {
        canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
        var obj = {
            canvas: JSON.stringify(canvas)
            , background: $scope.docdesign.background
            , name: $scope.docdesign.name
        }
        var form = new FormData();
        form.append('canvas', obj.canvas);
        form.append('background', obj.background);
        form.append('name', obj.name);
        $http({
            url: 'api/docs'
            , method: 'POST'
            , data: form
            , headers: {
                'Content-Type': undefined
            }
        }).then(function (response) {
            console.log(response.data);
            $location.path('/templates');
        }, function (response) {
            console.log(response.data);
        })
    }
});
