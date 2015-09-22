<!DOCTYPE html>
<html>
    <?php
    $this->load->view('share/head');
    ?>
    <body class="hold-transition skin-blue sidebar-mini">
        <!--Main Contain-->
        <section class="content-header">
            <h1>
                Company
            </h1>
        </section>
        <!-- Main content -->
        <section class="content">
            <div class="row">
                <div class="col-xs-12">
                    <div class="box">
                        <div class="box-header">
                            <h3 class="box-title">All Company</h3>
                            <div class="box-tools">
                                <div class="input-group">                        
                                    <div class="input-group-btn">
                                        <a href="<?=base_url()?>index.php/company/edit/new"  class="pull-right btn btn-sm btn-instagram" data-toggle="tooltip" data-placement="top" title="Create New Company" ><i class="fa fa-plus"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div><!-- /.box-header -->
                        <div class="box-body">
                            <table id="tb_company" class="table table-striped table-bordered table-hover" cellspacing="0" width="100%">
                                <thead>
                                    <tr>

                                        <th>Name</th>
                                        <th>Branch</th>
                                        <th>Industry</th>
                                        <th ></th>

                                    </tr>
                                </thead>
                            </table>

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
<script>
    $(document).ready(function () {
        url = "<?= base_url() ?>/index.php/Record/getList/companies";
        table_company_company = $('#tb_company').DataTable({
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
                {data: "INDUSTRY", searchable: false},
                {data: "ID", orderable: true}
            ],
            "columnDefs": [
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
            var data = $scope.table_company_company.row($(this).parent().parent()).data();
            $scope.ShowCompanyInfo(data.ID);
        });
        $('#tb_company tbody').on('click', '.edit', function () {
            var data = $scope.table_company_company.row($(this).parent().parent()).data();
            $scope.EditCompany(data.ID);
        });
        $('#tb_company tbody').on('click', '.delete', function () {
            var data = $scope.table_company_company.row($(this).parent().parent()).data();
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
    });
</script>