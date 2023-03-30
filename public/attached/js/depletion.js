class class_product {
  constructor(product_list) {
    this.product_list = product_list;
  }
  look_for(str, limit) {
    var haystack = cls_product.product_list;
    var needles = str.split(' ');
    var raw_filtered = [];
    var counter = 0;
    for (var i in haystack) {
      if (counter >= limit) { break; }
      var ocurrencys = 0;
      for (const a in needles) {
        if (haystack[i]['tx_product_value'].toLowerCase().indexOf(needles[a].toLowerCase()) > -1) { ocurrencys++ } else {
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
  generate_selectablelist(filtered) {
    var content = '<ul class="list-group">';
    filtered.map((product) => {
      content += `<li class="list-group-item cursor_pointer fs_20 text-truncate" onclick="cls_product.add_selected('${product.tx_product_slug}')">${product.tx_product_code} - ${product.tx_product_value}</li>`;
    })
    content += '</ul>';
    return content;
  }
  add_selected(slug) {
    var url = '/product/' + slug;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var raw_measure = obj.data.measure_list.find((measure) => { return measure.tx_measure_product_relation === 1 })
        swal({
          title: 'Cantidad desperdiciada',
          text: "Ingrese la cantidad expresada en " + raw_measure.tx_measure_value,

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

          obj.data.product.tx_articleproduct_quantity = quantity;
          obj.data.product.articleproduct_ai_product_id = obj.data.product.ai_product_id;
          cls_depletion.selected.push(obj.data.product);

          var selected = cls_depletion.generate_selected(cls_depletion.selected);
          document.getElementById('product_selected').innerHTML = selected.content;
        });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
}
class class_article {
  constructor(article_List) {
    this.article_list = article_List;
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
  generate_selectablelist(filtered){
    var content = '<ul class="list-group">';
    filtered.map((article) => {
      content += `<li class="list-group-item cursor_pointer fs_20 text-truncate" onclick="cls_article.add_selected('${article.tx_article_slug}','${article.tx_article_value}')">${article.tx_article_code} - ${article.tx_article_value}</li>`;
    })
    content += '</ul>';
    return content;
  }
  add_selected(slug,value){
    var url = '/depletion/'+slug+'/article';
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        console.log(obj.data.product_list);
        obj.data.product_list.map((product)=>{
          cls_depletion.selected.push(product);
        })
        var selected = cls_depletion.generate_selected(cls_depletion.selected);
        document.getElementById('product_selected').innerHTML = selected.content;
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
}
class class_depletion {
  constructor(raw_processed) {
    this.selected = [];
    this.processed = raw_processed;
  }
  index() {
    var content = `
      <div class="row">
        <div class="col-md-12 col-lg-6">
          <div class="row">
            <div class="col-sm-6">
              <span>Productos Seleccionados</span>
            </div>
            <div id="product_selected" class="col-xs-12 v_scrollable" style="height: 40vh">
            </div>
            <div class="col-xs-8 input-group mb-1" style="height: 5vh">
              <input type="text" id="productFilter" class="form-control" placeholder="Buscar por C&oacute;digo o descripci&oacute;n" onkeyup="cls_depletion.filter_product(this.value)">
              <button class="btn btn-outline-secondary" type="button" onclick="cls_depletion.filter_product(document.getElementById('productFilter').value)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </button>
            </div>
            <div class="col-xs-4 mb-3">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="depletionHaystack" id="inlineRadio1" value="article" checked>
                <label class="form-check-label" for="inlineRadio1">Articulo</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="depletionHaystack" id="inlineRadio2" value="product">
                <label class="form-check-label" for="inlineRadio2">Producto</label>
              </div>
            </div>
            <span>Listado de Productos</span>
            <div id="product_list" class="col-xs-12 v_scrollable" style="height: 30vh">
            </div>
            <div class="col-xs-12 text-center" style="height: 5vh">
              <button class="btn btn-success" type="button" onclick="cls_depletion.process_selected()">Procesar</button>
            </div>
          </div>
        </div>

        <div class="col-md-12 col-lg-6">
          <div class="row">
            <span>Listado de Mermas</span>
            <div id="depletionList" class="col-sm-12 v_scrollable" style="height: 70vh">

            </div>
            <div class="col-sm-12 pt-4">
              <div class="d-grid gap-2">
                <button id="btn_aproveall" class="btn btn-warning" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
                  </svg> &nbsp; Aprobar Todo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('container_depletion').innerHTML = content;
    document.getElementById('btn_aproveall').addEventListener('click',()=>{ cls_depletion.approve_all(); });
  }
  filter_product(str){
    var hay = $("input[name=depletionHaystack]:checked").val();
    switch (hay) {
      case 'article':
        var content = cls_article.generate_selectablelist(cls_article.look_for(str,50));
        document.getElementById('product_list').innerHTML = content;
        break;
      case 'product':
        var content = cls_product.generate_selectablelist(cls_product.look_for(str, 50));
        document.getElementById('product_list').innerHTML = content;
        break;
    }
  }
  generate_selected(raw_selected){
    var content = '<ul class="list-group">';
    raw_selected.map((product, index) => {
      content += `
        <li class="list-group-item cursor_pointer text-truncate">
          ${product.tx_articleproduct_quantity} - ${product.tx_product_value}<br/>
          <div class="text-center">
            <button class="btn btn-warning" type="button" onclick="cls_depletion.delete_selected(${index})">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
              </svg>
            </button>
          </div>
        </li>
      `;
    })
    content += '</ul>';
    return { 'content': content };
  }
  delete_selected(index){
    var selected_list = cls_depletion.selected;
    selected_list.splice(index, 1);
    cls_depletion.selected = selected_list;
    var selected = cls_depletion.generate_selected(cls_depletion.selected);
    document.getElementById('product_selected').innerHTML = selected.content;
  }
  process_selected(){
    var url = '/depletion/';
    var method = 'POST';
    var body = JSON.stringify({a: cls_depletion.selected });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_depletion.processed = obj.data.depletion.order_status;
        document.getElementById('depletionList').innerHTML = cls_depletion.generate_processed(cls_depletion.processed);

        cls_depletion.selected = [];
        var selected = cls_depletion.generate_selected(cls_depletion.selected);
        document.getElementById('product_selected').innerHTML = selected.content;

        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  generate_processed(raw_processed){
    var content = '<div class="list-group">';
    raw_processed.map((product, index) => {
      var bg_status = '';
      var btn = '';
      if(product.tx_depletion_status === 1){
        bg_status = 'text-bg-success'
      }else {
        if (product.tx_depletion_status === 2) {
          bg_status = 'text-bg-secondary'
        } else{
          btn = `
            <button class="btn btn-secondary" type="button" onclick="cls_depletion.approve(${index})">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
              </svg>
            </button>
            &nbsp;
            <button class="btn btn-warning" type="button" onclick="cls_depletion.delete(${index})">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-octagon" viewBox="0 0 16 16">
                <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          `;
        }
      }
      content += `
        <a href="#" class="list-group-item  cursor_pointer text-truncate ${bg_status}">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${product.tx_depletion_quantity} - ${product.tx_product_value}</h5>
            <small>${cls_general.datetime_converter(product.created_at)}</small>
          </div>
          <div class="text-end">
            ${btn}
          </div>
        </a>
      `;
    })
    content += '</ul>';
    return content;
  }
  approve(index){
    var depletion_id = raw_processed[index].ai_depletion_id;
    var url = '/depletion/'+depletion_id+'/aprove';
    var method = 'PUT';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_depletion.processed = obj.data.depletion.order_status;
        document.getElementById('depletionList').innerHTML = cls_depletion.generate_processed(cls_depletion.processed);

        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  approve_all() {
    var url = '/depletion/approve_all';
    var method = 'PUT';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_depletion.processed = obj.data.depletion.order_status;
        document.getElementById('depletionList').innerHTML = cls_depletion.generate_processed(cls_depletion.processed);

        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  delete(index) {
    var depletion_id = raw_processed[index].ai_depletion_id;
    var url = '/depletion/' + depletion_id;
    var method = 'DELETE';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_depletion.processed = obj.data.depletion.order_status;
        document.getElementById('depletionList').innerHTML = cls_depletion.generate_processed(cls_depletion.processed);

        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

}