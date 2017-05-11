app.factory('Modal', function ($uibModal) {
    return {
        alert: function (title, text,size) {
            var size=size||'md';
            var modalInstance = $uibModal.open({
                animation: true
                , ariaLabelledBy: 'modal-title'
                , ariaDescribedBy: 'modal-body'
                , templateUrl: 'alertModal.html'
                , controller: function($scope){
                    $scope.text=text;
                    $scope.title=title;
                    var $ctrl=this;
                    $scope.close=function(){
                         modalInstance.dismiss();
                    }
                }
                , controllerAs: '$ctrl'
                , size: size
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () {
                console.log('dismissed')
            });
        },
        confirm: function (title, text,ok,cancel,size) {
            var size=size||'md';
            var modalInstance = $uibModal.open({
                animation: true
                , ariaLabelledBy: 'modal-title'
                , ariaDescribedBy: 'modal-body'
                , templateUrl: 'confirmModal.html'
                , controller: function($scope){
                    $scope.text=text;
                    $scope.title=title;
                    var $ctrl=this;
                    $scope.close=function(){
                         modalInstance.dismiss();
                    }
                    $scope.ok=function(){
                        if(ok)ok();
                        $scope.close();
                    }
                    $scope.cancel=function(){
                        if(cancel)cancel();
                        $scope.close();
                    }
                }
                , controllerAs: '$ctrl'
                , size: size
            });
            modalInstance.result.then(function (selectedItem) {

            }, function () {
                console.log('dismissed')
            });
        }
    }

})
