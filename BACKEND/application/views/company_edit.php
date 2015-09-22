<!DOCTYPE html>
<html>
    <?php
    $this->load->view('share/head');
    ?>
    <body class="hold-transition skin-blue sidebar-mini">
        <section class="content-header">
            <h1>
                Company
            </h1>
            <ol class="breadcrumb">
                <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
                <li class="active">Company</li>
            </ol>
        </section>
        <!-- Main content -->
        <section class="content">
            <div class="row">
                <div class="col-md-3">
                    <div class="box box-primary">
                        <div class="box-body box-profile">
                            <img class="profile-user-img img-responsive img-rounded" src="{{new_company.LOGO_URL}}" alt="Company Logo">
                            <p class="text-center">{{new_company.NAME}}</p>
                        </div><!-- /.box-body -->
                    </div><!-- /.box -->

                    <!-- Contact Box -->
                    <div class="box box-primary">
                        <div class="box-header with-border">
                            <h3 class="box-title">Phone List</h3>
                        </div><!-- /.box-header -->
                        <div class="box-body">
                            <div ng-repeat="com_phone in company_phones">
                                <strong><i class="fa fa-phone margin-r-5"></i>  {{com_phone.DESCRIPTION}}</strong>
                                <p class="text-muted">
                                    {{com_phone.PHONE_NO}}
                                </p>   
                            </div>
                        </div>
                    </div><!-- /.box -->
                    <div class="box box-primary">
                        <div class="box-header with-border">
                            <h3 class="box-title">E-Mail List</h3>
                        </div><!-- /.box-header -->
                        <div class="box-body">
                            <div ng-repeat="com_email in company_emails">
                                <strong><i class="fa fa-envelope margin-r-5"></i>  {{com_email.DESCRIPTION}}</strong>
                                <p class="text-muted">
                                    {{com_email.EMAIL}}
                                </p>   
                            </div>
                        </div>
                    </div><!-- /.box -->
                </div>
                <div class="col-md-9">
                    <div class="box">
                        <form  name="frm_Company" ng-submit="SaveCompany(frm_Company)"  novalidate class="form-horizontal">
                            <!-- Horizontal Form -->
                            <div class="box">
                                <div class="box-header">
                                    <h3 class="box-title">General</h3>
                                    <div class="box-tools">
                                        <div class="input-group" style="width: 0px;">                                 
                                            <button  ng-show="Mode == 'EDIT'" type="button"  ng-click="ShowCompanyInfo(new_company.ID)" class="btn btn-info"><i class="fa fa-eye"  ></i></button>
                                            <input type="submit"  class="btn btn-primary fa-save" value="Save"/>
                                        </div>
                                    </div>
                                </div>
                            </div><!-- /.box-header -->
                            <div class="box-body">
                                <div class="form-group" ng-class="{
                                    'has-error'
                                            :frm_Company.$submitted && frm_Company.NAME.$error.required }">
                                    <label for="company_NAME"  class="col-sm-4 control-label">Company Name : </label>
                                    <div class="col-sm-8">
                                        <input name="NAME" required ng-model="new_company.NAME" type="text" class="form-control form-control input-sm" id="company_NAME" placeholder="Enter Company Name">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="company_BRANCH" class="col-sm-4 control-label">Branch : </label>
                                    <div class="col-sm-8">
                                        <input ng-model="new_company.BRANCH" type="text" class="form-control form-control input-sm" id="company_BRANCH" placeholder="Enter branch of company">
                                    </div>
                                </div>
                                <div class="form-group" ng-class="{
                                    'has-error'
                                            :frm_Company.$submitted &&  frm_Company.INDUSTRY.$error.required }">
                                    <label for="company_INDUSTRY" class="col-sm-4 control-label">Industry : </label>
                                    <div class="col-sm-8">
                                        <input required name="INDUSTRY" ng-model="new_company.INDUSTRY" type="text" class="form-control form-control input-sm" id="company_INDUSTRY" placeholder="Email">

                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="company_WEBSITE" class="col-sm-4 control-label">Web site : </label>
                                    <div class="col-sm-8">
                                        <input ng-model="new_company.WEB_SITE" type="text" class="form-control form-control input-sm" id="company_WEBSITE" placeholder="Email">

                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="company_ADDRESS_EN" class="col-sm-4 control-label">Address EN : </label>
                                    <div class="col-sm-8">
                                        <textarea  ng-model="new_company.ADDRESS_EN" id="company_ADDRESS_EN" class="form-control" rows="3" placeholder="Enter Address EN"></textarea>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="company_ADDRESS_TH" class="col-sm-4 control-label">Address TH : </label>
                                    <div class="col-sm-8">
                                        <textarea  ng-model="new_company.ADDRESS_TH" id="company_ADDRESS_TH" class="form-control" rows="3" placeholder="Enter Address TH"></textarea>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="company_DESCRIPTION" class="col-sm-4 control-label">Description : </label>
                                    <div class="col-sm-8">
                                        <textarea id="company_DESCRIPTION" ng-model="new_company.DESCRIPTION" class="form-control" rows="4" placeholder="Enter Description"></textarea>
                                    </div>
                                </div>    
                                <div class="form-group">
                                    <label for="company_DESCRIPTION" class="col-sm-4 control-label">Company Logo : </label>
                                    <div class="col-sm-8">
                                        <input id="company_DESCRIPTION" ng-model="new_company.LOGO_URL" class="form-control" rows="4" placeholder="Enter Company Logo">
                                    </div>
                                </div>  

                            </div><!-- /.box-body -->
                        </form>
                    </div>
                    <div class="box">
                        <!-- Horizontal Form -->
                        <div class="box">
                            <div class="box-header">
                                <h3 class="box-title">Phone</h3>
                                <div class="box-tools">
                                    <div class="input-group" style="width: 0px;">                                 
                                        <input ng-click="AddCompanyPhone()" type="button" class="btn btn-primary fa-save" value="Add" />
                                    </div>
                                </div>
                            </div>
                        </div><!-- /.box-header -->
                        <div class="box-body" ng-show="company_phones.length > 0">                     
                            <div class="form-group" ng-repeat="com_phone in company_phones">
                                <div class="col-sm-4">
                                    <input type="text" class="form-control form-control input-sm" id="inputEmail3" placeholder="Phone Description" ng-model="com_phone.DESCRIPTION" >
                                </div>
                                <div class="col-sm-4">
                                    <input type="text" class="form-control form-control input-sm" id="inputEmail3" placeholder="Phone No." ng-model="com_phone.PHONE_NO"  >                               
                                </div>
                                <div class="col-sm-2">
                                    <input type="text" class="form-control form-control input-sm" id="inputEmail3" placeholder="Phone EXT" ng-model="com_phone.EXT"  >                               
                                </div>
                                <div class="clo-sm-2">
                                    <button type='button' class="btn btn-danger fa" ng-click="DeleteCompanyPhone(com_phone)"><i class="fa fa-close"></i></button>
                                </div>
                            </div>
                        </div><!-- /.box-body -->
                        </form>
                    </div><!-- /.box -->
                    <div class="box">
                        <!-- Horizontal Form -->
                        <div class="box">
                            <div class="box-header">
                                <h3 class="box-title">E-Mail Address</h3>
                                <div class="box-tools">
                                    <div class="input-group" style="width: 0px;">                                 
                                        <input ng-click="AddCompanyEmail()" type="button" class="btn btn-primary fa-save" value="Add" />
                                    </div>
                                </div>
                            </div>
                        </div><!-- /.box-header -->
                        <div class="box-body" ng-show="company_emails.length > 0">                     
                            <div class="form-group" ng-repeat="com_email in company_emails">                   
                                <div class="col-sm-4">
                                    <input type="text" class="form-control form-control input-sm" id="inputEmail3" placeholder="Email Description" ng-model="com_email.DESCRIPTION" >
                                </div>
                                <div class="col-sm-6">
                                    <input type="text" class="form-control form-control input-sm" id="inputEmail3" placeholder="Email Address" ng-model="com_email.EMAIL"  >                               
                                </div>
                                <div class="clo-sm-2">
                                    <button class="btn btn-danger fa" ng-click="DeleteCompanyEmail(com_email)"><i class="fa fa-close"></i></button>
                                </div>
                            </div>
                        </div><!-- /.box-body -->
                    </div><!-- /.box -->

                </div>
            </div>
        </section>
        <?php
        $this->load->view('share/buttonscript');
        ?>
    </body>
</html>