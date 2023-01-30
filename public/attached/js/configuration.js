// JavaScript Document
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
              <input type="text" class="form-control" id="newUbicationValue" value="" onblur="cls_ubication.setPrefix()" onfocus="cls_general.validFranz(this.id, ['word'])">
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
        <button type="button" class="btn btn-warning" data-bs-dismiss="modal" onclick="cls_ubication.delete();">ELiminar Sala</button>
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
        <div class="row">
          <div class="col-xs-12 py-2">
            <label for="tableValue" class="form-label">Descripci&oacute;n</label>
            <input type="text" class="form-control" id="tableValue" alt="${ubication_id}" onfocus="cls_general.validFranz(this.id, ['word','number'])" >
            <label for="tableCode" class="form-label">C&oacute;digo</label>
            <input type="text" class="form-control" id="tableCode" value="" onfocus="cls_general.validFranz(this.id, ['word','number'])" >
            <label for="tableType" class="form-label">Tipo</label>
            <select class="form-select" id="tableType">
              <option value="" selected>Seleccione</option>
              <option value="1">Barra</option>
              <option value="2">Mesa</option>
              <option value="3">Caja</option>
              <option value="4">Cocina</option>
            </select>
          </div>
        </div>
      `;
    var content_bottom = `          
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      <button type="button" class="btn btn-success" id="btn_tableModal" onclick="cls_table.save()">Guardar Cambios</button>
    `;

    document.getElementById('ubicationModal_content').innerHTML = content;
    document.getElementById('ubicationModal_footer').innerHTML = content_bottom;
    document.getElementById('ubicationModal_title').innerHTML = '<h4>Crear Mesa</h4>';
  }
  save(){
    var field_value = document.getElementById('tableValue');
    var value = field_value.value;
    var ubication_id = field_value.getAttribute('alt');
    var code = document.getElementById('tableCode').value;
    var type = document.getElementById('tableType').value;
    if (cls_general.is_empty_var(value) === 0 || cls_general.is_empty_var(code) === 0 || cls_general.is_empty_var(type) === 0) {
      cls_general.shot_toast_bs('Verifique la información ingresada',{bg: 'text-bg-secondary'});
      return false;
    }
    var url = '/table/'; var method = 'POST';
    var body = JSON.stringify({a: value, b: code, c: type, d: ubication_id});
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        cls_ubication.render_modal(obj.data.ubication, obj.data.table);
      }
      cls_general.shot_toast_bs(obj.message);
    }
    cls_general.async_laravel_request(url, method, funcion, body);
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
      var content = `
        <div class="row">
          <div class="col-xs-12 py-2">
            <label for="tableValue" class="form-label">Descripci&oacute;n</label>
            <input type="text" class="form-control" id="tableValue" value="${table['tx_table_value']}" onfocus="cls_general.validFranz(this.id, ['word','number'])">
            <label for="tableCode" class="form-label">C&oacute;digo</label>
            <input type="text" class="form-control" id="tableCode" value="${table['tx_table_code']}" onfocus="cls_general.validFranz(this.id, ['word','number'])">
            <div class="form-check form-switch py-3 ">
              <input class="form-check-input" type="checkbox" role="switch" id="tableStatus" ${checked}>
              <label class="form-check-label" for="tableStatus">Activo</label>
            </div>
            <div class="col-xs-6">
              <span class="form-control cursor_default">${cls_table.raw_type[table['tx_table_type']]}</span>
            </div>
          </div>
        </div>
      `;
      var content_bottom = `          
        <button type="button" class="btn btn-warning" data-bs-dismiss="modal" onclick="cls_table.delete(${table['ai_table_id']});">ELiminar Mesa</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-success" id="btn_tableModal" name="${table['ai_table_id']}" onclick="cls_table.update(this.name)">Guardar Cambios</button>
      `;
      document.getElementById('ubicationModal_title').innerHTML = table['tx_table_value'];
      document.getElementById('ubicationModal_content').innerHTML = content;
      document.getElementById('ubicationModal_footer').innerHTML = content_bottom;

      // const modalUbication = new bootstrap.Modal('#ubicationModal', {})
      // modalUbication.show();
      setTimeout(() => {
        document.getElementById('tableValue').focus();
      }, 500);

    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  update(table_id){
    var description = document.getElementById('tableValue').value;
    var code = document.getElementById('tableCode').value;
    var status = (document.getElementById('tableStatus').checked === true) ? 1 : 0;

    var url = '/table/' + table_id; var method = 'PUT';
    var body = JSON.stringify({ a: description, b: code, c: status });
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        cls_ubication.render_modal(obj.data.ubication, obj.data.table);
      }
      cls_general.shot_toast_bs(obj['message']);
    }
    cls_general.async_laravel_request(url, method, funcion, body);
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
          <div id="container_productList" class="col-xs-12 border-top">
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
      var bg = (raw_list[a]['tx_product_status'] == '0') ? 'text-bg-secondary' : '';
      var inactive = (raw_list[a]['tx_product_status'] == '0') ? ' (INACTIVO)' : '';


      list += `<a href = "#" class="list-group-item list-group-item-action ${bg}" onclick="event.preventDefault(); cls_product.show(${raw_list[a]['tx_product_slug']})" >${raw_list[a]['tx_product_value']} (${raw_list[a]['tx_product_prefix']}) ${inactive}</a>`;
    }
    list += '</div>';
    return list;
  }
  create() {
    var option_productcategory = '';
    var categoryList = cls_productcategory.category
    categoryList.map(x => option_productcategory += `<option value="${x.ai_productcategory_id}">${x.tx_productcategory_value} </option>` )
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
              <label for="productCode class="form-label">C&oacute;digo</label>
              <input type="text" class="form-control" id="productCode" value="" onfocus="cls_general.validFranz(this.id, ['word','number'])" onkeyup="cls_general.limitText(this, 15, toast = 0)" onkeyup="cls_general.limitText(this, 15, toast = 0)">
            </div>
            <div class="col-lg-6 col-md-12">
              <label for="productTaxrate" class="form-label">% Impuesto</label>
              <input type="text" class="form-control" id="productTaxrate" value="" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 2, toast = 0)" onkeyup="cls_general.limitText(this, 2, toast = 0)" >
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
              <label for="productDiscountrate" class="form-label">% Descuento</label>
              <input type="text" class="form-control" id="productDiscountrate" value="" onfocus="cls_general.validFranz(this.id, ['number'])" onkeyup="cls_general.limitText(this, 3, toast = 0)" onkeyup="cls_general.limitText(this, 3, toast = 0)">
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
      <button type="button" class="btn btn-success" id="btn_tableModal" onclick="cls_table.save()">Guardar Cambios</button>
    `;

    document.getElementById('productModal_content').innerHTML = content;
    document.getElementById('productModal_footer').innerHTML = content_bottom;
    document.getElementById('productModal_title').innerHTML = '<h4>Crear Mesa</h4>';

    const modalUbication = new bootstrap.Modal('#productModal', {})
    modalUbication.show();

  }
  save() {
    var category = document.getElementById('productCategory').value;
    var value = document.getElementById('productValue').value;
    var reference = document.getElementById('productReference').value;
    var code = document.getElementById('productCode').value;
    var taxrate = document.getElementById('productTaxrate').value;
    var minimum = document.getElementById('productMinimum').value;
    var maximum = document.getElementById('productMaximum').value;
    var discountRate = document.getElementById('productDiscountrate').value;
    var status = document.getElementById('productStatus').value;
    var alarm = document.getElementById('productAlarm').value;
    var discountable = document.getElementById('productDiscountable').value;
VERIFICAR QUE AS VARIABLES NO ESTEN VACIOS SINO ENVIARLAS AL CNONTROLADOR
    if (cls_general.is_empty_var(category) === 0 || cls_general.is_empty_var(value) === 0 || cls_general.is_empty_var(code) === 0 || cls_general.is_empty_var(taxrate) === 0 || cls_general.is_empty_var(minimum) === 0 || cls_general.is_empty_var(maximum) === 0 || cls_general.is_empty_var(discountRate) === 0) {
      cls_general.shot_toast_bs('Verifique la información ingresada', { bg: 'text-bg-secondary' });
      return false;
    }




    // var code = document.getElementById('tableCode').value;
    // var type = document.getElementById('tableType').value;
    // if (cls_general.is_empty_var(value) === 0 || cls_general.is_empty_var(code) === 0 || cls_general.is_empty_var(type) === 0) {
    //   cls_general.shot_toast_bs('Verifique la información ingresada', { bg: 'text-bg-secondary' });
    //   return false;
    // }
    var url = '/table/'; var method = 'POST';
    var body = JSON.stringify({ a: value, b: code, c: type, d: ubication_id });
    var funcion = function (obj) {
      if (obj.status != 'failed') {
        cls_ubication.render_modal(obj.data.ubication, obj.data.table);
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