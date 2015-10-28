MainAppModule.controller('IMPORT_CONTACT', ['$scope', 'FileUploader', '$http', '$compile',
    function ($scope, FileUploader, $http, $compile) {
        $scope.importResult = "";
        $scope.uploader = new FileUploader({
            url: '../BACKEND/index.php/CRImport/do_upload?file_name=contact'
        });

        // FILTERS

        $scope.uploader.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS

        $scope.uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        $scope.uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
            $("#file_csv").val('');
            $scope.importResult = "";
            //$("#file_csv").hide();
        };
        $scope.uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        $scope.uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        $scope.uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        $scope.uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            $scope.importContact();
        };
        $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        $scope.uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        $scope.uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        $scope.uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };
        $scope.importContact = function () {
            $("#processing").show();
            url = "../BACKEND/index.php/CRImport/ImportContact";
            data = {
            };
            $http.post(url, data).
                    then(function (response) {
                        $scope.importResult = response.data;
//                        var log = [];
//                        angular.forEach(response.data, function (value, key) {
//                            $scope.company_import.push(value);
//                        }, log);
                        $("#processing").hide();
                    }, function (response) {
                        $scope.importResult = response.data;
                    });
        }
    }])