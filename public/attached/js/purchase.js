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

class class_purchase{
  index(){
    var content_notprocesed = cls_productinput.generate_notprocesed(cls_productinput.notprocesed);
    var content_procesed = cls_productinput.generate_processed(cls_productinput.procesed);

    var content = `
      <div class="col-sm-6">
        <div class="row">
          <div class="col-lg-6">
            <label for="notprocesedFilter" class="form-label">Buscar</label>
            <div class="input-group mb-3">
              <input type="text" id="notprocesedFilter" class="form-control" placeholder="Buscar por O.C. o proveedor">
              <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_productinput.filter(document.getElementById('notprocesedFilter').value, 0, 'container_productinputnotprocesed')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="col-lg-6">
            <label for="notprocesedDatefilter" class="form-label">Fecha</label>
            <input type="text" class="form-control" id="notprocesedDatefilter" placeholder="">
          </div>
        </div>
        <div class="row">
          <span>Listado de Ordenes Preprocesadas</span>
          <div id="container_productinputnotprocesed" class="col-sm-12 v_scrollable" style="height: 70vh">
            ${content_notprocesed}
          </div>
        </div>
        <div class="row">
          <div class="col text-center">
            <button type="button" class="btn btn-lg btn-secondary" onclick="cls_requisition.render();">Orden de Compra <span class="badge text-bg-warning">${low_inventory}</span></button>
            &nbsp;
            <button type="button" class="btn btn-lg btn-primary" onclick="cls_directpurchase.directPurchase_init();">Compra Directa</button>
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="row">
          <div class="col-lg-6">
            <label for="procesedFilter" class="form-label">Buscar</label>
            <div class="input-group mb-3">
              <input type="text" id="procesedFilter" class="form-control" placeholder="Buscar por Proveedor">
              <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_productinput.filter(document.getElementById('procesedFilter').value,1,'container_productinputprocesed')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="col-lg-6">
            <label for="procesedDatefilter" class="form-label">Fecha</label>
            <input type="text" class="form-control" id="procesedDatefilter" placeholder="">
          </div>
        </div>
        <div class="row">
          <span>Listado de Compras</span>
          <div id="container_productinputprocesed" class="col-sm-12 v_scrollable" style="height: 70vh">
            ${content_procesed}
          </div>
        </div>
      </div>
    `;
    document.getElementById('container_purchase').innerHTML = content;
    $(function () {      
      $( "#notprocesedDatefilter" ).datepicker();
      $( "#procesedDatefilter" ).datepicker();
    });
  }
}

class class_productinput{
  constructor(notprocesed,procesed){
    this.notprocesed = notprocesed;
    this.procesed = procesed;
    this.opened = [];
  }
  generate_productlist(raw_product, action=1){
    var content = '';
    raw_product.map((product) => {
      content += `
        <tr class="text-center">
          <td class="truncate-text">${product.tx_dataproductinput_description}</td>
          <td class="truncate-text">${product.tx_dataproductinput_quantity} <br/> ${product.tx_measure_value}</td>
          <td class="truncate-text">${cls_general.val_price(product.tx_dataproductinput_price,2,1,1)}</td>
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
  generate_notprocesed(raw_productinput) {
    var content_notprocesed = '<ul class="list-group">';
    raw_productinput.map((productinput) => {
      content_notprocesed += `<li class="list-group-item cursor_pointer fs_20 text-truncate" onclick="cls_productinput.show_notprocesed('${productinput.tx_productinput_slug}')">${productinput.tx_productinput_number} - ${productinput.tx_provider_value} (${cls_general.datetime_converter(productinput.tx_productinput_date)})</li>`;
    })
    return content_notprocesed += '</ul>';
  }
  generate_processed(raw_productinput) {
    var content_procesed = '<ul class="list-group">';
    raw_productinput.map((productinput) => {
      content_procesed += `<li class="list-group-item cursor_pointer fs_20 text-truncate" onclick="cls_productinput.show_procesed('${productinput.tx_productinput_slug}')">${productinput.tx_productinput_number} - ${productinput.tx_provider_value}  (${cls_general.datetime_converter(productinput.tx_productinput_date)})</li>`;

    })
    return content_procesed += '</ul>';
  }
  render(){
    var opened = cls_productinput.opened;
    var data_productinput = cls_productinput.generate_productlist(opened.dataproductinput,1);
    var ticket = (cls_general.is_empty_var(opened.info.tx_productinput_ticket) === 0) ? '' : opened.info.tx_productinput_ticket;
    var content = `
      <div class="col-md-12">
        <div class="row">
          <div class="col-12 col-lg-3">
            <label for="providerProductinput" class="form-label">Proveedor</label>
            <input type="text" id="providerProductinput" class="form-control" readonly onclick="cls_productinput.edit_provider()" value="${opened.info.tx_provider_value}">
          </div>
          <div class="col-12 col-lg-3">
            <label for="dateProductinput" class="form-label">Fecha</label>
            <input type="text" id="dateProductinput" name="dateProductinput"class="form-control" readonly value="${cls_general.date_converter('ymd', 'dmy', opened.info.tx_productinput_date)}" onkeyup="this.value = ''">
          </div>
          <div class="col-12 col-lg-3">
            <label for="ticketProductinput" class="form-label">Ticket Fiscal</label>
            <input type="text" id="ticketProductinput" class="form-control" readonly value="${ticket}">
          </div>
          <div class="col-12 col-lg-3">
            <label for="numberProductinput" class="form-label">Numero</label>
            <span id="numberProductinput" class="form-control">#${opened.info.tx_productinput_number}</span>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 col-lg-4">
            <label for="nontaxableProductinput" class="form-label">No imponible</label>
            <span id="nontaxableProductinput" class="form-control">B/ ${cls_general.val_price(opened.info.tx_productinput_nontaxable,2,1,1)}</span>
          </div>
          <div class="col-md-6 col-lg-4">
            <label for="taxableProductinput" class="form-label">Imponible</label>
            <span id="taxableProductinput" class="form-control">B/ ${cls_general.val_price(opened.info.tx_productinput_taxable, 2, 1, 1)}</span>
          </div>
          <div class="col-md-6 col-lg-4">
            <label for="discounttotalProductinput" class="form-label">T. Descuento</label>
            <span id="discounttotalProductinput" class="form-control">B/ ${cls_general.val_price(opened.info.tx_productinput_discount, 2, 1, 1)}</span>
          </div>
          <div class="col-md-6 col-lg-4">
            <label for="taxtotalProductinput" class="form-label">T. Impuesto</label>
            <span id="taxtotalProductinput" class="form-control">B/ ${cls_general.val_price(opened.info.tx_productinput_tax, 2, 1, 1)}</span>
          </div>
          <div class="col-md-6 col-lg-4">
            <label for="totalProductinput" class="form-label">Total</label>
            <span id="totalProductinput" class="form-control">B/ ${cls_general.val_price(opened.info.tx_productinput_total, 2, 1, 1)}</span>
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
          <div class="col-sm-12 text-center pt-2">
            <button id="deleteProductinput" type="button" class="btn btn-danger">Eliminar</button>
            &nbsp;
            <button type="button" class="btn btn-warning" onclick="window.location.href = '/purchase';">Volver</button>
            &nbsp;
            <button id="processProductinput" type="button" name="${opened.info.tx_productinput_slug}" class="btn btn-primary">Procesar</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('container_purchase').innerHTML = content;
    document.getElementById('processProductinput').addEventListener('click', () => { cls_general.disable_submit(document.getElementById('processProductinput')); cls_productinput.process(document.getElementById('processProductinput').name) });
    document.getElementById('deleteProductinput').addEventListener('click', () =>   { cls_productinput.delete(document.getElementById('processProductinput').name) });
    document.getElementById('ticketProductinput').addEventListener('click', () => {   
      swal({
        title: 'Numero de Factura',
        text: "Ingrese el numero de ticket fiscal.",

        content: {
          element: "input",
          attributes: {
            type: "text",
          },
        },
      })
      .then((number) => {
        if (cls_general.is_empty_var(number) === 0) {
          return swal("Debe ingresar un numero.");
        }
        var url = '/purchase/' + opened.info.tx_productinput_slug + '/ticket';
        var method = 'PUT';
        var body = JSON.stringify({ a: number });
        var funcion = function (obj) {
          if (obj.status === 'success') {
            cls_productinput.opened = obj.data
            document.getElementById('ticketProductinput').value = cls_productinput.opened.info.tx_productinput_ticket;
          } else {
            cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
          }
        }
        cls_general.async_laravel_request(url, method, funcion, body);
      });


    });

    $(function () {
      $("#dateProductinput").datepicker({
        onSelect: function (selectedDate) {
          var url = '/purchase/' + opened.info.tx_productinput_slug + '/date';
          var method = 'PUT';
          var body = JSON.stringify({ a: selectedDate });
          var funcion = function (obj) {
            if (obj.status === 'success') {
              cls_productinput.opened = obj.data
            } else {
              cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
            }
          }
          cls_general.async_laravel_request(url, method, funcion, body);
        }
      });
    });
  }
  edit_product(dataproductinput_id){
    var url = '/dataproductinput/'+dataproductinput_id;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var opt_measure = '';
        obj.data.measure.map((measure)=>{
          opt_measure += `<option value="${measure.ai_measure_id}">${measure.tx_measure_value}</option>`;
        })
        var duedate = (cls_general.is_empty_var(obj.data.info.tx_dataproductinput_duedate) === 1) ? cls_general.date_converter('ymd', 'dmy', obj.data.info.tx_dataproductinput_duedate) : '';
        var content = `
          <div class="row">
            <div class="col-sm-12">
              <label for="dataproductinputDescription" class="form-label">Descripci&oacute;n</label>
              <input type="text" id="dataproductinputDescription" class="form-control" readonly value="${obj.data.info.tx_dataproductinput_description}">
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-lg-4">
              <label for="dataproductinputQuantity" class="form-label" >Cantidad</label>
              <input type="text" id="dataproductinputQuantity" class="form-control" value="${obj.data.info.tx_dataproductinput_quantity}" onfocus="cls_general.validFranz(this.id, ['number'],'.')">
            </div>
            <div class="col-md-6 col-lg-4">
              <label for="dataproductinputMeasure" class="form-label">Medida</label>
              <select id="dataproductinputMeasure" class="form-select">
                ${opt_measure}
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-lg-4">
              <label for="dataproductinputPrice" class="form-label">Precio</label>
              <input type="text" id="dataproductinputPrice" class="form-control" value="${obj.data.info.tx_dataproductinput_price}" onfocus="cls_general.validFranz(this.id, ['number'],'.')">
            </div>
            <div class="col-md-6 col-lg-4">
              <label for="dataproductinputDiscountrate" class="form-label">Descuento %</label>
              <input type="text" id="dataproductinputDiscountrate" class="form-control" value="${obj.data.info.tx_dataproductinput_discountrate}" onfocus="cls_general.validFranz(this.id, ['number'],'.')">
            </div>
            <div class="col-md-6 col-lg-4">
              <label for="dataproductinputTaxrate" class="form-label">Impuesto %</label>
              <input type="text" id="dataproductinputTaxrate" class="form-control" value="${obj.data.info.tx_dataproductinput_taxrate}" onfocus="cls_general.validFranz(this.id, ['number'],'.')">
            </div>
            <div class="col-md-6 col-lg-4">
              <label for="dataproductinputDuedate" class="form-label">F. Vencimiento<label>
              <input type="text" id="dataproductinputDuedate" class="form-control" value="${duedate}">
            </div>
          </div>

        `;
        document.getElementById('dataproductinputModal_content').innerHTML = content;
        document.getElementById('dataproductinputModal_footer').innerHTML = `
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button id="updateDataproductinput" type="button" name="${obj.data.info.ai_dataproductinput_id}" class="btn btn-primary">Guardar</button>
        `;
        document.getElementById('dataproductinputMeasure').value = obj.data.info.dataproductinput_ai_measurement_id;
        const modal = new bootstrap.Modal('#dataproductinputModal', {})
        modal.show();

        document.getElementById('updateDataproductinput').addEventListener('click',() => {
          cls_productinput.update_dataproductinput(document.getElementById('updateDataproductinput').name);
        });
        $("#dataproductinputDuedate").datepicker();

      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  delete_product(dataproductinput_id){
    var url = '/dataproductinput/' + dataproductinput_id;
    var method = 'DELETE';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_productinput.opened = obj.data.opened
        cls_productinput.render();
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  async update_dataproductinput(dataproductinput_id) {
    var quantity = document.getElementById('dataproductinputQuantity').value;
    var measure_id = document.getElementById('dataproductinputMeasure').value;
    var price = document.getElementById('dataproductinputPrice').value;
    var discountrate = document.getElementById('dataproductinputDiscountrate').value;
    var taxrate = document.getElementById('dataproductinputTaxrate').value;
    var duedate = document.getElementById('dataproductinputDuedate').value;
    
    if (cls_general.is_empty_var(quantity) === 0 || cls_general.is_empty_var(measure_id) === 0 || cls_general.is_empty_var(price) === 0 || cls_general.is_empty_var(discountrate) === 0 || cls_general.is_empty_var(taxrate) === 0 || cls_general.is_empty_var(dataproductinput_id) === 0) {
      cls_general.shot_toast_bs('Todos los campos deben estar llenos.',{bg: 'text-bg-warning'});
      return false;
    }

    var index = cls_productinput.opened.dataproductinput.findIndex((data) => { return data.ai_dataproductinput_id == dataproductinput_id });
    cls_productinput.opened.dataproductinput[index].tx_dataproductinput_discountrate = parseFloat(discountrate);
    cls_productinput.opened.dataproductinput[index].tx_dataproductinput_price = parseFloat(price);
    cls_productinput.opened.dataproductinput[index].tx_dataproductinput_taxrate = parseFloat(taxrate);
    cls_productinput.opened.dataproductinput[index].tx_dataproductinput_quantity = parseFloat(quantity);

    var raw_calculate = []
    cls_productinput.opened.dataproductinput.map((data) => {
      raw_calculate.push({ price: data.tx_dataproductinput_price, discount: data.tx_dataproductinput_discountrate, tax: data.tx_dataproductinput_taxrate, quantity: data.tx_dataproductinput_quantity })
    })

    var total_productinput = await cls_general.calculate_sale(raw_calculate)

    var total = await cls_general.calculate_sale([{price: price, discount: discountrate, tax: taxrate, quantity: quantity}])
    var url = '/dataproductinput/' + dataproductinput_id;
    var method = 'PUT';
    var body = JSON.stringify({a: quantity, b: measure_id, c: price, d: discountrate, e: taxrate, f: total, g: duedate, h: total_productinput });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_productinput.opened = obj.data.opened
        cls_productinput.render();
        const Modal = bootstrap.Modal.getInstance('#dataproductinputModal');
        Modal.hide();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
  show_notprocesed(slug){
    var url = '/purchase/'+slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_productinput.opened = obj.data.productinput.opened;
        cls_productinput.render();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);


  }
  show_procesed(slug) {
    var url = '/purchase/' + slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var opened = obj.data.productinput.opened;
        // LLENAR ESTE CONTENT
        var data_productinput = cls_productinput.generate_productlist(opened.dataproductinput,0);

        var content = `
          <div class="row">
            <div class="col-sm-12">

              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-12 col-lg-6">
                    <label for="providerProductinput" class="form-label">Proveedor</label>
                    <input type="text" id="providerProductinput" class="form-control" readonly onclick="cls_productinput.edit_provider()" value="${opened.info.tx_provider_value}">
                  </div>
                  <div class="col-md-12 col-lg-6">
                    <label for="numberProductinput" class="form-label">Numero</label>
                    <span id="numberProductinput" class="form-control">#${opened.info.tx_productinput_number}</span>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 col-lg-4">
                    <label for="nontaxableProductinput" class="form-label">No imponible</label>
                    <span id="nontaxableProductinput" class="form-control">B/ ${cls_general.val_price(opened.info.tx_productinput_nontaxable, 2, 1, 1)}</span>
                  </div>
                  <div class="col-md-6 col-lg-4">
                    <label for="taxableProductinput" class="form-label">Imponible</label>
                    <span id="taxableProductinput" class="form-control">B/ ${cls_general.val_price(opened.info.tx_productinput_taxable, 2, 1, 1)}</span>
                  </div>
                  <div class="col-md-6 col-lg-4">
                    <label for="discounttotalProductinput" class="form-label">T. Descuento</label>
                    <span id="discounttotalProductinput" class="form-control">B/ ${cls_general.val_price(opened.info.tx_productinput_discount, 2, 1, 1)}</span>
                  </div>
                  <div class="col-md-6 col-lg-4">
                    <label for="taxtotalProductinput" class="form-label">T. Impuesto</label>
                    <span id="taxtotalProductinput" class="form-control">B/ ${cls_general.val_price(opened.info.tx_productinput_tax, 2, 1, 1)}</span>
                  </div>
                  <div class="col-md-6 col-lg-4">
                    <label for="totalProductinput" class="form-label">Total</label>
                    <span id="totalProductinput" class="form-control">B/ ${cls_general.val_price(opened.info.tx_productinput_total, 2, 1, 1)}</span>
                  </div>
                  <div class="col-md-6 col-lg-4 pt-3 text-center">
                    <button id="returnProductinput" type="button" name="${opened.info.tx_productinput_slug}" class="btn btn-warning btn-lg">Devolver</button>
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
              </div>
            </div>
          </div>
        `;
        document.getElementById('productinputModal_content').innerHTML = content;
        const modal = new bootstrap.Modal('#productinputModal', {})
        modal.show();
        document.getElementById('returnProductinput').addEventListener('click', () => { cls_productinput.return_productinput(document.getElementById('returnProductinput').name); });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  look_for(str,status,date_i) {
    return new Promise(resolve => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        
        var haystack = (status === 0) ? cls_productinput.notprocesed : cls_productinput.procesed;
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          var ocurrencys = 0;
          for (const a in needles) {
            if (date_i.length > 0) {
              var raw_date = haystack[i]['tx_productinput_date'].split(' ');
              if (haystack[i]['tx_productinput_status'] === status && cls_general.datetime_converter(raw_date[0]) === date_i) { 
                if (haystack[i]['tx_provider_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_productinput_number'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
              }
            }else{
              if (haystack[i]['tx_productinput_status'] === status) {
                if (haystack[i]['tx_provider_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_productinput_number'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
              }
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
  async filter(str, status, field_str) {

    if (field_str === 'container_productinputnotprocesed') {
      var date_i = document.getElementById('notprocesedDatefilter').value;
      var filtered = await cls_productinput.look_for(str,status,date_i);
      document.getElementById(field_str).innerHTML = cls_productinput.generate_notprocesed(filtered);
    } else {
      var date_i = document.getElementById('procesedDatefilter').value;
      var filtered = await cls_productinput.look_for(str, status, date_i);
      document.getElementById(field_str).innerHTML = cls_productinput.generate_processed(filtered);
    }
  }
  
  process(productinput_slug){
    var url = '/purchase/' + productinput_slug;
    var method = 'PUT';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_productinput.notprocesed = obj.data.productinput.notprocesed;
        cls_productinput.procesed = obj.data.productinput.procesed;
        cls_directpurchase.saved_list = obj.data.directpurchase.list;
        cls_productinput.opened = [];
        cls_purchase.index();
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  delete(productinput_slug){
    var url = '/purchase/' + productinput_slug;
    var method = 'DELETE';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_requisition.requisition_notprocesed = obj.data.requisition.notprocesed;
        cls_requisition.requisition_procesed    = obj.data.requisition.procesed;

        cls_productinput.notprocesed  = obj.data.productinput.notprocesed;
        cls_productinput.procesed     = obj.data.productinput.procesed;

        cls_productinput.opened = [];
        cls_purchase.index();
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  return_productinput(productinput_slug){
    var url = '/purchase/'+productinput_slug+'/return';
    var method = 'DELETE';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_productinput.notprocesed = obj.data.productinput.notprocesed;
        cls_productinput.procesed = obj.data.productinput.procesed;
        cls_productinput.opened = [];
        cls_purchase.index();

        const Modal = bootstrap.Modal.getInstance('#productinputModal');
        Modal.hide();
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
}

class class_requisition{
  constructor(requisition_procesed, requisition_notprocesed){
    this.requisition_procesed = requisition_procesed;
    this.requisition_notprocesed = requisition_notprocesed;
    this.product_added = [];
  }
  render(){
    var content_category = '';
    cls_product.productcategory.map((category) => {
      content_category += `<button class="btn btn-primary" style="height: 8vh;" onclick="cls_product.filter_category('${category.tx_productcategory_value}');">${category.tx_productcategory_value}</button> &nbsp;`;
    })
    var content = `
      <div class="row">
        <div class="col-md-12 col-lg-5">
          <div class="row">
            <div class="col-sm-6">
              <span>Productos Seleccionados</span>
            </div>
            <div class="col-sm-6 bs_1 border_gray radius_10 text-bg-danger text-truncate text-right">
              <span id="span_requisitionTotal"><h5>Total: B/ 0.00</h5></span>
            </div>
            <div id="product_selected" class="col-sm-12 v_scrollable" style="height: 40vh">
            </div>
            <div class="col-sm-12 input-group mb-3 pt-2" style="height: 8vh">
              <input type="text" id="productFilter" class="form-control" placeholder="Buscar por código o descripción" onkeyup="cls_product.filter(this.value)">
              <button class="btn btn-outline-secondary" type="button" onclick="cls_product.filter(document.getElementById('productFilter').value)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                </svg>
              </button>
            </div>
            <span>Listado de Productos</span>
            <div id="product_list" class="col-sm-12 v_scrollable" style="height: 25vh">
            </div>
            <div class="col-sm-12 h_scrollable pt-2" style="height: 12vh; white-space: nowrap;">
              ${content_category}
            </div>
          </div>
        </div>
        <div class="col-md-12 col-lg-1 text-center">
          <div class="row">
            <div class="col-md-12 text-center" style="height:60vh; display: flex; align-items: center;">
              <button id="btn_requisitionprocess" class="btn tmred_bg btn-lg h_150" onclick="cls_requisition.save();">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
                </svg>
              </button>
            </div>
            <div class="col-md-12 text-center" style="height:20vh;display: flex;align-items: bottom;">
              <button class="btn btn-secondary btn-lg h_50" onclick="window.location.href = '/purchase';">
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
              <label for="requisitionFilter" class="form-label">Buscar</label>
              <div class="input-group mb-3">
                <input type="text" id="requisitionFilter" class="form-control" placeholder="Buscar por O.C. o proveedor">
                <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_requisition.filter()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="col-lg-6">
              <label for="requisitionDatefilter" class="form-label">Fecha</label>
              <input type="text" class="form-control" id="requisitionDatefilter" placeholder="">
            </div>
          </div>
          <div class="row">
            <span>Listado de Ordenes de C.</span>
            <div id="requisitionList" class="col-sm-12 v_scrollable" style="height: 70vh">
            </div>
          </div>
        </div>
      </div>

    `;
    document.getElementById('container_purchase').innerHTML = content;
    document.getElementById('product_list').innerHTML = cls_product.generate_productlist(cls_product.productlist);
    document.getElementById('requisitionList').innerHTML = cls_requisition.generate_requisitionlist(cls_requisition.requisition_notprocesed);
    $(function () {
      $("#requisitionDatefilter").datepicker();
    });
  }
  generate_requisitionlist(raw_requisition) {
    var content = '<ul class="list-group">';
    raw_requisition.map((requisition) => {
      content += `<li class="list-group-item cursor_pointer fs_20 text-truncate" onclick="cls_requisition.show('${requisition.tx_requisition_slug}')">${requisition.tx_requisition_number} - ${requisition.tx_provider_value}</li>`;
    });
    content += '</ul>';
    return content;
  }
  async product_total(){
    var product_quantity = document.getElementById('productQuantity').value;
    var product_price = document.getElementById('productPrice').value;
    var product_discountrate = document.getElementById('productDiscountrate').value;
    var product_taxrate = document.getElementById('productTaxrate').value;
    if (cls_general.is_empty_var(product_quantity) === 0 || cls_general.is_empty_var(product_price) === 0 || cls_general.is_empty_var(product_discountrate) === 0 || cls_general.is_empty_var(product_taxrate) === 0) {
      var total = {total: 0.00};
    }else{
      var total = await cls_general.calculate_sale([{price: product_price, discount: product_discountrate, tax: product_taxrate, quantity: product_quantity}]);
    }
    //[{PRICE,discount,tax, quantity}]
    document.getElementById('productTotal').innerHTML = cls_general.val_price(total.total,2,1,1);
  }
  save(){
    if (cls_requisition.product_added.length === 0) {
      cls_general.shot_toast_bs('Debe agregar los productos.'); return false;
    }
    cls_general.disable_submit(document.getElementById('btn_requisitionprocess'),1)

    document.getElementById('requisitionModal_title').innerHTML = `Seleccione el proveedor`;
    document.getElementById('requisitionModal_content').innerHTML = `          
      <div class="row">
        <div class="col-md-12 text-center">
          <button class="btn btn-primary" data-bs-target="#createproviderrequisitionModal" data-bs-toggle="modal">Crear Proveedor</button>
        </div>
        <div class="col-sm-12 pb-1">
          <label for="requisition_providerSelected" class="form-label">Proveedor Elegido</label>
          <input type="text" id="requisition_providerSelected" class="form-control" disabled>
        </div>
        <div class="col-md-12 col-lg-6 pb-1">
          <label for="providerFilter" class="form-label">Buscar Proveedor</label>
          <input type="text" id="providerFilter" class="form-control" onfocus="cls_general.validFranz(this.id, ['word', 'number', 'punctuation', 'mathematic'])" onkeyup="cls_provider.filter(this.value,'container_providerfiltered_requisition')">
        </div>
        <div id="container_providerfiltered_requisition" class="col-sm-12 h_300 v_scrollable"></div>
      </div>
    `;
    document.getElementById('requisitionModal_footer').innerHTML = `
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      <button id="btn_saveRequisition" type="button" class="btn btn-primary" onclick="cls_general.disable_submit(this, 1); cls_requisition.process();">Procesar</button>
    `;
    document.getElementById('container_providerfiltered_requisition').innerHTML = cls_provider.generate_providerlist(cls_provider.providerlist);

    document.getElementById('providerFilter').value = '';
    document.getElementById('providerValue').value = '';
    document.getElementById('providerRUC').value = '';
    document.getElementById('providerDV').value = '';
    document.getElementById('providerTelephone').value = '';
    document.getElementById('providerAddress').value = '';
    document.getElementById('providerObservation').value = '';
    document.getElementById('providerSelected').value = '';
    document.getElementById('providerSelected').name = '';

    const modal = new bootstrap.Modal('#requisitionModal', {})
    modal.show();
  }
  async process(){
    var provider_slug = document.getElementById('requisition_providerSelected').name;

    var raw_product = [];
    cls_requisition.product_added.map((product) => {
      raw_product.push({ price: product.price, discount: product.discountrate, tax: product.taxrate, quantity: product.quantity})
    });
    var raw_total = await cls_general.calculate_sale(raw_product);
    var url = '/requisition/';
    var method = 'POST';
    var body = JSON.stringify({ a: cls_requisition.product_added, b: provider_slug, c: raw_total});
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_requisition.product_added = [];
        document.getElementById('product_selected').innerHTML = cls_product.generate_productselected(cls_requisition.product_added);

        cls_requisition.requisition_notprocesed = obj.data.notprocesed;
        document.getElementById('requisitionList').innerHTML = cls_requisition.generate_requisitionlist(cls_requisition.requisition_notprocesed);
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
        const Modal = bootstrap.Modal.getInstance('#requisitionModal');
        Modal.hide();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  show(slug){
    var url = '/requisition/'+slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('requisitionModal_content').innerHTML = `
          <div class="row">
            <div class="col-sm-8">
              <label for="requisitionProviderselected" class="form-label">Proveedor Elegido</label>
              <input type="text" id="requisitionProviderselected" class="form-control" readonly onclick="cls_requisition.change_provider('${obj.data.requisition.tx_requisition_slug}')">
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
        `;
        document.getElementById('requisitionModal_footer').innerHTML = `
          <button id="deleteRequisition" type="button" class="btn btn-danger">Eliminar</button>
          <button id="prinRequisition" type="button" class="btn btn-info">Imprimir</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button id="processRequisition" type="button" class="btn btn-success btn-lg">Ingresar</button>
        `;

        document.getElementById('requisitionSlug').value = obj.data.requisition.tx_requisition_slug;
        document.getElementById('requisitionProviderselected').value = obj.data.requisition.tx_provider_value;
        document.getElementById('requisitionDate').value = cls_general.datetime_converter(obj.data.requisition.created_at);
        document.getElementById('requisitionSubtotal').value = cls_general.val_price(obj.data.requisition.tx_requisition_nontaxable + obj.data.requisition.tx_requisition_taxable - obj.data.requisition.tx_requisition_discount, 2, 1, 1);
        document.getElementById('requisitionTax').value = cls_general.val_price(obj.data.requisition.tx_requisition_tax, 2, 1, 1);
        document.getElementById('requisitionTotal').value = cls_general.val_price(obj.data.requisition.tx_requisition_total,2,1,1);
        document.getElementById('container_datarequisition').innerHTML = cls_requisition.generate_datalist(obj.data.datarequisition);

        const modal = new bootstrap.Modal('#requisitionModal', {})
        modal.show();

        document.getElementById('deleteRequisition').addEventListener('click', function () {
          cls_general.disable_submit(this, 1)
          cls_requisition.delete(slug);
        }); 
        document.getElementById('prinRequisition').addEventListener('click', function (el) {
          cls_general.print_html('/print_requisition/' + slug);
        }); 
        document.getElementById('processRequisition').addEventListener('click', function () {
          cls_general.disable_submit(this, 1)
          cls_requisition.get_requisition(slug);
        }); 

      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_datalist(raw_requisition){
    var content = '<h5>Contenido</h5><div class="list-group">';
    raw_requisition.map((data) => {
      content += `
        <a href="#" class="list-group-item list-group-item-action" aria-current="true">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${data.tx_datarequisition_quantity}.- ${data.tx_datarequisition_description}</h5>
            <small>B/ ${cls_general.val_price(data.tx_datarequisition_price, 2, 1, 1) }</small>
          </div>
          <small>B/ ${cls_general.val_price(data.tx_datarequisition_total, 2, 1, 1) }</small>
        </a>
      `;
    })
    return content +'</div >';
  }
  change_provider(requisition_slug){
    document.getElementById('requisitionModal_title').innerHTML = `Seleccione el proveedor`;
    document.getElementById('requisitionModal_content').innerHTML = `          
      <div class="row">
        <div class="col-md-12 text-center">
          <button class="btn btn-primary" id="btn_createprovider_updrequisition" name="${requisition_slug}" onclick="cls_provider.create('${requisition_slug}')">Crear Proveedor</button>
        </div>
        <div class="col-md-12 col-lg-6 pb-1">
          <label for="providerFilter" class="form-label">Buscar Proveedor</label>
          <input type="text" id="" class="form-control" onfocus="cls_general.validFranz(this.id, ['word', 'number', 'punctuation', 'mathematic'])" onkeyup="cls_provider.filter(this.value,'container_providerfiltered_requisition')">
        </div>
        <div id="container_providerfiltered_requisition" class="col-sm-12 h_300 v_scrollable"></div>
      </div>
    `;
    document.getElementById('requisitionModal_footer').innerHTML = ``;
    cls_provider.filter('', 'container_providerfiltered_requisition')
  }
  update_provider(provider_slug, requisition_slug){
    var url = '/requisition/'+requisition_slug+'/provider';
    var method = 'PUT';
    var body = JSON.stringify({ a: provider_slug });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_requisition.requisition_notprocesed = obj.data.notprocesed;
        document.getElementById('requisitionList').innerHTML = cls_requisition.generate_requisitionlist(cls_requisition.requisition_notprocesed);
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  delete(requisition_slug){
    var url = '/requisition/'+requisition_slug;
    var method = 'DELETE';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_requisition.requisition_notprocesed = obj.data.notprocesed;
        document.getElementById('requisitionList').innerHTML = cls_requisition.generate_requisitionlist(cls_requisition.requisition_notprocesed);
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
        const Modal = bootstrap.Modal.getInstance('#requisitionModal');
        Modal.hide();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
  get_requisition(requisition_slug){
    var url = '/provider/'+requisition_slug+'/requisition';
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
  init_productinput() {
    var cb = document.getElementsByClassName('form-check-input');
    var raw_requisitionselected = [];
    for (const a in cb) {
      if (cb[a].checked) {
        raw_requisitionselected.push(cb[a].name)
      }
    }
    if (raw_requisitionselected.length === 0) {
      cls_general.shot_toast_bs('Debe seleccionar alguna orden.',{bg: 'text-bg-warning'});
      return false;
    }

    var url = '/purchase/';
    var method = 'POST';
    var body = JSON.stringify({ a: raw_requisitionselected });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_requisition.requisition_procesed = obj.data.requisition.procesed;
        cls_requisition.requisition_notprocesed = obj.data.requisition.notprocesed;
        
        cls_productinput.notprocesed = obj.data.productinput.notprocesed;

        cls_productinput.opened = obj.data.productinput.opened;
        cls_productinput.render();

        const Modal = bootstrap.Modal.getInstance('#requisitionModal');
        Modal.hide();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
  look_for(str, date_i) {
    return new Promise(resolve => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {

        var haystack = cls_requisition.requisition_notprocesed;
        console.log(haystack);
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          var ocurrencys = 0;
          for (const a in needles) {
            if (date_i.length > 0) {
              var raw_date = haystack[i]['created_at'].split(' ');
              if (haystack[i]['tx_requisition_status'] === 0 && cls_general.datetime_converter(raw_date[0]) === date_i) {
                if (haystack[i]['tx_provider_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_requisition_number'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
              }
            } else {
              if (haystack[i]['tx_requisition_status'] === 0) {
                if (haystack[i]['tx_provider_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1 || haystack[i]['tx_requisition_number'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
              }
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
  async filter() {
    var date_i = document.getElementById('requisitionDatefilter').value;
    var str = document.getElementById('requisitionFilter').value;
    var filtered = await cls_requisition.look_for(str, date_i);
    document.getElementById('requisitionList').innerHTML = cls_requisition.generate_requisitionlist(filtered);
  }
}

class class_provider{
  constructor(providerlist){
    this.providerlist = providerlist;
  }
  generate_providerlist(raw_provider){
    var content = '<ul class="list-group">';
    console.log(raw_provider);
    raw_provider.map((provider)=> {
      content += `<li class="list-group-item cursor_pointer" onclick="cls_provider.set_provider_requisition('${provider.tx_provider_slug}','${provider.tx_provider_value}')">${provider.tx_provider_value}</li>`;
    })
    content += '</ul>';
    return content;
  }
  generate_providerlist_updrequisition(raw_provider) {
    var content = '<ul class="list-group">';
    raw_provider.map((provider) => {
      content += `<li class="list-group-item cursor_pointer" onclick="cls_provider.set_provider_updrequisition('${provider.tx_provider_slug}')">${provider.tx_provider_value}</li>`;
    })
    content += '</ul>';
    return content;
  }
  generate_providerlist_directpurchase(raw_provider) {
    var content = '<ul class="list-group">';
    raw_provider.map((provider) => {
      content += `<li class="list-group-item cursor_pointer" onclick="cls_productcode.set_provider('${provider.tx_provider_slug}', '${provider.tx_provider_value }')">${provider.tx_provider_value}</li>`;
    })
    content += '</ul>';
    return content;
  }
  async save(){
    var description = document.getElementById('providerValue').value;
    var ruc = document.getElementById('providerRUC').value;
    var dv = document.getElementById('providerDV').value;
    var telephone = document.getElementById('providerTelephone').value;
    var address = document.getElementById('providerAddress').value;
    var observation = document.getElementById('providerObservation').value;

    if (cls_general.is_empty_var(description) === 0 || cls_general.is_empty_var(ruc) === 0 || cls_general.is_empty_var(dv) === 0 || cls_general.is_empty_var(telephone) === 0 || cls_general.is_empty_var(address) === 0) {
      cls_general.shot_toast_bs('Todos los campos son obligatorios, excepto Observaciones', {bg: 'text-bg-warning'}); return false;
    }
    var obj = await cls_provider.store({ a: description, b: ruc, c: dv, e: telephone, f: address, g: observation });
    if (obj.status === 'success') {
      cls_provider.providerlist = obj.data.active;
      document.getElementById('btn_providerrequisitionModal').click();
      document.getElementById('providerSelected').value = obj.data.provider.tx_provider_value;
      document.getElementById('providerSelected').name = obj.data.provider.tx_provider_slug;
      document.getElementById('container_providerfiltered').innerHTML = cls_provider.generate_providerlist(cls_provider.providerlist);
    } else {
      cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
    }
  }
  // set_provider(slug, value){
  //   document.getElementById('providerSelected').value = value;
  //   document.getElementById('providerSelected').name = slug;
  // }
  set_provider_requisition(slug, value) {
    document.getElementById('requisition_providerSelected').value = value;
    document.getElementById('requisition_providerSelected').name = slug;
  }

  set_provider_updrequisition(provider_slug){
    var requisition_slug = document.getElementById('btn_createprovider_updrequisition').name;
    cls_requisition.update_provider(provider_slug, requisition_slug);
    const Modal = bootstrap.Modal.getInstance('#requisitionModal');
    Modal.hide();

  }
  look_for(str) {
    return new Promise(resolve => {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        var haystack = cls_provider.providerlist;
        var needles = str.split(' ');
        var raw_filtered = [];
        for (var i in haystack) {
          var ocurrencys = 0;
          for (const a in needles) {
            if (haystack[i]['tx_provider_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ }
          }
          if (ocurrencys === needles.length) {
            raw_filtered.push(haystack[i]);
          }
        }
        resolve(raw_filtered)
      }, 1000)
    });
  }
  async filter(str,field_str) {
    var filtered = await cls_provider.look_for(str);
    switch (field_str) {
      case 'container_providerfiltered_requisition':
        document.getElementById(field_str).innerHTML = cls_provider.generate_providerlist(filtered);        
        break;

      case 'container_providerfiltered_directpurchase':
        document.getElementById(field_str).innerHTML = cls_provider.generate_providerlist_directpurchase(filtered);
        break;

      case 'container_providerfiltered_updrequisition':
        document.getElementById(field_str).innerHTML = cls_provider.generate_providerlist_updrequisition(filtered);
        break;


      default:
        document.getElementById(field_str).innerHTML = cls_provider.generate_providerlist(filtered);
        break;
    }
  }
  create(requisition_slug){
    document.getElementById('requisitionModal_title').innerHTML = `Crear proveedor`;
    document.getElementById('requisitionModal_content').innerHTML = `
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
    document.getElementById('requisitionModal_footer').innerHTML = `
      <button class="btn btn-secondary" onclick="cls_requisition.change_provider('${requisition_slug}')">Volver</button>
      <button id="btn_saveprovider" type="button" class="btn btn-primary" onclick="cls_general.disable_submit(this,1); cls_provider.save_updrequisition('${requisition_slug}')">Guardar</button>
    `;
  }
  async save_updrequisition(requisition_slug){
    var description = document.getElementById('providerValue_updrequisition').value;
    var ruc = document.getElementById('providerRUC_updrequisition').value;
    var dv = document.getElementById('providerDV_updrequisition').value;
    var telephone = document.getElementById('providerTelephone_updrequisition').value;
    var address = document.getElementById('providerAddress_updrequisition').value;
    var observation = document.getElementById('providerObservation_updrequisition').value;

    if (cls_general.is_empty_var(description) === 0 || cls_general.is_empty_var(ruc) === 0 || cls_general.is_empty_var(dv) === 0 || cls_general.is_empty_var(telephone) === 0 || cls_general.is_empty_var(address) === 0) {
      cls_general.shot_toast_bs('Todos los campos son obligatorios, excepto Observaciones', { bg: 'text-bg-warning' }); return false;
    }
    var obj = await cls_provider.store({ a: description, b: ruc, c: dv, e: telephone, f: address, g: observation });
    if (obj.status === 'success') {
      cls_provider.providerlist = obj.data.active;
      cls_requisition.update_provider(obj.data.provider.tx_provider_slug,requisition_slug);
      const Modal = bootstrap.Modal.getInstance('#requisitionModal');
      Modal.hide();
    } else {
      cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
    }
  }
  store(raw_body){
    return new Promise(resolve => {
      var url = '/provider/';
      var method = 'POST';
      var body = JSON.stringify(raw_body);
      var funcion = function (obj) {
        resolve(obj);
      }
      cls_general.async_laravel_request(url, method, funcion, body);
    });
  }
}

class class_product{
  constructor(productlist, productcategory){
    this.productlist = productlist;
    this.productcategory = productcategory;
  }
  generate_productlist(raw_product) {
    var content = '<ul class="list-group">';
    raw_product.map((product) => {
      let bg = '';
      if(product.tx_product_alarm === 1) {
        if(product.tx_product_quantity < product.tx_product_minimum) {
          bg ='text-bg-warning';
        }
        if (product.tx_product_quantity > product.tx_product_maximum) {
          bg = 'text-bg-success';
        }
      } 
      content += `<li class="list-group-item cursor_pointer fs_20 text-truncate ${bg}" onclick="cls_product.show('${product.tx_product_slug}')" title="${product.tx_product_value} (Cant: ${product.tx_product_quantity})">${product.tx_product_code} - ${product.tx_product_value} (Cant: ${product.tx_product_quantity})</li>`;
    });
    content += '</ul>';
    return content;
  }
  look_for(str,origin){
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
          }else{
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
  async filter(str) {
    var filtered = await cls_product.look_for(str,'filter');
    document.getElementById('product_list').innerHTML = cls_product.generate_productlist(filtered);
  }
  async filter_category(category){
    var filtered = await cls_product.look_for(category,'category');
    document.getElementById('product_list').innerHTML = cls_product.generate_productlist(filtered);
  }
  show(product_slug){
    var url = '/product/'+product_slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var opt_productMeasure = '';
        obj.data.measure_list.map((measure) => {
          opt_productMeasure += `<option value="${measure.ai_measure_id}">${measure.tx_measure_value}</option>`;
        })
        if (obj.data.dataproductinput.length > 0) {          
          var productinput_list = '<span>Compras Anteriores</span><ol class="list-group list-group-numbered">';
          obj.data.dataproductinput.map((input) => {
            productinput_list += `
              <li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto">
                  <div class="fw-bold">${input.tx_provider_value}</div>
                  ${cls_general.datetime_converter(input.created_at)}
                </div>
                <span class="badge bg-primary rounded-pill">${cls_general.val_price(input.tx_dataproductinput_price,2,1,1)}</span>
              </li>
            `;
          })
          productinput_list += '</ol>';
        }else{
          var productinput_list = '<span>No hay compras anteriores</span>';
        }

        var content = `
          <div class="row">
            <div class="col-sm-12 text-center text-truncate">
              <h5>Cod. ${obj.data.product.tx_product_code} - ${obj.data.product.tx_product_value}</h5>
              <input type="hidden" name="" id="productId" class="form-control" value="${obj.data.product.ai_product_id}">
            </div>
            <div class="col-md-12 col-lg-8">
              <label for="productDescription">Descripci&oacute;n</label>
              <input type="text" name="" id="productDescription" class="form-control" value="${obj.data.product.tx_product_value}">
            </div>
            <div class="col-md-12 col-lg-4">
              <label for="productMeasure">Medida</label>
              <select name="" id="productMeasure" class="form-select">
                ${opt_productMeasure}
              </select>
            </div>
            <div class="col-md-12 col-lg-4">
              <label for="productDiscountrate">Descuento</label>
              <input type="text" name="" id="productDiscountrate" onblur="cls_requisition.product_total()" class="form-control" value="${obj.data.product.tx_product_discountrate}">
            </div>
            <div class="col-md-12 col-lg-4">
              <label for="productTaxrate">Impuesto</label>
              <input type="text" name="" id="productTaxrate" onblur="cls_requisition.product_total()" class="form-control" value="${obj.data.product.tx_product_taxrate}">
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-lg-4">
              <label for="productQuantity">Cantidad</label>
              <input type="text" name="" id="productQuantity" onblur="cls_requisition.product_total()" class="form-control">
            </div>
            <div class="col-md-12 col-lg-4">
              <label for="productPrice">Precio</label>
              <input type="text" name="" id="productPrice" onblur="cls_requisition.product_total()" class="form-control">
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 text-center pt-3">
              ${productinput_list}
            </div>
          </div>

        `;
        document.getElementById('addproductrequisitionModal_content').innerHTML = content;
        const modal = new bootstrap.Modal('#addproductrequisitionModal', {})
        modal.show();
        setTimeout(() => {
          cls_general.set_focus('productQuantity');
          document.getElementById('addproductRequisition').disabled = false;
        }, 500);

      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  async addproduct(){
    var product_id = document.getElementById('productId').value;
    var product_description = document.getElementById('productDescription').value;
    var select_measure = document.getElementById('productMeasure');
    var product_measureId = select_measure.value;
    var product_measureDescription = select_measure.options[select_measure.selectedIndex].text
    var product_quantity = document.getElementById('productQuantity').value;
    var product_price = document.getElementById('productPrice').value;
    var product_discountrate = document.getElementById('productDiscountrate').value;
    var product_taxrate = document.getElementById('productTaxrate').value;
    if (cls_general.is_empty_var(product_id) === 0 || cls_general.is_empty_var(product_description) === 0 || cls_general.is_empty_var(product_measureId) === 0 || cls_general.is_empty_var(product_quantity) === 0 || cls_general.is_empty_var(product_price) === 0 || cls_general.is_empty_var(product_discountrate) === 0 || cls_general.is_empty_var(product_taxrate) === 0) {
      cls_general.shot_toast_bs('Debe llenar todos los campos', {bg: 'text-bg-warning'});
      return false;
    }
    var added_total = await cls_general.calculate_sale([{ price: product_price, discount: product_discountrate, tax: product_taxrate, quantity: product_quantity }]);
    cls_requisition.product_added.push({ id: product_id, description: product_description, measure_id: product_measureId, measure_description: product_measureDescription, quantity: product_quantity, price: product_price, discountrate: product_discountrate, taxrate: product_taxrate, total: added_total.total});
    var raw_total = [];
    cls_requisition.product_added.map((product) => {
      raw_total.push({ price: product.price, discount: product.discountrate, tax: product.taxrate, quantity: product.quantity })
    })
    var total = await cls_general.calculate_sale(raw_total);
    document.getElementById('span_requisitionTotal').innerHTML = '<h5>Total: B / '+ cls_general.val_price(total.total,2,1,1) + '</h5>';
    const Modal = bootstrap.Modal.getInstance('#addproductrequisitionModal');
    Modal.hide();
    document.getElementById('product_selected').innerHTML = cls_product.generate_productselected(cls_requisition.product_added);
  }
  async deleteproduct(index){
    var product_added = cls_requisition.product_added;
    product_added.splice(index, 1);
    cls_requisition.product_added = product_added;
    document.getElementById('product_selected').innerHTML = cls_product.generate_productselected(cls_requisition.product_added);
    var raw_total = [];
    cls_requisition.product_added.map((product) => {
      raw_total.push({ price: product.price, discount: product.discountrate, tax: product.taxrate, quantity: product.quantity })
    })
    var total = await cls_general.calculate_sale(raw_total);
    document.getElementById('span_requisitionTotal').innerHTML = '<h5>Total: B / ' + cls_general.val_price(total.total, 2, 1, 1) + '</h5>';

  }
  generate_productselected(raw_productselected){
    var content = `<div class="list-group">`;
    
    raw_productselected.map((product,index) => {
      content += `
        <a href="#" class="list-group-item list-group-item-action" aria-current="true">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${product.quantity} - ${product.description}</h5>
            <small>${cls_general.val_price(product.price,2,1,1)}</small>
          </div>
          <p class="mb-1">Medida: ${product.measure_description}</p>
          <div class="text-center">
          <button class="btn btn-warning" type="button" onclick="cls_product.deleteproduct(${index})">
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

  // DIRECT PURCHASE
  generate_productlist_directpurchase(raw_product){
    var content = '<div class=""><span>Listado de productos</span></div><div class="h_400 v_scrollable"><ul class="list-group">';
    raw_product.map((product) => {
      let bg = (product.tx_product_status === 1) ? '' : 'text-bg-secondary';
      content += `<li class="list-group-item cursor_pointer fs_20 text-truncate ${bg}" onclick="cls_product.show_directpurchase('${product.tx_product_slug}')" title="${product.tx_product_value}">${product.tx_product_value}</li>`;
    })
    return content += '</ul></div>';
  }
  async filter_productlist_directpurchase(str) {
    var filtered = await cls_product.look_for(str, 'filter');
    document.getElementById('container_productlist').innerHTML = cls_product.generate_productlist_directpurchase(filtered);
  }
  show_directpurchase(product_slug) {
    var url = '/product/' + product_slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var opt_productMeasure = '';
        obj.data.measure_list.map((measure) => {
          opt_productMeasure += `<option value="${measure.ai_measure_id}">${measure.tx_measure_value} (${measure.tx_measure_product_relation})</option>`;
        })

        var content = `
          <div class="row">
            <div class="col-sm-12 text-center text-truncate">
              <h5>Cod. ${obj.data.product.tx_product_code} - ${obj.data.product.tx_product_value}</h5>
              <input type="hidden" name="" id="productId_directpurchase" class="form-control" value="${obj.data.product.ai_product_id}">
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-lg-4">
              <label for="productMeasure_directpurchase">Medida</label>
              <select name="" id="productMeasure_directpurchase" class="form-select">
                ${opt_productMeasure}
              </select>
            </div>
            <div class="col-12 col-lg-4">
              <label for="productQuantity_directpurchase">Multiplo</label>
              <input type="text" name="" id="productQuantity_directpurchase" class="form-control">
            </div>
            <div class="col-12 col-lg-4">
              <label for="code_directpurchase">C&oacute;digo</label>
              <input type="text" name="" id="code_directpurchase" class="form-control" value="${document.getElementById('filterproductDirectpurchase').value}">
            </div>
          </div>
        `;
        document.getElementById('directpurchaseModal_content').innerHTML = content;
        document.getElementById('directpurchaseModal_footer').innerHTML = `
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          &nbsp;
          <button id="btn_saveproductcode" type="button" class="btn btn-primary">Procesar</button>
        `;
        setTimeout(() => {
          document.getElementById('productQuantity_directpurchase').focus();
        }, 500);
        document.getElementById('btn_saveproductcode').addEventListener('click', () => {  cls_productcode.save_productcode()  });

      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

}

class class_productcode 
{
  constructor (){
    this.directpurchase_list = [];
    this.saved = [];
  }

  edit_provider() {
    document.getElementById('providerrequisitionModal_title').innerHTML = `Seleccione el proveedor`;
    document.getElementById('providerrequisitionModal_content').innerHTML = `          
      <div class="row">
        <div class="col-md-12 text-center">
          <button class="btn btn-primary" data-bs-target="#createproviderrequisitionModal" data-bs-toggle="modal">Crear Proveedor</button>
        </div>
        <div class="col-sm-12 pb-1">
          <label for="providerSelected" class="form-label">Proveedor Elegido</label>
          <input type="text" id="providerSelected" class="form-control" disabled>
        </div>
        <div class="col-md-12 col-lg-6 pb-1">
          <label for="providerFilter" class="form-label">Buscar Proveedor</label>
          <input type="text" id="providerFilter" class="form-control" onfocus="cls_general.validFranz(this.id, ['word', 'number', 'punctuation', 'mathematic'])" onkeyup="cls_provider.filter(this.value,'container_providerfiltered_directpurchase')">
        </div>
        <div id="container_providerfiltered_directpurchase" class="col-sm-12 h_300 v_scrollable"></div>
      </div>
    `;
    document.getElementById('providerrequisitionModal_footer').innerHTML = ``;

    cls_provider.filter('', 'container_providerfiltered_directpurchase')

    const modal = new bootstrap.Modal('#providerrequisitionModal', {})
    modal.show();
  }
  set_provider(provider_slug, provider_value) {
    document.getElementById('providerDirectpurchase').name = provider_slug;
    document.getElementById('providerDirectpurchase').value = provider_value;

    const Modal = bootstrap.Modal.getInstance('#providerrequisitionModal');
    if (Modal != null) {
      Modal.hide();
    }

    document.getElementById('filterproductDirectpurchase').focus();
  }
  get_productcode(str, provider_slug) {
    if (cls_general.is_empty_var(str) === 0) {
      return false;
    }
    var url = '/productcode/' + str + '/show/' + provider_slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var info = obj.data.productcode;
        cls_productcode.add_directpurchase(info)
        var data_directpurchase = cls_productcode.generate_directpurchase_list(cls_productcode.directpurchase_list)
        var content = `
          <table id="tbl_productselected" class="table table-striped table-bordered">
            <thead>
              <tr class="text-center bg-secondary">
                <th scope="col-sm-2">C&oacute;digo</th>
                <th scope="col-sm-4">Descripci&oacute;n</th>
                <th scope="col-sm-2">Cantidad</th>
                <th scope="col-sm-2">Medida</th>
                <th scope="col-sm-2"></th>
              </tr>
            </thead>
            <tbody>
              ${data_directpurchase}
            </tbody>
          </table>
        `;
        document.getElementById('product_selected').innerHTML = content;
      } else {
        var content = `
          <div class="row">
            <div class="col-12">
              <input type="text" class="form-control" id="filter_product" placeholder="Buscar producto">
            </div>
            <div id="container_productlist" class="col-12">
            </div>
          </div>
        `;
        document.getElementById('directpurchaseModal_content').innerHTML = content;
        document.getElementById('container_productlist').innerHTML = cls_product.generate_productlist_directpurchase(cls_product.productlist);
        const modal = new bootstrap.Modal('#directpurchaseModal', {})
        modal.show();

        document.getElementById('filter_product').addEventListener('keyup', () => {
          cls_product.filter_productlist_directpurchase(document.getElementById('filter_product').value);
        });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  save_productcode(){
    var productid = document.getElementById('productId_directpurchase').value;
    var measure = document.getElementById('productMeasure_directpurchase').value;
    var code = document.getElementById('code_directpurchase').value;
    var quantity = document.getElementById('productQuantity_directpurchase').value;

    if (cls_general.is_empty_var(quantity) === 0 || cls_general.is_empty_var(measure) === 0 || cls_general.is_empty_var(code) === 0 || cls_general.is_empty_var(productid) === 0) {
      cls_general.shot_toast_bs('Faltan datos',{bg: 'text-bg-warning'}); return false;
    }
    if (isNaN(quantity)) {
      cls_general.shot_toast_bs('Debe ingresar una cantidad valida.', { bg: 'text-bg-warning' }); return false;
    }
    var url = '/productcode/';
    var method = 'POST';
    var body = JSON.stringify({ a: productid, b: measure, c: code, d: cls_general.val_dec(quantity,2,1,1) });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var info = obj.data.productcode;
        cls_productcode.add_directpurchase(info)
        var data_directpurchase = cls_productcode.generate_directpurchase_list(cls_productcode.directpurchase_list)
        var content = `
          <table id="tbl_productselected" class="table table-striped table-bordered">
            <thead>
              <tr class="text-center bg-secondary">
                <th scope="col-sm-2">C&oacute;digo</th>
                <th scope="col-sm-4">Descripci&oacute;n</th>
                <th scope="col-sm-2">Cantidad</th>
                <th scope="col-sm-2">Medida</th>
                <th scope="col-sm-2"></th>
              </tr>
            </thead>
            <tbody>
              ${data_directpurchase}
            </tbody>
          </table>
        `;
        document.getElementById('product_selected').innerHTML = content;

        const modal_win = bootstrap.Modal.getInstance('#directpurchaseModal');
        modal_win.hide();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }


  // DIRECTPURCHASE
  create_directpurchase() {
    var content = `
      <div class="col-md-12">
        <div class="row">
          <div class="col-12 col-lg-6">
            <label for="providerDirectpurchase" class="form-label">Proveedor</label>
            <input type="text" id="providerDirectpurchase" class="form-control" readonly onclick="cls_productcode.edit_provider()" value="">
          </div>
        </div>
        <div class="row">
          <div id="" class="col-sm-12 pt-4">
            <input type="text" id="filterproductDirectpurchase" class="form-control" value="" placeholder="Buscar por C&oacute;digo">
          </div>
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
                <tr class="text-center bg-secondary">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 text-center pt-2">
            <button type="button" class="btn btn-warning" onclick="window.location.href = '/purchase';">Volver</button>
            &nbsp;
            <button id="processDirectpurchase" type="button" class="btn btn-primary">Procesar</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('container_purchase').innerHTML = content;
    document.getElementById('processDirectpurchase').addEventListener('click', () => { cls_general.disable_submit(document.getElementById('processDirectpurchase')); cls_productcode.process_directpurchase() });
    document.getElementById('filterproductDirectpurchase').addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        if (cls_general.is_empty_var(document.getElementById('providerDirectpurchase').name) === 0) {
          cls_general.shot_toast_bs('Debe seleccionar un proveedor.', { bg: 'text-bg-warning' }); return false;
        }
        cls_productcode.get_productcode(document.getElementById('filterproductDirectpurchase').value, document.getElementById('providerDirectpurchase').name)
      }
    });

    $(function () {
      $("#dateDirectpurchase").datepicker({});
    });
    cls_productcode.edit_provider();
  }
  generate_directpurchase_list(raw_product) {
    var content = '';
    raw_product.map((product,index) => {
      content += `
        <tr class="text-center">
          <td class="truncate-text">${product.code}</td>
          <td class="truncate-text">${product.description}</td>
          <td class="truncate-text">${product.quantity}</td>
          <td class="truncate-text">${product.measure_value}</td>
          <td>
            <button type="button" onclick="cls_productcode.delete_directpurchase(${index})" class="btn btn-danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
              </svg>
            </button>
          </td>
      </tr>`;
    })
    return content;
  }
  add_directpurchase(info){
    var index = cls_productcode.directpurchase_list.findIndex((list) => { return list.code === info.code })
    if (index === -1) { //VERIFICA QUE EL METODO INGRESADO EXISTA
      cls_productcode.directpurchase_list.push({
        code: info.code,
        product_id: info.product_id,
        description: info.description,
        measure_id: info.measure_id,
        measure_value: info.measure_value,
        quantity: parseFloat(info.quantity),
        productcode_id: info.productcode_id
      })
    }else{
      cls_productcode.directpurchase_list[index].quantity += info.quantity;
    }
    document.getElementById('filterproductDirectpurchase').value = '';
  }
  delete_directpurchase(index){
    cls_productcode.directpurchase_list.splice(index,1);
    var data_directpurchase = cls_productcode.generate_directpurchase_list(cls_productcode.directpurchase_list)
    var content = `
          <table id="tbl_productselected" class="table table-striped table-bordered">
            <thead>
              <tr class="text-center bg-secondary">
                <th scope="col-sm-2">C&oacute;digo</th>
                <th scope="col-sm-4">Descripci&oacute;n</th>
                <th scope="col-sm-2">Cantidad</th>
                <th scope="col-sm-2">Medida</th>
                <th scope="col-sm-2"></th>
              </tr>
            </thead>
            <tbody>
              ${data_directpurchase}
            </tbody>
          </table>
        `;
    document.getElementById('product_selected').innerHTML = content;
  }
  process_directpurchase(){
    var provider_slug = document.getElementById('providerDirectpurchase').name;
    if (cls_general.is_empty_var(provider_slug) === 0) {
      cls_general.shot_toast_bs('Seleccione un proveedor.',{bg: 'text-bg-warning'}); return false;
    }
    if (cls_productcode.directpurchase_list.length === 0) {
      cls_general.shot_toast_bs('Debe ingresar productos.', { bg: 'text-bg-warning' }); return false;
    }
    var url = '/directpurchase/';
    var method = 'POST';
    var body = JSON.stringify({ a: cls_productcode.directpurchase_list, b: provider_slug });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_productcode.directpurchase_list = [];
        var data_directpurchase = cls_productcode.generate_directpurchase_list(cls_productcode.directpurchase_list)
        var content = `
          <table id="tbl_productselected" class="table table-striped table-bordered">
            <thead>
              <tr class="text-center bg-secondary">
                <th scope="col-sm-2">C&oacute;digo</th>
                <th scope="col-sm-4">Descripci&oacute;n</th>
                <th scope="col-sm-2">Cantidad</th>
                <th scope="col-sm-2">Medida</th>
                <th scope="col-sm-2"></th>
              </tr>
            </thead>
            <tbody>
              ${data_directpurchase}
            </tbody>
          </table>
        `;
        document.getElementById('product_selected').innerHTML = content;
        document.getElementById('providerDirectpurchase').name = '';
        document.getElementById('providerDirectpurchase').value = '';

        cls_directpurchase.saved_list = obj.data.list;
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
}

class class_directpurchase {
  constructor(raw_list){
    this.saved_list = raw_list;
  }
  directPurchase_init() {
    var content_directpurchase = cls_directpurchase.generate_directpurchase_saved(cls_directpurchase.saved_list);

    var content = `
      <div class="row">
        <div class="col-12 col-lg-6">
          <label for="saved_filter" class="form-label">Buscar</label>
          <div class="input-group mb-3">
            <input type="text" id="filter_directpurchase" class="form-control" placeholder="Buscar por proveedor">
            <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_productcode.filter(document.getElementById('filter_directpurchase').value)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="col-12 col-lg-6 pt-4">
          <button type="button" class="btn btn-primary btn-lg" onclick="cls_productcode.create_directpurchase();">Crear</button>
          &nbsp;
          <button type="button" class="btn btn-secondary btn-lg" onclick="window.location.href = '/purchase';">Volver</button>
        </div>
      </div>
      <div class="row">
        <span>Listado de Ingresos</span>
        <div id="container_directpurchase" class="col-12 v_scrollable" style="height: 70vh">
          ${content_directpurchase}
        </div>
      </div>
    `;
    document.getElementById('container_purchase').innerHTML = content;
    $(function () {
      $("#notprocesedDatefilter").datepicker();
      $("#procesedDatefilter").datepicker();
    });
  }
  generate_directpurchase_saved(raw_list) {
    var content = '<ul class="list-group">';
    raw_list.map((directpurchase) => {
      let bg = (directpurchase.tx_directpurchase_status === 0) ? 'text-bg-secondary' : '';
      content += `<li class="list-group-item cursor_pointer fs_20 text-truncate ${bg}" onclick="cls_directpurchase.show('${directpurchase.tx_directpurchase_slug}')" title="${directpurchase.tx_provider_value}">${directpurchase.tx_provider_value} (${cls_general.datetime_converter(directpurchase.created_at)} ${cls_general.time_converter(directpurchase.created_at)})</li>`;
    });
    content += '</ul>';
    return content;
  }
  show(slug){
    var url = '/directpurchase/'+slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('directpurchaseModal_content').innerHTML = `
          <div class="row">
            <div class="col-sm-8">
              <label for="directpurchaseProviderselected" class="form-label">Proveedor Elegido</label>
              <input type="text" id="directpurchaseProviderselected" class="form-control" readonly onclick="cls_directpurchase.change_provider('${obj.data.info.tx_directpurchase_slug}')" value="${obj.data.info.tx_provider_value}">
              <input type="hidden" id="directpurchaseSlug" value="${slug}">
            </div>
            <div class="col-sm-4">
              <label for="directpurchaseDate" class="form-label">Fecha</label>
              <input type="text" id="directpurchaseDate" class="form-control" disabled value="${cls_general.datetime_converter(obj.data.info.created_at)}">
            </div>            
          </div>            
          <div class="row">
            <div id="container_datadirectpurchase" class="col-sm-12">
              
            </div>
          </div>
        `;
        var btn = (obj.data.info.tx_directpurchase_status === 0) ? `<button id="deletedirectpurchase" type="button" class="btn btn-danger">Eliminar</button>
          <button id="convertdirectpurchase" type="button" class="btn btn-success btn-lg">Ingresar</button>` : ''
        document.getElementById('directpurchaseModal_footer').innerHTML = `
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          ${btn}
        `;

        document.getElementById('container_datadirectpurchase').innerHTML = cls_directpurchase.generate_datalist(obj.data.list);

        const modal = new bootstrap.Modal('#directpurchaseModal', {})
        modal.show();

        document.getElementById('deletedirectpurchase').addEventListener('click', function () {
          cls_general.disable_submit(this, 1)
          cls_directpurchase.delete(slug);
        });
        document.getElementById('convertdirectpurchase').addEventListener('click', function () {
          cls_general.disable_submit(this, 1)
          cls_directpurchase.convert_directpurchase(slug);
        });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
  generate_datalist(raw_list) {
    var content = '<h5>Contenido</h5><div class="list-group">';
    raw_list.map((data) => {
      content += `
        <a href="#" class="list-group-item list-group-item-action" aria-current="true">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${data.tx_datadirectpurchase_quantity}.- ${data.tx_datadirectpurchase_description}</h5>
            <small>${data.tx_measure_value}</small>
          </div>
          <small>${data.tx_productcode_value}</small>
        </a>
      `;
    })
    return content + '</div >';
  }
  delete(slug){
    var url = '/directpurchase/'+slug;
    var method = 'DELETE';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_directpurchase.saved_list = obj.data.list;
        document.getElementById('container_directpurchase').innerHTML = cls_directpurchase.generate_directpurchase_saved(cls_directpurchase.saved_list);
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  convert_directpurchase(slug){
    var url = '/purchase/convert/';
    var method = 'POST';
    var body = JSON.stringify({ a: slug });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_productinput.notprocesed = obj.data.productinput.notprocesed;

        cls_productinput.opened = obj.data.productinput.opened;
        cls_productinput.render();

        const Modal = bootstrap.Modal.getInstance('#directpurchaseModal');
        Modal.hide();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

}