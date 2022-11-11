/*!
* Start Bootstrap - Simple Sidebar v6.0.3 (https://startbootstrap.com/template/simple-sidebar)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
*/
// 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});



/* for transactions */
function addItem(){
    var reference_number = $("#sales_num").val();
    var product_id = $("#product_id").val();
    //var price = $("#price").val();
    var product_barcode = $("#product_input").val();
    var sales_type = $("#sales_type").val();
    var customer_id = $("#customer_id").val();
    var customer_id = $("#customer_id").val();
    var encoded_by = window.localStorage.getItem("pos_user_id")*1;

    if(product_barcode != "" || product_id > 0){
        var ClassName = "Sales";
        $.ajax({
            type:"POST",
            url: baseUrl + ClassName + "&q=addSalesPOS",
            data: {
                input: {
                    reference_number:reference_number,
                    //sales_date:'2022-02-22',
                    sales_invoice: '0',
                    customer_id: customer_id,
                    sales_type: sales_type,
                    remarks: 'walk-in',
                    product_id:product_id,
                    quantity:1,
                    product_barcode:product_barcode,
                    for_pick_up: 0,
                    encoded_by: encoded_by
                    //param: "reference_number='"+reference_number+"'"
                }
            },
            success:function(data){
                var json = JSON.parse(data);
                if(json.data == 1){
                    getDetails();
                    console.log("successfully added item");
                }else if(json.data == -3){
                    alert_warning("Insufficient quantity.");
                }else{
                    alert_warning(json.data);
                }
                
            }
        });
    }
    
}

function editQty(){
    var ClassName = "Sales";
    var quantity = $("#edit_qty").val();
    var sales_detail_id = $("#sales_detail_id").val();

    if(quantity > 0){
        $.ajax({
            type:"POST",
            "url": baseUrl + ClassName + "&q=edit_detail",
            data:{
                input:{
                    sales_detail_id:sales_detail_id,
                    quantity:quantity
                }
            },
            success:function(data){
                var json = JSON.parse(data);
                if(json.data == 1){
                    console.log("successfully updated item");
                    closeModalEditQty();
                    getDetails();
                    alert_success("Successfully updated.");
                }else{
                    console.log(json.data);
                }
            }
        });
    }
}

function removeItem(){
    var ClassName = "Sales";
    var access_code = $("#access_code").val();
    var sales_detail_id = $("#sales_detail_id").val();
    $.ajax({
        type:"POST",
        "url": baseUrl + ClassName + "&q=remove_detail_pos",
        data:{
            input:{
                ids:[sales_detail_id],
                access_code:access_code
            }
        },
        success:function(data){
            var json = JSON.parse(data);
            if(json.data == 1){
                closeModalConfirm();
                getDetails();
                alert_success("Successfully removed item.");
            }else if(json.data == -2){
                alert_warning("Access denied.");
            }else{
                console.log(json.data);
            }
        }
    });
}

function cancel_sales(){
    var ClassName = "Sales";
    var reference_number = $("#sales_num").val();
    var access_code = $("#access_code").val();
    var table = $("#dt_details").DataTable();
    $.ajax({
        type:"POST",
        "url": baseUrl + ClassName + "&q=cancel_sales_pos",
        data:{
            input:{
                reference_number:reference_number,
                access_code:access_code
            }
        },
        success:function(data){
            var json = JSON.parse(data);
            if(json.data == 1){
                console.log("cancelled sales");
                generateSalesNum();
                table.clear().draw();
                closeModalConfirm();
                alert_success("Successfully cancelled.");
            }else if(json.data == -2){
                alert_warning("Access denied.");
            }else{
                console.log(json.data);
            }
        }
    });
}

function proceed_line_discount(){
    var ClassName = "Sales";
    var discount = $("#edit_discount").val();
    var sales_detail_id = $("#sales_detail_id2").val();
    var line_discount_type = $("#line_discount_type").val();
    var access_code = $("#access_code_line_discount").val();

    if(line_discount_type <= 0 || line_discount_type == ""){
        $('#carouselLineDiscount').carousel(0);
    }else if(discount < 0 || discount == ""){
        $('#carouselLineDiscount').carousel(1);
        $("#edit_discount").focus();
    }else if(access_code == ""){
        $('#carouselLineDiscount').carousel(2);
        $("#access_code_line_discount").focus();
    }else{
        $.ajax({
            type:"POST",
            "url": baseUrl + ClassName + "&q=edit_line_discount",
            data:{
                input:{
                    sales_detail_id:sales_detail_id,
                    discount:discount,
                    line_discount_type:line_discount_type,
                    access_code:access_code
                }
            },
            success:function(data){
                var json = JSON.parse(data);
                if(json.data == 1){
                    console.log("Successfully applied line discount");
                    closeModalLineDiscount();
                    getDetails();
                    alert_success("Successfully applied discount.");
                }else if(json.data == -2){
                    alert_warning("Access denied.");
                }else{
                    console.log(json.data);
                }
            }
        });
    }
}

function proceed_discount(){
    var ClassName = "Sales";
    var reference_number = $("#sales_num").val();
    var discount_id = $("#discount_id").val();
    var access_code = $("#access_code_discount").val();

    if(discount_id <= 0 || discount_id == ""){
        $('#carouselDiscounts').carousel(0);
    }else if(access_code == ""){
        $('#carouselDiscounts').carousel(1);
        $("#access_code_discount").focus();
    }else{
        $.ajax({
            type:"POST",
            "url": baseUrl + ClassName + "&q=edit_discount",
            data:{
                input:{
                    reference_number:reference_number,
                    discount_id:discount_id,
                    access_code:access_code
                }
            },
            success:function(data){
                var json = JSON.parse(data);
                if(json.data == 1){
                    console.log("Successfully applied discount");
                    closeModalDiscount();
                    getDetails();
                    alert_success("Successfully applied discount.");
                }else if(json.data == -2){
                    alert_warning("Access denied.");
                }else{
                    console.log(json.data);
                }
            }
        });
    }
}

function save_order(){
    //alert_processing("Saving order ...");

    var ClassName = "Sales";

    var reference_number = $("#sales_num").val();
    $.ajax({
        type:"POST",
        url: baseUrl + ClassName + "&q=save_sales",
        data:{
            input:{
                reference_number:reference_number
            }
        },
        success:function(data){

            var data = JSON.parse(data);

            if(data.data == 1){
                generateSalesNum();
                var table = $("#dt_details").DataTable();
                table.clear().draw();
                closeModalConfirm();

                $("#product_id").val("");
                $("#sales_type").val("C");
                $("#sales_type_label").html("Cash");
                $("#customer_id").val(0);
                $("#customer_name").html("Walk-in");
                
                alert_success("Successfully saved order.");
                //getPendingSales();
            }else{
                alert_warning("Err: " + data.data);
            }
            
        }
    });
}

function recall_order(){
    getDetails();
    getTotalOtherPayments();
    closeModalRecall();
}

function proceed_payment_option(){
    var payment_option_id = $("#payment_option_id").val();
    var other_payment_amount = $("#other_payment_amount").val();
    var other_payment_reference = $("#other_payment_reference").val();
    var total_payment_amount = $("#totalPaymentAmount").val();
    var encoded_by = window.localStorage.getItem("pos_user_id")*1;

    if(payment_option_id <= 0 || payment_option_id == ""){
        $('#carouselOtherPayments').carousel(0);
    }else if(other_payment_amount <= 0 || other_payment_amount == ""){
        $('#carouselOtherPayments').carousel(1);
        $("#other_payment_amount").focus();
    }else if(other_payment_reference == ""){
        $('#carouselOtherPayments').carousel(2);
        $("#other_payment_reference").focus();
    }else{

        var ClassName = "CustomerPayment";
        var reference_number = $("#payment_num").val();
        var sales_num = $("#sales_num").val();
        var amount = $("#other_payment_amount").val();
        var payment_option_id = $("#payment_option_id").val();
        var other_payment_reference = $("#other_payment_reference").val();
        
        $.ajax({
            type:"POST",
            url: baseUrl + ClassName + "&q=addPaymentPOS",
            data:{
                input:{
                    customer_id:'0',
                    payment_type:'O',
                    //payment_date:'2022-03-19',
                    remarks:'',
                    reference_number:reference_number,
                    sales_num:sales_num,
                    amount:amount,
                    other_payment_reference:other_payment_reference,
                    payment_option_id:payment_option_id,
                    total_payment_amount:total_payment_amount,
                    encoded_by:encoded_by
                }
            },
            success:function(data){
                var data = JSON.parse(data);
                if(data.data == 1){
                    alert_success("Successfully added payment.");
                    closeModalPaymentOptions();
                    getTotalOtherPayments();
                }else if(data.data == -1){
                    alert_warning("Warning. Invalid Payment.");
                    $('#carouselOtherPayments').carousel(1);
                    $("#other_payment_amount").focus();
                }else{
                    alert_warning("Err: " + data.data);
                }
                //console.log(data);
            }
        });
    }
}

function change_sales_type(){
    var ClassName = "Sales";
    var reference_number = $("#sales_num").val();
    var action = $("#action").val();
    var customer_id = $("#customer_id").val();
    var c_customer_id = $("#c_customer_id").val();
    var c_customer_name = $("#c_customer_name").val();
    
    if(action == "H"){
        sales_type = "H";
        var access_code = $("#c_access_code").val();
        $('#carouselCustomers').carousel(0);
    }else{
        sales_type = "C";
        var access_code = $("#access_code").val();
    }

    if((sales_type == "H" || action == "N") && c_customer_id == ""){
        $('#carouselCustomers').carousel(0);
        var table_customers = $('#dt_customers').DataTable();
        $(table_customers.row().node()).addClass('selected');
        table_customers.cell(':eq(0)').focus();
    }else if(access_code == "" && sales_type == "H"){
        $('#carouselCustomers').carousel(1);
        $("#c_access_code").focus();
    }else if((access_code == "" && sales_type == "C") && action != "N"){
        $("#access_code").focus();
    }else{

        $.ajax({
            type:"POST",
            "url": baseUrl + ClassName + "&q=change_sales_type",
            data:{
                input:{
                    reference_number:reference_number,
                    sales_type:sales_type,
                    customer_id:c_customer_id,
                    access_code:access_code,
                    action:action
                }
            },
            success:function(data){
                var json = JSON.parse(data);
                if(json.data == 1){
    
                    if(sales_type == "H"){
                        var st = "Charge";
                    }else{
                        var st = "Cash";
                        closeModalConfirm();
                    }
    
                    closeModalCustomers();
    
                    $("#sales_type_label").html(st);
                    $("#sales_type").val(sales_type);
                    $("#customer_id").val(c_customer_id);
                    $("#customer_name").html(c_customer_name);
    
                    alert_success("Successfully updated.");
                    
                }else if(json.data == -2){
                    alert_warning("Access denied.");
                    $("#access_code").val("");
                    $("#c_access_code").val("");
                }else{
                    console.log(json.data);
                }
            }
        });
    }
}

function remove_other_payments(){
    var ClassName = "CustomerPayment";
    var reference_number = $("#sales_num").val();

    $.ajax({
        type:"POST",
        "url": baseUrl + ClassName + "&q=remove_payments",
        data:{
            input:{
                reference_number:reference_number
            }
        },
        success:function(data){
            var json = JSON.parse(data);
            if(json.data == 1){

                $("#totalOtherPayment").val(0);
                $("#other_payment").html("0.00");
                closeModalConfirm();
                alert_success("Successfully removed payments.");
                
            }else{
                console.log(json.data);
            }
        }
    });
}

function finishSales(forWithdrawal = false){
    var ClassName = "Sales";
    var reference_number = $("#sales_num").val();
    var sales_type = $("#sales_type").val();
    var customer_id = $("#customer_id").val();
    var encoded_by = window.localStorage.getItem("pos_user_id")*1;

    var change = $("#change").val()*1;
    var cash_amount = $("#cash_amount").val();
    var total_amount = $("#total_amount").val()*1;
    var other_payment_amount = $("#other_payments").val()*1;

    var customer_payment_amount = 0;
    var remaining_balance = total_amount-other_payment_amount;
    if(cash_amount <= remaining_balance){
        customer_payment_amount = cash_amount;
    }else{
        customer_payment_amount = remaining_balance;
    }
    
    var for_pickup = $("#for_pickup").val();
    var table = $("#dt_details").DataTable();

    if(cash_amount == ""){
        //$('#carouselPayment').carousel(1);
        $('#cash_amount').focus();
    }else{
        
        if(  ((change >= 0 || sales_type == "H") && forWithdrawal == false) || (change >= 0 && forWithdrawal == true) ){
            $.ajax({
                type:"POST",
                "url": baseUrl + ClassName + "&q=finishSalesPOS",
                data:{
                    input:{
                        reference_number:reference_number,
                        for_pickup:for_pickup,
                        customer_payment_amount:customer_payment_amount,
                        sales_type:sales_type,
                        customer_id:customer_id,
                        encoded_by:encoded_by
                    }
                },
                success:function(data){
                    var json = JSON.parse(data);
                    if(json.data > 0){
                        //printReceipt();

                        table.clear().draw();
                        closeModalPayment();

                        $("#product_id").val("");
                        $("#sales_type").val("C");
                        $("#sales_type_label").html("Cash");
                        $("#customer_id").val(0);
                        $("#customer_name").html("Walk-in");
                        
    
                        $("#other_payment").html("0.00");
                        $("#totalOtherPayment").val(0);

                        generateSalesNum();
                        alert_success("Successfully finished.");
                        $("#action").val("q");
                        printQueuing(json.data);
                        
                    }else{
                        console.log(json.data);
                    }
                }
            });
        }else{
            alert_warning("Warning: Insufficient Payment.");
        }
    }
}

function printQueuing(id) {
    $("#modalQueuing").modal('show');
    var ClassName = "Sales";
    $.ajax({
        type: 'POST',
        "url": baseUrl + ClassName + "&q=getSalesHeader",
        data: {
            id: id
        },
        success: function(data) {
            var json = JSON.parse(data);
            // console.log(json.data[0].customer_name);
            $(".qr_reference_number_span").html(json.data[0].reference_number);
            $(".qr_sales_date_span").html(json.data[0].date_last_modified);
            $(".qr_sales_q_num").html(json.data[0].q_num);
        }
    });
}

function print_queuing() {
    var printContents = document.getElementById('print_queuing').innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.close();
    location.reload();

}

function release_stocks(reprint_receipt = false){
    var ClassName = "StockWithdrawal";
    var encoded_by = window.localStorage.getItem("pos_user_id")*1;
    var reference_number = $("#sales_num").val();
    var sales_type = $("#sales_type").val();

    var r_qty = $("input[name='r_qty[]']").map(function(){return $(this).val();}).get();
    var r_id = $("input[name='r_id[]']").map(function(){return $(this).val();}).get();
    var p_id = $("input[name='p_id[]']").map(function(){return $(this).val();}).get();

    $.ajax({
        type: "POST",
        url: baseUrl + ClassName + "&q=addStockWithdrawalPOS",
        data:{
            input:{
                reference_number:reference_number,
                r_qty:r_qty,
                r_id:r_id,
                p_id:p_id,
                encoded_by:encoded_by
            }
        },
        success: function(data) {
            console.log(data);
            printWithdrawal();
            
            if(sales_type == "H" && reprint_receipt == true){
                printReceipt();
            }

            closeModalItemWithdrawal();

            alert_success("Successfully finished.");
        }
    });
}

function confirm_review_sales_summary(){

    var ClassName = "SalesSummary";
    var ss_starting_balance = $("#ss_starting_balance").val()*1;
    var ss_total_sales_amount = $("#ss_total_sales_amount").val()*1;
    var ss_total_amount_collected = $("#ss_total_amount_collected").val()*1;
    //var ss_balance = $("#ss_balance").val();
    var encoded_by = window.localStorage.getItem("pos_user_id")*1;

    if(ss_total_amount_collected == "" || ss_total_amount_collected < 0){
        $('#carouselSalesSummary').carousel(1);
        $("#ss_total_amount_collected").focus();
    }else{
        $.ajax({
            type:"POST",
            "url": baseUrl + ClassName + "&q=finish",
            data:{
                input:{
                    ss_total_sales_amount:ss_total_sales_amount,
                    ss_total_amount_collected:ss_total_amount_collected,
                    ss_starting_balance:ss_starting_balance,
                    encoded_by:encoded_by
                }
            },
            success:function(data){
                var json = JSON.parse(data);
                if(json.data == 1){
                    closeModalSalesSummary();
                    alert_success("Successfully confirmed sales summary.");
                    //window.location.reload();
                    logout();
                }else{
                    console.log(json.data);
                }
            }
        });
    }
}

function addStartingBalance(){
    var ClassName = "SalesSummary";
    var encoded_by = window.localStorage.getItem("pos_user_id")*1;
    var starting_balance = $("#starting_balance").val();

    if(starting_balance >= 0){
        $.ajax({
            type:"POST",
            url: baseUrl + ClassName + "&q=add",
            data:{
                input:{
                    cashier_id:encoded_by,
                    starting_balance:starting_balance,
                    total_sales_amount:0,
                    total_amount_collected:0,
                    encoded_by:0
                }
            },
            success:function(data){
                var json = JSON.parse(data);
                if(json.data == 1){
                    $("#modalStartingBalance").modal('hide');
                    $("#starting_balance").val("");
                    $("#ss_starting_balance").val(starting_balance);
                    resetFields();
                    $("#product_input").focus();

                    alert_success("Success. Please start transaction.");

                }else{
                    console.log(json.data);
                }
            }
        });
    }else{
        alert_warning("Please input starting balance.");
    }
    
}


function addCustomer(){
    var customer_name = $("#ac_customer_name").val();
    var customer_address = $("#ac_customer_address").val();
    var customer_contact_number = $("#ac_customer_contact_number").val();
    var access_code = $("#ac_access_code").val();

    if(customer_name == ""){
        $('#carouselAddCustomer').carousel(0);
        $("#ac_customer_name").focus();
    }else if(customer_address == ""){
        $('#carouselAddCustomer').carousel(1);
        $("#ac_customer_address").focus();
    }else if(customer_contact_number == ""){
        $('#carouselAddCustomer').carousel(2);
        $("#ac_customer_contact_number").focus();
    }else if(access_code == ""){
        $('#carouselAddCustomer').carousel(3);
        $("#ac_access_code").focus();
    }else{

        var ClassName = "Customers";
        
        $.ajax({
            type:"POST",
            url: baseUrl + ClassName + "&q=addCustomerPOS",
            data:{
                input:{
                    customer_name:customer_name,
                    customer_address:customer_address,
                    customer_contact_number:customer_contact_number,
                    remarks:'encoded through cashier',
                    access_code:access_code
                }
            },
            success:function(data){
                var data = JSON.parse(data);
                if(data.data == 1){
                    alert_success("Successfully added customer.");
                    closeModalAddCustomer();
                }else if(data.data == -2){
                    alert_warning("Access denied.");
                }else if(data.data == 2){
                    alert_warning("Entry already exists.");
                    $('#carouselAddCustomer').carousel(0);
                    $("#ac_customer_name").focus();
                }else{
                    console.log("Err: " + data.data);
                }
                //console.log(data);
            }
        });
    }
}

/** end transactions */



/** fetching data */

function setStartingBalance(){
    var ClassName = "SalesSummary";
    $.ajax({
        type:"POST",
        url: baseUrl + ClassName + "&q=getLatestSalesSummary",
        success:function(data){
            var json = JSON.parse(data);
            if(json.data == -1){
                $("#action").val("sb");
                $("#modalStartingBalance").modal({ backdrop : false, keyboard: false });
                $("#modalStartingBalance").modal('show');
            }else{
                $("#ss_starting_balance").val(json.data.starting_balance);
            }

            //console.log(json.data);
        }
    });
}

function generateSalesNum(){
    var ClassName = "Sales";
    $.ajax({
        type:"POST",
        url: baseUrl + ClassName + "&q=generate",
        success:function(data){
            var json = JSON.parse(data);
            $("#sales_num").val(json.data);
        }
    });
}

function generatePaymentNum(){
    var ClassName = "CustomerPayment";
    $.ajax({
        type:"POST",
        url: baseUrl + ClassName + "&q=generate",
        success:function(data){
            var json = JSON.parse(data);
            $("#payment_num").val(json.data);
        }
    });
}

function reload_items(){
    var table_products = $('#dt_products').DataTable();
    table_products.cell.blur();
    $("#product_input").focus();
    fetchProducts();
    //$("#action").val("r");
    alert_success("Successfully reloaded product list.");
}

function fetchProducts(){
    var ClassName = "Products";
    $("#dt_products").DataTable().clear();
    $("#dt_products").DataTable().destroy();
    var table = $("#dt_products").DataTable({
        "processing": true,
        "initComplete": function(settings, data){
            //alert("finished loading");
        },
        pageLength : 10, paging: true, info: false, lengthChange: false, searching: true, ordering:false,
        lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'All']],
        keys: {
            keys: [ 13 /* ENTER */, 38 /* UP */, 40 /* DOWN */ ]
        },
        "ajax": {
            "url": baseUrl + ClassName + "&q=show",
            "dataSrc": "data"
        },
        "columns": [
            {
                "data": "product_code"
            },
            {
                "data": "product_name"
            },
            {
                "data": "product_price"
            },
            {
                "data": "product_category"
            }
        ]
    });

    // Handle event when cell gains focus
    $('#dt_products').on('key-focus.dt', function(e, datatable, cell){
        // Select highlighted row
        $(table.row(cell.index().row).node()).addClass('selected');
    });

    // Handle event when cell looses focus
    $('#dt_products').on('key-blur.dt', function(e, datatable, cell){
        // Deselect highlighted row
        $(table.row(cell.index().row).node()).removeClass('selected');
    });
        
    // Handle key event that hasn't been handled by KeyTable
    $('#dt_products').on('key.dt', function(e, datatable, key, cell, originalEvent){
        // If ENTER key is pressed
        if(key === 13){
            // Get highlighted row data
            var data = $("#dt_products").DataTable().row(cell.index().row).data();
            $("#product_id").val(data['product_id']);
            //console.log(data['product_id']);
            //$("#product_input").focus();
        }
    });

    // prevent arrow up and down
    $("#product_input").keydown(function(e){
        var keycode;
        if (window.event){
            keycode = window.event.keyCode;
        }else if (e){
            keycode = e.which;
        }
        
        if(keycode == 38 || keycode == 40){
            e.preventDefault();
        }
    });

    $("#product_input").keyup(function(e){
        var keycode;
        if (window.event){
            keycode = window.event.keyCode;
        }else if (e){
            keycode = e.which;
        }

        // disable function f1-f12
        if(keycode == 38 || keycode == 40){
            e.preventDefault();
        }else{
            $("#dt_products tbody tr").removeClass('selected');
            //$(table.row( {search:'applied'} ).node()).addClass('selected');
            //table.cell(':eq(0)', {search: 'applied'} ).focus();

            table.search($(this).val()).draw();
        }
    });

}

function getDetails(){

    var reference_number = $("#sales_num").val();
    var ClassName = "Sales";
    
    $("#dt_details").DataTable().clear();
    $("#dt_details").DataTable().destroy();
    

    var table_details =  $("#dt_details").DataTable({
        pageLength : 5, paging: false, info: false, lengthChange: false, searching: false, ordering:false,
        lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'All']],
        keys: {
            keys: [ 13 /* ENTER */, 38 /* UP */, 40 /* DOWN */ ]
        },
        "processing":true,
        "ajax":{
            type:"POST",
            url: baseUrl + ClassName + "&q=getDetailsPOS",
            data:{
                input: {
                    reference_number:reference_number
                }
            }
        },
        "columns": [
            {
                "data": "pos_qty"
            },
            {
                "data": "product"
            },
            {
                "data": "pos_price"
            },
            {
                "data": "amount"
            }
        ],
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ? i.replace(/[\$,]/g, '')*1 : typeof i === 'number' ? i : 0;
            };
        
            // computing total discount
            var totalAmount = api.column( 3 ).data().reduce( function (a, b) {
                return intVal(a) + intVal(b);
            }, 0 );

            // computing total items
            var totalQty = api.column( 0 ).data().reduce( function (a, b) {
                return intVal(a) + intVal(b);
            }, 0 );
        
            // Update footer by showing the total with the reference of the column index
            $("#totalAmount").html(totalAmount);
            $("#totalQty").html(totalQty);
            $("#totalPaymentAmount").val(totalAmount);
        },
    });

    // Handle event when cell gains focus
    $('#dt_details').on('key-focus.dt', function(e, datatable, cell){
        // Select highlighted row
        $(table_details.row(cell.index().row).node()).addClass('selected');
    });

    // Handle event when cell looses focus
    $('#dt_details').on('key-blur.dt', function(e, datatable, cell){
        // Deselect highlighted row
        $(table_details.row(cell.index().row).node()).removeClass('selected');
    });
        
    // Handle key event that hasn't been handled by KeyTable
    $('#dt_details').on('key.dt', function(e, datatable, key, cell, originalEvent){
        // If ENTER key is pressed
        if(key == 13){
            // Get highlighted row data
            var data = $('#dt_details').DataTable().row(cell.index().row).data();
            $("#sales_detail_id").val(data['sales_detail_id']); // for edit qty
            $("#sales_detail_id2").val(data['sales_detail_id']); // for discount
            $("#editQtyModalTitle").html("Edit " + data['product']);
            $("#editDiscountModalTitle").html("Discount for " + data['product']);
            //console.log(data['product']);
            
            //$("#product_input").focus();
        }
    });
}

function getTotalOtherPayments(forWithdrawal = false){
    var ClassName = "CustomerPayment";
    var sales_num = $("#sales_num").val();
    
    $.ajax({
        type:"POST",
        url: baseUrl + ClassName + "&q=getTotalPaymentPOS",
        data:{
            input:{
                sales_num:sales_num
            }
        },
        success:function(data){
            var json = JSON.parse(data);
            var totalPayment = json.data;
            if(totalPayment > 0){

                if(forWithdrawal == true){
                    $("#other_payments").val(totalPayment);
                }else{
                    $("#totalOtherPayment").val(totalPayment);
                    $("#other_payment").html(totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2 }));
                }
                
            }else{
                $("#totalOtherPayment").val(0);
                $("#other_payment").html("0.00");
                $("#other_payments").val("0");
            }
            
        }
    });
}


function getPendingSales(){
    
    var ClassName = "Sales";
    $("#dt_pending_sales").DataTable().clear();
    $("#dt_pending_sales").DataTable().destroy();

    var table_sales =  $("#dt_pending_sales").DataTable({
        "processing":true,
        "initComplete": function(settings, data){
            var table_pending_sales = $('#dt_pending_sales').DataTable();
            $(table_pending_sales.row().node()).addClass('selected');
            table_pending_sales.cell(':eq(0)').focus();
        },
        pageLength : 5, paging: true, info: false, lengthChange: false, searching: false, ordering:false,
        lengthMenu: [[5, 20, 50, -1], [5, 10, 20, 50, 'All']],
        keys: {
            keys: [ 13 /* ENTER */, 38 /* UP */, 40 /* DOWN */ ]
        },
        "ajax":{
            type:"POST",
            url: baseUrl + ClassName + "&q=show",
            data:{
                input: {
                    param: "status='P' ORDER BY date_added ASC"
                }
            }
        },
        "columns": [
            {
                "data": "reference_number"
            },
            {
                "data": "customer"
            },
            {
                "data": "total"
            },
            {
                "data": "date_added"
            }
        ]
    });

    // Handle event when cell gains focus
    $('#dt_pending_sales').on('key-focus.dt', function(e, datatable, cell){
        // Select highlighted row
        $(table_sales.row(cell.index().row).node()).addClass('selected');
    });

    // Handle event when cell looses focus
    $('#dt_pending_sales').on('key-blur.dt', function(e, datatable, cell){
        // Deselect highlighted row
        $(table_sales.row(cell.index().row).node()).removeClass('selected');
    });
        
    // Handle key event that hasn't been handled by KeyTable
    $('#dt_pending_sales').on('key.dt', function(e, datatable, key, cell, originalEvent){
        // If ENTER key is pressed
        if(key == 13){
            // Get highlighted row data
            var data = $('#dt_pending_sales').DataTable().row(cell.index().row).data();
            //console.log(data['reference_number']);
            $("#sales_num").val(data['reference_number']);
            $("#sales_type").val(data['sales_type']);
            $("#customer_name").html(data['customer']);
            $("#customer_id").val(data['customer_id']);
            if(data['sales_type'] == "H"){
                $("#sales_type_label").html("Charge");
            }else{
                $("#sales_type_label").html("Cash");
            }
        }
    });
}


function getPaymentOptions(){
    
    var ClassName = "PaymentOption";
    $("#dt_payment_options").DataTable().clear();
    $("#dt_payment_options").DataTable().destroy();

    var table_payment_option =  $("#dt_payment_options").DataTable({
        "processing":true,
        "initComplete": function(settings, data){
            var table_payment_option = $('#dt_payment_options').DataTable();
            $(table_payment_option.row().node()).addClass('selected');
            table_payment_option.cell(':eq(0)').focus();
        },
        pageLength : 10, paging: true, info: false, lengthChange: false, searching: false, ordering:false,
        lengthMenu: [[10, 20, 50, -1], [5, 10, 20, 50, 'All']],
        keys: {
            keys: [ 13 /* ENTER */, 38 /* UP */, 40 /* DOWN */ ]
        },
        "ajax":{
            type:"POST",
            url: baseUrl + ClassName + "&q=show"
        },
        "columns": [
            {
                "data": "payment_option"
            }
        ]
    });

    // Handle event when cell gains focus
    $('#dt_payment_options').on('key-focus.dt', function(e, datatable, cell){
        // Select highlighted row
        $(table_payment_option.row(cell.index().row).node()).addClass('selected');
    });

    // Handle event when cell looses focus
    $('#dt_payment_options').on('key-blur.dt', function(e, datatable, cell){
        // Deselect highlighted row
        $(table_payment_option.row(cell.index().row).node()).removeClass('selected');
    });
        
    // Handle key event that hasn't been handled by KeyTable
    $('#dt_payment_options').on('key.dt', function(e, datatable, key, cell, originalEvent){
        // If ENTER key is pressed
        if(key == 13){
            // Get highlighted row data
            var data = $('#dt_payment_options').DataTable().row(cell.index().row).data();
            //console.log(data['reference_number']);
            $("#payment_option_id").val(data['payment_option_id']);
            $("#payment_option").val(data['payment_option']);
        }
    });
}

// line discount types
function getLineDiscountTypes(){
    
    $("#dt_line_discount_options").DataTable().clear();
    $("#dt_line_discount_options").DataTable().destroy();

    var line_discounts = [{"line_discount_type":"1","line_discount":"Amount per item"},{"line_discount_type":"2","line_discount":"Total Amount"}];

    var table_line_discount =  $("#dt_line_discount_options").DataTable({
        pageLength : 10, paging: false, info: false, lengthChange: false, searching: false, ordering:false,
        keys: {
            keys: [ 13 /* ENTER */, 38 /* UP */, 40 /* DOWN */ ]
        },
        "data": line_discounts,
        "columns": [
            {
                "data": "line_discount"
            }
        ]
    });

    // Handle event when cell gains focus
    $('#dt_line_discount_options').on('key-focus.dt', function(e, datatable, cell){
        // Select highlighted row
        $(table_line_discount.row(cell.index().row).node()).addClass('selected');
    });

    // Handle event when cell looses focus
    $('#dt_line_discount_options').on('key-blur.dt', function(e, datatable, cell){
        // Deselect highlighted row
        $(table_line_discount.row(cell.index().row).node()).removeClass('selected');
    });
        
    // Handle key event that hasn't been handled by KeyTable
    $('#dt_line_discount_options').on('key.dt', function(e, datatable, key, cell, originalEvent){
        // If ENTER key is pressed
        if(key == 13){
            // Get highlighted row data
            var data = $('#dt_line_discount_options').DataTable().row(cell.index().row).data();
            //console.log(data['reference_number']);
            $("#line_discount_type").val(data['line_discount_type']);
        }
    });
}

// discounts
function getDiscounts(){
    
    var ClassName = "Discounts";
    $("#dt_discounts").DataTable().clear();
    $("#dt_discounts").DataTable().destroy();

    var table_discounts =  $("#dt_discounts").DataTable({
        "processing":true,
        "initComplete": function(settings, data){
            var table_discounts = $('#dt_discounts').DataTable();
            $(table_discounts.row().node()).addClass('selected');
            table_discounts.cell(':eq(0)').focus();
        },
        pageLength : 10, paging: true, info: false, lengthChange: false, searching: false, ordering:false,
        lengthMenu: [[10, 20, 50, -1], [5, 10, 20, 50, 'All']],
        keys: {
            keys: [ 13 /* ENTER */, 38 /* UP */, 40 /* DOWN */ ]
        },
        "ajax":{
            type:"POST",
            url: baseUrl + ClassName + "&q=show"
        },
        "columns": [
            {
                "data": "discount_name"
            }
        ]
    });

    // Handle event when cell gains focus
    $('#dt_discounts').on('key-focus.dt', function(e, datatable, cell){
        // Select highlighted row
        $(table_discounts.row(cell.index().row).node()).addClass('selected');
    });

    // Handle event when cell looses focus
    $('#dt_discounts').on('key-blur.dt', function(e, datatable, cell){
        // Deselect highlighted row
        $(table_discounts.row(cell.index().row).node()).removeClass('selected');
    });
        
    // Handle key event that hasn't been handled by KeyTable
    $('#dt_discounts').on('key.dt', function(e, datatable, key, cell, originalEvent){
        // If ENTER key is pressed
        if(key == 13){
            // Get highlighted row data
            var data = $('#dt_discounts').DataTable().row(cell.index().row).data();
            //console.log(data['reference_number']);
            $("#discount_id").val(data['discount_id']);
        }
    });
}


// get customers
function getCustomers(){
    
    var ClassName = "Customers";
    $("#dt_customers").DataTable().clear();
    $("#dt_customers").DataTable().destroy();

    var table_customers =  $("#dt_customers").DataTable({
        "processing":true,
        "initComplete": function(settings, data){
            var table_customers = $('#dt_customers').DataTable();
            $(table_customers.row().node()).addClass('selected');
            table_customers.cell(':eq(0)').focus();
        },
        pageLength : 5, paging: true, info: false, lengthChange: false, searching: false, ordering:false,
        lengthMenu: [[5, 10, 50, -1], [5, 10, 20, 50, 'All']],
        keys: {
            keys: [ 13 /* ENTER */, 38 /* UP */, 40 /* DOWN */ ]
        },
        "ajax":{
            type:"POST",
            url: baseUrl + ClassName + "&q=show",
            data:{
                input: {
                    param: "customer_id >= 0 ORDER BY customer_name ASC"
                }
            }
        },
        "columns": [
            {
                "data": "customer_name"
            }
        ]
    });

    // Handle event when cell gains focus
    $('#dt_customers').on('key-focus.dt', function(e, datatable, cell){
        // Select highlighted row
        $(table_customers.row(cell.index().row).node()).addClass('selected');
    });

    // Handle event when cell looses focus
    $('#dt_customers').on('key-blur.dt', function(e, datatable, cell){
        // Deselect highlighted row
        $(table_customers.row(cell.index().row).node()).removeClass('selected');
    });
        
    // Handle key event that hasn't been handled by KeyTable
    $('#dt_customers').on('key.dt', function(e, datatable, key, cell, originalEvent){
        // If ENTER key is pressed
        if(key == 13){
            // Get highlighted row data
            var data = $('#dt_customers').DataTable().row(cell.index().row).data();
            //console.log(data['reference_number']);
            //$("#customer_id").val(data['customer_id']);
            //$("#customer_name").html(data['customer_name']);
            $("#c_customer_id").val(data['customer_id']);
            $("#c_customer_name").val(data['customer_name']);
        }
    });
}

// releasal types
function getReleasalTypes(){
    
    $("#dt_releasal_type").DataTable().clear();
    $("#dt_releasal_type").DataTable().destroy();

    var releasal_types = [{"releasal_type_id":"0","releasal_type":"Released"},{"releasal_type_id":"1","releasal_type":"For pickup"}];

    var table_releasal =  $("#dt_releasal_type").DataTable({
        pageLength : 10, paging: false, info: false, lengthChange: false, searching: false, ordering:false,
        keys: {
            keys: [ 13 /* ENTER */, 38 /* UP */, 40 /* DOWN */ ]
        },
        "data": releasal_types,
        "columns": [
            {
                "data": "releasal_type"
            }
        ]
    });

    // Handle event when cell gains focus
    $('#dt_releasal_type').on('key-focus.dt', function(e, datatable, cell){
        // Select highlighted row
        $(table_releasal.row(cell.index().row).node()).addClass('selected');
    });

    // Handle event when cell looses focus
    $('#dt_releasal_type').on('key-blur.dt', function(e, datatable, cell){
        // Deselect highlighted row
        $(table_releasal.row(cell.index().row).node()).removeClass('selected');
    });
        
    // Handle key event that hasn't been handled by KeyTable
    $('#dt_releasal_type').on('key.dt', function(e, datatable, key, cell, originalEvent){
        // If ENTER key is pressed
        if(key == 13){
            // Get highlighted row data
            var data = $('#dt_releasal_type').DataTable().row(cell.index().row).data();
            //console.log(data['reference_number']);
            $("#for_pickup").val(data['releasal_type_id']);
        }
    });
}

// stock withdrawals
function getStockWithdrawals(){
    
    var ClassName = "Sales";
    $("#dt_stock_withdrawal").DataTable().clear();
    $("#dt_stock_withdrawal").DataTable().destroy();

    var table_withdrawals =  $("#dt_stock_withdrawal").DataTable({
        "processing":true,
        "initComplete": function(settings, data){
            var table_withdrawals = $('#dt_stock_withdrawal').DataTable();
            $(table_withdrawals.row().node()).addClass('selected');
            table_withdrawals.cell(':eq(0)').focus();
        },
        pageLength : 5, paging: true, info: false, lengthChange: false, searching: false, ordering:false,
        lengthMenu: [[5, 20, 50, -1], [5, 10, 20, 50, 'All']],
        keys: {
            keys: [ 13 /* ENTER */, 38 /* UP */, 40 /* DOWN */ ]
        },
        "ajax":{
            type:"POST",
            url: baseUrl + ClassName + "&q=show",
            data:{
                input: {
                    param: "for_pick_up=1 AND withdrawal_status=1 ORDER BY date_added ASC"
                }
            }
        },
        "columns": [
            {
                "data": "reference_number"
            },
            {
                "data": "customer"
            },
            {
                "data": "total"
            },
            {
                "data": "date_added"
            }
        ]
    });

    // Handle event when cell gains focus
    $('#dt_stock_withdrawal').on('key-focus.dt', function(e, datatable, cell){
        // Select highlighted row
        $(table_withdrawals.row(cell.index().row).node()).addClass('selected');
    });

    // Handle event when cell looses focus
    $('#dt_stock_withdrawal').on('key-blur.dt', function(e, datatable, cell){
        // Deselect highlighted row
        $(table_withdrawals.row(cell.index().row).node()).removeClass('selected');
    });
        
    // Handle key event that hasn't been handled by KeyTable
    $('#dt_stock_withdrawal').on('key.dt', function(e, datatable, key, cell, originalEvent){
        // If ENTER key is pressed
        if(key == 13){
            // Get highlighted row data
            var data = $('#dt_stock_withdrawal').DataTable().row(cell.index().row).data();
            //console.log(data['reference_number']);
            $("#sales_num").val(data['reference_number']);
            $("#sales_type").val(data['sales_type']);
            $("#customer_id").val(data['customer_id']);
            $("#for_pickup").val(data['for_pick_up']);
            var total = data['total_nonformat']*1;
            $("#total_amount").val(total.toFixed(2));
        }
    });
}

function getItemWithdrawals(suggestReleasing = false){
    var ClassName = "Sales";
    var reference_number = $("#sales_num").val();
    $("#dt_item_withdrawal").DataTable().clear();
    $("#dt_item_withdrawal").DataTable().destroy();

    $("#dt_item_withdrawal").DataTable({
        pageLength : -1, paging: true, info: false, lengthChange: false, searching: false, ordering:false,
        lengthMenu: [[-1, 20, 50, -1], ["All", 10, 20, 50, 'All']],
        keys: {
            keys: [ 13 /* ENTER */, 38 /* UP */, 40 /* DOWN */ ]
        },
        "ajax":{
            type:"POST",
            url: baseUrl + ClassName + "&q=get_withdrawal_items_pos",
            data:{
                input: {
                    reference_number: reference_number
                }
            }
        },
        "columns": [
            {
                "data": "product"
            },
            {
                "data": "pos_qty"
            },
            {
                "data": "remaining_qty"
            },
            {
                "mRender": function(data,type,row){

                    if(suggestReleasing === true){
                        var rel_qty = row.remaining_qty;
                    }else{
                        var rel_qty = 0;
                    }
                    return "<input type='number' value="+rel_qty+" id='rel_qty"+row.sales_detail_id+"' onkeyup='qty_checker("+row.sales_detail_id+")' name='r_qty[]'>" +
                    "<input type='hidden' value="+row.remaining_qty+" id='rem_qty"+row.sales_detail_id+"'>" +
                    "<input type='hidden' value="+row.sales_detail_id+" name='r_id[]'>" +
                    "<input type='hidden' value="+row.product_id+" name='p_id[]'>";
                }
            }
        ]
    });
}


// sales summary
function getSalesSummary(){
    
    var ClassName = "Sales";
    var user_id = window.localStorage.getItem("pos_user_id")*1;

    $("#dt_sales_summary").DataTable().clear();
    $("#dt_sales_summary").DataTable().destroy();

    var table_sales =  $("#dt_sales_summary").DataTable({
        "processing":true,
        pageLength : 10, paging: true, info: false, lengthChange: false, searching: false, ordering:false,
        lengthMenu: [[10, 20, 50, -1], [10, 20, 50, 'All']],
        keys: {
            keys: [ 13 /* ENTER */, 38 /* UP */, 40 /* DOWN */ ]
        },
        "ajax":{
            type:"POST",
            url: baseUrl + ClassName + "&q=sales_summary",
            data:{
                input: {
                    user_id: user_id
                }
            }
        },
        "columns": [
            {
                "data": "product"
            },
            {
                "data": "pos_qty"
            },
            {
                "data": "pos_price"
            },
            {
                "data": "amount"
            }
        ],
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ? i.replace(/[\$,]/g, '')*1 : typeof i === 'number' ? i : 0;
            };
        
            // computing total amount
            var totalAmount = api.column( 3 ).data().reduce( function (a, b) {
                return intVal(a) + intVal(b);
            }, 0 );

            // computing total items
            var totalQty = api.column( 1 ).data().reduce( function (a, b) {
                return intVal(a) + intVal(b);
            }, 0 );
        
            // Update footer by showing the total with the reference of the column index
            $("#sales_summary_total_sales").html(totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }));
            $("#sales_summary_total_qty").html(totalQty.toLocaleString('en-US', { minimumFractionDigits: 2 }));

            $("#ss_total_sales_amount").val(totalAmount);
        }
    });
}
/** end fetching data */



/** toasts */

// primary 5060DC
// success 459213
// info 277BD9
// warning E58847
function alert_primary(description = "", icon = "bx bx-check", time = 120){
    NToast(
        "#5060DC blur",/* BACKGOUND COLOR 459213 277BD9*/
        "tr",/* TR - TOP RIGHT | TL - TOP LEFT | BR - BOTTOM RIGHT | BL - BOTTOM LEFT */
        description,/* NOTIFICATION DESCRIPTION */
        true,/* ICONS [FALSE,TRUE] */
        icon,/* COSTUM ICONS [fontawesome or others css icon] */
        false, /* show hide progress bar [FALSE,TRUE] */
        time,
    )
}

function alert_success(description = "", icon = "bx bx-check", time = 120){
    NToast(
        "#459213 blur",
        "tr",
        description,
        true,
        icon,
        false,
        time,
    )
}

function alert_info(description = "", icon = "bx bx-check", time = 120){
    NToast(
        "#277BD9 blur",
        "tr",
        description,
        true,
        icon,
        false,
        time,
    )
}

function alert_warning(description = "", icon = "bx bx-info-circle",  time = 200){
    NToast(
        "#E58847 blur",
        "tr",
        description,
        true,
        icon,
        false,
        time,
    )
}

function alert_processing(description = "", icon = "bx bx-loader-circle",  time = 120){
    NToast(
        "#5060DC blur",
        "tr",
        description,
        true,
        icon,
        false,
        time,
    )
}

/** end toasts */