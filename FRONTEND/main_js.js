var MainAppModule = angular.module('IDF_CRM', ['ui.select2', 'ngMask']);
MainAppModule.controller('LEFT_MENU', ['$scope', '$http', '$compile',
    function ($scope, $http, $compile) {
        $scope.MainContain = "";
        $scope.Dialog;
        $scope.ErrorMessage;
        $scope.companies = [];
        $scope.Mode = "VIEW";
        $scope.ModalURL = "";
        $scope.ShowAllCompany = function () {

            $("#main_container").load("company/coompany_list.html",
                    function () {
                        $compile($("#main_container"))($scope)
                    }
            );


        }
        $scope.ShowAllContact = function () {

            $("#main_container").load("contact/contact_list.html",
                    function () {
                        $compile($("#main_container"))($scope)
                    }
            );
        }
    }]);
