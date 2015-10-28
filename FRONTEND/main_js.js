// Base64 encoding service used by AuthenticationService
var Base64 = {
    keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;
        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);
        return output;
    },
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;
        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        do {
            enc1 = this.keyStr.indexOf(input.charAt(i++));
            enc2 = this.keyStr.indexOf(input.charAt(i++));
            enc3 = this.keyStr.indexOf(input.charAt(i++));
            enc4 = this.keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);
        return output;
    }
};
var MainAppModule = angular.module('IDF_CRM', ['ui.select2', 'ngAnimate', 'ngCookies', 'ngMask', 'angularFileUpload', 'ngRoute']);

MainAppModule.factory('AuthenticationService', AuthenticationService);
AuthenticationService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout', 'UserService'];
function AuthenticationService($http, $cookieStore, $rootScope, $timeout, UserService) {
    var service = {};
    service.Login = Login;
    service.SetCredentials = SetCredentials;
    service.ClearCredentials = ClearCredentials;
    return service;
    function Login(username, password, callback) {

        /* Dummy authentication for testing, uses $timeout to simulate api call
         ----------------------------------------------*/
        $timeout(function () {
            var response;
            UserService.GetByUsername(username)
                    .then(function (user) {
                        if (user !== null && user.PASSWORD === Base64.encode(password)) {
                            response = {success: true, user: user};
                        } else {
                            response = {success: false, message: 'Username or password is incorrect'};
                        }
                        callback(response);
                    });
        }, 1000);
        /* Use this for real authentication
         ----------------------------------------------*/
        //$http.post('/api/authenticate', { username: username, password: password })
        //    .success(function (response) {
        //        callback(response);
        //    });

    }

    function SetCredentials(user) {
        $rootScope.globals = {
            currentUser: user
        };
        $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(user.USERNAME); // jshint ignore:line
        $cookieStore.put('globals', $rootScope.globals);
    }

    function ClearCredentials() {
        $rootScope.globals = null;
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic ';
    }
}
MainAppModule.factory('UserService', UserService);

UserService.$inject = ['$http'];
function UserService($http) {
    var service = {};
    service.GetByUsername = GetByUsername;
    return service;



    function GetByUsername(username) {
        url = "../BACKEND/index.php/Record/getList/user";
        filter = {
            filter: [
                {field: "USERNAME", value: username}
            ]
        };
        return $http.post(url, filter).then(handleSuccess, handleError('Error getting user by username'));
    }
    // private functions

    function handleSuccess(res) {
        data = res.data;
        user = null;
        if (data.recordsFiltered > 0) {
            data = data.data[0];
            user = data;
        }

        return user;
    }

    function handleError(error) {
        return function () {
            return {success: false, message: error};
        };
    }
}

MainAppModule.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
                when('/ShowCompany', {
                    templateUrl: 'company/coompany_list.html',
                    controller: 'COMPANY'
                })
                .when('/ShowCompany/:USER', {
                    templateUrl: 'company/my_company_list.html',
                    controller: 'MY_COMPANY'
                })
                .when('/AddCompany', {
                    templateUrl: 'company/company_edit.html',
                    controller: 'ADD_COMPANY'
                })
                .when('/EditCompany/:ID', {
                    templateUrl: 'company/company_edit.html',
                    controller: 'EDIT_COMPANY'
                })
                .when('/ViewCompany/:ID', {
                    templateUrl: 'company/company_view.html',
                    controller: 'VIEW_COMPANY'
                })
                .when('/ShowContact', {
                    templateUrl: 'contact/contact_list.html',
                    controller: 'CONTACT'
                })
                .when('/ShowContact/:USER', {
                    templateUrl: 'contact/my_contact_list.html',
                    controller: 'MY_CONTACT'
                })
                .when('/AddContact/:COMPANY', {
                    templateUrl: 'contact/contact_edit.html',
                    controller: 'ADD_CONTACT'
                })
                .when('/EditContact/:ID', {
                    templateUrl: 'contact/contact_edit.html',
                    controller: 'EDIT_CONTACT'
                })
                .when('/ViewContact/:ID', {
                    templateUrl: 'contact/contact_view.html',
                    controller: 'VIEW_CONTACT'
                })
                .when('/ShowUser', {
                    templateUrl: 'user/user_list.html',
                    controller: 'USER'
                })
                .when('/AddUser', {
                    templateUrl: 'user/user_edit.html',
                    controller: 'ADD_USER'
                })
                .when('/EditUser/:ID', {
                    templateUrl: 'user/user_edit.html',
                    controller: 'EDIT_USER'
                })
                .when('/ViewUser/:ID', {
                    templateUrl: 'user/user_view.html',
                    controller: 'VIEW_USER'
                })
                .when('/ShowProject', {
                    templateUrl: 'project/project_list.html',
                    controller: 'USER'
                })
                .when('/AddProject', {
                    templateUrl: 'project/project_edit.html',
                    controller: 'ADD_USER'
                })
                .when('/EditProject/:ID', {
                    templateUrl: 'project/project_edit.html',
                    controller: 'EDIT_USER'
                })
                .when('/ViewProject/:ID', {
                    templateUrl: 'project/project_view.html',
                    controller: 'VIEW_USER'
                })
                .when('/login', {
                    controller: 'LoginController',
                    templateUrl: 'login.html',
                })
                .when('/EditPfofile/:ID', {
                    templateUrl: 'user/user_edit2.html',
                    controller: 'EDIT_USER'
                })
                .when('/ChangeUserPassword/:ID', {
                    templateUrl: 'user/change_password.html',
                    controller: 'CHANGE_PASSWORD'
                })
                .otherwise({
                    redirectTo: '/'
                });
    }]);
MainAppModule.run(run);
run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
function run($rootScope, $location, $cookieStore, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/']) === -1;
        var loggedIn = $rootScope.globals.currentUser;
        if (restrictedPage && !loggedIn) {
            $location.path('/login');
        }
    });
}
MainAppModule.factory('back', ['$window', function ($window) {
        return function () {
            $window.history.back();
        };
    }]);
MainAppModule.factory('SetModifyBy', ['timeStamp', '$rootScope', function (timeStamp, $rootScope) {
        return function (obj) {
            currentUser = $rootScope.globals.currentUser;
            date = timeStamp;
            date = date.split(' ');
            obj.MODIFY_DATE = date[0];
            obj.MODIFY_TIME = date[1];
            obj.MODIFY_BY = currentUser.USERNAME;
        };
    }]);
MainAppModule.factory('SetCreateBy', ['timeStamp', '$rootScope', function (timeStamp, $rootScope) {
        return function (obj) {
            currentUser = $rootScope.globals.currentUser;
            date = timeStamp;
            date = date.split(' ');
            obj.CREATE_DATE = date[0];
            obj.CREATE_TIME = date[1];
            obj.CREATE_BY = currentUser.USERNAME;
            obj.MODIFY_DATE = date[0];
            obj.MODIFY_TIME = date[1];
            obj.MODIFY_BY = currentUser.USERNAME;
        };
    }]);
MainAppModule.factory('timeStamp', ['$filter', function ($filter) {
        return  $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
    }]);

MainAppModule.controller('MAIN', ['$scope', '$rootScope', 'timeStamp', '$rootScope', '$cookieStore', '$http', '$compile',
    function ($scope, $rootScope, timeStamp, $rootScope, $cookieStore, $http, $compile) {
        //$rootScope.globals = $cookieStore.get('globals') || {};
        $scope.currentUser = $rootScope.globals.currentUser;

    }]);
MainAppModule.controller('LoginController', ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        $scope.error = false;
        $scope.loading = false;
        AuthenticationService.ClearCredentials();
        $scope.login = function () {
            if ($scope.username == "") {
                $scope.error = true;
                $scope.message = 'Please input username';
                return;
            }
            if ($scope.password == "") {
                $scope.error = true;
                $scope.message = 'Please input password';
                return;
            }
            $scope.loading = true;
            AuthenticationService.Login($scope.username, $scope.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(response.user);
                    $('#loginModal').modal('toggle');
                    setTimeout(function () {
                        $location.path('/');

                    }, 1000);

                    $location.path('/');
                    $scope.loading = false;
                    location.reload();
                } else {
                    $scope.message = response.message;
                    $scope.error = true;
                    $scope.loading = false;
                }
            });
        }
        $('#loginModal').modal();
        $('#loginModal').on('hidden.bs.modal', function () {
            if ($rootScope.globals == null) {
                $('#loginModal').modal();
            }
        })
    }]);