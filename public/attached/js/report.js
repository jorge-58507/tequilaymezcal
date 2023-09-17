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
      cls_general.shot_toast_bs('Debe llenar los campos fechas.', { bg: 'text-bg-warning' }); return false;
    }
    if (type === '2') {
      let fechaFrom = new Date(cls_general.date_converter('dmy','ymd',from)+'00:00:00')
      let fechaTo = new Date(cls_general.date_converter('dmy', 'ymd', to) + '23:59:00')
      let yearDiff = fechaTo.getFullYear() - fechaFrom.getFullYear();
      let MonthDiff = fechaTo.getMonth() - fechaFrom.getMonth();
      if (yearDiff > 0) {
        cls_general.shot_toast_bs('El rango de fecha debe ser maximo 30 dias.', { bg: 'text-bg-warning' }); return false;
      }
      if (MonthDiff > 1) {
        cls_general.shot_toast_bs('El rango de fecha debe ser maximo 30 dias.', { bg: 'text-bg-warning' }); return false;
      }
    }
    cls_general.disable_submit(btn);

    document.getElementById('container_report').innerHTML = `
      <div class="row text-center" style="padding-top: 150px;">
        <div class="col-sm-12">
          <img src="attached/image/loading.gif" width="175" height="175">
        </div>
      </div>
    `;
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
            cls_report.render_productinput_detail(from, to, obj.data.productinput);
            break;
          case '3':
            cls_report.render_charge_detail(from, to, obj.data.charge, obj.data.chargepayment, obj.data.creditnote);
            break;
          case '4':
            cls_report.render_creditnote(from, to, obj.data.creditnote);
            break;
          case '5':
            cls_report.render_productinput_provider(from, to, obj.data.productinput);
            break;
          case '6':
            cls_report.render_depletion(from, to, obj.data.depletion);
            break;
          case '7':
            cls_report.render_anulled(from, to, obj.data.annulled);
            break;
          case '8':
            cls_report.render_commanddata(from, to, obj.data.commanddata);
            break;
          case '9':
            cls_report.render_productinput_product(from, to, obj.data.dataproductinput);
            break;
          default:
            cls_general.shot_toast_bs('Opción incorrecta.',{bg: 'text-bg-danger'});
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
    var total_change = 0;
    raw_charge.map((charge) => {
      total_nontaxable += charge.tx_charge_nontaxable;
      total_taxable += charge.tx_charge_taxable;
      total_tax += charge.tx_charge_tax;
      total_change += charge.tx_charge_change;
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
          B/ ${cls_general.val_price(raw_paymenttotal[1]-total_change, 2, 1, 1) }
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
  render_productinput_detail(from, to, raw_productinput) {
    var total_nontaxable = 0;
    var total_taxable = 0;
    var total_tax = 0;
    var list = `
    <h5>Listado de Compras, Desde: ${from} Hasta: ${to}</h5>
      <table class="table table-bordered table-condensed table-striped table-print">
        <thead style="border: solid">
          <tr>
            <th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">Fecha</th>
            <th class="col-xs-5 col-sm-5 col-md-5 col-lg-5">Proveedor</th>
            <th class="col-xs-2 col-sm-2 col-md-2 col-lg-2">RUC</th>
            <th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">DV</th>
            <th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">#Num.</th>
            <th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">Imp.</th>
            <th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">Total</th>
          </tr>
        </thead>
        <tbody>
    `;
    raw_productinput.map((productinput) => {
      list += `
        <tr>
          <td>${cls_general.datetime_converter(productinput.tx_productinput_date)}</td>
          <td>${productinput.tx_provider_value}</td>
          <td>${productinput.tx_provider_ruc}</td>
          <td>${productinput.tx_provider_dv}</td>
          <td>${productinput.tx_productinput_number}</td>
          <td>${productinput.tx_productinput_tax}</td>
          <td>${cls_general.val_price(productinput.tx_productinput_total,2,1,1)}</td>
        </tr>
      `;
      total_nontaxable += productinput.tx_productinput_nontaxable;
      total_taxable += productinput.tx_productinput_taxable;
      total_tax += productinput.tx_productinput_tax;
    })
    list += `
        </tbody>
        <tfoot style="border:solid;">
          <tr>
            <td colspan="2" style="text-align: right;"><strong>Subtotal: </strong> B/ ${cls_general.val_price((total_nontaxable + total_taxable),2,1,1)}</td>
            <td colspan="2" style="text-align: right;"><strong>Imp.: </strong> B/ ${cls_general.val_price(total_tax)}</td>
            <td colspan="2" style="text-align: right;"><strong>Total: </strong> B/ ${cls_general.val_price((total_nontaxable + total_taxable + total_tax), 2, 1, 1)}</td>
          </tr>
        </tfoot>
      </table>
    `;
    document.getElementById('container_report').innerHTML = list;
  }
  render_charge_detail(from, to, raw_charge, raw_chargepayment, raw_creditnote) {
    var total_nontaxable = 0;
    var total_taxable = 0;
    var total_tax = 0;

    var total_cn_nontaxable = 0;
    var total_cn_taxable = 0;
    var total_cn_tax = 0;

    var list = `
    <h5>Listado de Ventas, Desde: ${from} Hasta: ${to}</h5>
      <table class="table table-bordered table-condensed table-striped table-print">
        <thead style="border: solid">
          <tr class="text-center">
            <th class="col-sm-1">Fecha</th>
            <th class="col-sm-1">#Num</th>
            <th class="col-sm-5">Cliente</th>
            <th class="col-sm-3">RUC</th>
            <th class="col-sm-1">Imp.</th>
            <th class="col-sm-1">Total</th>
          </tr>
        </thead>
        <tbody>
    `;
    raw_charge.map((charge) => {
      list += `
        <tr>
          <td>${cls_general.datetime_converter(charge.created_at)}</td>
          <td>${charge.tx_charge_number}</td>
          <td>${charge.tx_client_name}</td>
          <td>${charge.tx_client_cif} DV:${charge.tx_client_dv}</td>
          <td>${cls_general.val_price(charge.tx_charge_tax, 2, 1, 1) }</td>
          <td>${cls_general.val_price(charge.tx_charge_total, 2, 1, 1)}</td>
        </tr>
      `;
      total_nontaxable += charge.tx_charge_nontaxable;
      total_taxable += charge.tx_charge_taxable;
      total_tax += charge.tx_charge_tax;
    })
    list += `
      </tbody>
      <tfoot style="border:solid;">
        <tr>
          <td colspan="2" style="text-align: right;"><strong>Subtotal: </strong> B/ ${cls_general.val_price((total_nontaxable + total_taxable), 2, 1, 1)}</td>
          <td colspan="2" style="text-align: right;"><strong>Imp.: </strong> B/ ${cls_general.val_price(total_tax, 2, 1, 1) }</td>
          <td colspan="2" style="text-align: right;"><strong>Total: </strong> B/ ${cls_general.val_price((total_nontaxable + total_taxable + total_tax), 2, 1, 1)}</td>
        </tr>
      </tfoot>
    </table>
    `;

    list += `
      <h5>Listado de Notas de Cr&eacute;dito, Desde: ${from} Hasta: ${to}</h5>
      <table class="table table-bordered table-condensed table-striped table-print">
        <thead style="border: solid">
          <tr class="text-center">
            <th class="col-sm-1">Fecha</th>
            <th class="col-sm-1">#Num</th>
            <th class="col-sm-5">Cliente</th>
            <th class="col-sm-3">RUC</th>
            <th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">Imp.</th>
            <th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">Total</th>
          </tr>
        </thead>
        <tbody>
    `;
    raw_creditnote.map((creditnote) => {
      list += `
        <tr>
          <td>${cls_general.datetime_converter(creditnote.created_at)}</td>
          <td>${creditnote.tx_creditnote_number}</td>
          <td>${creditnote.tx_client_name}</td>
          <td>${creditnote.tx_client_cif} DV:${creditnote.tx_client_dv}</td>
          <td>${cls_general.val_price(creditnote.tx_creditnote_tax, 2, 1, 1) }</td>
          <td>${cls_general.val_price((creditnote.tx_creditnote_nontaxable + creditnote.tx_creditnote_taxable + creditnote.tx_creditnote_tax), 2, 1, 1)}</td>
        </tr>
      `;
      total_cn_nontaxable += creditnote.tx_creditnote_nontaxable;
      total_cn_taxable += creditnote.tx_creditnote_taxable;
      total_cn_tax += creditnote.tx_creditnote_tax;
    })
    list += `
        </tbody>
        <tfoot style="border:solid;">
          <tr>
            <td colspan="2" style="text-align: right;"><strong>Subtotal: </strong> B/ ${cls_general.val_price((total_cn_nontaxable + total_cn_taxable), 2, 1, 1)}</td>
            <td colspan="2" style="text-align: right;"><strong>Imp.: </strong> B/ ${cls_general.val_price(total_cn_tax, 2, 1, 1) }</td>
            <td colspan="2" style="text-align: right;"><strong>Total: </strong> B/ ${cls_general.val_price((total_cn_nontaxable + total_cn_taxable + total_cn_tax), 2, 1, 1)}</td>
          </tr>
        </tfoot>
      </table>
    `;



    document.getElementById('container_report').innerHTML = list;
  }
  render_creditnote(from, to, raw_creditnote) {
    var total_cn_nontaxable = 0;
    var total_cn_taxable = 0;
    var total_cn_tax = 0;

    var list = '';
    list += `
      <h5>Listado de Notas de Cr&eacute;dito, Desde: ${from} Hasta: ${to}</h5>
      <table class="table table-bordered table-condensed table-striped table-print">
        <thead style="border: solid">
          <tr class="text-center">
            <th class="col-sm-1">Fecha</th>
            <th class="col-sm-1">#Num</th>
            <th class="col-sm-5">Cliente</th>
            <th class="col-sm-3">RUC</th>
            <th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">Imp.</th>
            <th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">Total</th>
          </tr>
        </thead>
        <tbody>
    `;
    raw_creditnote.map((creditnote) => {
      list += `
        <tr>
          <td>${cls_general.datetime_converter(creditnote.created_at)}</td>
          <td>${creditnote.tx_creditnote_number}</td>
          <td>${creditnote.tx_client_name}</td>
          <td>${creditnote.tx_client_cif} DV:${creditnote.tx_client_dv}</td>
          <td>${cls_general.val_price(creditnote.tx_creditnote_tax, 2, 1, 1)}</td>
          <td>${cls_general.val_price((creditnote.tx_creditnote_nontaxable + creditnote.tx_creditnote_taxable + creditnote.tx_creditnote_tax), 2, 1, 1)}</td>
        </tr>
      `;
      total_cn_nontaxable += creditnote.tx_creditnote_nontaxable;
      total_cn_taxable += creditnote.tx_creditnote_taxable;
      total_cn_tax += creditnote.tx_creditnote_tax;
    })
    list += `
        </tbody>
        <tfoot style="border:solid;">
          <tr>
            <td colspan="2" style="text-align: right;"><strong>Subtotal: </strong> B/ ${cls_general.val_price((total_cn_nontaxable + total_cn_taxable), 2, 1, 1)}</td>
            <td colspan="2" style="text-align: right;"><strong>Imp.: </strong> B/ ${cls_general.val_price(total_cn_tax, 2, 1, 1)}</td>
            <td colspan="2" style="text-align: right;"><strong>Total: </strong> B/ ${cls_general.val_price((total_cn_nontaxable + total_cn_taxable + total_cn_tax), 2, 1, 1)}</td>
          </tr>
        </tfoot>
      </table>
    `;



    document.getElementById('container_report').innerHTML = list;
  }
  render_productinput_provider(from, to, raw_productinput){
    var total_nontaxable = 0;
    var total_taxable = 0;
    var total_tax = 0;
    var list = `
    <h5>Listado de Compras, Desde: ${from} Hasta: ${to}</h5>
      <table class="table table-bordered table-condensed table-striped table-print">
        <thead style="border: solid">
          <tr class="text-center">
            <th class="col-xs-5 col-sm-5 col-md-5 col-lg-5">Proveedor</th>
            <th class="col-xs-2 col-sm-2 col-md-2 col-lg-2">RUC</th>
            <th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">DV</th>
            <th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">Total No Imp.</th>
            <th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">Total Imponible.</th>
            <th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">Total Impuesto</th>
            <th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">Total</th>
          </tr>
        </thead>
        <tbody>
    `;
      raw_productinput.map((productinput) => {
        list += `
        <tr>
          <td>${productinput.tx_provider_value}</td>
          <td>${productinput.tx_provider_ruc}</td>
          <td>${productinput.tx_provider_dv}</td>
          <td>${cls_general.val_price(productinput.total_nontaxable, 2, 1, 1)}</td>
          <td>${cls_general.val_price(productinput.total_taxable, 2, 1, 1)}</td>
          <td>${cls_general.val_price(productinput.total_tax, 2, 1, 1)}</td>
          <td>${cls_general.val_price((productinput.total_nontaxable + productinput.total_taxable + productinput.total_tax), 2, 1, 1)}</td>
        </tr>
      `;
        total_nontaxable += productinput.total_nontaxable;
        total_taxable += productinput.total_taxable;
        total_tax += productinput.total_tax;
      })
      list += `
        </tbody>
        <tfoot style="border:solid;">
          <tr>
            <td colspan="2" style="text-align: right;"><strong>Subtotal: </strong> B/ ${cls_general.val_price((total_nontaxable + total_taxable), 2, 1, 1)}</td>
            <td colspan="2" style="text-align: right;"><strong>Imp.: </strong> B/ ${cls_general.val_price(total_tax, 2, 1, 1) }</td>
            <td colspan="2" style="text-align: right;"><strong>Total: </strong> B/ ${cls_general.val_price((total_nontaxable + total_taxable + total_tax), 2, 1, 1)}</td>
          </tr>
        </tfoot>
      </table>
    `;
    document.getElementById('container_report').innerHTML = list;
  }
  render_depletion(from, to, raw_depletion){
    var list = '';
    list += `
      <h5>Listado de Mermas, Desde: ${from} Hasta: ${to}</h5>
      <div class="list-group">
    `;
    raw_depletion.map((depletion) => {
      var status_class = (depletion.tx_depletion_status == 1) ? 'text-bg-success' : '';
      list += `
        <a href="#" class="list-group-item  cursor_pointer text-truncate ${status_class}">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${depletion.tx_depletion_quantity} - ${depletion.tx_product_value}</h5>
            <small>${cls_general.datetime_converter(depletion.created_at)}</small>
          </div>
        </a>
      `;
    })
    list += `</div>`;
    document.getElementById('container_report').innerHTML = list;
  }
  render_anulled(from, to, raw_annuled) {
    var list = '';
    list += `
      <h5>Listado de Comandas Anuladas, Desde: ${from} Hasta: ${to}</h5>
      <div class="list-group">
    `;
    raw_annuled.map((annuled) => {
      list += `
        <a href="#" class="list-group-item  cursor_pointer text-truncate">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${annuled.tx_commanddata_quantity} - ${annuled.tx_commanddata_description}</h5>
            <small>${cls_general.datetime_converter(annuled.created_at)} ${cls_general.time_converter(annuled.created_at,1)}</small>
          </div>
        </a>
      `;
    })
    list += `</div>`;
    document.getElementById('container_report').innerHTML = list;
  }
  render_commanddata(from, to, raw_commanddata) {
    var raw_report = [];
    raw_commanddata.map((commanddata) => {
      var index = raw_report.findIndex((report) => { return report.article_id === commanddata.commanddata_ai_article_id && report.presentation_id === commanddata.commanddata_ai_presentation_id })
      if (index != -1) {
        raw_report[index].quantity += commanddata.tx_commanddata_quantity;
        raw_report[index].price += commanddata.tx_commanddata_quantity * commanddata.tx_commanddata_price;
      }else{
        raw_report.push({
          article_id: commanddata.commanddata_ai_article_id,
          quantity: commanddata.tx_commanddata_quantity, 
          article_description: commanddata.tx_commanddata_description,
          price: commanddata.tx_commanddata_quantity * commanddata.tx_commanddata_price,
          presentation_value: commanddata.tx_presentation_value, 
          presentation_id: commanddata.commanddata_ai_presentation_id 
        })
      }
    })
    var list = `<h5>Listado de Comandas, Desde: ${from} Hasta: ${to}</h5>
    <div class="row">
      <div class="col-10 py-2">
        <input type="text" id="filterCommanddata" class="form-control" onkeyup="cls_commanddata.filter(this.value)" placeholder="Buscar por nombre.">
      </div>
      <div class="col-2 py-2">
        <button class="badge btn btn-info" onclick="cls_commanddata.print()">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-printer-fill" viewBox="0 0 16 16">
            <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"></path>
            <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"></path>
          </svg>
        </button>
      </div>
    `;
    raw_report.sort((a, b) => {
      const nameA = a.article_description.toUpperCase(); // ignore upper and lowercase
      const nameB = b.article_description.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });

    cls_commanddata.filtered = raw_report;
    list += `<div class="col-12 py-2" id="container_filtered">${cls_commanddata.generate_list(raw_report) }</div></div>`;
    document.getElementById('container_report').innerHTML = list;
  }
  render_productinput_product(from, to, raw_productinput) {
    var raw_report = [];
    raw_productinput.map((linedata) => {
      var index = raw_report.findIndex((report) => { return report.product_id === linedata.dataproductinput_ai_product_id && report.measure_id === linedata.dataproductinput_ai_measurement_id })
      if (index != -1) {
        raw_report[index].quantity += linedata.tx_dataproductinput_quantity;
        raw_report[index].price += linedata.tx_dataproductinput_quantity * linedata.tx_dataproductinput_price;
      } else {
        raw_report.push({
          product_id: linedata.dataproductinput_ai_product_id,
          quantity: linedata.tx_dataproductinput_quantity,
          product_description: linedata.tx_dataproductinput_description,
          price: linedata.tx_dataproductinput_quantity * linedata.tx_dataproductinput_price,
          measure_value: linedata.tx_measure_value,
          measure_id: linedata.dataproductinput_ai_measurement_id
        })
      }
    })
    var list = `<h5>Listado de Productos Comprados, Desde: ${from} Hasta: ${to}</h5>
    <div class="row">
      <div class="col-10 py-2">
        <input type="text" id="filterDataproductinput" class="form-control" onkeyup="cls_dataproductinput.filter(this.value)" placeholder="Buscar por nombre.">
      </div>
      <div class="col-2 py-2">
        <button class="badge btn btn-info" onclick="cls_dataproductinput.print()">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-printer-fill" viewBox="0 0 16 16">
            <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"></path>
            <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"></path>
          </svg>
        </button>
      </div>
    `;
    raw_report.sort((a, b) => {
      const nameA = a.product_description.toUpperCase(); // ignore upper and lowercase
      const nameB = b.product_description.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
    console.log(raw_report);
    cls_dataproductinput.filtered = raw_report;
    list += `<div class="col-12 py-2" id="container_filtered">${cls_dataproductinput.generate_list(raw_report)}</div></div>`;
    document.getElementById('container_report').innerHTML = list;
  }

}

class class_commanddata
{
  constructor(){
    this.result = [];
    this.filtered = [];
  }

  async filter(str) {
    document.getElementById('container_filtered').innerHTML = cls_commanddata.generate_list(await cls_commanddata.look_for(str));
  }
  generate_list(raw_report){
    cls_commanddata.result = raw_report;
    var list = `<div class="list-group">`;
    var total = 0;
    raw_report.map((line) => {
      total += line.price;
      list += `
        <a href="#" class="list-group-item  cursor_pointer text-truncate">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${line.quantity} - ${line.article_description} (${line.presentation_value})</h5>
            <small>B/ ${(line.price / line.quantity).toFixed(2)}</small>
          </div>
        </a>
      `;
    })
    list += `</div>
      <div class="text-end">
        <h4>Total: ${cls_general.val_price(total,2,1,1)}</h4>
      </div>
    `;
    return list;
  }
  look_for(str) {
    return new Promise(resolve => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        var haystack = cls_commanddata.filtered;
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          var ocurrencys = 0;
          for (const a in needles) {
            if (haystack[i]['article_description'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
          }
          if (ocurrencys === needles.length) {
            raw_filtered.push(haystack[i]);
          }
        }


        raw_filtered.sort((a, b) => a.article_description - b.article_description);
        raw_filtered.sort((a, b) => {
          const nameA = a.article_description.toUpperCase(); // ignore upper and lowercase
          const nameB = b.article_description.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });

        resolve(raw_filtered)
      }, 500)
    });
  }
  
  print(){
    var str = (cls_general.is_empty_var(document.getElementById('filterCommanddata').value) === 0) ? 'empty' : document.getElementById('filterCommanddata').value;
    var from = document.getElementById('reportFromDatefilter').value;
    var to = document.getElementById('reportToDatefilter').value;
    cls_general.print_html(`/print_reportcommanddata/${from}/${to}/${str}`);
  }
}

class class_dataproductinput {
  constructor() {
    this.result = [];
    this.filtered = [];
  }

  async filter(str) {
    document.getElementById('container_filtered').innerHTML = cls_dataproductinput.generate_list(await cls_dataproductinput.look_for(str));
  }
  generate_list(raw_report) {
    cls_commanddata.result = raw_report;
    var list = `<div class="list-group">`;
    var total = 0;
    raw_report.map((line) => {
      total += line.price;
      list += `
        <a href="#" class="list-group-item  cursor_pointer text-truncate">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${line.quantity} - ${line.product_description} (${line.measure_value})</h5>
            <small>B/ ${(line.price / line.quantity).toFixed(2)}</small>
          </div>
        </a>
      `;
    })
    list += `</div>
      <div class="text-end">
        <h4>Total: ${cls_general.val_price(total, 2, 1, 1)}</h4>
      </div>
    `;
    return list;
  }
  look_for(str) {
    return new Promise(resolve => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        var haystack = cls_dataproductinput.filtered;
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          var ocurrencys = 0;
          for (const a in needles) {
            if (haystack[i]['product_description'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
          }
          if (ocurrencys === needles.length) {
            raw_filtered.push(haystack[i]);
          }
        }

        raw_filtered.sort((a, b) => a.product_description - b.product_description);
        raw_filtered.sort((a, b) => {
          const nameA = a.product_description.toUpperCase(); // ignore upper and lowercase
          const nameB = b.product_description.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });

        resolve(raw_filtered)
      }, 500)
    });
  }

  print() {
    var str = (cls_general.is_empty_var(document.getElementById('filterDataproductinput').value) === 0) ? 'empty' : document.getElementById('filterDataproductinput').value;
    var from = document.getElementById('reportFromDatefilter').value;
    var to = document.getElementById('reportToDatefilter').value;
    cls_general.print_html(`/print_reportdataproductinput/${from}/${to}/${str}`);
  }
}
