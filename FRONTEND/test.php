<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>AdminLTE 2 | Dashboard</title>
        <!-- Tell the browser to be responsive to screen width -->
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <!--Select2-->
        <link href="plugins/select2/select2.min.css" rel="stylesheet" type="text/css"/>
        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
            <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
    </head>
    <body>
        <select id="test" style="width:300px" >
            <option></option>
        </select>

    </body>
</html>

<!-- jQuery 2.1.4 -->
<script src="plugins/jQuery/jQuery-2.1.4.min.js"></script>


<!--Select2-->
<script src="plugins/select2/select2.min.js" type="text/javascript"></script>

<!-- Angular -->
<script src="lib/angular.min.js" type="text/javascript"></script>
<!--Select2-Angular-->
<script src="plugins/angular-select2/src/select2.js" type="text/javascript"></script>
<!-- Main JS -->
<script src="main_js.js" type="text/javascript"></script>
<script>

    $("#test").select2({
        placeholder: "Select company",
        minimumInputLength: 1,
        multiple: false,
        theme: "classic",
        ajax: {
            url: "../BACKEND/index.php/company/AutoComplete",
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    search: params.term// search term
                };
            },
            processResults: function (data, params) {
                // parse the results into the format expected by Select2
                // since we are using custom formatting functions we do not need to
                // alter the remote JSON data, except to indicate that infinite
                // scrolling can be used
                //  params.page = params.page || 1;

                return {
                    results: transformData(data)

                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            console.log(markup);
            return markup;
        },
        templateResult: function (data) {

            return  "<div>" + data.NAME + "</div>";
        },
        templateSelection: function (data) {
            return data.NAME;
        }
    });
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

</script>
