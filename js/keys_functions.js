/* for key press functions */

function key_enter(){
    var table_products = $('#dt_products').DataTable();
    addItem();
    table_products.cell.blur();
    $("#product_input").focus();
    $("#product_input").val("");
    $("#product_id").val("");
}

function key_tab(dt = "dt_products"){
    var table_products = $('#' + dt).DataTable();
    $(table_products.row( {search:'applied'} ).node()).addClass('selected');
    table_products.cell(':eq(0)', {search: 'applied'} ).focus();
}

function key_hotkeys(){
    $("#modalHotkeys").modal('show');
    $("#action").val("hk");
}

function key_edit(){

    var totalQty = $("#totalQty").html()*1;

    if(totalQty > 0){
        $("#action").val("eq");
        var table_products = $('#dt_products').DataTable();
        var table_details = $('#dt_details').DataTable();
        table_products.cell.blur();
        
        $(table_details.row().node()).addClass('selected');
        table_details.cell(':eq(0)').focus();

        alert_warning("Select item and press enter to edit.");
    }else{
        $("#product_input").focus();
    }
    
}

function key_enter_edit(){
    var sales_detail_id = $("#sales_detail_id").val();
    if(sales_detail_id > 0){
        $("#modalEditQty").modal({ backdrop : false, keyboard: false });
        $("#modalEditQty").modal('show');
    }
    $("#action").val("eq2");
}

function key_remove(){

    var totalQty = $("#totalQty").html()*1;

    if(totalQty > 0){
        $("#action").val("ri");
        var table_products = $('#dt_products').DataTable();
        var table_details = $('#dt_details').DataTable();
        table_products.cell.blur();
        
        $(table_details.row().node()).addClass('selected');
        table_details.cell(':eq(0)').focus();

        alert_warning("Select item and press enter to delete.");
    }else{
        $("#product_input").focus();
    }
}

function key_enter_remove(){
   // showModalConfirmAction("ri2", "remove item");
   removeItem();
}

function key_line_discount(){

    var totalQty = $("#totalQty").html()*1;

    if(totalQty > 0){
        $("#action").val("ld");
        var table_products = $('#dt_products').DataTable();
        var table_details = $('#dt_details').DataTable();
        table_products.cell.blur();

        $(table_details.row().node()).addClass('selected');
        table_details.cell(':eq(0)').focus();

        alert_warning("Select item and press enter to apply discount");
    }else{
        $("#product_input").focus();
    }
    
}

function key_enter_line_discount(){
    var sales_detail_id = $("#sales_detail_id2").val();

    getLineDiscountTypes();
    //alert_warning("Select Discount type.");

    var table_products = $('#dt_products').DataTable();
    var table_details = $('#dt_details').DataTable();

    table_products.cell.blur();
    table_details.cell.blur();

    $('#carouselLineDiscount').carousel(0);

    $("#modalEditDiscount").modal({ backdrop : false, keyboard: false });
    $("#modalEditDiscount").modal('show');

    $("#action").val("ld2");
}

function key_discounts(){

    var totalAmount = $("#totalPaymentAmount").val();
    var totalQty = $("#totalQty").html()*1;
    if(totalQty > 0 && totalAmount > 0){
        $("#action").val("disc");

        getDiscounts();
        //alert_warning("Select discount.");

        var table_products = $('#dt_products').DataTable();
        var table_details = $('#dt_details').DataTable();
        
        table_products.cell.blur();
        table_details.cell.blur();

        
        $('#carouselDiscounts').carousel(0);
        
        $("#modalDiscounts").modal({ backdrop : false, keyboard: false });
        $("#modalDiscounts").modal('show');   
    }
    
}

function key_cancel_order(){
    var totalQty = $("#totalQty").html()*1;

    if(totalQty > 0){
        cancel_sales();
    }else{
        $("#product_input").focus();
    }
    
}

function key_save_order(){
    var totalQty = $("#totalQty").html()*1;

    if(totalQty > 0){
        showModalConfirmAction2("so", "Are you sure to save order?");
    }else{
        $("#product_input").focus();
    }
}

function key_recall(){

    var totalQty = $("#totalQty").html()*1;

    if(totalQty > 0){
        alert_warning("Save current order to continue recalling.", "bx bx-error", 200);
    }else{

        getPendingSales();

        //alert_warning("Select entry for recall.");

        var table_products = $('#dt_products').DataTable();
        var table_details = $('#dt_details').DataTable();
        
        table_products.cell.blur();
        table_details.cell.blur();

        $("#action").val("ro");

        $("#modalRecall").modal({ backdrop : false, keyboard: false });
        $("#modalRecall").modal('show');
    }
    
}

function key_payment_options(){

    var totalAmount = $("#totalPaymentAmount").val();
    var totalQty = $("#totalQty").html()*1;
    if(totalQty > 0 && totalAmount > 0){
        generatePaymentNum();
        getPaymentOptions();
        //alert_warning("Select payment option.");

        var table_products = $('#dt_products').DataTable();
        var table_details = $('#dt_details').DataTable();
        
        table_products.cell.blur();
        table_details.cell.blur();

        $("#action").val("po");
        $('#carouselOtherPayments').carousel(0);
        
        $("#modalPaymentOption").modal({ backdrop : false, keyboard: false });
        $("#modalPaymentOption").modal('show');   
    }
}

function key_change_to_cash(){
    showModalConfirmAction("C", "change payment type to cash");
}

function key_change_to_charge(){
    $("#action").val("H");
    getCustomers();
    //alert_warning("Select customer.");

    var table_products = $('#dt_products').DataTable();
    var table_details = $('#dt_details').DataTable();
    
    table_products.cell.blur();
    table_details.cell.blur();
    
    $("#modalCustomers").modal({ backdrop : false, keyboard: false });
    $("#modalCustomers").modal('show');   
}

function key_remove_payment(){
    var totalQty = $("#totalQty").html()*1;
    var totalOtherPayment = $("#totalOtherPayment").val()*1;
    if(totalQty > 0 && totalOtherPayment > 0){
        showModalConfirmAction("rp", "remove other payments");
    }
    
}

function key_change_customer_name(){
    closeModalHotkeys();

    $("#action").val("N");
    getCustomers();
    alert_warning("Select customer.");

    var table_products = $('#dt_products').DataTable();
    var table_details = $('#dt_details').DataTable();
    
    table_products.cell.blur();
    table_details.cell.blur();
    
    $("#modalCustomers").modal({ backdrop : false, keyboard: false });
    $("#modalCustomers").modal('show');   
}

function key_stock_withdrawal(){

    var totalQty = $("#totalQty").html()*1;

    if(totalQty > 0){
        alert_warning("Save current order to continue.", "bx bx-error", 200);
    }else{

        getStockWithdrawals();

        alert_warning("Select entry for withdrawal.");

        var table_products = $('#dt_products').DataTable();
        var table_details = $('#dt_details').DataTable();
        
        table_products.cell.blur();
        table_details.cell.blur();

        $("#action").val("w");

        $("#modalWithdrawal").modal({ backdrop : false, keyboard: false });
        $("#modalWithdrawal").modal('show');
    }
    
}


function key_item_withdrawals(suggestReleasing = false){

    var sales_type = $("#sales_type").val();

    var table_products = $('#dt_products').DataTable();
    var table_details = $('#dt_details').DataTable();
    var table_stock_withdrawal = $('#dt_stock_withdrawal').DataTable();
    
    table_products.cell.blur();
    table_details.cell.blur();
    table_stock_withdrawal.cell.blur();
    
    if(sales_type == "H"){
        
        //closeModalStockWithdrawal();
        $("#modalWithdrawal").modal('hide');

        $("#action").val("wp");

        getTotalOtherPayments(true);
        $('#carouselPayment').carousel(1);

        $("#modalPayment").modal({ backdrop : false, keyboard: false });
        $("#modalPayment").modal('show');
    }else{
        getItemWithdrawals(suggestReleasing);

        alert_warning("Fill-out released items.");

        closeModalStockWithdrawal();

        $("#action").val("iw");

        $("#modalItemWithrawal").modal({ backdrop : false, keyboard: false });
        $("#modalItemWithrawal").modal('show');
    }
    
}

function key_sales_summary(){

    var totalQty = $("#totalQty").html()*1;

    if(totalQty > 0){
        alert_warning("Save current order to continue.", "bx bx-error", 200);
    }else{

        $('#carouselSalesSummary').carousel(0);

        getSalesSummary();

        var table_products = $('#dt_products').DataTable();
        var table_details = $('#dt_details').DataTable();
        
        table_products.cell.blur();
        table_details.cell.blur();

        $("#action").val("ss");

        $("#modalSalesSummary").modal({ backdrop : false, keyboard: false });
        $("#modalSalesSummary").modal('show');
    }
    
}

function key_add_new_customer(){
    closeModalHotkeys();
    $("#action").val("ac");
    $("#modalAddCustomer").modal({ backdrop : false, keyboard: false });
    $("#modalAddCustomer").modal('show');
}

/** end key press */