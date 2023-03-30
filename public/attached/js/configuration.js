// JavaScript Document
class class_option
{
  constructor(raw_option){
    this.option = raw_option
  }
}
class class_ubication {
  render(){
    var url = '/ubication'; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      var ubication_list = obj['data']['all'];

      var list = cls_ubication.generate_list(ubication_list)
      var content = `
        <div class="row">
          <div class="col-xs-12 py-2 text-center">
            <button type="button" class="btn btn-lg btn-primary" onclick="cls_ubication.create()">Crear Sala</button>
            &nbsp;
          </div>
          <div class="col-xs-12">
            <h5>Listado de Salas</h5>
          </div>
          <div id="container_ubicationList" class="col-xs-12 border-top">
            ${list}
          </div>
        </div>
      `;
      document.getElementById('container').innerHTML = content;
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  create(){
    var content = `
        <div class="row">
          <div class="col-xs-12 py-2">
              <label for="newUbicationValue" class="form-label">Descripci&oacute;n</label>
              <input type="text" class="form-control" id="newUbicationValue" value="" onblur="cls_ubication.setPrefix()" onfocus="cls_general.validFranz(this.id, ['word','number'])">
              <label for="newUbicationPrefix" class="form-label">Prefijo</label>
              <input type="text" class="form-control" id="newUbicationPrefix" value="" onfocus="cls_general.validFranz(this.id, ['word','number'])" onkeyup="cls_general.limitText(this,3,1)" onblur="cls_general.limitText(this,4,1)">
          </div>
        </div>
    `;
    var content_footer = `          
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" id="btn_ubicationModal" onclick="cls_ubication.save();">Guardar</button>
    `;
    document.getElementById('ubicationModal_title').innerHTML = '<h4>Crear Sala</h4>';
    document.getElementById('ubicationModal_content').innerHTML = content;
    document.getElementById('ubicationModal_footer').innerHTML = content_footer;

    const modalUbication = new bootstrap.Modal('#ubicationModal', {})
    modalUbication.show();
    setTimeout(() => {
      document.getElementById('newUbicationValue').focus();
    }, 500);

  }
  setPrefix(){
    var ubicationValue = document.getElementById("newUbicationValue").value;
    if (cls_general.is_empty_var(ubicationValue) === 0) {
      return false;
    }
    var prefix = ubicationValue.slice(0, 3);
    var url = '/prefix/' + prefix; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      if (obj.data.count > 0) {
        cls_general.shot_toast_bs(obj['message'], {bg:'text-bg-danger'});
      }else{
        document.getElementById('newUbicationPrefix').value = prefix;
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  save(){
    var description = document.getElementById('newUbicationValue').value;
    var prefix = document.getElementById('newUbicationPrefix').value;
    if (cls_general.is_empty_var(description) === 0 || cls_general.is_empty_var(prefix) === 0) {
      cls_general.shot_toast_bs('Debe lllenar los campos Descripción y Prefijo.', {bg:'text-bg-danger'});
      const ubicationModal = bootstrap.Modal.getInstance('#ubicationModal');
      ubicationModal.hide();
      return false;
    }
    var url = '/ubication/'; var method = 'POST';
    var body = JSON.stringify({a: description, b: prefix});
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        var list = cls_ubication.generate_list(obj.data.all)
        document.getElementById('container_ubicationList').innerHTML = list;
        
        const ubicationModal = bootstrap.Modal.getInstance('#ubicationModal');
        ubicationModal.hide();
      }
      cls_general.shot_toast_bs(obj['message']);
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  render_modal(ubication, table_list){
    var list = cls_table.generate_list(table_list);
    var checked = (ubication['tx_ubication_status'] === 1) ? 'checked' : '';
    var content = `
        <div class="row">
          <div class="col-xs-12 py-2">
            <label for="ubicationValue" class="form-label">Descripci&oacute;n</label>
            <input type="text" class="form-control" id="ubicationValue" value="${ubication['tx_ubication_value']}">
            <label for="ubicationPrefix" class="form-label">Prefijo</label>
            <input type="text" class="form-control" id="ubicationPrefix" value="${ubication['tx_ubication_prefix']}">
            <div class="form-check form-switch py-3">
              <input class="form-check-input" type="checkbox" role="switch" id="ubicationStatus" ${checked}>
              <label class="form-check-label" for="ubicationStatus">Activo</label>
            </div>
          </div>
          <div class="col-xs-12 py-2 text-center">
            <button type="button" class="btn btn-primary" onclick="cls_table.create(${ubication['ai_ubication_id']})">Crear Mesa</button>
          </div>
          <div id="container_tableList" class="col-xs-12 border-top">
            ${list}
          </div>
        </div>
      `;
    var content_bottom = `          
        <button type="button" class="btn btn-warning" data-bs-dismiss="modal" onclick="cls_ubication.delete();">Eliminar Sala</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-success" id="btn_ubicationModal" onclick="cls_ubication.update(this.name)">Guardar Cambios</button>
      `;
    document.getElementById('ubicationModal_title').innerHTML = ubication['tx_ubication_value'];
    document.getElementById('ubicationModal_content').innerHTML = content;
    document.getElementById('ubicationModal_footer').innerHTML = content_bottom;
    document.getElementById('btn_ubicationModal').setAttribute('name', ubication['ai_ubication_id']);
  }
  show(ubication_id){
    var url = '/ubication/'+ubication_id; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      var ubication = obj['data']['ubication'];
      var table_list = obj['data']['table']
      cls_ubication.render_modal(ubication,table_list);
      
      const modalUbication = new bootstrap.Modal('#ubicationModal', {})
      modalUbication.show();
      setTimeout(() => {
        document.getElementById('ubicationValue').focus();
      }, 500);
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_list(ubication_list){
    var list = '<div class="list-group">';
    for (const a in ubication_list) {
      var bg = (ubication_list[a]['tx_ubication_status'] == '0') ? 'text-bg-secondary' : '';
      var inactive = (ubication_list[a]['tx_ubication_status'] == '0') ? ' (INACTIVO)' : '';


      list += `<a href = "#" class="list-group-item list-group-item-action ${bg}" onclick="event.preventDefault(); cls_ubication.show(${ubication_list[a]['ai_ubication_id']})" >${ubication_list[a]['tx_ubication_value']} (${ubication_list[a]['tx_ubication_prefix']}) ${inactive}</a>`;
    }
    list += '</div>';
    return list;
  }
  update(ubication_id){
    var description = document.getElementById('ubicationValue').value;
    var prefix = document.getElementById('ubicationPrefix').value;
    var status = (document.getElementById('ubicationStatus').checked === true) ? 1 : 0;

    var url = '/ubication/' + ubication_id; var method = 'PUT';
    var body = JSON.stringify({a: description, b: prefix, c: status});
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        var ubicationList = obj['data']['ubicationList'];
        var list = cls_ubication.generate_list(ubicationList);
        document.getElementById('container_ubicationList').innerHTML = list;
  
        const ubicationModal = bootstrap.Modal.getInstance('#ubicationModal');
        ubicationModal.hide();
      }
      cls_general.shot_toast_bs(obj['message']);
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  delete(){
    var ubication_id = document.getElementById('btn_ubicationModal').getAttribute('name');
    var url = '/ubication/' + ubication_id; var method = 'DELETE';
    var body = "";
    var funcion = function (obj) {
      var ubicationList = obj['data']['ubicationList'];
      var list = cls_ubication.generate_list(ubicationList);
      document.getElementById('container_ubicationList').innerHTML = list;

      cls_general.shot_toast_bs(obj['message']);
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
}
class class_table {
  constructor(){
    this.raw_type = { 1: 'Barra', 2: 'Mesa', 3: 'Caja', 4: 'Cocina' }
  }
  create(ubication_id){
    var content = `
      <form id="form_newtable" name="form_newtable" method="post" onsubmit="event.preventDefault(); cls_table.save();" autocomplete="off">
        <div class="row">
          <div class="col-xs-12 py-2">
            <label for="tableValue" class="form-label">Descripci&oacute;n</label>
            <input type="text" class="form-control" id="tableValue" name="tableValue" alt="${ubication_id}" onfocus="cls_general.validFranz(this.id, ['word','number'])" >
            <input type="hidden" class="form-control" id="tableUbication" name="tableUbication" value="${ubication_id}">
          </div>
          <div class="col-md-12 col-lg-6 py-2">
            <label for="tableCode" class="form-label">C&oacute;digo</label>
            <input type="text" class="form-control" id="tableCode" name="tableCode" value="" onfocus="cls_general.validFranz(this.id, ['word','number'])" >
          </div>
          <div class="col-md-12 col-lg-6 py-2">
            <label for="tableType" class="form-label">Tipo</label>
            <select class="form-select" id="tableType" name="tableType">
              <option value="" selected>Seleccione</option>
              <option value="1">Barra</option>
              <option value="2">Mesa</option>
              <option value="3">Caja</option>
              <option value="4">Cocina</option>
            </select>
          </div>
          <div class="col-xs-12 py-2">
            <div class="row">
              <div class="col-md-12 col-lg-3 mb-3 text-center">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 58.001 58.001" width="80" height="80" xml:space="preserve">
                  <path style="fill:#88C057;" d="M29,19.5c-0.552,0-1-0.447-1-1v-8c0-0.553,0.448-1,1-1s1,0.447,1,1v8C30,19.053,29.552,19.5,29,19.5z"></path><path style="fill:#88C057;" d="M29,17.5c-0.256,0-0.512-0.098-0.707-0.293l-2-2c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0l2,2c0.391,0.391,0.391,1.023,0,1.414C29.512,17.403,29.256,17.5,29,17.5z"></path><path style="fill:#88C057;" d="M29,15.5c-0.256,0-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023,0-1.414l2-2c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414l-2,2C29.512,15.403,29.256,15.5,29,15.5z"></path><path style="fill:#553323;" d="M57,54.5c-0.426,0-0.82-0.273-0.954-0.702l-5-16c-0.165-0.526,0.129-1.088,0.656-1.252c0.525-0.166,1.088,0.128,1.253,0.656l5,16c0.165,0.526-0.129,1.088-0.656,1.252C57.199,54.486,57.099,54.5,57,54.5z"></path><path style="fill:#553323;" d="M47.001,54.5c-0.081,0-0.162-0.01-0.244-0.03c-0.536-0.134-0.861-0.677-0.728-1.212l4-16c0.135-0.536,0.68-0.86,1.213-0.728c0.536,0.134,0.861,0.677,0.728,1.212l-4,16C47.857,54.198,47.449,54.5,47.001,54.5z"></path><path style="fill:#553323;" d="M11,54.5c-0.426,0-0.82-0.273-0.954-0.702l-5-16c-0.165-0.526,0.129-1.088,0.656-1.252c0.525-0.166,1.088,0.128,1.253,0.656l5,16c0.165,0.526-0.129,1.088-0.656,1.252C11.199,54.486,11.099,54.5,11,54.5z"></path><path style="fill:#553323;" d="M1.001,54.5c-0.081,0-0.162-0.01-0.244-0.03c-0.536-0.134-0.861-0.677-0.728-1.212l4-16c0.134-0.536,0.678-0.86,1.213-0.728c0.536,0.134,0.861,0.677,0.728,1.212l-4,16C1.857,54.198,1.449,54.5,1.001,54.5z"></path><path style="fill:#C7CAC7;" d="M18,53.5h22c-4.971,0-9-4.029-9-9v-9h3v-4H24v4h3v9C27,49.471,22.971,53.5,18,53.5z"></path><path style="fill:#553323;" d="M48.043,27.5H9.958c1.152,1.147,2.091,2.504,2.779,4h32.526C45.952,30.004,46.89,28.648,48.043,27.5z"></path><rect x="13" y="24.5" style="fill:#C7CAC7;" width="6" height="3"></rect><path style="fill:#C7CAC7;" d="M21,25.5H11c-0.552,0-1-0.447-1-1s0.448-1,1-1h10c0.552,0,1,0.447,1,1S21.552,25.5,21,25.5z"></path><rect x="39" y="24.5" style="fill:#C7CAC7;" width="6" height="3"></rect><path style="fill:#C7CAC7;" d="M47,25.5H37c-0.552,0-1-0.447-1-1s0.448-1,1-1h10c0.552,0,1,0.447,1,1S47.552,25.5,47,25.5z"></path><path style="fill:#C7CAC7;" d="M26.025,18.5C25.39,20.093,25,20.192,25,22.5c0,4.97,1.791,5,4,5s4-0.03,4-5c0-2.308-0.39-2.407-1.025-4H26.025z"></path><path style="fill:#DD352E;" d="M29,3.5h-3v4c0,1.65,1.35,3,3,3V3.5z"></path><path style="fill:#B02721;" d="M29,4.5h3v3c0,1.65-1.35,3-3,3V4.5z"></path><path style="fill:#BFA380;" d="M14,37.5H4.366C1.955,37.5,0,35.546,0,33.135V23.5h0.274C7.855,23.5,14,29.646,14,37.226V37.5z"></path><path style="fill:#BFA380;" d="M44,37.5h9.634c2.411,0,4.366-1.955,4.366-4.366V23.5h-0.274C50.146,23.5,44,29.646,44,37.226V37.5z"></path><path style="fill:#839594;" d="M44,54.5H14c-0.552,0-1-0.447-1-1s0.448-1,1-1h30c0.552,0,1,0.447,1,1S44.552,54.5,44,54.5z"></path><rect x="24" y="32.5" style="fill:#839594;" width="10" height="3"></rect><path style="fill:#E7ECED;" d="M30,52.5h-3l0.112-2.014c0.033-0.591,0.172-1.167,0.349-1.732C27.818,47.62,28,46.436,28,45.244V35.5h1v9.744c0,1.192,0.182,2.376,0.538,3.511c0.177,0.565,0.316,1.141,0.349,1.732L30,52.5z"></path>
                </svg>
              </div>
              <div class="col-md-12 col-lg-9 mb-3">
                <div class="input-group mb-3">
                  <input type="file" class="form-control" id="tableImage" name="tableImage">
                </div>
              </div>
            </div>
          </div>
        </div>
      
    `;
    var content_bottom = `          
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      <button type="submit" id="btn_submitnewtable" class="btn btn-success" id="btn_submitnewtable" onclick="cls_table.save();">Guardar Cambios</button>
    </form>`;

    document.getElementById('ubicationModal_content').innerHTML = content;
    document.getElementById('ubicationModal_footer').innerHTML = content_bottom;
    document.getElementById('ubicationModal_title').innerHTML = '<h4>Crear Mesa</h4>';
  }
  save(){
    var field_value = document.getElementById('tableValue');
    var value = field_value.value;
    var code = document.getElementById('tableCode').value;
    var type = document.getElementById('tableType').value;
    if (cls_general.is_empty_var(value) === 0 || cls_general.is_empty_var(code) === 0 || cls_general.is_empty_var(type) === 0) {
      cls_general.shot_toast_bs('Verifique la información ingresada',{bg: 'text-bg-secondary'});
      return false;
    }

    cls_general.disable_submit(document.getElementById('btn_submitnewtable'));
    var formData = new FormData($('#form_newtable')[0]);
    $.ajax({
      url: '/table/',
      type: 'POST',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
      },
      // Form data
      data: formData,
      // Tell jQuery not to process data or worry about content-type. You *must* include these options!
      cache: false,
      contentType: false,
      processData: false,
      // Custom XMLHttpRequest
      xhr: function () {
        var myXhr = $.ajaxSettings.xhr();
        if (myXhr.upload) {
          // For handling the progress of the upload
          myXhr.upload.addEventListener('progress', function (e) {
            if (e.lengthComputable) {
              $('progress').attr({
                value: e.loaded,
                max: e.total,
              });
            }
          }, false);
        }
        return myXhr;
      }
    })
    .done(function (obj) {

      if (obj.status != 'failed') {
        cls_ubication.render_modal(obj.data.ubication, obj.data.table);
      }
      cls_general.shot_toast_bs(obj.message);
    });
    // var url = '/table/'; var method = 'POST';
    // var body = JSON.stringify({a: value, b: code, c: type, d: ubication_id});
    // var funcion = function (obj) {
    //   if (obj.status != 'failed') {
    //     cls_ubication.render_modal(obj.data.ubication, obj.data.table);
    //   }
    //   cls_general.shot_toast_bs(obj.message);
    // }
    // cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_list(table_list){
    var list = `<div class="list-group">`;
    for (const a in table_list) {
      var bg = (table_list[a]['tx_table_active'] === 0) ? 'text-bg-secondary' : '';
      var inactive = (table_list[a]['tx_table_active'] === 0) ? ' (INACTIVO)' : '';
      list += `<a href = "#" class="list-group-item list-group-item-action ${bg}" onclick="event.preventDefault(); cls_table.show('${table_list[a]['tx_table_slug']}')">${table_list[a]['tx_table_value'] + inactive}</a>`;
    }
    list += '</div>';
    return list;
  }
  show(table_id){
    var url = '/table/' + table_id; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      var table = obj['data']['table'];
      var checked = (table['tx_table_active'] === 1) ? 'checked' : '';
      var img = (cls_general.is_empty_var(table['tx_table_image']) === 1) ? `<img src="attached/image/table/${table['tx_table_image'] }" width="100px"></img>` : `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 58.001 58.001" width="80" height="80" xml:space="preserve">
          <path style="fill:#88C057;" d="M29,19.5c-0.552,0-1-0.447-1-1v-8c0-0.553,0.448-1,1-1s1,0.447,1,1v8C30,19.053,29.552,19.5,29,19.5z"></path><path style="fill:#88C057;" d="M29,17.5c-0.256,0-0.512-0.098-0.707-0.293l-2-2c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0l2,2c0.391,0.391,0.391,1.023,0,1.414C29.512,17.403,29.256,17.5,29,17.5z"></path><path style="fill:#88C057;" d="M29,15.5c-0.256,0-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023,0-1.414l2-2c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414l-2,2C29.512,15.403,29.256,15.5,29,15.5z"></path><path style="fill:#553323;" d="M57,54.5c-0.426,0-0.82-0.273-0.954-0.702l-5-16c-0.165-0.526,0.129-1.088,0.656-1.252c0.525-0.166,1.088,0.128,1.253,0.656l5,16c0.165,0.526-0.129,1.088-0.656,1.252C57.199,54.486,57.099,54.5,57,54.5z"></path><path style="fill:#553323;" d="M47.001,54.5c-0.081,0-0.162-0.01-0.244-0.03c-0.536-0.134-0.861-0.677-0.728-1.212l4-16c0.135-0.536,0.68-0.86,1.213-0.728c0.536,0.134,0.861,0.677,0.728,1.212l-4,16C47.857,54.198,47.449,54.5,47.001,54.5z"></path><path style="fill:#553323;" d="M11,54.5c-0.426,0-0.82-0.273-0.954-0.702l-5-16c-0.165-0.526,0.129-1.088,0.656-1.252c0.525-0.166,1.088,0.128,1.253,0.656l5,16c0.165,0.526-0.129,1.088-0.656,1.252C11.199,54.486,11.099,54.5,11,54.5z"></path><path style="fill:#553323;" d="M1.001,54.5c-0.081,0-0.162-0.01-0.244-0.03c-0.536-0.134-0.861-0.677-0.728-1.212l4-16c0.134-0.536,0.678-0.86,1.213-0.728c0.536,0.134,0.861,0.677,0.728,1.212l-4,16C1.857,54.198,1.449,54.5,1.001,54.5z"></path><path style="fill:#C7CAC7;" d="M18,53.5h22c-4.971,0-9-4.029-9-9v-9h3v-4H24v4h3v9C27,49.471,22.971,53.5,18,53.5z"></path><path style="fill:#553323;" d="M48.043,27.5H9.958c1.152,1.147,2.091,2.504,2.779,4h32.526C45.952,30.004,46.89,28.648,48.043,27.5z"></path><rect x="13" y="24.5" style="fill:#C7CAC7;" width="6" height="3"></rect><path style="fill:#C7CAC7;" d="M21,25.5H11c-0.552,0-1-0.447-1-1s0.448-1,1-1h10c0.552,0,1,0.447,1,1S21.552,25.5,21,25.5z"></path><rect x="39" y="24.5" style="fill:#C7CAC7;" width="6" height="3"></rect><path style="fill:#C7CAC7;" d="M47,25.5H37c-0.552,0-1-0.447-1-1s0.448-1,1-1h10c0.552,0,1,0.447,1,1S47.552,25.5,47,25.5z"></path><path style="fill:#C7CAC7;" d="M26.025,18.5C25.39,20.093,25,20.192,25,22.5c0,4.97,1.791,5,4,5s4-0.03,4-5c0-2.308-0.39-2.407-1.025-4H26.025z"></path><path style="fill:#DD352E;" d="M29,3.5h-3v4c0,1.65,1.35,3,3,3V3.5z"></path><path style="fill:#B02721;" d="M29,4.5h3v3c0,1.65-1.35,3-3,3V4.5z"></path><path style="fill:#BFA380;" d="M14,37.5H4.366C1.955,37.5,0,35.546,0,33.135V23.5h0.274C7.855,23.5,14,29.646,14,37.226V37.5z"></path><path style="fill:#BFA380;" d="M44,37.5h9.634c2.411,0,4.366-1.955,4.366-4.366V23.5h-0.274C50.146,23.5,44,29.646,44,37.226V37.5z"></path><path style="fill:#839594;" d="M44,54.5H14c-0.552,0-1-0.447-1-1s0.448-1,1-1h30c0.552,0,1,0.447,1,1S44.552,54.5,44,54.5z"></path><rect x="24" y="32.5" style="fill:#839594;" width="10" height="3"></rect><path style="fill:#E7ECED;" d="M30,52.5h-3l0.112-2.014c0.033-0.591,0.172-1.167,0.349-1.732C27.818,47.62,28,46.436,28,45.244V35.5h1v9.744c0,1.192,0.182,2.376,0.538,3.511c0.177,0.565,0.316,1.141,0.349,1.732L30,52.5z"></path>
        </svg>`;
      var content = 
      `
        <form id="form_updatetable" name="form_updatetable" method="post" onsubmit="event.preventDefault(); cls_table.update();" autocomplete="off">
          <div class="row">
            <div class="col-xs-12 py-2">
              <label for="tableValue" class="form-label">Descripci&oacute;n</label>
              <input type="text" class="form-control" id="tableValue" name="tableValue" value="${table['tx_table_value']}" onfocus="cls_general.validFranz(this.id, ['word','number'])">
              <input type="hidden" id="tableId" name="tableId" value="${table['ai_table_id']}" onfocus="cls_general.validFranz(this.id, ['word','number'])">
            </div>
            <div class="col-md-12 col-lg-4 py-2">
              <label for="tableCode" class="form-label">C&oacute;digo</label>
              <input type="text" class="form-control" id="tableCode" name="tableCode" value="${table['tx_table_code']}" onfocus="cls_general.validFranz(this.id, ['word','number'])">
            </div>
            <div class="col-md-12 col-lg-4 pt-4">
              <div class="form-check form-switch py-3 ">
                <input class="form-check-input" type="checkbox" role="switch" id="tableStatus" name="tableStatus" ${checked}>
                <label class="form-check-label" for="tableStatus">Activo</label>
              </div>
            </div>
            <div class="col-md-12 col-lg-4 py-2">
              <div class="col-xs-12">
                <label class="form-check-label" for="">Tipo</label>
                <span class="form-control cursor_default">${cls_table.raw_type[table['tx_table_type']]}</span>
              </div>
            </div>
            <div class="col-xs-12 py-2">
              <div class="row">
                <div class="col-md-12 col-lg-3 mb-3 text-center">
                  ${img}
                </div>
                <div class="col-md-12 col-lg-9 mb-3">
                  <div class="input-group mb-3">
                    <input type="file" class="form-control" id="tableImage" name="tableImage">
                    <input type="hidden" id="tableImage" name="tableImagePlaceholder" value="${table['tx_table_image']}">
                  </div>
                </div>
              </div>
            </div>
          </div>
      `;
      var content_bottom = `          
          <button type="button" class="btn btn-warning" data-bs-dismiss="modal" onclick="cls_table.delete(${table['ai_table_id']});">Eliminar Mesa</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="submit" class="btn btn-success" id="btn_submitupdatetable" onclick="cls_table.update();" >Guardar Cambios</button>
        </form>

      `;
      document.getElementById('ubicationModal_title').innerHTML = table['tx_table_value'];
      document.getElementById('ubicationModal_content').innerHTML = content;
      document.getElementById('ubicationModal_footer').innerHTML = content_bottom;
      setTimeout(() => {
        document.getElementById('tableValue').focus();
      }, 500);

    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  update(){
    cls_general.disable_submit(document.getElementById('btn_submitupdatetable'));
    var description = document.getElementById('tableValue').value;
    var code = document.getElementById('tableCode').value;
    // var status = (document.getElementById('tableStatus').checked === true) ? 1 : 0;

    if (cls_general.is_empty_var(description) === 0 || cls_general.is_empty_var(code) === 0) {
      cls_general.shot_toast_bs('Verifique la información ingresada.', { bg: 'text-bg-secondary' });
      return false;
    }

    var formData = new FormData($('#form_updatetable')[0]);
    $.ajax({
      url: '/table_upd/',
      type: 'POST',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
      },
      // Form data
      data: formData,
      // Tell jQuery not to process data or worry about content-type. You *must* include these options!
      cache: false,
      contentType: false,
      processData: false,
      // Custom XMLHttpRequest
      xhr: function () {
        var myXhr = $.ajaxSettings.xhr();
        if (myXhr.upload) {
          // For handling the progress of the upload
          myXhr.upload.addEventListener('progress', function (e) {
            if (e.lengthComputable) {
              $('progress').attr({
                value: e.loaded,
                max: e.total,
              });
            }
          }, false);
        }
        return myXhr;
      }
    })
    .done(function (obj) {
      if (obj.status != 'failed') {
        cls_ubication.render_modal(obj.data.ubication, obj.data.table);
      }
      cls_general.shot_toast_bs(obj.message);
    });



    // var url = '/table/' + table_id; var method = 'PUT';
    // var body = JSON.stringify({ a: description, b: code, c: status });
    // var funcion = function (obj) {
    //   if (obj.status != 'failed') {
    //     cls_ubication.render_modal(obj.data.ubication, obj.data.table);
    //   }
    //   cls_general.shot_toast_bs(obj['message']);
    // }
    // cls_general.async_laravel_request(url, method, funcion, body);
  }
  delete(table_id) {
    var url = '/table/' + table_id; var method = 'DELETE';
    var body = "";
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        cls_ubication.render_modal(obj.data.ubication, obj.data.table);
      }
      cls_general.shot_toast_bs(obj['message']);
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
}
class class_product{
  constructor(productlist){
    this.productlist = productlist
  }
  look_for(str,limit){
    var haystack = cls_product.productlist;
    console.log(haystack);
    var needles = str.split(' ');
    var raw_filtered = [];
    var counter = 0;
    for (var i in haystack) {
      if (counter >= limit) {  break; }
      var ocurrencys = 0;
      for (const a in needles) {
        if (haystack[i]['tx_product_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }else{
          if (haystack[i]['tx_product_reference'] != null && haystack[i]['tx_product_reference'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
        }
      }
      if (ocurrencys === needles.length) {
        raw_filtered.push(haystack[i]);
        counter++;
      }
    }
    return raw_filtered;
  }
  filter(str,limit) {
    var filtered = cls_product.look_for(str, limit);
    var content = cls_product.generate_list(filtered);
    document.getElementById('container_productList').innerHTML = content;
  }

  render() {
    var url = '/product'; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      var raw_list = obj['data']['all'];

      var list = cls_product.generate_list(raw_list)
      var content = `
        <div class="row">
          <div class="col-xs-12 py-2 text-center">
            <button type="button" class="btn btn-lg btn-primary" onclick="cls_product.create()">Crear producto</button>
            &nbsp;
          </div>
          <div class="col-xs-12">
            <h5>Listado de Productos</h5>
          </div>
          <div class="col-xs-12">
            <input type="text" class="form-control" onfocus="cls_general.validFranz(this.id, ['word','number','symbol'])" onkeyup="cls_product.filter(this.value,20)" placeholder="Buscar producto por nombre, referencia o c&oacute;digo" >
          </div>
          <div id="container_productList" class="col-xs-12 border-top">
            ${list}
          </div>
        </div>
      `;
      document.getElementById('container').innerHTML = content;
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  render_modal(){
    var product = cls_product.info;
    var option_productcategory = '';
    var categoryList = cls_productcategory.category
    categoryList.map(x => option_productcategory += `<option value="${x.ai_productcategory_id}">${x.tx_productcategory_value} </option>`)

    var checked_status = (product['tx_product_status'] === 1) ? 'checked' : '';
    var checked_alarm = (product['tx_product_alarm'] === 1) ? 'checked' : '';
    var checked_discountable = (product['tx_product_discountable'] === 1) ? 'checked' : '';
    var productReference = (product['tx_product_reference'] === null) ? '' : product['tx_product_reference'];

    var content = `
      <div class="row">
        <div class="col-xs-12">
          <div class="row">
            <div class="col-xs-12">
              <label for="productValue" class="form-label">Descripci&oacute;n</label>
              <input type="text" class="form-control" id="productValue" onfocus="cls_general.validFranz(this.id, ['word','number'])" onkeyup="cls_general.limitText(this, 100, toast = 0)" onblur="cls_general.limitText(this, 100, toast = 0)" value="${product['tx_product_value']}">
            </div>
            <div class="col-md-8">
              <label for="productReference" class="form-label">Referencia</label>
              <input type="text" class="form-control" id="productReference" value="${productReference}" onfocus="cls_general.validFranz(this.id, ['word','number'])" onkeyup="cls_general.limitText(this, 150, toast = 0)" onkeyup="cls_general.limitText(this, 150, toast = 0)">
            </div>
            <div class="col-md-4 d-grid gap-2">
              <label for="" class="form-label m_0">Conteo</label>
              <button type="button" class="btn btn-info" onclick="cls_product.count_product('${product['tx_product_slug']}')" >${product['tx_product_quantity']}</button>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6 col-md-12">
            <label for="productCode" class="form-label">% C&oacute;digo</label>
            <input type="text" class="form-control" id="productCode" value="${product['tx_product_code']}" onfocus="cls_general.validFranz(this.id, ['number'],'abcdefghijklmnñopqrstuvwxyzáéíóúABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ')" onkeyup="cls_general.limitText(this, 15, toast = 0)" onkeyup="cls_general.limitText(this, 15, toast = 0)" placeholder="00000000" >
          </div>
          <div class="col-lg-3 col-md-12">
            <label for="productTaxrate" class="form-label">% Imp</label>
            <input type="text" class="form-control" id="productTaxrate" value="${product['tx_product_taxrate']}" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 2, toast = 0)" onkeyup="cls_general.limitText(this, 2, toast = 0)">
          </div>
          <div class="col-lg-3 col-md-12">
            <label for="productDiscountrate" class="form-label">% Desc</label>
            <input type="text" class="form-control" id="productDiscountrate" value="${product['tx_product_discountrate']}" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 3, toast = 0)" onkeyup="cls_general.limitText(this, 3, toast = 0)">
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6 col-md-12">
            <label for="productMinimun" class="form-label">M&iacute;nimo</label>
            <input type="text" class="form-control" id="productMinimum" value="${product['tx_product_minimum']}" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 9, toast = 0)" onkeyup="cls_general.limitText(this, 9, toast = 0)">
          </div>
          <div class="col-lg-6 col-md-12">
            <label for="productMaximun" class="form-label">M&aacute;ximo</label>
            <input type="text" class="form-control" id="productMaximum" value="${product['tx_product_maximum']}" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 9, toast = 0)" onkeyup="cls_general.limitText(this, 9, toast = 0)">
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <label for="productCategory" class="form-label">Categor&iacute;a</label>
            <select id="productCategory" class="form-select"><option value="" disabled selected>Seleccione</option> ${option_productcategory}</select>
          </div>
          <div class="col-lg-6 pt-4 d-grid gap-2">
            <button type="button" class="btn btn-primary" onclick="cls_product.render_measure('${product['tx_product_value']}','${product['tx_product_slug']}')">Medidas</button>              
          </div>
        </div>
        <div class="row">
          <div class="col-lg-4">
            <div class="form-check form-switch py-3">
              <input class="form-check-input" type="checkbox" role="switch" id="productStatus" ${checked_status}>
              <label class="form-check-label" for="productStatus">Activo</label>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-check form-switch py-3">
              <input class="form-check-input" type="checkbox" role="switch" id="productAlarm" ${checked_alarm}>
              <label class="form-check-label" for="productAlarm">Alarma</label>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="form-check form-switch py-3">
              <input class="form-check-input" type="checkbox" role="switch" id="productDiscountable" ${checked_discountable}>
              <label class="form-check-label" for="productDiscountable">Descontable</label>
            </div>
          </div>
        </div>

      </div>
    `;

    var content_bottom = `          
      <div class="row">
        <div class="col-lg-12 text-center">
          <button type="button" class="btn btn-warning" data-bs-dismiss="modal" onclick="cls_product.delete(this,${product['tx_product_slug']});">Eiminar Producto</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-success" id="" name="" onclick="cls_product.update(this,'${product['tx_product_slug']}')">Guardar Cambios</button>
        </div>
      </div>
    `;
    document.getElementById('productModal_title').innerHTML = product['tx_product_value'];
    document.getElementById('productModal_content').innerHTML = content;
    document.getElementById('productModal_footer').innerHTML = content_bottom;
    document.getElementById('productCategory').value = product['product_ai_productcategory_id'];
  }
  generate_list(raw_list) {
    var list = '<div class="list-group">';
    for (const a in raw_list) {
      var bg = (raw_list[a]['tx_product_status'] == '0') ? 'text-bg-secondary' : '';
      var inactive = (raw_list[a]['tx_product_status'] == '0') ? ' (INACTIVO)' : '';
      var reference = (cls_general.is_empty_var(raw_list[a]['tx_product_reference']) != 0) ? '(' + raw_list[a]['tx_product_reference'] + ')' : '';

      list += `<a href = "#" class="list-group-item list-group-item-action ${bg}" onclick="event.preventDefault(); cls_product.show('${raw_list[a]['tx_product_slug']}')" >${raw_list[a]['tx_product_value']} ${reference} ${inactive}</a>`;
    }
    list += '</div>';
    return list;
  }
  create() {
    var option_productcategory = '';
    var categoryList = cls_productcategory.category
    categoryList.map(x => option_productcategory += `<option value="${x.ai_productcategory_id}">${x.tx_productcategory_value} </option>` )

    var option_productmeasure = '';
    var measureList = cls_measure.measure_list;
    measureList.map(x => option_productmeasure += `<option value="${x.ai_measure_id}">${x.tx_measure_value} </option>`)

    var content = `
        <div class="row">
          <div class="col-xs-12">
            <label for="productValue" class="form-label">Descripci&oacute;n</label>
            <input type="text" class="form-control" id="productValue" onfocus="cls_general.validFranz(this.id, ['word','number'])" onkeyup="cls_general.limitText(this, 100, toast = 0)" onblur="cls_general.limitText(this, 100, toast = 0)">
            <label for="productReference" class="form-label">Referencia</label>
            <input type="text" class="form-control" id="productReference" value="" onfocus="cls_general.validFranz(this.id, ['word','number'])" onkeyup="cls_general.limitText(this, 150, toast = 0)" onkeyup="cls_general.limitText(this, 150, toast = 0)">
          </div>
          <div class="row">
            <div class="col-lg-6 col-md-12">
              <label for="productCode" class="form-label">% C&oacute;digo</label>
              <input type="text" class="form-control" id="productCode" value="" onfocus="cls_general.validFranz(this.id, ['number'],'abcdefghijklmnñopqrstuvwxyzáéíóúABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ')" onkeyup="cls_general.limitText(this, 15, toast = 0)" onkeyup="cls_general.limitText(this, 15, toast = 0)" placeholder="00000000" >
            </div>
            <div class="col-lg-3 col-md-12">
              <label for="productTaxrate" class="form-label">% Imp</label>
              <input type="text" class="form-control" id="productTaxrate" value="${cls_option.option.TAX}" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 2, toast = 0)" onkeyup="cls_general.limitText(this, 2, toast = 0)">
            </div>
            <div class="col-lg-3 col-md-12">
              <label for="productDiscountrate" class="form-label">% Desc</label>
              <input type="text" class="form-control" id="productDiscountrate" value="0" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 3, toast = 0)" onkeyup="cls_general.limitText(this, 3, toast = 0)">
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6 col-md-12">
              <label for="productMinimun" class="form-label">M&iacute;nimo</label>
              <input type="text" class="form-control" id="productMinimum" value="" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 9, toast = 0)" onkeyup="cls_general.limitText(this, 9, toast = 0)">
            </div>
            <div class="col-lg-6 col-md-12">
              <label for="productMaximun" class="form-label">M&aacute;ximo</label>
              <input type="text" class="form-control" id="productMaximum" value="" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 9, toast = 0)" onkeyup="cls_general.limitText(this, 9, toast = 0)">
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6">
              <label for="productMeasure" class="form-label">Medida M&iacute;nima = 1</label>
              <select id="productMeasure" class="form-select"><option value="" disabled selected>Seleccione</option> ${option_productmeasure}</select>
            </div>
            <div class="col-lg-6">
              <label for="productCategory" class="form-label">Categor&iacute;a</label>
              <select id="productCategory" class="form-select"><option value="" disabled selected>Seleccione</option> ${option_productcategory}</select>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-4">
              <div class="form-check form-switch py-3">
                <input class="form-check-input" type="checkbox" role="switch" id="productStatus" checked>
                <label class="form-check-label" for="productStatus">Activo</label>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-check form-switch py-3">
                <input class="form-check-input" type="checkbox" role="switch" id="productAlarm" checked>
                <label class="form-check-label" for="productAlarm">Alarma</label>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="form-check form-switch py-3">
                <input class="form-check-input" type="checkbox" role="switch" id="productDiscountable" checked>
                <label class="form-check-label" for="productDiscountable">Descontable</label>
              </div>
            </div>
          </div>

        </div>
      `;
    var content_bottom = `          
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      <button type="button" class="btn btn-success" id="btn_productModal" onclick="cls_product.save()">Crear Producto</button>
    `;

    document.getElementById('productModal_content').innerHTML = content;
    document.getElementById('productModal_footer').innerHTML = content_bottom;
    document.getElementById('productModal_title').innerHTML = '<h4>Crear Producto</h4>';

    const modalUbication = new bootstrap.Modal('#productModal', {})
    modalUbication.show();

  }
  save() {
    cls_general.disable_submit(document.getElementById('btn_productModal'));
    var category = document.getElementById('productCategory').value;
    var measure = document.getElementById('productMeasure').value;
    var value = document.getElementById('productValue').value;
    var reference = document.getElementById('productReference').value;
    var code = document.getElementById('productCode').value;
    var taxrate = document.getElementById('productTaxrate').value;
    var minimum = document.getElementById('productMinimum').value;
    var maximum = document.getElementById('productMaximum').value;
    var discountRate = document.getElementById('productDiscountrate').value;
    var status = document.getElementById('productStatus').checked;
    var alarm = document.getElementById('productAlarm').checked;
    var discountable = document.getElementById('productDiscountable').checked;

    minimum = parseFloat(minimum);
    maximum = parseFloat(maximum);
    if (minimum >= maximum) {
      cls_general.shot_toast_bs('El m&iacute;nimo no puede ser mayor que m&aacute;ximo', { bg: 'text-bg-secondary' });
      return false;
    }
    if (cls_general.is_empty_var(category) === 0 || cls_general.is_empty_var(value) === 0 || cls_general.is_empty_var(code) === 0 || cls_general.is_empty_var(taxrate) === 0 || cls_general.is_empty_var(minimum) === 0 || cls_general.is_empty_var(maximum) === 0 || cls_general.is_empty_var(discountRate) === 0) {
      cls_general.shot_toast_bs('Falta informaci&oacute;n', { bg: 'text-bg-secondary' });
      return false;
    }
    var url = '/product/'; var method = 'POST';
    var body = JSON.stringify({ a: category, b: value, c: reference, d: code, e: taxrate, f: minimum, g: maximum, h: discountRate, i: status, j: alarm, k: discountable, l: measure });
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        var raw_list = obj['data']['all'];
        cls_product.productlist = raw_list;
        var list = cls_product.generate_list(raw_list)
        document.getElementById('container_productList').innerHTML = list;

        const productModal = bootstrap.Modal.getInstance('#productModal');
        productModal.hide();
      }
      cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-secondary' });
    }     
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  show(product_slug) {
    var url = '/product/' + product_slug; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      cls_product.measurement = obj.data.measure_list;
      cls_product.info = obj['data']['product'];
      cls_product.render_modal();
      const modalProduct = new bootstrap.Modal('#productModal', {})
      modalProduct.show();
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
  update(btn,productSlug){
    cls_general.disable_submit(btn);
    var category = document.getElementById('productCategory').value;
    var value = document.getElementById('productValue').value;
    var reference = document.getElementById('productReference').value;
    var code = document.getElementById('productCode').value;
    var taxrate = document.getElementById('productTaxrate').value;
    var minimum = document.getElementById('productMinimum').value;
    var maximum = document.getElementById('productMaximum').value;
    var discountRate = document.getElementById('productDiscountrate').value;
    var status = (document.getElementById('productStatus').checked) ? 1 : 0;
    var alarm = (document.getElementById('productAlarm').checked) ? 1 : 0;
    var discountable = (document.getElementById('productDiscountable').checked) ? 1 : 0;


    if (cls_general.is_empty_var(category) === 0 || cls_general.is_empty_var(value) === 0 || cls_general.is_empty_var(code) === 0 || cls_general.is_empty_var(taxrate) === 0 || cls_general.is_empty_var(minimum) === 0 || cls_general.is_empty_var(maximum) === 0 || cls_general.is_empty_var(discountRate) === 0) {
      cls_general.shot_toast_bs('Falta informaci&oacute;n', { bg: 'text-bg-secondary' });
      return false;
    }
    var url = '/product/'+productSlug; var method = 'PUT';
    var body = JSON.stringify({ a: category, b: value, c: reference, d: code, e: taxrate, f: minimum, g: maximum, h: discountRate, i: status, j: alarm, k: discountable });
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        var raw_list = obj['data']['all'];

        var list = cls_product.generate_list(raw_list)
        var content = `
          <div class="row">
            <div class="col-xs-12 py-2 text-center">
              <button type="button" class="btn btn-lg btn-primary" onclick="cls_product.create()">Crear producto</button>
              &nbsp;
            </div>
            <div class="col-xs-12">
              <h5>Listado de Productos</h5>
            </div>
            <div id="container_productList" class="col-xs-12 border-top">
              ${list}
            </div>
          </div>
        `;
        document.getElementById('container').innerHTML = content;

        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
        const productModal = bootstrap.Modal.getInstance('#productModal');
        productModal.hide();
      }else{
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-secondary' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  delete(btn,product_slug){
    cls_general.disable_submit(btn);

    var url = '/product/' + product_slug; var method = 'DELETE';
    var body = '';
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        var raw_list = obj['data']['all'];
        var list = cls_product.generate_list(raw_list)
        document.getElementById('container_productList').innerHTML = list;

        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
        const productModal = bootstrap.Modal.getInstance('#productModal');
        productModal.hide();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-secondary' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_measure_list(list){
    var list_measurement = '';
    list.map(x => list_measurement += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${x.tx_measure_value}
        <span class="badge bg-primary rounded-pill">${x.tx_measure_product_relation}</span>
        <button class="btn btn-warning" type="button" onclick="cls_product.delete_measure(${x.ai_measure_product_id},this)">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
          </svg>
        </button>
      </li>
    `);
    return list_measurement;
  }
  render_measure(productValue, productSlug) {
    var option_productmeasure = '';
    var measureList = cls_measure.measure_list;
    measureList.map(x => option_productmeasure += `<option value="${x.ai_measure_id}">${x.tx_measure_value} </option>`)
    var list_measurement = cls_product.generate_measure_list(cls_product.measurement);
    var content = `
      <div class="row">
        <div class="col-lg-12">
          <div class="row">
            <div class="col-lg-6">
              <label for="measureList" class="form-label">Medida</label>
              <select id="measureList" class="form-select">${option_productmeasure}</select>
            </div>
            <div class="col-lg-6">
              <div class="input-group mb-3" style="padding-top: 32px;">
                <input type="text" id="measureRelation" class="form-control" placeholder="Relacion a 1" onfocus="cls_general.validFranz(this.id, ['number'],'.')" onkeyup="cls_general.limitText(this, 20, toast = 0)" onblur="cls_general.limitText(this, 20, toast = 0)">
                <button class="btn btn-success" type="button" id="btn_addMeasureProduct" onclick="cls_product.save_measure('${productSlug}')">Agregar</button>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <h4>Listado de Medidas</h4>
              <div id="containerMeasureList" class="col-lg-12 list-group">${list_measurement}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    var content_bottom = `
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      <button type="button" class="btn btn-info" onclick="cls_product.render_modal()">Volver</button>
      `;

    document.getElementById('productModal_title').innerHTML = productValue;
    document.getElementById('productModal_content').innerHTML = content;
    document.getElementById('productModal_footer').innerHTML = content_bottom;
  }
  save_measure(product_slug){
    cls_general.disable_submit(document.getElementById('btn_addMeasureProduct'))
    var measure = document.getElementById('measureList').value;
    var measure_relation = document.getElementById('measureRelation').value;

    if (cls_general.is_empty_var(measure) === 0 || cls_general.is_empty_var(measure_relation) === 0) {
      cls_general.shot_toast_bs('Falta informaci&oacute;n',{bg: 'text-bg-warning'});
      return false;
    }
    var url = '/product/' + product_slug + '/measure'; var method = 'POST';
    var body = JSON.stringify({a: measure, b: measure_relation});
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_product.measurement = obj.data.measure_list;
        var list_measurement = cls_product.generate_measure_list(cls_product.measurement);
        document.getElementById('containerMeasureList').innerHTML = list_measurement;
        document.getElementById('measureRelation').value = '';
      }
      cls_general.shot_toast_bs(obj.message);
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  delete_measure(measureproduct_id,btn){
    cls_general.disable_submit(btn)

    var url = '/product/' + measureproduct_id + '/measure'; var method = 'DELETE';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_product.measurement = obj.data.measure_list;
        var list_measurement = cls_product.generate_measure_list(cls_product.measurement);
        document.getElementById('containerMeasureList').innerHTML = list_measurement;
        document.getElementById('measureRelation').value = '';
      }
      cls_general.shot_toast_bs(obj.message);
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
  count_product(product_slug){
    var url = '/product/' + product_slug + '/count'; var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var list = '<ul class="list-group list-group-flush">';
        obj.data.count_list.map(x => list += `
          <li class="list-group-item">Antes: ${x.tx_productcount_before} Despues: ${x.tx_productcount_after} (${x.created_at})</li>
        `)
        list += '</ul>';
        var content = `
          <div class="row">
            <div class="col-lg-12">
              <h4>Conteo</h4>
              <div class="input-group mb-3">
                <input type="text" id="productQuantity" class="form-control" placeholder="Ingrese la cantidad" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 10, toast = 0)" onkeyup="cls_general.limitText(this, 10, toast = 0)">
                <button class="btn btn-success" type="button" id="btn_addCountProduct" onclick="cls_product.updateQuantity('${product_slug}')">Agregar</button>
              </div>
            </div>
            <div id="container_countlist" class="col-lg-12">
              <h5>Conteos Anteriores</h5>
              ${list}
            </div>
          </div>
        `;
        var content_bottom = `
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-info" onclick="cls_product.render_modal()">Volver</button>
        `;

        document.getElementById('productModal_title').innerHTML = 'Contar';
        document.getElementById('productModal_content').innerHTML = content;
        document.getElementById('productModal_footer').innerHTML = content_bottom;
      }
      cls_general.shot_toast_bs(obj.message);
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  updateQuantity(product_slug){
    var quantity = document.getElementById('productQuantity').value;
    var url = '/product/' + product_slug + '/count'; var method = 'POST';
    var body = JSON.stringify({a: quantity});
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_product.info = obj['data']['product'];
        cls_product.render_modal();
      }
      cls_general.shot_toast_bs(obj.message);
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
}
class class_productcategory{
  constructor(category){
    this.category = category;
  }
}
class class_measure {
  constructor(measure) {
    this.measure_list = measure;
  }
}
class class_category{
  constructor(list){
    this.category_active = list;
  }
}
class class_article {
  constructor (article_list){
    this.articleList = article_list;
  }
  render() {
    var url = '/article'; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      var raw_list = obj['data']['all'];

      var list = cls_article.generate_list(raw_list)
      var content = `
        <div class="row">
          <div class="col-xs-12 py-2 text-center">
            <button type="button" class="btn btn-lg btn-primary" onclick="cls_article.create()">Crear Art&iacute;culo</button>
            &nbsp;
          </div>
          <div class="col-xs-12">
            <h5>Listado de Art&iacute;culos</h5>
          </div>
          <div class="col-xs-12">
            <input type="text" class="form-control" id="articleFilter" onfocus="cls_general.validFranz(this.id, ['word','number','symbol'])" onkeyup="cls_article.filter(this.value,20)" placeholder="Buscar art&iacute;culos por nombre" >
          </div>
          <div id="container_articleList" class="col-xs-12 border-top">
            ${list}
          </div>
        </div>
      `;
      document.getElementById('container').innerHTML = content;
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_list(raw_list) {
    var list = '<div class="list-group">';
    for (const a in raw_list) {
      var bg = (raw_list[a]['tx_article_status'] == '0') ? 'text-bg-secondary' : '';
      var inactive = (raw_list[a]['tx_article_status'] == '0') ? ' (INACTIVO)' : '';

      list += `<a href = "#" class="list-group-item list-group-item-action ${bg}" onclick="event.preventDefault(); cls_article.show('${raw_list[a]['tx_article_slug']}')">${raw_list[a]['tx_article_value']} ${inactive}</a>`;
    }
    list += '</div>';
    return list;
  }
  create() {
    // LLENAR ESTA FUNCION
    var option_category = '';
    var categoryList = cls_category.category_active
    categoryList.map(x => option_category += `<option value="${x.ai_category_id}">${x.tx_category_value} </option>`);

    var content = `
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col-xs-12">
                <label for="articleValue" class="form-label">Descripci&oacute;n</label>
                <input type="text" class="form-control" id="articleValue" onfocus="cls_general.validFranz(this.id, ['word','number','symbol'])" onkeyup="cls_general.limitText(this, 100, toast = 0)" onblur="cls_general.limitText(this, 100, toast = 0)">
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6 col-md-12">
                <label for="articleCode" class="form-label">C&oacute;digo</label>
                <input type="text" class="form-control" id="articleCode" value="" onfocus="cls_general.validFranz(this.id, ['number'],'abcdefghijklmnñopqrstuvwxyzáéíóúABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ')" onkeyup="cls_general.limitText(this, 15, toast = 0)" onkeyup="cls_general.limitText(this, 15, toast = 0)" placeholder="00000000" >
              </div>
              <div class="col-lg-6 col-md-12">
                <label for="articleCategory" class="form-label">Categor&iacute;a</label>
                <select id="articleCategory" class="form-select"><option value="" disabled selected>Seleccione</option> ${option_category}</select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 col-lg-4">
                <div class="form-check form-switch py-3">
                  <input class="form-check-input" type="checkbox" role="switch" id="articlePromotion">
                  <label class="form-check-label" for="articlePromotion">Promoci&oacute;n</label>
                </div>
              </div>
              <div class="col-md-6 col-lg-4">
                <label for="articleTaxrate" class="form-label">% Impuesto</label>
                <input type="text" class="form-control" id="articleTaxrate" value="${cls_option.option.TAX}" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 2, toast = 0)" onkeyup="cls_general.limitText(this, 2, toast = 0)"  >
              </div>
              <div class="col-md-6 col-lg-4">
                <label for="articleDiscountrate" class="form-label">% Descuento</label>
                <input type="text" class="form-control" id="articleDiscountrate" value="0" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 2, toast = 0)" onkeyup="cls_general.limitText(this, 2, toast = 0)"  >
              </div>
           </div>

            <div class="row">
              <div class="col-lg-12">
                <label class="form-check-label" for="articleOption">Opciones de Art&iacute;culo</label>
                <textarea id="articleOption" cols="48" rows="5" onkeyup="this.value = cls_general.franz_textarea(event,this.value)" placeholder="Ejemplo. coccion:sellada,termino medio,tres cuartos  Debe dejar un reglon para cada opción."></textarea>
              </div>
            </div>

          </div>
        </div>
    `;
    var content_bottom = `          
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      <button type="button" class="btn btn-success" id="btn_articleModal" onclick="cls_article.save(this)">Guardar Artículo</button>
    `;

    document.getElementById('articleModal_content').innerHTML = content;
    document.getElementById('articleModal_footer').innerHTML = content_bottom;
    document.getElementById('articleModal_title').innerHTML = '<h4>Crear Art&iacute;culo</h4>';

    const modal = new bootstrap.Modal('#articleModal', {})
    modal.show();
  }
  encode_articleoption(article_option){
    var option = [];
    if (cls_general.is_empty_var(article_option) === 1) {
      var raw_articleoption = article_option.split('\n');
      for (const a in raw_articleoption) {
        var splited_line = raw_articleoption[a].split(':');
        if (splited_line.length < 2) {
          cls_general.shot_toast_bs('Formato Erroneo. Debe contener ":"', { bg: 'text-bg-warning' });
          return false;
        }
        if (/([\w]+[, ]+[\w]+)+/gm.test(splited_line[1]) != true) {
          cls_general.shot_toast_bs('Debe incluir al menos 2 opciones.', { bg: 'text-bg-warning' });
          return false;
        }
        var option_splited = splited_line[1].split(',');
        var option_array = [];
        for (const b in option_splited) {
          option_array.push(option_splited[b]);
        }
        var ob = new Object;
        var id = splited_line[0];
        ob[id] = option_array;
        option.push(ob);
      }
    }
    return option;
  }
  decode_articleoption(article_option){ //article_option es un array
    var string = '';
    article_option.map((opt_line) => {
      for (const a in opt_line) {
        string += `${a}: `;
        var str_opt = '';
        opt_line[a].map((opt) => {
          str_opt += `${opt}, `;
        })
      }
      string += str_opt.slice(0,-2)+'\n'
    })
    return string.slice(0, -1);
  }
  save(btn){
    cls_general.disable_submit(btn);
    var description = document.getElementById('articleValue').value;
    var code  = document.getElementById('articleCode').value;
    var category = document.getElementById('articleCategory').value;
    var promotion = (document.getElementById('articlePromotion').checked) ? 1:0;
    var taxrate = document.getElementById('articleTaxrate').value;
    var discountrate = document.getElementById('articleDiscountrate').value;
    var article_option = document.getElementById('articleOption').value;
    // Verificar la constitucion de options, condicionales debe tener : y al menos 1 coma
    if (cls_general.is_empty_var(description) === 0 || cls_general.is_empty_var(code) === 0 || cls_general.is_empty_var(category) === 0 || cls_general.is_empty_var(taxrate) === 0 || cls_general.is_empty_var(discountrate) === 0) {
      cls_general.shot_toast_bs('Llene todos los campos.', {bg: 'text-bg-warning'});
      return false;
    }
    taxrate = parseFloat(taxrate);
    discountrate = parseFloat(discountrate);
    if (taxrate > 99 || discountrate > 99) {
      cls_general.shot_toast_bs('Campo Impuesto o Descuento no pueden ser mayores a 99%.', { bg: 'text-bg-warning' });
      return false;
    }

    var option = cls_article.encode_articleoption(article_option);
    var url = '/article'; var method = 'POST';
    var body = JSON.stringify({ a: description, b: code, c: category, d: promotion, e: option, h: taxrate, i: discountrate });
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        var raw_list = obj['data']['all'];
        var list = cls_article.generate_list(raw_list)
        document.getElementById('container_articleList').innerHTML = list;

        const Modal = bootstrap.Modal.getInstance('#articleModal');
        Modal.hide();
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      }else{
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  look_for(str, limit) {
    var haystack = cls_article.articleList;
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
  filter(str,limit) {
    var filtered = cls_article.look_for(str,limit);
    var content = cls_article.generate_list(filtered);
    document.getElementById('container_articleList').innerHTML = content;
  }
  show(article_slug){
    var url = '/article/' + article_slug; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      var article = obj['data']['article'];

      cls_articleproduct.articleproduct_selected = [];
      var option_category = '';
      var categoryList = cls_category.category_active
      categoryList.map(x => option_category += (x.ai_category_id === article.article_ai_category_id) ? `<option value="${x.ai_category_id}" selected>${x.tx_category_value}</option>` : `<option value="${x.ai_category_id}">${x.tx_category_value}</option>`);
      
      var checked_promotion = (article.tx_article_promotion == 1) ? 'checked' : '';
      var checked_status = (article.tx_article_status == 1) ? 'checked' : '';
      var raw_option = JSON.parse(article.tx_article_option);
      var option = cls_article.decode_articleoption(raw_option)

      obj.data.articleproduct.map(product => {
        cls_articleproduct.articleproduct_selected.push({
          product_id: product.articleproduct_ai_product_id,
          product_value: product.tx_product_value,
          article: product.articleproduct_ai_article_id,
          quantity: product.tx_articleproduct_quantity,
          measure_id: product.articleproduct_ai_measure_id,
          measure_value: product.tx_measure_value
        });
      })
      var selected = cls_articleproduct.articleproduct_selected;
      var list_selected = cls_articleproduct.generate_productselected(selected);

      var content = `
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col-xs-12">
                <h4>Modificar Art&iacute;culo</h4>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12">
                <label for="articleValue" class="form-label">Descripci&oacute;n</label>
                <input type="text" class="form-control" id="articleValue" value="${article.tx_article_value}" onfocus="cls_general.validFranz(this.id, ['word','number','symbol'])" onkeyup="cls_general.limitText(this, 100, toast = 0)" onblur="cls_general.limitText(this, 100, toast = 0)">
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4 col-md-12">
                <label for="articleCode" class="form-label">C&oacute;digo</label>
                <input type="text" class="form-control" id="articleCode" value="${article.tx_article_code}" onfocus="cls_general.validFranz(this.id, ['number'],'abcdefghijklmnñopqrstuvwxyzáéíóúABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ')" onkeyup="cls_general.limitText(this, 15, toast = 0)" onkeyup="cls_general.limitText(this, 15, toast = 0)" placeholder="00000000" >
              </div>
              <div class="col-lg-4 col-md-12">
                <label for="articleCategory" class="form-label">Categor&iacute;a</label>
                <select id="articleCategory" class="form-select"><option value="" disabled selected>Seleccione</option> ${option_category}</select>
              </div>
              <div class="col-lg-2 col-md-12">
                <div class="form-check form-switch pt_35">
                  <input class="form-check-input" type="checkbox" role="switch" id="articlePromotion" ${checked_promotion}>
                  <label class="form-check-label" for="articlePromotion">Promoci&oacute;n</label>
                </div>
              </div>
              <div class="col-lg-2 col-md-12">
                <div class="form-check form-switch pt_35">
                  <input class="form-check-input" type="checkbox" role="switch" id="articleStatus" ${checked_status}>
                  <label class="form-check-label" for="articleStatus">Activo</label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-6 col-lg-3">
                <label for="articleTaxrate" class="form-label">% Impuesto</label>
                <input type="text" class="form-control" id="articleTaxrate" value="${article.tx_article_taxrate}" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 2, toast = 0)" onkeyup="cls_general.limitText(this, 2, toast = 0)"  >
              </div>
              <div class="col-sm-12 col-md-6 col-lg-3">
                <label for="articleDiscountrate" class="form-label">% Descuento</label>
                <input type="text" class="form-control" id="articleDiscountrate" value="${article.tx_article_discountrate}" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 2, toast = 0)" onkeyup="cls_general.limitText(this, 2, toast = 0)"  >
              </div>
              <div class="col-sm-12 col-md-6 col-lg-3 d-grid gap-2 pt-3">
                <button type="button" class="btn btn-info" onclick="cls_article.price('${article_slug}')">Precio</button>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <label class="form-check-label" for="articleOption">Opciones de Art&iacute;culo</label>
                <textarea id="articleOption" cols="82" rows="3" onkeyup="this.value = cls_general.franz_textarea(event,this.value)" placeholder="Ejemplo. coccion:sellada,termino medio,tres cuartos  Debe dejar un reglon para cada opción.">${option}</textarea>
              </div>
            </div>
          </div>
        </div>
      `;
      var content_bottom = `
        <div class="row">
          <div class="col-lg-12 text-center pt-2">
            <button type="button" class="btn btn-warning" onclick="cls_article.delete(this,${article.tx_article_slug});">Eliminar Art&iacute;culo</button>
            <button type="button" class="btn btn-secondary" onclick="cls_article.render()">Volver</button>
            <button type="button" class="btn btn-success" name="${article.ai_article_id}" id="btn_articleModal_update" onclick="cls_article.update(this,this.name)">Guardar Artículo</button>
          </div>
        </div>
      `;
      var content_product = `
        <div class="row">
          <div class="col-lg-12">
            <h5>Receta</h5>
          </div>

          <div class="col-lg-6">
            <div class="col-lg-12">
                <label for="" class="form-label">Buscar Producto</label>
                <input type="text" class="form-control" id="" onkeyup="cls_article.filter_product(this.value)" onfocus="cls_general.validFranz(this.id, ['number'],'abcdefghijklmnñopqrstuvwxyzáéíóúABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ')" placeholder="Nombre del producto"/>
            </div>
            <div id="container_filterproduct" class="col-lg-12 v_scrollable h_150 bx_1 by_1 border_gray"></div>
          </div>

          <div class="col-lg-6">
            <div class="col-lg-12"><h5>Productos Seleccionados</h5></div>
            <div id="container_productselected" class="col-lg-12 v_scrollable h_200">
              ${list_selected}
            </div>
          </div>
        </div>
      `; 
      document.getElementById('container').innerHTML = content+content_bottom+content_product;
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  update(btn,article_id){
    cls_general.disable_submit(btn);
    var description = document.getElementById('articleValue').value;
    var code = document.getElementById('articleCode').value;
    var category = document.getElementById('articleCategory').value;
    var promotion = (document.getElementById('articlePromotion').checked) ? 1 : 0;
    var status = (document.getElementById('articleStatus').checked) ? 1 : 0;
    var taxrate = document.getElementById('articleTaxrate').value;
    var discountrate = document.getElementById('articleDiscountrate').value;
    var article_option = document.getElementById('articleOption').value;
    if (cls_general.is_empty_var(description) === 0 || cls_general.is_empty_var(code) === 0 || cls_general.is_empty_var(category) === 0 || cls_general.is_empty_var(taxrate) === 0 || cls_general.is_empty_var(discountrate) === 0) {
      cls_general.shot_toast_bs('Llene todos los campos.', { bg: 'text-bg-warning' });
      return false;
    }
    
    var option = cls_article.encode_articleoption(article_option);// Verificar la constitucion de options, condicionales debe tener : y al menos 1 coma
    var product_selected = cls_articleproduct.articleproduct_selected;
    var keys = Object.keys(product_selected);
    if (keys.length > 0 && status == 0) { 
      swal({
        title: "¿Desea mantenerlo desactivado?",
        text: "El artículo no aparecerá en la carta.",
        icon: "warning",

        buttons: {
          si: {
            text: "Si",
            className: "btn btn-warning btn-lg"
          },
          no: {
            text: "No",
            className: "btn btn-success btn-lg",
          },
        },
        dangerMode: true,
      })
      .then((ans) => {
        switch (ans) {
          case 'si':
            status = 0;
            cls_article.run_update(article_id, description, code, category, promotion, option, status, product_selected, taxrate, discountrate);
            break;
          case 'no':
            status = 1;
            cls_article.run_update(article_id, description, code, category, promotion, option, status, product_selected, taxrate, discountrate);
            break;
        }
      });
    }else{
      cls_article.run_update(article_id, description, code, category, promotion, option, status, product_selected, taxrate, discountrate);
    }
  }
  run_update(article_id, description, code, category, promotion, option, status, product_selected, taxrate, discountrate){
    var url = '/article/' + article_id; var method = 'PUT';
    var body = JSON.stringify({ a: description, b: code, c: category, d: promotion, e: option, f: status, g: product_selected, h: taxrate, i: discountrate});
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        var raw_list = obj['data']['all'];
        var list = cls_article.generate_list(raw_list)
        var content = `
          <div class="row">
            <div class="col-xs-12 py-2 text-center">
              <button type="button" class="btn btn-lg btn-primary" onclick="cls_article.create()">Crear Art&iacute;culo</button>
              &nbsp;
            </div>
            <div class="col-xs-12">
              <h5>Listado de Art&iacute;culos</h5>
            </div>
            <div class="col-xs-12">
              <input type="text" class="form-control" id="articleFilter" onfocus="cls_general.validFranz(this.id, ['word','number','symbol'])" onkeyup="cls_article.filter(this.value,20)" placeholder="Buscar art&iacute;culos por nombre" >
            </div>
            <div id="container_articleList" class="col-xs-12 border-top">
              ${list}
            </div>
          </div>
        `;
        document.getElementById('container').innerHTML = content;


        var list = cls_article.generate_list(raw_list)
        document.getElementById('container_articleList').innerHTML = list;
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  delete(btn,article_slug){
    cls_general.disable_submit(btn);
    var url = '/article/' + article_slug; var method = 'DELETE';
    var body = "";
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        var raw_list = obj['data']['all'];
        var list = cls_article.generate_list(raw_list)
        var content = `
          <div class="row">
            <div class="col-xs-12 py-2 text-center">
              <button type="button" class="btn btn-lg btn-primary" onclick="cls_article.create()">Crear Art&iacute;culo</button>
              &nbsp;
            </div>
            <div class="col-xs-12">
              <h5>Listado de Art&iacute;culos</h5>
            </div>
            <div class="col-xs-12">
              <input type="text" class="form-control" id="articleFilter" onfocus="cls_general.validFranz(this.id, ['word','number','symbol'])" onkeyup="cls_article.filter(this.value,20)" placeholder="Buscar art&iacute;culos por nombre" >
            </div>
            <div id="container_articleList" class="col-xs-12 border-top">
              ${list}
            </div>
          </div>
        `;
        document.getElementById('container').innerHTML = content;
        var list = cls_article.generate_list(raw_list)
        document.getElementById('container_articleList').innerHTML = list;
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  price(article_slug){
    var url = '/price/' + article_slug + '/article'; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      var raw_price = obj.data.price;
      cls_price.render_article(raw_price,article_slug);
      const modal = new bootstrap.Modal('#priceModal', {})
      modal.show();

    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  filter_product (str) {
    var filtered = cls_product.look_for(str,20)
    var list = cls_article.generate_productlist(filtered);
    document.getElementById('container_filterproduct').innerHTML = list;
  }
  generate_productlist(filtered){
    var content = '<ul class="list-group">';
    for (const a in filtered) {
      content += `<li class="list-group-item cursor_pointer" onclick="cls_article.show_product('${filtered[a].tx_product_slug}')">${filtered[a].tx_product_value}</li>`;
    }
    content += '</ul>';
    return content;
  }
  show_product(product_slug){
    var url = '/product/'+product_slug; var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      var product = obj['data']['product'];
      var option_productmeasure = '';
      var measureList = obj['data']['measure_list'];
      measureList.map(x => option_productmeasure += `<option value="${x.ai_measure_id}">${x.tx_measure_value} </option>`)
      var content = `
        <div class="row">
          <div class="col-md-12 col-lg-6">
              <label for="" class="form-label">Cantidad</label>
              <input type="text" class="form-control" id="articleproductQuantity" value="" onfocus="cls_general.validFranz(this.id, ['number'], '.')">
          </div>
          <div class="col-md-12 col-lg-6">
            <label for="articleproductMeasure" class="form-label">Medida</label>
            <select id="articleproductMeasure" class="form-select">${option_productmeasure}</select>
          </div>
        </div>
      `;
      var content_bottom = `
        <div class="row">
          <div class="col-lg-12 text-center">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-success" id="" onclick="cls_article.add_product(this,${product.ai_product_id},)">Agregar Producto</button>
          </div>
        </div>
      `;

      document.getElementById('articleproductModal_title').innerHTML = product['tx_product_value'];
      document.getElementById('articleproductModal_content').innerHTML = content;
      document.getElementById('articleproductModal_footer').innerHTML = content_bottom;
      const modal = new bootstrap.Modal('#articleproductModal', {})
      modal.show();
      setTimeout(() => {
        document.getElementById('articleproductQuantity').focus();
      }, 600);
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  add_product(btn, product_id){
    cls_general.disable_submit(btn);
    var quantity = document.getElementById('articleproductQuantity').value;
    var measure = document.getElementById('articleproductMeasure').value;
    var article_id = document.getElementById('btn_articleModal_update').name;
    if (cls_general.is_empty_var(quantity) === 0 || cls_general.is_empty_var(measure) === 0 || cls_general.is_empty_var(article_id) === 0) {
      cls_general.shot_toast_bs('Falta informaci&oacute;n.', { bg: 'text-bg-warning' });
      return false;
    }
    if(isNaN(quantity)) {
      cls_general.shot_toast_bs('Cantidad debe ser un numero.', {bg: 'text-bg-warning'});
      return false;
    }
    var select_measure = document.getElementById('articleproductMeasure');
    var selected = {
      product_id: product_id,
      product_value: document.getElementById('articleproductModal_title').innerHTML,
      article: document.getElementById('btn_articleModal_update').name,
      quantity: document.getElementById('articleproductQuantity').value,
      measure_id: select_measure.value,
      measure_value: select_measure.options[select_measure.selectedIndex].text
    }
    var check_dup = new Object;
    check_dup = cls_articleproduct.articleproduct_selected.filter(x =>  x.product_id == product_id );

    const keys = Object.keys(check_dup);
    if (keys.length > 0) {
      cls_general.shot_toast_bs('Ese producto ya fu&eacute; agregado.', {bg: 'text-bg-warning'})
      return false;
    }
    cls_articleproduct.articleproduct_selected.push(selected);
    const modal = bootstrap.Modal.getInstance('#articleproductModal');
    modal.hide();

    cls_articleproduct.render_productselected();
  }
  erase_product(index){
    var selected = cls_articleproduct.articleproduct_selected;
    selected.splice(index, 1)
    cls_articleproduct.articleproduct_selected = selected;
    cls_articleproduct.render_productselected();

  }
}
class class_articleproduct{
  constructor(){
    this.articleproduct_selected = [];
  }
  render_productselected(){
    var selected = cls_articleproduct.articleproduct_selected;
    var content = cls_articleproduct.generate_productselected(selected);
    document.getElementById('container_productselected').innerHTML = content;    
  }
  generate_productselected(selected){
    var content = '<ul class="list-group">';
    selected.map(((product, index) => content += `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      ${product.product_value} (${product.quantity} ${product.measure_value})
      <button class="btn btn-warning" type="button" onclick="cls_article.erase_product(${index})">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
        </svg>
      </button>
    </li>` ))
    content += '</ul>';
    return content;
  }
}
class class_price{
  render_article(raw_price,article_slug){
    var actual = [];
    var historical = [];
    raw_price.map((price) => {
      if (price.tx_price_status === 1) {
        actual.push(price);
      }
      historical.push(price);
    })
    
    var tbody_price = '';
    historical.map((price) => {
      var date = cls_general.date_converter('ymd', 'dmy', price.tx_price_date);
      var bg = (price.tx_price_status == 1) ? 'table-dark' : '';
      var pOne = (cls_general.is_empty_var(price.tx_price_one) === 0) ? 0 : price.tx_price_one;
      var pTwo = (cls_general.is_empty_var(price.tx_price_two) === 0) ? 0 : price.tx_price_two;
      tbody_price += `<tr class="${bg}">  <td>${date}(${price.tx_presentation_value})</td>  <td>B/${price.tx_price_three.toFixed(2)}</td> <td>B/${pTwo.toFixed(2)}</td> <td>B/${pOne.toFixed(2)}</td>
      <td>
        <button class="btn btn-warning" type="button" onclick="cls_price.delete(this,${price.ai_price_id})">
         <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
         </svg>
        </button>
      
      </td>
      </tr>`;

    })
    if (actual.length > 0) {
      var pThree  = actual[0]['tx_price_three'];
      var pTwo = (cls_general.is_empty_var(actual[0]['tx_price_two']) === 0) ? 0.00 : actual[0]['tx_price_two'];
      var pOne = (cls_general.is_empty_var(actual[0]['tx_price_one']) === 0) ? 0.00 : actual[0]['tx_price_one'];
    }else{
      var pThree = '';
      var pTwo = '';
      var pOne = '';
    }
    var option_presentation = ''; //SELECT DEL PRESENTATION
    cls_presentation.presentation_list.map((presentation) => {  option_presentation += `<option value="${presentation.ai_presentation_id}">${presentation.tx_presentation_value}</option>`; })
    var content = `
      <div class="row">
        <div class="col">
          <div class="row">
            <div class="col-xs-12 col-md-6 col-lg-3">
              <label for="priceThree" class="form-label">Standard</label>
              <input type="text" class="form-control" id="priceThree" value="${pThree}" onfocus="cls_general.validFranz(this.id, ['number'],'.')" onkeyup="cls_general.limitText(this, 10, toast = 0)" onblur="cls_general.limitText(this, 10, toast = 0)">
            </div>
            <div class="col-xs-12 col-md-6 col-lg-3">
              <label for="priceTwo" class="form-label">Precio #2</label>
              <input type="text" class="form-control" id="priceTwo"   value="${pTwo}" onfocus="cls_general.validFranz(this.id, ['number'],'.')" onkeyup="cls_general.limitText(this, 10, toast = 0)" onblur="cls_general.limitText(this, 10, toast = 0)">
            </div>
            <div class="col-xs-12 col-md-6 col-lg-3">
              <label for="priceOne" class="form-label">Precio #1</label>
              <input type="text" class="form-control" id="priceOne"   value="${pOne}" onfocus="cls_general.validFranz(this.id, ['number'],'.')" onkeyup="cls_general.limitText(this, 10, toast = 0)" onblur="cls_general.limitText(this, 10, toast = 0)">
            </div>
            <div class="col-xs-12">
              <label for="pricePresentation" class="form-label">Presentaci&oacute;n</label>
              <select id="pricePresentation" class="form-select"><option value="" disabled selected>Seleccione</option>${option_presentation}</select>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12 text-center pt-2">
              <button type="button" class="btn btn-success" onclick="cls_price.save(this,'${article_slug}')">Agregar Precio</button>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12 h_200 v_scrollable">
            <caption>Hist&oacute;rico de Precios</caption>
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Standard</th>
                    <th scope="col">D #2</th>
                    <th scope="col">D #1</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  ${tbody_price}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
    var content_bottom = `
      <div class="row">
        <div class="col-lg-12 text-center pt-2">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
      </div>
    `;

    document.getElementById('priceModal_content').innerHTML = content;
    document.getElementById('priceModal_footer').innerHTML = content_bottom;
    document.getElementById('priceModal_title').innerHTML = '<h4>Crear Art&iacute;culo</h4>';
  }
  save(btn,article_slug){
    cls_general.disable_submit(btn);
    var pOne = document.getElementById('priceOne').value;
    var pTwo = document.getElementById('priceTwo').value;
    var pThree = document.getElementById('priceThree').value;
    var presentation_id = document.getElementById('pricePresentation').value;

    if (cls_general.is_empty_var(presentation_id) === 0) {
      cls_general.shot_toast_bs('Debe seleccionar la presentaci&oacute;n.',{bg: 'text-bg-warning'});
    }
    var url = '/price/'; var method = 'POST';
    var body = JSON.stringify({ a: pOne, b: pTwo, c: pThree, e: article_slug, f: presentation_id });
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        var raw_price = obj.data.price;
        cls_price.render_article(raw_price, article_slug);
      }else{
        cls_general.shot_toast_bs(obj.message,{bg: 'text-bg-warning'});
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  delete(btn,price_id){
    cls_general.disable_submit(btn);
    var url = '/price/' + price_id; var method = 'DELETE';
    var body = '';
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        var raw_price = obj.data.price;
        cls_price.render_article(raw_price, obj.data.article.tx_article_slug);
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
}
class class_presentation{
  constructor(presentation_list){
    this.presentation_list = presentation_list;
  }
}

// class class_articlepresentation {
//   generate_list_saved(saved){

//     var list = `<ul class="list-group">`;
//     if (saved.length > 0) {
//       saved.map((presentation) => {
//         list += `
//         <li class="list-group-item d-flex justify-content-between align-items-center">
//           ${presentation.tx_presentation_value}
//           <button class="btn btn-warning" type="button" onclick="cls_articlepresentation.delete(this,${presentation.ai_article_presentation_id})">
//             <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
//               <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
//             </svg>
//           </button>
//         </li>
//         `;
//       });
//     }
//     list += `</ul>`;
//     return list;
//   }
//   render_article(raw_presentation, article_slug) {
//     var list_saved = cls_articlepresentation.generate_list_saved(raw_presentation);
//     var list_presentation = '<ul class="list-group">';
//     cls_presentation.presentation_list.map((presentation) => {
//       list_presentation += `
//         <li class="list-group-item d-flex justify-content-between align-items-center">
//           ${presentation.tx_presentation_value}
//           <button class="btn btn-primary" type="button" onclick="cls_articlepresentation.save(this,${presentation.ai_presentation_id},'${article_slug}')">
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
//               <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
//             </svg>
//           </button>
//         </li>
//       `;
//     })
//     list_presentation += '</ul>';

//     var content = `
//       <div class="row">
//         <div class="col">
//           <div class="row">
//             <div class="col-md-6">
//               <h5>Listado</h5>
//               <div class="row">
//                 <div id="container_presentationList" class="col-md-12 h_300 v_scrollable">
//                   ${list_presentation}
//                 </div>
//               </div>
//             </div>
//             <div class="col-md-6">
//               <h5>Presentaciones Agregadas</h5>
//               <div class="row">
//                 <div id="container_presentationAdded" class="col-md-12 h_300 v_scrollable">
//                   ${list_saved}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     `;
//     var content_bottom = `
//       <div class="row">
//         <div class="col-lg-12 text-center pt-2">
//           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
//         </div>
//       </div>
//     `;

//     document.getElementById('presentationModal_content').innerHTML = content;
//     document.getElementById('presentationModal_footer').innerHTML = content_bottom;
//     document.getElementById('presentationModal_title').innerHTML = '<h4>Presentaciones del Art&iacute;culo</h4>';
//   }
//   save(btn, presentation_id, article_slug) {
//     cls_general.disable_submit(btn);
//     var url = '/article/presentation/'; var method = 'POST';
//     var body = JSON.stringify({ a: presentation_id, b: article_slug });
//     var funcion = function (obj) {
//       if (obj.status != 'failed') {
//         var raw_presentation = obj.data.presentation;
//         var list_saved = cls_articlepresentation.generate_list_saved(raw_presentation);
//         document.getElementById('container_presentationAdded').innerHTML = list_saved;
//       }else{
//         cls_general.shot_toast_bs(obj.message, {bg: 'text-bg-warning'});
//       }
//     }
//     cls_general.async_laravel_request(url, method, funcion, body);
//   }
//   delete(btn,rel_id){
//     cls_general.disable_submit(btn);
//     var url = '/article/presentation/'+rel_id; var method = 'DELETE';
//     var body = '';
//     var funcion = function (obj) {
//       if (obj.status != 'failed') {
//         var raw_presentation = obj.data.presentation;
//         var list_saved = cls_articlepresentation.generate_list_saved(raw_presentation);
//         document.getElementById('container_presentationAdded').innerHTML = list_saved;
//       } else {
//         cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
//       }
//     }
//     cls_general.async_laravel_request(url, method, funcion, body);
//   }
// }