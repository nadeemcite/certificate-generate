app.service('ImageCreator', function ($http, $rootScope, $q,) {
    function b64toBlob(b64, onsuccess, onerror) {
        var img = new Image();
        img.onerror = onerror;
        img.onload = function onload() {
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(onsuccess);
        };
        img.src = b64;
    }
    var obj = {
        createImages: function (docId, bulkData) {
            var q = $q.defer();
            var pr = bulkData.reduce(function (promise, data, index) {
                return promise.then(function (response) {
                    q.notify({
                        index: index
                        , prevSuccess: true
                    });
                    return obj.createSingleImage(docId, data.imageString, data.rawData);
                }, function (response) {
                    q.notify({
                        index: index
                        , prevSuccess: false
                    });
                    return obj.createSingleImage(docId, data.imageString, data.rawData);
                });
            }, $q.when());
            pr.then(function (response) {
                console.log('success', response);
                q.notify({
                    end: true
                    , prevSuccess: true
                });
                q.resolve({
                    success: true
                })
            },function(){
                q.notify({
                    end: true
                    , prevSuccess: false
                });
                q.resolve({
                    success: true
                })
            });
            return q.promise;
        }
        , createSingleImage: function (bulkDocumentId, imageString, rawData) {
            var q = $q.defer();
            //q.resolve(rawData);

            b64toBlob(imageString, function (blob) {
                var form = new FormData();
                form.append('pfid', 'PF001');
                form.append('uniqueid', '001');
                form.append('bulkDocument',bulkDocumentId);
                form.append('rawData', rawData);
                form.append('document', blob);
                $http({
                    url: 'api/document'
                    , method: 'POST'
                    , data: form
                    , headers: {
                        'Content-Type': undefined
                    }
                , }).then(function (response) {
                    q.resolve(response.data);
                }, function (response) {
                    q.reject({
                        success: false
                        , error: response.data
                    });
                })
            }, function () {
                q.reject({
                    success: false
                });
            });
            return q.promise;
        }
    }
    return obj;
});
