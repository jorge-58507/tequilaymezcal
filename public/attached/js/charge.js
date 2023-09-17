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
          <span>${cls_general.datetime_converter(request.created_at)}</span>
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

              cls_charge.show(request_slug)


              // cls_request.render('open', cls_request.open_request);
              // cls_request.render('closed', cls_request.closed_request);

              // cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
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
            var limit = document.getElementById('openrequestLimit').value;
            break;
          case "1":
            var haystack = cls_request.closed_request;
            var limit = document.getElementById('closedrequestLimit').value;
            break;
        }
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          if (i == limit) {  break;  }
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
  reload() {
    var url = '/request/reload';
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_request.open_request = obj.data.open_request;
        cls_request.closed_request = obj.data.closed_request;
        cls_request.filter('closed', document.getElementById('filter_closedrequest').value);
        cls_request.filter('open', document.getElementById('filter_openrequest').value);
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }

}
class class_charge{
  constructor(charge_list=''){
    this.charge_request=[];
    this.charge_list = charge_list;
  }
  
  index(){
    var content = `    
    <div class="col-sm-12 text-center">
      <div class="dropdown">
        <button class="btn btn-success dropdown-toggle btn-lg" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Caja
        </button>
        <ul class="dropdown-menu fs_30">
          <li><a class="dropdown-item" href="#" onclick="event.preventDefault(); cls_cashoutput.openmodal();" >Caja Menuda</a></li>
          <li><a class="dropdown-item" href="#" onclick="event.preventDefault(); cls_client.index();"         >Clientes</a></li>
          <li><a class="dropdown-item" href="#" onclick="event.preventDefault(); cls_creditnote.index();"     >Notas de Cr&eacute;dito</a></li>
          <li><a class="dropdown-item" href="#" onclick="event.preventDefault(); cls_cashregister.create();"  >Cierre de Caja</a></li>
        </ul>
      </div>
    </div>
    <div class="col-md-12 col-lg-12">
      <div class="row">
        <div class="col-md-6 col-lg-1">
          <h5>Pedidos</h5>
        </div>
        <div class="col-md-6 col-lg-11">
          <button class="btn btn-info" type="button" id="btn_reloadrequest" onclick="cls_request.reload()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
          </button>
        </div>
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
                  <button class="btn btn-outline-secondary" type="button" id="btn_filterClosedRequest" onclick="cls_request.filter('closed',document.getElementById('filter_closedrequest').value)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="col-md-12 col-lg-6 pt-3">
                <div class="input-group mb-3">
                  <label class="input-group-text" for="closedrequestLimit">Mostrar</label>
                  <select id="closedrequestLimit" class="form-select">
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
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
                  <input type="text" id="filter_openrequest"  class="form-control" placeholder="Buscar por C&oacute;digo, t&iacute;tulo o mesa." onkeyup="cls_request.filter('open',this.value)">
                  <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_request.filter('open',document.getElementById('filter_openrequest').value)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="col-md-12 col-lg-6 pt-3">
                <div class="input-group mb-3">
                  <label class="input-group-text" for="openrequestLimit">Mostrar</label>
                  <select id="openrequestLimit" class="form-select">
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
              <div id='container_openrequest' class="col-md-12">

              </div>
            </div>
          </div>
          <div class="tab-pane fade v_scrollable col-sm-12"             id="tab_canceledrequest"  role="tabpanel" aria-labelledby="profile-tab" tabindex="0"  style="max-height: 80vh;">
            <div class="row">
              <div class="col-md-12 col-lg-3">
                <div class="input-group my-3">
                  <input type="text" id="filter_canceledrequest" class="form-control" placeholder="Buscar por C&oacute;digo, t&iacute;tulo o mesa." onkeyup="cls_request.filter('canceled',this.value)">
                  <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_request.filter('canceled',document.getElementById('filter_canceledrequest').value)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="col-md-6 col-lg-3">
                <div class="input-group my-3">
                  <label class="input-group-text" for="canceledFromDatefilter">Desde</label>
                  <input type="text" name="canceledFromDatefilter" id="canceledFromDatefilter" class="form-control" value="" readonly onkeyup="this.value = ''">
                </div>
              </div>
              <div class="col-md-6 col-lg-3">
                <div class="input-group my-3">
                  <label class="input-group-text" for="canceledToDatefilter">Hasta</label>
                  <input type="text" name="canceledToDatefilter" id="canceledToDatefilter" class="form-control" value="" readonly onkeyup="this.value = ''">
                </div>
              </div>
              <div class="col-md-12 col-lg-3 pt-3">
                <div class="input-group mb-3">
                  <label class="input-group-text" for="canceledrequestLimit">Mostrar</label>
                  <select id="canceledrequestLimit" class="form-select">
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
              <div id='container_canceledrequest' class="col-md-12">

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>`;
    
    document.getElementById('container_request').innerHTML = content;
    cls_request.render('open', cls_request.open_request.slice(0, 10));
    cls_request.render('closed', cls_request.closed_request.slice(0, 10));
    cls_request.render('canceled', cls_charge.charge_list.slice(0, 10));

    $(function () {
      var dateFormat = "mm/dd/yy",
        from = $("#canceledFromDatefilter")
          .datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1
          })
          .on("change", function () {
            // to.datepicker( "option", "maxDate", '+30d' );
            to.datepicker("option", "minDate", getDate(this));
          }),
        to = $("#canceledToDatefilter").datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 1
        })
          .on("change", function () {
            from.datepicker("option", "maxDate", getDate(this));
            // from.datepicker( "option", "minDate", '-30d' );
          });

      function getDate(element) {
        var raw_value = (element.value).split('-');
        var date_value = raw_value[1] + '/' + raw_value[0] + '/' + raw_value[2];
        var date;
        try {
          date = $.datepicker.parseDate(dateFormat, date_value);
        } catch (error) {
          date = null;
        }
        return date;
      }
    });

  }
  show(request_slug){
    document.getElementById('giftcardModal_content').innerHTML = '';
    document.getElementById('giftcardModal_footer').innerHTML = '';
    cls_payment.payment = [];    
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
              <div class="col-md-12 col-lg-6 text-truncate" onclick=cls_charge.create_discount('${request_slug}')><span>Descuento</span><span id="sp_discount" class="float_right fs_20"></span></div>
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
            <input type="text" id="paymentAmount" class="form-control" onfocus="cls_general.validFranz(this.id,['number'],'.')" value="">
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
            <button type="button" class="btn btn-secondary btn-lg" onclick="cls_charge.index()">Volver</button>
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
    $(function () {
      $('#paymentAmount').keyboard({ layout: 'num'});
    });
    $(function () {
      $('#paymentNumber').keyboard();
    });
  }
  look_for(str) {
    return new Promise(resolve => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        // var haystack = cls_charge.charge_list;
        var limit = document.getElementById('canceledrequestLimit').value;
        var date_i = document.getElementById('canceledFromDatefilter').value;
        var date_f = document.getElementById('canceledToDatefilter').value;
        let fechaFrom = new Date(cls_general.date_converter('dmy', 'ymd', date_i))
        let fechaTo = new Date(cls_general.date_converter('dmy', 'ymd', date_f))
        let yearDiff = fechaTo.getFullYear() - fechaFrom.getFullYear();
        let MonthDiff = fechaTo.getMonth() - fechaFrom.getMonth();
        if (yearDiff > 0) {
          cls_general.shot_toast_bs('El rango de fecha debe ser maximo 30 dias.', { bg: 'text-bg-warning' }); return false;
        }
        if (MonthDiff > 1) {
          cls_general.shot_toast_bs('El rango de fecha debe ser maximo 30 dias.', { bg: 'text-bg-warning' }); return false;
        }

        if (cls_general.is_empty_var(str) === 0) {
          // cls_general.shot_toast_bs('Ingrese el codigo o título.', { bg: 'text-bg-warning' }); return false;
          str = ' '
        }
        if (cls_general.is_empty_var(date_i) === 0 || cls_general.is_empty_var(date_f) === 0) {
          cls_general.shot_toast_bs('Ingrese las fechas.', { bg: 'text-bg-warning' }); return false;
        }

        var url = '/charge/' + date_i + "/" + date_f + "/" + limit;
        var method = 'POST';
        var body = JSON.stringify({ a: str });
        var funcion = function (obj) {
          if (obj.status === 'success') {
            var haystack = obj.data.canceled;
            var needles = str.split(' ');
            var raw_filtered = [];
            for (var i in haystack) {
              if (i == limit) { break;  }
              var ocurrencys = 0;
              for (const a in needles) {
                if (haystack[i]['tx_client_name'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_charge_number'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_request_title'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_table_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
              }
              if (ocurrencys === needles.length) {
                raw_filtered.push(haystack[i]);
              }
            }
            resolve(raw_filtered)
          } else {
            cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
          }
        }
        cls_general.async_laravel_request(url, method, funcion, body);
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
          <div class="col-md-6 col-lg-3 d-grid gap-2 py-2">
            <button id="btn_chargePrint" class="btn btn-lg btn-info text-truncate">Imprimir</button>
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

    document.getElementById('btn_chargeCreditnote').addEventListener('click', () => { cls_charge.loginuser_creditnote(charge_slug); });
    document.getElementById('btn_chargePrint').addEventListener('click', () => { cls_charge.loginuser_reprint(charge_slug); });
  }
  loginuser_creditnote(charge_slug) {
    document.getElementById('hd_charge_creditnote').value = charge_slug;
    const modal_inspect = bootstrap.Modal.getInstance('#inspectModal');
    modal_inspect.hide();

    const modal = new bootstrap.Modal('#login_creditnoteModal', {})
    modal.show();
    setTimeout(() => {
      document.getElementById('useremailCreditnote').focus();
    }, 1000);
  }
  checklogin_creditnote() {
    var email = document.getElementById('useremailCreditnote').value;
    var password = document.getElementById('userpasswordCreditnote').value;
    var charge_slug = document.getElementById('hd_charge_creditnote').value;

    if (cls_general.is_empty_var(email) === 0 || cls_general.is_empty_var(password) === 0) {
      cls_general.shot_toast_bs("Ingrese el usuario y contraseña");
    }
    var url = '/checklogin_creditnote/';
    var method = 'POST';
    var body = JSON.stringify({ a: email, b: password });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_charge.make_creditnote(charge_slug);
        document.getElementById('useremailCreditnote').value = '';
        document.getElementById('userpasswordCreditnote').value = '';

        const modal_inspect = bootstrap.Modal.getInstance('#login_creditnoteModal');
        modal_inspect.hide();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

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
        cls_creditnote.render(charge_slug, charge.tx_charge_number, charge.created_at, charge.tx_client_name, raw_article, obj.data.creditnote, obj.data.payment)
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }

  loginuser_reprint(charge_slug){
    document.getElementById('hd_charge').value = charge_slug;
    const modal_inspect = bootstrap.Modal.getInstance('#inspectModal');
    modal_inspect.hide();

    const modal = new bootstrap.Modal('#print_chargeModal', {})
    modal.show();
    setTimeout(() => {
      document.getElementById('useremailReprint').focus();
    }, 1000);
  }
  checklogin_reprint() {
    var email = document.getElementById('useremailReprint').value;
    var password = document.getElementById('userpasswordReprint').value;
    var charge_slug = document.getElementById('hd_charge').value;

    if (cls_general.is_empty_var(email) === 0 || cls_general.is_empty_var(password) === 0) {
      cls_general.shot_toast_bs("Ingrese el usuario y contraseña");
    }
    var url = '/checklogin_reprint/';
    var method = 'POST';
    var body = JSON.stringify({a: email, b: password});
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_charge.print(charge_slug);
        document.getElementById('useremailReprint').value = '';
        document.getElementById('userpasswordReprint').value = '';

        const modal_inspect = bootstrap.Modal.getInstance('#print_chargeModal');
        modal_inspect.hide();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
  print(charge_slug){
    // cls_general.print_html('/print_charge/' + charge_slug);
    var url = '/print_charge/'+charge_slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

  create_discount(request_slug){
    swal({
      title: 'Porcentaje de Descuento',
      text: "Ingrese el porcentaje que desea descontar.",

      content: {
        element: "input",
        attributes: {
          placeholder: "porcentaje",
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
      var url = '/command/' + request_slug + '/discount';
      var method = 'PUT';
      var body = JSON.stringify({ a: quantity});
      var funcion = function (obj) {
        if (obj.status === 'success') {
          cls_charge.show(request_slug);
        } else {
          cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
        }
      }
      cls_general.async_laravel_request(url, method, funcion, body);
    });
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
    document.getElementById('container_paymentMethod').innerHTML = cls_paymentmethod.generate_paymentbutton(cls_paymentmethod.paymentmethod) + `
      <div class="col-md-6 col-lg-3 d-grid gap-2 pb-4">
        <button type="button" class="btn btn-secondary h_90" onclick="cls_giftcard.select_giftcard()">Cup&oacute;n</button>
      </div>    
    `;
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
    this.giftcard = [];
  }
  add_giftcard(giftcard, amount){
    if (cls_general.is_empty_var(amount) === 0) {  //VERIFICA QUE EL MONTO INGRESADO NO ESTE VACIO
      cls_general.shot_toast_bs('Ingrese el monto.', { bg: 'text-bg-warning' }); return false;
    }
    if (isNaN(amount)) {  //VERIFICA EL MONTO INGRESADO ES UN NUMERO
      cls_general.shot_toast_bs('Monto erroneo.', { bg: 'text-bg-warning' }); return false;
    }
    var received = 0;
    cls_payment.payment.map((pay) => { received += parseFloat(pay.amount) })
    cls_payment.giftcard.map((pay) => { received += parseFloat(pay.amount) })
    var total = cls_general.val_dec(cls_charge.charge_request.total, 2, 1, 1);
    total = parseFloat(total);
    if (total <= received) {
      cls_general.shot_toast_bs('Ya se complet&oacute; el pago.', { bg: 'text-bg-warning' }); return false;
    } else {
      if ((received + amount) > total) {
        cls_general.shot_toast_bs('M&eacute;todo de pago, no admite cambio.', { bg: 'text-bg-warning' }); return false;
      }
    }
    cls_payment.giftcard.push({ giftcard_id: giftcard.ai_giftcard_id, giftcard_number: giftcard.tx_giftcard_number, method_name: "Cupon", amount: amount });
    
    cls_payment.render();
    // LAS GIFTCARD SE AGREGAN AL ARRAY DE PAYMENT Y SE MUESTRA EN LA LISTA, AL PASAR A PROCESAR BAJAR LOS MONTOS DE CADA GIFTCARD
  }
  add(method){
    let number = document.getElementById('paymentNumber').value;
    let amount = parseFloat(document.getElementById('paymentAmount').value);

    var check_method = cls_paymentmethod.paymentmethod.find((pmethod) => { return pmethod.ai_paymentmethod_id === method })
    if (cls_general.is_empty_var(amount) === 0 ) {  //VERIFICA QUE EL MONTO INGRESADO NO ESTE VACIO
      cls_general.shot_toast_bs('Ingrese el monto.', { bg: 'text-bg-warning' }); return false;
    }
    if (cls_general.is_empty_var(check_method) === 0) { //VERIFICA QUE EL METODO INGRESADO EXISTA
      cls_general.shot_toast_bs('M&eacute;todo erroneo.', { bg: 'text-bg-warning' }); return false;
    }
    if (isNaN(amount)) {  //VERIFICA EL MONTO INGRESADO ES UN NUMERO
      cls_general.shot_toast_bs('Monto erroneo.', { bg: 'text-bg-warning' }); return false;
    }
    var received = 0;
    cls_payment.payment.map((pay) => { received += parseFloat(pay.amount) })
    cls_payment.giftcard.map((pay) => { received += parseFloat(pay.amount) })
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
    let content_payment = cls_payment.generate_payment_list(cls_payment.payment, cls_payment.giftcard);
    if (cls_payment.payment.length > 0 || cls_payment.giftcard.length > 0) {
      document.getElementById('btn_paymentProcess').classList.remove('display_none');
    } else {
      document.getElementById('btn_paymentProcess').classList.add('display_none');
    }
    document.getElementById('container_payment').innerHTML = content_payment;
    document.getElementById('paymentAmount').value = '';
    document.getElementById('paymentAmount').focus();
    document.getElementById('paymentNumber').value = '';
  }
  generate_payment_list(raw_payment,raw_giftcard){
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

    raw_giftcard.map((giftcard, index) => {
      var number = (cls_general.is_empty_var(giftcard.giftcard_number) === 0) ? '' : '(' + giftcard.giftcard_number + ')';
      payment_list += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${cls_general.val_price(giftcard.amount, 2, 1, 1)} ${number} ${giftcard.method_name}
          <button class="btn btn-warning" type="button" onclick="cls_payment.erase_giftcard(${index})">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
            </svg>
          </button>
        </li>
      `
      received += parseFloat(giftcard.amount);
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
  erase_giftcard(i) {
    cls_payment.giftcard.splice(i, 1);
    cls_payment.render();
  }
  process(btn,request_slug){
    cls_general.disable_submit(btn)
    var raw_payment = cls_payment.payment;
    let received = 0
    raw_payment.map((payment) => { received += payment.amount; });
    cls_payment.giftcard.map((payment) => { received += payment.amount; });
    let total_request = parseFloat(cls_charge.charge_request.total);
    if (total_request > received) {
      cls_general.shot_toast_bs('Aun existe diferencia.',{bg: 'text-bg-warning'}); return false;
    }
    var url = '/paydesk/';
    var method = 'POST';
    var body = JSON.stringify({ a: request_slug, b: raw_payment, c: cls_payment.giftcard });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
        cls_payment.payment = [];
        cls_payment.giftcard = [];
        // cls_charge.print(obj.data.slug);
        window.location.reload();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
}
class class_creditnote{
  constructor(active,inactive){
    this.creditnote_charge = [];
    this.selected = [];
    this.active_list = active;
    this.inactive_list = inactive;
    this.pass = 'jadecafe2023';
  }
  index(){
    var content = `
    
      <div class="row">
        <div class="col-sm-12 text-center">
          <div class="dropdown">
            <button class="btn btn-success dropdown-toggle btn-lg" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Caja
            </button>
            <ul class="dropdown-menu fs_30">
              <li><a class="dropdown-item" href="#" onclick="event.preventDefault(); cls_cashoutput.openmodal();" >Caja Menuda</a></li>
              <li><a class="dropdown-item" href="#" onclick="event.preventDefault(); cls_client.index();"         >Clientes</a></li>
              <li><a class="dropdown-item" href="#" onclick="event.preventDefault(); cls_charge.index();"         >Caja</a></li>
              <li><a class="dropdown-item" href="#" onclick="event.preventDefault(); cls_cashregister.create();"  >Cierre de Caja</a></li>
            </ul>
          </div>
        </div>

        <div class="col-sm-12">
          <h5>Notas de Cr&eacute;dito</h5>
        </div>
        <div class="col-md-12 col-lg-6">
          <div class="input-group my-3">
            <input type="text" id="filter_creditnote" class="form-control" placeholder="Buscar por Cliente o Numero." onkeyup="cls_creditnote.filter(this.value,document.getElementById('creditnoteLimit').value)">
            <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_creditnote.filter(document.getElementById('filter_creditnote').value,document.getElementById('creditnoteLimit').value)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="col-md-12 col-lg-6 pt-3">
          <div class="input-group mb-3">
            <label class="input-group-text" for="creditnoteLimit">Mostrar</label>
            <select id="creditnoteLimit" class="form-select">
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        <div id="container_creditnote" class="col-md-12 v_scrollable" style="max-height: 60vh;">
        </div>
      </div>
    `;

    document.getElementById('container_request').innerHTML = content;
    cls_creditnote.filter('', document.getElementById('creditnoteLimit').value)
  }
  generate_list(raw_active){
    var active_list = '<ul class="list-group">';
    for (const a in raw_active) {
      active_list += `
        <li class="list-group-item cursor_pointer d-flex justify-content-between align-items-start" onclick="cls_creditnote.inspect(${raw_active[a].ai_creditnote_id})">
          <div class="ms-2 me-auto">
            <div class="fw-bold"><h5>${raw_active[a].tx_creditnote_number} - ${raw_active[a].tx_client_name}</h5></div>
          </div>
          <span class="badge bg-secondary fs_20">B/ ${(raw_active[a].tx_creditnote_nontaxable + raw_active[a].tx_creditnote_taxable + raw_active[a].tx_creditnote_tax).toFixed(2)}</span>
          &nbsp;&nbsp;&nbsp;
          <span>${cls_general.datetime_converter(raw_active[a].created_at)}</span>
        </li>
      `;
    }
    active_list += '</ul>';

    return active_list;
  }
  inspect(creditnote_id) {
    var url = '/creditnote/'+creditnote_id;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var info = obj.data.info;
        var raw_data = obj.data.article;

        cls_creditnote.render_inspect(info,raw_data);

        const modal = new bootstrap.Modal('#inspectModal', {})
        modal.show();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  render_inspect(info,raw_data) {
    var article_list = '';
    raw_data.map((article) => {
      var discount = ((article.tx_commanddata_discountrate * article.tx_commanddata_price) / 100); discount = discount.toFixed(2);
      var price = article.tx_commanddata_price - parseFloat(discount);
      article_list += `
        <li class="list-group-item d-flex justify-content-between align-items-start fs_20">
          <div class="ms-2 me-auto text-truncate">
            ${article.tx_datacreditnote_quantity} - ${article.tx_commanddata_description}
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
            <input type="text" id="" class="form-control" value="${info.tx_creditnote_number}" readonly>
          </div>
          <div class="col-md-6 col-lg-3">
            <label class="form-label" for="">Fecha</label>
            <input type="text" id="" class="form-control" value="${cls_general.datetime_converter(info.created_at)}" readonly>
          </div>
          <div class="col-md-12 col-lg-6">
            <label class="form-label" for="">Cliente</label>
            <input type="text" id="" class="form-control" value="${info.tx_client_name}" readonly>
          </div>
          <div class="col-md-6 col-lg-3">
            <label class="form-label" for="">No imponible</label>
            <input type="text" id="" class="form-control" value="${cls_general.val_price(info.tx_creditnote_nontaxable, 2, 1, 1)}" readonly>
          </div>
          <div class="col-md-6 col-lg-3">
            <label class="form-label" for="">Imponible</label>
            <input type="text" id="" class="form-control" value="${cls_general.val_price(info.tx_creditnote_taxable, 2, 1, 1)}" readonly>
          </div>
          <div class="col-md-6 col-lg-3">
            <label class="form-label" for="">Impuesto</label>
            <input type="text" id="" class="form-control" value="${cls_general.val_price(info.tx_creditnote_tax, 2, 1, 1)}" readonly>
          </div>
          <div class="col-md-6 col-lg-3">
            <label class="form-label" for="">Total</label>
            <input type="text" id="" class="form-control" value="${cls_general.val_price((info.tx_creditnote_nontaxable + info.tx_creditnote_taxable + info.tx_creditnote_tax).toFixed(2), 2, 1, 1)}" readonly>
          </div>
          <div class="col-md-12 col-lg-6">
            <label class="form-label" for="">Motivo</label>
            <input type="text" id="" class="form-control" value="${info.tx_creditnote_reason}" readonly>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
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
    document.getElementById('inspectModal_title').innerHTML = 'Inspeccionar Nota de Cr&eacute;dito';
  }
  async filter(str, limit) {
    document.getElementById('container_creditnote').innerHTML = cls_creditnote.generate_list(await cls_creditnote.look_for(str, limit));
  }
  look_for(str, limit) {
    return new Promise(resolve => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        var haystack = cls_creditnote.active_list;
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          if (i == limit) { break; }
          var ocurrencys = 0;
          for (const a in needles) {
            if (haystack[i]['tx_client_name'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_client_cif'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_creditnote_number'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
          }
          if (ocurrencys === needles.length) {
            raw_filtered.push(haystack[i]);
          }
        }
        resolve(raw_filtered)
      }, 500)
    });
  }



  render(charge_slug,number,date,client,raw_article,raw_creditnote, payment){
    var article_charge = cls_creditnote.generate_articlecharge(raw_article);
    var creditnote_list = cls_creditnote.generate_creditnote(raw_creditnote);
    var check_methoddebit = payment.find((pay) => { return pay.payment_ai_paymentmethod_id === 3 })
    var btn_nullify = (raw_creditnote.length === 0 && payment.length === 1 && check_methoddebit === undefined) ? `<button type="button" id="btn_creditnoteNullify" class="btn btn-danger btn-lg" onclick="cls_creditnote.nullify('${charge_slug}')">Anular</button>` : '';

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
            ${btn_nullify}
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
    document.getElementById('btn_creditnoteProcess').addEventListener('click', ()=>{  cls_creditnote.process(charge_slug);  });

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
    cls_general.disable_submit(document.getElementById('btn_creditnoteProcess'));
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
  nullify(charge_slug){
    swal({
      title: "¿Desea anular esta factura?",
      text: "Se creará una salida.",
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
            var url = '/creditnote/' + charge_slug + '/nullify';
            var method = 'POST';
            var body = JSON.stringify({ a: charge_slug, c: 'ANULADA' });
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
          break;
          case 'no':

            break;
        }
      });
  }
}
class class_cashoutput{
  openmodal(){
    var url = '/cashoutput/';
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('container_cashoutputlist').innerHTML = cls_cashoutput.generate_cashoutput(obj.data.cashoutputlist);
        var date = cls_general.getDate();
        document.getElementById('cashoutputDateshow').innerHTML = cls_general.date_converter('ymd', 'dmy', date[0]);
        document.getElementById('cashoutputDatefilter').value = cls_general.date_converter('ymd','dmy',date[0]);

        const modal = new bootstrap.Modal('#cashoutputModal', {})
        modal.show();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  save(){
    var type = document.getElementById('cashoutputType').value;
    var amount = document.getElementById('cashoutputAmount').value;
    var reason = document.getElementById('cashoutputReason').value;

    if (cls_general.is_empty_var(reason) === 0 || cls_general.is_empty_var(amount) === 0) {
      cls_general.shot_toast_bs('Debe ingresar un monto y un motivo valido.', { bg: 'text-bg-warning' });
      return false;
    }
    if (isNaN(amount)) {
      cls_general.shot_toast_bs('Debe introducir un numero.', { bg: 'text-bg-warning' });
      return false;
    }
    var amount = cls_general.val_dec(parseFloat(amount));

    var url = '/cashoutput/';
    var method = 'POST';
    var body = JSON.stringify({a: type, b: amount, c: reason});
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('container_cashoutputlist').innerHTML = cls_cashoutput.generate_cashoutput(obj.data.outputlist);
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
        document.getElementById('cashoutputAmount').value = '';
        document.getElementById('cashoutputReason').value = '';
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_cashoutput(list){
    var content = '<ol class="list-group list-group-numbered">';
    list.map((cashoutput)=>{
      var type=(cashoutput.tx_cashoutput_type === 1) ? 'Salida' : 'Entrada';
      content += `
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">${type}</div>
            ${cashoutput.tx_cashoutput_reason}
          </div>
          <span class="badge bg-primary rounded-pill">B/ ${ cls_general.val_price(cashoutput.tx_cashoutput_amount,2,1,1)}</span>
        </li>
      `;
    })
    content += '</ol>'
    return content;
  }
  show(date){
    var url = '/cashoutput/'+date;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('container_cashoutputlist').innerHTML = cls_cashoutput.generate_cashoutput(obj.data.cashoutputlist);
        document.getElementById('cashoutputDateshow').innerHTML = date;
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
}
class class_cashregister{
  generate_list(list){
    var content = '<ol class="list-group list-group-numbered">';
    list.map((cashregister) => {
      content += `
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">Venta Neta: ${cashregister['tx_cashregister_netsale']}</div>
          </div>
          <button class="badge btn btn-info" onclick="cls_cashregister.print_cashregister(${cashregister['ai_cashregister_id']})">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-printer-fill" viewBox="0 0 16 16">
              <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>
              <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
            </svg><br/> Reimprimir
          </button>
          &nbsp;&nbsp;
          <button class="badge btn btn-info" onclick="cls_cashregister.show(${cashregister['ai_cashregister_id']})">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-printer-fill" viewBox="0 0 16 16">
              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
            </svg><br/> Ver
          </button>
          &nbsp;&nbsp;
          <button class="badge btn btn-warning" onclick="cls_cashregister.print_commanddata(${cashregister['ai_cashregister_id']})">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-printer-fill" viewBox="0 0 16 16">
              <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>
              <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
            </svg><br/> Comandas
          </button>
          &nbsp;&nbsp;

        </li>
      `;
    })
    content += '</ol>'
    return content;
  }
  print_cashregister(cashregister_id){
    var url = '/print_cashregister/' + cashregister_id;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

    // cls_general.print_html('/print_cashregister/'+cashregister_id);
  }
  print_commanddata(cashregister_id) {
    var url = '/print_commanddata/' + cashregister_id;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

    // cls_general.print_html('/print_cashregister/'+cashregister_id);
  }

  create(){
    var today = cls_general.getDate();
    var url = '/charge/' + today[0] +'/cashregister';
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('cashregisterDatefilter').value = cls_general.date_converter('ymd', 'dmy', today[0]);
        var cashregister_list = cls_cashregister.generate_list(obj.data.cashregister.cashregister_list);
        document.getElementById('container_cashregisterFiltered').innerHTML = '<span>Listado de Cierres de Caja</span>'+cashregister_list;

        var incomeCashout     = (cls_general.is_empty_var(obj.data.cashregister.cashoutput.in) === 0)         ? 0 : obj.data.cashregister.cashoutput.in;
        var outcomeCashout    = (cls_general.is_empty_var(obj.data.cashregister.cashoutput.out) === 0)        ? 0 : obj.data.cashregister.cashoutput.out;
        var nullifiedCashout  = (cls_general.is_empty_var(obj.data.cashregister.cashoutput.nullified) === 0)  ? 0 : obj.data.cashregister.cashoutput.nullified;
        document.getElementById('span_totalCashout').innerHTML       = 'B/ ' + cls_general.val_price(incomeCashout - outcomeCashout, 2, 1, 1);
        document.getElementById('span_incomeCashout').innerHTML      = 'B/ ' + cls_general.val_price(incomeCashout, 2, 1, 1);
        document.getElementById('span_outcomeCashout').innerHTML     = 'B/ ' + cls_general.val_price(outcomeCashout, 2, 1, 1);
        document.getElementById('span_nullifiedCashout').innerHTML   = 'B/ ' + cls_general.val_price(nullifiedCashout, 2, 1, 1);

        var incomeCash = (cls_general.is_empty_var(obj.data.cashregister.payment[1]) === 0) ? 0 : obj.data.cashregister.payment[1];
        var returnCash = (cls_general.is_empty_var(obj.data.cashregister.returnpayment[1]) === 0) ? 0 : obj.data.cashregister.returnpayment[1];
        document.getElementById('span_totalCash').innerHTML         = 'B/ ' + cls_general.val_price(incomeCash - returnCash, 2, 1, 1);
        document.getElementById('span_incomeCash').innerHTML        = 'B/ ' + cls_general.val_price(incomeCash, 2, 1, 1);
        document.getElementById('span_returnCash').innerHTML        = 'B/ ' + cls_general.val_price(returnCash, 2, 1, 1);

        var incomeCheck = (cls_general.is_empty_var(obj.data.cashregister.payment[2]) === 0) ? 0 : obj.data.cashregister.payment[2];
        var returnCheck = (cls_general.is_empty_var(obj.data.cashregister.returnpayment[2]) === 0) ? 0 : obj.data.cashregister.returnpayment[2];
        document.getElementById('span_totalCheck').innerHTML        = 'B/ ' + cls_general.val_price(incomeCheck - returnCheck, 2, 1, 1);
        document.getElementById('span_incomeCheck').innerHTML       = 'B/ ' + cls_general.val_price(incomeCheck, 2, 1, 1);
        document.getElementById('span_returnCheck').innerHTML       = 'B/ ' + cls_general.val_price(returnCheck, 2, 1, 1);

        document.getElementById('span_totalDebitcard').innerHTML    = (cls_general.is_empty_var(obj.data.cashregister.payment[3]) === 0) ? 'B/ ' + cls_general.val_price(0, 2, 1, 1) : 'B/ ' + cls_general.val_price(obj.data.cashregister.payment[3], 2, 1, 1);
        document.getElementById('span_incomeDebitcard').innerHTML   = (cls_general.is_empty_var(obj.data.cashregister.payment[3]) === 0) ? 'B/ ' + cls_general.val_price(0, 2, 1, 1) : 'B/ ' + cls_general.val_price(obj.data.cashregister.payment[3], 2, 1, 1);
        document.getElementById('span_returnDebitcard').innerHTML   = 'B/ ' + cls_general.val_price(0, 2, 1, 1);

        var incomeCreditcard = (cls_general.is_empty_var(obj.data.cashregister.payment[4]) === 0) ? 0 : obj.data.cashregister.payment[4];
        var returnCreditcard = (cls_general.is_empty_var(obj.data.cashregister.returnpayment[4]) === 0) ? 0 : obj.data.cashregister.returnpayment[4];
        document.getElementById('span_totalCreditcard').innerHTML   = 'B/ ' + cls_general.val_price(incomeCreditcard - returnCreditcard, 2, 1, 1);
        document.getElementById('span_incomeCreditcard').innerHTML  = 'B/ ' + cls_general.val_price(incomeCreditcard, 2, 1, 1);
        document.getElementById('span_returnCreditcard').innerHTML  = 'B/ ' + cls_general.val_price(returnCreditcard, 2, 1, 1);

        var incomeYappi = (cls_general.is_empty_var(obj.data.cashregister.payment[5]) === 0) ? 0 : obj.data.cashregister.payment[5];
        var returnYappi = (cls_general.is_empty_var(obj.data.cashregister.returnpayment[5]) === 0) ? 0 : obj.data.cashregister.returnpayment[5];
        document.getElementById('span_totalYappi').innerHTML        = 'B/ ' + cls_general.val_price(incomeYappi - returnYappi, 2, 1, 1)
        document.getElementById('span_incomeYappi').innerHTML       = 'B/ ' + cls_general.val_price(incomeYappi, 2, 1, 1)
        document.getElementById('span_returnYappi').innerHTML       = 'B/ ' + cls_general.val_price(returnYappi, 2, 1, 1)

        var incomeNequi = (cls_general.is_empty_var(obj.data.cashregister.payment[6]) === 0) ? 0 : obj.data.cashregister.payment[6];
        var returnNequi = (cls_general.is_empty_var(obj.data.cashregister.returnpayment[6]) === 0) ? 0 : obj.data.cashregister.returnpayment[6];
        document.getElementById('span_totalNequi').innerHTML        = 'B/ ' + cls_general.val_price(incomeNequi - returnNequi, 2, 1, 1);
        document.getElementById('span_incomeNequi').innerHTML       = 'B/ ' + cls_general.val_price(incomeNequi, 2, 1, 1);
        document.getElementById('span_returnNequi').innerHTML       = 'B/ ' + cls_general.val_price(returnNequi, 2, 1, 1);

        var incomeAnother = (cls_general.is_empty_var(obj.data.cashregister.payment[7]) === 0) ? 0 : obj.data.cashregister.payment[7];
        var returnAnother = (cls_general.is_empty_var(obj.data.cashregister.returnpayment[7]) === 0) ? 0 : obj.data.cashregister.returnpayment[7];
        document.getElementById('span_totalAnother').innerHTML      = 'B/ ' + cls_general.val_price(incomeAnother - returnAnother, 2, 1, 1);
        document.getElementById('span_incomeAnother').innerHTML     = 'B/ ' + cls_general.val_price(incomeAnother, 2, 1, 1);
        document.getElementById('span_returnAnother').innerHTML     = 'B/ ' + cls_general.val_price(returnAnother, 2, 1, 1);
        
        var incomeGiftcard = (cls_general.is_empty_var(obj.data.cashregister.payment[8]) === 0) ? 0 : obj.data.cashregister.payment[8];
        var returnGiftcard = (cls_general.is_empty_var(obj.data.cashregister.returnpayment[8]) === 0) ? 0 : obj.data.cashregister.returnpayment[8];
        document.getElementById('span_totalGiftcard').innerHTML     = 'B/ ' + cls_general.val_price(incomeGiftcard - returnGiftcard, 2, 1, 1);
        document.getElementById('span_incomeGiftcard').innerHTML    = 'B/ ' + cls_general.val_price(incomeGiftcard, 2, 1, 1);
        document.getElementById('span_returnGiftcard').innerHTML    = 'B/ ' + cls_general.val_price(returnGiftcard, 2, 1, 1);

        var total_giftcardinactive = 0;
        var total_giftcardactive = 0;
        obj.data.cashregister.giftcard.map((giftcard) => {
          var giftcard_payment = JSON.parse(giftcard.tx_giftcard_payment);
          var ttl_giftcard = 0;
          giftcard_payment.map((gp) => {  ttl_giftcard += gp.amount  })
          if (giftcard.tx_giftcard_status === 0) {
            total_giftcardinactive += ttl_giftcard;
          }else{
            total_giftcardactive += ttl_giftcard;
          }
        })
        var activeGiftcard = (cls_general.is_empty_var(total_giftcardactive) === 0) ? 0 : total_giftcardactive;
        var inactiveGiftcard = (cls_general.is_empty_var(total_giftcardinactive) === 0) ? 0 : total_giftcardinactive;
        document.getElementById('span_giftcardactive').innerHTML    = '<p>Cupones Activos</p>B/ ' + cls_general.val_price(activeGiftcard, 2, 1, 1);
        document.getElementById('span_giftcardinactive').innerHTML  = '<p>Cupones inactivos</p>B/ ' + cls_general.val_price(inactiveGiftcard, 2, 1, 1);

        document.getElementById('span_totaldiscount').innerHTML   = 'B/ ' + cls_general.val_price(obj.data.cashregister.discount, 2, 1, 1);
        document.getElementById('span_totalnull').innerHTML       = 'B/ ' + cls_general.val_price(obj.data.cashregister.canceled, 2, 1, 1);
        document.getElementById('span_totalcashback').innerHTML   = 'B/ ' + cls_general.val_price(obj.data.cashregister.cashback, 2, 1, 1);
        document.getElementById('span_grosssale').innerHTML = 'B/ ' + cls_general.val_price(obj.data.cashregister.grosssale, 2, 1, 1);
        document.getElementById('span_netsale').innerHTML   = 'B/ ' + cls_general.val_price(obj.data.cashregister.netsale, 2, 1, 1);
        document.getElementById('span_realsale').innerHTML  = 'B/ ' + cls_general.val_price(obj.data.cashregister.realsale, 2, 1, 1);

        const modal = new bootstrap.Modal('#cashregisterModal', {})
        modal.show();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  save(){
    swal({
      title: "Se cerrará esta caja ¿Desea proseguir?",
      text: "",
      icon: "info",

      buttons: {
        si: {
          text: "Si, cerrar",
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
          var url = '/cashregister/';
          var method = 'POST';
          var body = '';
          var funcion = function (obj) {
            if (obj.status === 'success') {
              document.getElementById('form_logout').submit()
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
  filter(date){
    date = cls_general.date_converter('dmy','ymd',date);
    var url = '/cashregister/'+date+'/filter';
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('container_cashregisterFiltered').innerHTML = '<span>Listado de Cierres de Caja</span>' + cls_cashregister.generate_list(obj.data.all);
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_inspectedCR(cashregister,payment,canceled,giftcard){
    var title = 'Arqueo del '+cls_general.datetime_converter(cashregister.created_at)+' a las '+cls_general.time_converter(cashregister.created_at);
    var income_cash = (cls_general.is_empty_var(payment[1]) === 1)    ? payment[1] : 0;
    var outcome_cash = (cls_general.is_empty_var(canceled[1]) === 1)  ? payment[1] : 0;

    var income_check = (cls_general.is_empty_var(payment[2]) === 1) ? payment[2] : 0;
    var outcome_check = (cls_general.is_empty_var(canceled[2]) === 1) ? payment[2] : 0;

    var income_debitcard = (cls_general.is_empty_var(payment[3]) === 1) ? payment[3] : 0;
    var outcome_debitcard = (cls_general.is_empty_var(canceled[3]) === 1) ? payment[3] : 0;

    var income_creditcard = (cls_general.is_empty_var(payment[4]) === 1) ? payment[4] : 0;
    var outcome_creditcard = (cls_general.is_empty_var(canceled[4]) === 1) ? payment[4] : 0;

    var income_yappi = (cls_general.is_empty_var(payment[5]) === 1) ? payment[5] : 0;
    var outcome_yappi = (cls_general.is_empty_var(canceled[5]) === 1) ? payment[5] : 0;

    var income_nequi = (cls_general.is_empty_var(payment[6]) === 1) ? payment[6] : 0;
    var outcome_nequi = (cls_general.is_empty_var(canceled[6]) === 1) ? payment[6] : 0;

    var income_another = (cls_general.is_empty_var(payment[7]) === 1) ? payment[7] : 0;
    var outcome_another = (cls_general.is_empty_var(canceled[7]) === 1) ? payment[7] : 0;

    var income_giftcard = (cls_general.is_empty_var(payment[8]) === 1) ? payment[8] : 0;
    var outcome_giftcard = (cls_general.is_empty_var(canceled[8]) === 1) ? payment[8] : 0;


    var content = `
    <div class="row">
      <div class="col-md-12 col-lg-6">
        <table class="table table-bordered">
          <thead>
            <tr class="table-success text-center">
              <th colspan="2">Totales</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Venta Bruta</th>
              <td>${cls_general.val_price(cashregister.tx_cashregister_grosssale,2,1,1)}</td>
            </tr>
            <tr>
              <th>Descuento</th>
              <td>${cls_general.val_price(cashregister.tx_cashregister_discount, 2, 1, 1) }</td>
            </tr>
            <tr>
              <th>Venta Neta</th>
              <td>${cls_general.val_price(cashregister.tx_cashregister_netsale, 2, 1, 1) }</td>
            </tr>
            <tr>
              <th>Documentos</th>
              <td>${cls_general.val_price(cashregister.tx_cashregister_quantitydoc, 2, 1, 1) }</td>
            </tr>
            <tr>
              <th>Venta Real</th>
              <td>${cls_general.val_price(cashregister.tx_cashregister_realsale, 2, 1, 1) }</td>
            </tr>
            <tr>
              <th>Devoluci&oacute;n</th>
              <td>${cls_general.val_price(cashregister.tx_cashregister_cashback, 2, 1, 1) }</td>
            </tr>
            <tr>
              <th>Anulado</th>
              <td>${cls_general.val_price(cashregister.tx_cashregister_canceled, 2, 1, 1) }</td>
            </tr>
            <tr>
              <th colspan="2">DESGLOSE ITBMS</th>
            </tr>
            <tr>
              <th>Base No Imponible</th>
              <td>${cls_general.val_price(cashregister.tx_cashregister_nontaxable, 2, 1, 1) }</td>
            </tr>
            <tr>
              <th>Base Imponible</th>
              <td>${cls_general.val_price(cashregister.tx_cashregister_taxable,2,1,1)}</td>
            </tr>
            <tr>
              <th>Base No imponible NC</th>
              <td>${cls_general.val_price(cashregister.tx_cashregister_returnnontaxable,2,1,1)}</td>
            </tr>
            <tr>
              <th>Base imponible NC</th>
              <td>${cls_general.val_price(cashregister.tx_cashregister_returntaxable,2,1,1)}</td>
            </tr>
            <tr>
              <th>Impuesto</th>
              <td>${cls_general.val_price(cashregister.tx_cashregister_tax,2,1,1)}</td>
            </tr>
            <tr>
              <th>Impuesto N.C.</th>
              <td>${cls_general.val_price(cashregister.tx_cashregister_returntax,2,1,1)}</td>
            </tr>                                                                                                                        
          </tbody>
        </table>
      </div>
      <div class="col-md-12 col-lg-6">
        <table class="table table-bordered">
          <thead>
            <tr class="table-success text-center">
              <th colspan="4">Movimientos</th>
            </tr>
            <tr class="table-success text-center">
              <th scope="col">M&eacute;todo de Pago</th>
              <th scope="col">Total</th>
              <th scope="col">Entrada</th>
              <th scope="col">Salida</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Efectivo</th>
              <td class="table-secondary">${cls_general.val_price(income_cash - outcome_cash, 2, 1, 1) }</td>
              <td>${cls_general.val_price(income_cash, 2, 1, 1) }</td>
              <td>${cls_general.val_price(outcome_cash, 2, 1, 1) }</td>
            </tr>
            <tr>
              <th>Cheque</th>
              <td class="table-secondary">${cls_general.val_price(income_check - outcome_check, 2, 1, 1) }</td>
              <td>${cls_general.val_price(income_check, 2, 1, 1) }</td>
              <td>${cls_general.val_price(outcome_check, 2, 1, 1) }</td>
            </tr>
            <tr>
              <th>T. Debito</th>
              <td class="table-secondary">${cls_general.val_price(income_debitcard - outcome_debitcard, 2, 1, 1) }</td>
              <td>${cls_general.val_price(income_debitcard, 2, 1, 1) }</td>
              <td>${cls_general.val_price(outcome_debitcard, 2, 1, 1) }</td>
            </tr>
            <tr>
              <th>T. Cr&eacute;dito</th>
              <td class="table-secondary">${cls_general.val_price(income_creditcard - outcome_creditcard, 2, 1, 1) }</td>
              <td>${cls_general.val_price(income_creditcard, 2, 1, 1) }</td>
              <td>${cls_general.val_price(outcome_creditcard, 2, 1, 1) }</td>
            </tr>
            <tr>
              <th>Yappi</th>
              <td class="table-secondary">${cls_general.val_price(income_yappi - outcome_yappi, 2, 1, 1) }</td>
              <td>${cls_general.val_price(income_yappi, 2, 1, 1) }</td>
              <td>${cls_general.val_price(outcome_yappi, 2, 1, 1) }</td>
            </tr>
            <tr>
              <th>Nequi</th>
              <td class="table-secondary">${cls_general.val_price(income_nequi - outcome_nequi, 2, 1, 1) }</td>
              <td>${cls_general.val_price(income_nequi, 2, 1, 1) }</td>
              <td>${cls_general.val_price(outcome_nequi, 2, 1, 1) }</td>
            </tr>
            <tr>
              <th>Otro</th>
              <td class="table-secondary">${cls_general.val_price(income_another - outcome_another, 2, 1, 1) }</td>
              <td>${cls_general.val_price(income_another, 2, 1, 1) }</td>
              <td>${cls_general.val_price(outcome_another, 2, 1, 1) }</td>
            </tr>
            <tr>
              <th>Cup&oacute;n</th>
              <td class="table-secondary">${cls_general.val_price(income_giftcard - outcome_giftcard, 2, 1, 1)}</td>
              <td>${cls_general.val_price(income_giftcard, 2, 1, 1)}</td>
              <td>${cls_general.val_price(outcome_giftcard, 2, 1, 1) }</td>
            </tr>
          </tbody>
        </table>
        <table class="table table-bordered">
          <thead>
            <tr class="table-success text-center">
              <th colspan="4">Venta de Cupones</th>
            </tr>
            <tr class="table-success text-center">
              <th scope="col">Activos</th>
              <th scope="col">Inactivos</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${cls_general.val_price(giftcard.active, 2, 1, 1)}</td>
              <td>${cls_general.val_price(giftcard.inactive, 2, 1, 1)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    `;

    return {title: title, content: content};
  }
  show(cashregister_id){
    var url = '/cashregister/' + cashregister_id;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var total_giftcard = {active: 0, inactive: 0};
        obj.data.giftcard.map((gc) => {
          var ttl_giftcard = 0;
          var giftcard_payment = JSON.parse(gc.tx_giftcard_payment);
          giftcard_payment.map((gcp) => {
            ttl_giftcard += gcp.amount;
          })
          if (gc.tx_giftcard_status === 0) {
            total_giftcard.inactive += ttl_giftcard;
          }else{
            total_giftcard.active += ttl_giftcard;
          }
        })
        var raw_inspected = cls_cashregister.generate_inspectedCR(obj.data.cashregister, obj.data.payment, obj.data.canceled, total_giftcard)
        document.getElementById('inspectCR_title').innerHTML = raw_inspected.title;
        document.getElementById('inspectCR_container').innerHTML = raw_inspected.content;

        const modal = new bootstrap.Modal('#inspectCRModal', {})
        modal.show();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
}
class class_client{
  constructor(client_list){
    this.client_list = client_list;
  }
  index() {
    var list = cls_client.generate_list(cls_client.client_list, 100)
    var content = `
      <div class="row">
        <div class="col-xs-12 py-2 text-center">
          <button type="button" class="btn btn-lg btn-primary" onclick="cls_client.create()">Crear Cliente</button>
          &nbsp;
          <button type="button" class="btn btn-secondary" onclick="cls_charge.index()">Volver</button>
        </div>
        <div class="col-xs-12">
          <h5>Listado de Clientes</h5>
        </div>
        <div class="col-xs-12 pb-1">
          <input type="text" class="form-control" id="clientFilter" onfocus="cls_general.validFranz(this.id, ['word','number'],'-')" onkeyup="cls_client.filter(this.value,20)" placeholder="Buscar clientes por nombre o cédula" >
        </div>
        <div id="container_clientList" class="col-xs-12 border-top pt-1">
          ${list}
        </div>
      </div>
    `;
    document.getElementById('container_request').innerHTML = content;
  }
  generate_list(client_list, limit) {
    var counter = 1;
    var list = '<div class="list-group">';
    for (const a in client_list) {
      if (counter > limit) { break; }
      var bg = (client_list[a]['tx_client_status'] == '0') ? 'text-bg-secondary' : '';
      var inactive = (client_list[a]['tx_client_status'] == '0') ? ' (INACTIVO)' : '';

      list += `<a href = "#" class="list-group-item list-group-item-action ${bg}" onclick="event.preventDefault(); cls_client.show('${client_list[a]['tx_client_slug']}')" >${client_list[a]['tx_client_name']} (${client_list[a]['tx_client_cif']}) ${inactive}</a>`;
      counter++;
    }
    list += '</div>';
    return list;
  }
  async filter(str, limit) {
    document.getElementById('container_clientList').innerHTML = cls_client.generate_list(await cls_client.look_for(str, limit));
  }
  look_for(str, limit) {
    return new Promise(resolve => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        var haystack = cls_client.client_list;
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          if (i == limit) { break; }
          var ocurrencys = 0;
          for (const a in needles) {
            if (haystack[i]['tx_client_name'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_client_cif'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
          }
          if (ocurrencys === needles.length) {
            raw_filtered.push(haystack[i]);
          }
        }
        resolve(raw_filtered)
      }, 500)
    });
  }
  show(client_slug) {
    var url = '/client/' + client_slug; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      var client = obj['data']['client'];
      var exempt_checked = (client.tx_client_exempt === 1) ? 'checked' : '';
      var status_checked = (client.tx_client_status === 1) ? 'checked' : '';
      var dv = (cls_general.is_empty_var(client.tx_client_dv) === 0) ? '' : client.tx_client_dv;
      var telephone = (cls_general.is_empty_var(client.tx_client_telephone) === 0) ? '' : client.tx_client_telephone;
      var email = (cls_general.is_empty_var(client.tx_client_email) === 0) ? '' : client.tx_client_email;
      var direction = (cls_general.is_empty_var(client.tx_client_direction) === 0) ? '' : client.tx_client_direction;
      var content = `
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col-xs-12">
                <h4>Modificar Cliente</h4>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <label for="clientName" class="form-label">Nombre y Apellido</label>
                <input type="text" readonly id="clientName" name="${client.tx_client_slug}" class="form-control" onfocus="cls_general.validFranz(this.id, ['number','word','punctuation'])" onkeyup="cls_general.limitText(this,120,1)" onblur="cls_general.limitText(this,120,1)" value="${client.tx_client_name}">
              </div>
              <div class="col-md-12 col-lg-6">
                <label for="clientCIF" class="form-label">C&eacute;dula/Pasaporte</label>
                <input type="text" readonly id="clientCIF" class="form-control" onfocus="cls_general.validFranz(this.id, ['number','word'],'-')" onkeyup="cls_general.limitText(this,20,1)" onblur="cls_general.limitText(this,20,1)" value="${client.tx_client_cif}">
              </div>
              <div class="col-md-12 col-lg-2">
                <label for="clientDV" class="form-label">DV</label>
                <input type="text" id="clientDV" class="form-control" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this,4,1)" onblur="cls_general.limitText(this,4,1)" value="${dv}">
              </div>
              <div class="col-md-12 col-lg-4">
                <label for="clientTelephone" class="form-label">Teléfono</label>
                <input type="text" id="clientTelephone" class="form-control" onfocus="cls_general.validFranz(this.id, ['number'],' -')" onkeyup="cls_general.limitText(this,20,1)" onblur="cls_general.limitText(this,20,1)" value="${telephone}">
              </div>
              <div class="col-md-12 col-lg-6">
                <label for="clientEmail" class="form-label">Correo E.</label>
                <input type="email" id="clientEmail" class="form-control" onfocus="cls_general.validFranz(this.id, ['number','word','punctuation'],'_-@')" onkeyup="cls_general.limitText(this,50,1)" onblur="cls_general.limitText(this,50,1)" value="${email}">
              </div>
              <div class="col-md-12">
                <label for="clientDirection" class="form-label">Dirección</label>
                <input type="text" id="clientDirection" class="form-control" onfocus="cls_general.validFranz(this.id, ['number','word','punctuation'])" onkeyup="cls_general.limitText(this,140,1)" onblur="cls_general.limitText(this,140,1)" value="${direction}">
              </div>
              <div class="col-md-12 col-lg-3">
                <div class="form-check form-switch pt_35 display_none">
                  <input class="form-check-input " type="checkbox" role="switch" id="clientExempt" ${exempt_checked} >
                  <label class="form-check-label" for="clientExempt">Exento</label>
                </div>
              </div>
              <div class="col-md-12 col-lg-3">
                <div class="form-check form-switch pt_35 display_none">
                  <input class="form-check-input" type="checkbox" role="switch" id="clientStatus" ${status_checked}>
                  <label class="form-check-label" for="clientStatus">Activo</label>
                </div>
              </div>
              <div class="col-md-12 col-lg-6">
                <label for="clientTaxpayer" class="form-label">Tipo de Cliente</label>
                <select id="clientTaxpayer" class="form-select">
                  <option value="102">No Contribuyente</option>
                  <option value="101">Contribuyente</option>
                  <option value="201">Empresa</option>
                  <option value="203">Gobierno</option>
                  <option value="204">Extranjero</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      `;
      var content_bottom = `
        <div class="row">
          <div class="col-lg-12 text-center pt-2">
            <button type="button" class="btn btn-info" onclick="cls_giftcard.index('${client.tx_client_slug}');">Cupones</button>
            <button type="button" class="btn btn-warning" onclick="cls_general.disable_submit(this); cls_client.delete('${client.tx_client_slug}');">Eliminar Cliente</button>
            <button type="button" class="btn btn-secondary" onclick="cls_client.index()">Volver</button>
            <button type="button" class="btn btn-success" onclick="cls_general.disable_submit(this); cls_client.update('${client.tx_client_slug}')">Guardar Cliente</button>
          </div>
        </div>
      `;
      document.getElementById('container_request').innerHTML = content + content_bottom;
      document.getElementById('clientTaxpayer').value = client.tx_client_taxpayer + '' + client.tx_client_type;
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  create() {
    var content = `
      <div class="row">
        <div class="col">
          <div class="row">
            <div class="col-sm-12 text-center">
              <h4>Nuevo Cliente</h4>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <label for="clientName" class="form-label">Nombre y Apellido</label>
              <input type="text" id="clientName" name="" class="form-control" onfocus="cls_general.validFranz(this.id, ['number','word','punctuation'])" onkeyup="cls_general.limitText(this,120,1)" onblur="cls_general.limitText(this,120,1)" value="">
            </div>
            <div class="col-md-12 col-lg-6">
              <label for="clientCIF" class="form-label">C&eacute;dula/Pasaporte</label>
              <input type="text" id="clientCIF" class="form-control" onfocus="cls_general.validFranz(this.id, ['number','word'],'-')" onkeyup="cls_general.limitText(this,20,1)" onblur="cls_general.limitText(this,20,1)" value="">
            </div>
            <div class="col-md-12 col-lg-2">
              <label for="clientDV" class="form-label">DV</label>
              <input type="text" id="clientDV" class="form-control" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this,4,1)" onblur="cls_general.limitText(this,4,1)" value="">
            </div>
            <div class="col-md-12 col-lg-4">
              <label for="clientTelephone" class="form-label">Teléfono</label>
              <input type="text" id="clientTelephone" class="form-control" onfocus="cls_general.validFranz(this.id, ['number'],' -')" onkeyup="cls_general.limitText(this,20,1)" onblur="cls_general.limitText(this,20,1)" value="">
            </div>
            <div class="col-md-12 col-lg-6">
              <label for="clientEmail" class="form-label">Correo E.</label>
              <input type="email" id="clientEmail" class="form-control" onfocus="cls_general.validFranz(this.id, ['number','word','punctuation'],'_-@')" onkeyup="cls_general.limitText(this,50,1)" onblur="cls_general.limitText(this,50,1)" value="">
            </div>
            <div class="col-md-12">
              <label for="clientDirection" class="form-label">Dirección</label>
              <input type="text" id="clientDirection" class="form-control" onfocus="cls_general.validFranz(this.id, ['number','word','punctuation'])" onkeyup="cls_general.limitText(this,140,1)" onblur="cls_general.limitText(this,140,1)" value="">
            </div>
            <div class="col-md-12 col-lg-3">
              <div class="form-check form-switch pt_35 display_none">
                <input class="form-check-input" type="checkbox" role="switch" id="clientExempt">
                <label class="form-check-label" for="clientExempt">Exento</label>
              </div>
            </div>
            <div class="col-md-12 col-lg-3">
              <div class="form-check form-switch pt_35 display_none">
                <input class="form-check-input" type="checkbox" role="switch" id="clientStatus" checked>
                <label class="form-check-label" for="clientStatus">Activo</label>
              </div>
            </div>
            <div class="col-md-12 col-lg-6">
              <label for="clientTaxpayer" class="form-label">Tipo de Cliente</label>
              <select id="clientTaxpayer" class="form-select">
                <option value="102">No Contribuyente</option>
                <option value="101">Contribuyente</option>
                <option value="201">Empresa</option>
                <option value="203">Gobierno</option>
                <option value="204">Extranjero</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;
    var content_bottom = `
        <div class="row">
          <div class="col-lg-12 text-center pt-2">
            <button type="button" class="btn btn-secondary" onclick="cls_client.index()">Volver</button>
            <button type="button" class="btn btn-success" onclick="cls_general.disable_submit(this); cls_client.save()">Guardar Cliente</button>
          </div>
        </div>
      `;
    document.getElementById('container_request').innerHTML = content + content_bottom;
  }
  save() {
    var name = cls_general.set_name(document.getElementById('clientName').value);
    var cif = document.getElementById('clientCIF').value;
    var dv = document.getElementById('clientDV').value;
    var telephone = document.getElementById('clientTelephone').value;
    var email = document.getElementById('clientEmail').value;
    var direction = document.getElementById('clientDirection').value;
    var exempt = (document.getElementById('clientExempt').checked) ? 1 : 0;
    var taxpayer = document.getElementById('clientTaxpayer').value;
    var status = (document.getElementById('clientStatus').checked) ? 1 : 0;

    if (cls_general.is_empty_var(name) === 0 || cls_general.is_empty_var(cif) === 0) {
      cls_general.shot_toast_bs('El campo nombre y C&eacute;dula no pueden estar vac&iacute;os', { bg: 'text-bg-warning' });
      return false;
    }
    if (isNaN(dv)) {
      cls_general.shot_toast_bs('D&iacute;gito verificador deben ser numeros', { bg: 'text-bg-warning' });
      return false;
    }
    if (cls_general.is_empty_var(email) === 1 && cls_general.isEmail(email) != true) {
      cls_general.shot_toast_bs('Verifique el Email', { bg: 'text-bg-warning' });
      return false;
    }
    if (taxpayer != "102") {
      var pattern = /\d/
      if (cls_general.is_empty_var(dv) === 0) {
        cls_general.shot_toast_bs('Falta ingresar el DV.', { bg: 'text-bg-warning' });
        return false;
      }
      if (cls_general.is_empty_var(email) === 0) {
        cls_general.shot_toast_bs('Debe ingresar el Email', { bg: 'text-bg-warning' });
        return false;
      }
    } else {
      var pattern = /^[1-9]-?\d{2,}-?\d{2,}$/
    }
    if (pattern.test(cif) != true) {
      cls_general.shot_toast_bs('Verifique la C&eacute;dula/RUC', { bg: 'text-bg-warning' });
      return false;
    }

    var method = 'POST';
    var url = '/client/';
    var body = JSON.stringify({ a: name, b: cif, c: dv, d: telephone, e: email, f: direction, g: exempt, h: taxpayer, i: status });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_client.client_list = obj.data.client_list;
        cls_client.index()
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  update(client_slug) {
    var name = cls_general.set_name(document.getElementById('clientName').value);
    var cif = document.getElementById('clientCIF').value;
    var dv = document.getElementById('clientDV').value;
    var telephone = document.getElementById('clientTelephone').value;
    var email = document.getElementById('clientEmail').value;
    var direction = document.getElementById('clientDirection').value;
    var exempt = (document.getElementById('clientExempt').checked) ? 1 : 0;
    var taxpayer = document.getElementById('clientTaxpayer').value;
    var status = (document.getElementById('clientStatus').checked) ? 1 : 0;

    if (cls_general.is_empty_var(name) === 0 || cls_general.is_empty_var(cif) === 0) {
      cls_general.shot_toast_bs('El campo nombre y C&eacute;dula no pueden estar vac&iacute;os', { bg: 'text-bg-warning' });
      return false;
    }
    if (isNaN(dv)) {
      cls_general.shot_toast_bs('D&iacute;gito verificador deben ser numeros', { bg: 'text-bg-warning' });
      return false;
    }
    if (cls_general.is_empty_var(email) === 1 && cls_general.isEmail(email) != true) {
      cls_general.shot_toast_bs('Verifique el Email', { bg: 'text-bg-warning' });
      return false;
    }
    if (taxpayer != "102") {
      var pattern = /\d/
      if (cls_general.is_empty_var(dv) === 0) {
        cls_general.shot_toast_bs('Falta ingresar el DV.', { bg: 'text-bg-warning' });
        return false;
      }
      if (cls_general.is_empty_var(email) === 0) {
        cls_general.shot_toast_bs('Debe ingresar el Email', { bg: 'text-bg-warning' });
        return false;
      }
    } else {
      var pattern = /^[1-9]-?\d{2,}-?\d{2,}$/
    }
    if (pattern.test(cif) != true) {
      cls_general.shot_toast_bs('Verifique la C&eacute;dula/RUC', { bg: 'text-bg-warning' });
      return false;
    }

    var method = 'PUT';
    var url = '/client/' + client_slug;
    var body = JSON.stringify({ a: name, b: cif, c: dv, d: telephone, e: email, f: direction, g: exempt, h: taxpayer, i: status });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_client.client_list = obj.data.client_list;
        cls_client.index()
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
  delete(client_slug) {
    var url = '/client/' + client_slug; var method = 'DELETE';
    var body = "";
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_client.client_list = obj.data.client_list;
        cls_client.index()
        cls_general.shot_toast_bs(obj['message'], { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj['message'], { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

}
class class_giftcard {
  constructor() {
    this.active = [];
    this.inactive = [];
  }
  index(client_slug) {
    var url = '/client/' + client_slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_giftcard.active = obj.data.giftcard.active;
        cls_giftcard.inactive = obj.data.giftcard.inactive;

        document.getElementById('giftcardModal_content').innerHTML = `
          <div class="row">
            <div class="col-md-12 col-lg-6">
              <div class="row">
                <h5>Cupones Activos</h5>
                <div id="container_giftcard_active" class="col-sm-12 h_300">
                </div>
              </div>
            </div>
            <div class="col-md-12 col-lg-6">
              <div class="row">
                <h5>Cupones Inactivos</h5>
                <div id="container_giftcard_inactive" class="col-sm-12 h_100">
                </div>
              </div>
            </div>
          </div>
        `;
        document.getElementById('giftcardModal_footer').innerHTML = `
          <button type="button" class="btn btn-success" id="new_giftcard" name="" onclick="cls_giftcard.create(${client_slug})">Crear Cup&oacute;n</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        `;
        const modal = new bootstrap.Modal('#giftcardModal', {})
        modal.show();

        document.getElementById('new_giftcard').name = obj.data.client.ai_client_id;
        document.getElementById('container_giftcard_active').innerHTML = cls_giftcard.generate_active(cls_giftcard.active);
        document.getElementById('container_giftcard_inactive').innerHTML = cls_giftcard.generate_inactive(cls_giftcard.inactive);

      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_active(raw_list) {
    var list = '<div class="list-group">';
    raw_list.map((el) => {
      list += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${el.tx_giftcard_number} (B/ ${el.tx_giftcard_amount})
          <button class="btn btn-warning" type="button" onclick="cls_giftcard.delete(${el.ai_giftcard_id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
            </svg>
          </button>
        </li>
      `;
    });
    return list;
  }
  generate_inactive(raw_list) {
    var list = '<ul class="list-group">';
    raw_list.map((el) => {
      list += `<li class="list-group-item text-bg-secondary">${el.tx_giftcard_number} (B/ ${el.tx_giftcard_amount})</li>`;
    })
    list += '</ul>';
    return list;
  }
  create(client_slug) {
    cls_payment.payment = [];
    cls_charge.charge_request = [];
    var paymentmethod = ``;
    cls_paymentmethod.paymentmethod.map((method) => {
      paymentmethod += `
        <div class="col-md-6 col-lg-3 d-grid gap-2 pb-4">
          <button type="button" class="btn btn-info h_50" onclick="cls_payment.add(${method.ai_paymentmethod_id})">${method.tx_paymentmethod_value}</button>
        </div>
      `;
    })
    document.getElementById('giftcardModal_content').innerHTML = `
      <div class="row">
        <div class="col-sm-6 pb-2">
          <label class="form-label" for="paymentNumber">Numero</label>
          <input type="text" id="paymentNumber" class="form-control ui-keyboard-input ui-widget-content ui-corner-all" onfocus="cls_general.validFranz(this.id,['number','word'],',.-()')" value="" aria-haspopup="true" role="textbox">
        </div>
        <div class="col-sm-6 pb-2">
          <label class="form-label" for="paymentAmount">Monto</label>
          <input type="text" id="paymentAmount" class="form-control ui-keyboard-input ui-widget-content ui-corner-all" onfocus="cls_general.validFranz(this.id,['number'],'.')" value="" aria-haspopup="true" role="textbox">
        </div>
        <div class="col-sm-12 p-1">
          <div id="container_paymentMethod" class="row v_scrollable" style="height: 20vh">
            ${paymentmethod}
          </div>
        </div>
        <div class="col-sm-12 bs_1 border_gray radius_10">
          <div id="container_payment" class="row radius_10" style="height: 30vh">
          </div>
        </div>
      </div>
    `;

    document.getElementById('giftcardModal_footer').innerHTML = `
      <button type="button" id="btn_paymentProcess" class="btn btn-success btn-lg display_none" onclick="cls_general.disable_submit(this,1); cls_giftcard.save('${client_slug}')">Procesar</button>
      &nbsp;
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
    `;
  }
  save(client_slug) {
    var raw_payment = cls_payment.payment;
    let received = 0
    raw_payment.map((payment) => { received += payment.amount; });
    received = parseFloat(received);
    if (received < 0.25) {
      cls_general.shot_toast_bs('Debe ingresar un monto superior a 0.25', { bg: 'text-bg-warning' });
      return false;
    }
    var url = '/giftcard/';
    var method = 'POST';
    var body = JSON.stringify({ a: client_slug, b: raw_payment });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
        cls_payment.payment = [];

        const ubicationModal = bootstrap.Modal.getInstance('#giftcardModal');
        ubicationModal.hide();

        cls_giftcard.index(client_slug);
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);


  }
  delete(giftcard_id) {
    var url = '/giftcard/' + giftcard_id;
    var method = 'DELETE';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_giftcard.active = obj.data.active;
        cls_giftcard.inactive = obj.data.inactive;

        document.getElementById('container_giftcard_active').innerHTML = cls_giftcard.generate_active(cls_giftcard.active);
        document.getElementById('container_giftcard_inactive').innerHTML = cls_giftcard.generate_inactive(cls_giftcard.inactive);

        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  select_giftcard(){
    let amount = parseFloat(document.getElementById('paymentAmount').value);

    if (cls_general.is_empty_var(amount) === 0) {
      cls_general.shot_toast_bs('Ingrese el monto.', { bg: 'text-bg-warning' }); return false;
    }

    if (isNaN(amount)) {
      cls_general.shot_toast_bs('Monto erroneo.', { bg: 'text-bg-warning' }); return false;
    }

    swal({
      title: "Ingrese el numero de la giftcard",
      text: "No coloque el espacio, solo los 6 numeros.",

      content: {
        element: "input",
        attributes: {
          placeholder: "######",
          type: "text",
        },
      },
    })
    .then((number) => {
      if (cls_general.is_empty_var(number) === 0) {
        return swal("Debe ingresar un numero.");
      }
      if (isNaN(number)) {
        return swal("Debe ingresar un numero de 6 d&iacute;gitos.");
      }
      var check_duplicity = cls_payment.giftcard.find((payment) => {  return payment.giftcard_number === number })
      if(check_duplicity != undefined) {
        return swal("El cupon ya fue ingresado.");
      }

      var url = '/giftcard/' + number;
      var method = 'GET';
      var body = '';
      var funcion = function (obj) {
        if (obj.status === 'success') {
          if (amount > obj.data.info.tx_giftcard_amount) {
            cls_general.shot_toast_bs(`No alcanza el saldo disponible. (Disponible: ${cls_general.val_dec(obj.data.info.tx_giftcard_amount,2,1,1)})`, { bg: 'text-bg-warning' }); return false;
          }
          cls_payment.add_giftcard(obj.data.info,amount);
        } else {
          cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
        }
      }
      cls_general.async_laravel_request(url, method, funcion, body);


    });

  }
}

