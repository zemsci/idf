var MainAppModule = angular.module('IDF_CRM', []);

MainAppModule.controller('LEFT_MENU', ['$scope', '$http', '$compile', '$templateCache',
    function ($scope, $http, $compile, $templateCache) {
        $scope.MainContain = "";
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
        $scope.ShowAllCompany = function () {
            $scope.MainContain = "company/coompany_list.html";
            $scope.GetCompaniesList();
            //$compile($("#main_container"))($scope);
        }
        $scope.AddCompany = function () {
            $scope.new_company = $scope.InitCompany();
            $scope.company_emails = [];
            $scope.MainContain = "company/company_card.html";

        }
        $scope.EditCompany = function (company) {
            $scope.new_company = company;
            $scope.GetEmailList($scope.new_company.NAME);
            $scope.GetPhoneList($scope.new_company.NAME);
            $scope.company_emails = [];
            $scope.Mode = "EDIT";
            $scope.MainContain = "company/company_card.html";

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
                            $scope.ShowAllCompany();
                            $scope.companies.push(angular.copy($scope.new_company));
                        }, function (response) {

                        });
            }
        }
        $scope.SaveEmail = function () {
            var log = [];
            $scope.DeleteEmail($scope.selected_company.NAME);
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
            $scope.DeletePhone($scope.selected_company.NAME);
            angular.forEach($scope.company_phones, function (_phone, key) {
                _phone.NAME = $scope.new_company.NAME;
                _phone.ID = "";
                url = "../BACKEND/index.php/Record/add/phone/PHONE_NO";

                $http.post(url, _phone).
                        then(function (response) {

                        }, function (response) {

                        });
            }, log);

        }
        $scope.CompanyBack = function () {
            switch ($scope.Mode)
            {
                case "VIEW":
                    $scope.ShowAllCompany();
                    break;
                case "EDIT":
                    $scope.Mode = "VIEW";
                    break;
                case "NEW":
                    $scope.ShowAllCompany();
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
                var table=$('#tb_company').DataTable({
                    "processing": true,
                    "serverSide": true,
                    "lengthMenu": [[5, 10, 25, 50, -1], [10, 25, 50, "All"]],
                    ajax: {
                        url: url,
                        dataSrc: 'data'
                    },
                    columns: [
                        {data: "NAME"},
                        {data: "BRANCH"},
                        {data: "INDUSTRY", searchable: false},
                    ],
                    "columnDefs": [
                        {
                            // The `data` parameter refers to the data for the cell (defined by the
                            // `data` option, which defaults to the column being worked with, in
                            // this case `data: 0`.
                            "render": function (data, type, row) {
                                return "<a href='#' ng-click='SetSelectedCompany()'>" + data + "</a>";
                            },
                            "targets": 0
                        },
                    ]
                });
                $('#tb_company tbody').on('click', 'a', function () {
                    $(this).parent().parent().toggleClass('bg-gray');
                    var com=table.rows('.bg-gray').data()[0];
                    $scope.SetSelectedCompany(com);
                });
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

                        if (response.data.count > 0) {
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

                        if (response.data.count > 0) {
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
        $scope.SetSelectedCompany = function (company) {
            $scope.Mode = "VIEW";
            $scope.selected_company = company;
            $scope.GetEmailList($scope.selected_company.NAME);
            $scope.GetPhoneList($scope.selected_company.NAME);
            $scope.MainContain = "company/company_card.html";
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
    