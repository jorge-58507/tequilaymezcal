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

class class_table{
  constructor (raw_table){
    this.table_list = raw_table;
  }
  render(table_list){
    var content_tab = ''; 
    var ubication_str = '';
    var content_tab_container = '';
    table_list.map((table,index) => {
      if (table.tx_ubication_value != ubication_str) {
        content_tab += (index === 0) ? `
          <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#${table.tx_ubication_prefix}" type="button" role="tab" aria-controls="nav-home" aria-selected="true">${table.tx_ubication_value}</button>
        `: `
          <button class="nav-link" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#${table.tx_ubication_prefix}" type="button" role="tab" aria-controls="nav-home" aria-selected="true">${table.tx_ubication_value}</button>
        `;
        ubication_str = table.tx_ubication_value;
        if (index != 0) {
          content_tab_container += `
            </div>
          </div>
          `;
        }
        content_tab_container += (index === 0) ? `
          <div class="tab-pane fade show active" id="${ table.tx_ubication_prefix}" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
            <div class="row">
        `: `
          <div class="tab-pane fade" id="${table.tx_ubication_prefix}" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
            <div class="row">
        `;
      }
      if(table.tx_table_type === 2) {
        var img_button = (cls_general.is_empty_var(table['tx_table_image']) === 1) ? `<img src="attached/image/table/${table['tx_table_image']}" width="70px"></img>` : `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 58.001 58.001" width="70" height="70" xml:space="preserve">
            <path style="fill:#88C057;" d="M29,19.5c-0.552,0-1-0.447-1-1v-8c0-0.553,0.448-1,1-1s1,0.447,1,1v8C30,19.053,29.552,19.5,29,19.5z"></path><path style="fill:#88C057;" d="M29,17.5c-0.256,0-0.512-0.098-0.707-0.293l-2-2c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0l2,2c0.391,0.391,0.391,1.023,0,1.414C29.512,17.403,29.256,17.5,29,17.5z"></path><path style="fill:#88C057;" d="M29,15.5c-0.256,0-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023,0-1.414l2-2c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414l-2,2C29.512,15.403,29.256,15.5,29,15.5z"></path><path style="fill:#553323;" d="M57,54.5c-0.426,0-0.82-0.273-0.954-0.702l-5-16c-0.165-0.526,0.129-1.088,0.656-1.252c0.525-0.166,1.088,0.128,1.253,0.656l5,16c0.165,0.526-0.129,1.088-0.656,1.252C57.199,54.486,57.099,54.5,57,54.5z"></path><path style="fill:#553323;" d="M47.001,54.5c-0.081,0-0.162-0.01-0.244-0.03c-0.536-0.134-0.861-0.677-0.728-1.212l4-16c0.135-0.536,0.68-0.86,1.213-0.728c0.536,0.134,0.861,0.677,0.728,1.212l-4,16C47.857,54.198,47.449,54.5,47.001,54.5z"></path><path style="fill:#553323;" d="M11,54.5c-0.426,0-0.82-0.273-0.954-0.702l-5-16c-0.165-0.526,0.129-1.088,0.656-1.252c0.525-0.166,1.088,0.128,1.253,0.656l5,16c0.165,0.526-0.129,1.088-0.656,1.252C11.199,54.486,11.099,54.5,11,54.5z"></path><path style="fill:#553323;" d="M1.001,54.5c-0.081,0-0.162-0.01-0.244-0.03c-0.536-0.134-0.861-0.677-0.728-1.212l4-16c0.134-0.536,0.678-0.86,1.213-0.728c0.536,0.134,0.861,0.677,0.728,1.212l-4,16C1.857,54.198,1.449,54.5,1.001,54.5z"></path><path style="fill:#C7CAC7;" d="M18,53.5h22c-4.971,0-9-4.029-9-9v-9h3v-4H24v4h3v9C27,49.471,22.971,53.5,18,53.5z"></path><path style="fill:#553323;" d="M48.043,27.5H9.958c1.152,1.147,2.091,2.504,2.779,4h32.526C45.952,30.004,46.89,28.648,48.043,27.5z"></path><rect x="13" y="24.5" style="fill:#C7CAC7;" width="6" height="3"></rect><path style="fill:#C7CAC7;" d="M21,25.5H11c-0.552,0-1-0.447-1-1s0.448-1,1-1h10c0.552,0,1,0.447,1,1S21.552,25.5,21,25.5z"></path><rect x="39" y="24.5" style="fill:#C7CAC7;" width="6" height="3"></rect><path style="fill:#C7CAC7;" d="M47,25.5H37c-0.552,0-1-0.447-1-1s0.448-1,1-1h10c0.552,0,1,0.447,1,1S47.552,25.5,47,25.5z"></path><path style="fill:#C7CAC7;" d="M26.025,18.5C25.39,20.093,25,20.192,25,22.5c0,4.97,1.791,5,4,5s4-0.03,4-5c0-2.308-0.39-2.407-1.025-4H26.025z"></path><path style="fill:#DD352E;" d="M29,3.5h-3v4c0,1.65,1.35,3,3,3V3.5z"></path><path style="fill:#B02721;" d="M29,4.5h3v3c0,1.65-1.35,3-3,3V4.5z"></path><path style="fill:#BFA380;" d="M14,37.5H4.366C1.955,37.5,0,35.546,0,33.135V23.5h0.274C7.855,23.5,14,29.646,14,37.226V37.5z"></path><path style="fill:#BFA380;" d="M44,37.5h9.634c2.411,0,4.366-1.955,4.366-4.366V23.5h-0.274C50.146,23.5,44,29.646,44,37.226V37.5z"></path><path style="fill:#839594;" d="M44,54.5H14c-0.552,0-1-0.447-1-1s0.448-1,1-1h30c0.552,0,1,0.447,1,1S44.552,54.5,44,54.5z"></path><rect x="24" y="32.5" style="fill:#839594;" width="10" height="3"></rect><path style="fill:#E7ECED;" d="M30,52.5h-3l0.112-2.014c0.033-0.591,0.172-1.167,0.349-1.732C27.818,47.62,28,46.436,28,45.244V35.5h1v9.744c0,1.192,0.182,2.376,0.538,3.511c0.177,0.565,0.316,1.141,0.349,1.732L30,52.5z"></path>
          </svg>`;
        content_tab_container += `
        <div class="col-sm-6 col-lg-3 text-center">
          <button class="btn btn-success btn-lg my_20" onclick="cls_request.showByTable('${table.tx_table_slug}','${table.tx_table_type}');" style="width: 120px">
            ${img_button}<br/>
            <p class="fs-6 mb_0 text-truncate">${table.tx_table_value}</p>
          </button>
        </div>`; 
      } else {
        var img_button = (cls_general.is_empty_var(table['tx_table_image']) === 1) ? `<img src="attached/image/table/${table['tx_table_image']}" width="70px"></img>` : `<svg height="70" width="70" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000">
            <g id="SVGRepo_bgCarrier" stroke-width="0"/>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
            <g id="SVGRepo_iconCarrier"> <path style="fill:#025037;" d="M406.261,155.826h-11.13V11.13h11.13V155.826z M261.565,11.13h-11.13v144.696h11.13V11.13z M116.87,11.13h-11.13v144.696h11.13V11.13z"/> <path style="fill:#F7F2CD;" d="M467.478,278.261H333.913l55.652-133.565h22.261L467.478,278.261z M267.13,144.696H244.87 l-55.652,133.565h133.565L267.13,144.696z M122.435,144.696h-22.261L44.522,278.261h133.565L122.435,144.696z"/> <path style="fill:#FFFCE3;" d="M446.609,278.261h-91.826l40.812-122.435h10.203L446.609,278.261z M261.101,155.826h-10.203 l-40.811,122.435h91.826L261.101,155.826z M116.405,155.826h-10.203L65.391,278.261h91.826L116.405,155.826z"/> <path style="fill:#F5D470;" d="M369.212,155.826c-1.231-3.483-1.908-7.227-1.908-11.13c0-18.442,14.949-33.391,33.391-33.391 s33.391,14.949,33.391,33.391c0,3.903-0.677,7.648-1.908,11.13H369.212z M287.484,155.826c1.231-3.483,1.908-7.227,1.908-11.13 c0-18.442-14.949-33.391-33.391-33.391s-33.391,14.949-33.391,33.391c0,3.903,0.677,7.648,1.908,11.13H287.484z M142.788,155.826 c1.231-3.483,1.908-7.227,1.908-11.13c0-18.442-14.949-33.391-33.391-33.391s-33.391,14.949-33.391,33.391 c0,3.903,0.677,7.648,1.908,11.13H142.788z"/> <path style="fill:#D19B3F;" d="M434.087,144.696c0,3.903-0.677,7.648-1.908,11.13h-20.353v-11.13c0-6.147-4.983-11.13-11.13-11.13 c-6.147,0-11.13,4.983-11.13,11.13v11.13h-20.353c-1.231-3.483-1.908-7.227-1.908-11.13c0-18.442,14.949-33.391,33.391-33.391 S434.087,126.254,434.087,144.696z M256,111.304c-18.442,0-33.391,14.949-33.391,33.391c0,3.903,0.677,7.648,1.908,11.13h20.353 v-11.13c0-6.147,4.983-11.13,11.13-11.13s11.13,4.983,11.13,11.13v11.13h20.353c1.231-3.483,1.908-7.227,1.908-11.13 C289.391,126.254,274.442,111.304,256,111.304z M111.304,111.304c-18.442,0-33.391,14.949-33.391,33.391 c0,3.903,0.677,7.648,1.908,11.13h20.353v-11.13c0-6.147,4.983-11.13,11.13-11.13c6.147,0,11.13,4.983,11.13,11.13v11.13h20.353 c1.231-3.483,1.908-7.227,1.908-11.13C144.696,126.254,129.746,111.304,111.304,111.304z"/> <path style="fill:#57544C;" d="M500.87,22.261H11.13C4.983,22.261,0,17.278,0,11.13l0,0C0,4.983,4.983,0,11.13,0H500.87 C507.017,0,512,4.983,512,11.13l0,0C512,17.278,507.017,22.261,500.87,22.261z"/> <path style="fill:#D3C6A8;" d="M434.087,489.739L434.087,489.739c0,12.295-9.966,22.261-22.261,22.261H100.174 c-12.295,0-22.261-9.966-22.261-22.261l0,0c0-12.295,9.966-22.261,22.261-22.261h311.652 C424.121,467.478,434.087,477.444,434.087,489.739z"/> <path style="fill:#CA4653;" d="M478.609,467.478H33.391V267.13h445.217V467.478z"/> <path style="fill:#323030;" d="M500.87,478.609H11.13c-6.147,0-11.13-4.983-11.13-11.13l0,0c0-6.147,4.983-11.13,11.13-11.13H500.87 c6.147,0,11.13,4.983,11.13,11.13l0,0C512,473.626,507.017,478.609,500.87,478.609z M512,267.13L512,267.13 c0-6.147-4.983-11.13-11.13-11.13H11.13C4.983,256,0,260.983,0,267.13l0,0c0,6.147,4.983,11.13,11.13,11.13H500.87 C507.017,278.261,512,273.278,512,267.13z"/> <path style="fill:#C6984F;" d="M125.217,500.87h-22.261l38.957-166.957h22.261L125.217,500.87z M347.826,333.913h-22.261 L286.609,500.87h22.261L347.826,333.913z"/> <path style="fill:#AA8144;" d="M164.174,333.913h22.261l38.957,166.957H203.13L164.174,333.913z M386.783,500.87h22.261 l-38.957-166.957h-22.261L386.783,500.87z"/> <path style="fill:#025037;" d="M208.696,356.174h-89.043c-6.147,0-11.13-4.983-11.13-11.13v-22.261c0-6.147,4.983-11.13,11.13-11.13 h89.043c6.147,0,11.13,4.983,11.13,11.13v22.261C219.826,351.191,214.843,356.174,208.696,356.174z M403.478,345.043v-22.261 c0-6.147-4.983-11.13-11.13-11.13h-89.043c-6.147,0-11.13,4.983-11.13,11.13v22.261c0,6.147,4.983,11.13,11.13,11.13h89.043 C398.495,356.174,403.478,351.191,403.478,345.043z"/> <path style="fill:#D3C6A8;" d="M108.522,322.783L108.522,322.783c0-6.147,4.983-11.13,11.13-11.13h89.043 c6.147,0,11.13,4.983,11.13,11.13l0,0H108.522z M403.478,322.783L403.478,322.783c0-6.147-4.983-11.13-11.13-11.13h-89.043 c-6.147,0-11.13,4.983-11.13,11.13l0,0H403.478z"/> <path style="fill:#92393C;" d="M66.783,256c0,6.147-4.983,11.13-11.13,11.13h-11.13c-6.147,0-11.13-4.983-11.13-11.13v-33.391 h33.391V256z"/> <path style="fill:#DB6D53;" d="M50.087,256L50.087,256c-3.073,0-5.565-2.492-5.565-5.565v-27.826h11.13v27.826 C55.652,253.508,53.16,256,50.087,256z"/> <path style="fill:#C6984F;" d="M178.087,250.435v11.13c0,3.073-2.492,5.565-5.565,5.565h-66.783c-3.073,0-5.565-2.492-5.565-5.565 v-11.13c0-3.073,2.492-5.565,5.565-5.565h66.783C175.595,244.87,178.087,247.362,178.087,250.435z"/> <path style="fill:#AA8144;" d="M178.087,250.435V256h-77.913v-5.565c0-3.073,2.492-5.565,5.565-5.565h66.783 C175.595,244.87,178.087,247.362,178.087,250.435z"/> </g>
          </svg>
        `;
        content_tab_container += `
        <div class="col-sm-6 col-lg-3 text-center">
          <button class="btn btn-success btn-lg my_20" onclick="cls_request.showByTable('${table.tx_table_slug}','${table.tx_table_type}');" style="width: 120px">
            ${img_button}<br/>
            <p class="fs-6 mb_0 text-truncate">${table.tx_table_value}</p>
          </button>
        </div>`;
      }
    });
    
    content_tab += `
      <button class="nav-link" id="btn_onlinerequest" onclick="cls_request.get_onlinependant()" data-bs-toggle="tab" data-bs-target="#tab_onlinerequest" type="button" role="tab" aria-controls="nav-home" aria-selected="true">
        P. Online
        <span id="online_counter" class="badge text-bg-danger">
          0
        </span>
      </button>
    `
    content_tab_container += `
        </div>
      </div>
      <div class="tab-pane fade" id="tab_onlinerequest" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
      </div>
    `;



    content_tab_container += `</div>`;
    document.getElementById('nav-tab').innerHTML = content_tab;
    document.getElementById('nav-tabContent').innerHTML = content_tab_container;
  }
}
class class_request {
  constructor(open_request, closed_request, canceled_request, api_url){
    this.open_request = open_request;
    this.closed_request = closed_request;
    this.canceled_request = canceled_request;
    this.api_url = api_url;
    this.api_token = '';
    this.online_pendant = [];
  }
  index(){
    var content = `
      <div class="col-lg-7">
        <div class="row">
          <div class="col-xs-12 v_scrollable bb_1 border_gray" style="height: 100vh;">
            <nav>
              <div class="nav nav-tabs" id="nav-tab" role="tablist">
              </div>
            </nav>
            <div class="tab-content" id="nav-tabContent">
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="row" style="height: 15vh">
          <h5>Pedidos</h5>
          <div class="col-xs-12 col-md-7 pt-2">
            <div class="input-group mb-3">
              <input type="text" id="requestFilter" class="form-control" placeholder="Buscar por C&oacute;digo o Cliente" onkeyup="cls_request.filter(this.value)">
              <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_request.filter(document.getElementById('requestFilter').value)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="col-md-8 col-lg-3 pt-2">
            <select class="form-select" id="requestStatus" onchange="cls_request.filter(document.getElementById('requestFilter').value)">
              <option value="0" selected>Abierto</option>
              <option value="1">Cerrado</option>
              <option value="2">Cobrada</option>
            </select>
          </div>
          <div class="col-md-4 col-lg-2 pt-2">
            <button class="btn btn-info" type="button" id="btn_reloadrequest" onclick="cls_request.reload()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="row">
          <div id="container_requestlist" class="col-xs-12 bx_1 by_1 border_gray radius_5 v_scrollable" style="height: 80vh; padding: 0;">

          </div>
        </div>
      </div>
    `;
    document.getElementById('container_request').innerHTML = content;
  }
  render(target,raw){
    switch (target) {
      case 'open':
        var content = cls_request.generate_openrequest(raw);
      break;
      case 'closed':
        var content = cls_request.generate_closedrequest(raw);
      break;
      case 'cancelled':
        var content = cls_request.generate_cancelledrequest(raw);
      break;
    }
    document.getElementById('container_requestlist').innerHTML = content;
  }
  generate_openrequest(open){
    var content = '<ul class="list-group">';
    open.map((request) => {
      var user_name = (cls_general.is_empty_var(request.user_name) === 0) ? '' :  `(${request.user_name.substr(0, 15)})`;
      content += `<li class="list-group-item cursor_pointer" onclick="cls_request.showByRequest('${request.tx_request_slug}')"><h5>${request.tx_request_code} - ${request.tx_client_name}</h5><small>${request.tx_request_title} ${user_name} - ${request.tx_table_value} (${cls_general.time_converter(request.created_at)})</small></li>`;
    })
    content += '</ul>';
    return content;
  }
  generate_closedrequest(open) {
    var content = '<ul class="list-group">';
    open.map((request) => {
      content += `<li class="list-group-item cursor_pointer" onclick="cls_request.reopenRequest('${request.tx_request_slug}')"><h5>${request.tx_request_code} - ${request.tx_client_name}</h5><small>${request.tx_request_title} - ${request.tx_table_value} (${cls_general.time_converter(request.created_at)})</small></li>`;
    })
    content += '</ul>';
    return content;
  }
  generate_cancelledrequest(open) {
    var content = '<ul class="list-group">';
    open.map((request) => {
      content += `<li class="list-group-item cursor_pointer"><h5>${request.tx_request_code} - ${request.tx_client_name}</h5><small>${request.tx_request_title} - ${request.tx_table_value} (${cls_general.time_converter(request.created_at)})</small></li>`;
    })
    content += '</ul>';
    return content;
  }

  showByTable(table_slug,type) {
    if (type == 1) {
      cls_request.showByBar(table_slug)
    }else{
      var url = '/request/' + table_slug + '/table'; var method = 'GET';
      var body = "";
      var funcion = function (obj) {
        cls_command.command_procesed = obj.data.command_procesed;
        cls_request.render_request(obj.data.request,table_slug);
      }
      cls_general.async_laravel_request(url, method, funcion, body);
    }
  }
  showByBar(bar_slug) {
    var url = '/request/' + bar_slug + '/bar'; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      var content_request = cls_request.generate_openrequest(obj.data.request);
      var content = `
          <div class="row">
            <div class="col-sm-12 text-center py-2">
              <button type="button" class="btn btn-primary btn-lg" data-bs-dismiss="modal" onclick="cls_request.render_request(null,'${bar_slug}')">Nuevo Pedido</button>
            </div>
            <div class="col-sm-12">
              ${content_request}
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
      document.getElementById('requestModal_title').innerHTML = '<h5>Pedidos en Barra </h5 > ';
      document.getElementById('requestModal_content').innerHTML = content;
      document.getElementById('requestModal_footer').innerHTML = footer;

      const modal = new bootstrap.Modal('#requestModal', {})
      modal.show();
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  showByRequest(request_slug) {
    var url = '/request/' + request_slug; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      if (obj.data.command_procesed.length === 0) {
        cls_general.shot_toast_bs('El pedido ya fue cerrado.', { bg: 'text-bg-warning' }); return false;
      }
      var table_slug = obj.data.table.tx_table_slug;
      cls_command.command_procesed = obj.data.command_procesed;
      cls_request.render_request(obj.data.request, table_slug);
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  reopenRequest(request_slug)  {
    var url = '/request/' + request_slug + '/open/';
    var method = 'POST';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_request.open_request = obj.data.open_request;
        cls_request.closed_request = obj.data.closed_request;
        cls_request.canceled_request = obj.data.canceled_request;

        cls_request.showByRequest(request_slug);
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  render_request(request_info, table_slug){
    cls_command.index(request_info, table_slug);
  }
  update_info(request_slug){
    var client = document.getElementById('requestClient').name;
    var table = document.getElementById('requestTable').value;

    var url = '/request/'+request_slug+'/client/table/';
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
  look_for(str,status){
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
            if (haystack[i]['tx_request_code'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_client_name'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_request_title'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_table_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
          }
          if (ocurrencys === needles.length) {
            raw_filtered.push(haystack[i]);
          }
        }
        resolve(raw_filtered)
      }, 500)
    });
  }
  async filter(str) {
    var status = document.getElementById('requestStatus').value;
    var filtered = await cls_request.look_for(str,status);
    switch (status) {
      case "0":
        var content = cls_request.generate_openrequest(filtered)
        break;
      case "1":
        var content = cls_request.generate_closedrequest(filtered)
        break;
      case "2":
        var content = cls_request.generate_cancelledrequest(filtered)
        break;
    }
    document.getElementById('container_requestlist').innerHTML = content;
  }
  close(btn) {
    var request_slug = document.getElementById('btn_commandprocess').name;
    if(cls_general.is_empty_var(request_slug) === 0) {
      cls_general.shot_toast_bs('No hay elementos para cerrar.',{bg: 'text-bg-warning'}); return false;
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
              
              cls_request.index(); //MUESTRA LA INTERFAZ PEDIDO
              cls_table.render(cls_table.table_list); //MUESTRA LAS MESAS
              cls_request.render('open', cls_request.open_request); //MUESTRA LOS PEDIDOS ABIERTOS

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
  reload(){
    var url = '/request/reload';
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_request.open_request = obj.data.open_request;
        cls_request.closed_request = obj.data.closed_request;
        cls_request.canceled_request = obj.data.canceled_request;
        
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  print(){
    var request_slug = document.getElementById('btn_commandprocess').name;
    if (cls_general.is_empty_var(request_slug) === 0) {
      cls_general.shot_toast_bs('No hay artículos agregados.');
    }
    var url = '/request/'+request_slug+'/print';
    var method = 'POST';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_general.shot_toast_bs(obj.message);
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

  // API METHODS
  async api_login() {
    var url = cls_request.api_url + 'APIlogin';
    var method = 'POST';
    var body = JSON.stringify({ email: 'apirequest@mail.com', password: 'requestable7812' });
    var funcion = function (obj) {
      if (obj.data.status === 'success') {
        cls_request.api_token = obj.data.token;
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    await cls_general.async_api_request(url, method, funcion, body);
  }

  async get_onlinependant() {
    var url = cls_request.api_url + 'APIrequest/pendant';
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_request.online_pendant = obj.data;
        cls_request.render_onlinependant();
      } else {
        cls_request.api_login();
        setTimeout(() => {
          cls_request.get_onlinependant();
        }, 5000);
      }
    }
    var api_token = cls_request.api_token;
    await cls_general.async_api_request(url, method, funcion, body, api_token);
  }
  render_onlinependant(){
    var list = cls_request.generate_onlinerequest(cls_request.online_pendant.slice(0, 10));
    document.getElementById('online_counter').innerHTML = list.counter;
    document.getElementById('tab_onlinerequest').innerHTML = list.content;
  }
  generate_onlinerequest(raw_request) {
    var content = '<div class="row"><div class="col-12"><ul class="list-group">';
    var counter = 0;
    raw_request.map((request) => {
      if (request.tx_request_status === 1) {
        var bg_status = 'text-bg-warning';
        counter++;
      }
      var table = (cls_general.is_empty_var(request.tx_table_value) === 0) ? 'Sin Mesa' : request.tx_table_value;
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
      content += `<li class="list-group-item cursor_pointer d-flex justify-content-between align-items-start ${bg_status}" onclick="cls_command.create_request('${request.tx_request_slug}')">
          <div class="ms-2 me-auto">
            <div class="fw-bold"><h5>${request.tx_request_code} - ${request.tx_client_name} - Pago: <strong>${payment}</strong></h5> </div>
            <small>${table} Consumo: ${request.tx_request_consumption}</small>
          </div>
          &nbsp;&nbsp;&nbsp;
          <span>${cls_general.datetime_converter(request.created_at)} ${cls_general.time_converter(request.created_at, 1)}</span>
      </li>`;
    })
    content += '</ul>';
    return { content: content, counter: counter };
  }

}
class class_article {
  constructor(article_list){
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
class class_command{
  constructor(){
    this.command_list = [];
    this.command_procesed = [];
  }
  index(request_info, table_slug){
    var request_slug = '';
    if (request_info != null) {
      var key = Object.keys(request_info);
      request_slug = (key.length > 0) ? request_info['tx_request_slug'] : '';
    }

    var opt_tablelist = '';
    cls_table.table_list.map((table) => {
      opt_tablelist += (table.tx_table_slug === table_slug) ? `<option value="${table.ai_table_id}" selected>${table.tx_table_code} - ${table.tx_table_value}</option>` : `<option value="${table.ai_table_id}">${table.tx_table_code} - ${table.tx_table_value}</option>`;
    })
    if (request_slug.length > 0) {
      var btn_update = `<button class="btn btn-lg btn-info" type="button" onclick="cls_general.disable_submit(this); cls_request.update_info('${request_slug}')">Actualizar</button>`;
      var request_code  = request_info['tx_request_code'];
      var client_name   = request_info['tx_client_name'];
      var client_slug   = request_info['tx_client_slug'];
      var exempt        = request_info['tx_client_exempt'];
    }else{
      var btn_update = '';
      var request_code = 'Sin c&oacute;digo';
      var client_name = 'Contado';
      var client_slug = '001';
      var exempt = 0;
    }

    var content_command_procesed = cls_command.generate_articleprocesed(cls_command.command_procesed);
    var total_sale = cls_general.calculate_sale(content_command_procesed.price);
    var raw_category = [];
    cls_article.article_list.map((article) => {
      var cat = raw_category.find((category)=> { return category === article.tx_category_value})
      if (cls_general.is_empty_var(cat) === 0) {
        raw_category.push(article.tx_category_value);
      }
    })
    var content_category = '';
    var content_categorythumbnail = '';
    raw_category.map((category)=>{
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
              <button class="btn btn-warning btn-lg h_50" data-bs-toggle="tooltip" data-bs-title="Cerrar Pedido" onclick="cls_request.close(this)">
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
              <button class="btn btn-secondary btn-lg h_50" onclick="window.location.href = '/request';" data-bs-toggle="tooltip" data-bs-title="Salir">
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
              <button class="btn btn-warning btn-lg h_50" onclick="cls_request.close(this)">
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
              <button class="btn btn-secondary btn-lg h_50" onclick="window.location.href = '/request';">
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
            <div class="col-12 col-lg-8">
              <span>Listado de Comandas</span>
            </div>
            <div class="col-12 col-lg-4">
              <button class="badge btn btn-info" onclick="cls_request.print('${request_slug}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-printer-fill" viewBox="0 0 16 16">
                  <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"></path>
                  <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"></path>
                </svg>
              </button>
            </div>
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
            var content_command_procesed = cls_command.generate_articleprocesed(cls_command.command_procesed);
            var total_sale = cls_general.calculate_sale(content_command_procesed.price);
            document.getElementById('commandList').innerHTML = content_command_procesed.content;
            document.getElementById('requestTotal').innerHTML = `B/ ${cls_general.val_price(total_sale.total, 2, 1, 1) }`
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
  filter_article(str){
    var filtered = cls_article.look_for(str,100);
    var content = cls_command.generate_article_list(filtered)
    document.getElementById('article_list').innerHTML = content;
  }
  filter_article_category(category){
    var filtered = cls_article.look_for_category(category);
    var content = cls_command.generate_article_list(filtered)
    document.getElementById('article_list').innerHTML = content;
  }
  generate_article_list(filtered){
    var content = '<ul class="list-group">';
    filtered.map((article) => {
      var bg = '';
      var promo_str = '';
      if(article.tx_article_promotion == 1){
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
  generate_recipe_option(article_product){
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
      }else{
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
  show_article(article_slug, description){
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
      content_option = (content_option.length > 0) ? '<h5>Opciones</h5>' + content_option : '';
      var option_presentation = ``; //OPTION PARA LAS PRESENTACIONES DEL ARTICULO, AL CAMBIAR CAMBIAR LOS PRECIOS
      obj.data.price.map((price) => {
        option_presentation += `<option alt="${price.tx_price_three},${price.tx_price_two},${price.tx_price_one}" value="${price.ai_presentation_id}">${price.tx_presentation_value}</option>`;
      })

      var tax_rate = (document.getElementById('requestClient').getAttribute('alt') == 1) ? 0 : obj.data.article.tx_article_taxrate;
      
      var content_recipe = cls_command.generate_recipe_option(obj.data.articleproduct);
      
      var content = `
        <div class="row">
          <div class="col-md-12 col-lg-3">
            <label for="articleQuantity">Cantidad</label>
            <input type="number" class="form-control" id="articleQuantity" value="1" onfocus="cls_general.validFranz(this.id, ['number'])" >
          </div>
          <div class="col-md-12 col-lg-3">
            <label for="articlePresentation">Presentation</label>
            <select class="form-select" id="articlePresentation" onchange="cls_command.modal_set_price(this.options[this.selectedIndex].getAttribute('alt'), this.value, '${article_slug}')">
              ${option_presentation}
            </select>
          </div>
          <div id="container_price" class="col-md-12 col-lg-3">
          </div>
          <div class="col-md-12 col-lg-3">
            <label for="articleClientdiscount">Descuento</label>
            <select class="form-select" id="articleClientdiscount" onchange="document.getElementById('articleDiscountrate').value = this.value">
              <option value="0">0%</option>
              <option value="15">15%</option>
              <option value="25">25%</option>
            </select>
          </div>
          <hr/>
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
          <div id="articleOption" class="row">
            ${content_option}
          </div>
        </div>
      `;
      var footer = `
        <div class="row">
          <div class="col-sm-12">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-primary" onclick="cls_general.disable_submit(this); cls_command.add_article('${article_slug}','${description}','${obj.data.article.ai_article_id}');">Guardar</button>
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
  modal_set_price(str,presentation_id,article_slug){
    var url = '/recipe/'+presentation_id+'/'+article_slug;
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
  add_article(article_slug,description,article_id){
    var quantity = document.getElementById('articleQuantity').value;
    if (isNaN(quantity) || quantity < 1) {
      cls_general.shot_toast_bs('Corrija la cantidad.',{bg: 'text-bg-warning'});
      return false;
    }
    var option = '';
    $('#articleOption').find('select').each(function () {
      option += `${$(this).attr('id')}: ${$(this).val()},`;
    });
    var raw_recipe = [];
    $('#container_recipe').find('select').each(function () {
      var index = $(this.selectedOptions).text();
      let show = this.getAttribute("name");
      let togo = (this.getAttribute("alt") === "1") ? 'togo' : '';
      raw_recipe.push({ [index]: $(this).val() + ',' + show + ',' + togo })
    });
    var select_presentation = document.getElementById('articlePresentation');
    var price = parseFloat(document.getElementById('articlePrice').value);
    cls_command.command_list.push({
      'article_slug': article_slug,
      'article_id': article_id,
      'article_description': description,
      'quantity' : quantity,
      'option' : option.slice(0,-1),
      'presentation_id' : select_presentation.value,
      'presentation_value': select_presentation.options[select_presentation.selectedIndex].text,
      'price' : price.toFixed(2),
      'tax_rate': document.getElementById('articleTaxrate').value,
      'discount_rate' : document.getElementById('articleDiscountrate').value,
      'recipe': raw_recipe
    });
    const Modal = bootstrap.Modal.getInstance('#commandModal');
    Modal.hide();
    cls_command.render_articleselected();
  }
  render_articleselected(){
    var content = cls_command.generate_articleselected(cls_command.command_list);
    document.getElementById('article_selected').innerHTML = content.content;
    document.getElementById('span_commandTotal').innerHTML = '<h5>Total: B/ ' + content.price_sale.total +'</h5>';
  }
  generate_articleselected(command_list){
    var content = '<ul class="list-group">';
    var raw_price = [];
    command_list.map((article,index) => {
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
        for (const index in ingredient) {
          content_recipe += `<li><small>${index}</small></li>`;
        }
      })
      content_recipe += '</ul>';
      content += `
      <li class="list-group-item cursor_pointer text-truncate">
        ${article.quantity} - ${article.article_description} ${article.presentation_value}<br/> ${option} <span style="float: right; width: 30%" class="text-truncate">B/ ${cls_general.val_price(article.price,2,1,1)}</span>
        <br/>
        <p class="d-inline-flex gap-1">
          <button type="button" class="btn btn-sm btn-outline-dark" data-bs-toggle="collapse" href="#collapseRecipe${index}">Receta</button>
        </p>
        <div class="collapse" id="collapseRecipe${index}">
          <div class="card card-body text-truncate">
            ${content_recipe}
          </div>
        </div>
        <div class="text-center">
          <button class="btn btn-warning" type="button" onclick="cls_command.delete_articleselected(${index})">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
            </svg>
          </button>
        </div>
      </li>
      `;
      //[{PRICE,discount,tax, quantity}]
      raw_price.push({price: article.price, discount: article.discount_rate, tax: article.tax_rate, quantity: article.quantity})
      
    })
    console.log(raw_price);
    var price_sale = cls_general.calculate_sale(raw_price);
    console.log(price_sale);
    content += '</ul>';
    return { 'content': content, 'price_sale': price_sale };
  }
  generate_articleprocesed(command_procesed){
    var raw_price = [];
    var content_command_procesed = `<div class="list-group">`;
    command_procesed.map((command,index) => {
      var raw_command = command.tx_commanddata_option.split(',');
      if (raw_command.length > 1) {
        var option = '<ul>';
        raw_command.map((opt) => { option += `<li>${opt}</li>` });
        option += '</ul>';
      } else {
        var option = '';
      }
      var observation = (cls_general.is_empty_var(command.tx_command_observation) === 1) ? ', <strong>Obs.</strong> '+command.tx_command_observation : '';
      if (command.tx_commanddata_status === 0) {
        var bg_status = 'text-bg-warning text-body-tertiary';
        var btn = ``;
      }else{
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

      if (recipe.length > 0) {
        content_recipe = `
          <span class="d-inline-flex gap-1">
            <button class="btn btn-link text-decoration-none btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#collapseRecipe${index}" aria-expanded="false" aria-controls="collapseExample">
              Ver Receta
            </button>
          </span>
          <div class="collapse" id="collapseRecipe${index}">
            <div class="card card-body text-truncate">
              ${content_recipe}
            </div>
          </div>
        `;
      }else{
        content_recipe = '';
      }



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
  delete_articleselected(index){
    var command_list = cls_command.command_list;
    command_list.splice(index,1);
    cls_command.command_list = command_list;
    cls_command.render_articleselected();
  }
  save(request_slug, table_slug){ //ESTA FUNCION SOLO ABRE EL MODAL
    var command_list = cls_command.command_list;
    if (command_list < 1) {
      cls_general.shot_toast_bs('Seleccione los art&iacute;culos.',{bg: 'text-bg-warning'});
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
  process(request_slug, table_slug){
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
  store(table_slug,title){
    var command_list = cls_command.command_list;
    var client = document.getElementById('requestClient');
    var consumption = document.getElementById('commandConsumption').value;
    var observation = document.getElementById('commandObservation').value;

    var url = '/command/'; var method = 'POST';
    var body = JSON.stringify({a: command_list, b: table_slug, c: client.name, d: 'Ped.'+title, e: consumption, f: observation });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('btn_commandprocess').name = obj.data.request.tx_request_slug;
        document.getElementById('container_buttonUpdateInfo').innerHTML = `<button class="btn btn-lg btn-info" type="button" onclick="cls_general.disable_submit(this); cls_request.update_info('${obj.data.request.tx_request_slug}')">Actualizar</button>`;
        cls_command.command_procesed = obj.data.command_procesed;
        cls_command.command_list = [];
        var content_command_procesed = cls_command.generate_articleprocesed(cls_command.command_procesed);
        cls_command.render_articleselected();
        var total_sale = cls_general.calculate_sale(content_command_procesed.price);

        document.getElementById('commandList').innerHTML = content_command_procesed.content;
        document.getElementById('requestTotal').innerHTML = 'B/ '+cls_general.val_price(total_sale.total,2,1,1);

        // const Modal = bootstrap.Modal.getInstance('#commandModal');
        // Modal.hide();

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
                // console.log(request_slug);
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
  update(request_slug){
    var command_list = cls_command.command_list;
    var consumption = document.getElementById('commandConsumption').value;
    var observation = document.getElementById('commandObservation').value;

    var url = '/command/'+request_slug; var method = 'PUT';
    var body = JSON.stringify({ a: command_list, e: consumption, f: observation });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_command.command_procesed = obj.data.command_procesed;
        cls_command.command_list = [];
        var content_command_procesed = cls_command.generate_articleprocesed(cls_command.command_procesed);
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
  set_client(slug,name,exent,birthday = ''){
    document.getElementById('requestClient').setAttribute('alt', exent);
    document.getElementById('requestClient').setAttribute('name', slug);
    document.getElementById('requestClient').value = name;
    var today = cls_general.getDate();
    var raw_birthday = birthday.split("-");
    var split_birthday = raw_birthday[2] +'/'+ raw_birthday[1];
    var raw_today = today[0].split("-");
    var split_today = raw_today[2] + '/' + raw_today[1]
    if (birthday != '1970-01-01' && split_birthday === split_today) {
      swal("El cliente seleccionado cumpleaños hoy.");
    }
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
  cancel(commanddata_id){
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
          var content_commandList = document.getElementById('commandList').innerHTML;
          var content_requestTotal = document.getElementById('requestTotal').innerHTML;

          document.getElementById('commandList').innerHTML = '<img src="attached/image/loading.gif" width="30px"></img>';
          document.getElementById('requestTotal').innerHTML = '<img src="attached/image/loading.gif" width="10px"></img>';

          var url = '/command/' + commanddata_id + '/cancel';
          var method = 'PUT';
          var body = JSON.stringify({a: 1});;
          var funcion = function (obj) {
            if (obj.status === 'success') {

              cls_command.command_procesed = obj.data.command_procesed;
              var command_procesed = cls_command.generate_articleprocesed(cls_command.command_procesed);
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
        case 'solo':
          var content_commandList = document.getElementById('commandList').innerHTML;
          var content_requestTotal = document.getElementById('requestTotal').innerHTML;

          document.getElementById('commandList').innerHTML = '<img src="attached/image/loading.gif" width="30px"></img>';
          document.getElementById('requestTotal').innerHTML = '<img src="attached/image/loading.gif" width="10px"></img>';

          var url = '/command/' + commanddata_id + '/cancel';
          var method = 'PUT';
          var body = JSON.stringify({ a: 0 });;
          var funcion = function (obj) {
            if (obj.status === 'success') {

              cls_command.command_procesed = obj.data.command_procesed;
              var command_procesed = cls_command.generate_articleprocesed(cls_command.command_procesed);
              var total_sale = cls_general.calculate_sale(command_procesed.price);

              document.getElementById('commandList').innerHTML = command_procesed.content;
              document.getElementById('requestTotal').innerHTML = 'B/ ' + cls_general.val_price(total_sale.total,2,1,1);
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
  async create_request(request_slug) {
    var url = cls_request.api_url + 'APIrequest/show/' + request_slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var raw_data = obj.data;
        var onlinerequest_info = raw_data.request_api;
        var onlinerequest_slug = onlinerequest_info.tx_request_slug

        var table_slug = '';
        var opt_tablelist = '';
        cls_table.table_list.map((table) => {
          if (table.tx_table_active === 1) {
            if (table.tx_table_value === onlinerequest_info.tx_table_value) {
              opt_tablelist += `<option value="${table.ai_table_id}" selected>${table.tx_table_code} - ${table.tx_table_value}</option>`;
              table_slug = table.tx_table_slug;
            } else {
              opt_tablelist += `<option value="${table.ai_table_id}">${table.tx_table_code} - ${table.tx_table_value}</option>`;
            }
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
                  <button class="btn btn-warning btn-lg h_50" data-bs-toggle="tooltip" data-bs-title="Cerrar Pedido" onclick="cls_request.close(document.getElementById('btn_commandprocess'))">
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
                <div class="col-md-4 text-center pb-1">
                  <button class="btn btn-warning btn-lg h_50" onclick="cls_request.close(document.getElementById('btn_commandprocess'))">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="30" fill="currentColor" class="bi bi-door-closed-fill" viewBox="0 0 16 16">
                      <path d="M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1h8zm-2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                    </svg>
                    Cerrar Pedido
                  </button>
                </div>

                <div class="col-md-4 text-center pb-1">
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
      } else {
        cls_general.shot_toast_bs('Hubieron problemas para conectarse al servidor, reintentando en 10 seg.',{bg: 'text-bg-secondary'})
        cls_request.api_login();
        setTimeout(() => {
          cls_request.create_request(request_slug);
        }, 5000);
      }
    }
    var api_token = cls_request.api_token;
    await cls_general.async_api_request(url, method, funcion, body, api_token);
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
    cls_general.disable_submit(document.getElementById('btn_commandprocess'), 0);
    var command_list = cls_command.command_list;
    var client = document.getElementById('requestClient');
    var consumption = document.getElementById('commandConsumption').value;
    var observation = document.getElementById('commandObservation').value;

    var url = '/command/'; var method = 'POST';
    var body = JSON.stringify({ a: command_list, b: table_slug, c: client.name, d: 'Ped.' + title, e: consumption, f: observation, g: onlinerequest_slug, h: cls_request.api_token });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('btn_commandprocess').name = obj.data.request.tx_request_slug;
        document.getElementById('container_buttonUpdateInfo').innerHTML = `<button class="btn btn-lg btn-info" type="button" onclick="cls_general.disable_submit(this); cls_request.update_info('${obj.data.request.tx_request_slug}')">Actualizar</button>`;
        cls_command.command_procesed = obj.data.command_procesed;
        cls_command.command_list = [];
        var content_command_procesed = cls_command.generate_articleprocesed(cls_command.command_procesed);
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
        } else {
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
    var body = JSON.stringify({ a: command_list, e: consumption, f: observation, g: onlinerequest_slug, h: cls_request.api_token });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_command.command_procesed = obj.data.command_procesed;
        cls_command.command_list = [];
        var content_command_procesed = cls_command.generate_articleprocesed(cls_command.command_procesed);
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
  close_online(btn, onlinerequest_slug){
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
          var url = cls_request.api_url + 'APIrequest/' + onlinerequest_slug + '/closeit'; var method = 'PUT';
          var body = '';
          var funcion = function (obj) {
            if (obj.status === 'success') {
              window.location.href = '/request'
            } else {
              cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
            }
          }
          var api_token = cls_request.api_token;
          cls_general.async_api_request(url, method, funcion, body, api_token);
          // cls_general.async_laravel_request(url, method, funcion, body);
          break;
        case 'no':

          break;
      }
    });
  }

}
class class_client{
  constructor(client_list){
    this.client_list = client_list;
  }
  look_for(str, limit=50) {
    var haystack = cls_client.client_list;
    var needles = str.split(' ');
    var raw_filtered = [];
    var counter = 0;
    for (var i in haystack) {
      if (counter >= limit) { break; }
      var ocurrencys = 0;
      for (const a in needles) {
        if (haystack[i]['tx_client_cif'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_client_name'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
      }
      if (ocurrencys === needles.length) {
        raw_filtered.push(haystack[i]);
        counter++;
      }
    }
    return raw_filtered;
  }
  generate_modal_clientlist(filtered){
    var content = '<ul class="list-group">';
    filtered.map((client) => {
      content += `<li class="list-group-item cursor_pointer" onclick="cls_command.set_client('${client.tx_client_slug}','${client.tx_client_name}',${client.tx_client_exempt}, '${client.tx_client_birthday}')">${client.tx_client_name} - ${client.tx_client_cif}</li>`;
    })
    content += '</ul>';
    return content;
  }
  filter_modal(str){
    var filtered = cls_client.look_for(str);
    var content = cls_client.generate_modal_clientlist(filtered);
    document.getElementById('container_clientfiltered').innerHTML = content;
  }
  render_modal(){
    var btn_update_client = (cls_general.is_empty_var(document.getElementById('requestClient').name) === 0 || document.getElementById('requestClient').name === "1") ? '' : '<button type="button" class="btn btn-warning" onclick="cls_client.render_modal_edit()">Modificar Cliente</button>';

    var content = `
      <div class="row">
        <div class="col-md-12 text-center">
          <button type="button" class="btn btn-primary" onclick="cls_client.render_modal_create('','','','','','','',0,102,1,'')">Crear Cliente</button>&nbsp;
          ${btn_update_client}
        </div>
        <div class="col-md-12 col-lg-6 pb-1">
          <label for="clientFilter" class="form-label">Buscar Cliente</label>
          <input type="text" id="clientFilter" class="form-control" onfocus="cls_general.validFranz(this.id, ['number','word'])" onkeyup="cls_client.filter_modal(this.value)">
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
  render_modal_create(slug,name,cif,dv,telephone,email,direction,exempt,taxpayer,status,birthday) {
    var exempt_checked = (exempt === 1) ? 'checked' : '';
    var status_checked = (status === 1) ? 'checked' : '';
    birthday = (cls_general.is_empty_var(birthday) === 0) ? '' : cls_general.datetime_converter(birthday);
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
        <div class="col-md-12 col-lg-6">
          <label for="clientBirthday" class="form-label">F. Nacimiento</label>
          <input type="email" id="clientBirthday" class="form-control" value="${birthday}" readonly>
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

    $(function () {
      $("#clientBirthday").datepicker({
        defaultDate: '-20y',
        changeYear: true,
        changeMonth: true
      });
    });

  }
  render_modal_edit(){
    var client_slug = document.getElementById('requestClient').name;
    var url = '/client/'+client_slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      var client = obj.data.client;
      if (obj.status === 'success') {
        cls_client.render_modal_create(client.tx_client_slug, client.tx_client_name, client.tx_client_cif, client.tx_client_dv, client.tx_client_telephone, client.tx_client_email, client.tx_client_direction, client.tx_client_exempt, client.tx_client_taxpayer + client.tx_client_type, client.tx_client_status, client.tx_client_birthday);
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
  save(){
    var name = cls_general.set_name(document.getElementById('clientName').value);
    var cif = document.getElementById('clientCIF').value;
    var dv = document.getElementById('clientDV').value;
    var telephone = document.getElementById('clientTelephone').value;
    var email = document.getElementById('clientEmail').value;
    var birthday = document.getElementById('clientBirthday').value;
    var direction = document.getElementById('clientDirection').value;
    var exempt = (document.getElementById('clientExempt').checked) ? 1 : 0;
    var taxpayer = document.getElementById('clientTaxpayer').value;
    var status = (document.getElementById('clientStatus').checked) ? 1 : 0;

    if (cls_general.is_empty_var(name) === 0 || cls_general.is_empty_var(cif) === 0) {
      cls_general.shot_toast_bs('El campo nombre y C&eacute;dula no pueden estar vac&iacute;os',{bg: 'text-bg-warning'});
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
      var pattern  = /\d/
      if (cls_general.is_empty_var(dv) === 0) {
        cls_general.shot_toast_bs('Falta ingresar el DV.', { bg: 'text-bg-warning' });
        return false;
      }
      if (cls_general.is_empty_var(email) === 0) {
        cls_general.shot_toast_bs('Debe ingresar el Email', { bg: 'text-bg-warning' });
        return false;
      }
    }else{
      var pattern = /\d+/ //NATURAL NO CONTRIBUYENTE 102
    }
    switch (taxpayer) {
      case "101": //NATURAL CONTRIBUYENTE
        var pattern = /^[0-9]{0,2}-?\d{2,}-?\d{2,}$/
      break;
      case "201": //EMPRESA
        var pattern = /^[0-9]{0,2}-?\d{1,}-?\d{1,}-?\d{1,}-?\d{1,}-?\d{1,}$/
        break;
      case "203": //GOBIERNO
        var pattern = /^[0-9]{1,}-?[a-zA-Z]+-?\d{2,}-?\d{2,}-?\d{2,}$|^[1-9]{0,2}-?\d{1,}-?\d{1,}-?\d{1,}-?\d{1,}-?\d{1,}$/
        break;
      case "204": //PASAPORTE
        var pattern = /\d+/
        break;
    }
    if (pattern.test(cif) != true) {
      cls_general.shot_toast_bs('Verifique la C&eacute;dula/RUC', { bg: 'text-bg-warning' });
      return false;
    }
    var request_client = document.getElementById('requestClient').name;
    if (cls_general.is_empty_var(request_client) === 0 || request_client == "001") {
      var method = 'POST';
      var url = '/client/'; 
    }else{
      var method = 'PUT';
      var url = '/client/' + request_client; 
    }
    var body = JSON.stringify({ a: name, b: cif, c: dv, d: telephone, e: email, f: direction, g: exempt, h: taxpayer, i: status, j: birthday });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_client.client_list = obj.data.client_list;
        cls_command.set_client(obj.data.client.tx_client_slug, obj.data.client.tx_client_name, obj.data.client.tx_client_exempt, `'${obj.data.client.tx_client_birthday}'`).
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      }else{
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
}