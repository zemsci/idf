MainAppModule.controller('CONTACT', ['$scope', '$routeParams', '$http', '$compile',
    function ($scope, $routeParams, $http, $compile) {
        $scope.table_contact = null;
        $scope.GetContactsList = function () {
            url = "../BACKEND/index.php/Record/getList/contacts";
            setTimeout(function () {
                $scope.table_contact = $('#tb_contact').DataTable({
                    "processing": true,
                    "serverSide": true,
                    "order": [[5, "desc"]],
                    stateSave: true,
                    "lengthMenu": [10, 25, 50, 100, "All"],
                    ajax: {
                        url: url,
                        dataSrc: 'data',
                    },
                    columns: [
                        {data: "FIRST_NAME", searchable: true},
                        {data: "TITLE"},
                        {data: "LAST_NAME", searchable: true},
                        {data: "COMPANY", searchable: true},
                        {data: "JOB_TITLE", searchable: true},
//                        {data: "DEPARTMENT", searchable: true},
                        {data: "ID", orderable: false}
                    ],
                    "columnDefs": [
                        {
                            "render": function (data, type, row) {
                                //return "<a id='#" + data + "' href='#'>" + data + "</a>";
                                return '<a href="#ViewContact/' + row.ID + '" class="view">' + row.TITLE + ' ' + row.FIRST_NAME + ' ' + row.LAST_NAME + '</a>';
                            },
                            "targets": 0
                        },
                        {
                            "render": function (data, type, row) {
                                //return "<a id='#" + data + "' href='#'>" + data + "</a>";
                                return '<a href="#EditContact/' + row.ID + ' type="button" class="edit btn btn-warning btn-xs" data-toggle="tooltip" data-placement="top" title="Edit Contact">\<i class="fa fa-pencil"></i></a>\
                                       <button type="button" class="delete btn btn-danger btn-xs" data-toggle="tooltip" data-placement="top" title="Delete Contact">\<i class="fa fa-bitbucket"></i></button>';
                            },
                            "targets": 5
                        },
                        {"visible": false, "targets": [1]},
                        {"visible": false, "targets": [2]}
                    ]
                });
                $('#tb_contact tbody').on('click', '.delete', function () {
                    var data = $scope.table_contact.row($(this).parent().parent()).data();
                    var msg = '<div class="alert alert-warning alert-dismissable">\
                           <h4><i class="icon fa fa-warning"></i> Warning!</h4>\
                           Are you sure to delete contact "' + data.TITLE + ' ' + data.FIRST_NAME + ' ' + data.LAST_NAME + '" \
                         </div>'
                    bootbox.confirm(msg, function (result) {
                        if (result == true) {
                            $scope.DeleteContact(data);
                        }
                    });
                });
                $($scope.target).fadeIn("fast");
            }, 50);
            // }
        }
        $scope.DeleteContact = function (com) {
            url = "../BACKEND/index.php/Record/delete/contacts";
            $http.post(url, {filter: [{field: "ID", value: com.ID}]}).
                    then(function (response) {
                        $scope.table_contact.draw();
                    }, function (response) {
                        var msg = '<div class="alert alert-danger alert-dismissable">\
            <h4><i class="icon fa fa-warning"></i> Alert!</h4>\
                    ' + response.data + ' \
                    </div>';
                        bootbox.alert(msg);
                    });
        }
    }]);
MainAppModule.controller('MY_CONTACT', ['$scope', '$routeParams', '$http', '$compile',
    function ($scope, $routeParams, $http, $compile) {
        $scope.table_contact = null;
        $scope.GetContactsList = function () {

            filter = {filter: [
                    {field: 'MODIFY_BY', value: $routeParams.USER}
                ]}

            url = "../BACKEND/index.php/Record/getList/contacts";
            setTimeout(function () {
                $scope.table_contact = $('#tb_my_contact').DataTable({
                    "processing": true,
                    "serverSide": true,
                    "order": [[5, "desc"]],
                    stateSave: true,
                    "lengthMenu": [10, 25, 50, 100, "All"],
                    ajax: {
                        url: url,
                        dataSrc: 'data',
                        data: filter
                    },
                    columns: [
                        {data: "FIRST_NAME", searchable: true},
                        {data: "TITLE"},
                        {data: "LAST_NAME", searchable: true},
                        {data: "COMPANY", searchable: true},
                        {data: "JOB_TITLE", searchable: true},
//                        {data: "DEPARTMENT", searchable: true},
                        {data: "ID", orderable: false}
                    ],
                    "columnDefs": [
                        {
                            "render": function (data, type, row) {
                                //return "<a id='#" + data + "' href='#'>" + data + "</a>";
                                return '<a href="#ViewContact/' + row.ID + '" class="view">' + row.TITLE + ' ' + row.FIRST_NAME + ' ' + row.LAST_NAME + '</a>';
                            },
                            "targets": 0
                        },
                        {
                            "render": function (data, type, row) {
                                //return "<a id='#" + data + "' href='#'>" + data + "</a>";
                                return '<a href="#EditContact/' + row.ID + ' type="button" class="edit btn btn-warning btn-xs" data-toggle="tooltip" data-placement="top" title="Edit Contact">\<i class="fa fa-pencil"></i></a>\
                                       <button type="button" class="delete btn btn-danger btn-xs" data-toggle="tooltip" data-placement="top" title="Delete Contact">\<i class="fa fa-bitbucket"></i></button>';
                            },
                            "targets": 5
                        },
                        {"visible": false, "targets": [1]},
                        {"visible": false, "targets": [2]}
                    ]
                });
                $('#tb_my_contact tbody').on('click', '.delete', function () {
                    var data = $scope.table_contact.row($(this).parent().parent()).data();
                    var msg = '<div class="alert alert-warning alert-dismissable">\
                           <h4><i class="icon fa fa-warning"></i> Warning!</h4>\
                           Are you sure to delete contact "' + data.TITLE + ' ' + data.FIRST_NAME + ' ' + data.LAST_NAME + '" \
                         </div>'
                    bootbox.confirm(msg, function (result) {
                        if (result == true) {
                            $scope.DeleteContact(data);
                        }
                    });
                });
                $($scope.target).fadeIn("fast");
            }, 50);
            // }
        }
        $scope.DeleteContact = function (com) {
            url = "../BACKEND/index.php/Record/delete/contacts";
            $http.post(url, {filter: [{field: "ID", value: com.ID}]}).
                    then(function (response) {
                        $scope.table_contact.draw();
                    }, function (response) {
                        var msg = '<div class="alert alert-danger alert-dismissable">\
            <h4><i class="icon fa fa-warning"></i> Alert!</h4>\
                    ' + response.data + ' \
                    </div>';
                        bootbox.alert(msg);
                    });
        }
    }]);
MainAppModule.controller('VIEW_CONTACT', ['$scope', '$http', '$routeParams', 'back',
    function ($scope, $http, $routeParams, back) {
        $scope.contact = {ID: $routeParams.ID};
        $scope.contact_company = [];
        $scope.back = function () {
            back();
        }
        $scope.LoadData = function () {
            //$scope.target = "#modal_container";
            url = "../BACKEND/index.php/Record/getList/contacts";
            filter = {
                filter: [
                    {field: "ID", value: $scope.contact.ID}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {

                        if (response.data.recordsFiltered > 0) {

                            $scope.contact = response.data.data[0];
                            $scope.GetCurrentCompany();
                        } else {

                        }
                    }, function (response) {

                    });
        }
        $scope.GetCurrentCompany = function () {
            url = "../BACKEND/index.php/Record/getList/companies";
            filter = {
                filter: [
                    {field: "NAME", value: $scope.contact.COMPANY}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {
                        $scope.contact_company = response.data.data[0];
                    }, function (response) {

                    });
        }
        $scope.LoadData();
    }]);
MainAppModule.controller('EDIT_CONTACT', ['$scope', 'SetModifyBy', '$http', '$routeParams', 'back',
    function ($scope, SetModifyBy, $http, $routeParams, back) {
        $scope.contact = {ID: $routeParams.ID};
        $scope.contact_company = [];
        $scope.DepartmentList = [];
        $scope.NameTitle = [];
        $scope.JobTitleList = [];
        $scope.loading = true;
        $scope.back = function () {
            back();
        }
        $scope.GetCurrentCompany = function () {
            url = "../BACKEND/index.php/Record/getList/companies";
            filter = {
                filter: [
                    {field: "NAME", value: $scope.contact.COMPANY}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {
                        $scope.contact_company = response.data.data[0];
                    }, function (response) {

                    });
        }
        $scope.LoadData = function () {
            //$scope.target = "#modal_container";
            url = "../BACKEND/index.php/Record/getList/contacts";
            filter = {
                filter: [
                    {field: "ID", value: $scope.contact.ID}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {

                        if (response.data.recordsFiltered > 0) {

                            $scope.contact = response.data.data[0];
                            $scope.InitTitle();
                            $scope.InitDepartment();
                            $scope.InitJobTitle();
                            $scope.GetCurrentCompany();
                        } else {

                        }
                    }, function (response) {

                    });
        }
        $scope.InitTitle = function () {

            url = "../BACKEND/index.php/Record/getList/title";
            $http.post(url).
                    then(function (response) {
                        $.each(response.data.data, function (index, data) {
                            $("#contact_TITLE").append("<option value='" + data.NAME + "' >" + data.NAME + "</option>")
                        })
                        $("#contact_TITLE").val($scope.contact.TITLE);
                        $("#contact_TITLE").select2({
                        })
                    }, function (response) {

                    });
        }
        $scope.InitDepartment = function () {

            url = "../BACKEND/index.php/Record/getList/department";
            $http.post(url).
                    then(function (response) {
                        $.each(response.data.data, function (index, data) {
                            $("#contact_DEPARTMENT").append("<option value='" + data.NAME + "' >" + data.NAME + "</option>")
                        })
                        $("#contact_DEPARTMENT").val($scope.contact.DEPARTMENT.split(','));
                        $("#contact_DEPARTMENT").select2({
                        })
                    }, function (response) {

                    });
        }
        $scope.InitJobTitle = function () {

            url = "../BACKEND/index.php/Record/getList/jobtitle";
            $http.post(url).
                    then(function (response) {
                        $.each(response.data.data, function (index, data) {
                            $("#contact_JOB_TITLE").append("<option value='" + data.NAME + "' >" + data.NAME + "</option>")
                        })
                        $("#contact_JOB_TITLE").val($scope.contact.JOB_TITLE.split(','));
                        $("#contact_JOB_TITLE").select2({
                        })
                        $scope.InitAjaxAutoCompleteCompany("#contact_COMPANY");
                    }, function (response) {

                    });
        };
        $scope.InitAjaxAutoCompleteCompany = function (element, url) {
            $(element).select2({
                placeholder: "Search for a movie",
                minimumInputLength: 1,
                multiple: false,
                ajax: {
                    url: "../BACKEND/index.php/company/AutoComplete",
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            search: params.term, // search term
                        };
                    },
                    processResults: function (data, params) {
                        // parse the results into the format expected by Select2
                        // since we are using custom formatting functions we do not need to
                        // alter the remote JSON data, except to indicate that infinite
                        // scrolling can be used
                        params.page = params.page || 1;
                        transformData = function (data)
                        {
                            new_data = []
                            $.each(data, function (index, data) {
                                new_data.push(
                                        {
                                            id: data.NAME,
                                            NAME: data.NAME,
                                        }
                                )
                            });
                            return new_data;
                        }
                        return {
                            results: transformData(data)

                        };
                    }
                    ,
                    cache: true
                },
                escapeMarkup: function (markup) {
                    return markup;
                },
                templateResult: function (data) {

                    return "<div class='row'>\
                            <div class='col-sm-7'>" + data.NAME + "</div>\
                            </div>";
                },
                templateSelection: function (data) {
                    $scope.GetCurrentCompany(data.NAME);
                    return data.NAME;
                }
            });
            $("#select2-contact_COMPANY-container").text($scope.contact.COMPANY);


        };
        $scope.SaveContact = function (frm_Contact) {
            if (frm_Contact.$valid) {
                SetModifyBy($scope.contact);
                url = "../BACKEND/index.php/Record/add/contacts/ID";

                try {
                    $scope.contact.DEPARTMENT = $scope.contact.DEPARTMENT.join();
                } catch (e) {
                }
                try {
                    $scope.contact.JOB_TITLE = $scope.contact.JOB_TITLE.join();
                } catch (e) {
                }
                $http.post(url, $scope.contact).
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
        }
        $scope.LoadData();
        $scope.loading = false;

    }]);
MainAppModule.controller('ADD_CONTACT', ['$scope', 'SetCreateBy', '$http', '$routeParams', 'back',
    function ($scope, SetCreateBy, $http, $routeParams, back) {
        $scope.loading = true;
        if ($routeParams.COMPANY != "-") {
            $scope.contact = {ID: "", COMPANY: $routeParams.COMPANY};
        } else {
            $scope.contact = {ID: ""};
        }
        $scope.contact_company = null;
        $scope.back = function () {
            back();
        }
        $scope.GetCurrentCompany = function () {
            url = "../BACKEND/index.php/Record/getList/companies";
            filter = {
                filter: [
                    {field: "NAME", value: $scope.contact.COMPANY}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {
                        $scope.contact_company = response.data.data[0];
                    }, function (response) {

                    });
        }
        $scope.InitTitle = function () {

            url = "../BACKEND/index.php/Record/getList/title";
            $http.post(url).
                    then(function (response) {
                        $.each(response.data.data, function (index, data) {
                            $("#contact_TITLE").append("<option value='" + data.NAME + "' >" + data.NAME + "</option>")
                        })
                        $("#contact_TITLE").val($scope.contact.TITLE);
                        $("#contact_TITLE").select2({
                        })
                    }, function (response) {

                    });
        }
        $scope.InitDepartment = function () {

            url = "../BACKEND/index.php/Record/getList/department";
            $http.post(url).
                    then(function (response) {
                        $.each(response.data.data, function (index, data) {
                            $("#contact_DEPARTMENT").append("<option value='" + data.NAME + "' >" + data.NAME + "</option>")
                        })
                        //$("#contact_DEPARTMENT").val($scope.contact.DEPARTMENT.split(','));
                        $("#contact_DEPARTMENT").select2({
                        })
                    }, function (response) {

                    });
        }
        $scope.InitJobTitle = function () {

            url = "../BACKEND/index.php/Record/getList/jobtitle";
            $http.post(url).
                    then(function (response) {
                        $.each(response.data.data, function (index, data) {
                            $("#contact_JOB_TITLE").append("<option value='" + data.NAME + "' >" + data.NAME + "</option>")
                        })
                        //$("#contact_JOB_TITLE").val($scope.contact.JOB_TITLE.split(','));
                        $("#contact_JOB_TITLE").select2({
                        })
                        $scope.InitAjaxAutoCompleteCompany("#contact_COMPANY");
                    }, function (response) {

                    });
        };
        $scope.InitAjaxAutoCompleteCompany = function (element, url) {
            $(element).select2({
                placeholder: "Search for a movie",
                minimumInputLength: 1,
                multiple: false,
                ajax: {
                    url: "../BACKEND/index.php/company/AutoComplete",
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            search: params.term, // search term
                        };
                    },
                    processResults: function (data, params) {
                        // parse the results into the format expected by Select2
                        // since we are using custom formatting functions we do not need to
                        // alter the remote JSON data, except to indicate that infinite
                        // scrolling can be used
                        params.page = params.page || 1;
                        transformData = function (data)
                        {
                            new_data = []
                            $.each(data, function (index, data) {
                                new_data.push(
                                        {
                                            id: data.NAME,
                                            NAME: data.NAME,
                                        }
                                )
                            });
                            return new_data;
                        }
                        return {
                            results: transformData(data)

                        };
                    }
                    ,
                    cache: true
                },
                escapeMarkup: function (markup) {
                    return markup;
                },
                templateResult: function (data) {

                    return "<div class='row'>\
                            <div class='col-sm-7'>" + data.NAME + "</div>\
                            </div>";
                },
                templateSelection: function (data) {
                    $scope.GetCurrentCompany(data.NAME);
                    return data.NAME;
                }
            });
            $("#select2-contact_COMPANY-container").text($scope.contact.COMPANY);
            $scope.loading = false;

        };
        $scope.SaveContact = function (frm_Contact) {
            if (frm_Contact.$valid) {
                SetCreateBy($scope.contact);
                url = "../BACKEND/index.php/Record/add/contacts/FIRST_NAME,LAST_NAME,COMPANY";

                try {
                    $scope.contact.DEPARTMENT = $scope.contact.DEPARTMENT.join();
                } catch (e) {
                }
                try {
                    $scope.contact.JOB_TITLE = $scope.contact.JOB_TITLE.join();
                } catch (e) {
                }
                $http.post(url, $scope.contact).
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
        }
        $scope.InitTitle();
        $scope.InitDepartment();
        $scope.InitJobTitle();
        //$scope.InitAjaxAutoCompleteCompany("#contact_COMPANY");
    }]);
    