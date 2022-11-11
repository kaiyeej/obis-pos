let { remote } = require("electron");
// console.log(process.versions.electron);

const { PosPrinter } = remote.require("electron-pos-printer");
// const {PosPrinter} = require("electron-pos-printer"); //dont work in production (??)

const path = require("path");

function printReceipt() {
  var reference_number = $("#sales_num").val();
  var cash_tendered = $("#cash_amount").val() * 1;
  var change = $("#change").val() * 1;
  change.toFixed(2);

  const printerName = "GP-58N Series";
  const widthPage = "100%";
  var dash_line = "=========================================================";
  var data_items = [];
  var payment_items = [];
  var font_12 = '12px;';
  var font_family = "Calibri, sans-serif";

  console.log(printerName+baseUrl);

  $.post(baseUrl+"Sales&q=posPrintReceipt",{
    input:{
      reference_number:reference_number,
      print_type:'sales',
    }
  },function(data,status){
    var json = JSON.parse(data);
    console.log(json.data.items);

    for (let itemIndex = 0; itemIndex < json.data.items.length; itemIndex++) {
      const itemsElem = json.data.items[itemIndex];
      
      var new_array = new Array();
      new_array[0] =  {type:'text',value:itemsElem.description,style: `text-align:left;`};
      if(itemsElem.quantity != ''){
        new_array[1] =  itemsElem.discount;
        new_array[2] =  {type:'text',value:itemsElem.amount,style: `text-align:left;`};
      }
      data_items.push(new_array);
    }

    for (let payIndex = 0; payIndex < json.data.payments.length; payIndex++) {
        const payElem = json.data.payments[payIndex];

        var new_array = new Array();
        new_array[0] =  {type:'text',value:payElem.payment_option,style: `text-align:left;`};
        new_array[1] =  {type:'text',value:payElem.remarks,style: `text-align:left;`};
        new_array[2] =  {type:'text',value:payElem.amount,style: `text-align:left;`};

        payment_items.push(new_array);
    }

    const options = {
        preview: false,
        width: "100%",
        margin: "0 0 0 -100",
        copies: 1,
        printerName: printerName,
        timeOutPerLine: 400,
        silent: true
    };

    const printContent = [{
        type: 'image',                           
        path: path.join(__dirname, 'assets/logo.png'),
        position: 'center',
        width: '200px',
        height: '200px',
      },{
        type: 'text',
        value: json.data.company_data,
        style: `text-align:center;`,
        css: {
            "font-weight": "bold",
            "font-size": font_12,
            "font-family":font_family
        }
    },
    {
        type: 'text',
        value: json.data.print_header,
        style: `text-align:center;`,
        css: {
            "font-weight": "bold",
            "font-size": font_12,
            "font-family":font_family
        }
    }, {
        type: 'text',
        value: "&nbsp;",
        style: `text-align:center;`,
        css: {
            "font-size": font_12,
            "font-family":font_family
        }
    },{
        type: 'text',
        value: "DELIVERY SLIP",
        style: `text-align:center;`,
        css: {
            "font-size": font_12,
            "font-weight": "bolder",
            "font-family":font_family
        }
    }, {
        type: 'text',
        value: "&nbsp;",
        style: `text-align:center;`,
        css: {
            "font-size": font_12,
            "font-family":font_family
        }
    }, {
        type: 'text',
        value: 'Order #:' + json.data.reference_number,
        css: {
            "font-weight": "bold",
            "font-size": font_12,
            "font-family":font_family
        }
    },  {
        type: 'text',
        value: 'Datetime:' + json.data.current_time,
        css: {
            "font-weight": "bold",
            "font-size": font_12,
            "font-family":font_family
        }
    }, {
      type: 'text',
      value: "&nbsp;",
      css: {
          "font-weight": "bold",
          "font-size": "10px",
          "font-family":font_family
      }
    }, {
        type: 'table',
        style: 'border: 1px solid #ddd;font-size:14px;padding:0;width:100%;font-family:'+font_family,
        tableHeader: [
            {type:'text',value:'Item',style:'width:50%;'},
            {type:'text',value:'Disc',style:'width:20%;'},
            {type:'text',value:'Subtotal',style:'width:20%;'},
            {type:'text',value:'',style:'width:10%;'}
        ],
        tableBody: data_items,
        tableFooter: [json.data.total_qty+' Item(s)','',''],
        tableHeaderStyle: 'text-align:left;font-size:14px;border-bottom:1px solid #000;',
        tableBodyStyle: 'text-align:left;font-size:14px;border: 0.5px solid #ddd;font-weight:bolder;',
        tableFooterStyle: 'text-align:left;font-size:14px;border-top:1px solid #000;',
    }, {
        type: 'text',
        value: dash_line,
        css: {
            "font-weight": "bold",
            "font-size": "10px",
            "font-family":font_family
        }
    }, {
      type: 'table',
      style: 'border: 1px solid #ddd;white-space:nowrap;font-size:14px;font-family:'+font_family,
      tableBody: [
        ['Total', {type:'text',value:json.data.total_amt,style: `text-align:right;`},"&nbsp;"],
          ['Cash', {type:'text',value:cash_tendered.toFixed(2),style: `text-align:right;`},''],
          ['Change', {type:'text',value:change,style: `text-align:right;`},'']
      ],
      tableBodyStyle: 'text-align:left !important;font-size:14px;border: 0.5px solid #ddd;font-weight:bolder;',
    }, {
        type: 'text',
        value: dash_line,
        css: {
            "font-weight": "bold",
            "font-size": "10px",
            "font-family":font_family
        }
    }, {
        type: 'table',
        style: 'border: 1px solid #ddd;white-space:nowrap;font-family:'+font_family,
        tableBody: payment_items,
        tableHeaderStyle: 'text-align:left;font-size:8px;',
        tableBodyStyle: 'text-align:left !important;font-size:14px;border: 0.5px solid #ddd;font-weight:bolder;',
    },{
        type: 'text',
        value: dash_line,
        css: {
            "font-weight": "bold",
            "font-size": "10px",
            "font-family":font_family
        }
    },{
        type: 'text',
        value: 'Customer: ' + json.data.customer,
        css: {
            "font-weight": "bold",
            "font-size": font_12,
            "font-family":font_family
        }
    }, {
        type: 'text',
        value: 'Cashier: ' + json.data.cashier,
        css: {
            "font-weight": "bold",
            "font-size": font_12,
            "font-family":font_family
        }
    }, {
        type: 'text',
        value:dash_line,
        css: {
            "font-weight": "bold",
            "font-size": "10px",
            "font-family":font_family
        }
    }, {
        type: 'text',
        value: "POS SUPPLIER",
        style: `text-align:center;`,
        css: {
            "font-size": "12px",
            "font-family":font_family
        }
    }, {
        type: 'text',
        value: "&nbsp;",
        style: `text-align:center;`,
        css: {
            "font-size": "12px",
            "font-family":font_family
        }
    },{
        type: 'qrCode',
        value: 'https://juancoder.com/',
        height: 60,
        width: 60,
        position: 'center',
    },{
        type: 'text',
        value: "JUANCODER IT SOLUTIONS",
        style: `text-align:center;`,
        css: {
            "font-size": "12px",
            "font-family":font_family
        }
    },{
        type: 'text',
        value: "Bacolod City, Philippines",
        style: `text-align:center;`,
        css: {
            "font-size": "12px",
            "font-family":font_family
        }
    }, {
        type: 'text',
        value: "https://juancoder.com/",
        style: `text-align:center;`,
        css: {
            "font-size": "12px",
            "font-family":font_family
        }
    },{
        type: 'text',
        value: "info@juancoder.com",
        style: `text-align:center;`,
        css: {
            "font-size": "12px",
            "font-family":font_family
        }
    },
    {
        type: 'text',
        value:"&nbsp;",
        style: `text-align:center;`,
        css: {
            "font-weight": "bold",
            "font-size": font_12,
            "font-family":font_family
        }
    },
    {
        type: 'text',
        value: json.data.print_footer,
        style: `text-align:center;`,
        css: {
            "font-weight": "bold",
            "font-size": font_12,
            "font-family":font_family
        }
    }]

        PosPrinter.print(printContent, options)
        .then(() => {})
        .catch((error) => {
        console.error(error);
        });

  }); 
}

function printWithdrawal(){

  var reference_number = $("#sales_num").val();

  const printerName = "GP-58N Series";
  const widthPage = "100%";
  var dash_line = "=========================================================";
  var data_items = [];
  var font_12 = '12px;';

  console.log(printerName+baseUrl);

  $.post(baseUrl+"Sales&q=posPrintReceipt",{
    input:{
      reference_number:reference_number,
      print_type:'withdrawal',
    }
  },function(data,status){
    var json = JSON.parse(data);
    console.log(json.data.items);

    for (let itemIndex = 0; itemIndex < json.data.items.length; itemIndex++) {
      const itemsElem = json.data.items[itemIndex];
      
      var new_array = new Array();
      new_array[0] =  {type:'text',value:itemsElem.qty * 1,style: `text-align:left;`};
      new_array[1] =  {type:'text',value:itemsElem.product,style: `text-align:left;`};
      data_items.push(new_array);
    }

    const options = {
        preview: false,
        width: widthPage,
        margin: "0 0 0 0",
        copies: 1,
        printerName: printerName,
        timeOutPerLine: 400,
        silent: true,
    };

    const printContent = [{
        type: 'image',                           
        path: path.join(__dirname, 'assets/logo.png'),
        position: 'center',
        width: '200px',
        height: '200px',
      },{
        type: 'text',
        value: json.data.company_data,
        style: `text-align:center;`,
        css: {
            "font-weight": "bold",
            "font-size": font_12
        }
    },
    {
        type: 'text',
        value: json.data.print_header,
        style: `text-align:center;`,
        css: {
            "font-weight": "bold",
            "font-size": font_12
        }
    }, {
        type: 'text',
        value: "&nbsp;",
        style: `text-align:center;`,
        css: {
            "font-size": font_12
        }
    },{
        type: 'text',
        value: "WITHDRAWAL SLIP",
        style: `text-align:center;`,
        css: {
            "font-size": font_12,
            "font-weight": "bolder"
        }
    }, {
        type: 'text',
        value: "&nbsp;",
        style: `text-align:center;`,
        css: {
            "font-size": font_12
        }
    },{
        type: 'text',
        value: 'Withdraw #:' + json.data.reference_number,
        css: {
            "font-weight": "bold",
            "font-size": "12px"
        }
    },{
        type: 'text',
        value: 'Datetime:' + json.data.withdrawal_date,
        css: {
            "font-weight": "bold",
            "font-size": "12px"
        }
    }, {
      type: 'text',
      value: "&nbsp;",
      css: {
          "font-weight": "bold",
          "font-size": "10px"
      }
    }, {
        type: 'table',
        style: 'border: 1px solid #ddd;font-size:12px;',
        tableHeader: ['Qty','Item'],
        tableBody: data_items,
        tableHeaderStyle: 'text-align:left;font-size:12px;',
        tableBodyStyle: 'text-align:left;font-size:12px;border: 0.5px solid #ddd;font-weight:bolder;',
        tableFooterStyle: 'text-align:left;font-size:12px;',
    },{
        type: 'text',
        value: "&nbsp;",
        css: {
            "font-weight": "bold",
            "font-size": "10px"
        }
    },{
        type: 'table',
        style: 'border: 1px solid #ddd;font-size:12px;',
        tableHeader: [],
        tableBody: [
            [{type:'text',value:'Checked and certified by: ',style:'text-align:left'},''],
            ["&nbsp;","&nbsp;"],
            [{type:'text',value:'Received the above Merchandize in good order and condition',style:'text-align:left'},''],
            ["&nbsp;","&nbsp;"],
        ],
        tableHeaderStyle: 'text-align:left;font-size:12px;',
        tableBodyStyle: 'text-align:left;font-size:12px;border: 0.5px solid #ddd;font-weight:bolder;',
        tableFooterStyle: 'text-align:left;font-size:12px;',
    }, {
        type: 'text',
        value: dash_line,
        css: {
            "font-weight": "bold",
            "font-size": "10px"
        }
    },{
        type: 'text',
        value: 'Customer: ' + json.data.customer,
        css: {
            "font-weight": "bold",
            "font-size": font_12
        }
    }, {
        type: 'text',
        value: 'Cashier: ' + json.data.cashier,
        css: {
            "font-weight": "bold",
            "font-size": font_12
        }
    }, {
        type: 'text',
        value:dash_line,
        css: {
            "font-weight": "bold",
            "font-size": "10px"
        }
    }, {
        type: 'text',
        value: "POS SUPPLIER",
        style: `text-align:center;`,
        css: {
            "font-size": "12px"
        }
    },{
        type: 'text',
        value:"&nbsp;",
        css: {
            "font-weight": "bold",
            "font-size": "10px"
        }
    },{
        type: 'qrCode',
        value: 'https://juancoder.com/',
        height: 60,
        width: 60,
        position: 'center',
    },{
        type: 'text',
        value: "JUANCODER IT SOLUTIONS",
        style: `text-align:center;`,
        css: {
            "font-size": "12px"
        }
    },{
        type: 'text',
        value: "Bacolod City, Philippines",
        style: `text-align:center;`,
        css: {
            "font-size": "12px"
        }
    }, {
        type: 'text',
        value: "https://juancoder.com/",
        style: `text-align:center;`,
        css: {
            "font-size": "12px"
        }
    },{
        type: 'text',
        value: "info@juancoder.com",
        style: `text-align:center;`,
        css: {
            "font-size": "12px"
        }
    },
    {
        type: 'text',
        value: "&nbsp;",
        style: `text-align:center;`,
        css: {
            "font-weight": "bold",
            "font-size": font_12
        }
    },
    {
        type: 'text',
        value: json.data.print_footer,
        style: `text-align:center;`,
        css: {
            "font-weight": "bold",
            "font-size": font_12
        }
    }]

        PosPrinter.print(printContent, options)
        .then(() => {})
        .catch((error) => {
        console.error(error);
        });

  }); 

}