document.onkeydown = function(e){
    if(e.ctrlKey || e.altKey){
        e.preventDefault();
    }

    var keycode;
    if (window.event){
        keycode = window.event.keyCode;
    }else if (e){
        keycode = e.which;
    }

    // disable function f1-f12
    if(keycode == 112 || keycode == 113 || keycode == 114 || keycode == 115 || keycode == 116 || keycode == 117 || keycode == 118 || keycode == 119 || keycode == 120 || keycode == 121 || keycode == 122 || keycode == 123 || keycode == 9){
        e.preventDefault();
    }
    
}

document.onkeyup = function(e){
    e.preventDefault();

    var action = $("#action").val();
    var totalAmount = $("#totalPaymentAmount").val();
    //var totalQty = $("#totalQty").html()*1;

    var keycode;
    if (window.event){
        keycode = window.event.keyCode;
    }else if (e){
        keycode = e.which;
    }

    // disable function f1-f12
    if(keycode == 112 || keycode == 113 || keycode == 114 || keycode == 115 || keycode == 116 || keycode == 117 || keycode == 118 || keycode == 119 || keycode == 120 || keycode == 121 || keycode == 122 || keycode == 123 || keycode == 9){
        e.preventDefault();
    }

    if(e.ctrlKey && keycode == 13){                                 // ctrl enter; payment
        showModalPayment();
    }else if(keycode == 13 && action == "p"){                       // enter; proceed for payment
        finishSales();
    }else if(keycode == 13 && action == "eq"){                      // enter; show edit qty
        key_enter_edit();
    }else if(keycode == 13 && action == "eq2"){                     // enter; proceed for edit
        editQty();
    }else if(keycode == 13 && action == "ri"){                      // enter; show remove
        key_enter_remove();
    }else if(keycode == 13 && action == "ri2"){                     // enter; proceed for remove
        removeItem();
    }else if(keycode == 13 && action == "ld2"){                     // enter; proceed for edit disc
        proceed_line_discount();
    }else if(keycode == 13 && action == "disc"){                    // enter; proceed for edit disc
        proceed_discount();
    }else if(keycode == 13 && action == "so"){                      // enter; proceed save order
        save_order();
    }else if(keycode == 13 && action == "cs"){                      // enter; proceed cancel sales
        cancel_sales();
    }else if(keycode == 13 && action == "ro"){                      // enter; proceed recall order
        recall_order();
    }else if(keycode == 13 && (action == "N")){                     // enter; change customer
        change_sales_type();
    }else if(keycode == 13 && action == "rp"){                      // enter; remove other payments
        remove_other_payments();
    }else if(keycode == 13 && action == "ss"){                      // enter; summary sales
        confirm_review_sales_summary();
    }else if(keycode == 13 && action == "sb"){                      // enter; starting balance
        addStartingBalance();
    }else if(keycode == 13 && action == "wp"){                      // enter; withdrawal payment
        finishSales(true);
    }else if(keycode == 13 && action == "q"){                      // enter; print queuing
        print_queuing();
    }else if(keycode == 13 && (action == "")){                      // enter
        key_enter();
    }else if(keycode == 113){                                       // f2 edit qty
        key_edit();
    }else if(keycode == 114 || keycode == 46){                      // f3 remove item
        key_remove();
    }else if(keycode == 115){                                       // f4 cancel order
        key_cancel_order();
    }else if(keycode == 116){                                       // f5 reload items
        reload_items();
    }else if(keycode == 119){                                       // f8 discounts
        key_discounts();
    }else if(keycode == 120){                                       // f9 save order
        key_save_order();
    }else if(keycode == 121){                                       // f10 recall
        key_recall();
    }else if(keycode == 123){                                       // f12 payment options
        key_payment_options();
    }else if(keycode == 9){                                         // tab
        var dt = "dt_products";
        if(action == ""){
            dt = "dt_products";
        }else if(action == "w"){
            dt = "dt_stock_withdrawal";
        }else{
            dt = "dt_products";
        }
        key_tab(dt);
    }else if(keycode == 27 && action == "p"){                       // esc + payment
        closeModalPayment();
    }else if(keycode == 27 && (action == "eq" || action == "eq2")){ // esc + edit
        closeModalEditQty();
    }else if(keycode == 27 && (action == "ld" || action == "ld2")){ // esc + line discount
        closeModalLineDiscount();
    }else if(keycode == 27 && (action == "disc")){                  // esc + discount
        closeModalDiscount();
    }else if(keycode == 27 && (action == "so" || action == "cs" || action == "ri2" || action == "st" || action == "C" || action == "rp")){  // esc + cancel confirm
        closeModalConfirm();
    }else if(keycode == 27 && (action == "ro")){                    // esc + recall
        closeModalRecall();
    }else if(e.ctrlKey && keycode == 67 ){                          // ctrl + c; set as cash
        closeModalHotkeys();
        key_change_to_cash();
    }else if(e.ctrlKey && keycode == 68 ){                          // ctrl + d; remove payment option
        key_remove_payment();
    }else if(e.ctrlKey && keycode == 72 ){                          // ctrl + h; set as charge
        closeModalHotkeys();
        key_change_to_charge();
    }else if(e.ctrlKey && keycode == 80 ){                          // ctrl + p; reprint
        alert("reprint");
    }else if(e.ctrlKey && keycode == 83 ){                          // ctrl + s; sales summary
        key_sales_summary();
    }

}