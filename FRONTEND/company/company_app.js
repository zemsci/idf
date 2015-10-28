MainAppModule.controller('COMPANY', ['$scope', '$routeParams', '$http', '$compile',
    function ($scope, $routeParams, $http, $compile) {
        $scope.table_company = null;
        $scope.loading = true;
        $scope.GetCompaniesList = function () {

            url = "../BACKEND/index.php/Record/getList/companies";
            $scope.table_company = $('#tb_company').DataTable({
                "processing": true,
                "serverSide": true,
                "order": [[3, "desc"]],
                stateSave: true,
                "lengthMenu": [10, 25, 50, 100, "All"],
                ajax: {
                    url: url,
                    dataSrc: 'data',
                },
                columns: [
                    {data: "NAME"},
                    {data: "BRANCH"},
                    {data: "INDUSTRY", searchable: true},
                    {data: "ID", orderable: true}
                ],
                "columnDefs": [
                    {
                        "render": function (data, type, row) {
                            //return "<a id='#" + data + "' href='#'>" + data + "</a>";
                            if (row.LOGO_URL != null) {
                                return '<img style="height:15px"  src="' + row.LOGO_URL + '" class="img-circle"><b class="view" style="margin-left:10px">' + row.NAME + "</b>";
                            } else {
                                return '<a href="#ViewCompany/' + row.ID + '" class="view" style="margin-left:10px">' + row.NAME + "</a>";
                            }
                        },
                        "targets": 0
                    },
                    {
                        "render": function (data, type, row) {
                            //return "<a id='#" + data + "' href='#'>" + data + "</a>";
                            return '<a href="#EditCompany/' + row.ID + '" class="edit btn btn-warning btn-xs" data-toggle="tooltip" data-placement="top" title="Edit Company">\<i class="fa fa-pencil"></i></a>\
                                       <button type="button" class="delete btn btn-danger btn-xs" data-toggle="tooltip" data-placement="top" title="Delete Company">\<i class="fa fa-bitbucket"></i></button>';
                        },
                        "targets": 3
                    },
                    //{"visible": false, "targets": [0]}
                ]
            }).on('draw.dt', function () {
                $scope.loading = false;
            });
            $('#tb_company tbody').on('click', '.delete', function () {
                var data = $scope.table_company.row($(this).parent().parent()).data();
                var msg = '<div class="alert alert-warning alert-dismissable">\
                           <h4><i class="icon fa fa-warning"></i> Warning!</h4>\
                           Are you sure to delete company "' + data.NAME + '" \
                         </div>'
                bootbox.confirm(msg, function (result) {
                    if (result == true) {
                        $scope.DeleteCompany(data);
                    }
                });
            });
            // }
        }
        $scope.AddCompany = function () {
            $scope.Mode = "NEW";
            $scope.new_company = $scope.InitCompany();
            $scope.company_emails = [];
            $scope.MainContain = "company/company_edit.html";
            $($scope.target).load("company/company_edit.html",
                    function () {
                        $scope.InitIndustry();
                        $($scope.target).hide();
                        $compile($($scope.target))($scope)
                        $($scope.target).fadeIn("fast");
                    }
            );
        }
        $scope.DeleteCompany = function (com) {

            url = "../BACKEND/index.php/Record/getList/contacts";
            filter = {
                filter: [
                    {field: "COMPANY", value: com.NAME}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {

                        if (response.data.recordsFiltered > 0) {
                            var msg = '<div class="alert alert-danger alert-dismissable">\
                                        <h4><i class="icon fa fa-warning"></i> Alert!</h4>\
                                        Can not delete ' + com.NAME + ' becouse have contact in company \
                                    </div>';
                            bootbox.alert(msg);

                        } else {
                            url = "../BACKEND/index.php/Record/delete/companies";
                            $http.post(url, {filter: [{field: "ID", value: com.ID}]}).
                                    then(function (response) {
                                        $scope.table_company.draw();
                                    }, function (response) {
                                        var msg = '<div class="alert alert-danger alert-dismissable">\
                                        <h4><i class="icon fa fa-warning"></i> Alert!</h4>\
                                        ' + response.data + ' \
                                    </div>';
                                        bootbox.alert(msg);
                                    });
                        }

                    }, function (response) {

                    });



        }
    }]);
MainAppModule.controller('MY_COMPANY', ['$scope', '$routeParams', '$http', '$compile',
    function ($scope, $routeParams, $http, $compile) {
        $scope.table_company = null;
        $scope.loading = true;
        $scope.GetCompaniesList = function () {

            filter = {filter: [
                    {field: 'MODIFY_BY', value: $routeParams.USER}
                ]}

            url = "../BACKEND/index.php/Record/getList/companies";
            $scope.table_company = $('#tb_my_company').DataTable({
                "processing": true,
                "serverSide": true,
                "order": [[3, "desc"]],
                stateSave: true,
                "lengthMenu": [10, 25, 50, 100, "All"],
                ajax: {
                    url: url,
                    dataSrc: 'data',
                    data: filter
                },
                columns: [
                    {data: "NAME"},
                    {data: "BRANCH"},
                    {data: "INDUSTRY", searchable: true},
                    {data: "ID", orderable: true}
                ],
                "columnDefs": [
                    {
                        "render": function (data, type, row) {
                            //return "<a id='#" + data + "' href='#'>" + data + "</a>";
                            if (row.LOGO_URL != null) {
                                return '<img style="height:15px"  src="' + row.LOGO_URL + '" class="img-circle"><b class="view" style="margin-left:10px">' + row.NAME + "</b>";
                            } else {
                                return '<a href="#ViewCompany/' + row.ID + '" class="view" style="margin-left:10px">' + row.NAME + "</a>";
                            }
                        },
                        "targets": 0
                    },
                    {
                        "render": function (data, type, row) {
                            //return "<a id='#" + data + "' href='#'>" + data + "</a>";
                            return '<a href="#EditCompany/' + row.ID + '" class="edit btn btn-warning btn-xs" data-toggle="tooltip" data-placement="top" title="Edit Company">\<i class="fa fa-pencil"></i></a>\
                                       <button type="button" class="delete btn btn-danger btn-xs" data-toggle="tooltip" data-placement="top" title="Delete Company">\<i class="fa fa-bitbucket"></i></button>';
                        },
                        "targets": 3
                    },
                    //{"visible": false, "targets": [0]}
                ]
            }).on('draw.dt', function () {
                $scope.loading = false;
            });
            $('#tb_my_company tbody').on('click', '.delete', function () {
                var data = $scope.table_company.row($(this).parent().parent()).data();
                var msg = '<div class="alert alert-warning alert-dismissable">\
                           <h4><i class="icon fa fa-warning"></i> Warning!</h4>\
                           Are you sure to delete company "' + data.NAME + '" \
                         </div>'
                bootbox.confirm(msg, function (result) {
                    if (result == true) {
                        $scope.DeleteCompany(data);
                    }
                });
            });
            // }
        }
        $scope.AddCompany = function () {
            $scope.Mode = "NEW";
            $scope.new_company = $scope.InitCompany();
            $scope.company_emails = [];
            $scope.MainContain = "company/company_edit.html";
            $($scope.target).load("company/company_edit.html",
                    function () {
                        $scope.InitIndustry();
                        $($scope.target).hide();
                        $compile($($scope.target))($scope)
                        $($scope.target).fadeIn("fast");
                    }
            );
        }
        $scope.DeleteCompany = function (com) {

            url = "../BACKEND/index.php/Record/getList/contacts";
            filter = {
                filter: [
                    {field: "COMPANY", value: com.NAME}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {

                        if (response.data.recordsFiltered > 0) {
                            var msg = '<div class="alert alert-danger alert-dismissable">\
                                        <h4><i class="icon fa fa-warning"></i> Alert!</h4>\
                                        Can not delete ' + com.NAME + ' becouse have contact in company \
                                    </div>';
                            bootbox.alert(msg);

                        } else {
                            url = "../BACKEND/index.php/Record/delete/companies";
                            $http.post(url, {filter: [{field: "ID", value: com.ID}]}).
                                    then(function (response) {
                                        $scope.table_company.draw();
                                    }, function (response) {
                                        var msg = '<div class="alert alert-danger alert-dismissable">\
                                        <h4><i class="icon fa fa-warning"></i> Alert!</h4>\
                                        ' + response.data + ' \
                                    </div>';
                                        bootbox.alert(msg);
                                    });
                        }

                    }, function (response) {

                    });



        }
    }]);
MainAppModule.controller('ADD_COMPANY', ['$scope', 'SetCreateBy', '$http', '$compile', '$window',
    function ($scope, SetCreateBy, $http, $compile, $window) {
        $scope.company = {ID: ""};
        $scope.loading = true;
        $scope.back = function () {
            $window.history.back()
        }
        $scope.InitIndustry = function () {

            url = "../BACKEND/index.php/Record/getList/industry";
            $http.post(url).
                    then(function (response) {
                        $.each(response.data.data, function (index, data) {
                            $("#company_INDUSTRY").append("<option value='" + data.NAME + "' >" + data.NAME + "</option>")
                        })
                        //$("#company_INDUSTRY").val($scope.new_company.INDUSTRY.split(','));
                        $("#company_INDUSTRY").select2({
                        })
                        // $scope.InitAjaxAutoCompleteCompany("#company_GROUP");
                        $scope.loading = false;
                    }, function (response) {

                    });
        }
        $scope.SaveCompany = function (frm_Company) {
            if (frm_Company.$valid) {


                url = "../BACKEND/index.php/Record/add/companies/NAME";
                try {
                    $scope.company.INDUSTRY = $scope.company.INDUSTRY.join();
                } catch (e) {
                }
                SetCreateBy($scope.company);
                $http.post(url, $scope.company).
                        then(function (response) {
                            setTimeout(function () {
                                var msg = '<div class="alert alert-success alert-dismissable">\
                                        <h4><i class="icon fa icon fa fa-check"></i> Success</h4>\
                                        Save Company complete.. \
                                    </xdiv>';
//                            bootbox.alert(msg, function () {
//                                setTimeout(function () {
//                                    //$scope.ShowAllCompany();
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
        }
        $scope.InitIndustry();
    }]);
MainAppModule.controller('EDIT_COMPANY', ['$scope', 'SetModifyBy', '$http', '$compile', '$routeParams', '$window',
    function ($scope, SetModifyBy, $http, $compile, $routeParams, $window) {
        $scope.company = {ID: $routeParams.ID};
        $scope.loading = true;
        $scope.back = function () {
            $window.history.back()
        }
        $scope.InitIndustry = function () {

            url = "../BACKEND/index.php/Record/getList/industry";
            $http.post(url).
                    then(function (response) {
                        $.each(response.data.data, function (index, data) {
                            $("#company_INDUSTRY").append("<option value='" + data.NAME + "' >" + data.NAME + "</option>")
                        })
                        $("#company_INDUSTRY").val($scope.company.INDUSTRY.split(','));
                        $("#company_INDUSTRY").select2({
                        })
                        // $scope.InitAjaxAutoCompleteCompany("#company_GROUP");
                        $scope.loading = false;
                    }, function (response) {

                    });
        }
        $scope.SaveCompany = function (frm_Company) {
            if (frm_Company.$valid) {


                url = "../BACKEND/index.php/Record/add/companies/ID";
                try {
                    $scope.company.INDUSTRY = $scope.company.INDUSTRY.join();
                } catch (e) {
                }
                SetModifyBy($scope.company);
                $http.post(url, $scope.company).
                        then(function (response) {
                            setTimeout(function () {
                                var msg = '<div class="alert alert-success alert-dismissable">\
                                        <h4><i class="icon fa icon fa fa-check"></i> Success</h4>\
                                        Save Company complete.. \
                                    </xdiv>';
//                            bootbox.alert(msg, function () {
//                                setTimeout(function () {
//                                    //$scope.ShowAllCompany();
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
        }
        $scope.LoadData = function () {
            $scope.Mode = "EDIT";
            url = "../BACKEND/index.php/Record/getList/companies";
            filter = {
                filter: [
                    {field: "ID", value: $scope.company.ID}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {
                        $scope.company = response.data.data[0];
                        $scope.InitIndustry();
                    }, function (response) {

                    });
        }
        $scope.LoadData();
    }]);
MainAppModule.controller('VIEW_COMPANY', ['$scope', '$http', '$compile', '$routeParams', '$window', 'back',
    function ($scope, $http, $compile, $routeParams, $window, back) {
        $scope.company = {ID: $routeParams.ID};
        $scope.loading = true;
        $scope.back = function () {
            back();
        }
        $scope.LoadData = function () {
            $scope.Mode = "EDIT";
            url = "../BACKEND/index.php/Record/getList/companies";
            filter = {
                filter: [
                    {field: "ID", value: $scope.company.ID}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {
                        $scope.company = response.data.data[0];
                        $scope.GetCompanyContactsList()
                    }, function (response) {

                    });
        }
        $scope.GetCompanyContactsList = function () {
            url = "../BACKEND/index.php/Record/getList/contacts";
            filter = {
                filter: [
                    {field: "COMPANY", value: $scope.company.NAME}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {

                        if (response.data.recordsFiltered > 0) {
                            $scope.company_contact_list = response.data.data;
                            $scope.loading = false;
                        } else {
                            $scope.company_contact_list = [];
                            $scope.loading = false;
                        }

                    }, function (response) {

                    });
        }
        $scope.LoadData();
    }]);