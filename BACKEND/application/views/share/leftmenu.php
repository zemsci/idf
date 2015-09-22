<section class="sidebar">
    <!-- search form -->
    <form action="#" method="get" class="sidebar-form">
        <div class="input-group">
            <input type="text" name="q" class="form-control" placeholder="Search...">
            <span class="input-group-btn">
                <button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i></button>
            </span>
        </div>
    </form>
    <!-- /.search form -->
    <!-- sidebar menu: : style can be found in sidebar.less -->
    <ul class="sidebar-menu">
        <li class="header">MAIN NAVIGATION</li>
        <li class="treeview">
            <a href="#">
                <i class="fa fa-building"></i>
                <span>Company</span> 
                <i class="fa fa-angle-left pull-right"></i>
            </a>
            <ul class="treeview-menu">
                <li class="active"><a href="<?=base_url()?>index.php/company" target="main-contain"><i class="fa fa fa-circle-o"></i>All Company</a></li>
                <li><a href="#" ng-click="ReCom()"><i class="fa fa-circle-o"></i>My Create Company</a></li>
                <li><a href="index2.html"><i class="fa fa-circle-o"></i>My Responsibility Company</a></li>
            </ul>
        </li>
        <li class="treeview">
            <a href="#">
                <i class="fa fa-user"></i>
                <span>Contact</span> 
                <i class="fa fa-angle-left pull-right"></i>
            </a>
            <ul class="treeview-menu">
                <li class="active"><a href="index.html"><i class="fa fa fa-circle-o"></i>All Contact</a></li>
                <li><a href="index2.html"><i class="fa fa-circle-o"></i>My Create Contact</a></li>
                <li><a href="index2.html"><i class="fa fa-circle-o"></i>My Responsibility Contact</a></li>
            </ul>
        </li>
        <li class="treeview">
            <a href="#">
                <i class="fa fa-newspaper-o"></i>
                <span>Project</span> 
                <i class="fa fa-angle-left pull-right"></i>
            </a>
            <ul class="treeview-menu">
                <li class="active"><a href="index.html"><i class="fa fa fa-circle-o"></i>All Project</a></li>
                <li><a href="index2.html"><i class="fa fa-circle-o"></i>Pending Project</a></li>
                <li><a href="index2.html"><i class="fa fa-circle-o"></i>Release Project</a></li>
                <li><a href="index2.html"><i class="fa fa-circle-o"></i>Closed Project</a></li>
            </ul>
        </li>
    </ul>
</section>