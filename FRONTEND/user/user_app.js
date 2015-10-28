MainAppModule.controller('USER', ['$scope', '$http', '$compile',
    function ($scope, $http, $compile) {
        $scope.table_user = null;
        $scope.user = {};
        $scope.selected_user = {};
        $scope.GetUserList = function () {
            url = "../BACKEND/index.php/Record/getList/user";
            $scope.table_user = $('#tb_user').DataTable({
                "processing": true,
                "serverSide": true,
                "order": [[4, "desc"]],
                stateSave: true,
                "lengthMenu": [10, 25, 50, 100, "All"],
                ajax: {
                    url: url,
                    dataSrc: 'data'
                },
                columns: [
                    {data: "PHOTO", searchable: true},
                    {data: "FIRST_NAME", searchable: true},
                    {data: "LAST_NAME", searchable: true},
                    {data: "USERNAME", searchable: true},
                    {data: "ID"}
                ],
                "columnDefs": [
                    {
                        "render": function (data, type, row) {
                            if (row.PHOTO != '') {
                                html = '<img style="height:30px" src="' + row.PHOTO + '" class="img-circle" alt="User Image">\n\
                                    <a href="#ViewUser/' + row.ID + '">' + row.TITLE + ' ' + row.FIRST_NAME + ' ' + row.LAST_NAME + '</a>';
                            } else {
                                html = '<img style="height:30px" src="images/user.png" class="img-circle" alt="User Image">\n\
                                    <a href="#ViewUser/' + row.ID + '">' + row.TITLE + ' ' + row.FIRST_NAME + ' ' + row.LAST_NAME + '</a>';
                            }
                            return html;
                        },
                        "targets": 1
                    },
                    {
                        "render": function (data, type, row) {
                            //return "<a id='#" + data + "' href='#'>" + data + "</a>";
                            return '<a href="#EditUser/' + row.ID + '" class="edit btn btn-warning btn-xs" data-toggle="tooltip" data-placement="top" title="Edit Contact">\<i class="fa fa-pencil"></i></a>\
                                    <button type="button" class="delete btn btn-danger btn-xs" data-toggle="tooltip" data-placement="top" title="Delete Contact">\<i class="fa fa-bitbucket"></i></button>';
                        },
                        "targets": 4
                    },
                    {"visible": false, "targets": [0, 2]},
                ]
            });
            $('#tb_user tbody').on('click', '.delete', function () {
                var data = $scope.table_user.row($(this).parent().parent()).data();
                var msg = '<div class="alert alert-warning alert-dismissable">\
                           <h4><i class="icon fa fa-warning"></i> Warning!</h4>\
                           Are you sure to delete user "' + data.USERNAME + '" \
                         </div>'
                bootbox.confirm(msg, function (result) {
                    if (result == true) {
                        $scope.DeleteUser(data);
                    }
                });
            });
        }
        $scope.EditUser = function (USER_ID) {
            $scope.Mode = "EDIT";
            url = "../BACKEND/index.php/Record/getList/user";
            filter = {
                filter: [
                    {field: "ID", value: USER_ID}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {
                        $scope.new_contact = response.data.data[0];
                        $scope.contact_emails = [];
                        $($scope.target).load("contact/user_edit.html",
                                function () {
                                    $scope.InitTitle();
                                    $($scope.target).hide();
                                    $compile($($scope.target))($scope)
                                    $($scope.target).fadeIn("fast");
                                }

                        );
                    }, function (response) {

                    });
        }

        $scope.DeleteUser = function (user) {
            url = "../BACKEND/index.php/Record/delete/user";
            $http.post(url, {filter: [{field: "ID", value: user.ID}]}).
                    then(function (response) {
                        $scope.table_user.draw();
                    }, function (response) {
                        var msg = '<div class="alert alert-danger alert-dismissable">\
            <h4><i class="icon fa fa-warning"></i> Alert!</h4>\
                    ' + response.data + ' \
                    </div>';
                        bootbox.alert(msg);
                    });
        }
        $scope.ShowUserInfo = function (USER_ID) {
            //$scope.target = "#modal_container";
            $scope.Mode = "VIEW";
            url = "../BACKEND/index.php/Record/getList/user";
            filter = {
                filter: [
                    {field: "ID", value: USER_ID}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {

                        if (response.data.recordsFiltered > 0) {

                            $scope.selected_contact = response.data.data[0];
                            $scope.GetCurrentCompany($scope.selected_contact.COMPANY);
                            $($scope.target).load("contact/user_view.html",
                                    function () {

                                        $($scope.target).hide();
                                        $compile($($scope.target))($scope)
                                        $($scope.target).fadeIn("fast");
                                    }

                            );
                        } else {

                        }
                    }, function (response) {

                    });
        }


    }]);
MainAppModule.controller('ADD_USER', ['$scope', '$http', '$compile', 'back',
    function ($scope, $http, $compile, back) {
        $scope.back = function () {
            back();
        }
        $scope.InitTitle = function () {

            url = "../BACKEND/index.php/Record/getList/title";
            $http.post(url).
                    then(function (response) {
                        $.each(response.data.data, function (index, data) {
                            $("#user_TITLE").append("<option value='" + data.NAME + "' >" + data.NAME + "</option>")
                        })

                        $("#user_TITLE").select2({
                        })
                    }, function (response) {

                    });
        }
        $scope.CheckUsername = function (frm_User) {
            if (frm_User.$valid) {
                url = "../BACKEND/index.php/Record/getList/user";
                filter = {
                    filter: [
                        {field: "USERNAME", value: $scope.user.USERNAME}
                    ]
                };
                $http.post(url, filter).
                        then(function (response) {
                            user_exist = response.data;
                            if (user_exist.recordsFiltered == 0) {
                                $scope.SaveUser();
                            } else {
                                var msg = '<div class="alert alert-danger alert-dismissable">\
                                            <h4><i class="icon fa fa-warning"></i> Error!</h4>\
                                            Username "' + $scope.user.USERNAME + '" already exist. \
                                           </div>';
                                bootbox.alert(msg);
                            }
                        }, function (response) {

                        });
            }
        }
        $scope.SaveUser = function () {

            $scope.user.PASSWORD = Base64.encode($scope.user.PASSWORD);
            url = "../BACKEND/index.php/Record/add/user/ID";
            $http.post(url, $scope.user).
                    then(function (response) {
                        setTimeout(function () {
                            var msg = '<div class="alert alert-success alert-dismissable">\
                                            <h4><i class="icon fa icon fa fa-check"></i> Success</h4>\
                                            Save Contact complete.. \
                                        </div>';
//                            bootbox.alert(msg, function () {
//                                setTimeout(function () {
//                                    //$scope.ShowAllContact();
//                                }, 400);
//                            });
                        }, 400);
                        $scope.back();
                    }, function (response) {
                        var msg = '<div class="alert alert-danger alert-dismissable">\
            <h4><i class="icon fa fa-warning"></i> Error!</h4>\
                    ' + response.data + ' \
                        </div>';
                        bootbox.alert(msg);
                    });
        }
        $scope.InitTitle();
    }])
MainAppModule.controller('EDIT_USER', ['$scope', '$http', '$compile', '$routeParams', 'back',
    function ($scope, $http, $compile, $routeParams, back) {
        $scope.user = {ID: $routeParams.ID};
        $scope.back = function () {
            back();
        }
        $scope.InitTitle = function () {

            url = "../BACKEND/index.php/Record/getList/title";
            $http.post(url).
                    then(function (response) {
                        $.each(response.data.data, function (index, data) {
                            $("#user_TITLE").append("<option value='" + data.NAME + "' >" + data.NAME + "</option>")
                        })
                        $("#user_TITLE").val($scope.user.TITLE);
                        $("#user_TITLE").select2({
                        })
                    }, function (response) {

                    });
        }
        $scope.CheckUsername = function (frm_User) {
            if (frm_User.$valid) {
                url = "../BACKEND/index.php/Record/getList/user";
                filter = {
                    filter: [
                        {field: "USERNAME", value: $scope.user.USERNAME},
                        {field: "ID<>", value: $scope.user.ID}
                    ]
                };
                $http.post(url, filter).
                        then(function (response) {
                            user_exist = response.data;
                            if (user_exist.recordsFiltered == 0) {
                                $scope.SaveUser();
                            } else {
                                var msg = '<div class="alert alert-danger alert-dismissable">\
                                            <h4><i class="icon fa fa-warning"></i> Error!</h4>\
                                            Username "' + $scope.user.USERNAME + '" already exist. \
                                           </div>';
                                bootbox.alert(msg);
                            }
                        }, function (response) {

                        });
            }
        }
        $scope.SaveUser = function () {

            $scope.user.PASSWORD = Base64.encode($scope.user.PASSWORD);
            url = "../BACKEND/index.php/Record/add/user/ID";
            $http.post(url, $scope.user).
                    then(function (response) {
                        setTimeout(function () {
                            var msg = '<div class="alert alert-success alert-dismissable">\
                                            <h4><i class="icon fa icon fa fa-check"></i> Success</h4>\
                                            Save Contact complete.. \
                                        </div>';
//                            bootbox.alert(msg, function () {
//                                setTimeout(function () {
//                                    //$scope.ShowAllContact();
//                                }, 400);
//                            });
                        }, 400);
                        $scope.back();
                    }, function (response) {
                        var msg = '<div class="alert alert-danger alert-dismissable">\
            <h4><i class="icon fa fa-warning"></i> Error!</h4>\
                    ' + response.data + ' \
                        </div>';
                        bootbox.alert(msg);
                    });
        }
        $scope.LoadData = function () {
            url = "../BACKEND/index.php/Record/getList/user";
            filter = {
                filter: [
                    {field: "ID", value: $scope.user.ID}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {
                        $scope.user = response.data.data[0];

                        $scope.user.PASSWORD = Base64.decode($scope.user.PASSWORD);
                    }, function (response) {

                    });
        }
        $scope.LoadData();
        $scope.InitTitle();
    }])
MainAppModule.controller('VIEW_USER', ['$scope', '$http', '$compile', '$routeParams', 'back',
    function ($scope, $http, $compile, $routeParams, back) {
        $scope.user = {ID: $routeParams.ID};
        $scope.back = function () {
            back();
        }
        $scope.LoadData = function () {
            url = "../BACKEND/index.php/Record/getList/user";
            filter = {
                filter: [
                    {field: "ID", value: $scope.user.ID}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {
                        $scope.user = response.data.data[0];
                    }, function (response) {

                    });
        }
        $scope.LoadData();
    }])
MainAppModule.controller('CHANGE_PASSWORD', ['$scope', '$http', '$compile', '$location', '$routeParams', 'back',
    function ($scope, $http, $compile, $location, $routeParams, back) {
        $scope.user = {ID: $routeParams.ID};
        $scope.back = function () {
            back();
        }
        $scope.CheckPassword = function (frm_User) {
            if (frm_User.$valid) {
                url = "../BACKEND/index.php/Record/getList/user";
                filter = {
                    filter: [
                        {field: "ID", value: $scope.user.ID}
                    ]
                };
                $http.post(url, filter).
                        then(function (response) {
                            user_exist = response.data.data[0];
                            if (user_exist.PASSWORD == Base64.encode($scope.oldpassword)) {
                                $scope.SaveUser();
                            } else {
                                var msg = '<div class="alert alert-danger alert-dismissable">\
                                            <h4><i class="icon fa fa-warning"></i> Error!</h4>\
                                            Old password not currect \
                                           </div>';
                                bootbox.alert(msg);
                            }
                        }, function (response) {

                        });
            }
        }
        $scope.SaveUser = function () {

            $scope.user.PASSWORD = Base64.encode($scope.user.PASSWORD);
            url = "../BACKEND/index.php/Record/add/user/ID";
            $http.post(url, $scope.user).
                    then(function (response) {
                        setTimeout(function () {
                            var msg = '<div class="alert alert-success alert-dismissable">\
                                            <h4><i class="icon fa icon fa fa-check"></i> Success</h4>\
                                            Password Changed.. \
                                        </div>';
                            bootbox.alert(msg, function () {
                                setTimeout(function () {
                                    //$scope.ShowAllContact();
                                }, 400);
                            });
                        }, 400);
                        $location.path('/');
                    }, function (response) {
                        var msg = '<div class="alert alert-danger alert-dismissable">\
            <h4><i class="icon fa fa-warning"></i> Error!</h4>\
                    ' + response.data + ' \
                        </div>';
                        bootbox.alert(msg);
                    });
        }
        $scope.LoadData = function () {
            url = "../BACKEND/index.php/Record/getList/user";
            filter = {
                filter: [
                    {field: "ID", value: $scope.user.ID}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {
                        $scope.user = response.data.data[0];

                        //   $scope.user.PASSWORD = Base64.decode($scope.user.PASSWORD);
                        $scope.user.PASSWORD = '';
                    }, function (response) {

                    });
        }
        $scope.LoadData();
    }])