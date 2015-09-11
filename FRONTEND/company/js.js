var MainAppModule = angular.module('IDF_CRM', []);
MainAppModule.controller('COMPANY', ['$scope', '$http', '$compile', '$templateCache',
    function ($scope, $http, $compile, $templateCache) {
        $scope.MainContain = "";
        $scope.table = {};
        $scope.Dialog;
        $scope.ErrorMessage;
        $scope.companies = [];
        $scope.Mode = "VIEW";
        $scope.company_emails = [];
        $scope.company_phones = [];
        $scope.new_companies_email;
        $scope.new_companies_phone;
        $scope.new_company = {};
        $scope.selected_company = {};
        $scope.ModalURL = "";
        $scope.ShowAllCompany = function () {
            $scope.MainContain = "company/coompany_list.html";
            $scope.GetCompaniesList();
            //$compile($("#main_container"))($scope);
        }
        $scope.AddCompany = function () {
            $scope.new_company = $scope.InitCompany();
            $scope.company_emails = [];
            $scope.ModalURL = "company/company_edit.html";
            setTimeout(function () {
                $("#modal-company").modal();
            }, 50);
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
                        $scope.ModalURL = "company/company_edit.html";
                        setTimeout(function () {
                            $("#modal-company").modal();
                        }, 50);

                    }, function (response) {

                    });
        }
        $scope.AddCompanyEmail = function () {
            $scope.company_emails.push($scope.InitCompanyEmail());
        }
        $scope.AddCompanyPhone = function () {

            $scope.company_phones.push($scope.InitCompanyPhone());
        }
        $scope.ReCom = function () {

        }
        $scope.SaveCompany = function (frm_Company) {
            if (frm_Company.$valid) {

                if ($scope.Mode == "NEW") {
                    url = "../BACKEND/index.php/Record/add/companies/NAME";
                } else {
                    url = "../BACKEND/index.php/Record/add/companies/ID";
                }
                $http.post(url, $scope.new_company).
                        then(function (response) {
                            $scope.SaveEmail();
                            $scope.SavePhone();
                            //$scope.ShowAllCompany();
                            $scope.table.draw();
                            $('#modal-company').modal('hide');
                            //$scope.companies.push(angular.copy($scope.new_company));
                        }, function (response) {

                        });
            }
        }
        $scope.SaveEmail = function () {
            var log = [];
            $scope.DeleteEmail($scope.new_company.NAME);
            angular.forEach($scope.company_emails, function (_email, key) {
                _email.NAME = $scope.new_company.NAME;
                _email.ID = "";
                url = "../BACKEND/index.php/Record/add/email/EMAIL";
                $http.post(url, _email).
                        then(function (response) {

                        }, function (response) {

                        });
            }, log);
        }
        $scope.SavePhone = function () {
            var log = [];
            $scope.DeletePhone($scope.new_company.NAME);
            angular.forEach($scope.company_phones, function (_phone, key) {
                _phone.NAME = $scope.new_company.NAME;
                _phone.ID = "";
                url = "../BACKEND/index.php/Record/add/phone/PHONE_NO";
                $http.post(url, _phone).
                        then(function (response) {

                        }, function (response) {

                        });
            }, log);
            bootbox.alert("Save Company complete..");
        }
        $scope.CompanyBack = function () {
            switch ($scope.Mode)
            {
                case "VIEW":
                    $('#modal-company').modal('hide');
                    break;
                case "EDIT":
                    $scope.ShowCompanyInfo($scope.selected_company.ID);
                    $scope.Mode = "VIEW";
                    break;
                case "NEW":
                    $('#modal-company').modal('hide');
                    break;
            }
        }
        $scope.GetCompaniesList = function () {
            url = "../BACKEND/index.php/Record/getList/companies";
//            $http.post(url, $scope.new_company).
//                    then(function (response) {
//                        $scope.companies = response.data.data;
//
//                    }, function (response) {
//
            setTimeout(function () {
                $scope.table = $('#tb_company').DataTable({
                    "processing": true,
                    "serverSide": true,
                    "order": [[3, "desc"]],
                    "lengthMenu": [10, 25, 50, 100, "All"],
                    ajax: {
                        url: url,
                        dataSrc: 'data'
                    },
                    columns: [
                        {data: "NAME"},
                        {data: "BRANCH"},
                        {data: "INDUSTRY", searchable: false},
                        {data: "ID", orderable: false}
                    ],
                    "columnDefs": [
                        {
                            "render": function (data, type, row) {
                                //return "<a id='#" + data + "' href='#'>" + data + "</a>";
                                return '<button type="button" class="view btn btn-info btn-xs"><i class="fa fa-eye"></i></button>\
                                        <button type="button" class="edit btn btn-warning btn-xs">\<i class="fa fa-pencil"></i></button>\
                                        <button type="button" class="delete btn btn-danger btn-xs">\<i class="fa fa-bitbucket"></i></button>';
                            },
                            "targets": 3
                        },
                        //{"visible": false, "targets": [0]}
                    ]
                });
                $('#tb_company tbody').on('click', '.view', function () {
                    var data = $scope.table.row($(this).parent().parent()).data();
                    $scope.ShowCompanyInfo(data.ID);
                });
                $('#tb_company tbody').on('click', '.edit', function () {
                    var data = $scope.table.row($(this).parent().parent()).data();
                    $scope.EditCompany(data.ID);
                });
//                $('#tb_company tbody').on('click', 'tr', function () {
//                    $(this).toggleClass('bg-red');
//                });
            }, 50);
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
            $scope.DeletePhone(NAME);
            url = "../BACKEND/index.php/Record/delete/companies";
            $http.post(url, {filter: [{field: "ID", value: com.ID}]}).
                    then(function (response) {

                        $scope.companies.splice($scope.companies.indexOf(com), 1);
                        $scope.MainContain = "company/coompany_list.html";
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
                            $scope.ModalURL = "company/company_edit.html";
                            setTimeout(function () {
                                $("#modal-company").modal();
                            }, 50);
                        } else {

                        }

                    }, function (response) {

                    });



        }
        $scope.DeleteCompanyEmail = function (email) {
            $scope.company_emails.splice($scope.company_emails.indexOf(email), 1);
        }
        $scope.DeleteCompanyPhone = function (phone) {
            $scope.company_phones.splice($scope.company_phones.indexOf(phone), 1);
        }
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
    