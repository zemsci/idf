MainAppModule.controller('COMPANY', ['$scope', '$http', '$compile',
    function ($scope, $http, $compile) {
        $scope.table_company = null;
        $scope.company_emails = [];
        $scope.company_phones = [];
        $scope.company_contact_list = [];
        $scope.company_contact_email_list = [];
        $scope.company_contact_phone_list = [];
        $scope.new_companies_email = []
        $scope.new_companies_phone = [];
        $scope.new_company = {};
        $scope.selected_company = {};
        $scope.InitCompany = function () {
            $scope.Mode = "NEW";
            obj = {
                NAME: "",
                BRANCH: "",
                INDUSTRY: "",
                ADDRESS_EN: "",
                ADDRESS_TH: "",
                CREATE_BY: "",
                MODIFY_BY: "",
                CREATE_DATE: "",
                CREATE_TIME: "",
                MODIFY_DATE: "",
                MODIFY_TIME: "",
                WEB_SITE: "",
            };
            return obj;
        }
        $scope.GetCompaniesList = function () {
            $("#main_container").hide();
            url = "../BACKEND/index.php/Record/getList/companies";
            setTimeout(function () {
                $scope.table_company = $('#tb_company').DataTable({
                    "processing": true,
                    "serverSide": true,
                    "order": [[3, "desc"]],
                    stateSave: true,
                    "lengthMenu": [10, 25, 50, 100, "All"],
                    ajax: {
                        url: url,
                        dataSrc: 'data'
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
                                    return '<img style="height:15px"  src="' + row.LOGO_URL + '" class="img-circle"><b style="margin-left:10px">' + row.NAME + "</b>";
                                } else {
                                    return '<b style="margin-left:10px">' + row.NAME + "</b>";
                                }
                            },
                            "targets": 0
                        },
                        {
                            "render": function (data, type, row) {
                                //return "<a id='#" + data + "' href='#'>" + data + "</a>";
                                return '<button type="button" class="view btn btn-info btn-xs" data-toggle="tooltip" data-placement="top" title="Preview Company Info"><i class="fa fa-eye"></i></button>\
                                       <button type="button" class="edit btn btn-warning btn-xs" data-toggle="tooltip" data-placement="top" title="Edit Company">\<i class="fa fa-pencil"></i></button>\
                                       <button type="button" class="delete btn btn-danger btn-xs" data-toggle="tooltip" data-placement="top" title="Delete Company">\<i class="fa fa-bitbucket"></i></button>';
                            },
                            "targets": 3
                        },
                        //{"visible": false, "targets": [0]}
                    ]
                });
                $('#tb_company tbody').on('click', '.view', function () {
                    var data = $scope.table_company.row($(this).parent().parent()).data();
                    $scope.ShowCompanyInfo(data.ID);
                });
                $('#tb_company tbody').on('click', '.edit', function () {
                    var data = $scope.table_company.row($(this).parent().parent()).data();
                    $scope.EditCompany(data.ID);
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

                $("#main_container").fadeIn("fast");
            }, 50);
            // }
        }
        $scope.AddCompany = function () {
            $scope.Mode = "NEW";
            $scope.new_company = $scope.InitCompany();
            $scope.company_emails = [];
            $scope.MainContain = "company/company_edit.html";
            $("#main_container").load("company/company_edit.html",
                    function () {
                        $scope.InitIndustry();
                        $("#main_container").hide();
                        $compile($("#main_container"))($scope)
                        $("#main_container").fadeIn("fast");
                    }
            );
        }
        $scope.EditCompany = function (COMPANY_ID) {
            $scope.Mode = "EDIT";
            url = "../BACKEND/index.php/Record/getList/companies";
            filter = {
                filter: [
                    {field: "ID", value: COMPANY_ID}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {
                        $scope.new_company = response.data.data[0];
                        $scope.GetEmailList($scope.new_company.NAME);
                        $scope.GetPhoneList($scope.new_company.NAME);
                        $scope.company_emails = [];
                        $("#main_container").load("company/company_edit.html",
                                function () {
                                    $scope.InitIndustry();
                                    $("#main_container").hide();
                                    $compile($("#main_container"))($scope)
                                    $("#main_container").fadeIn("fast");
                                }
                        );
                    }, function (response) {

                    });
        }
        $scope.InitIndustry = function () {

            url = "../BACKEND/index.php/Record/getList/industry";
            $http.post(url).
                    then(function (response) {
                        $.each(response.data.data, function (index, data) {
                            $("#company_INDUSTRY").append("<option value='" + data.NAME + "' >" + data.NAME + "</option>")
                        })
                        $("#company_INDUSTRY").val($scope.new_company.INDUSTRY.split(','));
                        $("#company_INDUSTRY").select2({
                        })

                    }, function (response) {

                    });
        }
        $scope.GetEmailList = function (NAME) {
            url = "../BACKEND/index.php/Record/getList/email";
            filter = {
                filter: [
                    {field: "NAME", value: NAME}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {

                        if (response.data.recordsFiltered > 0) {
                            $scope.company_emails = response.data.data;
                        } else {
                            $scope.company_emails = [];
                        }

                    }, function (response) {

                    });
        }
        $scope.GetPhoneList = function (NAME) {
            url = "../BACKEND/index.php/Record/getList/phone";
            filter = {
                filter: [
                    {field: "NAME", value: NAME}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {

                        if (response.data.recordsFiltered > 0) {
                            $scope.company_phones = response.data.data;
                        } else {
                            $scope.company_phones = [];
                        }

                    }, function (response) {

                    });
        }
        $scope.DeleteCompany = function (com) {
            $scope.DeleteEmail(com.NAME);
            $scope.DeletePhone(com.NAME);
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
        $scope.ShowCompanyInfo = function (COMPANY_ID) {
            $scope.Mode = "VIEW";
            url = "../BACKEND/index.php/Record/getList/companies";
            filter = {
                filter: [
                    {field: "ID", value: COMPANY_ID}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {

                        if (response.data.recordsFiltered > 0) {

                            $scope.selected_company = response.data.data[0];
                            $scope.GetEmailList($scope.selected_company.NAME);
                            $scope.GetPhoneList($scope.selected_company.NAME);
                            $scope.MainContain = "company/company_view.html";
                            $("#main_container").load("company/company_view.html",
                                    function () {
                                        $("#main_container").hide();
                                        $compile($("#main_container"))($scope)
                                        $("#main_container").fadeIn("fast");
                                    }
                            );
                        } else {

                        }

                    }, function (response) {

                    });
        }
        $scope.DeleteEmail = function (NAME) {
            url = "../BACKEND/index.php/Record/delete/email";
            $http.post(url, {filter: [{field: "NAME", value: NAME}]}).
                    then(function (response) {

                    }, function (response) {

                    });
        }
        $scope.DeletePhone = function (NAME) {
            url = "../BACKEND/index.php/Record/delete/phone";
            $http.post(url, {filter: [{field: "NAME", value: NAME}]}).
                    then(function (response) {

                    }, function (response) {

                    });
        }
        $scope.DeleteCompanyEmail = function (email) {
            $scope.company_emails.splice($scope.company_emails.indexOf(email), 1);
        }
        $scope.DeleteCompanyPhone = function (phone) {
            $scope.company_phones.splice($scope.company_phones.indexOf(phone), 1);
        }
        $scope.DeleteEmail = function (NAME) {
            url = "../BACKEND/index.php/Record/delete/email";
            $http.post(url, {filter: [{field: "NAME", value: NAME}]}).
                    then(function (response) {

                    }, function (response) {

                    });
        }
        $scope.DeletePhone = function (NAME) {
            url = "../BACKEND/index.php/Record/delete/phone";
            $http.post(url, {filter: [{field: "NAME", value: NAME}]}).
                    then(function (response) {

                    }, function (response) {

                    });
        }
        $scope.AddCompanyEmail = function () {
            $scope.company_emails.push($scope.InitCompanyEmail());
        }
        $scope.AddCompanyPhone = function () {

            $scope.company_phones.push($scope.InitCompanyPhone());
        }
        $scope.SaveCompany = function (frm_Company) {
            if (frm_Company.$valid) {

                if ($scope.Mode == "NEW") {
                    url = "../BACKEND/index.php/Record/add/companies/NAME";
                } else {
                    url = "../BACKEND/index.php/Record/add/companies/ID";
                }
                try {
                    $scope.new_company.INDUSTRY = $scope.new_company.INDUSTRY.join();
                } catch (e) {
                }
                $http.post(url, $scope.new_company).
                        then(function (response) {
                            $scope.SaveEmail();
                            $scope.SavePhone();
                        }, function (response) {
                            var msg = '<div class="alert alert-danger alert-dismissable">\
                                        <h4><i class="icon fa fa-warning"></i> Error!</h4>\
                                        ' + response.data + ' \
                                    </div>';
                            bootbox.alert(msg);
                        });
            }
        }
        $scope.SaveEmail = function () {
            var log = [];
            url = "../BACKEND/index.php/Record/delete/email";
            $http.post(url, {filter: [{field: "NAME", value: $scope.new_company.NAME}]}).
                    then(function (response) {
                        angular.forEach($scope.company_emails, function (_email, key) {
                            _email.NAME = $scope.new_company.NAME;
                            _email.ID = "";
                            url = "../BACKEND/index.php/Record/add/email/EMAIL";
                            $http.post(url, _email).
                                    then(function (response) {

                                    }, function (response) {

                                    });
                        }, log);
                    }, function (response) {

                    });

        }
        $scope.SavePhone = function () {
            var log = [];
            url = "../BACKEND/index.php/Record/delete/phone";
            $http.post(url, {filter: [{field: "NAME", value: $scope.new_company.NAME}]}).
                    then(function (response) {
                        angular.forEach($scope.company_phones, function (_phone, key) {
                            _phone.NAME = $scope.new_company.NAME;
                            _phone.ID = "";
                            url = "../BACKEND/index.php/Record/add/phone/PHONE_NO";
                            $http.post(url, _phone).
                                    then(function (response) {

                                    }, function (response) {

                                    });
                        }, log);
                        if ($scope.Mode == "EDIT") {
                            $scope.ShowCompanyInfo($scope.new_company.ID);
                        } else {
                            $scope.ShowAllCompany();
                        }
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
                    }, function (response) {

                    });


        }
        $scope.GetCompanyContactsList = function (CompanyName) {
            url = "../BACKEND/index.php/Record/getList/contacts";
            filter = {
                filter: [
                    {field: "COMPANY", value: CompanyName}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {

                        if (response.data.recordsFiltered > 0) {
                            $scope.company_contact_list = response.data.data;
                        } else {
                            $scope.company_contact_list = [];
                        }

                    }, function (response) {

                    });
        }
        $scope.GetContactEmailList = function (objContact) {
            url = "../BACKEND/index.php/Record/getList/email";
            filter = {
                filter: [
                    {field: "NAME", value: objContact.FULL_NAME_FOR_CHECK}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {

                        if (response.data.recordsFiltered > 0) {
                            index = $scope.company_contact_list.indexOf(objContact);
                            $scope.company_contact_email_list[index] = response.data.data;
                        } else {
                            $scope.company_contact_email_list[index] = [];
                        }

                    }, function (response) {

                    });
        }
        $scope.GetContactPhoneList = function (objContact) {
            url = "../BACKEND/index.php/Record/getList/phone";
            filter = {
                filter: [
                    {field: "NAME", value: objContact.FULL_NAME_FOR_CHECK}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {

                        if (response.data.recordsFiltered > 0) {
                            index = $scope.company_contact_list.indexOf(objContact);
                            $scope.company_contact_phone_list[index] = response.data.data;
                        } else {
                            index = $scope.company_contact_list.indexOf(objContact);
                            $scope.company_contact_phone_list[index] = [];
                        }

                    }, function (response) {

                    });
        }
        $scope.InitCompanyEmail = function () {
            obj = {
                NAME: "",
                DSCRIPTION: "",
                EMAIL: "",
                CREATE_BY: "",
                MODIFY_BY: "",
                CREATE_DATE: "",
                CREATE_TIME: "",
                MODIFY_DATE: "",
                MODIFY_TIME: ""
            };
            return obj;
        }
        $scope.InitCompanyPhone = function () {
            obj = {
                NAME: "",
                DSCRIPTION: "",
                PHONE_NO: "",
                EXT: "",
                CREATE_BY: "",
                MODIFY_BY: "",
                CREATE_DATE: "",
                CREATE_TIME: "",
                MODIFY_DATE: "",
                MODIFY_TIME: "",
                LOGO_URL: "",
            };
            return obj;
        }
    }]);
