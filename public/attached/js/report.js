// JavaScript Document
/*DEVELOPED BY JORGE SALDAÑA*/
// ___________________________
// _____****_________****_____
// ____******_______******____
// __***********_***********__
// __***********************__
// __*****_____________*****__
// ___****_____________****___
// ___***____*******____***___
// ___***____**___***___***___
// ____**____*******____**____
// ____**____**_________**____
// ____*_____**__________*____
// ___________________________
/*####MOUSTACHED##PILOT####*/


class class_report
{
  filter(btn){
    var from = document.getElementById('reportFromDatefilter').value;
    var to = document.getElementById('reportToDatefilter').value;
    var type = document.getElementById('reportType').value;
    if (cls_general.is_empty_var(from) === 0 || cls_general.is_empty_var(to) === 0) {
      cls_general.shot_toast_bs('Debe llenar las fechas.', { bg: 'text-bg-warning' })
    }
    // cls_general.disable_submit(btn);

    var url = '/report/show';
    var method = 'POST';
    var body = JSON.stringify({ a: from, b: to, c: type });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        switch (type) {
          case '0':
            cls_report.render_productinput(from, to, obj.data.productinput);
            break;
          case '1':
            cls_report.render_charge(from, to, obj.data.charge, obj.data.chargepayment, obj.data.creditnote);
            break;
          case '2':

            break;
          case '3':

            break;
          case '4':

            break;
          case '5':

            break;
       
          default:
            break;
        }
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
  render_productinput(from,to,raw_productinput){
    var total_nontaxable = 0;
    var total_taxable = 0;
    var total_tax = 0;
    raw_productinput.map((productinput) => {
      total_nontaxable  += productinput.tx_productinput_nontaxable;
      total_taxable     += productinput.tx_productinput_taxable;
      total_tax         += productinput.tx_productinput_tax;
    })

    document.getElementById('container_report').innerHTML = `
      <div class="row h_100">
        <div class="col-sm-12 text-center">
          <h3>Reporte de Compras</h3>
          <strong>Desde:</strong> ${from}
          &nbsp;
          <strong>Hasta:</strong> ${to}			
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 text-center">
          <h5>TOTALES DE COMPRAS</h5>
        </div>
        <div class="col-sm-12 text-center">
          <strong>Base No Imponible</strong><br><strong>B/</strong> ${cls_general.val_price(total_nontaxable,2,1,1)}
        </div>
        <div class="col-sm-12 text-center">
          <strong>Base Imponible</strong><br><strong>B/</strong> ${cls_general.val_price(total_taxable, 2, 1, 1)}
        </div>
        <div class="col-sm-12 text-center">
          <strong>Impuesto</strong><br><strong>B/</strong> ${cls_general.val_price(total_tax, 2, 1, 1)}
        </div>
        <div class="col-sm-12 text-center">
          <strong>Total</strong><br><strong>B/</strong> ${cls_general.val_price((total_nontaxable + total_taxable + total_tax), 2, 1, 1)}
        </div>
      </div>
    `;
  }
  render_charge(from, to, raw_charge, raw_chargepayment, raw_creditnote) {
    var total_nontaxable = 0;
    var total_taxable = 0;
    var total_tax = 0;
    raw_charge.map((charge) => {
      total_nontaxable += charge.tx_charge_nontaxable;
      total_taxable += charge.tx_charge_taxable;
      total_tax += charge.tx_charge_tax;
    })

    var cn_nontaxable = 0;
    var cn_taxable = 0;
    var cn_tax = 0;
    raw_creditnote.map((creditnote) => {
      cn_nontaxable += creditnote.tx_creditnote_nontaxable;
      cn_taxable += creditnote.tx_creditnote_taxable;
      cn_tax += creditnote.tx_creditnote_tax;
    })

    var raw_paymenttotal = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0 };
    raw_chargepayment.map((payment) => {
      raw_paymenttotal[payment.payment_ai_paymentmethod_id] += payment.tx_payment_amount;
    })
    console.log(raw_paymenttotal);
    document.getElementById('container_report').innerHTML = `
      <div class="row h_100">
        <div class="col-sm-12 text-center">
          <h3>Reporte de Ventas</h3>
          <strong>Desde:</strong> ${from}
          &nbsp;
          <strong>Hasta:</strong> ${to}			
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 text-center">
          <h5>TOTALES DE VENTA</h5>
        </div>
        <div class="col-sm-12 text-center">
          <strong>Base No Imponible</strong><br><strong>B/</strong> ${cls_general.val_price(total_nontaxable, 2, 1, 1)}
        </div>
        <div class="col-sm-12 text-center">
          <strong>Base Imponible</strong><br><strong>B/</strong> ${cls_general.val_price(total_taxable, 2, 1, 1)}
        </div>
        <div class="col-sm-12 text-center">
          <strong>Impuesto</strong><br><strong>B/</strong> ${cls_general.val_price(total_tax, 2, 1, 1)}
        </div>
        <div class="col-sm-12 text-center">
          <strong>Total</strong><br><strong>B/</strong> ${cls_general.val_price((total_nontaxable + total_taxable + total_tax), 2, 1, 1)}
        </div>
        <div class="col-sm-12 text-center">
          <h5>TOTALES NOTA DE CREDITO</h5>
        </div>
        <div class="col-sm-12 text-center">
          <strong>Base No Imponible</strong><br><strong>B/</strong> ${cls_general.val_price(cn_nontaxable, 2, 1, 1)}
        </div>
        <div class="col-sm-12 text-center">
          <strong>Base Imponible</strong><br><strong>B/</strong> ${cls_general.val_price(cn_taxable, 2, 1, 1)}
        </div>
        <div class="col-sm-12 text-center">
          <strong>Devolucion de Impuestos</strong><br><strong>B/</strong> ${cls_general.val_price(cn_tax, 2, 1, 1)}
        </div>
        <div class="col-sm-12 text-center">
          <strong>Total</strong><br><strong>B/</strong> ${cls_general.val_price((cn_nontaxable + cn_taxable + cn_tax), 2, 1, 1)}
        </div>
      </div>
      <div class="row">
        <div class="col-sm-3">
          <strong>Efectivo</strong><br>
          B/ ${cls_general.val_price(raw_paymenttotal[1], 2, 1, 1) }
        </div>
        <div class="col-sm-3">
          <strong>Cheque</strong><br>
          B/ ${cls_general.val_price(raw_paymenttotal[2], 2, 1, 1) }
        </div>
        <div class="col-sm-3">
          <strong>Tarjeta Debito</strong><br>
          B/ ${cls_general.val_price(raw_paymenttotal[3], 2, 1, 1) }
        </div>
        <div class="col-sm-3">
          <strong>Tarjeta Credito</strong><br>
          B/ ${cls_general.val_price(raw_paymenttotal[4], 2, 1, 1) }
        </div>
        <div class="col-sm-3">
          <strong>Yappi</strong><br>
          B/ ${cls_general.val_price(raw_paymenttotal[5], 2, 1, 1) }
        </div>
        <div class="col-sm-3">
          <strong>Nequi</strong><br>
          B/ ${cls_general.val_price(raw_paymenttotal[6], 2, 1, 1) }
        </div>
        <div class="col-sm-3">
          <strong>Otro</strong><br>
          B/ ${cls_general.val_price(raw_paymenttotal[7], 2, 1, 1) }
        </div>
        <div class="col-sm-3">
          <strong>Cupon</strong><br>
          B/ ${cls_general.val_price(raw_paymenttotal[8], 2, 1, 1) }
        </div>
      </div>

    `;
  }


}