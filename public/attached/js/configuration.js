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
    var needles = str.split(' ');
    var raw_filtered = [];
    var counter = 0;
    for (var i in haystack) {
      if (counter >= limit) {  break; }
      var ocurrencys = 0;
      for (const a in needles) {
        if (haystack[i]['tx_product_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { 
          ocurrencys++ 
        }else{
          if (haystack[i]['tx_product_reference'] != null && haystack[i]['tx_product_reference'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_product_code'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
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
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6 col-md-12">
            <label for="productCode" class="form-label">C&oacute;digo</label>
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
        <div class="row" style="display: none">
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
              <label for="productCode" class="form-label">C&oacute;digo</label>
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
        cls_product.productlist = raw_list;

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
        cls_product.productlist = raw_list;
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
    this.article_selected;
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
      cls_article.article_selected = {'slug': article_slug, 'id': article.ai_article_id}

      var option_category = '';
      var categoryList = cls_category.category_active
      categoryList.map(x => option_category += (x.ai_category_id === article.article_ai_category_id) ? `<option value="${x.ai_category_id}" selected>${x.tx_category_value}</option>` : `<option value="${x.ai_category_id}">${x.tx_category_value}</option>`);
      
      var checked_promotion = (article.tx_article_promotion == 1) ? 'checked' : '';
      var checked_status = (article.tx_article_status == 1) ? 'checked' : '';
      var raw_option = JSON.parse(article.tx_article_option);
      var option = cls_article.decode_articleoption(raw_option)
      var img = (cls_general.is_empty_var(article['tx_article_thumbnail']) === 1) ? `<img src="attached/image/article/${article['tx_article_thumbnail']}" width="100px"></img>` : `
      <svg width="80px" height="80px" viewBox="0 0 108 108" id="Layeri" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g class="cls-2">
          <g id="Line">
            <path d="M85.5,2h-63a7,7,0,0,0,0,14h.61q2.3,41.22,4.58,82.44a8,8,0,0,0,8,7.56H72.32a8,8,0,0,0,8-7.56Q82.61,57.22,84.89,16h.61a7,7,0,0,0,0-14ZM76.32,98.22a4,4,0,0,1-4,3.78H35.68a4,4,0,0,1-4-3.78L30.56,78H77.44ZM77.67,74H30.33L28.39,39H79.61ZM85.5,12H48v4H80.89L79.83,35H28.17L27.11,16H36V12H22.5a3,3,0,0,1,0-6h63a3,3,0,0,1,0,6Z"/><path d="M24.33,38.11A2,2,0,0,1,24,37a2,2,0,0,1,.22-.91Z"/><path d="M84,37a2,2,0,0,1-.33,1.11l.11-2A2,2,0,0,1,84,37Z"/><path d="M42.66,64.3c0,.11-.08.21-.12.3-2.8-4.3-1.41-11.1,3.52-16,4.32-4.32,10.06-5.92,14.31-4.37a21.45,21.45,0,0,0-2.16,4.55,12.17,12.17,0,0,1-2.15,4.17,12.17,12.17,0,0,1-4.17,2.15A16.17,16.17,0,0,0,46,58.36,16.17,16.17,0,0,0,42.66,64.3Z"/><path d="M60.91,63.42c-4.3,4.3-10,5.9-14.26,4.39.25-.58.48-1.17.69-1.74a12.17,12.17,0,0,1,2.15-4.17,12.17,12.17,0,0,1,4.17-2.15,16.17,16.17,0,0,0,5.94-3.3,16.17,16.17,0,0,0,3.3-5.94,19.87,19.87,0,0,1,1.45-3.26C67.26,51.54,65.9,58.44,60.91,63.42Z"/><rect height="4" rx="2" ry="2" width="4" x="40" y="12"/>
          </g>
        </g>
      </svg>`;

      var content = `
        <form id="form_updatearticle" name="form_updatearticle" method="post" onsubmit="event.preventDefault(); cls_article.update();" autocomplete="off">
          <div class="row">
            <div class="col">
              <div class="row">
                <div class="col-xs-12">
                  <h4>Modificar Art&iacute;culo</h4>
                </div>
              </div>
              <div class="row">
                <div class="col-9">
                  <label for="articleValue" class="form-label">Descripci&oacute;n</label>
                  <input type="text" class="form-control" id="articleValue" name="articleValue" value="${article.tx_article_value}" onfocus="cls_general.validFranz(this.id, ['word','number','symbol'])" onkeyup="cls_general.limitText(this, 100, toast = 0)" onblur="cls_general.limitText(this, 100, toast = 0)">
                  <input type="hidden" class="form-control" id="articleId" name="articleId" value="${article.ai_article_id}">
                </div>
                <div class="col-3">
                  <label for="articleKitchen" class="form-label">Zona</label>
                  <select id="articleKitchen" name="articleKitchen" class="form-select">
                    <option value="0">Cocina</option>
                    <option value="1">Bar</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-4 col-md-12">
                  <label for="articleCode" class="form-label">C&oacute;digo</label>
                  <input type="text" class="form-control" id="articleCode" name="articleCode" value="${article.tx_article_code}" onfocus="cls_general.validFranz(this.id, ['number'],'abcdefghijklmnñopqrstuvwxyzáéíóúABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ')" onkeyup="cls_general.limitText(this, 15, toast = 0)" onkeyup="cls_general.limitText(this, 15, toast = 0)" placeholder="00000000" >
                </div>
                <div class="col-lg-4 col-md-12">
                  <label for="articleCategory" class="form-label">Categor&iacute;a</label>
                  <select id="articleCategory" name="articleCategory" class="form-select"><option value="" disabled selected>Seleccione</option> ${option_category}</select>
                </div>
                <div class="col-lg-2 col-md-12">
                  <div class="form-check form-switch pt_35">
                    <input class="form-check-input" type="checkbox" role="switch" id="articlePromotion" name="articlePromotion" ${checked_promotion}>
                    <label class="form-check-label" for="articlePromotion">Promoci&oacute;n</label>
                  </div>
                </div>
                <div class="col-lg-2 col-md-12">
                  <div class="form-check form-switch pt_35">
                    <input class="form-check-input" type="checkbox" role="switch" id="articleStatus" name="articleStatus" ${checked_status}>
                    <label class="form-check-label" for="articleStatus">Activo</label>
                  </div>
                </div>
              </div>
              <div class="row pb-2">
                <div class="col-sm-12 col-md-6 col-lg-4">
                  <label for="articleTaxrate" class="form-label">% Impuesto</label>
                  <input type="text" class="form-control" id="articleTaxrate" name="articleTaxrate" value="${article.tx_article_taxrate}" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 2, toast = 0)" onkeyup="cls_general.limitText(this, 2, toast = 0)"  >
                </div>
                <div class="col-sm-12 col-md-6 col-lg-4">
                  <label for="articleDiscountrate" class="form-label">% Descuento</label>
                  <input type="text" class="form-control" id="articleDiscountrate" name="articleDiscountrate" value="${article.tx_article_discountrate}" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 2, toast = 0)" onkeyup="cls_general.limitText(this, 2, toast = 0)"  >
                </div>

                
                <div class="col-sm-12 col-md-6 col-lg-4">
                  <label for="articlePoint" class="form-label">Puntos</label>
                  <input type="text" class="form-control" id="articlePoint" name="articlePoint" value="${article.tx_article_point}" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 2, toast = 0)" onkeyup="cls_general.limitText(this, 2, toast = 0)"  >
                </div>
                
                
                <div class="col-sm-12 col-md-6 col-lg-3 d-grid gap-2 pt-3">
                  <button type="button" class="btn btn-info" onclick="cls_article.price('${article_slug}','${article.tx_article_value}')">Precio</button>
                </div>
                <div class="col-sm-12 col-md-6 col-lg-3 d-grid gap-2 pt-3">
                  <button type="button" class="btn btn-info" onclick="cls_article.recipe('${article_slug}','${article.tx_article_value}')">Receta</button>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12 col-lg-3 mb-3 text-center">
                  ${img}
                </div>
                <div class="col-md-12 col-lg-9 mb-3 pt-4">
                  <div class="input-group mb-3">
                    <input type="file" class="form-control" id="articleImage" name="articleImage">
                    <input type="hidden" id="articleImagePlaceholder" name="articleImagePlaceholder" value="${article['tx_article_thumbnail']}">
                  </div>
                </div>
              </div>


              <div class="row">
                <div class="col-lg-12">
                  <label class="form-check-label" for="articleOption">Opciones de Art&iacute;culo</label>
                  <textarea id="articleOption" name="articleOption" cols="82" rows="3" onkeyup="this.value = cls_general.franz_textarea(event,this.value)" placeholder="Ejemplo. coccion:sellada,termino medio,tres cuartos  Debe dejar un reglon para cada opción.">${option}</textarea>
                </div>
              </div>
            </div>
          </div>
      `;
      var content_bottom = `
          <div class="row">
            <div class="col-lg-12 text-center pt-2">
              <button type="button" class="btn btn-warning" onclick="cls_article.delete(this,'${article.tx_article_slug}');">Eliminar Art&iacute;culo</button>
              <button type="button" class="btn btn-secondary" onclick="cls_article.render()">Volver</button>
              <button type="button" class="btn btn-success" name="${article.ai_article_id}" id="btn_articleModal_update" onclick="cls_article.update(this,this.name)">Guardar Artículo</button>
            </div>
          </div>
        </form>
      `;
      document.getElementById('container').innerHTML = content + content_bottom;

      document.getElementById('articleKitchen').value = article.tx_article_kitchen;
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  update(btn,article_id){
    cls_general.disable_submit(btn);
    var description = document.getElementById('articleValue').value;
    var code = document.getElementById('articleCode').value;
    var category = document.getElementById('articleCategory').value;
    var promotion = (document.getElementById('articlePromotion').checked) ? 1 : 0;
    var taxrate = document.getElementById('articleTaxrate').value;
    var discountrate = document.getElementById('articleDiscountrate').value;
    var point = document.getElementById('articlePoint').value;
    var status = (document.getElementById('articleStatus').checked) ? 1 : 0;
    var article_option = document.getElementById('articleOption').value;

    if (cls_general.is_empty_var(code) === 0) {
      cls_general.shot_toast_bs('Ingrese el código.', { bg: 'text-bg-warning' });
      return false;
    }
    if (cls_general.is_empty_var(description) === 0) {
      console.log(description);
      cls_general.shot_toast_bs('Ingrese la descripción.', { bg: 'text-bg-warning' });
      return false;
    }
    if (cls_general.is_empty_var(category) === 0) {
      cls_general.shot_toast_bs('Seleccione la categoría.', { bg: 'text-bg-warning' });
      return false;
    }
    if (cls_general.is_empty_var(taxrate) === 0) {
      cls_general.shot_toast_bs('Ingrese la tasa imponible.', { bg: 'text-bg-warning' });
      return false;
    }
    if (cls_general.is_empty_var(discountrate) === 0) {
      cls_general.shot_toast_bs('Ingrese la tasa de descuento.', { bg: 'text-bg-warning' });
      return false;
    }
    if (cls_general.is_empty_var(point) === 0) {
      cls_general.shot_toast_bs('Ingrese la cantidad de puntos requeridos.', { bg: 'text-bg-warning' });
      return false;
    }
    var option = cls_article.encode_articleoption(article_option);// Verificar la constitucion de options, condicionales debe tener : y al menos 1 coma
    if (option === false) { return false; }
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
            cls_article.run_update(article_id, product_selected);
            break;
          case 'no':
            status = 1;
            cls_article.run_update(article_id, product_selected);
            break;
        }
      });
    }else{
      cls_article.run_update(article_id, description, code, category, promotion, option, status, product_selected, taxrate, discountrate, point);
    }
  }
  run_update() {
    var formData = new FormData($('#form_updatearticle')[0]);
    $.ajax({
      url: '/article_upd/',
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
        cls_article.articleList = obj['data']['all'];
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


    });
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
  recipe(article_slug, article_description){
    var url = '/recipe/' + article_slug + '/article'; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      cls_articleproduct.articleproduct_selected = [];
      
      var table_articleproduct = cls_articleproduct.generate_tablearticleproduct(obj.data.articleproduct);

      var option_presentation = ''; //SELECT DEL PRESENTATION
      obj.data.presentation.map((presentation) => { option_presentation += `<option value="${presentation.ai_presentation_id}">${presentation.tx_presentation_value}</option>`; })
      var content = `
        <div class="row">
          <div class="col-sm-12">
          <h5>Recetas de ${article_description}</h5>
          </div>
          <div class="col-sm-12">
            <div class="row">
              <div class="col-sm-12 col-md-6 col-lg-3">
                <label for="recipePresentation" class="form-label">Presentaci&oacute;n</label>
                <select id="recipePresentation" class="form-select"><option value="" disabled selected>Seleccione</option>${option_presentation}</select>
              </div>
              <div class="col-sm-3 text-center pt-4">
                <button type="button" class="btn btn-outline-primary" onclick="cls_articleproduct.create_ingredient()">Agregar Ingrediente</button>
              </div>
              <div class="col-lg-12">
                <h5>Recetas</h5>
              </div>
              <div id="container_recipe" class="col-lg-12 list-group">

              </div>
              <div class="col-lg-12 text-center pt-1">
                <button type="button" class="btn btn-success" onclick="cls_articleproduct.save(this,'${article_slug}')">Guardar Receta</button>
              </div>
              <hr />
              <div id="container_articleproduct" class="col-lg-12 h_200 v_scrollable">
                ${table_articleproduct}
              </div>

            </div>
          </div>
        </div>
      `;

      var content_bottom = `
        <div class="row">
          <div class="col-lg-12 text-center pt-2">
            <button type="button" class="btn btn-secondary" onclick="cls_article.show('${article_slug}')">Volver</button>
          </div>
        </div>
      `;
      document.getElementById('container').innerHTML = content + content_bottom;
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  price(article_slug,article_description){
    var url = '/price/' + article_slug + '/article'; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      cls_articleproduct.articleproduct_selected = [];

      var table_price = cls_price.generate_tableprice(obj.data.price);
      
      var option_presentation = ''; //SELECT DEL PRESENTATION
      cls_presentation.presentation_list.map((presentation) => { option_presentation += `<option value="${presentation.ai_presentation_id}">${presentation.tx_presentation_value}</option>`; })
      var content = `
        <div class="row">
          <div class="col-sm-12">
          <h5>Precio de ${article_description}</h5>
          </div>
          <div class="col-sm-12">
            <div class="row">
              <div class="col-sm-12 col-md-6 col-lg-3">
                <label for="pricePresentation" class="form-label">Presentaci&oacute;n</label>
                <select id="pricePresentation" class="form-select"><option value="" disabled selected>Seleccione</option>${option_presentation}</select>
              </div>
              <div class="col-sm-12 col-md-6 col-lg-3">
                <label for="priceThree" class="form-label">Standard</label>
                <input type="text" class="form-control" id="priceThree" value="" onfocus="cls_general.validFranz(this.id, ['number'],'.')" onkeyup="cls_general.limitText(this, 10, toast = 0)" onblur="cls_general.limitText(this, 10, toast = 0)">
              </div>
              <div class="col-sm-12 col-md-6 col-lg-3">
                <label for="priceTwo" class="form-label">Precio #2</label>
                <input type="text" class="form-control" id="priceTwo"   value="" onfocus="cls_general.validFranz(this.id, ['number'],'.')" onkeyup="cls_general.limitText(this, 10, toast = 0)" onblur="cls_general.limitText(this, 10, toast = 0)">
              </div>
              <div class="col-sm-12 col-md-6 col-lg-3">
                <label for="priceOne" class="form-label">Precio #1</label>
                <input type="text" class="form-control" id="priceOne"   value="" onfocus="cls_general.validFranz(this.id, ['number'],'.')" onkeyup="cls_general.limitText(this, 10, toast = 0)" onblur="cls_general.limitText(this, 10, toast = 0)">
              </div>
              <div class="col-sm-12 text-center pt-3">
                <button type="button" class="btn btn-success" onclick="cls_price.save(this,'${article_slug}')">Guardar Precio</button>
              </div>
            </div>
            <hr />
            <div class="row">
              <div id="container_articlepricehistory" class="col-lg-12 h_200 v_scrollable">
                ${table_price}
              </div>
            </div>
          </div>
        </div>
      `;

      var content_bottom = `
        <div class="row">
          <div class="col-lg-12 text-center pt-2">
            <button type="button" class="btn btn-secondary" onclick="cls_article.show('${article_slug}')">Volver</button>
          </div>
        </div>
      `;
      document.getElementById('container').innerHTML = content + content_bottom;
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
}
class class_articleproduct{
  constructor(){
    this.articleproduct_selected = [];
    this.articleproduct_ingredient = [];
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
      <button class="btn btn-warning" type="button" onclick="cls_article.erase_product(${product.product_id},${product.article})">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
        </svg>
      </button>
    </li>` ))
    content += '</ul>';
    return content;
  }
  create_ingredient(){
    cls_articleproduct.articleproduct_ingredient = [];
    if (cls_general.is_empty_var(document.getElementById('recipePresentation').value) === 0) {
      cls_general.shot_toast_bs('Debe seleccionar alguna presentaci&oacute;n.', { bg: 'text-bg-warning' }); return false;
    }

    var option_product = ''; //SELECT DEL PRESENTATION
    cls_product.productlist.map((product) => { option_product += `<option value="${product.tx_product_slug}" alt="${product.ai_product_id}">${product.tx_product_value}</option>`; })

    document.getElementById('articleproductModal_title').innerHTML = `Agregar Ingrediente`;
    document.getElementById('articleproductModal_content').innerHTML = `
    <div class="row">
      <div class="col-sm-12 text-center">
        <span>Debe agregar el ingrediente. Seleccione la cantidad, el producto y la medida. En caso de que el ingrediente pueda variar sabores agregar todos los productos que puedan conformar el ingrediente.</span>
      </div>
      <hr/>
      <div class="col-12 col-md-4">
        <label for="recipeQuantity" class="form-label">Cantidad</label>
        <input type="text" class="form-control" id="recipeQuantity" onfocus="cls_general.validFranz(this.id, ['number'],'.')">
      </div>
      <div class="col-12 col-md-4 pt-3">
        <div class="form-check form-switch py-3">
          <input class="form-check-input" type="checkbox" role="switch" id="recipeTogo">
          <label class="form-check-label" for="recipeTogo">Para llevar</label>
        </div>
      </div>
      <div class="col-4 col-md-4">
        <label for="recipeProduct" class="form-label">Producto</label>
        <select name="recipeProduct" id="recipeProduct" class="form-select" onchange="cls_articleproduct.set_recipemeasure(this.value)"><option value='' disabled selected>Seleccione</option>${option_product}</select>
      </div>
      <div id="container_recipemeasure" class="col-12 col-md-4">
      </div>
      <div id="container_recipewarehouse" class="col-12 col-md-4">
      </div>
      <div class="col-sm-12 text-center pt-1">
        <button type="button" class="btn btn-primary" onclick="cls_articleproduct.add_ingredient()">Aceptar</button>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <span>Productos Seleccionados</span>
      </div>
      <div id="container_productselected" class="col-sm-12 list-group">
      </div>
    </div>

    `;
    document.getElementById('articleproductModal_footer').innerHTML = `    
      <div class="col-sm-12 pt-1 text-end">
        <button type="button" class="btn btn-success" onclick="cls_articleproduct.add_articleproduct()">Agregar Ingrediente</button>
      </div>
    `


    const modal = new bootstrap.Modal('#articleproductModal', {})
    modal.show();

    setTimeout(() => {
      document.getElementById('recipeQuantity').focus();
    }, 800);
  }
  set_recipemeasure(product_slug){
    var url = '/product/' + product_slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var option_measure = ''; //SELECT DEL PRESENTATION
        obj.data.measure_list.map((measure) => { option_measure += `<option value="${measure.ai_measure_id}">${measure.tx_measure_value}</option>`; })

        document.getElementById('container_recipemeasure').innerHTML = `
          <label for="recipeMeasure" class="form-label">Medida</label>
          <select name="recipeMeasure" id="recipeMeasure" class="form-select">${option_measure}</select>
        `;

        var option_warehouse = ''; //SELECT DE LA BODEGA
        obj.data.warehouse.map((depot) => { option_warehouse += `<option value="${depot.ai_warehouse_id}">${depot.tx_warehouse_value}</option>`; })
        document.getElementById('container_recipewarehouse').innerHTML = `
          <label for="recipeWarehouse" class="form-label">Bodega</label>
          <select name="recipeWarehouse" id="recipeWarehouse" class="form-select">${option_warehouse}</select>
        `;


      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  add_ingredient(){
    var quantity = document.getElementById('recipeQuantity').value;
    var product = document.getElementById("recipeProduct");
    var measure = document.getElementById("recipeMeasure");
    var warehouse = document.getElementById("recipeWarehouse");
    var togo = (document.getElementById('recipeTogo').checked === true) ? 1 : 0;

    if (cls_general.is_empty_var(quantity) === 0 || cls_general.is_empty_var(product.value) === 0 || cls_general.is_empty_var(measure.value) === 0) {
      cls_general.shot_toast_bs('Faltan datos', { bg: 'text-bg-warning' }); return false;
    }
    cls_articleproduct.articleproduct_ingredient.push({
      product_id: product.options[product.selectedIndex].getAttribute('alt'),
      product_value: product.options[product.selectedIndex].text,
      measure_id: measure.value,
      measure_value: measure.options[measure.selectedIndex].text,
      warehouse: warehouse.value,
      warehouse_value: warehouse.options[measure.selectedIndex].text,
      quantity: quantity,
      to_go: togo
    });
    cls_general.shot_toast_bs('Producto agregado.')
    cls_articleproduct.render_ingredient();
  }
  render_ingredient(){
    var content = '';
    cls_articleproduct.articleproduct_ingredient.map((ingredient,index)=> {
      content += `
      <li class="list-group-item d-flex justify-content-between align-items-center" >
        ${ingredient.quantity} - ${ingredient.product_value} (${ingredient.measure_value}) en ${ingredient.warehouse_value}
        <button class="btn btn-warning" type="button" onclick="cls_articleproduct.delete_ingredient(${index})">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
          </svg>
        </button>
      </li >`;
    })
    content += '</ul>';
    document.getElementById('container_productselected').innerHTML = content;
  }
  delete_ingredient(index) {
    cls_articleproduct.articleproduct_ingredient.splice(index, 1);
    cls_articleproduct.render_ingredient();
  }


  add_articleproduct(){
    if (cls_articleproduct.articleproduct_ingredient.length === 0) {
      cls_general.shot_toast_bs('Debe ingresar algún ingrediente', {bg: 'text-bg-warning'}); return false;
    }
    cls_articleproduct.articleproduct_selected.push(cls_articleproduct.articleproduct_ingredient);
    cls_articleproduct.articleproduct_ingredient = [];
    cls_articleproduct.render_articleproduct();
  }
  render_articleproduct(){
    var content = '';
    cls_articleproduct.articleproduct_selected.map((articleproduct,index) => {
      var togo = (cls_general.is_empty_var(articleproduct[0].to_go) === 0 || articleproduct[0].to_go === 0) ? '' : '(Para Llevar)';
      content += (articleproduct.length === 1) ? `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${articleproduct[0].quantity} (${articleproduct[0].measure_value}) - ${articleproduct[0].product_value} en ${articleproduct[0].warehouse_value}  ${togo}
        <button class="btn btn-warning" type="button" onclick="cls_articleproduct.delete_selected(${index})">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
          </svg>
        </button>
      </li >
      ` : `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${articleproduct.map((product) => { return `${product.quantity} (${product.measure_value}) - ${product.product_value} en ${product.warehouse_value}` })}   ${togo}
        <button class="btn btn-warning" type="button" onclick="cls_articleproduct.delete_selected(${index})">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
          </svg>
        </button>
      </li>`;
    })
    content += '';
    document.getElementById('container_recipe').innerHTML = content;

    const modal = bootstrap.Modal.getInstance('#articleproductModal');
    if (modal) {
      modal.hide();
    }
  }
  delete_selected(index){
    cls_articleproduct.articleproduct_selected.splice(index,1);
    cls_articleproduct.render_articleproduct();
  }
  save(btn, article_slug) {
    cls_general.disable_submit(btn);
    var presentation_id = document.getElementById('recipePresentation').value;
    if (cls_articleproduct.articleproduct_selected.length === 0) {
      cls_general.shot_toast_bs('Debe ingresar la receta del artículo.', { bg: 'text-bg-warning' }); return false;
    }

    if (cls_general.is_empty_var(presentation_id) === 0) {
      cls_general.shot_toast_bs('Debe seleccionar la presentaci&oacute;n.', { bg: 'text-bg-warning' }); return false;
    }

    var url = '/articleproduct/';
    var method = 'POST';
    var body = JSON.stringify({ a: cls_articleproduct.articleproduct_selected, b: article_slug, c: presentation_id });
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        document.getElementById('container_articleproduct').innerHTML = cls_articleproduct.generate_tablearticleproduct(obj.data.articleproduct);

        cls_articleproduct.articleproduct_selected = [];
        cls_articleproduct.articleproduct_ingredient = [];
        cls_articleproduct.render_articleproduct();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_tablearticleproduct(raw_list){
    var tbody_price = '';
    var check_presentation = 0;
    raw_list.map((articleproduct) => {
      var date = cls_general.datetime_converter(articleproduct.created_at);

      if (check_presentation != articleproduct.articleproduct_ai_presentation_id) {
        tbody_price += `
          <tr class="text-bg-secondary cursor_pointer" onclick="cls_articleproduct.edit('${articleproduct.tx_article_slug}',${articleproduct.articleproduct_ai_presentation_id})">
            <td colspan="2">${articleproduct.tx_presentation_value} (${date})</td>
          </tr>
        `;
      }
      var ingredient = JSON.parse(articleproduct.tx_articleproduct_ingredient);
      var togo = '';
      tbody_price += `
      <tr>
        <td></td>
        <td>`;
      ingredient.map((product) => {
        togo = (cls_general.is_empty_var(product.to_go) === 0 || product.to_go === 0) ? '' : '(Para Llevar)';
        tbody_price += `
        ${product.quantity} (${product.measure_value}) ${product.product_value}, ` ;
      })
      tbody_price += `${togo}
        </td>
      </tr>`;
      check_presentation = articleproduct.articleproduct_ai_presentation_id;
    })
    var content = `
    <caption>Listado de Recetas</caption>
    <table class="table">
      <tbody>
        ${tbody_price}
      </tbody>
    </table>`;
    return content;
  }
  edit(article_slug,presentation_id) {
    var url = `/recipe/${presentation_id}/${article_slug}`;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_articleproduct.articleproduct_selected = [];
        obj.data.recipe.map((rec) => {
          var ingredient = JSON.parse(rec.tx_articleproduct_ingredient);
          cls_articleproduct.articleproduct_selected.push(ingredient);
        })
        cls_articleproduct.render_articleproduct();
        document.getElementById('recipePresentation').value = presentation_id;
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
}
class class_price{
  generate_tableprice(raw_price){
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
      tbody_price += `
        <tr class="${bg}">  <td>${date}(${price.tx_presentation_value})</td>  <td>B/${price.tx_price_three.toFixed(2)}</td> <td>B/${pTwo.toFixed(2)}</td> <td>B/${pOne.toFixed(2)}</td>
          <td>
            <button class="btn btn-warning" type="button" onclick="cls_price.delete(this,${price.ai_price_id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
            </svg>
            </button>
          
          </td>
        </tr>`;
    })
    var content = `
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
    `;
    return content;
  }
  save(btn,article_slug){
    cls_general.disable_submit(btn);
    var pOne = document.getElementById('priceOne').value;
    var pTwo = document.getElementById('priceTwo').value;
    var pThree = document.getElementById('priceThree').value;
    var presentation_id = document.getElementById('pricePresentation').value;

    if (cls_general.is_empty_var(presentation_id) === 0) {
      cls_general.shot_toast_bs('Debe seleccionar la presentaci&oacute;n.', { bg: 'text-bg-warning' }); return false;
    }
    if (cls_general.is_empty_var(pThree) === 0) {
      cls_general.shot_toast_bs('Debe ingresar el precio standard.', { bg: 'text-bg-warning' }); return false;
    }
    var url = '/price/'; 
    var method = 'POST';
    var body = JSON.stringify({ a: pOne, b: pTwo, c: pThree, e: article_slug, f: presentation_id, g: cls_articleproduct.articleproduct_selected });
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        var raw_price = obj.data.price;
        document.getElementById('container_articlepricehistory').innerHTML = cls_price.generate_tableprice(raw_price);

        document.getElementById('priceOne').value = '';
        document.getElementById('priceTwo').value = '';
        document.getElementById('priceThree').value = '';

        cls_articleproduct.articleproduct_selected = [];
        cls_articleproduct.render_articleproduct();
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
        document.getElementById('container_articlepricehistory').innerHTML = cls_price.generate_tableprice(raw_price);
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
class class_client {
  constructor (list){
    this.client_list = [];
  }
  render() {
    var url = '/client'; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      cls_client.client_list = obj['data']['all'];
      var client_list = obj['data']['all'];

      var list = cls_client.generate_list(client_list,100)
      var content = `
        <div class="row">
          <div class="col-xs-12 py-2 text-center">
            <button type="button" class="btn btn-lg btn-primary" onclick="cls_client.create()">Crear Cliente</button>
            &nbsp;
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
      document.getElementById('container').innerHTML = content;
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_list(client_list,limit) {
    var counter = 1;
    var list = '<div class="list-group">';
    for (const a in client_list) {
      if (counter > limit) {  break;  }
      var bg = (client_list[a]['tx_client_status'] == '0') ? 'text-bg-secondary' : '';
      var inactive = (client_list[a]['tx_client_status'] == '0') ? ' (INACTIVO)' : '';

      list += `<a href = "#" class="list-group-item list-group-item-action ${bg}" onclick="event.preventDefault(); cls_client.show('${client_list[a]['tx_client_slug']}')" >${client_list[a]['tx_client_name']} (${client_list[a]['tx_client_cif']}) ${inactive}</a>`;
      counter++;
    }
    list += '</div>';
    return list;
  }
  async filter(str,limit) {
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
          var ocurrencys = 0;
          for (const a in needles) {
            if (haystack[i]['tx_client_name'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_client_cif'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
          }
          if (ocurrencys === needles.length) {
            raw_filtered.push(haystack[i]);
            if (raw_filtered.length == limit) { break; }
          }
        }
        resolve(raw_filtered)
      }, 500)
    });
  }
  show(client_slug){
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
      var birthday = (cls_general.is_empty_var(client.tx_client_birthday) === 0) ? '' : client.tx_client_birthday;
      
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
                <input type="text" id="clientName" name="${client.tx_client_slug}" class="form-control" onfocus="cls_general.validFranz(this.id, ['number','word','punctuation'])" onkeyup="cls_general.limitText(this,120,1)" onblur="cls_general.limitText(this,120,1)" value="${client.tx_client_name}">
              </div>
              <div class="col-md-12 col-lg-6">
                <label for="clientCIF" class="form-label">C&eacute;dula/Pasaporte</label>
                <input type="text" id="clientCIF" class="form-control" onfocus="cls_general.validFranz(this.id, ['number','word'],'-')" onkeyup="cls_general.limitText(this,20,1)" onblur="cls_general.limitText(this,20,1)" value="${client.tx_client_cif}">
              </div>
              <div class="col-md-12 col-lg-2">
                <label for="clientDV" class="form-label">DV</label>
                <input type="text" id="clientDV" class="form-control" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this,4,1)" onblur="cls_general.limitText(this,4,1)" value="${dv}">
              </div>
              <div class="col-md-12 col-lg-4">
                <label for="clientTelephone" class="form-label">Teléfono</label>
                <input type="text" id="clientTelephone" class="form-control" onfocus="cls_general.validFranz(this.id, ['number'],' -')" onkeyup="cls_general.limitText(this,20,1)" onblur="cls_general.limitText(this,20,1)" value="${telephone}">
              </div>
              <div class="col-12 col-lg-4">
                <label for="clientEmail" class="form-label">Correo E.</label>
                <input type="email" id="clientEmail" class="form-control" onfocus="cls_general.validFranz(this.id, ['number','word','punctuation'],'_-@')" onkeyup="cls_general.limitText(this,50,1)" onblur="cls_general.limitText(this,50,1)" value="${email}">
              </div>
              <div class="col-12 col-lg-4">
                <label for="clientBirthday" class="form-label">F. Nacimiento</label>
                <input type="email" id="clientBirthday" class="form-control" value="${cls_general.datetime_converter(birthday)}" readonly>
              </div>
              <div class="col-12 col-lg-4">
                <label for="clientPoint" class="form-label">Puntos Acumulados</label>
                <input type="email" id="clientPoint" class="form-control" value="${client.tx_client_point}" readonly>
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
          </div>
        </div>
      `;
      var content_bottom = `
        <div class="row">
          <div class="col-lg-12 text-center pt-2">
            <button type="button" class="btn btn-warning" onclick="cls_general.disable_submit(this); cls_client.delete('${client.tx_client_slug}');">Eliminar Cliente</button>
            <button type="button" class="btn btn-secondary" onclick="cls_client.render()">Volver</button>
            <button type="button" class="btn btn-success" onclick="cls_general.disable_submit(this); cls_client.update('${client.tx_client_slug}')">Guardar Cliente</button>
            <button type="button" class="btn btn-info" onclick="cls_general.disable_submit(this); cls_client.show_purchase('${client.tx_client_slug}')">Mostrar Compras</button>
          </div>
          <div class="col-12" id="div_purchase">adsda</div>
        </div>
      `;
      document.getElementById('container').innerHTML = content + content_bottom;
      document.getElementById('clientTaxpayer').value = client.tx_client_taxpayer + '' +client.tx_client_type;
      $(function () {
        $("#clientBirthday").datepicker({
          defaultDate: '-20y',
          changeYear: true,
          changeMonth: true
        });
      });

    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  create(){
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
            <div class="col-md-12 col-lg-6">
              <label for="clientBirthday" class="form-label">F. Nacimiento</label>
              <input type="email" id="clientBirthday" class="form-control" readonly>
            </div>
            <div class="col-md-12">
              <label for="clientDirection" class="form-label">Dirección</label>
              <input type="text" id="clientDirection" class="form-control" onfocus="cls_general.validFranz(this.id, ['number','word','punctuation'])" onkeyup="cls_general.limitText(this,140,1)" onblur="cls_general.limitText(this,140,1)" value="">
            </div>
            <div class="col-md-12 col-lg-3">
              <div class="form-check form-switch pt_35">
                <input class="form-check-input" type="checkbox" role="switch" id="clientExempt">
                <label class="form-check-label" for="clientExempt">Exento</label>
              </div>
            </div>
            <div class="col-md-12 col-lg-3">
              <div class="form-check form-switch pt_35">
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
            <button type="button" class="btn btn-secondary" onclick="cls_client.render()">Volver</button>
            <button type="button" class="btn btn-success" onclick="cls_general.disable_submit(this); cls_client.save()">Guardar Cliente</button>
          </div>
        </div>
      `;
    document.getElementById('container').innerHTML = content + content_bottom;
    $(function () {
      $("#clientBirthday").datepicker({
        defaultDate: '-20y',
        changeYear: true,
        changeMonth: true
      });
    });

  }
  save() {
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
    var body = JSON.stringify({ a: name, b: cif, c: dv, d: telephone, e: email, f: direction, g: exempt, h: taxpayer, i: status, j: birthday });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_client.render()
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  update(client_slug){
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
    var body = JSON.stringify({ a: name, b: cif, c: dv, d: telephone, e: email, f: direction, g: exempt, h: taxpayer, i: status, j: birthday });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_client.render()
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
  delete(client_slug){
    var url = '/client/' + client_slug; var method = 'DELETE';
    var body = "";
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_client.render()
        cls_general.shot_toast_bs(obj['message'], { bg: 'text-bg-success' });
      }else{
        cls_general.shot_toast_bs(obj['message'], { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  show_purchase(client_slug){
    var url = '/client/' + client_slug + '/purchase'; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('div_purchase').innerHTML = cls_client.generate_purchaselist(obj.data.purchaselist)
      } else {
        cls_general.shot_toast_bs(obj['message'], { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_purchaselist(data){
    var total = 0;
    var raw_article = [];
    data.map((line) => {
      total += line.tx_commanddata_price;
      var check = raw_article.findIndex((article) => { return article.commanddata_ai_article_id === line.commanddata_ai_article_id })
      if (check === -1) {
        raw_article.push(line);
      }else{
        raw_article[check]['tx_commanddata_quantity'] += line.tx_commanddata_quantity;
      }
    })
    
    var list = '<div class="list-group">';
    raw_article.map((line) => {
      list += `<a href = "#" class="list-group-item list-group-item-action">${line.tx_commanddata_quantity} ${line.tx_commanddata_description} (B/. ${line.tx_commanddata_price.toFixed(2)})</a>`;
    })
    list += '</div>';
    

    var content = `
    <div class="row">
      <div class="col-2 pb-3">
        <label for="" class="form-label">Total Vendido</label>
        <input type="text" id="clientEmail" class="form-control" value="B/. ${total.toFixed(2)}">
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <span>Listado de Compras</span>
        ${list}
      </div>
    </div>
    `
    return content;
  }
}
class class_payment {
  constructor(method) {
    this.payment_method = method;
    this.payment = [];
  }
  add(method) {
    let number = document.getElementById('paymentNumber').value;
    let amount = parseFloat(document.getElementById('paymentAmount').value);

    var check_method = cls_payment.payment_method.find((pmethod) => { return pmethod.ai_paymentmethod_id === method })
    if (cls_general.is_empty_var(amount) === 0) {
      cls_general.shot_toast_bs('Ingrese el monto.', { bg: 'text-bg-warning' }); return false;
    }
    if (cls_general.is_empty_var(check_method) === 0) {
      cls_general.shot_toast_bs('M&eacute;todo erroneo.', { bg: 'text-bg-warning' }); return false;
    }
    if (isNaN(amount)) {
      cls_general.shot_toast_bs('Monto erroneo.', { bg: 'text-bg-warning' }); return false;
    }    
    var taked_id = []; var taked_amount = 0;
    cls_payment.payment.map((pay, index) => { if (pay.method_id === method) { taked_id.push(index); taked_amount = parseFloat(pay.amount) } })
    if (taked_id.length > 0) {
      cls_payment.payment.splice(taked_id, 1, { method_id: method, method_name: check_method.tx_paymentmethod_value, number: number, amount: parseFloat(amount) + taked_amount })
    } else {
      cls_payment.payment.push({ method_id: method, method_name: check_method.tx_paymentmethod_value, number: number, amount: amount });
    }
    cls_payment.render();
  }
  render() {
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
  generate_payment_list(raw_payment) {
    var payment_list = '';
    let received = 0;
    raw_payment.map((payment, index) => {
      var number = (cls_general.is_empty_var(payment.number) === 0) ? '' : '(' + payment.number + ')';
      payment_list += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${cls_general.val_price(payment.amount, 2, 1, 1)} ${number} ${payment.method_name}
          <button class="btn btn-warning" type="button" onclick="cls_payment.erase(${index})">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
            </svg>
          </button>
        </li>
      `
      received += parseFloat(payment.amount);
    })
    var content = `
      <div class="col-sm-4">
        <div class="row border-end mhp_100">
          <div class="col-sm-12 text-success bs_1 border_gray">
            <span class="font_bolder">Recibido</span><br/>
            <span class="fs_20">B/ ${cls_general.val_price(received, 2, 1, 1)}</span>
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
  erase(i) {
    cls_payment.payment.splice(i, 1);
    cls_payment.render();
  }
}
class class_role{
  constructor(raw_role) {
    this.role_list = raw_role.all;
    this.role_active = raw_role.active;
    this.role_inactive = raw_role.inactive;
  }
  render (){
    var content = `
      <div class="row">
        <div class="col-12">
          <h5>Listado de Roles</h5>
        </div>
        <div id="container_list_rolemodal" class="col-12"></div>
      </div>
    `;
    document.getElementById('roleModal_content').innerHTML = content;

    document.getElementById('container_list_rolemodal').innerHTML = cls_role.generate_list(cls_role.role_list);
    const modal = new bootstrap.Modal('#roleModal', {})
    modal.show();
  }
  generate_list(raw_list) {
    var list = '<div class="list-group">';
    for (const a in raw_list) {
      var bg = (raw_list[a]['status'] === 0) ? 'text-bg-secondary' : '';
      list += `<a href = "#" class="list-group-item list-group-item-action ${bg}" onclick="event.preventDefault(); cls_role.show(${raw_list[a]['id']})" >${raw_list[a]['description']}</a>`;
    }
    list += '</div>';
    return list;
  }
  create() {
    var content = `
      <div class="row">
        <div class="col-12">
          <label for="roleValue" class="form-label">Descripci&oacute;n</label>
          <input type="text" class="form-control" id="roleValue" onfocus="cls_general.validFranz(this.id, ['word'])" onkeyup="cls_general.limitText(this, 20, toast = 0)" onblur="cls_general.limitText(this, 20, toast = 0)">
        </div>
        <div class="col-12 py-3 text-center">
          <button type="button" class="btn btn-success" onclick="cls_general.disable_submit(this); cls_role.save()">Guardar</button>
        </div>
      </div>
    `;
    document.getElementById('roleModal_content').innerHTML = content;
    document.getElementById('roleModal_title').innerHTML = '<h4>Crear Rol</h4>';
  }
  save() {
    var str = document.getElementById('roleValue').value;

    if (cls_general.is_empty_var(str) === 0) {
      cls_general.shot_toast_bs("Debe ingresar la información.", { bg: 'text-bg-warning' }); return false;
    }
    if (!/^[a-zA-Z]+$/.test(str)) {
      cls_general.shot_toast_bs("Debe ingresar solo letras.", { bg: 'text-bg-warning' }); return false;
    }
    var url = '/role/';
    var method = 'POST';
    var body = JSON.stringify({ a: str });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_role.role_list = obj.data.list.all;
        cls_role.role_active = obj.data.list.active;
        cls_role.role_inactive = obj.data.list.inactive;

        var content = `
          <div class="row">
            <div class="col-12">
              <h5>Listado de Roles</h5>
            </div>
            <div id="container_list_rolemodal" class="col-12"></div>
          </div>
        `;
        document.getElementById('roleModal_content').innerHTML = content;
        document.getElementById('container_list_rolemodal').innerHTML = cls_role.generate_list(cls_role.role_list);
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  show(role_id) {
    var url = '/role/' + role_id; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var content = `
          <div class="row">
            <div class="col-12">
              <label for="roleValue" class="form-label">Descripci&oacute;n</label>
              <input type="text" class="form-control" id="roleValue" onfocus="cls_general.validFranz(this.id, ['word'])" onkeyup="cls_general.limitText(this, 20, toast = 0)" onblur="cls_general.limitText(this, 20, toast = 0)" value="${obj.data.info.description}">
            </div>
            <div class="col-12 py-3 text-center">
              <button type="button" class="btn btn-success" onclick="cls_general.disable_submit(this); cls_role.update(${role_id})">Guardar</button>
              &nbsp;&nbsp;
              <button type="button" class="btn btn-warning" onclick="cls_general.disable_submit(this); cls_role.delete(${role_id})">Eliminar</button>
            </div>
          </div>
        `;
        document.getElementById('roleModal_content').innerHTML = content;
        document.getElementById('roleModal_title').innerHTML = '<h4>Modificar Rol</h4>';
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  update(role_id) {
    var str = document.getElementById('roleValue').value;

    if (cls_general.is_empty_var(str) === 0) {
      cls_general.shot_toast_bs("Debe ingresar la información.", { bg: 'text-bg-warning' }); return false;
    }
    if (!/^[a-zA-Z]+$/.test(str)) {
      cls_general.shot_toast_bs("Debe ingresar solo letras.", { bg: 'text-bg-warning' }); return false;
    }
    var url = '/role/' + role_id;
    var method = 'PUT';
    var body = JSON.stringify({ a: str });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_role.role_list = obj.data.list.all;
        cls_role.role_active = obj.data.list.active;
        cls_role.role_inactive = obj.data.list.inactive;

        var content = `
          <div class="row">
            <div class="col-12">
              <h5>Listado de Roles</h5>
            </div>
            <div id="container_list_rolemodal" class="col-12"></div>
          </div>
        `;
        document.getElementById('roleModal_content').innerHTML = content;
        document.getElementById('container_list_rolemodal').innerHTML = cls_role.generate_list(cls_role.role_list);
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  delete(role_id) {
    var url = '/role/' + role_id; var method = 'DELETE';
    var body = "";
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_role.role_list = obj.data.list.all;
        cls_role.role_active = obj.data.list.active;
        cls_role.role_inactive = obj.data.list.inactive;

        var content = `
          <div class="row">
            <div class="col-12">
              <h5>Listado de Roles</h5>
            </div>
            <div id="container_list_rolemodal" class="col-12"></div>
          </div>
        `;
        document.getElementById('roleModal_content').innerHTML = content;
        document.getElementById('container_list_rolemodal').innerHTML = cls_role.generate_list(cls_role.role_list);
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

}
class class_user {
  constructor (){
    this.info = [];
  }
  render() {
    var url = '/user'; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      var raw_list = obj['data']['all'];

      var list = cls_user.generate_list(raw_list)
      var content = `
        <div class="row">
          <div class="col-xs-12 py-2 text-center">
            <button type="button" class="btn btn-lg btn-primary" onclick="cls_user.create()">Crear Usuario</button>
            &nbsp;&nbsp;
            <button type="button" class="btn btn-lg btn-info" onclick="cls_role.render()">Roles</button>
          </div>
          <div class="col-xs-12">
            <h5>Listado de Usuarios</h5>
          </div>
          <div class="col-xs-12">
            <input type="text" class="form-control" onfocus="cls_general.validFranz(this.id, ['word','number','symbol'])" onkeyup="cls_user.filter(this.value,20)" placeholder="Buscar por nombre" >
          </div>
          <div id="container_userList" class="col-xs-12 border-top">
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
      var bg = (raw_list[a]['status'] === 0) ? 'text-bg-secondary' : '';
      list += `<a href = "#" class="list-group-item list-group-item-action ${bg}" onclick="event.preventDefault(); cls_user.show('${raw_list[a]['id']}')" >${raw_list[a]['name']}</a>`;
    }
    list += '</div>';
    return list;
  }
  create() {
    var option_role = '';
    var role_list = cls_role.role_active
    role_list.map(x => option_role += `<option value="${x.id}">${x.description} </option>`)
    var content = `
        <div class="row">
          <div class="col-6 col-sm-6">
            <label for="userName" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="userName" onfocus="cls_general.validFranz(this.id, ['word','number'])" onkeyup="cls_general.limitText(this, 100, toast = 0)" onblur="cls_general.limitText(this, 100, toast = 0)">
          </div>
          <div class="col-12 col-sm-6">
            <label for="userEmail" class="form-label">E-Mail</label>
            <input type="text" class="form-control" id="userEmail" value="" onfocus="cls_general.validFranz(this.id, ['number','symbol','punctuation'],'abcdefghijklmnñopqrstuvwxyzáéíóúABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ')" onkeyup="cls_general.limitText(this, 100, toast = 0)" onkeyup="cls_general.limitText(this, 100, toast = 0)" placeholder="ejemplo@mail.com" onblur="cls_general.checkEmail(this);" >
          </div>
          <div class="col-12  col-sm-6">
            <label for="userPassword1" class="form-label">Contrase&ntilde;a</label>
            <input type="password" class="form-control" id="userPassword1" value="">
          </div>
          <div class="col-12  col-sm-6">
            <label for="userPassword2" class="form-label">Repetir Contrase&ntilde;a</label>
            <input type="password" class="form-control" id="userPassword2" value="">
          </div>
          <div class="col-12  col-sm-6">
            <label for="userRole" class="form-label">Rol</label>
            <select id="userRole" class="form-select">
              ${option_role}
            </select>
          </div>
          <div class="col-12  col-sm-6">
            <label for="userLogincode" class="form-label">Tarjeta</label>
            <input type="password" class="form-control" id="userLogincode" value="">
          </div>

        </div>
      `;
    var content_bottom = `          
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      <button type="button" class="btn btn-success" id="btn_userModal" onclick="cls_user.save()">Crear Usuario</button>
    `;

    document.getElementById('userModal_content').innerHTML = content;
    document.getElementById('userModal_footer').innerHTML = content_bottom;
    document.getElementById('userModal_title').innerHTML = '<h4>Crear Usuario</h4>';

    const modalUser = new bootstrap.Modal('#userModal', {})
    modalUser.show();

  }
  save() {

    var name = document.getElementById('userName').value;
    var email = document.getElementById('userEmail').value;
    var pass1 = document.getElementById('userPassword1').value;
    var pass2 = document.getElementById('userPassword2').value;
    var role = document.getElementById('userRole').value;
    var logincode = document.getElementById('userLogincode').value;

    if (cls_general.is_empty_var(name) === 0 || cls_general.is_empty_var(email) === 0 || cls_general.is_empty_var(pass1) === 0 || cls_general.is_empty_var(pass2) === 0 || cls_general.is_empty_var(role) === 0) {
      cls_general.shot_toast_bs("Debe ingresar todos los campos.", { bg: 'text-bg-warning' }); return false;
    }
    if (!cls_general.isEmail(email)) {
      cls_general.shot_toast_bs("Debe ingresar un correo valido.", { bg: 'text-bg-warning' }); return false;
    }
    if (pass1 != pass2) {
      cls_general.shot_toast_bs("Debe repetir la contrase&ntilde;a.", { bg: 'text-bg-warning' }); return false;
    }
    
    if (cls_general.is_empty_var(logincode) === 0 || logincode.length != 10) {
      cls_general.shot_toast_bs("Debe un codigo de acceso valido.", { bg: 'text-bg-warning' }); return false;
    }
    var url = '/user/';
    var method = 'POST';
    var body = JSON.stringify({ a: name, b: email, c: pass1, d: role, e: logincode  });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_user.render();
        const modal_win = bootstrap.Modal.getInstance('#userModal');
        modal_win.hide();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  show(user_id) {
    var url = '/user/' + user_id; var method = 'GET';
    var body = "";
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_user.info = obj['data']['info'];
        cls_user.render_modal();

        const modalProduct = new bootstrap.Modal('#userModal')
        modalProduct.show();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_rolelist(raw_role) {
    var content_role = '<ul class="list-group">';
    raw_role.map((role) => {
      content_role += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${role.description}
          <button class="btn btn-sm btn-danger" onclick="cls_user.delete_role(this, ${role.user_id},${role.role_id})">X</button>
        </li>

      
`;
    })
    return content_role += '</ul>';
  }
  render_modal() {
    var user_info = cls_user.info;
    var option_role = '';
    cls_role.role_list.map((role) => {
      option_role += `<option value="${role.id}">${role.description}</option>`;
    })
    var checked = (user_info.data.status === 1) ? 'checked' : '';
    var content_role = cls_user.generate_rolelist(user_info.role);

    var option_role = '';
    var role_list = cls_role.role_active
    role_list.map(x => option_role += `<option value="${x.id}">${x.description} </option>`)

    var logincode = (cls_general.is_empty_var(user_info.data.logincode) === 1) ? user_info.data.logincode : '';
    var content = `
      <div class="row">
        <div class="col-sm-12">
          <div class="row">
            <div class="col-sm-6">
              <label for="userName" class="form-label">Nombre</label>
              <input type="text" class="form-control" id="userName" onfocus="cls_general.validFranz(this.id, ['word','number'])" onkeyup="cls_general.limitText(this, 100, toast = 0)" onblur="cls_general.limitText(this, 100, toast = 0)" value="${user_info.data.name}">
            </div>
            <div class="col-sm-6">
              <label for="userEmail" class="form-label">Correo E.</label>
              <input type="text" class="form-control" id="userEmail" value="${user_info.data.email}" onfocus="cls_general.validFranz(this.id, ['word','number'])" onkeyup="cls_general.limitText(this, 150, toast = 0)" onblur="cls_general.limitText(this, 150, toast = 0)">
            </div>
            <div class="col-sm-6">
              <div class="form-check form-switch py-3">
                <input class="form-check-input" type="checkbox" role="switch" id="userStatus" ${checked}>
                <label class="form-check-label" for="userStatus">Activo</label>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-4">
              <label for="userPasswordF" class="form-label">Contrase&ntilde;a</label>
              <input type="text" class="form-control" id="userPasswordF" value="">
            </div>
            <div class="col-sm-4">
              <label for="userPasswordS" class="form-label">Repetir Contrase&ntilde;a</label>
              <input type="text" class="form-control" id="userPasswordS" value="">
            </div>
            <div class="col-sm-4">
              <label for="userLogincode" class="form-label">C&oacute;digo</label>
              <input type="text" class="form-control" id="userLogincode" placeholder="${logincode}" onkeyup="cls_general.limitText(this, 10, toast = 0)">
            </div>
            <div class="col-12 pt-2 text-center">
              <button type="button" class="btn btn-primary" id="upd_password">Cambiar Contrase&ntilde;a</button>              
            </div>
          </div>
        </div>
        <hr/>
        <div class="col-sm-12">
          <div class="input-group">
            <select class="form-select" id="roleUser">
              ${option_role}
            </select>
            <button class="btn btn-outline-success" type="button" onclick="cls_user.add_role(this,${user_info.data.id})">Agregar</button>
          </div>
        </div>

        <div class="col-sm-12">
          <span>Listado de Roles</span>
          <div class="row">
            <div id="container_userRoleList" class="col-sm-12">
              ${content_role}
            </div>
          </div>
        </div>
      </div>
    `;

    var content_bottom = `          
      <div class="row">
        <div class="col-lg-12 text-center">
          <button type="button" class="btn btn-warning" data-bs-dismiss="modal" onclick="cls_user.delete(this,${user_info.data.id});">Eiminar Usuario</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-success" onclick="cls_user.update(this,${user_info.data.id})">Guardar Cambios</button>
        </div>
      </div>
    `;
    document.getElementById('userModal_title').innerHTML = 'Informaci&oacute;n de ' + user_info.data.name;
    document.getElementById('userModal_content').innerHTML = content;
    document.getElementById('userModal_footer').innerHTML = content_bottom;

    document.getElementById('upd_password').addEventListener('click', () => { cls_user.update_password(document.getElementById('upd_password'), user_info.data.id);  });
  }
  update(btn, user_id) {
    cls_general.disable_submit(btn);

    var name = document.getElementById('userName').value;
    var email = document.getElementById('userEmail').value;
    var status = (document.getElementById('userStatus').checked === true) ? 1 : 0;

    if (cls_general.is_empty_var(name) === 0 || cls_general.is_empty_var(email) === 0) {
      cls_general.shot_toast_bs("Debe ingresar todos los campos.", { bg: 'text-bg-warning' }); return false;
    }
    if (!cls_general.isEmail(email)) {
      cls_general.shot_toast_bs("Debe ingresar un correo valido.", { bg: 'text-bg-warning' }); return false;
    }

    var url = '/user/' + user_id; var method = 'PUT';
    var body = JSON.stringify({ a: name, b: email, c: status});
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        cls_user.render();
        const modal_win = bootstrap.Modal.getInstance('#userModal');
        modal_win.hide();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-secondary' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  update_password(btn, user_id) {
    cls_general.disable_submit(btn);

    var pass1 = document.getElementById('userPasswordF').value;
    var pass2 = document.getElementById('userPasswordS').value;
    var logincode = document.getElementById('userLogincode').value;

    if (cls_general.is_empty_var(pass1) === 0 || cls_general.is_empty_var(pass2) === 0) {
      cls_general.shot_toast_bs("Debe ingresar la contrase&ntilde;a dos veces.", { bg: 'text-bg-warning' }); return false;
    }
    if (pass1 != pass2) {
      cls_general.shot_toast_bs("Debe repetir la contrase&ntilde;a.", { bg: 'text-bg-warning' }); return false;
    }

    if (cls_general.is_empty_var(logincode) === 1) {
      if (logincode.length != 10) {
        cls_general.shot_toast_bs("Debe ingresar un codigo de acceso valido.", { bg: 'text-bg-warning' }); return false;
      }
    }


    var url = '/user_password/' + user_id; var method = 'PUT';
    var body = JSON.stringify({ a: pass1, b: logincode });
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        cls_general.shot_toast_bs(obj.message);

        const modal_win = bootstrap.Modal.getInstance('#userModal');
        if (modal_win) {
          modal_win.hide();
        }
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  delete(btn, user_id) {
    cls_general.disable_submit(btn);

    var url = '/user/' + user_id; var method = 'DELETE';
    var body = '';
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        cls_user.render();
        const modal_win = bootstrap.Modal.getInstance('#userModal');
        modal_win.hide();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-secondary' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  add_role(btn, user_id){
    cls_general.disable_submit(btn);
    var role_id = document.getElementById('roleUser').value;

    var url = '/user_role/' + user_id + '/add'; var method = 'POST';
    var body = JSON.stringify({ a: role_id });
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        cls_user.info = obj['data']['info'];
        document.getElementById('container_userRoleList').innerHTML = cls_user.generate_rolelist(cls_user.info.role);;
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-secondary' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  delete_role(btn, user_id, role_id) {
    cls_general.disable_submit(btn);
    var url = '/user_role/' + user_id + '/delete'; var method = 'POST';
    var body = JSON.stringify({ a: role_id });
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        cls_user.info = obj['data']['info'];
        document.getElementById('container_userRoleList').innerHTML = cls_user.generate_rolelist(cls_user.info.role);;
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-secondary' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

}


