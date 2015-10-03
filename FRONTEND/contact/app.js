MainAppModule.controller('CONTACT', ['$scope', '$http', '$compile',
    function ($scope, $http, $compile) {
        $scope.table_contact = null;
        $scope.contact_emails = [];
        $scope.contact_company = [];
        $scope.contact_phones = [];
        $scope.company_phones = [];
        $scope.company_emails = [];
        $scope.new_contacts_email;
        $scope.new_contacts_phone;
        $scope.new_contact = {};
        $scope.selected_contact = {};
        $scope.InitContact = function () {
            $scope.Mode = "NEW";
            obj = {
                FULL_NAME_FOR_CHECK: "",
                TITLE: "",
                FIRST_NAME: "",
                LAST_NAME: "",
                JOB_TITLE: "",
                DEPARTMENT: "",
                ADDRES_EN: "",
                ADDRESS_TH: "",
                TYPE: "",
                CREATE_BY: "",
                MODIFY_BY: "",
                CREATE_DATE: "",
                CREATE_TIME: "",
                MODIFY_DATE: "",
                MODIFY_TIME: "",
                COMPANY: ""
            };
            return obj;
        }
        $scope.GetContactsList = function () {
            $("#main_container").hide();
            url = "../BACKEND/index.php/Record/getList/contacts";
            setTimeout(function () {
                $scope.table_contact = $('#tb_contact').DataTable({
                    "processing": true,
                    "serverSide": true,
                    "order": [[6, "desc"]],
                    stateSave: true,
                    "lengthMenu": [10, 25, 50, 100, "All"],
                    ajax: {
                        url: url,
                        dataSrc: 'data'
                    },
                    columns: [
                        {data: "TITLE"},
                        {data: "FIRST_NAME", searchable: true},
                        {data: "LAST_NAME", searchable: true},
                        {data: "COMPANY", searchable: true},
                        {data: "JOB_TITLE", searchable: true},
                        {data: "DEPARTMENT", searchable: true},
                        {data: "ID", orderable: false}
                    ],
                    "columnDefs": [
                        {
                            "render": function (data, type, row) {
                                //return "<a id='#" + data + "' href='#'>" + data + "</a>";
                                return '<button type="button" class="view btn btn-info btn-xs" data-toggle="tooltip" data-placement="top" title="Preview Contact Info"><i class="fa fa-eye"></i></button>\
                                       <button type="button" class="edit btn btn-warning btn-xs" data-toggle="tooltip" data-placement="top" title="Edit Contact">\<i class="fa fa-pencil"></i></button>\
                                       <button type="button" class="delete btn btn-danger btn-xs" data-toggle="tooltip" data-placement="top" title="Delete Contact">\<i class="fa fa-bitbucket"></i></button>';
                            },
                            "targets": 6
                        },
                        //{"visible": false, "targets": [0]}
                    ]
                });
                $('#tb_contact tbody').on('click', '.view', function () {
                    var data = $scope.table_contact.row($(this).parent().parent()).data();
                    $scope.ShowContactInfo(data.ID);
                });
                $('#tb_contact tbody').on('click', '.edit', function () {
                    var data = $scope.table_contact.row($(this).parent().parent()).data();
                    $scope.EditContact(data.ID);
                });
                $('#tb_contact tbody').on('click', '.delete', function () {
                    var data = $scope.table_contact.row($(this).parent().parent()).data();
                    var msg = '<div class="alert alert-warning alert-dismissable">\
                           <h4><i class="icon fa fa-warning"></i> Warning!</h4>\
                           Are you sure to delete contact "' + data.NAME + '" \
                         </div>'
                    bootbox.confirm(msg, function (result) {
                        if (result == true) {
                            $scope.DeleteContact(data);
                        }
                    });
                });
                $("#main_container").fadeIn("fast");
            }, 50);
            // }
        }
        $scope.AddContact = function () {
            $scope.Mode = "NEW";
            $scope.new_contact = $scope.InitContact();
            $("#main_container").load("contact/contact_edit.html",
                    function () {
                        $scope.InitTitle();
                        $("#main_container").hide();
                        $compile($("#main_container"))($scope)
                        $("#main_container").fadeIn("fast");
                    }

            );
        }
        $scope.EditContact = function (COMPANY_ID) {
            $scope.Mode = "EDIT";
            url = "../BACKEND/index.php/Record/getList/contacts";
            filter = {
                filter: [
                    {field: "ID", value: COMPANY_ID}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {
                        $scope.new_contact = response.data.data[0];
                        $scope.GetEmailList($scope.new_contact.FULL_NAME_FOR_CHECK);
                        $scope.GetPhoneList($scope.new_contact.FULL_NAME_FOR_CHECK);
                        $scope.contact_emails = [];
                        $("#main_container").load("contact/contact_edit.html",
                                function () {
                                    $scope.InitTitle();
                                    $("#main_container").hide();
                                    $compile($("#main_container"))($scope)
                                    $("#main_container").fadeIn("fast");
                                }

                        );
                    }, function (response) {

                    });
        }
        $scope.GetCurrentCompany = function (COMPANY_NAME) {
            url = "../BACKEND/index.php/Record/getList/companies";
            filter = {
                filter: [
                    {field: "NAME", value: COMPANY_NAME}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {
                        $scope.contact_company = response.data.data[0];
                        $scope.GetCompanyEmailList(COMPANY_NAME);
                        $scope.GetCompanyPhoneList(COMPANY_NAME);
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
                        $("#contact_TITLE").val($scope.new_contact.TITLE);
                        $("#contact_TITLE").select2({
                        })
                        $scope.InitDepartment();
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
                        $("#contact_DEPARTMENT").val($scope.new_contact.DEPARTMENT.split(','));
                        $("#contact_DEPARTMENT").select2({
                        })
                        $scope.InitJobTitle();
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
                        $("#contact_JOB_TITLE").val($scope.new_contact.JOB_TITLE.split(','));
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
                                            INDUSTRY: data.INDUSTRY
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
                            <div class='col-sm-5'>" + data.INDUSTRY + "</div>\
                            </div>";
                },
                templateSelection: function (data) {
                    $scope.GetCurrentCompany(data.NAME);
                    return data.NAME;
                }
            });
            $("#select2-contact_COMPANY-container").text($scope.new_contact.COMPANY);
            $scope.GetCurrentCompany($scope.new_contact.COMPANY);
        };
        $scope.select2Company = {
            placeholder: "Select company",
            minimumInputLength: 1,
            multiple: false,
            ajax: {
                url: "../BACKEND/index.php/company/AutoComplete",
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        search: params.term // search term
                    };
                },
                initSelection: function (element, callback) {

                    var elementText = $(element).val();
                    callback(elementText);
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
                                        INDUSTRY: data.INDUSTRY
                                    }
                            )
                        });
                        return new_data;
                    }
                    return {
                        results: transformData(data)

                    };
                },
                cache: true
            },
            escapeMarkup: function (markup) {
                return markup;
            },
            templateResult: function (data) {

                return "<div class='row'>\
                            <div class='col-sm-7'>" + data.NAME + "</div>\
                            <div class='col-sm-5'>" + data.INDUSTRY + "</div>\
                            </div>";
            },
            templateSelection: function (data) {
                return data.NAME;
            }

        }
        $scope.select2Company = {
            placeholder: "Select company",
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
                                        id: index,
                                        NAME: data.NAME
                                    }
                            )
                        });
                        return new_data;
                    }
                    return {
                        results: transformData(data)

                    };
                },
                cache: true
            },
            escapeMarkup: function (markup) {
                return markup;
            },
            templateResult: function (data) {

                return "<div class=''>\
                            <div class='col-sm-7'>" + data.NAME + "</div>\
                            <div class='col-sm-5'>" + data.INDUSTRY + "</div>\
                            </div>";
            },
            templateSelection: function (data) {
                return data.NAME;
            }

        }
        $scope.GetEmailList = function (NAME, obj) {
            url = "../BACKEND/index.php/Record/getList/email";
            filter = {
                filter: [
                    {field: "NAME", value: NAME}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {

                        if (response.data.recordsFiltered > 0) {
                            $scope.contact_emails = response.data.data;
                        } else {
                            $scope.contact_emails = [];
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
                            $scope.contact_phones = response.data.data;
                        } else {
                            $scope.contact_phones = [];
                        }

                    }, function (response) {

                    });
        }
        $scope.GetCompanyEmailList = function (NAME, obj) {
            url = "../BACKEND/index.php/Record/getList/email";
            filter = {
                filter: [
                    {field: "NAME", value: NAME}
                ]};
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
        $scope.GetCompanyPhoneList = function (NAME) {

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
        $scope.DeleteContact = function (com) {
            $scope.DeleteEmail(com.NAME);
            $scope.DeletePhone(com.NAME);
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
        $scope.ShowContactInfo = function (COMPANY_ID) {
            $scope.Mode = "VIEW";
            url = "../BACKEND/index.php/Record/getList/contacts";
            filter = {
                filter: [
                    {field: "ID", value: COMPANY_ID}
                ]
            };
            $http.post(url, filter).
                    then(function (response) {

                        if (response.data.recordsFiltered > 0) {
                            $scope.selected_contact = response.data.data[0];
                            $scope.GetEmailList($scope.selected_contact.NAME);
                            $scope.GetPhoneList($scope.selected_contact.NAME);
                            $scope.MainContain = "contact/contact_view.html";
                            $compile($("#main_container"))($scope);
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
        $scope.DeleteContactEmail = function (email) {
            $scope.contact_emails.splice($scope.contact_emails.indexOf(email), 1);
        }
        $scope.DeleteContactPhone = function (phone) {
            $scope.contact_phones.splice($scope.contact_phones.indexOf(phone), 1);
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
        $scope.AddContactEmail = function () {
            $scope.contact_emails.push($scope.InitContactEmail());
        }
        $scope.AddContactPhone = function () {

            $scope.contact_phones.push($scope.InitContactPhone());
        }
        $scope.SaveContact = function (frm_Contact) {
            if (frm_Contact.$valid) {

                $scope.new_contact.FULL_NAME_FOR_CHECK = $scope.new_contact.FIRST_NAME + $scope.new_contact.LAST_NAME + $scope.new_contact.COMPANY;
                if ($scope.Mode == "NEW") {
                    url = "../BACKEND/index.php/Record/add/contacts/FULL_NAME_FOR_CHECK";
                } else {
                    url = "../BACKEND/index.php/Record/add/contacts/ID";
                }
                try {
                    $scope.new_contact.DEPARTMENT = $scope.new_contact.DEPARTMENT.join();
                } catch (e) {
                }
                try {
                    $scope.new_contact.JOB_TITLE = $scope.new_contact.JOB_TITLE.join();
                } catch (e) {
                }
                $http.post(url, $scope.new_contact).
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
            $http.post(url, {filter: [{field: "NAME", value: $scope.new_contact.FULL_NAME_FOR_CHECK}]}).
                    then(function (response) {
                        angular.forEach($scope.contact_emails, function (_email, key) {
                            _email.NAME = $scope.new_contact.FULL_NAME_FOR_CHECK;
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
            $http.post(url, {filter: [{field: "NAME", value: $scope.new_contact.FULL_NAME_FOR_CHECK}]}).
                    then(function (response) {
                        angular.forEach($scope.contact_phones, function (_phone, key) {
                            _phone.NAME = $scope.new_contact.FULL_NAME_FOR_CHECK;
                            _phone.ID = "";
                            url = "../BACKEND/index.php/Record/add/phone/PHONE_NO";
                            $http.post(url, _phone).
                                    then(function (response) {

                                    }, function (response) {

                                    });
                        }, log);
                        $scope.ShowAllContact();
                        setTimeout(function () {
                            var msg = '<div class="alert alert-success alert-dismissable">\
    <h4><i class="icon fa icon fa fa-check"></i> Success</h4>\
        Save Contact complete.. \
                                    </xdiv>';
//                            bootbox.alert(msg, function () {
//                                setTimeout(function () {
//                                    //$scope.ShowAllContact();
//                                }, 400);
//                            });
                        }, 400);
                    }, function (response) {

                    });
        }

        $scope.InitContactEmail = function () {
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
        $scope.InitContactPhone = function () {
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
