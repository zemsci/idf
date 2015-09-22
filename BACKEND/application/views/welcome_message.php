<!DOCTYPE html>
<html>
    <?php
    $this->load->view('share/head');
    ?>
    <style>
        iframe { 
            overflow:hidden;
            height:800px;
            width:100%; 

        }
    </style>
    <body class="hold-transition skin-blue sidebar-mini"  ng-app="IDF_CRM" ng-controller="LEFT_MENU">
        <div class="wrapper">
            <header class="main-header">
                <!-- Logo -->
                <?php
                $this->load->view('share/logo');
                ?>
                <!-- Header Navbar: style can be found in header.less -->
                <?php
                $this->load->view('share/nav');
                ?>
            </header>
            <!-- Left side column. contains the logo and sidebar -->
            <aside class="main-sidebar">
                <!-- sidebar: style can be found in sidebar.less -->
                <?php
                $this->load->view('share/leftmenu');
                ?>
                <!-- /.sidebar -->
            </aside>

            <!-- Content Wrapper. Contains page content -->
            <div class="content-wrapper" >
                <!--Main Contain-->
                <iframe name="main-contain" src="http://www.w3schools.com"></iframe>
                
            </div><!-- /.content-wrapper -->
            <footer class="main-footer">
                <?php
                $this->load->view('share/footer');
                ?>
            </footer>
            <aside class="control-sidebar control-sidebar-dark">
                <?php
                $this->load->view('share/rightmenu');
                ?>
            </aside>
            <div class="control-sidebar-bg" style="position: fixed; height: auto;"></div>
        </div><!-- ./wrapper -->
        <?php
        $this->load->view('share/buttonscript');
        ?>
    </body>
</html>
