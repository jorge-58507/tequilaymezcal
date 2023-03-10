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
    var content_tab = ''; var ubication_str = '';
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
        content_tab_container += `
          <div class="col-sm-6 col-lg-3 text-center">
            <button class="btn btn-success btn-lg my_20" onclick="cls_request.showByTable('${table.tx_table_slug}','${table.tx_table_type}');" style="width: 120px">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-cup-hot-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M.5 6a.5.5 0 0 0-.488.608l1.652 7.434A2.5 2.5 0 0 0 4.104 16h5.792a2.5 2.5 0 0 0 2.44-1.958l.131-.59a3 3 0 0 0 1.3-5.854l.221-.99A.5.5 0 0 0 13.5 6H.5ZM13 12.5a2.01 2.01 0 0 1-.316-.025l.867-3.898A2.001 2.001 0 0 1 13 12.5Z"/>
                <path d="m4.4.8-.003.004-.014.019a4.167 4.167 0 0 0-.204.31 2.327 2.327 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.593.593 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3.31 3.31 0 0 1-.202.388 5.444 5.444 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 3.6 4.2l.003-.004.014-.019a4.149 4.149 0 0 0 .204-.31 2.06 2.06 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.593.593 0 0 0-.09-.252A4.334 4.334 0 0 0 3.6 2.8l-.01-.012a5.099 5.099 0 0 1-.37-.543A1.53 1.53 0 0 1 3 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a5.446 5.446 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 4.4.8Zm3 0-.003.004-.014.019a4.167 4.167 0 0 0-.204.31 2.327 2.327 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.593.593 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3.31 3.31 0 0 1-.202.388 5.444 5.444 0 0 1-.253.382l-.018.025-.005.008-.002.002A.5.5 0 0 1 6.6 4.2l.003-.004.014-.019a4.149 4.149 0 0 0 .204-.31 2.06 2.06 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.593.593 0 0 0-.09-.252A4.334 4.334 0 0 0 6.6 2.8l-.01-.012a5.099 5.099 0 0 1-.37-.543A1.53 1.53 0 0 1 6 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a5.446 5.446 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 7.4.8Zm3 0-.003.004-.014.019a4.077 4.077 0 0 0-.204.31 2.337 2.337 0 0 0-.141.267c-.026.06-.034.092-.037.103v.004a.593.593 0 0 0 .091.248c.075.133.178.272.308.445l.01.012c.118.158.26.347.37.543.112.2.22.455.22.745 0 .188-.065.368-.119.494a3.198 3.198 0 0 1-.202.388 5.385 5.385 0 0 1-.252.382l-.019.025-.005.008-.002.002A.5.5 0 0 1 9.6 4.2l.003-.004.014-.019a4.149 4.149 0 0 0 .204-.31 2.06 2.06 0 0 0 .141-.267c.026-.06.034-.092.037-.103a.593.593 0 0 0-.09-.252A4.334 4.334 0 0 0 9.6 2.8l-.01-.012a5.099 5.099 0 0 1-.37-.543A1.53 1.53 0 0 1 9 1.5c0-.188.065-.368.119-.494.059-.138.134-.274.202-.388a5.446 5.446 0 0 1 .253-.382l.025-.035A.5.5 0 0 1 10.4.8Z"/>
              </svg>
              <br/>
              <p class="fs-6 mb_0 text-truncate">${table.tx_table_value}</p>
            </button>
          </div>
        `;
      
    });
    content_tab_container += `</div>`;
    document.getElementById('nav-tab').innerHTML = content_tab;
    document.getElementById('nav-tabContent').innerHTML = content_tab_container;
  }
}
class class_request {
  constructor(open_request, closed_request, canceled_request){
    this.open_request = open_request;
    this.closed_request = closed_request;
    this.canceled_request = canceled_request;
  }
  index(){
    var content = `
      <div class="col-lg-7">
        <div class="row">
          <div class="col-xs-12 v_scrollable bb_1 border_gray" style="height: 80vh;">
            <nav>
              <div class="nav nav-tabs" id="nav-tab" role="tablist">
              </div>
            </nav>
            <div class="tab-content" id="nav-tabContent">
            </div>
          </div>
          <div class="col-xs-12 pt-1">
            <div class="row">
              <div class="col d-grid gap-2">
                <button class="btn btn-lg btn-primary">BARRA</button>
              </div>
              <div class="col d-grid gap-2">
                <button class="btn btn-lg btn-primary">SALA</button>
              </div>
              <div class="col d-grid gap-2">
                <button class="btn btn-lg btn-primary">PLATO DEL DIA</button>
              </div>
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
              <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_request.filter()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="col-xs-12 col-md-5 pt-2">
            <select class="form-select" id="requestStatus">
              <option value="0" selected>Abierto</option>
              <option value="1">Cerrado</option>
              <option value="2">Anulada</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div id="container_requestlist" class="col-xs-12 bx_1 by_1 border_gray radius_5 v_scrollable" style="height: 80vh">

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
      content += `<li class="list-group-item cursor_pointer" onclick="cls_request.showByRequest('${request.tx_request_slug}')"><h5>${request.tx_request_code} - ${request.tx_client_name}</h5><small>${request.tx_request_title} - ${request.tx_table_value}</small></li>`;
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
      var table_slug = obj.data.table.tx_table_slug;
      console.log(table_slug);
      cls_command.command_procesed = obj.data.command_procesed;
      cls_request.render_request(obj.data.request, table_slug);
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
            if (haystack[i]['tx_request_code'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_request_title'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_table_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
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
    console.log(filtered);
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
      var btn_update = `<button class="btn btn-lg btn-info" type="button" onclick="cls_request.update_info('${request_slug}')">Actualizar</button>`;
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
    var content_category = ''; var art = '';
    cls_article.article_list.map((article) => {
      if (article.tx_category_value != art) {
        content_category += `<button class="btn btn-primary" style="height: 8vh;" onclick="cls_command.filter_article_category('${article.tx_category_value}');">${article.tx_category_value}</button>&nbsp;`;
        art = article.tx_category_value;
      }
    })

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
            <div id="article_selected" class="col-xs-12 v_scrollable" style="height: 40vh">
            </div>
            <div class="col-xs-12 input-group mb-3" style="height: 10vh">
              <input type="text" id="articleFilter" class="form-control" placeholder="Buscar por C&oacute;digo o Cliente" onkeyup="cls_command.filter_article(this.value)">
              <button class="btn btn-outline-secondary" type="button" onkeyup="cls_command.filter_article(document.getElementById('articleFilter').value)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </button>
            </div>
            <span>Listado de Art&iacute;culos</span>
            <div id="article_list" class="col-xs-12" style="height: 25vh">

            </div>
            <div class="col-xs-12 h_scrollable" style="height: 10vh">
              ${content_category}
            </div>
          </div>
        </div>
        <div class="col-md-12 col-lg-1 text-center">
          <div class="row">
            <div class="col-md-12 text-center" style="height:80vh;display: flex;align-items: center;">
              <button id="btn_commandprocess" class="btn tmgreen_bg btn-lg h_150" name="${request_slug}" onclick="cls_command.save(this.name,'${table_slug}');">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                </svg>
              </button>
            </div>
            <div class="col-md-12 text-center" style="height:20vh;display: flex;align-items: bottom;">
              <button class="btn btn-secondary btn-lg h_50" onclick="window.location.href = '/request';">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                </svg>
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
                <div class="col-md-12 col-lg-4 pt-2 text-center">
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
  }
  filter_article(str){
    var filtered = cls_article.look_for(str,40);
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
      content += `<li class="list-group-item cursor_pointer fs_20 text-truncate" onclick="cls_command.show_article('${article.tx_article_slug}','${article.tx_article_value}')">${article.tx_article_code} - ${article.tx_article_value}</li>`;
    })
    content += '</ul>';
    return content;
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
      var option_presentation = ``; //OPTION PARA LAS PRESENTACIONES DEL ARTICULO, AL CAMBIAR CAMBIAR LOS PRECIOS
      obj.data.price.map((price) => {
        option_presentation += `<option alt="${price.tx_price_three},${price.tx_price_two},${price.tx_price_one}" value="${price.ai_presentation_id}">${price.tx_presentation_value}</option>`;
      })

      var tax_rate = (document.getElementById('requestClient').getAttribute('alt') == 1) ? 0 : obj.data.article.tx_article_taxrate;

      var content = `
        <div class="row">
          <div class="col-md-12">
            <label for="articleQuantity">Cantidad</label>
            <input type="number" class="form-control" id="articleQuantity" value="1" onfocus="cls_general.validFranz(this.id, ['number'])" >
          </div>
          <div class="col-md-12 col-lg-4">
            <label for="articlePresentation">Presentation</label>
            <select class="form-select" id="articlePresentation" onchange="cls_command.modal_set_price(this.options[this.selectedIndex].getAttribute('alt'))">
              ${option_presentation}
            </select>
          </div>
          <div id="container_price" class="col-md-12 col-lg-4"></div>
          <div class="col-md-12 col-lg-4">
            <input type="hidden" class="form-control" id="articleDiscountrate" value="${obj.data.article.tx_article_discountrate}" onfocus="cls_general.validFranz(this.id, ['number'])" required>
            <input type="hidden" class="form-control" id="articleTaxrate" value="${tax_rate}" onfocus="cls_general.validFranz(this.id, ['number'])" required>
          </div>
          <div id="articleOption" class="row">
            ${content_option}
          </div>
        </div>
      `;
      var footer = `
        <div class="row">
          <div class="col-sm-12">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-primary" onclick="cls_command.add_article('${article_slug}','${description}','${obj.data.article.ai_article_id}');">Guardar</button>
          </div>
        </div>
      `;
      
      
      document.getElementById('commandModal_title').innerHTML = 'Agregar Art&iacute;culo';
      document.getElementById('commandModal_content').innerHTML = content;
      document.getElementById('commandModal_footer').innerHTML = footer;

      cls_command.modal_set_price(obj.data.price[0].tx_price_three+','+obj.data.price[0].tx_price_two+','+obj.data.price[0].tx_price_one); //OPTION PARA Los PRECIOS DEL ARTICULO
      
      const modal = new bootstrap.Modal('#commandModal', {})
      modal.show();
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  modal_set_price(str){
    var raw = str.split(',');
    var content = `<label for="articlePrice">Precio</label>
    <select class="form-select" id="articlePrice">`;
    raw.map((price) => {
      var p = parseFloat(price);
      if (price > 0.1) {
        content += `<option value="${p}">${p.toFixed(2)}</option>`;
      }
    })
    document.getElementById('container_price').innerHTML = content+'</select>';
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
    cls_command.command_list.push({
      'article_slug': article_slug,
      'article_id': article_id,
      'article_description': description,
      'quantity' : quantity,
      'option' : option.slice(0,-1),
      'presentation_id' : document.getElementById('articlePresentation').value,
      'price' : document.getElementById('articlePrice').value,
      'tax_rate': document.getElementById('articleTaxrate').value,
      'discount_rate' : document.getElementById('articleDiscountrate').value
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
      content += `
      <li class="list-group-item cursor_pointer text-truncate">
        ${article.quantity} - ${article.article_description}<br/> ${option} <span style="float: right; width: 30%" class="text-truncate">B/ ${cls_general.val_price(article.price,2,1,1)}</span>
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
    var price_sale = cls_general.calculate_sale(raw_price);
    content += '</ul>';
    return { 'content': content, 'price_sale': price_sale };
  }
  generate_articleprocesed(command_procesed){
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
      var observation = (cls_general.is_empty_var(command.tx_command_observation) === 1) ? ', <strong>Obs.</strong> '+command.tx_command_observation : '';
      if (command.tx_commanddata_status === 0) {
        var bg_status = 'text-bg-warning text-body-tertiary';
        var btn = ``;
      }else{
        // [{ PRICE, discount, tax, quantity }]
        raw_price.push({ price: command.tx_commanddata_price, discount: command.tx_commanddata_discountrate, tax: command.tx_commanddata_taxrate, quantity: command.tx_commanddata_quantity });
        var bg_status = '';
        var btn = `
          <button type="button" class="btn btn-secondary" onclick="event.preventDefault(); cls_command.cancel(${command.ai_commanddata_id})">Anular</button>
          <button type="button" class="btn btn-secondary">Reimprimir</button>
        `;
      }
      
      content_command_procesed += `
        <a href="#" class="list-group-item list-group-item-action ${bg_status}" aria-current="true" onclick="event.preventDefault();">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${command.tx_commanddata_quantity} - ${command.tx_commanddata_description}</h5>
          </div>
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
  save(request_slug, table_slug){
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
          <button type="button" class="btn btn-primary" onclick="cls_command.process('${request_slug}','${table_slug}')">Guardar</button>
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
      cls_command.store(table_slug);
    } else {
      cls_command.update(request_slug, table_slug);
    }
  }
  store(table_slug){
    var command_list = cls_command.command_list;
    var client = document.getElementById('requestClient');
    var consumption = document.getElementById('commandConsumption').value;
    var observation = document.getElementById('commandObservation').value;

    var url = '/command/'; var method = 'POST';
    var body = JSON.stringify({a: command_list, b: table_slug, c: client.name, d: 'Ped.'+client.value.replace(' ',''), e: consumption, f: observation });
    var funcion = function (obj) {
      document.getElementById('btn_commandprocess').name = obj.data.request.tx_request_slug;
      cls_command.command_procesed = obj.data.command_procesed;
      cls_command.command_list = [];
      var content_command_procesed = cls_command.generate_articleprocesed(cls_command.command_procesed);
      cls_command.render_articleselected();
      var total_sale = cls_general.calculate_sale(content_command_procesed.price);

      document.getElementById('commandList').innerHTML = content_command_procesed.content;
      document.getElementById('requestTotal').innerHTML = 'B/ '+cls_general.val_price(total_sale.total,2,1,1);

      const Modal = bootstrap.Modal.getInstance('#commandModal');
      Modal.hide();
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
      cls_command.command_procesed = obj.data.command_procesed;
      cls_command.command_list = [];
      var content_command_procesed = cls_command.generate_articleprocesed(cls_command.command_procesed);
      cls_command.render_articleselected();
      var total_sale = cls_general.calculate_sale(content_command_procesed.price);
      
      document.getElementById('commandList').innerHTML = content_command_procesed.content;
      document.getElementById('requestTotal').innerHTML = 'B/ ' + cls_general.val_price(total_sale.total, 2, 1, 1);

      const Modal = bootstrap.Modal.getInstance('#commandModal');
      Modal.hide();
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  set_client(slug,name,exent){
    document.getElementById('requestClient').setAttribute('alt', exent);
    document.getElementById('requestClient').setAttribute('name', slug);
    document.getElementById('requestClient').value = name;

    const Modal = bootstrap.Modal.getInstance('#clientModal');
    if (Modal != null) {
      Modal.hide();
    }

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
              cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
            }
          }
          cls_general.async_laravel_request(url, method, funcion, body);
        break;
        case 'solo':
          var url = '/command/' + commanddata_id + '/cancel';
          var method = 'PUT';
          var body = JSON.stringify({ a: 0 });;
          var funcion = function (obj) {
            if (obj.status === 'success') {

              cls_command.command_procesed = obj.data.command_procesed;
              var command_procesed = cls_command.generate_articleprocesed(cls_command.command_procesed);
              var total_sale = cls_general.calculate_sale(command_procesed.price);

              document.getElementById('commandList').innerHTML = command_procesed.content;
              document.getElementById('requestTotal').innerHTML = 'B/ ' + cls_general.val_price(total_sale.total);

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
        if (haystack[i]['tx_client_cif'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
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
      content += `<li class="list-group-item cursor_pointer" onclick="cls_command.set_client('${client.tx_client_slug}','${client.tx_client_name}',${client.tx_client_exempt})">${client.tx_client_name} - ${client.tx_client_cif}</li>`;
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
  render_modal_create(slug,name,cif,dv,telephone,email,direction,exempt,taxpayer,status) {
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
            <option value="202">Empresa</option>
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
  render_modal_edit(){
    var client_slug = document.getElementById('requestClient').name;
    var url = '/client/'+client_slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      var client = obj.data.client;
      if (obj.status === 'success') {
        cls_client.render_modal_create(client.tx_client_slug, client.tx_client_name, client.tx_client_cif, client.tx_client_dv, client.tx_client_telephone, client.tx_client_email, client.tx_client_direction, client.tx_client_exempt, client.tx_client_taxpayer+client.tx_client_type, client.tx_client_status);
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
      var pattern = /^[1-9]-?\d{2,}-?\d{2,}$/
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
    var body = JSON.stringify({ a: name, b: cif, c: dv, d: telephone, e: email, f: direction, g: exempt, h: taxpayer, i: status });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_client.client_list = obj.data.client_list;
        cls_command.set_client(obj.data.client.tx_client_slug, obj.data.client.tx_client_name, obj.data.client.tx_client_exempt)
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      }else{
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
}