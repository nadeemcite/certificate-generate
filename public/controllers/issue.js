app.config(function ($stateProvider) {
    $stateProvider.state('issue', {
        template: '<div ui-view></div>'
    });
    $stateProvider.state('issue.csvupload', {
        url: '/csvupload'
        , templateUrl: 'views/issue/csvupload.html'
        , controller: 'IssueDocumentCsvController'
    }).state('issue.docs', {
        url: '/docs'
        , templateUrl: 'views/issue/documents.html'
        , controller: 'DocumentsController'
    });
});
app.controller('IssueDocumentCsvController', function ($scope, Modal, $http, $rootScope, ImageCreator, base_url,$q) {
    $scope.canvas = new fabric.Canvas('resultCreator');
    $scope.tempCanvas = new fabric.Canvas('tempCanvas');
    $scope.canvas.on('object:selected', function (e) {
        console.log(e)
        $scope.objectSelected = true;
        $scope.selectedObject = $scope.canvas.getActiveObject();
        $scope.$apply();
    });
    $scope.canvas.on('selection:cleared', function () {
        $scope.objectSelected = false;
        $scope.$apply();
    });
    $scope.objectSelected = false;
    $scope.selectedObject = null;
    $scope.init = function () {
        $scope.state = 1
        $http({
            url: 'api/doctypes'
        }).then(function (response) {
            console.log(response.data)
            $scope.doctypes = response.data.doctypes;
        }, function (response) {})
    }
    $scope.init();
    $scope.selectDoctype = function (doctype) {
        $scope.state = 2;
        $scope.selectedDoctype = doctype;
        $scope.canvas.loadFromJSON($scope.selectedDoctype.template.canvas);
        $scope.canvas.setBackgroundImage(base_url + 'api/docbackground/' + $scope.selectedDoctype.template._id, $scope.canvas.renderAll.bind($scope.canvas), {
            backgroundImageOpacity: 0.5
            , backgroundImageStretch: true
            , width: $scope.canvas.width
            , height: $scope.canvas.height, // Needed to position backgroundImage at 0/0
            originX: 'left'
            , originY: 'top'
        });
    }
    $scope.submitForm = function () {
        $scope.state = 3;
        $scope.selectedKeys = {};
        Papa.parse($scope.csv, {
            header: true
            , skipEmptyLines: true
            , complete: function (results) {
                console.log("Finished:", results.data);
                $scope.csvParsedDATA = results.data;
                for (var key in $scope.csvParsedDATA[0]) {
                    $scope.selectedKeys[key] = true;
                }
                $scope.$apply();
                $rootScope.setMaterialForm()
            }
        });
    }
    $scope.setFields = function () {
        console.log($scope.selectedKeys);
        $scope.state = 4;
    }
    $scope.submitFinalData = function () {
        $scope.state = 5;
    }
    $scope.deleteObject = function () {
        try {
            $scope.canvas.remove($scope.selectedObject);
        }
        catch (e) {
            console.log(e)
            $scope.canvas.renderAll();
        }
    }
    $scope.usedKeys = [];
    $scope.keysNotUsed = [];
    $scope.addField = function (key) {
        var keyString = "$$" + key + "$$";
        if ($scope.usedKeys.indexOf(key) == -1) {
            $scope.usedKeys.push(key)
        }
        var text = new fabric.Text(keyString, {
            left: 100
            , top: 100
        });
        $scope.canvas.add(text);
    }
    $scope.sendCSVDataToServer = function () {
        //$scope.canvas.setBackgroundImage(null, $scope.canvas.renderAll.bind($scope.canvas));
        $scope.state = 6;
        var finalObjString = JSON.stringify($scope.canvas.toJSON());
        var mappedDataPromises = $scope.csvParsedDATA.map(function (data,index) {
            var q=$q.defer();
            console.log('started',index)
            var newObjString = "" + finalObjString;
            for (var key in data) {
                if ($scope.usedKeys.indexOf(key) != -1) {
                    newObjString = newObjString.replace('$$' + key + '$$', data[key]);
                }
            }

            data.rawData = newObjString;
            var background = fabric.Image.fromURL(base_url + 'api/docbackground/' + $scope.selectedDoctype.template._id, function (oImg) {
                $scope.tempCanvas.clear();
                $scope.tempCanvas.loadFromJSON(newObjString);
                oImg.left=0;
                oImg.top=0;
                oImg.height=$scope.tempCanvas.height;
                oImg.width=$scope.tempCanvas.width;
                $scope.tempCanvas.add(oImg)
                $scope.tempCanvas.renderAll();
                data.imageString = $scope.tempCanvas.toDataURL('png');
                q.resolve({success:true,data:data});
            });
            return q.promise;
        });
        var bulkData=[]
        var last=mappedDataPromises.reduce(function(promise,p_el,index){
            return promise.then(function(response){
                if(index!=0){
                    bulkData.push(response.data);
                }
                return p_el;
            })
        },$q.when());
        last.then(function(response){
            bulkData.push(response.data);
            console.log(bulkData);
        })
        /*
        ImageCreator.createImages($scope.selectedDoctype._id, mappedData).then(function (response) {
            console.log(response);
        }, function (response) {
            console.log(respose);
        }, function (response) {
            console.log(response)
            if (response.index) {
                var per = ((response.index + 1) * 100) / mappedData.length;
                var el = angular.element('#totalProgress');
                el.css('width', per + '%');
            }
            if (response.end) {
                Modal.alert('Scuccess', 'All Documents created successfully');
            }
        });*/
    }
    $scope.submitFinalCanvas = function () {
        //Check if all keys were used
        $scope.keysNotUsed = [];
        for (var k in $scope.selectedKeys) {
            if ($scope.selectedKeys[k]) {
                if ($scope.usedKeys.indexOf(k) == -1) {
                    $scope.keysNotUsed.push(k)
                }
            }
        }
        if ($scope.keysNotUsed.length > 0) {
            Modal.confirm('Alert', 'Keys ' + $scope.keysNotUsed.join(', ') + ' were not used. Do you want to continue?', $scope.sendCSVDataToServer, null, 'md');
        }
        else {
            $scope.sendCSVDataToServer();
        }
    }
});
app.controller('DocumentsController', function ($scope, $http) {
    $http({
        url: 'api/document'
    }).then(function (response) {
        $scope.docs = response.data.docs;
    })
})
