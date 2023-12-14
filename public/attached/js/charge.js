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
    this.online_pendant = [];
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
      case 'online':
        var list = cls_request.generate_onlinerequest(raw);
        if (document.getElementById('container_onlinerequest')) {
          document.getElementById('container_onlinerequest').innerHTML = list.content;
          document.getElementById('online_counter').innerHTML = list.counter;
        }
      break;      
   }
  }
  generate_openrequest(open) {
    var content = '<ul class="list-group">';
    open.map((request) => {
      content += `<li class="list-group-item cursor_pointer" onclick="cls_request.close('${request.tx_request_slug}')"><h5>${request.tx_request_code} - ${request.tx_client_name}</h5><small>${request.tx_request_title} - ${request.tx_table_value}, Elaborador: ${request.user_name}</small></li>`;
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
            <small>${request.tx_request_title} - ${request.tx_table_value}, Elaborador: ${request.user_name}</small>
          </div>
          <span class="badge bg-primary fs_20">B/ ${cls_general.val_price(request.total,2,1,1)}</span>
          &nbsp;&nbsp;&nbsp;
          <span>${cls_general.datetime_converter(request.updated_at)} ${cls_general.time_converter(request.updated_at,1)}</span>
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
          <small>${charge.tx_request_title} - ${charge.tx_table_value}, Cajera: ${charge.user_name}</small>
        </div>
        <span class="badge bg-secondary fs_20">B/ ${cls_general.val_price(charge.tx_charge_total, 2, 1, 1) }</span>
        &nbsp;&nbsp;&nbsp;
        <span>${cls_general.datetime_converter(charge.updated_at)} ${cls_general.time_converter(charge.updated_at,1)}</span>    
      </li>`;
    })
    content += '</ul>';
    return content;
  }
  generate_onlinerequest(raw_request) {
    var content = '<ul class="list-group">';
    var counter = 0;
    raw_request.map((request) => {
      if (request.tx_request_status === 1) {
        var bg_status = 'text-bg-warning';
        counter++;
      }
      var table = (cls_general.is_empty_var(request.tx_table_value) === 0) ? 'Sin Mesa' : request.tx_table_value;
      switch (request.tx_request_status) {
        case 0:
          var status = 'Anulada';
          break;
        case 1:
          var status = 'Pendiente';
          break;
        case 2:
          var status = 'Confirmada';
          break;
        case 3:
          var status = 'Preparada';
          break;
        case 4:
          var status = 'Cerrada';
          break;
      }
      switch (request.tx_request_paymentmethod) {
        case 'yappy':
          var payment = 'Pagado por Yappy'
          break;
        case 'creditcard':
          var payment = 'Pagado TDC';
          break;    
        default:
          var payment = 'Pago en caja'
          break;
      }
      content += `<li class="list-group-item cursor_pointer d-flex justify-content-between align-items-start ${bg_status}" onclick="cls_request.show_online('${request.tx_request_slug}')">
          <div class="ms-2 me-auto">
            <div class="fw-bold"><h5>${request.tx_request_code} - ${request.tx_client_name} - Pago: <strong>${payment}</strong></h5> </div>
            <small>${table} (${status}) Consumo: ${request.tx_request_consumption}</small>
          </div>
          &nbsp;&nbsp;&nbsp;
          <span>${cls_general.datetime_converter(request.created_at)} ${cls_general.time_converter(request.created_at, 1)}</span>
      </li>`;
    })
    content += '</ul>';
    return {content: content, counter: counter};
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
  close_inaction(btn) {
    var request_slug = document.getElementById('btn_commandprocess').name;
    if (cls_general.is_empty_var(request_slug) === 0) {
      cls_general.shot_toast_bs('No hay elementos para cerrar.', { bg: 'text-bg-warning' }); return false;
    }
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
          cls_general.disable_submit(btn);
          var url = '/request/' + request_slug + '/close';
          var method = 'PUT';
          var body = JSON.stringify({ a: 1 });;
          var funcion = function (obj) {
            if (obj.status === 'success') {
              cls_request.open_request = obj.data.open_request;
              cls_request.closed_request = obj.data.closed_request;

              cls_charge.show(request_slug)
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
      case 'online':
        var list = cls_request.generate_onlinerequest(await cls_request.look_for(str,"2"));
        document.getElementById('container_onlinerequest').innerHTML = list.content;
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
          case "2":
            var haystack = cls_request.online_pendant;
            var limit = document.getElementById('onlinerequestLimit').value;
            break;
        }
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          if (i == limit) {  break;  }
          var ocurrencys = 0;
          for (const a in needles) {
            haystack[i]['tx_table_value'] = (cls_general.is_empty_var(haystack[i]['tx_table_value'] === 0)) ? '' : haystack[i]['tx_table_value'];
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
        document.getElementById('btn_filterClosedRequest').click();
        document.getElementById('btn_filterOpenedRequest').click();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
  create(){
    var url = '/table/';
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var bar_slug = '';
        for (const a in obj.data.bar) {
          if (obj.data.bar[a].tx_table_active === 1) {
            bar_slug = obj.data.bar[a].tx_table_slug;
            break;
          }
        }
        if (bar_slug === '') {
          cls_general.shot_toast_bs('No existe alguna barra activa.', { bg: 'text-bg-warning' });
        }
        cls_command.index(null,bar_slug);
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

  update_info(request_slug) {
    var client = document.getElementById('requestClient').name;
    var table = document.getElementById('requestTable').value;

    var url = '/request/' + request_slug + '/client/table/';
    var method = 'PUT';
    var body = JSON.stringify({ a: client, b: table });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

  // API METHODS
  async get_onlinependant(){
    var url = cls_charge.api_url + 'APIrequest/pendant';
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        if (obj.data.length > 0) {
          cls_request.online_pendant = obj.data;
          cls_request.render('online', cls_request.online_pendant.slice(0, 20));
        }
      } else {
        cls_general.shot_toast_bs('Hubieron problemas para conectarse al servidor, reintentando en 10 seg.', { bg: 'text-bg-secondary' })
        cls_charge.api_login();
        setTimeout(() => {
          cls_request.get_onlinependant();
        }, 5000);
      }
    }
    var api_token = cls_charge.api_token;
    await cls_general.async_api_request(url, method, funcion, body, api_token);
  }
  async get_onlinerequest(){
    var status = document.getElementById('onlinerequestStatus').value;
    var limit = document.getElementById('onlinerequestLimit').value;
    switch (status) {
      case "0":
        var url = cls_charge.api_url + 'APIrequest/anuled/'+limit;
        break;
      case "1":
        var url = cls_charge.api_url + 'APIrequest/pendant';
        break;
      case "2":
        var url = cls_charge.api_url + 'APIrequest/confirmed';
        break;
      case "3":
        var url = cls_charge.api_url + 'APIrequest/ready';
        break;
      case "4":
        var url = cls_charge.api_url + 'APIrequest/closed/' + limit;
        break;
    
      default:
        var url = cls_charge.api_url + 'APIrequest/all/' + limit;
        break;
    }
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_request.online_pendant = obj.data;
        cls_request.render('online', cls_request.online_pendant.slice(0, 20));
      } else {
        cls_general.shot_toast_bs('Hubieron problemas para conectarse al servidor, reintentando en 10 seg.', { bg: 'text-bg-secondary' })
        cls_charge.api_login();
        setTimeout(() => {
          cls_request.get_onlinependant();
        }, 5000);
      }
    }
    var api_token = cls_charge.api_token;
    await cls_general.async_api_request(url, method, funcion, body, api_token);
  }
  async show_online(request_slug){

    // get_anuled    -> mostrar modal con informacion 
    // get_pendant   -> Abrir interfaz para crear pedido o cambiar status a anulado
    // get_confirmed -> mostrar modal y boton para cabiar status a ready
    // get_ready     -> mostrar modal y boton para cabiar status a cerrado
    // get_closed    -> mostrar modal con informacion

    var url = cls_charge.api_url + 'APIrequest/show/' + request_slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        switch (obj.data.request_info.tx_request_status) {
          case 0:
            cls_request.inspect_information(obj.data);
          break;
          case 1:
            cls_command.create_request(obj.data);
          break;
          case 2:
            cls_request.inspect_information(obj.data);
          break;
          case 3:
            cls_request.inspect_information(obj.data);
          break;
          case 4:
            cls_request.inspect_information(obj.data);
          break;
        
          default:
            console.log('default');
            break;
        }
      } else {
        cls_general.shot_toast_bs('Hubieron problemas para conectarse al servidor, reintentando en 10 seg.', { bg: 'text-bg-secondary' })
        cls_charge.api_login();
        setTimeout(() => {
          cls_request.show_online();
        }, 5000);
      }
    }
    var api_token = cls_charge.api_token;
    await cls_general.async_api_request(url, method, funcion, body, api_token);
  }
  inspect_information(raw_data){
    var content_command_procesed = `<div class="list-group">`;
    var command_procesed = raw_data.commanddata;
    var raw_price = [];
    command_procesed.map((command) => {
      var raw_command = command.tx_commanddata_option.split(',');
      if (raw_command.length > 1) {
        var option = '<ul>';
        raw_command.map((opt) => { option += `<li>${opt}</li>` });
        option += '</ul>';
      } else {
        var option = '';
      }
      var observation = (cls_general.is_empty_var(command.tx_command_observation) === 1) ? ', <strong>Obs.</strong> ' + command.tx_command_observation : '';
      if (command.tx_commanddata_status === 0) {
        var bg_status = 'text-bg-warning text-body-tertiary';
        var btn = ``;
      } else {
        // [{ PRICE, discount, tax, quantity }]
        raw_price.push({ price: command.tx_commanddata_price, discount: command.tx_commanddata_discountrate, tax: command.tx_commanddata_taxrate, quantity: command.tx_commanddata_quantity });
        var bg_status = '';
      }


      var recipe = JSON.parse(command.tx_commanddata_recipe);
      var content_recipe = '<ul>';
      recipe.map((ingredient) => {
        for (const index in ingredient) {
          content_recipe += `<li><small>${index}</small></li>`;
        }
      })
      content_recipe += `</ul>`;

      content_command_procesed += `
        <a href="#" class="list-group-item list-group-item-action ${bg_status}" aria-current="true" onclick="event.preventDefault();">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${command.tx_commanddata_quantity} - ${command.tx_commanddata_description} (${command.tx_presentation_value})</h5>
            <br/>
          </div>
          ${content_recipe}
          <p class="mb-1">${option}</p>
          <small>Consumo: ${command.tx_request_consumption}${observation}</small><br/>
        </a>
      `;
    })
    content_command_procesed += `</div>`;

    var content_command_related = `<div class="list-group">`;
    var command_related = raw_data.localrequest;
    command_related.map((command) => {
      var raw_option = (cls_general.is_empty_var(command.tx_localcommanddata_option) === 0) ?
       command.tx_localcommanddata_option.split(',') : 
       '';
      if (raw_option.length > 1) {
        var option = '<ul>';
        raw_command.map((opt) => { option += `<li>${opt}</li>` });
        option += '</ul>';
      } else {
        var option = '';
      }
      var recipe = JSON.parse(command.tx_localcommanddata_recipe);
      var content_recipe = '<ul>';
      recipe.map((ingredient) => {
        for (const index in ingredient) {
          content_recipe += `<li><small>${index}</small></li>`;
        }
      })
      content_recipe += `</ul>`;

      content_command_related += `
        <a href="#" class="list-group-item list-group-item-action" aria-current="true" onclick="event.preventDefault();">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${command.tx_localcommanddata_quantity} - ${command.tx_localcommanddata_description} (${command.tx_localcommanddata_presentation})</h5>
            <br/>
          </div>
          ${content_recipe}
          <p class="mb-1">${option}</p>
        </a>
      `;
    })
    content_command_related += `</div>`;

    var raw_total = cls_general.calculate_sale(raw_price)
    var request_info = raw_data.request_api;
    var btn_next = '';
    switch (request_info.tx_request_status) {
      case 2:
        var btn_next = `<div class="col-6 pt-4"><button id="btn_nextstatus" type="button" class="btn btn-info btn-lg" onclick="cls_request.request_next(this,'${request_info.tx_request_slug}')">Marcar "Preparado"</button></div>`;        
      break;
      case 3:
        var btn_next = `<div class="col-6 pt-4"><button id="btn_nextstatus" type="button" class="btn btn-info btn-lg" onclick="cls_request.request_next(this,'${request_info.tx_request_slug}')">Cerrar Pedido</button></div>`;
      break;
    }
    // var btn_next = (request_info.tx_request_status === 2 || request_info.tx_request_status === 3) ? `<div class="col-6 pt-4"><button type="button" class="btn btn-info btn-lg" onclick="cls_request.request_next('${request_info.tx_request_slug}')">Siguiente</button></div>` : '';
    var content = `
          <div class="col-sm-12" style="height: 25vh;">
            <div class="row">
              <div class="col-md-6 col-lg-3">
                <label class="form-label" for="">Numero</label>
                <input type="text" id="" class="form-control" value="${request_info.tx_request_code}" readonly>
              </div>
              <div class="col-md-6 col-lg-3">
                <label class="form-label" for="">Fecha</label>
                <input type="text" id="" class="form-control" value="${cls_general.datetime_converter(request_info.created_at)} ${cls_general.time_converter(request_info.created_at,1) }" readonly>
              </div>
              <div class="col-md-12 col-lg-6">
                <label class="form-label" for="">Cliente</label>
                <input type="text" id="" class="form-control" value="${request_info.name}" readonly>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-lg-3">
                <label class="form-label" for="">Total</label>
                <input type="text" id="" class="form-control" value="B/ ${cls_general.val_price(raw_total.total)}" readonly>
              </div>
              ${btn_next}
            </div>
            </div>
            <div class="row">
              <div class="col-12">
                <ul class="nav  nav-pills nav-justified" id="myTab" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Comandas</button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Pedido</button>
                  </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                  <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                    <div class="row">
                      <div class="col-sm-12">
                        <ul class="list-group">
                          ${content_command_procesed}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                    <div class="row">
                      <div class="col-sm-12">
                        <ul class="list-group">
                          ${content_command_related}
                        </ul>
                      </div>
                    </div>
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
    document.getElementById('onlinerequestModal_content').innerHTML = content;
    document.getElementById('onlinerequestModal_footer').innerHTML = footer;
    document.getElementById('onlinerequestModal_title').innerHTML = 'Inspeccionar Pedido';

    const modal_win = new bootstrap.Modal('#onlinerequestModal', {})
    modal_win.show();
  }
  request_next(btn,request_slug){
    cls_general.disable_submit(btn,0)
    var url = cls_charge.api_url + 'APIrequest/next/' + request_slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('btn_nextstatus').innerHTML = "Cerrar Pedido";
        document.getElementById('btn_nextstatus').classList.remove("btn-info");
        document.getElementById('btn_nextstatus').classList.add("btn-secondary");
        document.getElementById('btn_filteronlinerequest').click();
        btn.disabled = false;
        if (obj.data.request_info.tx_request_status === 4) {
          const modal_win = bootstrap.Modal.getInstance('#onlinerequestModal');
          if (modal_win) {
            modal_win.hide();
          }
        }
      } else {
        if (obj.message === 'No existe el pedido.') {
          cls_general.shot_toast_bs(obj.message,{bg:'text-bg-warning'})
        }else{
          cls_general.shot_toast_bs('Hubieron problemas para conectarse al servidor, reintentando en 10 seg.', { bg: 'text-bg-secondary' })
          cls_charge.api_login();
          setTimeout(() => {
            cls_request.show_online();
          }, 5000);
        }
      }
    }
    var api_token = cls_charge.api_token;
    cls_general.async_api_request(url, method, funcion, body, api_token);
  }
}
class class_charge{
  constructor(charge_list='', api_url){
    this.charge_request=[];
    this.charge_list = charge_list;
    this.api_url = api_url;
    this.api_token = '';
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
          <button class="btn btn-info" type="button" id="btn_newsale" onclick="cls_request.create()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-square-fill" viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/>
            </svg> Nueva Venta
          </button>
        </div>
        <div >

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
              <li class="nav-item" role="presentation">
                <button class="nav-link position-relative" id="btn_onlinerequest" data-bs-toggle="tab" data-bs-target="#tab_onlinerequest" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">
                  Online
                  <span id="online_counter" class="position-absolute top-0 start-100 translate-middle px-2 bg-danger border-light rounded-circle text-bg-dark h_25 radius_10">
                    0
                  </span>
                </button>
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
                    <button class="btn btn-outline-secondary" type="button" id="btn_filterOpenedRequest" onclick="cls_request.filter('open',document.getElementById('filter_openrequest').value)">
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

            <div class="tab-pane fade v_scrollable col-sm-12" id="tab_onlinerequest"  role="tabpanel" aria-labelledby="profile-tab" tabindex="0"  style="max-height: 80vh;">
              <div class="row">
                <div class="col-md-12 col-lg-3">
                  <div class="input-group my-3">
                    <input type="text" id="filter_onlinerequest" class="form-control" placeholder="Buscar por C&oacute;digo, t&iacute;tulo o mesa." onkeyup="cls_request.filter('online',this.value)">
                    <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_request.filter('online',document.getElementById('filter_onlinerequest').value)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="col-md-12 col-lg-3 pt-3">
                  <div class="input-group mb-3">
                    <label class="input-group-text" for="onlinerequestLimit">Mostrar</label>
                    <select id="onlinerequestLimit" class="form-select">
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-12 col-lg-3 pt-3">
                  <div class="input-group mb-3">
                    <label class="input-group-text" for="onlinerequestStatus">Estado</label>
                    <select id="onlinerequestStatus" class="form-select">
                      <option value="0">Anulados</option>
                      <option value="1" selected>Pendientes</option>
                      <option value="2">Confirmado</option>
                      <option value="3">Preparado</option>
                      <option value="4">Cerrado</option>
                      <option value="all">Todos</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-12 col-lg-3 pt-3">
                  <button type="button" id="btn_filteronlinerequest" class="btn btn-info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                    </svg>
                  </button>
                </div>
                <div id='container_onlinerequest' class="col-md-12">
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    `;
    document.getElementById('container_request').innerHTML = content;
    cls_request.render('open', cls_request.open_request.slice(0, 10));
    cls_request.render('closed', cls_request.closed_request.slice(0, 10));
    cls_request.render('canceled', cls_charge.charge_list.slice(0, 10));

    document.getElementById('btn_onlinerequest').addEventListener('click', () => {
      cls_request.get_onlinependant();
    });
    cls_request.render('online', cls_request.online_pendant.slice(0, 20));

    document.getElementById('btn_filteronlinerequest').addEventListener('click', () => {
      cls_request.get_onlinerequest();
    })
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
    setInterval(() => {
      cls_request.get_onlinependant()
    }, 30000);
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
        <div class="col-sm-12">
          <span class="fs_20">Listado de Comandas</span>
          <button type="button" id="btn_graphicList" name="${request_slug}" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modalArticleList">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-basket2" viewBox="0 0 16 16">
              <path d="M4 10a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0v-2zm3 0a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0v-2zm3 0a1 1 0 1 1 2 0v2a1 1 0 0 1-2 0v-2z"></path>
              <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-.623l-1.844 6.456a.75.75 0 0 1-.722.544H3.69a.75.75 0 0 1-.722-.544L1.123 8H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6h1.717L5.07 1.243a.5.5 0 0 1 .686-.172zM2.163 8l1.714 6h8.246l1.714-6H2.163z"></path>
            </svg>
          </button>
        </div>
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

    document.getElementById('btn_graphicList').addEventListener('click', () => { cls_command.filter_articlethumbnail(''); });

    var raw_category = [];
    cls_article.article_list.map((article) => {
      var cat = raw_category.find((category) => { return category === article.tx_category_value })
      if (cls_general.is_empty_var(cat) === 0) {
        raw_category.push(article.tx_category_value);
      }
    })
    var content_category = '';
    var content_categorythumbnail = '';
    raw_category.map((category) => {
      content_category += `<button class="btn btn-primary" style="height: 8vh;" onclick="cls_command.filter_article_category('${category}');">${category}</button>&nbsp;`;
      content_categorythumbnail += `<button class="btn btn-primary fs_20" style="height: 8vh;" onclick="cls_command.filter_articlethumbnail_category('${category}');">${category}</button>&nbsp;`;
    })
    document.getElementById('container_articlethumbnail_categories').innerHTML = content_categorythumbnail;


    document.getElementById('paymentAmount').focus();
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
          cls_general.shot_toast_bs('El rango de fecha debe ser maximo 60 dias.', { bg: 'text-bg-warning' }); return false;
        }
        if (MonthDiff > 2) {
          cls_general.shot_toast_bs('El rango de fecha debe ser maximo 60 dias.', { bg: 'text-bg-warning' }); return false;
        }

        if (cls_general.is_empty_var(str) === 0) {
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

  async api_login(){
    var url = cls_charge.api_url + 'APIlogin';
    var method = 'POST';
    var body = JSON.stringify({ email: 'apirequest@mail.com', password: 'requestable7812' });
    // var body = JSON.stringify({ email: 'requestapi@mail.com', password: 'requestable7812' });
    var funcion = function (obj) {
      if (obj.data.status === 'success') {
        cls_charge.api_token = obj.data.token;
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    await cls_general.async_api_request(url, method, funcion, body);
  }

}
class class_command{
  constructor(){
    this.command_list = [];
    this.command_procesed = [];
  }
  index(request_info, table_slug) {
    var request_slug = '';
    if (request_info != null) {
      var key = Object.keys(request_info);
      request_slug = (key.length > 0) ? request_info['tx_request_slug'] : '';
    }

    var opt_tablelist = '';
    cls_table.table_list.map((table) => {
      if (table.tx_table_active === 1) {
        opt_tablelist += (table.tx_table_slug === table_slug) ? `<option value="${table.ai_table_id}" selected>${table.tx_table_code} - ${table.tx_table_value}</option>` : `<option value="${table.ai_table_id}">${table.tx_table_code} - ${table.tx_table_value}</option>`;
      }
    })
    if (request_slug.length > 0) {
      var btn_update = `<button class="btn btn-lg btn-info" type="button" onclick="cls_general.disable_submit(this); cls_request.update_info('${request_slug}')">Actualizar</button>`;
      var request_code = request_info['tx_request_code'];
      var client_name = request_info['tx_client_name'];
      var client_slug = request_info['tx_client_slug'];
      var exempt = request_info['tx_client_exempt'];
    } else {
      var btn_update = '';
      var request_code = 'Sin c&oacute;digo';
      var client_name = 'Contado';
      var client_slug = '001';
      var exempt = 0;
    }

    var content_command_procesed = cls_command.generate_articleprocesed_newsale(cls_command.command_procesed);
    var total_sale = cls_general.calculate_sale(content_command_procesed.price);
    var raw_category = [];
    cls_article.article_list.map((article) => {
      var cat = raw_category.find((category) => { return category === article.tx_category_value })
      if (cls_general.is_empty_var(cat) === 0) {
        raw_category.push(article.tx_category_value);
      }
    })
    var content_category = '';
    var content_categorythumbnail = '';
    raw_category.map((category) => {
      content_category += `<button class="btn btn-primary" style="height: 8vh;" onclick="cls_command.filter_article_category('${category}');">${category}</button>&nbsp;`;
      content_categorythumbnail += `<button class="btn btn-primary fs_20" style="height: 8vh;" onclick="cls_command.filter_articlethumbnail_category('${category}');">${category}</button>&nbsp;`;
    })
    document.getElementById('container_articlethumbnail_categories').innerHTML = content_categorythumbnail;

    var content = `
      <div class="row">
        <div class="col-md-12 col-lg-5">
          <div class="row">
            <div class="col-sm-6">
              <span>Art&iacute;culos Seleccionados</span>
            </div>
            <div class="col-sm-6 bs_1 border_gray radius_10 text-bg-success text-truncate text-right">
              <span id="span_commandTotal"><h5>Total: B/ 0.00</h5></span>
            </div>
            <div id="article_selected" class="col-xs-12 v_scrollable" style="height: 65vh; transition: all ease 1s;">
            </div>
          </div>
          <div class="row">
            <div class="col-sm-3 d-grid gap-2 mb-3 pt-2" style="height: 10vh">
              <button type="button" id="btn_graphicList" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modalArticleList">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-basket2" viewBox="0 0 16 16">
                  <path d="M4 10a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0v-2zm3 0a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0v-2zm3 0a1 1 0 1 1 2 0v2a1 1 0 0 1-2 0v-2z"/>
                  <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-.623l-1.844 6.456a.75.75 0 0 1-.722.544H3.69a.75.75 0 0 1-.722-.544L1.123 8H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6h1.717L5.07 1.243a.5.5 0 0 1 .686-.172zM2.163 8l1.714 6h8.246l1.714-6H2.163z"/>
                </svg>
              </button>
            </div>
            <div class="col-sm-9 mb-3 pt-2" style="height: 10vh">
              <div class="input-group" style="height: 10vh">
                <input type="text" id="articleFilter" class="form-control" placeholder="Buscar por c&oacute;digo o descripci&oacute;n" onkeyup="cls_command.filter_article(this.value)" onfocus="document.getElementById('article_list').style.height = '25vh';document.getElementById('article_selected').style.height = '40vh';" onblur="document.getElementById('article_list').style.height = '0vh';document.getElementById('article_selected').style.height = '65vh';">
                <button class="btn btn-outline-secondary" type="button" onclick="cls_command.filter_article(document.getElementById('articleFilter').value)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="row">
            <span>Listado de Art&iacute;culos</span>
            <div id="article_list" class="col-xs-12 v_scrollable" style="height: 0vh; transition: all ease 1s;">

            </div>
            <div class="col-xs-12 h_scrollable" style="height: 10vh">
              ${content_category}
            </div>
          </div>
        </div>
        <div class="col-lg-1 text-center d-none d-lg-block d-xxl-block">
          <div class="row">
            <div class="col-md-12 text-center" style="height:20vh;display: flex;align-items: top;">
              <button class="btn btn-warning btn-lg h_50" data-bs-toggle="tooltip" data-bs-title="Cerrar Pedido" onclick="cls_request.close_inaction(this)">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="30" fill="currentColor" class="bi bi-door-closed-fill" viewBox="0 0 16 16">
                  <path d="M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1h8zm-2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                </svg>
              </button>
            </div>

            <div class="col-md-12 text-center" style="height:60vh;display: flex;align-items: center;">
              <button id="btn_commandprocess" class="btn tmgreen_bg btn-lg h_150" name="${request_slug}" onclick="cls_command.save(this.name,'${table_slug}');" data-bs-toggle="tooltip" data-bs-title="Procesar Comanda">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                </svg>
              </button>
            </div>
            <div class="col-md-12 text-center" style="height:20vh;display: flex;align-items: bottom;">
              <button class="btn btn-secondary btn-lg h_50" onclick="window.location.href = '/paydesk';" data-bs-toggle="tooltip" data-bs-title="Salir">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>




        <div class="col-md-12 text-center d-md-block d-lg-none">
          <div class="row">
            <div class="col-md-4 text-center">
              <button class="btn btn-warning btn-lg h_50" onclick="cls_request.close_inaction(this)">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="30" fill="currentColor" class="bi bi-door-closed-fill" viewBox="0 0 16 16">
                  <path d="M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1h8zm-2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                </svg>
                Cerrar Pedido
              </button>
            </div>

            <div class="col-md-4 text-center">
              <button id="btn_commandprocess" class="btn tmgreen_bg btn-lg h_50" name="${request_slug}" onclick="cls_command.save(this.name,'${table_slug}');">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                </svg>
                Procesar Comanda
              </button>
            </div>
            <div class="col-md-4 text-center">
              <button class="btn btn-secondary btn-lg h_50" onclick="window.location.href = '/paydesk';">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                </svg>
                Volver
              </button>
            </div>
          </div>
        </div>




        <div class="col-md-12 col-lg-6">
          <div class="row">
            <span>Listado de Comandas</span>
            <div id="commandList" class="col-sm-12 v_scrollable" style="height: 70vh">
              ${content_command_procesed.content}
            </div>
            <div class="col-sm-12 bt_1 border_gray">
              <div class="row">
                <label for="requestClient">Cliente</label>
                <div class="col-md-12 col-lg-6">
                  <div class="input-group mb-3">
                    <input type="text" class="form-control" id="requestClient" alt="${exempt}" name="${client_slug}" value="${client_name}" readonly onfocus="cls_client.render_modal()">
                    <button class="btn btn-outline-secondary" type="button" onclick="cls_client.render_modal()">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="col-md-12 col-lg-6 fs_30 bs_1 border_gray radius_10 text-bg-success text-truncate">
                  <label class="fs_10">Total</label>
                  <span id="requestTotal">B/ ${cls_general.val_price(total_sale.total, 2, 1, 1)} </span>
                </div>
                <div class="col-md-12 col-lg-4">
                  <label for="requestCode">C&oacute;digo</label>
                  <input type="text" class="form-control" id="requestCode" placeholder="${request_code}" readonly>
                </div>
                <div class="col-md-12 col-lg-4">
                  <label for="requestTable">Mesa</label>
                  <select class="form-select" id="requestTable"><option>Seleccione</option>${opt_tablelist}</select>
                </div>
                <div id="container_buttonUpdateInfo" class="col-md-12 col-lg-4 pt-2 text-center">
                  ${btn_update}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('container_request').innerHTML = content;
    cls_command.filter_article('')
    if (cls_general.is_empty_var(request_slug) === 1) {
      setInterval(() => {
        var btn = document.getElementById('btn_commandprocess');
        if (btn) {
          var url = '/request/' + request_slug; var method = 'GET';
          var body = "";
          var funcion = function (obj) {
            if (obj.data.command_procesed.length === 0) {
              cls_general.shot_toast_bs('El pedido ya fue cerrado.', { bg: 'text-bg-warning' }); return false;
            }
            cls_command.command_procesed = obj.data.command_procesed;
            var content_command_procesed = cls_command.generate_articleprocesed_newsale(cls_command.command_procesed);
            var total_sale = cls_general.calculate_sale(content_command_procesed.price);
            document.getElementById('commandList').innerHTML = content_command_procesed.content;
            document.getElementById('requestTotal').innerHTML = `B/ ${cls_general.val_price(total_sale.total, 2, 1, 1)}`
          }
          cls_general.async_laravel_request(url, method, funcion, body);
        }
      }, 15000);
    }
    document.getElementById('btn_graphicList').addEventListener('click', () => { cls_command.filter_articlethumbnail(''); });
    document.getElementById('btn_graphicList').click();

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

  }
  generate_articleprocesed(command_procesed) {
    var raw_price = [];
    var content_command_procesed = `<div class="list-group">`;
    command_procesed.map((command) => {
      if (command.tx_commanddata_status === 0) {
        var bg_status = 'text-bg-warning text-body-tertiary';
        var btn = '';
      } else {
        // [{ PRICE, discount, tax, quantity }]
        raw_price.push({ price: command.tx_commanddata_price, discount: command.tx_commanddata_discountrate, tax: command.tx_commanddata_taxrate, quantity: command.tx_commanddata_quantity });
        var bg_status = '';
        var btn = `<button type="button" class="btn btn-secondary" onclick="event.preventDefault(); cls_command.loginuser_cancel(${command.ai_commanddata_id})">Anular</button>`;
      }

      content_command_procesed += `
        <a href="#" class="list-group-item list-group-item-action ${bg_status}" aria-current="true" onclick="event.preventDefault();">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${command.tx_commanddata_quantity} - ${command.tx_commanddata_description}</h5>
          </div>
          <small class="float_right">B/ ${cls_general.val_price(command.tx_commanddata_price,2,1,1)}</small><br/>
          <div class="text-center">
            ${btn}
          </div>
        </a>
      `;
    })
    content_command_procesed += `</div>`;
    return { 'content': content_command_procesed, 'price': raw_price };
  }
  filter_articlethumbnail(str) {
    var filtered = cls_article.look_for(str, 100);
    var content = cls_command.generate_articlethumbnail_list(filtered)
    document.getElementById('container_articlethumbnail').innerHTML = content;
  }
  filter_articlethumbnail_category(category) {
    var filtered = cls_article.look_for_category(category);
    var content = cls_command.generate_articlethumbnail_list(filtered)
    document.getElementById('container_articlethumbnail').innerHTML = content;
  }
  generate_articlethumbnail_list(filtered) {
    var content = '<div class="row">';
    filtered.map((article) => {
      var bg = '';
      var promo_str = '';
      if (article.tx_article_promotion == 1) {
        bg = 'tmred_bg f_white';
        promo_str = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
            <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
          </svg>
        `;
      }
      var img = (cls_general.is_empty_var(article['tx_article_thumbnail']) === 1) ? `<img src="attached/image/article/${article['tx_article_thumbnail']}" width="80px"></img>` : `
      <svg width="80px" height="80px" class="filter_white" viewBox="0 0 108 108" id="Layeri" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g class="cls-2 ${bg}">
          <g id="Line">
            <path d="M85.5,2h-63a7,7,0,0,0,0,14h.61q2.3,41.22,4.58,82.44a8,8,0,0,0,8,7.56H72.32a8,8,0,0,0,8-7.56Q82.61,57.22,84.89,16h.61a7,7,0,0,0,0-14ZM76.32,98.22a4,4,0,0,1-4,3.78H35.68a4,4,0,0,1-4-3.78L30.56,78H77.44ZM77.67,74H30.33L28.39,39H79.61ZM85.5,12H48v4H80.89L79.83,35H28.17L27.11,16H36V12H22.5a3,3,0,0,1,0-6h63a3,3,0,0,1,0,6Z"/><path d="M24.33,38.11A2,2,0,0,1,24,37a2,2,0,0,1,.22-.91Z"/><path d="M84,37a2,2,0,0,1-.33,1.11l.11-2A2,2,0,0,1,84,37Z"/><path d="M42.66,64.3c0,.11-.08.21-.12.3-2.8-4.3-1.41-11.1,3.52-16,4.32-4.32,10.06-5.92,14.31-4.37a21.45,21.45,0,0,0-2.16,4.55,12.17,12.17,0,0,1-2.15,4.17,12.17,12.17,0,0,1-4.17,2.15A16.17,16.17,0,0,0,46,58.36,16.17,16.17,0,0,0,42.66,64.3Z"/><path d="M60.91,63.42c-4.3,4.3-10,5.9-14.26,4.39.25-.58.48-1.17.69-1.74a12.17,12.17,0,0,1,2.15-4.17,12.17,12.17,0,0,1,4.17-2.15,16.17,16.17,0,0,0,5.94-3.3,16.17,16.17,0,0,0,3.3-5.94,19.87,19.87,0,0,1,1.45-3.26C67.26,51.54,65.9,58.44,60.91,63.42Z"/><rect height="4" rx="2" ry="2" width="4" x="40" y="12"/>
          </g>
        </g>
      </svg>`;

      content += `<div class="col-md-4 col-lg-2 text-center">
        <button class="btn btn-success btn-lg my_20 ${bg}" onclick="cls_command.show_article('${article.tx_article_slug}','${article.tx_article_value}')" style="width: 120px">
          ${img}
          <br>
            <p class="fs-6 mb_0 ">${promo_str + ' ' + article.tx_article_value}</p>
        </button>
      </div>`;
    })
    content += '</div>';
    return content;
  }
  filter_article(str) {
    var filtered = cls_article.look_for(str, 100);
    var content = cls_command.generate_article_list(filtered)
    document.getElementById('article_list').innerHTML = content;
  }
  filter_article_category(category) {
    var filtered = cls_article.look_for_category(category);
    var content = cls_command.generate_article_list(filtered)
    document.getElementById('article_list').innerHTML = content;
  }
  generate_article_list(filtered) {
    var content = '<ul class="list-group">';
    filtered.map((article) => {
      var bg = '';
      var promo_str = '';
      if (article.tx_article_promotion == 1) {
        bg = 'tmred_bg f_white';
        promo_str = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16">
          <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
        </svg>`;
      }
      content += `<li class="list-group-item cursor_pointer fs_20 text-truncate ${bg}" onclick="cls_command.show_article('${article.tx_article_slug}','${article.tx_article_value}')">${article.tx_article_code} - ${promo_str + ' ' + article.tx_article_value}</li>`;
    })
    content += '</ul>';
    return content;
  }
  show_article(article_slug, description, caller) {
    var url = '/article/' + article_slug; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      var raw_option = JSON.parse(obj.data.article.tx_article_option);
      var content_option = '';
      if (raw_option.length > 0) {
        for (const a in raw_option) {
          var option = raw_option[a];
          var key = Object.keys(option);
          content_option += `<div class="col-md-12 col-lg-6"><label for="article_${key[0]}">${key[0]}</label> <select class="form-select" id="${key[0]}">`;
          for (const b in option[key[0]]) {
            content_option += `<option value="${option[key[0]][b]}">${option[key[0]][b]}</option>`;
          }
          content_option += `</select></div>`;
        }
      }
      var option_presentation = ``; //OPTION PARA LAS PRESENTACIONES DEL ARTICULO, AL CAMBIAR CAMBIAR LOS PRECIOS
      obj.data.price.map((price) => {
        option_presentation += `<option alt="${price.tx_price_three},${price.tx_price_two},${price.tx_price_one}" value="${price.ai_presentation_id}">${price.tx_presentation_value}</option>`;
      })

      var tax_rate = obj.data.article.tx_article_taxrate;

      var content_recipe = cls_command.generate_recipe_option(obj.data.articleproduct);

      var content = `
        <div class="row">
          <div class="col-md-12 col-lg-4">
            <label for="articleQuantity">Cantidad</label>
            <input type="number" class="form-control" id="articleQuantity" value="1" onfocus="cls_general.validFranz(this.id, ['number'])" >
          </div>
          <div class="col-md-12 col-lg-4">
            <label for="articlePresentation">Presentation</label>
            <select class="form-select" id="articlePresentation" onchange="cls_command.modal_set_price(this.options[this.selectedIndex].getAttribute('alt'), this.value, '${article_slug}')">
              ${option_presentation}
            </select>
          </div>
          <div id="container_price" class="col-md-12 col-lg-4">
          </div>
          <div class="col-sm-12">
            <div id="container_recipe" class="row">
              ${content_recipe}
            </div>
          </div>
          <div class="col-md-12 col-lg-4">
            <input type="hidden" class="form-control" id="articleDiscountrate" value="${obj.data.article.tx_article_discountrate}" onfocus="cls_general.validFranz(this.id, ['number'])" required>
            <input type="hidden" class="form-control" id="articleTaxrate" value="${tax_rate}" onfocus="cls_general.validFranz(this.id, ['number'])" required>
          </div>
          <hr/>
          <h5>Opciones</h5>
          <div id="articleOption" class="row">
            ${content_option}
          </div>
        </div>
      `;
      var footer = `
        <div class="row">
          <div class="col-sm-12">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-primary" onclick="cls_general.disable_submit(this); cls_command.add_article_lastrequest('${article_slug}','${description}','${obj.data.article.ai_article_id}');">Guardar</button>
          </div>
        </div>
      `;

      document.getElementById('commandModal_title').innerHTML = 'Agregar Art&iacute;culo';
      document.getElementById('commandModal_content').innerHTML = content;
      document.getElementById('commandModal_footer').innerHTML = footer;


      cls_command.modal_set_price(obj.data.price[0].tx_price_three + ',' + obj.data.price[0].tx_price_two + ',' + obj.data.price[0].tx_price_one, obj.data.price[0].ai_presentation_id, article_slug); //OPTION PARA Los PRECIOS DEL ARTICULO

      const Modal = bootstrap.Modal.getInstance('#modalArticleList');
      if (Modal) {
        Modal.hide();
      }

      const modal = new bootstrap.Modal('#commandModal', {})
      modal.show();
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_recipe_option(article_product) {
    var content_recipe = '';
    article_product.map((ap, i) => {
      var raw_ingredient = JSON.parse(ap.tx_articleproduct_ingredient);
      if (raw_ingredient.length > 1) {
        content_recipe += `
          <div class="col-md-12 col-lg-6">
          <label for="ingredient_${i}">${i + 1}.- Ingrediente</label>
          <select class="form-select" name="show" id="ingredient_${i}" alt="${raw_ingredient[0].to_go}">`;
        raw_ingredient.map((ingredient) => {
          content_recipe += `<option value="${ingredient.quantity},${ingredient.measure_id},${ingredient.product_id}">${ingredient.quantity} (${ingredient.measure_value}) ${ingredient.product_value}</option>`;
        })
        content_recipe += `</select></div>`;
      } else {
        content_recipe += `
          <div class="col-md-12 col-lg-6 display_none">
            <label for="ingredient_${i}">${i + 1}.- Ingrediente</label>
            <select class="form-select" name="noshow" id="ingredient_${i}" alt="${raw_ingredient[0].to_go}">`;
        raw_ingredient.map((ingredient) => {
          content_recipe += `<option value="${ingredient.quantity},${ingredient.measure_id},${ingredient.product_id}">${ingredient.quantity} (${ingredient.measure_value}) ${ingredient.product_value}</option>`;
        })
        content_recipe += `</select></div>`;
      }
    })
    return content_recipe;
  }
  modal_set_price(str, presentation_id, article_slug) {
    var url = '/recipe/' + presentation_id + '/' + article_slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {

        var raw = str.split(',');
        var content = `<label for="articlePrice">Precio</label>
        <select class="form-select" id="articlePrice">`;
        raw.map((price) => {
          var p = parseFloat(price);
          if (price > 0.1) {
            content += `<option value="${p}">${p.toFixed(2)}</option>`;
          }
        })
        document.getElementById('container_price').innerHTML = content + '</select>';
        document.getElementById('container_recipe').innerHTML = cls_command.generate_recipe_option(obj.data.recipe);;

      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
  add_article_lastrequest(article_slug, description, article_id) {
    var quantity = document.getElementById('articleQuantity').value;
    if (isNaN(quantity) || quantity < 1) {
      cls_general.shot_toast_bs('Corrija la cantidad.', { bg: 'text-bg-warning' });
      return false;
    }
    var option = '';
    $('#articleOption').find('select').each(function () {
      option += `${$(this).attr('id')}: ${$(this).val()},`;
    });
    option = option.slice(0, -1);

    var raw_recipe = [];
    $('#container_recipe').find('select').each(function () {
      var index = $(this.selectedOptions).text();
      let show = this.getAttribute("name");
      let togo = (this.getAttribute("alt") === "1") ? 'togo' : '';
      raw_recipe.push({ [index]: $(this).val() + ',' + show + ',' + togo })
    });
    var select_presentation = document.getElementById('articlePresentation');
    var request_slug = (document.getElementById('btn_graphicList')) ? document.getElementById('btn_graphicList').name : '';

    if (cls_general.is_empty_var(request_slug) === 0) {
      cls_command.command_list.push({
        'article_slug': article_slug,
        'article_id': article_id,
        'article_description': description,
        'quantity': quantity,
        'option': option.slice(0, -1),
        'presentation_id': select_presentation.value,
        'presentation_value': select_presentation.options[select_presentation.selectedIndex].text,
        'price': document.getElementById('articlePrice').value,
        'tax_rate': document.getElementById('articleTaxrate').value,
        'discount_rate': document.getElementById('articleDiscountrate').value,
        'recipe': raw_recipe
      });
      const Modal = bootstrap.Modal.getInstance('#commandModal');
      Modal.hide();
      cls_command.render_articleselected();      
    }else{
      var raw_article = [];
      raw_article.push({
        option: option,
        recipe: raw_recipe,
        tax_rate: document.getElementById('articleTaxrate').value,
        presentation_id: select_presentation.value, 
        article_id: article_id,
        quantity: quantity,
        price: document.getElementById('articlePrice').value,
        discount_rate: document.getElementById('articleDiscountrate').value,
        article_description: description
      })
      var url = '/commanddatalastrequest/';
      var method = 'POST';
      var body = JSON.stringify({ a: request_slug, b: raw_article });
      var funcion = function (obj) {
        if (obj.status === 'success') {
          cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
  
          var content_command = cls_command.generate_articleprocesed(obj.data.command_procesed)
          document.getElementById('container_commandlist').innerHTML = content_command.content;
  
          let price = cls_general.calculate_sale(content_command.price)
          document.getElementById('sp_gross').innerHTML = 'B/. ' + cls_general.val_price(price.gross_total, 2, 1, 1);
          document.getElementById('sp_discount').innerHTML = 'B/. ' + cls_general.val_price(price.discount, 2, 1, 1);
          document.getElementById('sp_subtotal').innerHTML = 'B/. ' + cls_general.val_price(price.subtotal, 2, 1, 1);
          document.getElementById('sp_tax').innerHTML = 'B/. ' + cls_general.val_price(price.tax, 2, 1, 1);
          document.getElementById('sp_total').innerHTML = 'B/. ' + cls_general.val_price(price.total, 2, 1, 1);
  
          cls_charge.charge_request = { request_id: obj.data.request_info.ai_request_id, gross_total: price.gross_total, subtotal: price.subtotal, total: price.total, discount: price.discount, tax: price.tax };
  
          const modal_win = bootstrap.Modal.getInstance('#commandModal');
          modal_win.hide();
        } else {
          cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
        }
      }
      cls_general.async_laravel_request(url, method, funcion, body);    
    }
  }
  render_articleselected() {
    var content = cls_command.generate_articleselected(cls_command.command_list);
    document.getElementById('article_selected').innerHTML = content.content;
    document.getElementById('span_commandTotal').innerHTML = '<h5>Total: B/ ' + content.price_sale.total + '</h5>';
  }



  generate_articleselected(command_list) {
    // var content = '<ul class="list-group">';
    var content = '<div class="accordion" id="">';
    

    var raw_price = [];
    command_list.map((article, index) => {
      var splited_option = article.option.split(',');
      var option = ``
      if (splited_option.length > 1) {
        option += `<ul>`
        splited_option.map((opt) => {
          option += `<li>${opt}</li>`;
        })
        option += `</ul>`
      }

      var content_recipe = '<ul>';
      article.recipe.map((ingredient) => {
        for (const key in ingredient) {
          content_recipe += `<li><small>${key}</small></li>`;
        }
      })

      content_recipe += '</ul>';

      content += `
      <div class="accordion-item" >
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${index}">
            ${article.quantity} - ${article.article_description} ${article.presentation_value}<br/> ${option} <span style="float: right; width: 30%" class="text-truncate">B/ ${cls_general.val_price(article.price, 2, 1, 1)}</span>
          </button>
        </h2>
        <div id="${index}" class="accordion-collapse collapse">
          <div class="accordion-body">
            ${content_recipe}
          </div>
        </div>
        <br/>
        <div class="text-center">
          <button class="btn btn-warning" type="button" onclick="cls_command.delete_articleselected(${index})">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
            </svg>
          </button>
        </div>
      </li>
      `;


      // content += `
      // <li class="list-group-item cursor_pointer text-truncate">
      //   ${article.quantity} - ${article.article_description} ${article.presentation_value}<br/> ${option} <span style="float: right; width: 30%" class="text-truncate">B/ ${cls_general.val_price(article.price, 2, 1, 1)}</span>
      //   <br/>
      //   ${content_recipe}
      //   <div class="text-center">
      //     <button class="btn btn-warning" type="button" onclick="cls_command.delete_articleselected(${index})">
      //       <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
      //         <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
      //       </svg>
      //     </button>
      //   </div>
      // </li>
      // `;
      //[{PRICE,discount,tax, quantity}]
      raw_price.push({ price: article.price, discount: article.discount_rate, tax: article.tax_rate, quantity: article.quantity })

    })
    var price_sale = cls_general.calculate_sale(raw_price);
    content += '</div>';
    return { 'content': content, 'price_sale': price_sale };
  }
  generate_articleprocesed_newsale(command_procesed) {
    var raw_price = [];
    var content_command_procesed = `<div class="list-group">`;
    command_procesed.map((command) => {
      var raw_command = command.tx_commanddata_option.split(',');
      if (raw_command.length > 1) {
        var option = '<ul>';
        raw_command.map((opt) => { option += `<li>${opt}</li>` });
        option += '</ul>';
      } else {
        var option = '';
      }
      var observation = (cls_general.is_empty_var(command.tx_command_observation) === 1) ? ', <strong>Obs.</strong> ' + command.tx_command_observation : '';
      if (command.tx_commanddata_status === 0) {
        var bg_status = 'text-bg-warning text-body-tertiary';
        var btn = ``;
      } else {
        // [{ PRICE, discount, tax, quantity }]
        raw_price.push({ price: command.tx_commanddata_price, discount: command.tx_commanddata_discountrate, tax: command.tx_commanddata_taxrate, quantity: command.tx_commanddata_quantity });
        var bg_status = '';
        var btn = `
          <button type="button" class="btn btn-secondary" onclick="event.preventDefault(); cls_command.loginuser_cancel(${command.ai_commanddata_id})">Anular</button>
        `;
      }
      var recipe = JSON.parse(command.tx_commanddata_recipe);
      var content_recipe = '<ul>';
      recipe.map((ingredient) => {
        for (const index in ingredient) {
          content_recipe += `<li><small>${index}</small></li>`;
        }
      })
      content_recipe += `</ul>`;

      content_command_procesed += `
        <a href="#" class="list-group-item list-group-item-action ${bg_status}" aria-current="true" onclick="event.preventDefault();">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${command.tx_commanddata_quantity} - ${command.tx_commanddata_description} (${command.tx_presentation_value})</h5>
            <br/>
          </div>
          ${content_recipe}
          <p class="mb-1">${option}</p>
          <small>Consumo: ${command.tx_command_consumption}${observation}</small><br/>
          <div class="text-center">
            ${btn}
          </div>
        </a>
      `;
    })
    content_command_procesed += `</div>`;
    return { 'content': content_command_procesed, 'price': raw_price };
  }
  delete_articleselected(index) {
    var command_list = cls_command.command_list;
    command_list.splice(index, 1);
    cls_command.command_list = command_list;
    cls_command.render_articleselected();
  }
  save(request_slug, table_slug) { //ESTA FUNCION SOLO ABRE EL MODAL
    var command_list = cls_command.command_list;
    if (command_list < 1) {
      cls_general.shot_toast_bs('Seleccione los art&iacute;culos.', { bg: 'text-bg-warning' });
      return false;
    }
    var content = `
      <div class="row">
        <div class="col-md-12">
          <label for="commandConsumption">Consumo</label>
          <select id="commandConsumption" class="form-select">
            <option value="Local">Local</option>
            <option value="Retira">Retira</option>
            <option value="Llevar">Llevar</option>
          </select>
        </div>  
        <div class="col-md-12">
          <label for="commandObservation">Observaciones</label>
          <textarea id="commandObservation" class="form-control" onfocus="cls_general.franz_textarea(this,this.value)" onkeyup="cls_general.limitText(this,120,1)" onblur="cls_general.limitText(this,120,1)"></textarea>
        </div>
      </div>
    `;
    var footer = `
      <div class="row">
        <div class="col-sm-12">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary" onclick="cls_general.disable_submit(this,0); cls_command.process('${request_slug}','${table_slug}')">Guardar</button>
        </div>
      </div>
    `;

    document.getElementById('commandModal_title').innerHTML = 'Despacho';
    document.getElementById('commandModal_content').innerHTML = content;
    document.getElementById('commandModal_footer').innerHTML = footer;

    const modal = new bootstrap.Modal('#commandModal', {})
    modal.show();
  }
  process(request_slug, table_slug) {
    if (cls_general.is_empty_var(request_slug) === 0) {
      const Modal = bootstrap.Modal.getInstance('#commandModal');
      Modal.hide();
      cls_general.disable_submit(document.getElementById('commandModal'));
      swal({
        title: 'Titulo',
        text: "Puede ingresar un nombre para este pedido o dejarlo en blanco.",

        content: {
          element: "input",
          attributes: {
            placeholder: "Solo letras",
            type: "text",
          },
        },
      })
        .then((title) => {
          if (cls_general.is_empty_var(title) === 0) {
            title = 'Contado';
          }
          cls_command.store(table_slug, title.replace(/[^a-zA-Z]/g, ""));
        });
    } else {
      cls_command.update(request_slug, table_slug);
    }
  }
  store(table_slug, title) {
    var command_list = cls_command.command_list;
    var client = document.getElementById('requestClient');
    var consumption = document.getElementById('commandConsumption').value;
    var observation = document.getElementById('commandObservation').value;

    var url = '/command/'; var method = 'POST';
    var body = JSON.stringify({ a: command_list, b: table_slug, c: client.name, d: 'Ped.' + title, e: consumption, f: observation });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('btn_commandprocess').name = obj.data.request.tx_request_slug;
        document.getElementById('container_buttonUpdateInfo').innerHTML = `<button class="btn btn-lg btn-info" type="button" onclick="cls_general.disable_submit(this); cls_request.update_info('${obj.data.request.tx_request_slug}')">Actualizar</button>`;
        cls_command.command_procesed = obj.data.command_procesed;
        cls_command.command_list = [];
        var content_command_procesed = cls_command.generate_articleprocesed_newsale(cls_command.command_procesed);
        cls_command.render_articleselected();
        var total_sale = cls_general.calculate_sale(content_command_procesed.price);

        document.getElementById('commandList').innerHTML = content_command_procesed.content;
        document.getElementById('requestTotal').innerHTML = 'B/ ' + cls_general.val_price(total_sale.total, 2, 1, 1);

        if (obj.data.cashier === 1) {
          swal({
            title: "¿Desea cobrar este pedido?",
            icon: "info",

            buttons: {
              si: {
                text: "Si, cobrarlo",
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
                  var request_slug = document.getElementById('btn_commandprocess').name;
                  var url = '/request/' + request_slug + '/close';
                  var method = 'PUT';
                  var body = JSON.stringify({ a: 1 });;
                  var funcion = function (obj) {
                    if (obj.status === 'success') {
                      window.location = "/paydesk";
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
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  update(request_slug) {
    var command_list = cls_command.command_list;
    var consumption = document.getElementById('commandConsumption').value;
    var observation = document.getElementById('commandObservation').value;

    var url = '/command/' + request_slug; var method = 'PUT';
    var body = JSON.stringify({ a: command_list, e: consumption, f: observation });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_command.command_procesed = obj.data.command_procesed;
        cls_command.command_list = [];
        var content_command_procesed = cls_command.generate_articleprocesed_newsale(cls_command.command_procesed);
        cls_command.render_articleselected();
        var total_sale = cls_general.calculate_sale(content_command_procesed.price);

        document.getElementById('commandList').innerHTML = content_command_procesed.content;
        document.getElementById('requestTotal').innerHTML = 'B/ ' + cls_general.val_price(total_sale.total, 2, 1, 1);

        const Modal = bootstrap.Modal.getInstance('#commandModal');
        Modal.hide();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  set_client(slug, name, exent) {
    document.getElementById('requestClient').setAttribute('alt', exent);
    document.getElementById('requestClient').setAttribute('name', slug);
    document.getElementById('requestClient').value = name;

    const Modal = bootstrap.Modal.getInstance('#clientModal');
    if (Modal != null) {
      Modal.hide();
    }

  }

  loginuser_cancel(commanddata_id) {
    document.getElementById('hd_command_cancel').value = commanddata_id;

    const modal = new bootstrap.Modal('#login_cancelModal', {})
    modal.show();
    setTimeout(() => {
      document.getElementById('useremailCancel').focus();
    }, 1000);
  }
  checklogin_cancel() {
    var email = document.getElementById('useremailCancel').value;
    var password = document.getElementById('userpasswordCancel').value;
    var commanddata_id = document.getElementById('hd_command_cancel').value;

    if (cls_general.is_empty_var(email) === 0 || cls_general.is_empty_var(password) === 0) {
      cls_general.shot_toast_bs("Ingrese el usuario y contraseña");
    }
    var url = '/checklogin_cancel/';
    var method = 'POST';
    var body = JSON.stringify({ a: email, b: password });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_command.cancel(commanddata_id);
        document.getElementById('useremailCancel').value = '';
        document.getElementById('userpasswordCancel').value = '';

        const modal_inspect = bootstrap.Modal.getInstance('#login_cancelModal');
        modal_inspect.hide();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
  cancel(commanddata_id) {
    swal({
      title: "¿Desea anular esta comanda?",
      text: "El artículo no se cobrará;.",
      icon: "warning",

      buttons: {
        si: {
          text: "Si, restituir inventario",
          className: "btn btn-success btn-lg"
        },
        solo: {
          text: "Si (Solo anular)",
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
            var url = '/command/' + commanddata_id + '/cancel';
            var method = 'PUT';
            var body = JSON.stringify({ a: 1 });;
            var funcion = function (obj) {
              if (obj.status === 'success') {

                

                var content_command = cls_command.generate_articleprocesed(obj.data.command_procesed)
                document.getElementById('container_commandlist').innerHTML = content_command.content;
                let price = cls_general.calculate_sale(content_command.price)
                document.getElementById('sp_gross').innerHTML = 'B/. ' + cls_general.val_price(price.gross_total, 2, 1, 1);
                document.getElementById('sp_discount').innerHTML = 'B/. ' + cls_general.val_price(price.discount, 2, 1, 1);
                document.getElementById('sp_subtotal').innerHTML = 'B/. ' + cls_general.val_price(price.subtotal, 2, 1, 1);
                document.getElementById('sp_tax').innerHTML = 'B/. ' + cls_general.val_price(price.tax, 2, 1, 1);
                document.getElementById('sp_total').innerHTML = 'B/. ' + cls_general.val_price(price.total, 2, 1, 1);

                cls_charge.charge_request = { request_id: obj.data.request_info.ai_request_id, gross_total: price.gross_total, subtotal: price.subtotal, total: price.total, discount: price.discount, tax: price.tax };






              } else {
                // document.getElementById('commandList').innerHTML = content_commandList;
                // document.getElementById('requestTotal').innerHTML = content_requestTotal;

                cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
              }
            }
            cls_general.async_laravel_request(url, method, funcion, body);
            break;
          case 'solo':
            // var content_commandList = document.getElementById('commandList').innerHTML;
            // var content_requestTotal = document.getElementById('requestTotal').innerHTML;

            // document.getElementById('commandList').innerHTML = '<img src="attached/image/loading.gif" width="30px"></img>';
            // document.getElementById('requestTotal').innerHTML = '<img src="attached/image/loading.gif" width="10px"></img>';

            var url = '/command/' + commanddata_id + '/cancel';
            var method = 'PUT';
            var body = JSON.stringify({ a: 0 });;
            var funcion = function (obj) {
              if (obj.status === 'success') {

                cls_command.command_procesed = obj.data.command_procesed;
                var command_procesed = cls_command.generate_articleprocesed_newsale(cls_command.command_procesed);
                var total_sale = cls_general.calculate_sale(command_procesed.price);

                document.getElementById('commandList').innerHTML = command_procesed.content;
                document.getElementById('requestTotal').innerHTML = 'B/ ' + cls_general.val_price(total_sale.total, 2, 1, 1);
              } else {
                document.getElementById('commandList').innerHTML = content_commandList;
                document.getElementById('requestTotal').innerHTML = content_requestTotal;

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


  // API
  create_request(raw_data) {
    var onlinerequest_info = raw_data.request_api;
    var onlinerequest_slug = onlinerequest_info.tx_request_slug

    var table_slug = '';
    var opt_tablelist = '';
    cls_table.table_list.map((table) => {
      if (table.tx_table_active === 1) {
        if (table.tx_table_value === onlinerequest_info.tx_table_value) {
          opt_tablelist += `<option value="${table.ai_table_id}" selected>${table.tx_table_code} - ${table.tx_table_value}</option>`;
          table_slug = table.tx_table_slug;
        }else{
          opt_tablelist += `<option value="${table.ai_table_id}">${table.tx_table_code} - ${table.tx_table_value}</option>`;
        }
        // opt_tablelist += (table.tx_table_value === onlinerequest_info.tx_table_value) ? `<option value="${table.ai_table_id}" selected>${table.tx_table_code} - ${table.tx_table_value}</option>` : `<option value="${table.ai_table_id}">${table.tx_table_code} - ${table.tx_table_value}</option>`;
      }
    })

    var request_code = 'Sin c&oacute;digo';
    var client_name = 'Contado';
    var client_slug = '001';
    var exempt = 0;

    if (cls_general.is_empty_var(table_slug) === 0) {
      cls_table.table_list.map((table) => {
        if (table.tx_table_active === 1 && table.tx_table_type === 1) {
          table_slug = table.tx_table_slug;
        }
      })
    }

    if (table_slug === '') {
      cls_general.shot_toast_bs('No existe alguna barra activa.', { bg: 'text-bg-warning' });
    }

    var content_command_procesed = `<div class="list-group">`;
    var command_procesed = raw_data.commanddata;
    var raw_price = [];
    command_procesed.map((command) => {
      var raw_command = command.tx_commanddata_option.split(',');
      if (raw_command.length > 1) {
        var option = '<ul>';
        raw_command.map((opt) => { option += `<li>${opt}</li>` });
        option += '</ul>';
      } else {
        var option = '';
      }
      var observation = (cls_general.is_empty_var(command.tx_command_observation) === 1) ? ', <strong>Obs.</strong> ' + command.tx_command_observation : '';
      if (command.tx_commanddata_status === 0) {
        var bg_status = 'text-bg-warning text-body-tertiary';
        var btn = ``;
      } else {
        // [{ PRICE, discount, tax, quantity }]
        raw_price.push({ price: command.tx_commanddata_price, discount: command.tx_commanddata_discountrate, tax: command.tx_commanddata_taxrate, quantity: command.tx_commanddata_quantity });
        var bg_status = '';
      }


      var recipe = JSON.parse(command.tx_commanddata_recipe);
      var content_recipe = '<ul class="fs_14">';
      recipe.map((ingredient) => {
        for (const index in ingredient) {
          content_recipe += `<li><small  class="fs_14">${index}</small></li>`;
        }
      })
      content_recipe += `</ul>`;

      content_command_procesed += `
        <a href="#" class="list-group-item list-group-item-action ${bg_status}" data-bs-toggle="modal" data-bs-target="#modalArticleList" aria-current="true" onclick="event.preventDefault(); cls_command.filter_articlethumbnail('')">
          <div class="d-flex w-100 justify-content-between">
            <span class="mb-1">${command.tx_commanddata_quantity} - ${command.tx_commanddata_description} (${command.tx_presentation_value})</h5>
            <br/>
          </div>
          ${content_recipe}
          <p class="mb-1">${option}</p>
          <small>Consumo: ${command.tx_request_consumption}${observation}</small><br/>
        </a>
      `;
    })
    content_command_procesed += `</div>`;


    var raw_total = cls_general.calculate_sale(raw_price);
    var raw_category = [];
    cls_article.article_list.map((article) => {
      var cat = raw_category.find((category) => { return category === article.tx_category_value })
      if (cls_general.is_empty_var(cat) === 0) {
        raw_category.push(article.tx_category_value);
      }
    })
    var content_categorythumbnail = '';
    raw_category.map((category) => {
      content_categorythumbnail += `<button class="btn btn-primary fs_20" style="height: 8vh;" onclick="cls_command.filter_articlethumbnail_category('${category}');">${category}</button>&nbsp;`;
    })
    document.getElementById('container_articlethumbnail_categories').innerHTML = content_categorythumbnail;
    switch (onlinerequest_info.tx_request_paymentmethod) {
      case 'yappy':
        var payment = 'Pagado por Yappy'
        break;
      case 'creditcard':
        var payment = 'Pagado TDC';
        break
      default:
        var payment = 'Pago en caja'
        break;
    }

    var content = `
      <div class="row">
        <div class="col-12 col-lg-3">
          <div class="row">
            <div class="col-sm-12">
              <p class="mb-0">Pedido En linea</p>
              <p class="mb-0 font_bolder">${payment}</p>
              <p class="mb-0 fst-italic">Observacion. ${(cls_general.is_empty_var(onlinerequest_info.tx_request_observation) === 0) ? '' : onlinerequest_info.tx_request_observation}</p>
            </div>
            <div id="article_online" class="col-xs-12 v_scrollable" style="height: 80vh; transition: all ease 1s;">
              ${content_command_procesed}
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-4">
          <div class="row">
            <div class="col-sm-6">
              <span>Art&iacute;culos Seleccionados</span>
            </div>
            <div class="col-sm-6 bs_1 border_gray radius_10 text-bg-success text-truncate text-right">
              <span id="span_commandTotal"><h5>Total: B/ 0.00</h5></span>
            </div>
            <div id="article_selected" class="col-xs-12 v_scrollable" style="height: 90vh; transition: all ease 1s;">
            </div>
          </div>
        </div>
        <div class="col-lg-1 text-center d-none d-lg-block d-xxl-block">
          <div class="row">
            <div class="col-md-12 text-center" style="height:20vh;display: flex;align-items: top;">
              <button class="btn btn-warning btn-lg h_50" data-bs-toggle="tooltip" data-bs-title="Cerrar Pedido" onclick="cls_request.close_inaction(this)">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="30" fill="currentColor" class="bi bi-door-closed-fill" viewBox="0 0 16 16">
                  <path d="M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1h8zm-2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                </svg>
              </button>
            </div>

            <div class="col-md-12 text-center" style="height:60vh;display: flex;align-items: center;">
              <button id="btn_commandprocess" class="btn tmgreen_bg btn-lg h_150" name="" onclick="cls_command.save_online(this.name,'${table_slug}','${onlinerequest_slug}');" data-bs-toggle="tooltip" data-bs-title="Procesar Comanda">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                </svg>
              </button>
            </div>
            <div class="col-md-12 text-center" style="height:10vh;display: flex;align-items: top;">
              <button class="btn btn-danger btn-lg h_50" data-bs-toggle="tooltip" data-bs-title="Cerrar Pedido Online" onclick="cls_command.close_online(document.getElementById('btn_commandprocess'),'${onlinerequest_slug}')">
                <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="28" width="30" viewBox="0 0 980.029 980.029" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M980.029,144.398H0v691.233h980.029V144.398z M915.029,770.631H65V209.398h850.029V770.631z"></path> <polygon points="887.334,561.987 821.303,561.987 821.303,537.022 887.334,537.022 887.334,472.022 821.303,472.022 821.303,448.988 887.334,448.988 887.334,383.988 756.303,383.988 756.303,626.987 887.334,626.987 "></polygon> <polygon points="220.225,561.987 154.195,561.987 154.195,448.988 220.225,448.988 220.225,383.988 89.195,383.988 89.195,626.987 220.225,626.987 "></polygon> <path d="M570.568,383.988H407.038v242.998h163.531V383.988z M505.568,561.987h-33.531V448.988h33.531V561.987z"></path> <polygon points="379.841,561.987 313.81,561.987 313.81,385.544 248.81,385.544 248.81,626.987 379.841,626.987 "></polygon> <polygon points="728.504,472.022 662.867,472.022 662.867,448.994 728.898,448.994 728.898,383.994 597.867,383.994 597.867,537.022 663.504,537.022 663.504,560.051 597.473,560.051 597.473,625.051 728.504,625.051 "></polygon> </g> </g> </g></svg>
              </button>
            </div>
            <div class="col-md-12 text-center" style="height:10vh;display: flex;align-items: bottom;">
              <button class="btn btn-secondary btn-lg h_50" onclick="window.location.href = '/paydesk';" data-bs-toggle="tooltip" data-bs-title="Salir">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-12 text-center d-md-block d-lg-none">
          <div class="row">
            <div class="col-md-4 text-center">
              <button class="btn btn-warning btn-lg h_50" onclick="cls_request.close_inaction(this)">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="30" fill="currentColor" class="bi bi-door-closed-fill" viewBox="0 0 16 16">
                  <path d="M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1h8zm-2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                </svg>
                Cerrar Pedido
              </button>
            </div>

            <div class="col-md-4 text-center">
              <button id="btn_commandprocess" class="btn tmgreen_bg btn-lg h_50" name="" onclick="cls_command.save_online(this.name,'${table_slug}','${onlinerequest_slug}');">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                </svg>
                Procesar Comanda
              </button>
            </div>
            <div class="col-md-2 text-center pb-1">
              <button class="btn btn-danger btn-lg h_50" data-bs-toggle="tooltip" data-bs-title="Cerrar Pedido Online" onclick="cls_command.close_online(document.getElementById('btn_commandprocess'),'${onlinerequest_slug}')">
                <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="28" width="30" viewBox="0 0 980.029 980.029" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M980.029,144.398H0v691.233h980.029V144.398z M915.029,770.631H65V209.398h850.029V770.631z"></path> <polygon points="887.334,561.987 821.303,561.987 821.303,537.022 887.334,537.022 887.334,472.022 821.303,472.022 821.303,448.988 887.334,448.988 887.334,383.988 756.303,383.988 756.303,626.987 887.334,626.987 "></polygon> <polygon points="220.225,561.987 154.195,561.987 154.195,448.988 220.225,448.988 220.225,383.988 89.195,383.988 89.195,626.987 220.225,626.987 "></polygon> <path d="M570.568,383.988H407.038v242.998h163.531V383.988z M505.568,561.987h-33.531V448.988h33.531V561.987z"></path> <polygon points="379.841,561.987 313.81,561.987 313.81,385.544 248.81,385.544 248.81,626.987 379.841,626.987 "></polygon> <polygon points="728.504,472.022 662.867,472.022 662.867,448.994 728.898,448.994 728.898,383.994 597.867,383.994 597.867,537.022 663.504,537.022 663.504,560.051 597.473,560.051 597.473,625.051 728.504,625.051 "></polygon> </g> </g> </g></svg>
              </button>
            </div>
            <div class="col-md-2 text-center">
              <button class="btn btn-secondary btn-lg h_50" onclick="window.location.href = '/paydesk';">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                </svg>
                Volver
              </button>
            </div>
          </div>
        </div>




        <div class="col-md-12 col-lg-4">
          <div class="row">
            <span>Listado de Comandas</span>
            <div id="commandList" class="col-sm-12 v_scrollable" style="height: 70vh">
            </div>
            <div class="col-sm-12 bt_1 border_gray">
              <div class="row">
                <label for="requestClient">Cliente</label>
                <div class="col-md-12 col-lg-6">
                  <div class="input-group mb-3">
                    <input type="text" class="form-control" id="requestClient" alt="${exempt}" name="${client_slug}" value="${client_name}" readonly onfocus="cls_client.render_modal()">
                    <button class="btn btn-outline-secondary" type="button" onclick="cls_client.render_modal()">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="col-md-12 col-lg-6 fs_30 bs_1 border_gray radius_10 text-bg-success text-truncate">
                  <label class="fs_10">Total</label>
                  <span id="requestTotal">B/ ${cls_general.val_price(raw_total.total)} </span>
                </div>
                <div class="col-md-12 col-lg-4">
                  <label for="requestCode">C&oacute;digo</label>
                  <input type="text" class="form-control" id="requestCode" placeholder="${request_code}" readonly>
                </div>
                <div class="col-md-12 col-lg-4">
                  <label for="requestTable">Mesa</label>
                  <select class="form-select" id="requestTable"><option>Seleccione</option>${opt_tablelist}</select>
                </div>
                <div id="container_buttonUpdateInfo" class="col-md-12 col-lg-4 pt-2 text-center">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('container_request').innerHTML = content;

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

  }
  save_online(request_slug, table_slug, onlinerequest_slug) { //ESTA FUNCION SOLO ABRE EL MODAL
    var command_list = cls_command.command_list;
    if (command_list < 1) {
      cls_general.shot_toast_bs('Seleccione los art&iacute;culos.', { bg: 'text-bg-warning' });
      return false;
    }
    var content = `
      <div class="row">
        <div class="col-md-12">
          <label for="commandConsumption">Consumo</label>
          <select id="commandConsumption" class="form-select">
            <option value="Local">Local</option>
            <option value="Retira">Retira</option>
            <option value="Llevar">Llevar</option>
          </select>
        </div>  
        <div class="col-md-12">
          <label for="commandObservation">Observaciones</label>
          <textarea id="commandObservation" class="form-control" onfocus="cls_general.franz_textarea(this,this.value)" onkeyup="cls_general.limitText(this,120,1)" onblur="cls_general.limitText(this,120,1)"></textarea>
        </div>
      </div>
    `;
    var footer = `
      <div class="row">
        <div class="col-sm-12">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary" onclick="cls_general.disable_submit(this,0); cls_command.process_online('${request_slug}','${table_slug}','${onlinerequest_slug}')">Guardar</button>
        </div>
      </div>
    `;

    document.getElementById('commandModal_title').innerHTML = 'Despacho';
    document.getElementById('commandModal_content').innerHTML = content;
    document.getElementById('commandModal_footer').innerHTML = footer;

    const modal = new bootstrap.Modal('#commandModal', {})
    modal.show();
  }
  process_online(request_slug, table_slug, onlinerequest_slug) {
    if (cls_general.is_empty_var(request_slug) === 0) {
      const Modal = bootstrap.Modal.getInstance('#commandModal');
      Modal.hide();
      cls_general.disable_submit(document.getElementById('commandModal'));
      swal({
        title: 'Titulo',
        text: "Puede ingresar un nombre para este pedido o dejarlo en blanco.",

        content: {
          element: "input",
          attributes: {
            placeholder: "Solo letras",
            type: "text",
          },
        },
      })
        .then((title) => {
          if (cls_general.is_empty_var(title) === 0) {
            title = 'Contado';
          }
          cls_command.store_online(table_slug, title.replace(/[^a-zA-Z]/g, ""), onlinerequest_slug);
        });
    } else {
      cls_command.update_online(request_slug, onlinerequest_slug);
    }
  }
  store_online(table_slug, title, onlinerequest_slug) {
    cls_general.disable_submit(document.getElementById('btn_commandprocess'),0);
    var command_list = cls_command.command_list;
    var client = document.getElementById('requestClient');
    var consumption = document.getElementById('commandConsumption').value;
    var observation = document.getElementById('commandObservation').value;

    var url = '/command/'; var method = 'POST';
    var body = JSON.stringify({ a: command_list, b: table_slug, c: client.name, d: 'Ped.' + title, e: consumption, f: observation, g: onlinerequest_slug, h: cls_charge.api_token });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('btn_commandprocess').name = obj.data.request.tx_request_slug;
        document.getElementById('container_buttonUpdateInfo').innerHTML = `<button class="btn btn-lg btn-info" type="button" onclick="cls_general.disable_submit(this); cls_request.update_info('${obj.data.request.tx_request_slug}')">Actualizar</button>`;
        cls_command.command_procesed = obj.data.command_procesed;
        cls_command.command_list = [];
        var content_command_procesed = cls_command.generate_articleprocesed_newsale(cls_command.command_procesed);
        cls_command.render_articleselected();
        var total_sale = cls_general.calculate_sale(content_command_procesed.price);

        document.getElementById('commandList').innerHTML = content_command_procesed.content;
        document.getElementById('requestTotal').innerHTML = 'B/ ' + cls_general.val_price(total_sale.total, 2, 1, 1);

        document.getElementById('btn_commandprocess').disabled = false; 

        if (obj.data.cashier === 1) {
          swal({
            title: "¿Desea cobrar este pedido?",
            icon: "info",

            buttons: {
              si: {
                text: "Si, cobrarlo",
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
                var request_slug = document.getElementById('btn_commandprocess').name;
                var url = '/request/' + request_slug + '/close';
                var method = 'PUT';
                var body = JSON.stringify({ a: 1 });;
                var funcion = function (obj) {
                  if (obj.status === 'success') {
                    window.location = "/paydesk";
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
      } else {
        if (obj.message === 'La mesa esta ocupada.') {
          cls_command.update_online(obj.data.tx_request_slug, onlinerequest_slug);
        }else{
          document.getElementById('btn_commandprocess').disabled = false;
          cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
        }
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  update_online(request_slug, onlinerequest_slug) {
    var command_list = cls_command.command_list;
    var consumption = document.getElementById('commandConsumption').value;
    var observation = document.getElementById('commandObservation').value;

    var url = '/command/' + request_slug; var method = 'PUT';
    var body = JSON.stringify({ a: command_list, e: consumption, f: observation, g: onlinerequest_slug, h: cls_charge.api_token });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_command.command_procesed = obj.data.command_procesed;
        cls_command.command_list = [];
        var content_command_procesed = cls_command.generate_articleprocesed_newsale(cls_command.command_procesed);
        cls_command.render_articleselected();
        var total_sale = cls_general.calculate_sale(content_command_procesed.price);

        document.getElementById('commandList').innerHTML = content_command_procesed.content;
        document.getElementById('requestTotal').innerHTML = 'B/ ' + cls_general.val_price(total_sale.total, 2, 1, 1);

        const Modal = bootstrap.Modal.getInstance('#commandModal');
        if (Modal) {
          Modal.hide();
        }
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  close_online(btn, onlinerequest_slug) {
    swal({
      title: "¿Se cerrará el pedido online?",
      text: "¿Le informó al cliente?.",
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
            cls_general.disable_submit(btn);
            var url = cls_charge.api_url + 'APIrequest/' + onlinerequest_slug + '/closeit'; var method = 'PUT';
            var body = '';
            var funcion = function (obj) {
              if (obj.status === 'success') {
                window.location.href = '/paydesk'
              } else {
                cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
              }
            }
            var api_token = cls_charge.api_token;
            cls_general.async_api_request(url, method, funcion, body, api_token);
            // cls_general.async_laravel_request(url, method, funcion, body);
            break;
          case 'no':

            break;
        }
      });
  }

}
class class_article{
  constructor(article_list) {
    this.article_list = article_list;
  }
  look_for(str, limit) {
    var haystack = cls_article.article_list;
    var needles = str.split(' ');
    var raw_filtered = [];
    var counter = 0;
    for (var i in haystack) {
      if (counter >= limit) { break; }
      var ocurrencys = 0;
      for (const a in needles) {
        if (haystack[i]['tx_article_code'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_article_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
      }
      if (ocurrencys === needles.length) {
        raw_filtered.push(haystack[i]);
        counter++;
      }
    }
    return raw_filtered;
  }
  look_for_category(str) {
    var haystack = cls_article.article_list;
    var needles = str.split(' ');
    var raw_filtered = [];
    var counter = 0;
    for (var i in haystack) {
      var ocurrencys = 0;
      for (const a in needles) {
        if (haystack[i]['tx_category_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
      }
      if (ocurrencys === needles.length) {
        raw_filtered.push(haystack[i]);
        counter++;
      }
    }
    return raw_filtered;
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
    this.pass = 'tequilaymezcal2023';
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
            <small> Cajera: ${cashregister['user_name']}</small>
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
  generate_inspectedCR(cashregister,payment,canceled,giftcard,charge_list){
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

    var detail_list = '';
    charge_list.map((charge) => {
      detail_list += `
        <tr>
          <td>${cls_general.datetime_converter(charge.created_at)} ${cls_general.time_converter(charge.created_at,1)}</td>
          <td>${charge.tx_charge_number}</td>
          <td>${charge.tx_client_name} RUC ${charge.tx_client_cif} DV ${charge.tx_client_dv}</td>
          <td>${cls_general.val_price(charge.tx_charge_total)}</td>
        </tr>
      `
    })
    var detail = `
      <div class="row">
        <div class="col-12">
          <table class="table table-bordered">
            <thead>
              <tr class="table-success text-center">
                <th>Fecha</th>
                <th>#</th>
                <th>Cliente</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
            ${detail_list}
            </tbody>
          </table>
        </div>
      </div>
      `;

    return {title: title, content: content, detail: detail};
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
        var raw_inspected = cls_cashregister.generate_inspectedCR(obj.data.cashregister, obj.data.payment, obj.data.canceled, total_giftcard, obj.data.charge)
        document.getElementById('inspectCR_title').innerHTML = raw_inspected.title;
        document.getElementById('inspectCR_container').innerHTML = raw_inspected.content + raw_inspected.detail;

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

  generate_modal_clientlist(filtered) {
    var content = '<ul class="list-group">';
    filtered.map((client) => {
      content += `<li class="list-group-item cursor_pointer" onclick="cls_command.set_client('${client.tx_client_slug}','${client.tx_client_name}',${client.tx_client_exempt})">${client.tx_client_name} - ${client.tx_client_cif}</li>`;
    })
    content += '</ul>';
    return content;
  }
  async filter_modal(str) {
    document.getElementById('container_clientfiltered').innerHTML = cls_client.generate_modal_clientlist(await cls_client.look_for(str, 200));
  }
  render_modal() {
    var btn_update_client = (cls_general.is_empty_var(document.getElementById('requestClient').name) === 0 || document.getElementById('requestClient').name === "1") ? '' : '<button type="button" class="btn btn-warning" onclick="cls_client.render_modal_edit()">Modificar Cliente</button>';

    var content = `
      <div class="row">
        <div class="col-md-12 text-center">
          <button type="button" class="btn btn-primary" onclick="cls_client.render_modal_create('','','','','','','',0,102,1)">Crear Cliente</button>&nbsp;
          ${btn_update_client}
        </div>
        <div class="col-md-12 col-lg-6 pb-1">
          <label for="clientFilter" class="form-label">Buscar Cliente</label>
          <input type="text" id="clientFilter" class="form-control" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_client.filter_modal(this.value)">
        </div>
        <div id="container_clientfiltered" class="col-sm-12 h_300 v_scrollable"></div>
      </div>
    `;
    var footer = `
      <div class="row">
        <div class="col-sm-12">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    `;

    document.getElementById('clientModal_title').innerHTML = 'Clientes';
    document.getElementById('clientModal_content').innerHTML = content;
    document.getElementById('clientModal_footer').innerHTML = footer;
    cls_client.filter_modal('')
    const modal = new bootstrap.Modal('#clientModal', {})
    modal.show();
  }
  render_modal_create(slug, name, cif, dv, telephone, email, direction, exempt, taxpayer, status) {
    var exempt_checked = (exempt === 1) ? 'checked' : '';
    var status_checked = (status === 1) ? 'checked' : '';
    dv = (cls_general.is_empty_var(dv) === 0) ? '' : dv;
    telephone = (cls_general.is_empty_var(telephone) === 0) ? '' : telephone;
    direction = (cls_general.is_empty_var(direction) === 0) ? '' : direction;
    email = (cls_general.is_empty_var(email) === 0) ? '' : email;
    if (cls_general.is_empty_var(slug) === 0) {
      document.getElementById('requestClient').name = '';
      document.getElementById('requestClient').value = '';
    }
    var content = `
      <div class="row">
        <div class="col-md-12">
          <label for="clientName" class="form-label">Nombre y Apellido</label>
          <input type="text" id="clientName" name="${slug}" class="form-control" onfocus="cls_general.validFranz(this.id, ['number','word','punctuation'])" onkeyup="cls_general.limitText(this,120,1)" onblur="cls_general.limitText(this,120,1)" value="${name}">
        </div>
        <div class="col-md-12 col-lg-6">
          <label for="clientCIF" class="form-label">C&eacute;dula/Pasaporte</label>
          <input type="text" id="clientCIF" class="form-control" onfocus="cls_general.validFranz(this.id, ['number','word'],'-')" onkeyup="cls_general.limitText(this,20,1)" onblur="cls_general.limitText(this,20,1)" value="${cif}">
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
          <div class="form-check form-switch pt_35">
            <input class="form-check-input" type="checkbox" role="switch" id="clientExempt" ${exempt_checked}>
            <label class="form-check-label" for="clientExempt">Exento</label>
          </div>
        </div>
        <div class="col-md-12 col-lg-3">
          <div class="form-check form-switch pt_35">
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

    `;
    var footer = `
      <div class="row">
        <div class="col-sm-12">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary" onclick="cls_client.save()">Guardar</button>
        </div>
      </div>
    `;

    document.getElementById('clientModal_title').innerHTML = 'Clientes';
    document.getElementById('clientModal_content').innerHTML = content;
    document.getElementById('clientModal_footer').innerHTML = footer;
    document.getElementById('clientTaxpayer').value = taxpayer;
  }
  render_modal_edit() {
    var client_slug = document.getElementById('requestClient').name;
    var url = '/client/' + client_slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      var client = obj.data.client;
      if (obj.status === 'success') {
        cls_client.render_modal_create(client.tx_client_slug, client.tx_client_name, client.tx_client_cif, client.tx_client_dv, client.tx_client_telephone, client.tx_client_email, client.tx_client_direction, client.tx_client_exempt, client.tx_client_taxpayer + client.tx_client_type, client.tx_client_status);
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
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
class class_table {
  constructor(raw_table){
    this.table_list = raw_table
  }
}
