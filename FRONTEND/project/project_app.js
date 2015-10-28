MainAppModule.controller('PROJECT', ['$scope', '$http', '$compile',
    function ($scope, $http, $compile) {
        $scope.table_project = null;
        $scope.project = {};
        $scope.selected_project = {};
        $scope.GetProjectList = function () {
            url = "../BACKEND/index.php/Record/getList/project";
            $scope.table_project = $('#tb_project').DataTable({
                "processing": true,
                "serverSide": true,
                "order": [[5, "desc"]],
                stateSave: true,
                "lengthMenu": [10, 25, 50, 100, "All"],
                ajax: {
                    url: url,
                    dataSrc: 'data'
                },
                columns: [
                    {data: "CODE", searchable: true},
                    {data: "NAME", searchable: true},
                    {data: "START_DATE", searchable: true},
                    {data: "END_DATE", searchable: true},
                    {data: "STATUS"},
                    {data: "ID"}
                ],
                "columnDefs": [
                    {
                        "render": function (data, type, row) {

                            html = '<a href="#ViewUser/' + row.ID + '">' + row.NAME + '</a>';

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
                        "targets": 5
                    },
                   // {"visible": false, "targets": [0, 2]},
                ]
            });
            $('#tb_project tbody').on('click', '.delete', function () {
                var data = $scope.table_project.row($(this).parent().parent()).data();
                var msg = '<div class="alert alert-warning alert-dismissable">\
                           <h4><i class="icon fa fa-warning"></i> Warning!</h4>\
                           Are you sure to delete project "' + data.PROJECTNAME + '" \
                         </div>'
                bootbox.confirm(msg, function (result) {
                    if (result == true) {
                        $scope.DeleteUser(data);
                    }
                });
            });
        }
        $scope.DeleteUser = function (project) {
            url = "../BACKEND/index.php/Record/delete/project";
            $http.post(url, {filter: [{field: "ID", value: project.ID}]}).
                    then(function (response) {
                        $scope.table_project.draw();
                    }, function (response) {
                        var msg = '<div class="alert alert-danger alert-dismissable">\
            <h4><i class="icon fa fa-warning"></i> Alert!</h4>\
                    ' + response.data + ' \
                    </div>';
                        bootbox.alert(msg);
                    });
        }
        $scope.ShowUserInfo = function (PROJECT_ID) {
            //$scope.target = "#modal_container";
            $scope.Mode = "VIEW";
            url = "../BACKEND/index.php/Record/getList/project";
            filter = {
                filter: [
                    {field: "ID", value: PROJECT_ID}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {

                        if (response.data.recordsFiltered > 0) {

                            $scope.selected_contact = response.data.data[0];
                            $scope.GetCurrentCompany($scope.selected_contact.COMPANY);
                            $($scope.target).load("contact/project_view.html",
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
MainAppModule.controller('ADD_PROJECT', ['$scope', '$http', '$compile', 'back',
    function ($scope, $http, $compile, back) {
        $scope.back = function () {
            back();
        }
        $scope.InitTitle = function () {

            url = "../BACKEND/index.php/Record/getList/title";
            $http.post(url).
                    then(function (response) {
                        $.each(response.data.data, function (index, data) {
                            $("#project_TITLE").append("<option value='" + data.NAME + "' >" + data.NAME + "</option>")
                        })

                        $("#project_TITLE").select2({
                        })
                    }, function (response) {

                    });
        }
        $scope.CheckUsername = function (frm_User) {
            if (frm_User.$valid) {
                url = "../BACKEND/index.php/Record/getList/project";
                filter = {
                    filter: [
                        {field: "PROJECTNAME", value: $scope.project.PROJECTNAME}
                    ]
                };
                $http.post(url, filter).
                        then(function (response) {
                            project_exist = response.data;
                            if (project_exist.recordsFiltered == 0) {
                                $scope.SaveUser();
                            } else {
                                var msg = '<div class="alert alert-danger alert-dismissable">\
                                            <h4><i class="icon fa fa-warning"></i> Error!</h4>\
                                            Username "' + $scope.project.PROJECTNAME + '" already exist. \
                                           </div>';
                                bootbox.alert(msg);
                            }
                        }, function (response) {

                        });
            }
        }
        $scope.SaveUser = function () {


            url = "../BACKEND/index.php/Record/add/project/ID";
            $http.post(url, $scope.project).
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
MainAppModule.controller('EDIT_PROJECT', ['$scope', '$http', '$compile', '$routeParams', 'back',
    function ($scope, $http, $compile, $routeParams, back) {
        $scope.project = {ID: $routeParams.ID};
        $scope.back = function () {
            back();
        }
        $scope.InitTitle = function () {

            url = "../BACKEND/index.php/Record/getList/title";
            $http.post(url).
                    then(function (response) {
                        $.each(response.data.data, function (index, data) {
                            $("#project_TITLE").append("<option value='" + data.NAME + "' >" + data.NAME + "</option>")
                        })
                        $("#project_TITLE").val($scope.project.TITLE);
                        $("#project_TITLE").select2({
                        })
                    }, function (response) {

                    });
        }
        $scope.CheckUsername = function (frm_User) {
            if (frm_User.$valid) {
                url = "../BACKEND/index.php/Record/getList/project";
                filter = {
                    filter: [
                        {field: "PROJECTNAME", value: $scope.project.PROJECTNAME},
                        {field: "ID<>", value: $scope.project.ID}
                    ]
                };
                $http.post(url, filter).
                        then(function (response) {
                            project_exist = response.data;
                            if (project_exist.recordsFiltered == 0) {
                                $scope.SaveUser();
                            } else {
                                var msg = '<div class="alert alert-danger alert-dismissable">\
                                            <h4><i class="icon fa fa-warning"></i> Error!</h4>\
                                            Username "' + $scope.project.PROJECTNAME + '" already exist. \
                                           </div>';
                                bootbox.alert(msg);
                            }
                        }, function (response) {

                        });
            }
        }
        $scope.SaveUser = function () {


            url = "../BACKEND/index.php/Record/add/project/ID";
            $http.post(url, $scope.project).
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
            url = "../BACKEND/index.php/Record/getList/project";
            filter = {
                filter: [
                    {field: "ID", value: $scope.project.ID}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {
                        $scope.project = response.data.data[0];
                    }, function (response) {

                    });
        }
        $scope.LoadData();
        $scope.InitTitle();
    }])
MainAppModule.controller('VIEW_PROJECT', ['$scope', '$http', '$compile', '$routeParams', 'back',
    function ($scope, $http, $compile, $routeParams, back) {
        $scope.project = {ID: $routeParams.ID};
        $scope.back = function () {
            back();
        }
        $scope.CheckUsername = function (frm_User) {
            if (frm_User.$valid) {
                url = "../BACKEND/index.php/Record/getList/project";
                filter = {
                    filter: [
                        {field: "PROJECTNAME", value: $scope.project.PROJECTNAME}
                    ]
                };
                $http.post(url, filter).
                        then(function (response) {
                            project_exist = response.data;
                            if (project_exist.recordsFiltered == 0) {
                                $scope.SaveUser();
                            } else {
                                var msg = '<div class="alert alert-danger alert-dismissable">\
                                            <h4><i class="icon fa fa-warning"></i> Error!</h4>\
                                            Username "' + $scope.project.PROJECTNAME + '" already exist. \
                                           </div>';
                                bootbox.alert(msg);
                            }
                        }, function (response) {

                        });
            }
        }
        $scope.LoadData = function () {
            url = "../BACKEND/index.php/Record/getList/project";
            filter = {
                filter: [
                    {field: "ID", value: $scope.project.ID}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {
                        $scope.project = response.data.data[0];
                    }, function (response) {

                    });
        }
        $scope.LoadData();
    }])