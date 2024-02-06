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

class class_stock{
}
class class_paymentmethod {
  constructor(raw_paymentmethod) {
    this.paymentmethod = raw_paymentmethod;
  }
  render() {
    document.getElementById('container_paymentMethod').innerHTML = cls_paymentmethod.generate_paymentbutton(cls_paymentmethod.paymentmethod);
  }
  generate_paymentbutton(paymentmethod) {
    var content = '';
    paymentmethod.map((method) => {
      content += `
        <div class="col-md-6 col-lg-3 d-grid gap-2 pb-4">
          <button type="button" class="btn btn-info h_90" onclick="cls_payment.add(${method.ai_paymentmethod_id})">${method.tx_paymentmethod_value}</button>
        </div>
      `;
    })
    return content;
  }
}
class class_productinput
{
  constructor(raw_productinput){
    this.productinput_list = raw_productinput
  }
  render(){
    document.getElementById('filter_productinput').value= '';
    document.getElementById('productinputDatefilter').value = '';
    document.getElementById('container_productinput').innerHTML = cls_productinput.generate_list(cls_productinput.productinput_list);
  }
  generate_list(filtered) {
    var content = '<ul class="list-group">';
    filtered.map((productinput) => {
      content += `
        <li class="list-group-item cursor_pointer d-flex justify-content-between align-items-start" onclick="cls_productinput.show('${productinput.tx_productinput_slug}')">
          <div class="ms-2 me-auto">
            <div class="fw-bold"><h5>${productinput.tx_productinput_number} - ${productinput.tx_provider_value}</h5></div>
            <small>${cls_general.datetime_converter(productinput.created_at)}</small>
          </div>
          <span class="badge bg-primary rounded-pill">B/ ${cls_general.val_price(productinput.tx_productinput_total, 2, 1, 1)}</span>
        </li>
      `;
    })
    content += '</ul>';
    return content;
  }
  generate_unpaid(filtered) {
    var content = '<ul class="list-group">';
    filtered.map((productinput) => {
      content += `
        <li class="list-group-item cursor_pointer d-flex justify-content-between align-items-start" onclick="cls_productinput.show('${productinput.tx_productinput_slug}')">
          <div class="ms-2 me-auto">
            <div class="fw-bold"><h5>${productinput.tx_productinput_ticket} (${productinput.tx_productinput_number})</h5></div>
            <small>${cls_general.datetime_converter(productinput.created_at)}</small>
          </div>
          <span class="badge bg-primary rounded-pill">B/ ${cls_general.val_price(productinput.tx_productinput_total,2,1,1)}</span>
        </li>
      `;
    })
    content += '</ul>';
    return content;
  }
  generate_paidup(filtered) {
    var content = '<ul class="list-group">';
    filtered.map((productinput) => {
      content += `
        <li class="list-group-item cursor_pointer d-flex justify-content-between align-items-start" onclick="cls_productinput.show('${productinput.tx_productinput_slug}')">
          <div class="ms-2 me-auto">
            <div class="fw-bold"><h5>${productinput.tx_productinput_ticket} (${productinput.tx_productinput_number})</h5></div>
            <small>${cls_general.datetime_converter(productinput.created_at)}</small>
          </div>
          <span class="badge bg-primary rounded-pill">B/ ${cls_general.val_price(productinput.tx_productinput_total, 2, 1, 1)}</span>
        </li>
      `;
    })
    content += '</ul>';
    return content;
  }
  look_for(str, raw_productinput, date='') {
    return new Promise(resolve => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        var haystack = raw_productinput;
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          var ocurrencys = 0;
          for (const a in needles) {
            if (date.length > 0) {
              if (cls_general.date_converter('dmy', 'ymd', haystack[i]['tx_productinput_date']) == date) {
                if (haystack[i]['tx_productinput_number'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_productinput_ticket'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
              }
            }else{
              if (haystack[i]['tx_productinput_number'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_productinput_ticket'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
            }
          }
          if (ocurrencys === needles.length) {
            raw_filtered.push(haystack[i]);
          }
          if (raw_filtered.length == 100) {
            break;
          }
        }
        resolve(raw_filtered)
      }, 500)
    });
  }
  async filter(str) {
    var date = document.getElementById('productinputDatefilter').value;
    var filtered = await cls_productinput.look_for(str, cls_productinput.productinput_list, date);
    var content = cls_productinput.generate_list(filtered)
    document.getElementById('container_productinput').innerHTML = content;
  }
  generate_productlist(raw_product, action = 1) {
    var content = '';
    raw_product.map((product) => {
      content += `
        <tr class="text-center">
          <td class="truncate-text">${product.tx_dataproductinput_description}</td>
          <td class="truncate-text">${product.tx_dataproductinput_quantity} <br/> ${product.tx_measure_value}</td>
          <td class="truncate-text">${cls_general.val_price(product.tx_dataproductinput_price, 2, 1, 1)}</td>
          <td class="truncate-text">${product.tx_dataproductinput_discountrate}%</td>
          <td class="truncate-text">${product.tx_dataproductinput_taxrate}%</td>
        `
      if (action === 1) {
        content += `
              <td>
                <button type="button" onclick="cls_productinput.edit_product(${product.ai_dataproductinput_id})" class="btn btn-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-tools" viewBox="0 0 16 16">
                    <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0Zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708ZM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11Z"/>
                  </svg>
                </button>
                &nbsp;
                <button type="button" onclick="cls_productinput.delete_product(${product.ai_dataproductinput_id})" class="btn btn-danger">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                  </svg>
                </button>
              </td>
            `;
      }
      content += `</tr>`;
    })
    return content;
  }
  show(productinput_slug) {
    var url = '/purchase/' + productinput_slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var opened = obj.data.productinput.opened;
        var data_productinput = cls_productinput.generate_productlist(opened.dataproductinput, 0);
        var data_related = cls_paymentprovider.generate_related(obj.data.productinput.opened.data_related);
        var content = `
          <div class="row">
            <div class="col-sm-12">
              <div class="row">
                <div class="col-md-12 col-lg-6">
                  <label for="providerProductinput" class="form-label">Proveedor</label>
                  <input type="text" id="providerProductinput" class="form-control" disabled onclick="cls_productinput.change_provider()" value="${opened.info.tx_provider_value}">
                </div>
                <div class="col-md-12 col-lg-3">
                  <label for="numberProductinput" class="form-label">Numero</label>
                  <span id="numberProductinput" class="form-control">#${opened.info.tx_productinput_number}</span>
                </div>
                <div class="col-md-12 col-lg-3">
                  <label for="numberProductinput" class="form-label">Fecha</label>
                  <span id="numberProductinput" class="form-control">${cls_general.datetime_converter(opened.info.created_at)}</span>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 col-lg-2">
                  <label for="nontaxableProductinput" class="form-label">No imponible</label>
                  <span id="nontaxableProductinput" class="form-control">B/ ${cls_general.val_price(opened.info.tx_productinput_nontaxable, 2, 1, 1)}</span>
                </div>
                <div class="col-md-6 col-lg-2">
                  <label for="taxableProductinput" class="form-label">Imponible</label>
                  <span id="taxableProductinput" class="form-control">B/ ${cls_general.val_price(opened.info.tx_productinput_taxable, 2, 1, 1)}</span>
                </div>
                <div class="col-md-6 col-lg-2">
                  <label for="discounttotalProductinput" class="form-label">T. Descuento</label>
                  <span id="discounttotalProductinput" class="form-control">B/ ${cls_general.val_price(opened.info.tx_productinput_discount, 2, 1, 1)}</span>
                </div>
                <div class="col-md-6 col-lg-2">
                  <label for="taxtotalProductinput" class="form-label">T. Impuesto</label>
                  <span id="taxtotalProductinput" class="form-control">B/ ${cls_general.val_price(opened.info.tx_productinput_tax, 2, 1, 1)}</span>
                </div>
                <div class="col-md-6 col-lg-2">
                  <label for="totalProductinput" class="form-label">Total</label>
                  <span id="totalProductinput" class="form-control text-bg-info">B/ ${cls_general.val_price(opened.info.tx_productinput_total, 2, 1, 1)}</span>
                </div>
                <div class="col-md-6 col-lg-2">
                  <label for="dueProductinput" class="form-label">Deuda</label>
                  <span id="dueProductinput" class="form-control text-bg-secondary">B/ ${cls_general.val_price(opened.info.tx_productinput_due, 2, 1, 1)}</span>
                </div>
              </div>
              <div class="row">
                <div id="product_selected" class="col-sm-12 v_scrollable pt-3" style="height: 40vh">
                  <table id="tbl_productselected" class="table table-striped table-bordered">
                    <thead>
                      <tr class="text-center bg-secondary">
                        <th scope="col-sm-4">Descripci&oacute;n</th>
                        <th scope="col-sm-2">Cantidad</th>
                        <th scope="col-sm-2">Precio</th>
                        <th scope="col-sm-1">Desc%</th>
                        <th scope="col-sm-1">Imp%</th>
                        <th scope="col-sm-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      ${data_productinput}
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <h5>Pagos Relacionadas</h5>
                  <div id="container_paymentprovider_rel_productinput" class="col-sm-12">
                    ${data_related.paymentprovider}
                  </div>
                </div>
                <div class="col-sm-6">
                  <h5>Ordenes de Compra Rel.</h5>
                  <div id="container_requisition_rel_productinput" class="col-sm-12">
                    ${data_related.requisition}
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

        document.getElementById('productinputModal_content').innerHTML = content;
        document.getElementById('productinputModal_title').innerHTML = `Detalle de Compra`;
        document.getElementById('productinputModal_footer').innerHTML = `
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" id="btn_showprovider" class="btn btn-info" onclick="cls_provider.show('${opened.info.tx_provider_slug}')">Volver</button>
        `;
        
        const Modal_provider = bootstrap.Modal.getInstance('#providerModal');
        if (Modal_provider) {
          Modal_provider.hide();
        }
        const Modal_paymentprovider = bootstrap.Modal.getInstance('#paymentproviderModal');
        if (Modal_paymentprovider) {
          Modal_paymentprovider.hide();
        }
        const Modal_requisition = bootstrap.Modal.getInstance('#requisitionModal');
        if (Modal_requisition) {
          Modal_requisition.hide();
        }

        const modal = new bootstrap.Modal('#productinputModal', {})
        modal.show();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_selected(data_selected){
    var content = '<div class="list-group">';
    data_selected.map((selected) => {
      content += `
        <a href="#" aria-current="true" onclick="event.preventDefault();" class="list-group-item  ">
          <span class="float_right font_bolder">Compra #${selected.info.tx_productinput_number} (${cls_general.date_converter('ymd','dmy',selected.info.tx_productinput_date)})</span>
        </a>
      `;
      selected.dataproductinput.map((data_pi) => {
        content += `
          <a href="#" class="list-group-item list-group-item-action " aria-current="true" onclick="event.preventDefault();">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">${data_pi.tx_dataproductinput_quantity} - ${data_pi.tx_dataproductinput_description}</h5>
            </div>
            <small class="float_right">B/ ${data_pi.tx_dataproductinput_total}</small>
          </a>
        `;
      })
    })
    content += `</div>`;
    return content;
  }
}
class class_provider
{
  constructor(provider_list){
    this.provider_list = provider_list;
    this.productinput_unpaid = [];
    this.productinput_paidup = [];
  }
  look_for(str,limit) {
    return new Promise(resolve => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        var haystack = cls_provider.provider_list;
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          var ocurrencys = 0;
          for (const a in needles) {
            if (haystack[i]['tx_provider_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_provider_ruc'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
          }
          if (ocurrencys === needles.length) {
            raw_filtered.push(haystack[i]);
          }
          if (raw_filtered.length == limit) {
            break;
          }
        }
        resolve(raw_filtered)
      }, 500)
    });
  }
  async filter(str) {
    var limit = document.getElementById('providerLimit').value;
    var filtered = await cls_provider.look_for(str, limit);
    var content = cls_provider.generate_list(filtered)
    document.getElementById('container_provider').innerHTML = content;
  }
  generate_list(filtered) {
    var content = '<ul class="list-group">';
    filtered.map((provider) => {
      var bg_status = (provider.tx_provider_status === 0) ? 'text-bg-secondary' : '';

      content += `
        <li class="list-group-item cursor_pointer d-flex justify-content-between align-items-start ${bg_status}" onclick="cls_provider.show('${provider.tx_provider_slug}')">
          <div class="ms-2 me-auto">
            <div class="fw-bold"><h5>${provider.tx_provider_value}</h5></div>
            <small>RUC: ${provider.tx_provider_ruc} DV: ${provider.tx_provider_dv}</small>
          </div>
        </li>
      `;
    })
    content += '</ul>';
    return content;
  }
  create() {
    document.getElementById('providerModal').classList.remove('modal-xl');

    document.getElementById('providerModal_title').innerHTML = `Crear proveedor`;
    document.getElementById('providerModal_content').innerHTML = `
      <div class="row">
        <div class="col-sm-12">
          <label for="providerValue_updrequisition" class="form-label">Descripci&oacute;n</label>
          <input type="text" id="providerValue_updrequisition" class="form-control" onfocus="cls_general.validFranz(this.id, ['word', 'number', 'punctuation', 'mathematic'])">
        </div>
        <div class="col-sm-8">
          <label for="providerRUC_updrequisition" class="form-label">RUC</label>
          <input type="text" id="providerRUC_updrequisition" class="form-control" onfocus="cls_general.validFranz(this.id, ['word', 'number'],'-')">
        </div>
        <div class="col-sm-2">
          <label for="providerDV_updrequisition" class="form-label">DV</label>
          <input type="text" id="providerDV_updrequisition" class="form-control" onfocus="cls_general.validFranz(this.id, ['number'])">
        </div>
        <div class="col-sm-4">
          <label for="providerTelephone_updrequisition" class="form-label">Tel&eacute;fono</label>
          <input type="text" id="providerTelephone_updrequisition" class="form-control" onfocus="cls_general.validFranz(this.id, ['number'], '- ')">
        </div>
        <div class="col-sm-8">
          <label for="providerAddress_updrequisition" class="form-label">Direcci&oacute;n</label>
          <input type="text" id="providerAddress_updrequisition" class="form-control" onfocus="cls_general.validFranz(this.id, ['word', 'number', 'punctuation', 'mathematic'])">
        </div>
        <div class="col-sm-12">
          <label for="providerObservation_updrequisition" class="form-label">Observaciones</label>
          <input type="text" id="providerObservation_updrequisition" class="form-control" onfocus="cls_general.validFranz(this.id, ['word', 'number', 'punctuation', 'mathematic'])">
        </div>
      </div>
    `;
    document.getElementById('providerModal_footer').innerHTML = `
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      <button id="btn_saveprovider" type="button" class="btn btn-primary">Guardar</button>
    `;

    const modal = new bootstrap.Modal('#providerModal', {})
    modal.show();

    document.getElementById('btn_saveprovider').addEventListener('click', () => { cls_provider.save();  });
  }
  save() {
    cls_general.disable_submit(document.getElementById('btn_saveprovider'));

    var description = document.getElementById('providerValue_updrequisition').value;
    var ruc = document.getElementById('providerRUC_updrequisition').value;
    var dv = document.getElementById('providerDV_updrequisition').value;
    var telephone = document.getElementById('providerTelephone_updrequisition').value;
    var address = document.getElementById('providerAddress_updrequisition').value;
    var observation = document.getElementById('providerObservation_updrequisition').value;

    if (cls_general.is_empty_var(description) === 0 || cls_general.is_empty_var(ruc) === 0 || cls_general.is_empty_var(dv) === 0 || cls_general.is_empty_var(telephone) === 0 || cls_general.is_empty_var(address) === 0) {
      cls_general.shot_toast_bs('Todos los campos son obligatorios, excepto Observaciones', { bg: 'text-bg-warning' }); return false;
    }

    var url = '/provider/';
    var method = 'POST';
    var body = JSON.stringify({ a: description, b: ruc, c: dv, e: telephone, f: address, g: observation });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_provider.provider_list = obj.data.all;
        const Modal = bootstrap.Modal.getInstance('#providerModal');
        Modal.hide();
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }

    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  show(provider_slug){
    var url = '/provider/'+provider_slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_provider.productinput_unpaid = obj.data.productinput_unpaid;
        cls_provider.productinput_paidup = obj.data.productinput_paidup;

        var unpaid_list = cls_productinput.generate_unpaid(obj.data.productinput_unpaid);
        var paidup_list = cls_productinput.generate_paidup(obj.data.productinput_paidup);
        var status = (obj.data.info.tx_provider_status === 1) ? 'checked' : '';

        var total_unpaid = 0;
        obj.data.productinput_unpaid.map((unpaid) => {
          total_unpaid += unpaid.tx_productinput_total;
        })

        var total_paidup = 0;
        obj.data.productinput_paidup.map((paidup) => {
          total_paidup += paidup.tx_productinput_total;
        })

        var total_purchased = total_unpaid + total_paidup;

        var observation = (cls_general.is_empty_var(obj.data.info.tx_provider_observation) === 0) ? '' : obj.data.info.tx_provider_observation;
        document.getElementById('providerModal_title').innerHTML = `Modificar proveedor`;
        document.getElementById('providerModal_content').innerHTML = `
          <div class="row">
            <div class="col-sm-6">
              <label for="providerValue" class="form-label">Descripci&oacute;n</label>
              <input type="text" id="providerValue" class="form-control" onfocus="cls_general.validFranz(this.id, ['word', 'number', 'punctuation', 'mathematic'])" value="${obj.data.info.tx_provider_value}">
            </div>
            <div class="col-sm-2">
              <label for="providerRUC" class="form-label">RUC</label>
              <input type="text" id="providerRUC" class="form-control" onfocus="cls_general.validFranz(this.id, ['word', 'number'],'-')" value="${obj.data.info.tx_provider_ruc}">
            </div>
            <div class="col-sm-1">
              <label for="providerDV" class="form-label">DV</label>
              <input type="text" id="providerDV" class="form-control" onfocus="cls_general.validFranz(this.id, ['number'])" value="${obj.data.info.tx_provider_dv}">
            </div>
            <div class="col-sm-3">
              <label for="providerTelephone" class="form-label">Tel&eacute;fono</label>
              <input type="text" id="providerTelephone" class="form-control" onfocus="cls_general.validFranz(this.id, ['number'], '- ')" value="${obj.data.info.tx_provider_telephone}">
            </div>
            <div class="col-sm-4">
              <label for="providerAddress" class="form-label">Direcci&oacute;n</label>
              <input type="text" id="providerAddress" class="form-control" onfocus="cls_general.validFranz(this.id, ['word', 'number', 'punctuation', 'mathematic'])" value="${obj.data.info.tx_provider_direction}">
            </div>
            <div class="col-sm-4">
              <label for="providerObservation" class="form-label">Observaciones</label>
              <input type="text" id="providerObservation" class="form-control" onfocus="cls_general.validFranz(this.id, ['word', 'number', 'punctuation', 'mathematic'])" value="${observation}">
            </div>
            <div class="col-sm-2">
              <div class="form-check form-switch pt_35">
                <input class="form-check-input" type="checkbox" role="switch" id="providerStatus" ${status}>
                <label class="form-check-label" for="providerStatus">Activo</label>
              </div>
            </div>
            <div class="col-sm-2">
              <label for="" class="form-label">Total Comprado</label>
              <input type="text" id="" class="form-control" readonly value="${total_purchased}">
            </div>
            <div class="col-sm-12 text-center pt-2 pb-2">
              <button id="btn_updateprovider" type="button" class="btn btn-lg btn-primary">Guardar</button>
              <button id="btn_deleteprovider" type="button" class="btn btn-lg btn-danger">Eliminar</button>
            </div>
          </div>
          <div class="row border-top pt-3">
            <div class="col-sm-6">
              <div class="row">
                <div class="col-sm-9 text-center">
                  <h5>Facturas por Pagar (B/${cls_general.val_price(total_unpaid,2,1,1)})</h5>
                  <div class="input-group my-3">
                    <input type="text" id="filter_unpaid" class="form-control" placeholder="Buscar por numero." onkeyup="cls_provider.filter_productinput_unpaid(this.value,cls_provider.productinput_unpaid)">
                    <button class="btn btn-outline-secondary" type="button" onclick="cls_provider.filter(document.getElementById('filter_unpaid').value,cls_provider.productinput_unpaid)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="col-sm-3 d-grid gap-2 py-3">
                  <button id="btn_newpaymentprovider" class="btn btn-info" type="button">Pago</button>
                </div>
                <div id="container_unpaid" class="col-sm-12 text-center h_150">
                  ${unpaid_list}
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="row">
                <div class="col-sm-9 text-center">
                  <h5>Facturas Pagadas (B/${cls_general.val_price(total_paidup, 2, 1, 1)})</h5>
                  <div class="input-group my-3">
                    <input type="text" id="filter_paidup" class="form-control" placeholder="Buscar por numero." onkeyup="cls_provider.filter_productinput_paidup(this.value,cls_provider.productinput_paidup)">
                    <button class="btn btn-outline-secondary" type="button" onclick="cls_provider.filter(document.getElementById('filter_paidup').value,cls_provider.productinput_paidup)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div id="container_paidup" class="col-sm-12 text-center h_150">
                  ${paidup_list}
                </div>
              </div>
            </div>
          </div>
        `;
        document.getElementById('providerModal_footer').innerHTML = `
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        `;

        document.getElementById('providerModal').classList.add('modal-xl');

        const Modal = bootstrap.Modal.getInstance('#productinputModal');
        if (Modal) {
          Modal.hide();
        }

        const modal = new bootstrap.Modal('#providerModal', {})
        modal.show();

        document.getElementById('btn_updateprovider').addEventListener('click', () => { cls_provider.update(provider_slug); });
        document.getElementById('btn_deleteprovider').addEventListener('click', () => { cls_provider.delete(provider_slug); });
        document.getElementById('btn_newpaymentprovider').addEventListener('click', () => { cls_provider.newpayment(provider_slug); });
        
        
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  update(provider_slug){
    cls_general.disable_submit(document.getElementById('btn_updateprovider'));

    var description = document.getElementById('providerValue').value;
    var ruc = document.getElementById('providerRUC').value;
    var dv = document.getElementById('providerDV').value;
    var telephone = document.getElementById('providerTelephone').value;
    var address = document.getElementById('providerAddress').value;
    var observation = document.getElementById('providerObservation').value;
    var status = (document.getElementById('providerStatus').checked) ? 1 : 0;

    if (cls_general.is_empty_var(description) === 0 || cls_general.is_empty_var(ruc) === 0 || cls_general.is_empty_var(dv) === 0 || cls_general.is_empty_var(telephone) === 0 || cls_general.is_empty_var(address) === 0) {
      cls_general.shot_toast_bs('Todos los campos son obligatorios, excepto Observaciones', { bg: 'text-bg-warning' }); return false;
    }

    var url = '/provider/' + provider_slug;
    var method = 'PUT';
    var body = JSON.stringify({ a: description, b: ruc, c: dv, e: telephone, f: address, g: observation, h: status });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_provider.provider_list = obj.data.all;
        const Modal = bootstrap.Modal.getInstance('#providerModal');
        Modal.hide();
        cls_provider.filter('');
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  delete(provider_slug){
    var url = '/provider/' + provider_slug;
    var method = 'DELETE';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_provider.provider_list = obj.data.all;
        const Modal = bootstrap.Modal.getInstance('#providerModal');
        Modal.hide();
        cls_provider.filter('');
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }

    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  async filter_productinput_unpaid(str, raw_productinput) {
    var filtered = await cls_productinput.look_for(str, raw_productinput);
    var content = cls_productinput.generate_unpaid(filtered)
    document.getElementById('container_unpaid').innerHTML = content;
  }
  async filter_productinput_paidup(str, raw_productinput) {
    var filtered = await cls_productinput.look_for(str, raw_productinput);
    var content = cls_productinput.generate_paidup(filtered)
    document.getElementById('container_paidup').innerHTML = content;
  }
  newpayment(){
    var list = '<ul class="list-group">';
    cls_provider.productinput_unpaid.map((productinput) => {
      list += `
        <li class="list-group-item">
          <input class="form-check-input me-1" type="checkbox" value="" name="${productinput.tx_productinput_slug}" id="${productinput.tx_productinput_slug}">
          <label class="form-check-label" for="${productinput.tx_productinput_slug}">${productinput.tx_productinput_number}</label>
        </li>
      `
    })
    list += '</ul>';
    
    document.getElementById('providerModal_title').innerHTML = `Crear Pago`;
    document.getElementById('providerModal_content').innerHTML = `
      <div class="row">
        <div class="col-sm-12 h_200">
          <h5>Seleccione las Facturas</h5>
          ${list}
        </div>
      </div>
    `;
    document.getElementById('providerModal_footer').innerHTML = `
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      <button id="btn_newpayment" type="button" class="btn btn-success" data-bs-dismiss="modal">Crear Pago</button>
    `;

    document.getElementById('providerModal').classList.remove('modal-xl');

    document.getElementById('btn_newpayment').addEventListener('click', () => {
      cls_paymentprovider.create();
    });
  }
}
class class_paymentprovider
{
  constructor(paymentprovider_list){
    this.newpayment_total = 0;
    this.paymentprovider_list = paymentprovider_list;
  }
  create(){
    var cb = document.getElementsByClassName('form-check-input');
    var raw_selected = [];
    for (const a in cb) {
      if (cb[a].checked) {
        raw_selected.push(cb[a].name)
      }
    }
    if (raw_selected.length === 0) {
      cls_general.shot_toast_bs('Debe seleccionar alguna compra.', { bg: 'text-bg-warning' });
      return false;
    }

    var url = '/paymentprovider/productinput';
    var method = 'POST';
    var body = JSON.stringify({ a: raw_selected });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_paymentprovider.newpayment_total = obj.data.due;
        cls_paymentprovider.render(obj.data.data_selected);

        const Modal = bootstrap.Modal.getInstance('#providerModal');
        Modal.hide();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  render(data_selected){
    cls_payment.payment = [];
    var list = cls_productinput.generate_selected(data_selected)
    var content = `
      <div class="row">
        <div class="col-md-12 col-lg-6">
          <div class="col-sm-12"><h5>Listado de Compras</h5></div>
          <div id="container_productinputlist" class="col-sm-12 v_scrollable" style="height: 90vh">
            ${list}
          </div>
        </div>

        <div class="col-md-12 col-lg-6">
          <div class="row">
            <div class="col-md-12 pt-1">
              <div class="row bs_1 border_gray radius_5 tmgreen_bg f_white">
                <div class="col-md-12"><h5>Total</h5><span id="sp_total" class="font_bolder fs_30">B/. ${cls_general.val_price(cls_paymentprovider.newpayment_total, 2, 1, 1)}</span></div>
              </div>
            </div>
          </div>
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
              <div id="container_paymentMethod" class="row v_scrollable" style="height: 20vh"></div>
            </div>
            <div class="col-sm-12 bs_1 border_gray radius_10">
              <div id="container_payment" class="row radius_10" style="height: 30vh"></div>
            </div>
            <div class="col-sm-12 text-center pt-1">
              <button type="button" id="btn_paymentproviderProcess" class="btn btn-success btn-lg display_none">Procesar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('paymentproviderModal_title').innerHTML = 'Ingrese el pago';
    document.getElementById('paymentproviderModal_content').innerHTML = content;
    document.getElementById('paymentproviderModal_footer').innerHTML = `
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
    `;

    document.getElementById('btn_paymentproviderProcess').addEventListener('click', () => { cls_payment.process(document.getElementById('btn_paymentproviderProcess'), data_selected) });

    cls_paymentmethod.render();

    const modal = new bootstrap.Modal('#paymentproviderModal', {})
    modal.show();
  }

  index() {
    document.getElementById('container_paymentprovider').innerHTML = cls_paymentprovider.generate_list(cls_paymentprovider.paymentprovider_list);
  }
  generate_list(filtered) {
    var content = '<ul class="list-group">';
    filtered.map((paymentprovider) => {
      content += `
        <li class="list-group-item cursor_pointer d-flex justify-content-between align-items-start" onclick="cls_paymentprovider.show(${paymentprovider.ai_paymentprovider_id})">
          <div class="ms-2 me-auto">
            <div class="fw-bold"><h5>${paymentprovider.tx_paymentprovider_number} - ${paymentprovider.tx_provider_value}</h5></div>
            <small>${cls_general.datetime_converter(paymentprovider.created_at)}</small>
          </div>
          <span class="badge bg-primary rounded-pill">B/ ${cls_general.val_price(paymentprovider.tx_paymentprovider_total, 2, 1, 1)}</span>
        </li>
      `;
    })
    content += '</ul>';
    return content;
  }
  look_for(str) {
    return new Promise(resolve => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        var haystack = cls_paymentprovider.paymentprovider_list;
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          var ocurrencys = 0;
          for (const a in needles) {
            if (haystack[i]['tx_paymentprovider_number'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_provider_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
          }
          if (ocurrencys === needles.length) {
            raw_filtered.push(haystack[i]);
          }
          if (raw_filtered.length == 100) { //EL LIMITE ES 100
            break;
          }
        }
        resolve(raw_filtered)
      }, 500)
    });
  }
  async filter(str) {
    var filtered = await cls_paymentprovider.look_for(str);
    var content = cls_paymentprovider.generate_list(filtered)
    document.getElementById('container_paymentprovider').innerHTML = content;
  }
  show(id) {
    var url = '/paymentprovider/' + id;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('paymentproviderModal_content').innerHTML = `
          <div class="row">
            <div class="col-sm-8">
              <label for="paymentproviderProviderselected" class="form-label">Proveedor</label>
              <input type="text" id="paymentproviderProviderselected" class="form-control" disabled>
              <input type="hidden" id="paymentproviderId" value="">
            </div>
            <div class="col-sm-4">
              <label for="paymentproviderDate" class="form-label">Fecha</label>
              <input type="text" id="paymentproviderDate" class="form-control" disabled>
            </div>            
            <div class="col-sm-4">
              <label for="paymentproviderNumber" class="form-label">N&uacute;mero</label>
              <input type="text" id="paymentproviderNumber" class="form-control" disabled>
            </div>            
            <div class="col-sm-4">
              <label for="paymentproviderTotal" class="form-label">Total</label>
              <input type="text" id="paymentproviderTotal" class="form-control" disabled>
            </div>            
          </div>            
          <div class="row">
            <div class="col-sm-4">
              <h5>Listado de Pagos</h5>
              <div id="container_datapaymentprovider" class="col-sm-12">
                
              </div>
            </div>
            <div class="col-sm-4">
              <h5>Compras Relacionadas</h5>
              <div id="container_productinput_rel" class="col-sm-12">
                
              </div>
            </div>
            <div class="col-sm-4">
              <h5>Ordenes de Compra Rel.</h5>
              <div id="container_requisition_rel" class="col-sm-12">
                
              </div>
            </div>
          </div>
        `;
        document.getElementById('paymentproviderModal_footer').innerHTML = `
          <button id="deletePaymentprovider" type="button" class="btn btn-danger">Eliminar</button>
          <button id="printPaymentprovider" type="button" class="btn btn-info">Imprimir</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        `;
        document.getElementById('paymentproviderModal_title').innerHTML = 'Detalle del Pago';

        document.getElementById('paymentproviderId').value = obj.data.info.ai_paymentprovider_id;
        document.getElementById('paymentproviderProviderselected').value = obj.data.info.tx_provider_value;
        document.getElementById('paymentproviderDate').value = cls_general.datetime_converter(obj.data.info.created_at);
        document.getElementById('paymentproviderNumber').value = obj.data.info.tx_paymentprovider_number;
        document.getElementById('paymentproviderTotal').value = cls_general.val_price(obj.data.info.tx_paymentprovider_total, 2, 1, 1);
        document.getElementById('container_datapaymentprovider').innerHTML = cls_paymentprovider.generate_datapaymentprovider(obj.data.data_paymentprovider);
        var content_rel = cls_paymentprovider.generate_related(obj.data.data_productinput);
        document.getElementById('container_productinput_rel').innerHTML = content_rel['productinput'];
        document.getElementById('container_requisition_rel').innerHTML = content_rel['requisition'];

        const modal = new bootstrap.Modal('#paymentproviderModal', {})
        modal.show();

        document.getElementById('deletePaymentprovider').addEventListener('click', function () {
          cls_general.disable_submit(this, 1)
          cls_paymentprovider.delete(id);
        });
        document.getElementById('printPaymentprovider').addEventListener('click', function (el) {
          cls_general.print_html('/print_paymentprovider/' + id);
        });

        const Modal_provider = bootstrap.Modal.getInstance('#providerModal');
        if (Modal_provider) {
          Modal_provider.hide();
        }
        const Modal_productinput = bootstrap.Modal.getInstance('#productinputModal');
        if (Modal_productinput) {
          Modal_productinput.hide();
        }
        const Modal_requisition = bootstrap.Modal.getInstance('#requisitionModal');
        if (Modal_requisition) {
          Modal_requisition.hide();
        }


      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_datapaymentprovider(data_paymentprovider){
    var content = '<ul class="list-group">';
    data_paymentprovider.map((payment) => {
      var number = (cls_general.is_empty_var(payment.tx_datapaymentprovider_number) === 0) ? '' : `(${payment.tx_datapaymentprovider_number})`;
      content += `<li class="list-group-item cursor_pointer text-truncate">B/ ${cls_general.val_price(payment.tx_datapaymentprovider_amount,2,1,1)} - ${payment.tx_paymentmethod_value} ${number}</li>`;
    })
    content += '</ul>';
    return content;
  }
  generate_related(data_productinput){
    var content_productinput    = '<ul class="list-group">';
    var content_requisition     = '<ul class="list-group">';
    var content_paymentprovider = '<ul class="list-group">';

    data_productinput.map((data) => {
      content_productinput += `<li class="list-group-item cursor_pointer d-flex justify-content-between align-items-start" onclick="cls_productinput.show('${data.tx_productinput_slug}')">
          <div class="ms-2 me-auto">
            <div>#${data.tx_productinput_number} (${cls_general.date_converter('ymd', 'dmy', data.tx_productinput_date)})</div>
            <small><strong>Total</strong> B/${cls_general.val_price(data.tx_productinput_total, 2, 1, 1)} <br/> <strong>Deuda Act.</strong> B/${cls_general.val_price(data.tx_productinput_due, 2, 1, 1)}</small>
          </div>
          <span class="badge bg-primary rounded-pill">Abono B/ ${cls_general.val_price(data.tx_paymentprovider_productinput_payment, 2, 1, 1)}</span>
        </li>`;
      content_requisition += `<li class="list-group-item cursor_pointer d-flex justify-content-between align-items-start" onclick="cls_requisition.show('${data.tx_requisition_slug}')">
          <div class="ms-2 me-auto">
            <div>#${data.tx_requisition_number}</div>
            <small>${cls_general.datetime_converter(data.requisition_date)}</small>
          </div>
          <span class="badge bg-primary rounded-pill">Total B/ ${data.tx_requisition_total}</span>
        </li>`;
      content_paymentprovider += `<li class="list-group-item cursor_pointer d-flex justify-content-between align-items-start" onclick="cls_paymentprovider.show(${data.ai_paymentprovider_id})">
          <div class="ms-2 me-auto">
            <div>#${data.tx_paymentprovider_number}</div>
            <small>${cls_general.datetime_converter(data.paymentprovider_date)}</small>
          </div>
          <span class="badge bg-primary rounded-pill">Total B/ ${cls_general.val_price(data.tx_paymentprovider_total, 2, 1, 1)}</span>
        </li>`;

    })
    content_productinput    += '</ul>';
    content_requisition     += '</ul>';
    content_paymentprovider += '</ul>';



    return { productinput: content_productinput, requisition: content_requisition, paymentprovider: content_paymentprovider};
  }
  delete(id){
    swal({
      title: "¿Desea eliminar este pago?",
      icon: "info",

      buttons: {
        si: {
          text: "Si, eliminar",
          className: "btn btn-danger btn-lg"
        },
        no: {
          text: "No",
          className: "btn btn-secondary btn-lg",
        },
      },
      dangerMode: true,
    })
      .then((ans) => {
        switch (ans) {
          case 'si':
            var url = '/paymentprovider/' + id;
            var method = 'DELETE';
            var body = '';
            var funcion = function (obj) {
              if (obj.status === 'success') {
                cls_paymentprovider.paymentprovider_list = obj.data.all;
                document.getElementById('container_paymentprovider').innerHTML = cls_paymentprovider.generate_list(cls_paymentprovider.paymentprovider_list);

                cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
                const Modal = bootstrap.Modal.getInstance('#paymentproviderModal');
                Modal.hide();
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
class class_payment {
  constructor() {
    this.payment = [];
  }
  add(method) {
    let number = document.getElementById('paymentNumber').value;
    let amount = parseFloat(document.getElementById('paymentAmount').value);

    var check_method = cls_paymentmethod.paymentmethod.find((pmethod) => { return pmethod.ai_paymentmethod_id === method })
    if (cls_general.is_empty_var(amount) === 0) {  //VERIFICA QUE EL MONTO INGRESADO NO ESTE VACIO
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
    var total = cls_general.val_dec(cls_paymentprovider.newpayment_total, 2, 1, 1);
    total = parseFloat(total);
    if (total <= received) {
      cls_general.shot_toast_bs('Ya se complet&oacute; el pago.', { bg: 'text-bg-warning' }); return false;
    } else {
      if ((received + amount) > total) {
        cls_general.shot_toast_bs('Superó el monto total.', { bg: 'text-bg-warning' }); return false;
      }
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
      document.getElementById('btn_paymentproviderProcess').classList.remove('display_none');
    } else {
      document.getElementById('btn_paymentproviderProcess').classList.add('display_none');
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
    if (parseFloat(cls_paymentprovider.newpayment_total) > received) {
      var diference = (parseFloat(cls_paymentprovider.newpayment_total) - parseFloat(received)).toFixed(2);
      var change = 0;
    } else {
      if (parseFloat(cls_paymentprovider.newpayment_total) === received) {
        var change = 0;
        var diference = 0;
      } else {
        var diference = 0;
        var change = (parseFloat(received) - parseFloat(cls_paymentprovider.newpayment_total)).toFixed(2);
      }
    }
    var content = `
      <div class="col-sm-4">
        <div class="row border-end mhp_100">
          <div class="col-sm-12 text-success bs_1 border_gray">
            <span class="font_bolder">Recibido</span><br/>
            <span class="fs_20">B/ ${cls_general.val_price(received, 2, 1, 1)}</span>
          </div>
          <div class="col-sm-12 text-warning bs_1 border_gray">
            <span class="font_bolder">Diferencia</span><br/>
            <span class="fs_20">B/ ${cls_general.val_price(diference, 2, 1, 1)}</span>
          </div>
          <div class="col-sm-12 text-info bs_1 border_gray">
            <span class="font_bolder">Cambio</span><br/>
            <span class="fs_20">B/ ${cls_general.val_price(change, 2, 1, 1)}</span>
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
  process(btn, data_selected) {
    cls_general.disable_submit(btn)
    var raw_payment = cls_payment.payment;
    var url = '/paymentprovider/';
    var method = 'POST';
    var body = JSON.stringify({ a: data_selected, b: raw_payment });
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
class class_requisition{
  constructor(raw_requisition){
    this.requisition_list = raw_requisition;
  }
  render() {
    document.getElementById('filter_requisition').value = '';
    document.getElementById('container_requisition').innerHTML = cls_requisition.generate_list(cls_requisition.requisition_list);
  }
  generate_list(filtered) {
    var content = '<ul class="list-group">';
    filtered.map((requisition) => {
      content += `
        <li class="list-group-item cursor_pointer d-flex justify-content-between align-items-start" onclick="cls_requisition.show('${requisition.tx_requisition_slug}')">
          <div class="ms-2 me-auto">
            <div class="fw-bold"><h5>${requisition.tx_requisition_number} - ${requisition.tx_provider_value}</h5></div>
            <small>${cls_general.datetime_converter(requisition.created_at)}</small>
          </div>
          <span class="badge bg-primary rounded-pill">B/ ${cls_general.val_price(requisition.tx_requisition_total, 2, 1, 1)}</span>
        </li>
      `;
    })
    content += '</ul>';
    return content;
  }
  look_for(str) {
    return new Promise(resolve => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        var haystack = cls_requisition.requisition_list;
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          var ocurrencys = 0;
          for (const a in needles) {
            if (haystack[i]['tx_requisition_number'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_provider_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 ) { ocurrencys++ }
          }
          if (ocurrencys === needles.length) {
            raw_filtered.push(haystack[i]);
          }
          if (raw_filtered.length == 100) { //EL LIMITE ES 100
            break;
          }
        }
        resolve(raw_filtered)
      }, 500)
    });
  }
  async filter(str) {
    var filtered = await cls_requisition.look_for(str);
    var content = cls_requisition.generate_list(filtered)
    document.getElementById('container_requisition').innerHTML = content;
  }
  show(slug) {
    var url = '/requisition/' + slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var data_related = cls_paymentprovider.generate_related(obj.data.data_related);

        document.getElementById('requisitionModal_content').innerHTML = `
          <div class="row">
            <div class="col-sm-8">
              <label for="requisitionProviderselected" class="form-label">Proveedor</label>
              <input type="text" id="requisitionProviderselected" class="form-control" disabled>
              <input type="hidden" id="requisitionSlug" value="">
            </div>
            <div class="col-sm-4">
              <label for="requisitionDate" class="form-label">Fecha</label>
              <input type="text" id="requisitionDate" class="form-control" disabled>
            </div>            
            <div class="col-sm-4">
              <label for="requisitionSubtotal" class="form-label">Subtotal</label>
              <input type="text" id="requisitionSubtotal" class="form-control" disabled>
            </div>            
            <div class="col-sm-4">
              <label for="requisitionTax" class="form-label">Imp</label>
              <input type="text" id="requisitionTax" class="form-control" disabled>
            </div>
            <div class="col-sm-4">
              <label for="requisitionTotal" class="form-label">Total</label>
              <input type="text" id="requisitionTotal" class="form-control" disabled>
            </div>            
          </div>            
          <div class="row">
            <div id="container_datarequisition" class="col-sm-12">
              
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <h5>Compras Relacionadas</h5>
              <div id="container_productinput_rel_requisition" class="col-sm-12">
                ${data_related.productinput}
              </div>
            </div>
            <div class="col-sm-12">
              <h5>Pagos Relacionados</h5>
              <div id="container_paymentprovider_rel_requisition" class="col-sm-12">
                ${data_related.paymentprovider}
              </div>
            </div>
          </div>

        `;
        document.getElementById('requisitionModal_footer').innerHTML = (obj.data.requisition.tx_requisition_status === 0) ? `
          <button id="deleteRequisition" type="button" class="btn btn-danger">Eliminar</button>
          <button id="prinRequisition" type="button" class="btn btn-info">Imprimir</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button id="processRequisition" type="button" class="btn btn-success btn-lg">Ingresar</button>
        `: `
          <button id="prinRequisition" type="button" class="btn btn-info">Imprimir</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        `
        document.getElementById('requisitionModal_title').innerHTML = 'Detalle de la Orden de Compra';

        document.getElementById('requisitionSlug').value = obj.data.requisition.tx_requisition_slug;
        document.getElementById('requisitionProviderselected').value = obj.data.requisition.tx_provider_value;
        document.getElementById('requisitionDate').value = cls_general.datetime_converter(obj.data.requisition.created_at);
        document.getElementById('requisitionSubtotal').value = cls_general.val_price(obj.data.requisition.tx_requisition_nontaxable + obj.data.requisition.tx_requisition_taxable - obj.data.requisition.tx_requisition_discount, 2, 1, 1);
        document.getElementById('requisitionTax').value = cls_general.val_price(obj.data.requisition.tx_requisition_tax, 2, 1, 1);
        document.getElementById('requisitionTotal').value = cls_general.val_price(obj.data.requisition.tx_requisition_total, 2, 1, 1);
        document.getElementById('container_datarequisition').innerHTML = cls_requisition.generate_datalist(obj.data.datarequisition);

        const Modal_provider = bootstrap.Modal.getInstance('#providerModal');
        if (Modal_provider) {
          Modal_provider.hide();
        }
        const Modal_productinput = bootstrap.Modal.getInstance('#productinputModal');
        if (Modal_productinput) {
          Modal_productinput.hide();
        }
        const Modal_paymentprovider = bootstrap.Modal.getInstance('#paymentproviderModal');
        if (Modal_paymentprovider) {
          Modal_paymentprovider.hide();
        }

        const modal = new bootstrap.Modal('#requisitionModal', {})
        modal.show();

        if (obj.data.requisition.tx_requisition_status === 0) {
          document.getElementById('deleteRequisition').addEventListener('click', function () {
            cls_general.disable_submit(this, 1)
            cls_requisition.delete(slug);
          });
          document.getElementById('processRequisition').addEventListener('click', function () {
            cls_general.disable_submit(this, 1)
            cls_requisition.get_requisition(slug);
          });
        }
        document.getElementById('prinRequisition').addEventListener('click', function (el) {
          cls_general.print_html('/print_requisition/' + slug);
        });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_datalist(raw_requisition) {
    var content = '<h5>Contenido</h5><div class="list-group">';
    raw_requisition.map((data) => {
      content += `
        <a href="#" class="list-group-item list-group-item-action" aria-current="true">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${data.tx_datarequisition_quantity}.- ${data.tx_datarequisition_description}</h5>
            <small>B/ ${cls_general.val_price(data.tx_datarequisition_price, 2, 1, 1)}</small>
          </div>
          <small>B/ ${cls_general.val_price(data.tx_datarequisition_total, 2, 1, 1)}</small>
        </a>
      `;
    })
    return content + '</div >';
  }
  delete(requisition_slug) {
    var url = '/requisition/' + requisition_slug;
    var method = 'DELETE';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_requisition.requisition_list = obj.data.all;
        document.getElementById('container_requisition').innerHTML = cls_requisition.generate_list(cls_requisition.requisition_list);
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
        const Modal = bootstrap.Modal.getInstance('#requisitionModal');
        Modal.hide();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
  get_requisition(requisition_slug) {
    var url = '/provider/' + requisition_slug + '/requisition';
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var list = '<ul class="list-group" >';
        obj.data.list.map((requisition) => {
          list += `
            <li class="list-group-item">
              <input class="form-check-input me-1" type="checkbox" value="" name="${requisition.ai_requisition_id}" id="${requisition.ai_requisition_id}">
              <label class="form-check-label" for="${requisition.ai_requisition_id}">${requisition.tx_requisition_number}</label>
            </li>          
          `;
        });
        list += '</ul>';

        var content = `
          <div class="row">
            <div class="col-sm-12">
              <div class="row">
                <div class="col-sm-12 text-center">
                  <h5>${obj.data.list[0].tx_provider_value}</h5>
                  <span>Seleccione las ordenes que ingresar&aacute;.</span>
                </div>
                <div class="col-sm-12">
                  ${list}
                </div>
              </div>
            </div>
          </div>
        `;
        document.getElementById('requisitionModal_content').innerHTML = content;
        document.getElementById('requisitionModal_footer').innerHTML = `
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button id="btn_initproductinput" type="button" class="btn btn-primary">Guardar</button>        
        `;
        document.getElementById('btn_initproductinput').addEventListener('click', function () {
          cls_general.disable_submit(this, 0);
          cls_requisition.init_productinput();
        });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
}
class class_productoutput{
  constructor(raw_productoutput) {
    this.productoutput_list = raw_productoutput,
    this.productoutput_selected = []
  }
  render() {
    var content_category = '';
    cls_product.productcategory.map((category) => {
      content_category += `<button class="btn btn-primary" style="height: 8vh;" onclick="cls_productoutput.filter_productcategory('${category.tx_productcategory_value}');">${category.tx_productcategory_value}</button> &nbsp;`;
    })
    var content = `
      <div class="row">
        <div class="col-md-12 col-lg-5 pt-2">
          <div class="row">
            <div class="col-sm-6">
              <span>Productos Seleccionados</span>
            </div>
            <div class="col-sm-6 bs_1 border_gray radius_10 tmgreen_bg f_white text-truncate text-right">
              <span id="span_productoutputTotal"><h5>Total: B/ 0.00</h5></span>
            </div>
            <div id="productoutput_selected" class="col-sm-12 v_scrollable" style="height: 35vh">
            </div>
            <div class="col-sm-12 input-group mb-3 pt-2" style="height: 8vh">
              <input type="text" id="productFilter" class="form-control" placeholder="Buscar por código o descripción" onkeyup="cls_productoutput.filter_product(this.value)">
              <button class="btn btn-outline-secondary" type="button" onclick="cls_productoutput.filter_product(document.getElementById('productFilter').value)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                </svg>
              </button>
            </div>
            <span>Listado de Productos</span>
            <div id="product_list" class="col-sm-12 v_scrollable" style="height: 20vh">
            </div>
            <div class="col-sm-12 h_scrollable pt-2" style="height: 12vh; white-space: nowrap;">
              ${content_category}
            </div>
          </div>
        </div>
        <div class="col-md-12 col-lg-1 text-center">
          <div class="row">
            <div class="col-md-12 text-center" style="height:60vh; display: flex; align-items: center;">
              <button id="btn_productoutputprocess" class="btn tmgreen_bg btn-lg h_150" onclick="cls_productoutput.process();">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
                </svg>
              </button>
            </div>
            <div class="col-md-12 text-center" style="height:20vh;display: flex;align-items: bottom;">
              <button class="btn btn-secondary btn-lg h_50" onclick="window.location.href = '/stock';">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="col-md-12 col-lg-6">
          <div class="row">
            <div class="col-lg-6">
              <label for="productoutputFilter" class="form-label">Buscar</label>
              <div class="input-group mb-3">
                <input type="text" id="productoutputFilter" class="form-control" placeholder="Buscar por O.C. o proveedor">
                <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_productoutput.filter()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="col-lg-6">
              <label for="productoutputDatefilter" class="form-label">Fecha</label>
              <input type="text" class="form-control" id="productoutputDatefilter" placeholder="">
            </div>
          </div>
          <div class="row">
            <span>Listado de Ordenes de C.</span>
            <div id="productoutputList" class="col-sm-12 v_scrollable" style="height: 70vh">
            </div>
          </div>
        </div>
      </div>

    `;
    document.getElementById('container_productoutput').innerHTML = content;
    document.getElementById('product_list').innerHTML = cls_productoutput.generate_productlist(cls_product.productlist);
    document.getElementById('productoutputList').innerHTML = cls_productoutput.generate_productoutputlist(cls_productoutput.productoutput_list);
    $(function () {
      $("#productoutputDatefilter").datepicker();
    });
  }
  generate_productlist(raw_product) {
    var content = '<ul class="list-group">';
    raw_product.map((product) => {
      content += `<li class="list-group-item cursor_pointer fs_20 text-truncate" onclick="cls_product.show('${product.tx_product_slug}')">${product.tx_product_code} - ${product.tx_product_value}</li>`;
    });
    content += '</ul>';
    return content;
  }
  async filter_product(str) {
    var filtered = await cls_product.look_for(str, 'filter');
    document.getElementById('product_list').innerHTML = cls_productoutput.generate_productlist(filtered);
  }
  async filter_productcategory(category) {
    var filtered = await cls_product.look_for(category, 'category');
    document.getElementById('product_list').innerHTML = cls_productoutput.generate_productlist(filtered);
  }
  generate_productoutputlist(raw_productoutput) {
    var content = '<ul class="list-group">';
    raw_productoutput.map((productoutput) => {
      content += `<li class="list-group-item cursor_pointer fs_20 text-truncate" onclick="cls_productoutput.show(${productoutput.ai_productoutput_id})">${productoutput.tx_productoutput_reason} - (${cls_general.datetime_converter(productoutput.created_at)})</li>`;
    });
    content += '</ul>';
    return content;
  }
  product_total() {
    var select_measure = document.getElementById("productMeasure");
    var rel_measure = select_measure.options[select_measure.selectedIndex].getAttribute('alt');
    var product_quantity = document.getElementById('productQuantity').value;
    var product_price = document.getElementById('productPrice').value;
    var product_discountrate = document.getElementById('productDiscountrate').value;
    var product_taxrate = document.getElementById('productTaxrate').value;
    if (cls_general.is_empty_var(product_quantity) === 0 || cls_general.is_empty_var(product_price) === 0 || cls_general.is_empty_var(product_discountrate) === 0 || cls_general.is_empty_var(product_taxrate) === 0) {
      var total = { total: 0.00 };
    } else {
      var total = cls_general.calculate_sale([{ price: product_price*rel_measure, discount: product_discountrate, tax: product_taxrate, quantity: product_quantity }]);
    }
    //[{PRICE,discount,tax, quantity}]
    document.getElementById('productTotal').innerHTML = cls_general.val_price(total.total, 2, 1, 1);
  }
  addproduct() {
    var product_id = document.getElementById('productId').value;
    var product_description = document.getElementById('productDescription').value;
    var select_measure = document.getElementById('productMeasure');
    var rel_measure = select_measure.options[select_measure.selectedIndex].getAttribute('alt')
    var product_measureId = select_measure.value;
    var product_measureDescription = select_measure.options[select_measure.selectedIndex].text
    var product_quantity = document.getElementById('productQuantity').value;
    var product_price = document.getElementById('productPrice').value;
    var product_discountrate = document.getElementById('productDiscountrate').value;
    var product_taxrate = document.getElementById('productTaxrate').value;
    if (cls_general.is_empty_var(product_id) === 0 || cls_general.is_empty_var(product_description) === 0 || cls_general.is_empty_var(product_measureId) === 0 || cls_general.is_empty_var(product_quantity) === 0 || cls_general.is_empty_var(product_price) === 0 || cls_general.is_empty_var(product_discountrate) === 0 || cls_general.is_empty_var(product_taxrate) === 0) {
      cls_general.shot_toast_bs('Debe llenar todos los campos', { bg: 'text-bg-warning' });
      return false;
    }
    var added_total = cls_general.calculate_sale([{ price: product_price*rel_measure, discount: product_discountrate, tax: product_taxrate, quantity: product_quantity }]);
    cls_productoutput.productoutput_selected.push({ id: product_id, description: product_description, measure_id: product_measureId, measure_description: product_measureDescription, quantity: product_quantity, price: product_price * rel_measure, discountrate: product_discountrate, taxrate: product_taxrate, total: added_total.total });
    var raw_total = [];
    cls_productoutput.productoutput_selected.map((product) => {
      raw_total.push({ price: product.price, discount: product.discountrate, tax: product.taxrate, quantity: product.quantity })
    })
    var total = cls_general.calculate_sale(raw_total);
    document.getElementById('span_productoutputTotal').innerHTML = '<h5>Total: B / ' + cls_general.val_price(total.total, 2, 1, 1) + '</h5>';
    const Modal = bootstrap.Modal.getInstance('#productoutputModal');
    Modal.hide();
    document.getElementById('productoutput_selected').innerHTML = cls_productoutput.generate_productselected(cls_productoutput.productoutput_selected);
  }
  deleteproduct(index) {
    var product_added = cls_productoutput.productoutput_selected;
    product_added.splice(index, 1);
    cls_productoutput.productoutput_selected = product_added;
    document.getElementById('productoutput_selected').innerHTML = cls_productoutput.generate_productselected(cls_productoutput.productoutput_selected);
    var raw_total = [];
    cls_productoutput.productoutput_selected.map((product) => {
      raw_total.push({ price: product.price, discount: product.discountrate, tax: product.taxrate, quantity: product.quantity })
    })
    var total = cls_general.calculate_sale(raw_total);
    document.getElementById('span_productoutputTotal').innerHTML = '<h5>Total: B / ' + cls_general.val_price(total.total, 2, 1, 1) + '</h5>';
  }
  generate_productselected(raw_productselected) {
    var content = `<div class="list-group">`;
    raw_productselected.map((product, index) => {
      content += `
        <a href="#" class="list-group-item list-group-item-action" aria-current="true">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${product.quantity} - ${product.description}</h5>
            <small>${cls_general.val_price(product.price, 2, 1, 1)}</small>
          </div>
          <p class="mb-1">Medida: ${product.measure_description}</p>
          <div class="text-center">
          <button class="btn btn-warning" type="button" onclick="cls_productoutput.deleteproduct(${index})">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
            </svg>
          </button>
        </div>
        </a>
      `;
    })
    content += `</div>`;
    return content;
  }
  process() {
    if (cls_productoutput.productoutput_selected.length === 0) {
      return swal("Debe seleccionar algún producto.");
    }
    swal({
      title: "Motivo de la salida",
      text: "Ingrese el motivo de la salida. Max 80 caracteres",

      content: {
        element: "input",
        attributes: {
          placeholder: "Motivo",
          type: "text",
        },
      },
    })
    .then((reason) => {
      if (cls_general.is_empty_var(reason) === 0) {
        return swal("Debe ingresar el motivo.");
      }
      var raw_product = [];
      cls_productoutput.productoutput_selected.map((product) => {
        raw_product.push({ price: product.price, discount: product.discountrate, tax: product.taxrate, quantity: product.quantity })
      });
      var raw_total = cls_general.calculate_sale(raw_product);
      cls_general.disable_submit(document.getElementById('btn_productoutputprocess'));

      var url = '/productoutput/';
      var method = 'POST';
      var body = JSON.stringify({ a: cls_productoutput.productoutput_selected, b: raw_total, c: reason.slice(0,80) });
      var funcion = function (obj) {
        if (obj.status === 'success') {
          cls_productoutput.productoutput_selected = [];
          document.getElementById('productoutput_selected').innerHTML = cls_productoutput.generate_productselected(cls_productoutput.productoutput_selected);

          cls_productoutput.productoutput_list = obj.data.all;
          document.getElementById('productoutputList').innerHTML = cls_productoutput.generate_productoutputlist(cls_productoutput.productoutput_list);
          cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
        } else {
          cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
        }
      }
      cls_general.async_laravel_request(url, method, funcion, body);
    });
  }
  show(id) {
    var url = '/productoutput/' + id;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('productoutputModal_title').innerHTML = `Salida de Productos`;

        document.getElementById('productoutputModal_content').innerHTML = `
          <div class="row">
            <div class="col-sm-8">
              <label for="productoutputReason" class="form-label">Motivo</label>
              <input type="text" id="productoutputReason" class="form-control" disabled>
            </div>
            <div class="col-sm-4">
              <label for="productoutputDate" class="form-label">Fecha</label>
              <input type="text" id="productoutputDate" class="form-control" disabled>
            </div>            
            <div class="col-sm-4">
              <label for="productoutputTotal" class="form-label">Total</label>
              <input type="text" id="productoutputTotal" class="form-control" disabled>
            </div>            
          </div>            
          <div class="row">
            <div id="container_dataproductoutput" class="col-sm-12">
              
            </div>
          </div>
        `;
        document.getElementById('productoutputModal_footer').innerHTML = `
          <button id="deleteProductoutput" type="button" class="btn btn-danger">Eliminar</button>
          <button id="printProductoutput" type="button" class="btn btn-info">Imprimir</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        `;

        document.getElementById('productoutputReason').value = obj.data.info.tx_productoutput_reason;
        document.getElementById('productoutputDate').value = cls_general.datetime_converter(obj.data.info.created_at);
        document.getElementById('productoutputTotal').value = 'B/. '+cls_general.val_price(obj.data.info.tx_productoutput_total, 2, 1, 1);
        document.getElementById('container_dataproductoutput').innerHTML = cls_productoutput.generate_datalist(obj.data.dataproductoutput);

        const modal = new bootstrap.Modal('#productoutputModal', {})
        modal.show();

        document.getElementById('deleteProductoutput').addEventListener('click', function () {
          cls_general.disable_submit(this, 1)
          cls_productoutput.delete(id);
        });
        document.getElementById('printProductoutput').addEventListener('click', function (el) {
          cls_general.print_html('/print_productoutput/' + id);
        });
        
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_datalist(raw_dataproductoutput) {
    var content = '<h5>Contenido</h5><div class="list-group">';
    raw_dataproductoutput.map((data) => {
      content += `
        <a href="#" class="list-group-item list-group-item-action" aria-current="true">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${data.tx_dataproductoutput_quantity} ${data.tx_measure_value} -  ${data.tx_product_value}</h5>
          </div>
        </a>
      `;
    })
    return content + '</div >';
  }
  delete(id) {
    var url = '/productoutput/' + id;
    var method = 'DELETE';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_productoutput.productoutput_list = obj.data.all;
        document.getElementById('productoutputList').innerHTML = cls_productoutput.generate_productoutputlist(cls_productoutput.productoutput_list);

        const Modal = bootstrap.Modal.getInstance('#productoutputModal');
        Modal.hide();
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }

    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

}
class class_product{
  constructor(productlist, productcategory) {
    this.productlist = productlist;
    this.productcategory = productcategory;
  }
  look_for(str, origin) {
    return new Promise(resolve => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        var haystack = cls_product.productlist;
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          var ocurrencys = 0;
          if (origin === 'category') {
            for (const a in needles) {
              if (haystack[i]['tx_productcategory_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
            }
          } else {
            for (const a in needles) {
              if (haystack[i]['tx_product_code'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_product_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
            }
          }
          if (ocurrencys === needles.length) {
            raw_filtered.push(haystack[i]);
          }
        }
        resolve(raw_filtered)
      }, 1000)
    });
  }
  show(product_slug) {
    var url = '/product/' + product_slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var opt_productMeasure = '';
        var rel_measure_product = 0;
        if (obj.data.dataproductinput.length > 0) {
          obj.data.measure_list.map((measure) => {
            if (measure.ai_measure_id === obj.data.dataproductinput[0].dataproductinput_ai_measurement_id) {
              rel_measure_product = measure.tx_measure_product_relation;
            }
            opt_productMeasure += `<option alt="${measure.tx_measure_product_relation}" value="${measure.ai_measure_id}">${measure.tx_measure_value}</option>`;
          })
          var price = obj.data.dataproductinput[0].tx_dataproductinput_price/rel_measure_product;
          var discountrate = obj.data.dataproductinput[0].tx_dataproductinput_discountrate;
          var taxrate = obj.data.dataproductinput[0].tx_dataproductinput_taxrate;
        }else{
          var price = 0;
          var discountrate = 0;
          var taxrate = 0;
          obj.data.measure_list.map((measure) => {
            opt_productMeasure += `<option alt="${measure.tx_measure_product_relation}" value="${measure.ai_measure_id}">${measure.tx_measure_value}</option>`;
          })
        }
        var content = `
          <div class="row">
            <div class="col-sm-12 text-center text-truncate">
              <h5>Cod. ${obj.data.product.tx_product_code} - ${obj.data.product.tx_product_value}</h5>
              <input type="hidden" name="" id="productId" class="form-control" value="${obj.data.product.ai_product_id}">
              <input type="hidden" name="" id="productDescription" class="form-control" value="${obj.data.product.tx_product_value}">
            </div>

            <div class="col-md-12 col-lg-4">
              <label for="productQuantity">Cantidad</label>
              <input type="text" id="productQuantity" onblur="cls_productoutput.product_total()" class="form-control">
            </div>
            <div class="col-md-12 col-lg-4">
              <label for="productMeasure">Medida</label>
              <select name="" id="productMeasure" class="form-select" onchange="cls_productoutput.product_total()">
                ${opt_productMeasure}
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-lg-4">
              <label for="productPrice">Precio</label>
              <input type="text" id="productPrice" class="form-control" readonly value="${price}">
            </div>
            <div class="col-md-12 col-lg-4">
              <label for="productDiscountrate">Descuento</label>
              <input type="text" id="productDiscountrate" class="form-control" readonly value="${discountrate}">
            </div>
            <div class="col-md-12 col-lg-4">
              <label for="productTaxrate">Impuesto</label>
              <input type="text" id="productTaxrate" class="form-control" readonly value="${taxrate}">
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-lg-4">
              <label for="productTotal">Total</label>
              <span type="text" id="productTotal"class="form-control" >B/. 0.00</span>
            </div>
          </div>
        `;
        document.getElementById('productoutputModal_title').innerHTML = 'Agregar Producto';
        document.getElementById('productoutputModal_content').innerHTML = content;
        document.getElementById('productoutputModal_footer').innerHTML = `
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-success" onclick="cls_productoutput.addproduct()">Agregar</button>
        `;

        const modal = new bootstrap.Modal('#productoutputModal', {})
        modal.show();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

}
class class_warehouse {
  constructor(raw_warehouse, raw_productwarehouse){
    this.warehouse_list = raw_warehouse;
    this.productwarehouse_list = raw_productwarehouse;
  }
  create(){
    var content = `
    <form action="#" onsubmit="cls_warehouse.save()">
      <div class="row">
        <div class="col-12">
          <label for="warehouseValue" class="form-label">Nombre de la Bodega</label>
          <input type="text" id="warehouseValue" class="form-control" value="">
        </div>
        <div class="col-12">
          <label for="warehouseCode" class="form-label">Codigo de la Bodega</label>
          <input type="text" id="warehouseCode" class="form-control" value="">
        </div>
        <div class="col-12">
          <label for="warehouseLocation" class="form-label">Localización</label>
          <input type="text" id="warehouseLocation" class="form-control" value="">
        </div>
      </div>
    </form>
    `
    document.getElementById('warehouseModal_title').innerHTML = 'Crear Bodega';
    document.getElementById('warehouseModal_content').innerHTML = content;
    document.getElementById('warehouseModal_footer').innerHTML = `
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      <button type="button" class="btn btn-success" onclick="cls_warehouse.save()">Agregar</button>
    `;


    const modal_win = new bootstrap.Modal('#warehouseModal', {})
    modal_win.show();
  }
  save(){
    var value     = document.getElementById('warehouseValue').value;
    var code      = document.getElementById('warehouseCode').value;
    var location  = document.getElementById('warehouseLocation').value;

    if (cls_general.is_empty_var(value) === 0 || cls_general.is_empty_var(code) === 0 || cls_general.is_empty_var(location) === 0) {
      cls_general.shot_toast_bs('Debe llenar todos los campos.', { bg: 'text-bg-warning' });
    }

    var url = '/warehouse/';
    var method = 'POST';
    var body = JSON.stringify({ a: value, b: code, c: location });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        //YA GUARDA MOSTRAR EL LISTADO, ACT LISTADO DEL CONSTRUCTOR Y HACER UN RENDER DE LA LISTA
        cls_warehouse.warehouse_list = obj.data.all;
        cls_warehouse.filter(document.getElementById('filter_warehouse').value);
        const modal_win = bootstrap.Modal.getInstance('#warehouseModal');
        if (modal_win) {
          modal_win.hide();
        }
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  async filter(str) {
    if (document.getElementById('warehouseTypefilter').value === '0') {
      var filtered = await cls_warehouse.look_for(str);
      var content = cls_warehouse.generate_list(filtered)
      document.getElementById('container_warehouselist').innerHTML = content;
      document.getElementById('container_productlist').innerHTML = '';
    } else {
      var filtered = await cls_productwarehouse.look_for(str);
      var content = cls_productwarehouse.generate_list(filtered)
      document.getElementById('container_productlist').innerHTML = content;
      document.getElementById('container_warehouselist').innerHTML = '';
    }
  }
  look_for(str) {
    return new Promise(resolve => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        var haystack = cls_warehouse.warehouse_list;
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          var ocurrencys = 0;
          for (const a in needles) {
            if (haystack[i]['tx_warehouse_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_warehouse_number'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
          }
          if (ocurrencys === needles.length) {
            raw_filtered.push(haystack[i]);
          }
        }
        resolve(raw_filtered)
      }, 1000)
    });
  }
  generate_list(filtered) {
    var content = '<ul class="list-group">';
    filtered.map((warehouse) => {
      var bg_status = (warehouse.tx_warehouse_status === 0) ? 'text-bg-secondary' : '';
      content += `
        <li class="list-group-item cursor_pointer d-flex justify-content-between align-items-start ${bg_status}" onclick="cls_warehouse.show_product('${warehouse.ai_warehouse_id}')">
          <div class="ms-2 me-auto">
            <div class="fw-bold"><h5>${warehouse.tx_warehouse_value}</h5></div>
            <small>Codigo: ${warehouse.tx_warehouse_number}</small>
          </div>
        </li>
      `;
    })
    content += '</ul>';
    return content;
  }
  show(warehouse_id){
    var url = '/warehouse/' + warehouse_id;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        console.log(obj.data)
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  show_product(warehouse_id) {
    var url = '/warehouse/' + warehouse_id + '/product';
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var content = cls_productwarehouse.generate_list(obj.data.all);
        document.getElementById('container_productlist').innerHTML = content;
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

}

class class_productwarehouse{
  add_product(){
    var select_warehouse = '<option value="">Seleccione</option>';
    cls_warehouse.warehouse_list.map((warehouse) => { select_warehouse += `<option value="${warehouse.ai_warehouse_id}">${warehouse.tx_warehouse_value}</option>`;})


    var content = `
      <form id="form_add_productwarehouse" autocomplete="off">
        <div class="row">
          <div class="col-6">
            <label for="warehouse_toasign">Bodega</label>
            <select id="warehouse_toasign" class="form-select">
              ${select_warehouse}
            </select>
          </div>
          <div class="col-6">
            <label for="quantity_toasign">Cantidad</label>
            <input type="text" id="quantity_toasign" class="form-control" placeholder="Cantidad a Asignar">
          </div>
          <div class="col-6">
            <label for="minimunquantity_toasign">M&iacute;nimo</label>
            <input type="text" id="minimunquantity_toasign" class="form-control" placeholder="Cantidad M&iacute;nima">
          </div>
          <div class="col-6">
            <label for="maximunquantity_toasign">M&aacute;ximo</label>
            <input type="text" id="maximunquantity_toasign" class="form-control" placeholder="Cantidad M&aacute;xima">
          </div>
        </div>
      </form>
      <div class="row">
        <div class="col-12">
          <div class="input-group my-3 pt-2">
            <input type="text" id="filter_product" class="form-control" placeholder="Buscar producto por nombre o código." onkeyup="cls_productwarehouse.filter_product(this.value)">
            <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_productwarehouse.filter_product(document.getElementById('filter_warehouse').value)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div id="modal_container_productlist" class="col-12">
        </div>

      </div>
    `;

    document.getElementById('productwarehouseModal_title').innerHTML = 'Asignar Producto';
    document.getElementById('productwarehouseModal_content').innerHTML = content;
    document.getElementById('productwarehouseModal_footer').innerHTML = `
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
    `;

    const modal_win = new bootstrap.Modal('#productwarehouseModal', {})
    modal_win.show();

  }
  async filter_product(str) {
    var filtered = await cls_product.look_for(str);
    var content = cls_productwarehouse.generate_productlist(filtered)
    document.getElementById('modal_container_productlist').innerHTML = content;
  }
  generate_productlist(filtered) {
    var content = '<ul class="list-group">';
    filtered.map((product) => {
      if (product.tx_product_status === 1) {
        content += `
          <li class="list-group-item cursor_pointer d-flex justify-content-between align-items-start" onclick="cls_productwarehouse.select_product('${product.ai_product_id}')">
            <div class="ms-2 me-auto">
              <div class="fw-bold"><h5>${product.tx_product_value}</h5></div>
              <small>Codigo: ${product.tx_product_code}</small>
            </div>
          </li>
        `;
      }
    })
    content += '</ul>';
    return content;
  }
  select_product(product_id){
    cls_general.validate_form(document.getElementById('form_add_productwarehouse'));
    var sel_warehouse = document.getElementById('warehouse_toasign');
    var minimun = document.getElementById('minimunquantity_toasign').value;
    var maximun = document.getElementById('maximunquantity_toasign').value;

    if (cls_general.is_empty_var(sel_warehouse.value) === 0) {
      return swal("Debe seleccionar alguna bodega.");
    }
    var quantity = document.getElementById('quantity_toasign').value;
    if (cls_general.is_empty_var(quantity) === 0 || cls_general.is_empty_var(minimun) === 0 || cls_general.is_empty_var(maximun) === 0) {
      return swal("Debe ingresar las cantidades.");
    }
    if (isNaN(quantity) || isNaN(minimun) || isNaN(maximun)) {
      return swal("Los numeros ingresados deben ser enteros.");
    }
   
    var url = '/productwarehouse/add_product';
    var method = 'POST';
    var body = JSON.stringify({ a: quantity, b: sel_warehouse.value, c: product_id, d: minimun, e: maximun });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        sel_warehouse.value = '';
        document.getElementById('quantity_toasign').value = '';
        document.getElementById('minimunquantity_toasign').value = '';
        document.getElementById('maximunquantity_toasign').value = '';
        cls_warehouse.productwarehouse_list = obj.data.all;
        cls_warehouse.filter(document.getElementById('filter_warehouse').value);
        const modal_win = bootstrap.Modal.getInstance('#productwarehouseModal');
        if (modal_win) {
          modal_win.hide();
        }
        cls_general.shot_toast_bs(obj.message);
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  look_for(str) {
    return new Promise(resolve => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        var haystack = cls_warehouse.productwarehouse_list;
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          var ocurrencys = 0;
          for (const a in needles) {
            if (haystack[i]['tx_productwarehouse_description'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_product_code'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
          }
          if (ocurrencys === needles.length) {
            raw_filtered.push(haystack[i]);
          }
        }
        resolve(raw_filtered)
      }, 1000)
    });
  }
  generate_list(filtered) {
    var content = '<ul class="list-group">';
    filtered.map((product) => {
      content += `

        <li class="list-group-item d-flex justify-content-between align-items-center"  onclick="cls_productwarehouse.show('${product.ai_productwarehouse_id}')">
          <div class="ms-2 me-auto">
            <div class="fw-bold"><h5>${product.tx_productwarehouse_description}</h5></div>
            <small>Codigo: ${product.tx_product_code}</small>
          </div>
          <span class="badge bg-primary rounded-pill">${product.tx_warehouse_value}</span>
        </li>
      `;
    })
    content += '</ul>';
    return content;
  }
  show(productwarehouse_id) {
    var url = '/productwarehouse/' + productwarehouse_id;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_productwarehouse.render_modal(obj.data.info);
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  render_modal(info){
    var content = `
      <form id="form_edit_productwarehouse" onsubmit="event.preventDefault(); cls_productwarehouse.update(${info.ai_productwarehouse_id})" autocomplete="off">
        <div class="row">
          <div class="col-12 text-center py-2">
            <h5>${info.tx_productwarehouse_description}</h5>
          </div>
          <div class="col-md-4 d-grid gap-2">
            <label for="" class="form-label m_0">Conteo</label>
            <button type="button" class="btn btn-info" onclick="cls_productwarehouse.count_product(${info.ai_productwarehouse_id})" >${cls_general.val_dec(info['tx_productwarehouse_quantity'], 2, 1, 1)}</button>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <label for="minimunquantity_toasign">M&iacute;nimo</label>
            <input type="text" id="minimunquantity_toasign" class="form-control" placeholder="Cantidad M&iacute;nima" value="${info.tx_productwarehouse_minimun}" onfocus="cls_general.validFranz(this.id, ['number'], '.')">
          </div>
          <div class="col-6">
            <label for="maximunquantity_toasign">M&aacute;ximo</label>
            <input type="text" id="maximunquantity_toasign" class="form-control" placeholder="Cantidad M&aacute;xima" value="${info.tx_productwarehouse_maximun}" onfocus="cls_general.validFranz(this.id, ['number'], '.')">
          </div>
          <div class="col-12 text-center py-2">
            <button type="submit" class="btn btn-success">Guardar</button>&nbsp;
            <button type="button" class="btn btn-danger" onclick="cls_productwarehouse.delete(this, ${info.ai_productwarehouse_id})">Eliminar</button>
          </div>
        </div>
      </form>    
    `;

    document.getElementById('productwarehouseModal_title').innerHTML = 'Producto en '+info.tx_warehouse_value;
    document.getElementById('productwarehouseModal_content').innerHTML = content;
    document.getElementById('productwarehouseModal_footer').innerHTML = `
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
    `;

    const modal_win = new bootstrap.Modal('#productwarehouseModal', {})
    modal_win.show();

  }
  count_product(productwarehouse_id) {
    var url = '/productwarehouse/' + productwarehouse_id + '/count'; var method = 'GET';
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
                <button class="btn btn-success" type="button" id="btn_addCountProduct" onclick="cls_productwarehouse.updateQuantity('${productwarehouse_id}')">Agregar</button>
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
        `;

        document.getElementById('productwarehouseModal_title').innerHTML = 'Contar';
        document.getElementById('productwarehouseModal_content').innerHTML = content;
        document.getElementById('productwarehouseModal_footer').innerHTML = content_bottom;
        setTimeout(() => {
          document.getElementById('productQuantity').focus();
        }, 500);
      }
      cls_general.shot_toast_bs(obj.message);
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  updateQuantity(productwarehouse_id) {
    var quantity = document.getElementById('productQuantity').value;
    if (cls_general.is_empty_var(quantity) === 0 || isNaN(quantity)) {
      cls_general.shot_toast_bs("Debe ingresar un numero.", { bg: "text-bg-warning" })
    }
    var url = '/productwarehouse/' + productwarehouse_id + '/count'; var method = 'POST';
    var body = JSON.stringify({ a: quantity });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        const modal_win = bootstrap.Modal.getInstance('#productwarehouseModal');
        if (modal_win) {
          modal_win.hide();
        }
        cls_productwarehouse.render_modal(obj.data.info);
      }
      cls_general.shot_toast_bs(obj.message);
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }


  update(productwarehouse_id){
    cls_general.validate_form(document.getElementById('form_edit_productwarehouse'));
    var minimun = document.getElementById('minimunquantity_toasign').value;
    var maximun = document.getElementById('maximunquantity_toasign').value;

    if (cls_general.is_empty_var(minimun) === 0 || cls_general.is_empty_var(maximun) === 0) {
      return swal("Debe llenar los campos marcados.");
    }
    if (isNaN(minimun) === 0 || isNaN(maximun) === 0) {
      return swal("Debe ingresar numeros enteros.");
    }
    var url = '/productwarehouse/' + productwarehouse_id;
    var method = 'PUT';
    var body = JSON.stringify({ a: productwarehouse_id, c: minimun, d: maximun });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('minimunquantity_toasign').value = '';
        document.getElementById('maximunquantity_toasign').value = '';
        cls_warehouse.productwarehouse_list = obj.data.all;
        cls_warehouse.filter(document.getElementById('filter_warehouse').value);
        const modal_win = bootstrap.Modal.getInstance('#productwarehouseModal');
        if (modal_win) {
          modal_win.hide();
        }
        cls_general.shot_toast_bs(obj.message);
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

  delete(btn, productwarehouse_id){
    swal({
      title: "¿Desea eliminar este producto de la bodega?",
      text: "Esto podría afectar las recetas.",
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
          var url = '/productwarehouse/' + productwarehouse_id;
          var method = 'DELETE';
          var body = '';
          var funcion = function (obj) {
            if (obj.status === 'success') {
              cls_warehouse.productwarehouse_list = obj.data.all;
              cls_warehouse.filter(document.getElementById('filter_warehouse').value);
              const modal_win = bootstrap.Modal.getInstance('#productwarehouseModal');
              if (modal_win) {
                modal_win.hide();
              }
              cls_general.shot_toast_bs(obj.message);
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