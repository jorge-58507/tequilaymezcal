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

class class_request{
  constructor(open_request, closed_request){
    this.open_request = open_request;
    this.closed_request = closed_request;
  }
  render(target, raw) {
    switch (target) {
      case 'open':
        document.getElementById('container_openrequest').innerHTML = cls_request.generate_openrequest(raw);
        break;
      case 'closed':
        document.getElementById('container_closedrequest').innerHTML = cls_request.generate_closedrequest(raw);
        break;
      case 'canceled':
        document.getElementById('container_canceledrequest').innerHTML = cls_request.generate_canceledrequest(raw);
      break;
   }
  }
  generate_openrequest(open) {
    var content = '<ul class="list-group">';
    open.map((request) => {
      content += `<li class="list-group-item cursor_pointer" onclick="cls_request.close('${request.tx_request_slug}')"><h5>${request.tx_request_code} - ${request.tx_client_name}</h5><small>${request.tx_request_title} - ${request.tx_table_value}</small></li>`;
    })
    content += '</ul>';
    return content;
  }
  generate_closedrequest(closed) {
    var content = '<ul class="list-group">';
    closed.map((request) => {
      content += `<li class="list-group-item cursor_pointer d-flex justify-content-between align-items-start" onclick="cls_charge.show('${request.tx_request_slug}')">
          <div class="ms-2 me-auto">
            <div class="fw-bold"><h5>${request.tx_request_code} - ${request.tx_client_name}</h5></div>
            <small>${request.tx_request_title} - ${request.tx_table_value}</small>
          </div>
          <span class="badge bg-primary fs_20">B/ ${cls_general.val_price(request.total,2,1,1)}</span>
          &nbsp;&nbsp;&nbsp;
          <span>${cls_general.datetime_converter(request.updated_at)}</span>
      </li>`;
    })
    content += '</ul>';
    return content;
  }
  generate_canceledrequest(charge_list) {
    var content = '<ul class="list-group">';
    charge_list.map((charge) => {
      content += `<li class="list-group-item cursor_pointer d-flex justify-content-between align-items-start" onclick="cls_charge.inspect('${charge.tx_charge_slug}')">

        <div class="ms-2 me-auto">
          <div class="fw-bold"><h5>${charge.tx_charge_number} - ${charge.tx_client_name}</h5></div>
          <small>${charge.tx_request_title} - ${charge.tx_table_value}</small>
        </div>
        <span class="badge bg-secondary fs_20">B/ ${cls_general.val_price(charge.tx_charge_total, 2, 1, 1) }</span>
        &nbsp;&nbsp;&nbsp;
        <span>${cls_general.datetime_converter(charge.created_at)}</span>

      
      </li>`;
    })
    content += '</ul>';
    return content;
  }
  close(request_slug){
    swal({
      title: "¿Desea cerrar este pedido?",
      text: "Ya no podrán agregarle comandas.",
      icon: "info",

      buttons: {
        si: {
          text: "Si, cerrarlo",
          className: "btn btn-success btn-lg"
        },
        no: {
          text: "No",
          className: "btn btn-warning btn-lg",
        },
      },
      dangerMode: true,
    })
    .then((ans) => {
      switch (ans) {
        case 'si':
          var url = '/request/' + request_slug + '/close';
          var method = 'PUT';
          var body = JSON.stringify({ a: 1 });;
          var funcion = function (obj) {
            if (obj.status === 'success') {
              cls_request.open_request = obj.data.open_request;
              cls_request.closed_request = obj.data.closed_request;

              cls_request.render('open', cls_request.open_request);
              cls_request.render('closed', cls_request.closed_request);

              cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
            } else {
              cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
            }
          }
          cls_general.async_laravel_request(url, method, funcion, body);
        break;
        case 'no':

        break;
      }
    });

  }
  async filter(target,str){
    switch (target) {
      case 'closed':
        document.getElementById('container_closedrequest').innerHTML    = cls_request.generate_closedrequest(await cls_request.look_for(str,"1"));
        break;
      case 'open':
        document.getElementById('container_openrequest').innerHTML      = cls_request.generate_openrequest(await cls_request.look_for(str,"0"));
        break;
      case 'canceled':
        document.getElementById('container_canceledrequest').innerHTML  = cls_request.generate_canceledrequest(await cls_charge.look_for(str));
        break;
    }
  }
  look_for(str, status) {
    return new Promise(resolve => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        switch (status) {
          case "0":
            var haystack = cls_request.open_request;
            break;
          case "1":
            var haystack = cls_request.closed_request;
            break;
          case "2":
            var haystack = cls_request.canceled_request;
            break;
        }
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          var ocurrencys = 0;
          for (const a in needles) {
            if (haystack[i]['tx_client_name'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_request_code'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_request_title'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_table_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
          }
          if (ocurrencys === needles.length) {
            raw_filtered.push(haystack[i]);
          }
        }
        resolve(raw_filtered)
      }, 500)
    });
  }
}
class class_charge{
  constructor(charge_list){
    this.charge_request=[];
    this.charge_list = charge_list;
  }
  
  index(){
    var content = `    
    <div class="col-sm-12 text-center"><h3>Caja</h3></div>
    <div class="col-md-12 col-lg-12">
      <div class="col-sm-12"><h5>Pedidos</h5></div>
      <div class="col-sm-12">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#tab_closedrequest" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Cerrado</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="" data-bs-toggle="tab" data-bs-target="#tab_openrequest" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Abierto</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="" data-bs-toggle="tab" data-bs-target="#tab_canceledrequest" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Pagado</button>
          </li>
        </ul>
      </div>

      <div class="tab-content row" id="">
        <div class="tab-pane fade show active v_scrollable col-sm-12" id="tab_closedrequest"    role="tabpanel" aria-labelledby="home-tab" tabindex="0" style="max-height: 80vh;">

          <div class="row">
            <div class="col-md-12 col-lg-6">
              <div class="input-group my-3">
                <input type="text" id="filter_closedrequest"  class="form-control" placeholder="Buscar por C&oacute;digo, t&iacute;tulo o mesa." onkeyup="cls_request.filter('closed',this.value)">
                <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_request.filter('closed',document.getElementById('filter_closedrequest').value)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div id='container_closedrequest' class="col-md-12">

            </div>
          </div>

        </div>
        <div class="tab-pane fade v_scrollable col-sm-12"             id="tab_openrequest"      role="tabpanel" aria-labelledby="profile-tab" tabindex="0"  style="max-height: 80vh;">
        	<div class="row">
            <div class="col-md-12 col-lg-6">
              <div class="input-group my-3">
                <input type="text" id="filter_openrequest"  class="form-control" placeholder="Buscar por C&oacute;digo, t&iacute;tulo o mesa." onkeyup="cls_request.filter('open',this.value).value)">
                <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_request.filter('open',document.getElementById('filter_openrequest').value)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div id='container_openrequest' class="col-md-12">

            </div>
          </div>
        </div>
        <div class="tab-pane fade v_scrollable col-sm-12"             id="tab_canceledrequest"  role="tabpanel" aria-labelledby="profile-tab" tabindex="0"  style="max-height: 80vh;">
        
          <div class="row">
            <div class="col-md-12 col-lg-6">
              <div class="input-group my-3">
                <input type="text" id="filter_canceledrequest" class="form-control" placeholder="Buscar por C&oacute;digo, t&iacute;tulo o mesa." onkeyup="cls_request.filter('canceled',this.value)">
                <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_request.filter('canceled',document.getElementById('filter_canceledrequest').value)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div id='container_canceledrequest' class="col-md-12">

            </div>
          </div>

        </div>
      </div>
    </div>`;
    document.getElementById('container_request').innerHTML = content;
  }
  show(request_slug){
    var url = '/command/' + request_slug + '/byrequest';
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_charge.render(request_slug);
        var content_command = cls_command.generate_articleprocesed(obj.data.command_procesed)
        document.getElementById('container_commandlist').innerHTML = content_command.content;
        let price = cls_general.calculate_sale(content_command.price)
        document.getElementById('sp_gross').innerHTML = 'B/. ' + cls_general.val_price(price.gross_total, 2, 1, 1);
        document.getElementById('sp_discount').innerHTML = 'B/. ' + cls_general.val_price(price.discount, 2, 1, 1);
        document.getElementById('sp_subtotal').innerHTML = 'B/. ' + cls_general.val_price(price.subtotal, 2, 1, 1);
        document.getElementById('sp_tax').innerHTML = 'B/. ' + cls_general.val_price(price.tax, 2, 1, 1);
        document.getElementById('sp_total').innerHTML = 'B/. ' + cls_general.val_price(price.total, 2, 1, 1);

        cls_charge.charge_request = {request_id: obj.data.request_info.ai_request_id, gross_total: price.gross_total, subtotal: price.subtotal, total: price.total, discount: price.discount, tax: price.tax};
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  render(request_slug){
    var content = `
      <div class="col-md-12 col-lg-6">
        <div class="col-sm-12"><h5>Listado de Comandas</h5></div>
        <div id="container_commandlist" class="col-sm-12 v_scrollable" style="height: 90vh"></div>
      </div>
      <div class="col-md-12 col-lg-6">
        <div class="row">
          <div class="col-md-12 pt-1">
            <div class="row bs_1 border_gray radius_5 mb-1">
              <div class="col-md-12 col-lg-6 text-truncate"><span>Total Bruto</span><span id="sp_gross" class="float_right fs_20"></span></div>
              <div class="col-md-12 col-lg-6 text-truncate"><span>Descuento</span><span id="sp_discount" class="float_right fs_20"></span></div>
              <div class="col-md-12 col-lg-6 text-truncate"><span>Subtotal</span><span id="sp_subtotal" class="float_right fs_20"></span></div>
              <div class="col-md-12 col-lg-6 text-truncate"><span>Impuesto</span><span id="sp_tax" class="float_right fs_20"></span></div>          
            </div>
            <div class="row bs_1 border_gray radius_5 tmgreen_bg f_white">
              <div class="col-md-12"><h5>Total</h5><span id="sp_total" class="font_bolder fs_30"></span></div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6 pb-2">
            <label class="form-label" for="paymentNumber">Numero</label>
            <input type="text" id="paymentNumber" class="form-control" onfocus="cls_general.validFranz(this.id,['number','word'],',.-()')" value="">
          </div>
          <div class="col-sm-6 pb-2">
            <label class="form-label" for="paymentAmount">Monto</label>
            <input type="number" id="paymentAmount" class="form-control" onfocus="cls_general.validFranz(this.id,['number'],'.')" value="">
          </div>
          <div class="col-sm-12 p-1">
            <div id="container_paymentMethod" class="row v_scrollable" style="height: 20vh">
            </div>
          </div>
          <div class="col-sm-12 bs_1 border_gray radius_10">
            <div id="container_payment" class="row radius_10" style="height: 30vh">
            </div>
          </div>
          <div class="col-sm-12 text-center pt-1">
            <button type="button" class="btn btn-secondary btn-lg" onclick="window.location.reload()">Volver</button>
            &nbsp;
            <button type="button" id="btn_paymentProcess" class="btn btn-success btn-lg display_none">Procesar</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('container_request').innerHTML = content;
    document.getElementById('btn_paymentProcess').addEventListener('click', () => { cls_payment.process(document.getElementById('btn_paymentProcess') ,request_slug)});
    cls_paymentmethod.render();

    document.getElementById('paymentAmount').focus();
  }
  look_for(str) {
    return new Promise(resolve => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        var haystack = cls_charge.charge_list;
        console.log(haystack);
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          var ocurrencys = 0;
          for (const a in needles) {
            if (haystack[i]['tx_client_name'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_charge_number'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_request_title'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_table_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
          }
          if (ocurrencys === needles.length) {
            raw_filtered.push(haystack[i]);
          }
        }
        resolve(raw_filtered)
      }, 500)
    });
  }
  inspect(charge_slug){
    var url = '/paydesk/'+charge_slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var charge = obj.data.charge;
        var raw_payment = obj.data.payment;
        var raw_article = obj.data.article;

        cls_charge.render_inspect(charge.tx_charge_number, cls_general.datetime_converter(charge.created_at), charge.tx_client_name, charge.tx_charge_total, charge.tx_charge_change, raw_payment, raw_article,charge_slug);

        const modal = new bootstrap.Modal('#inspectModal', {})
        modal.show();

        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  render_inspect(number,date,client,total,change,raw_payment,raw_article, charge_slug){
    var payment_list = '';
    raw_payment.map((payment) => { 
      var payment_number = (cls_general.is_empty_var(payment.tx_payment_number) === 0) ? '' : '- (' + payment.tx_payment_number + ')';
      payment_list += `
        <li class="list-group-item d-flex justify-content-between align-items-start fs_20">
          <div class="ms-2 me-auto text-truncate">
            ${payment.tx_paymentmethod_value} ${payment_number}
          </div>
          <span class="badge bg-primary fs_20">${cls_general.val_price(payment.tx_payment_amount,2,1,1)}</span>
        </li>
      `; 
    })
    var article_list = '';
    raw_article.map((article)=>{
      var discount = ((article.tx_commanddata_discountrate * article.tx_commanddata_price) / 100); discount = discount.toFixed(2);
      var price = article.tx_commanddata_price - parseFloat(discount);
      var bg_status = (article.tx_commanddata_status === 0) ? 'text-bg-danger': 'text-bg-success';
      article_list += `
        <li class="list-group-item d-flex justify-content-between align-items-start fs_20  ${bg_status}">
          <div class="ms-2 me-auto text-truncate">
            ${article.tx_commanddata_quantity} - ${article.tx_article_value}
          </div>
          <span class="badge bg-secondary fs_20">${cls_general.val_price(price, 2, 1, 1)}</span>
        </li>
      `;
    })

    var content = `
    	<div class="col-sm-12" style="height: 60vh;">
        <div class="row">
          <div class="col-md-6 col-lg-3">
            <label class="form-label" for="">Numero</label>
            <input type="text" id="" class="form-control" value="${number}" readonly>
          </div>
          <div class="col-md-6 col-lg-3">
            <label class="form-label" for="">Fecha</label>
            <input type="text" id="" class="form-control" value="${date}" readonly>
          </div>
          <div class="col-md-12 col-lg-6">
            <label class="form-label" for="">Cliente</label>
            <input type="text" id="" class="form-control" value="${client}" readonly>
          </div>
          <div class="col-md-6 col-lg-3">
            <label class="form-label" for="">Total</label>
            <input type="text" id="" class="form-control" value="${cls_general.val_price(total, 2, 1, 1)}" readonly>
          </div>
          <div class="col-md-6 col-lg-3">
            <label class="form-label" for="">Cambio</label>
            <input type="text" id="" class="form-control" value="${cls_general.val_price(change, 2, 1, 1)}" readonly>
          </div>
          <div class="col-md-6 col-lg-3 d-grid gap-2 py-2">
            <button id="btn_chargeCreditnote" class="btn btn-lg btn-warning text-truncate">Nota de Cr&eacute;dito</button>
          </div>

        </div>
        <div class="row">
          <div class="col-sm-6">
            <div class="row">
              <div class="col-sm-12">
                <span>Pagos asociados</span>
              </div>
              <div class="col-sm-12">
                <ul class="list-group">
                  ${payment_list}
                </ul>
              </div>
            </div>
          </div>

          <div class="col-sm-6">
            <div class="row">
              <div class="col-sm-12">
                <span>Productos Relacionados</span>
              </div>
              <div class="col-sm-12">
                <ul class="list-group">
                  ${article_list}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    var footer = `
        <div class="row">
          <div class="col-sm-12">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      `;

    document.getElementById('inspectModal_content').innerHTML = content;
    document.getElementById('inspectModal_footer').innerHTML = footer;
    document.getElementById('inspectModal_title').innerHTML = 'Inspeccionar Venta';

    document.getElementById('btn_chargeCreditnote').addEventListener('click', () => { cls_charge.make_creditnote(charge_slug); });
  }
  make_creditnote(charge_slug){
    var url = '/paydesk/' + charge_slug +'/creditnote';
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var charge = obj.data.charge;
        cls_creditnote.creditnote_charge = charge;
        var raw_article = []
        obj.data.article.map((command)=>{
          command.map((commanddata)=>{
            raw_article.push({
              'commanddata_id': commanddata.ai_commanddata_id,
              'article_id': commanddata.ai_article_id,
              'article_code': commanddata.tx_article_code,
              'article_value': commanddata.tx_article_value,
              'commanddata_presentation_id': commanddata.commanddata_ai_presentation_id,
              'commanddata_presentation_value': commanddata.tx_presentation_value,
              'commanddata_price': commanddata.tx_commanddata_price,
              'commanddata_discountrate': commanddata.tx_commanddata_discountrate,
              'commanddata_taxrate': commanddata.tx_commanddata_taxrate,
              'commanddata_quantity': commanddata.tx_commanddata_quantity,
              'commanddata_cnquantity': (cls_general.is_empty_var(commanddata.sum) === 1) ? commanddata.sum : 0,
              'commanddata_status': commanddata.tx_commanddata_status
            });
          })
        })
        cls_creditnote.render(charge_slug, charge.tx_charge_number, charge.created_at, charge.tx_client_name, raw_article, obj.data.creditnote)
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
}
class class_command{
  generate_articleprocesed(command_procesed) {
    var raw_price = [];
    var content_command_procesed = `<div class="list-group">`;
    command_procesed.map((command) => {
      if (command.tx_commanddata_status === 0) {
        var bg_status = 'text-bg-warning text-body-tertiary';
      } else {
        // [{ PRICE, discount, tax, quantity }]
        raw_price.push({ price: command.tx_commanddata_price, discount: command.tx_commanddata_discountrate, tax: command.tx_commanddata_taxrate, quantity: command.tx_commanddata_quantity });
        var bg_status = '';
      }

      content_command_procesed += `
        <a href="#" class="list-group-item list-group-item-action ${bg_status}" aria-current="true" onclick="event.preventDefault();">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${command.tx_commanddata_quantity} - ${command.tx_commanddata_description}</h5>
          </div>
          <small class="float_right">B/ ${cls_general.val_price(command.tx_commanddata_price,2,1,1)}</small><br/>
        </a>
      `;
    })
    content_command_procesed += `</div>`;
    return { 'content': content_command_procesed, 'price': raw_price };
  }
}
class class_paymentmethod{
  constructor(raw_paymentmethod){
    this.paymentmethod = raw_paymentmethod;
  }
  render(){
    document.getElementById('container_paymentMethod').innerHTML = cls_paymentmethod.generate_paymentbutton(cls_paymentmethod.paymentmethod);
  }
  generate_paymentbutton(paymentmethod){
    var content = '';
    paymentmethod.map((method)=>{
      content += `
        <div class="col-md-6 col-lg-3 d-grid gap-2 pb-4">
          <button type="button" class="btn btn-info h_90" onclick="cls_payment.add(${method.ai_paymentmethod_id})">${method.tx_paymentmethod_value}</button>
        </div>
      `;
    })
    return content;
  }
}
class class_payment{
  constructor(){
    this.payment = [];
  }
  add(method){
    let number = document.getElementById('paymentNumber').value;
    let amount = parseFloat(document.getElementById('paymentAmount').value);

    var check_method = cls_paymentmethod.paymentmethod.find((pmethod) => { return pmethod.ai_paymentmethod_id === method })
    if (cls_general.is_empty_var(amount) === 0 ) {
      cls_general.shot_toast_bs('Ingrese el monto.', { bg: 'text-bg-warning' }); return false;
    }
    if (cls_general.is_empty_var(check_method) === 0) {
      cls_general.shot_toast_bs('M&eacute;todo erroneo.', { bg: 'text-bg-warning' }); return false;
    }
    if (isNaN(amount)) {
      cls_general.shot_toast_bs('Monto erroneo.', { bg: 'text-bg-warning' }); return false;
    }
    var received = 0;
    cls_payment.payment.map((pay) => { received += parseFloat(pay.amount)  })
    var total = cls_general.val_dec(cls_charge.charge_request.total,2,1,1);
    total = parseFloat(total);
    if (total <= received) {
      cls_general.shot_toast_bs('Ya se complet&oacute; el pago.', { bg: 'text-bg-warning' }); return false;
    } else {
      if ((received + amount) > total) {
        if(check_method.tx_paymentmethod_change === 0){
          cls_general.shot_toast_bs('M&eacute;todo de pago, no admite cambio.', { bg: 'text-bg-warning' }); return false;
        }
      }
    }
    var taked_id = []; var taked_amount = 0;
    cls_payment.payment.map((pay, index) => { if (pay.method_id === method) { taked_id.push(index); taked_amount = parseFloat(pay.amount)  } })
    if (taked_id.length > 0) {
      cls_payment.payment.splice(taked_id, 1, { method_id: method, method_name: check_method.tx_paymentmethod_value, number: number, amount: parseFloat(amount)+taked_amount })
    }else{
      cls_payment.payment.push({method_id: method, method_name: check_method.tx_paymentmethod_value, number: number, amount: amount});
    }
    cls_payment.render();
  }
  render(){
    let content_payment = cls_payment.generate_payment_list(cls_payment.payment);
    if (cls_payment.payment.length > 0) {
      document.getElementById('btn_paymentProcess').classList.remove('display_none');
    } else {
      document.getElementById('btn_paymentProcess').classList.add('display_none');
    }
    document.getElementById('container_payment').innerHTML = content_payment;
    document.getElementById('paymentAmount').value = '';
    document.getElementById('paymentAmount').focus();
    document.getElementById('paymentNumber').value = '';
  }
  generate_payment_list(raw_payment){
    var payment_list = '';
    let received = 0;
    raw_payment.map((payment,index)=>{
      var number = (cls_general.is_empty_var(payment.number) === 0) ? '' : '(' + payment.number + ')';
      payment_list += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${cls_general.val_price(payment.amount,2,1,1)} ${number} ${payment.method_name}
          <button class="btn btn-warning" type="button" onclick="cls_payment.erase(${index})">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
            </svg>
          </button>
        </li>
      `
      received += parseFloat(payment.amount);
    })
    if (parseFloat(cls_charge.charge_request.total) > received) {
      var diference = (parseFloat(cls_charge.charge_request.total) - parseFloat(received)).toFixed(2);
      var change = 0;
    }else{
      if (parseFloat(cls_charge.charge_request.total) === received) {
        var change = 0;
        var diference = 0;
      }else{
        var diference = 0;
        var change = (parseFloat(received) - parseFloat(cls_charge.charge_request.total)).toFixed(2);
      }
    }
    var content = `
      <div class="col-sm-4">
        <div class="row border-end mhp_100">
          <div class="col-sm-12 text-success bs_1 border_gray">
            <span class="font_bolder">Recibido</span><br/>
            <span class="fs_20">B/ ${cls_general.val_price(received,2,1,1)}</span>
          </div>
          <div class="col-sm-12 text-warning bs_1 border_gray">
            <span class="font_bolder">Diferencia</span><br/>
            <span class="fs_20">B/ ${cls_general.val_price(diference, 2, 1, 1) }</span>
          </div>
          <div class="col-sm-12 text-info bs_1 border_gray">
            <span class="font_bolder">Cambio</span><br/>
            <span class="fs_20">B/ ${cls_general.val_price(change,2,1,1)}</span>
          </div>
        </div>
      </div >
      <div class="col-sm-8 v_scrollable mhp_100">
        <ul class="list-group list-group-flush list-group-numbered">
          ${payment_list}
        </ul>
      </div>
    `;
    return content;
  }
  erase(i){
    cls_payment.payment.splice(i, 1);
    cls_payment.render();
  }
  process(btn,request_slug){
    cls_general.disable_submit(btn)
    var raw_payment = cls_payment.payment;
    let received = 0
    raw_payment.map((payment) => { received += payment.amount; });
    let total_request = parseFloat(cls_charge.charge_request.total);
    if (total_request > received) {
      cls_general.shot_toast_bs('Aun existe diferencia.',{bg: 'text-bg-warning'}); return false;
    }
    var url = '/paydesk/';
    var method = 'POST';
    var body = JSON.stringify({ a: request_slug, b: raw_payment });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
        cls_payment.payment = [];
        window.location.reload();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
}
class class_creditnote{
  constructor(){
    this.creditnote_charge = [];
    this.selected = [];
  }

  render(charge_slug,number,date,client,raw_article,raw_creditnote){
    var article_charge = cls_creditnote.generate_articlecharge(raw_article);
    var creditnote_list = cls_creditnote.generate_creditnote(raw_creditnote);

    var content = `
      <div class="col-sm-12">
        <div class="row">
          <div class="col-md-6 col-lg-3">
            <label class="form-label" for="">Numero</label>
            <input type="text" id="" class="form-control" value="${number}" readonly>
          </div>
          <div class="col-md-6 col-lg-3">
            <label class="form-label" for="">Fecha</label>
            <input type="text" id="" class="form-control" value="${cls_general.datetime_converter(date)}" readonly>
          </div>
          <div class="col-md-12 col-lg-6">
            <label class="form-label" for="">Cliente</label>
            <input type="text" id="" class="form-control" value="${client}" readonly>
          </div>
        </div>
        <input type="hidden" id="creditnoteReason" class="form-control" value="Cambio" readonly>
        <div class="row">
          <div class="col-sm-12 text-center pt-3">
          <button type="button" id="btn_creditnoteProcess" class="btn btn-primary">Procesar</button>
          <button type="button" onclick="window.location.reload();" class="btn btn-secondary">Cerrar</button>
          <button type="button" id="btn_creditnoteNullify" class="btn btn-danger btn-lg">Anular</button>
          </div>

          <div class="col-sm-12">
            <span>Art&iacute;culos Facturados</span>
          </div>
          <div class="col-sm-12 v_scrollable bb_1 border_gray" style="height: 35vh;">
            <table class="table table-sm table-bordered">   
              <thead class="text-bg-primary text-center">
                <tr>
                  <th class="col-sm-2 text-truncate d-none d-lg-table-cell" scope="col">C&oacute;digo</th>
                  <th class="col-sm-4 text-truncate" scope="col">Descripci&oacute;n</th>
                  <th class="col-sm-3 text-truncate d-none d-lg-table-cell" scope="col">Presentaci&oacute;n</th>
                  <th class="col-sm-1 text-truncate" scope="col">Cantidad</th>
                  <th class="col-sm-2 text-truncate" scope="col">Precio</th>
                </tr>
              </thead>
              <tbody id="container_charge" class="table-light">
                ${article_charge}
              </tbody>
            </table>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 pt-2">
            <span>Seleccionados</span>
          </div>
          <div class="col-sm-12 v_scrollable" style="height: 35vh;">
            <table class="table table-sm table-bordered">
              <thead class="text-bg-warning text-center">
                <tr>
                  <th class="col-sm-2 text-truncate d-none d-lg-table-cell" scope="col">C&oacute;digo</th>
                  <th class="col-sm-4 text-truncate" scope="col">Descripci&oacute;n</th>
                  <th class="col-sm-1 text-truncate d-none d-lg-table-cell" scope="col">Presentaci&oacute;n</th>
                  <th class="col-sm-1 text-truncate" scope="col">Cantidad</th>
                  <th class="col-sm-2 text-truncate" scope="col">Precio</th>
                  <th class="col-sm-1 text-truncate" scope="col"></th>
                </tr>
              </thead>
              <tbody id="container_tocancel" class="table-light">
                
              </tbody>
            </table>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <span>Notas de Cr&eacute;dito Anteriores</span>
          </div>
          <div class="col-sm-12 v_scrollable" style="height: 35vh;">
            <table class="table table-sm table-bordered">
              <thead class="text-bg-info text-center">
                <tr>
                  <th class="col-sm-2 text-truncate" scope="col">Fecha</th>
                  <th class="col-sm-2 text-truncate" scope="col">Numero</th>
                  <th class="col-sm-2 text-truncate" scope="col">Anulado</th>
                  <th class="col-sm-2 text-truncate d-none d-lg-table-cell" scope="col">Base</th>
                  <th class="col-sm-2 text-truncate d-none d-lg-table-cell" scope="col">Impuesto</th>
                  <th class="col-sm-2 text-truncate d-none d-lg-table-cell" scope="col">Total</th>
                </tr>
              </thead>
              <tbody id="container_oldcreditnote" class="table-light">
                ${creditnote_list}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    document.getElementById('container_request').innerHTML = content;
    const Modal = bootstrap.Modal.getInstance('#inspectModal');
    if (Modal != null) {
      Modal.hide();
    }
    document.getElementById('btn_creditnoteProcess').addEventListener('click', ()=>{cls_creditnote.process(charge_slug); });

  }
  generate_articlecharge(raw_article) {
    var content = ``;
    raw_article.map((commanddata) => {
      if (commanddata.commanddata_status === 1) {
        //[{PRICE,discount,tax, quantity}]
        var raw_price = [{ 'price': commanddata.commanddata_price, 'discount': commanddata.commanddata_discountrate, 'tax': commanddata.commanddata_taxrate, 'quantity': 1 }];
        var price_sale = cls_general.calculate_sale(raw_price);
  
        content += `<tr class="cursor_pointer" onclick="cls_creditnote.add('${commanddata.commanddata_id}','${commanddata.article_code}','${commanddata.article_value}','${commanddata.commanddata_presentation_value}',${price_sale.total},${parseFloat(commanddata.commanddata_quantity) - parseFloat(commanddata.commanddata_cnquantity)},${commanddata.article_id},${commanddata.commanddata_presentation_id})">`;
        content += `<td class="d-none d-lg-table-cell">${commanddata.article_code}</td><td>${commanddata.article_value}</td><td class="d-none d-lg-table-cell">${commanddata.commanddata_presentation_value}</td><td>${parseFloat(commanddata.commanddata_quantity) - parseFloat(commanddata.commanddata_cnquantity) }</td><td>B/ ${cls_general.val_price(price_sale.total, 2, 1, 1)}</td>`;
        content += '</tr>';
      }
    })
    return content;
  }
  add(commanddata_id,article_code,article_value,presentation_value,price,commanddata_quantity,article_id,presentation_id){
    var returned = cls_creditnote.selected.find((commanddata)=> { return commanddata.commanddata_id === commanddata_id })
    var available = (returned != undefined) ? commanddata_quantity - parseFloat(returned.quantity) : commanddata_quantity;
    swal({
      title: article_value,
      text: "Ingrese la cantidad a anular.",

      content: {
        element: "input",
        attributes: {
          placeholder: "Cantidad",
          type: "text",
        },
      },
    })
    .then((quantity) => {
      if (cls_general.is_empty_var(quantity) === 0) {
        return swal("Debe ingresar un numero.");
      }
      if (isNaN(quantity)) {
        return swal("Debe ingresar un numero entero.");
      }
      
      quantity = cls_general.val_dec(quantity,1,0,1);
      if (quantity > available) {
        return swal("Ha excedido la cantidad disponible.");
      }
      var i = '';
      cls_creditnote.selected.find((commanddata, index) => { if (commanddata.commanddata_id === commanddata_id) { i = index; } })
      if (cls_general.is_empty_var(i) === 1) { //SI YA EXISTE
        cls_creditnote.selected[i].quantity += quantity;
      }else{
        cls_creditnote.selected.push({ 'commanddata_id': commanddata_id, 'article_id': article_id, 'article_code': article_code, 'article_value': article_value, 'presentation_value': presentation_value, 'presentation_id': presentation_id, 'price': price, 'quantity': quantity});
      }
      var content = cls_creditnote.generate_articleselected(cls_creditnote.selected);
      document.getElementById('container_tocancel').innerHTML = content;
    });

  }
  generate_articleselected(raw_article) {
    var content = ``;
    raw_article.map((commanddata) => {
      content += `<tr class="cursor_pointer">`;
      content += `<td class="d-none d-lg-table-cell">${commanddata.article_code}</td><td>${commanddata.article_value}</td><td class="d-none d-lg-table-cell">${commanddata.presentation_value}</td><td>${commanddata.quantity}</td><td>B/ ${cls_general.val_price(commanddata.price, 2, 1, 1)}</td><td class="text-center"><button class="btn btn-danger" onclick="cls_creditnote.delete('${commanddata.commanddata_id}')"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16"><path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path></svg></button></td>`;
      content += '</tr>';
    })
    return content;
  }
  delete(commanddata_id){
    var i = '';
    cls_creditnote.selected.find((commanddata, index) => { if (commanddata.commanddata_id === commanddata_id) { i = index; } })
    
    // var selected = cls_creditnote.selected.find((commanddata, index) => { if (commanddata_id == commanddata.commanddata_id) { return index } });
    if (cls_general.is_empty_var(i) === 1) {
      cls_creditnote.selected.splice(i,1);
    }
    var content = cls_creditnote.generate_articleselected(cls_creditnote.selected);
    document.getElementById('container_tocancel').innerHTML = content;
  }
  process(charge_slug){
    if (cls_creditnote.selected.length < 1) {
      cls_general.shot_toast_bs('Debe incluir productos.', { bg: 'text-bg-warning' }); return false;
    }
    var reason = document.getElementById('creditnoteReason').value;
    var url = '/creditnote/';
    var method = 'POST';
    var body = JSON.stringify({ a: charge_slug, b: cls_creditnote.selected, c: reason });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_creditnote.selected = [];
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
        cls_charge.index();
        cls_request.render('open', cls_request.open_request);
        cls_request.render('closed', cls_request.closed_request);
        cls_request.render('canceled', cls_charge.charge_list);

      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_creditnote(raw_creditnote) {
    var content = ``;
    raw_creditnote.map((creditnote) => {
      var nully = (creditnote.tx_creditnote_nullification === 1) ? 'Anulaci&oacute;n':'Nota de Cr&eacute;dito';
      content += `<tr class="cursor_pointer">`;
      content += `<td>${cls_general.datetime_converter(creditnote.created_at)}</td><td>${creditnote.tx_creditnote_number}</td><td>${nully}</td><td class="d-none d-lg-table-cell">B/ ${cls_general.val_price(creditnote.tx_creditnote_nontaxable + creditnote.tx_creditnote_taxable, 2, 1, 1)}</td><td class="d-none d-lg-table-cell">B/ ${cls_general.val_price(creditnote.tx_creditnote_tax, 2, 1, 1)}</td><td class="d-none d-lg-table-cell">B/ ${cls_general.val_price(creditnote.tx_creditnote_nontaxable+creditnote.tx_creditnote_taxable+creditnote.tx_creditnote_tax, 2, 1, 1)}</td>`;
      content += '</tr>';
    })
    return content;
  }
}