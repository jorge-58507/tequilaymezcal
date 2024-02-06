@extends('layouts.app')
@section('title','Inventario')
@section('css')
  <link rel="stylesheet" href="{{ asset('attached/css/jquery-ui.css') }}">
@endsection
@section('content')

  <!-- Modal -->
  <div class="modal fade" id="providerModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="providerModal_title">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="providerModal_content" class="modal-body">
        </div>
        <div id="providerModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade modal-xl" id="productinputModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="productinputModal_title">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="productinputModal_content" class="modal-body">
        </div>
        <div id="productinputModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade modal-xl" id="paymentproviderModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="paymentproviderModal_title"></h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="paymentproviderModal_content" class="modal-body">
        </div>
        <div id="paymentproviderModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade" id="requisitionModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="requisitionModal_title"></h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="requisitionModal_content" class="modal-body">
        </div>
        <div id="requisitionModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade" id="productoutputModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="productoutputModal_title"></h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="productoutputModal_content" class="modal-body">
        </div>
        <div id="productoutputModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade" id="warehouseModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="warehouseModal_title"></h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="warehouseModal_content" class="modal-body">
        </div>
        <div id="warehouseModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade" id="productwarehouseModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="productwarehouseModal_title"></h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="productwarehouseModal_content" class="modal-body">
        </div>
        <div id="productwarehouseModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>


	<div id="container_stock" class="row">


    <div class="row">
      <div class="col-xs-12 v_scrollable bb_1 border_gray" style="height: 100vh;">
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button class="nav-link active" id="nav-provider-tab" data-bs-toggle="tab" data-bs-target="#tab_warehouse"  type="button" role="tab" aria-controls="nav-home" aria-selected="true">Bodega</button>
            <button class="nav-link" id="nav-provider-tab" data-bs-toggle="tab" data-bs-target="#tab_provider"          type="button" role="tab" aria-controls="nav-home" aria-selected="false">Proveedores</button>
            <button class="nav-link" id="nav-productinput-tab" data-bs-toggle="tab" data-bs-target="#tab_productinput"  type="button" role="tab" aria-controls="nav-home" aria-selected="false" tabindex="-1">Compras</button>
            <button class="nav-link" id="nav-requisition-tab" data-bs-toggle="tab" data-bs-target="#tab_requisition"    type="button" role="tab" aria-controls="nav-home" aria-selected="false" tabindex="-1">Ordenes de C.</button>
            <button class="nav-link" id="nav-productoutput-tab" data-bs-toggle="tab" data-bs-target="#tab_productoutput" type="button" role="tab" aria-controls="nav-home" aria-selected="false" tabindex="-1">Salidas</button>
            <button class="nav-link" id="nav-paymentprovider-tab" data-bs-toggle="tab" data-bs-target="#tab_paymentprovider" type="button" role="tab" aria-controls="nav-home" aria-selected="false" tabindex="-1">Pagos</button>
          </div>
        </nav>

        <div class="tab-content" id="nav-tabContent">
          <div class="tab-pane fade show active" id="tab_warehouse" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
            <div class="row">
              <div class="col-md-12 col-lg-6">
                <div class="input-group my-3">
                  <input type="text" id="filter_warehouse" class="form-control" placeholder="Buscar por nombre o código." onkeyup="cls_warehouse.filter(this.value)">
                  <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_warehouse.filter(document.getElementById('filter_warehouse').value)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="col-md-6 col-lg-2">
                <div class="input-group my-3">
                  <label class="input-group-text" for="warehouseTypefilter">Tipo</label>
                  <select id="warehouseTypefilter" class="form-select">
                    <option value="0"  >Bodega</option>
                    <option value="1"  >Producto</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6 col-lg-4 mt-2">
                <button type="button" class="btn btn-lg btn-primary" onclick="cls_warehouse.create()">Crear Bodega</button> &nbsp;
                <button type="button" class="btn btn-lg btn-primary" onclick="cls_productwarehouse.add_product()">Asignar Producto</button>
              </div>
            </div>
            <div class="row">
              <div id="container_warehouse" class="col-sm-12">
                <div class="row">
                  <div id="container_warehouselist" class="col-6">
                  </div>
                  <div id="container_productlist" class="col-6">
                  </div>                  
                </div>

              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="tab_provider" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
            <div class="row">
              <div class="col-md-12 col-lg-6">
                <div class="input-group my-3">
                  <input type="text" id="filter_provider" class="form-control" placeholder="Buscar por nombre o RUC." onkeyup="cls_provider.filter(this.value)">
                  <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_provider.filter(document.getElementById('filter_provider').value)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="col-md-6 col-lg-4">
                <div class="input-group my-3">
                  <label class="input-group-text" for="providerLimit">Mostrar</label>
                  <select id="providerLimit" class="form-select">
                    <option value="20"  >20</option>
                    <option value="50"  >50</option>
                    <option value="100" >100</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6 col-lg-2 mt-2">
                <button type="button" class="btn btn-lg btn-primary" onclick="cls_provider.create()">Crear</button>
              </div>
            </div>
            <div class="row">
              <div id="container_provider" class="col-sm-12">
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="tab_productinput" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
            <div class="row">
              <div class="col-md-12 col-lg-6">
                <div class="input-group my-3">
                  <input type="text" id="filter_productinput" class="form-control" placeholder="Buscar por numero." onkeyup="cls_productinput.filter(this.value)">
                  <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_productinput.filter(document.getElementById('filter_productinput').value)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="col-md-6 col-lg-3">
                <div class="input-group my-3">
                  <label class="input-group-text" for="productinputDatefilter">Fecha</label>
                  <input type="text" name="productinputDatefilter" id="productinputDatefilter" class="form-control" value="" onchange="event.preventDefault(); cls_productinput.filter(document.getElementById('filter_productinput').value)">
                </div>
              </div>
              <div id="container_productinput" class="col-sm-12">
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="tab_requisition" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
            <div class="row">
              <div class="col-md-12 col-lg-6">
                <div class="input-group my-3">
                  <input type="text" id="filter_requisition" class="form-control" placeholder="Buscar por numero o proveedor." onkeyup="cls_requisition.filter(this.value)">
                  <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_requisition.filter(document.getElementById('filter_requisition').value)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div id="container_requisition" class="col-sm-12">

              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="tab_productoutput" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
            <div class="row">
              <div id="container_productoutput" class="col-sm-12">
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="tab_paymentprovider" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
            <div class="row">
              <div class="col-md-12 col-lg-6">
                <div class="input-group my-3">
                  <input type="text" id="filter_paymentprovider" class="form-control" placeholder="Buscar por numero o proveedor." onkeyup="cls_paymentprovider.filter(this.value)">
                  <button class="btn btn-outline-secondary" type="button" id="" onclick="cls_paymentprovider.filter(document.getElementById('filter_paymentprovider').value)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div id="container_paymentprovider" class="col-sm-12">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

@endsection

@section('javascript')
	<script src="{{ asset('attached/js/stock.js') }}"></script>
	<script src="{{ asset('attached/js/sweetalert.js') }}"></script>
	<script src="{{ asset('attached/js/jquery-ui.min_edit.js') }}"></script>
	
	<script type="text/javascript">
    var raw_warehouse = JSON.parse('<?php echo json_encode($data['warehouse_list']) ?>');
    var raw_productwarehouse = JSON.parse('<?php echo json_encode($data['productwarehouse_list']) ?>');
		var cls_warehouse = new class_warehouse(raw_warehouse,raw_productwarehouse);
    var cls_productwarehouse = new class_productwarehouse;

		var raw_provider = JSON.parse('<?php echo json_encode($data['provider_list']) ?>');
		var cls_provider = new class_provider(raw_provider);

    var productinput = JSON.parse('<?php echo json_encode($data['processed_productinput']) ?>');
		var cls_productinput = new class_productinput(productinput);

    var requisition = JSON.parse('<?php echo json_encode($data['processed_requisition']) ?>');
		var cls_requisition = new class_requisition(requisition);

    var paymentprovider = JSON.parse('<?php echo json_encode($data['paymentprovider_list']) ?>');
    var cls_paymentprovider = new class_paymentprovider(paymentprovider);

    var paymentmethod = JSON.parse('<?php echo json_encode($data['paymentmethod']) ?>');
		const cls_paymentmethod = new class_paymentmethod(paymentmethod);

    var productlist = JSON.parse('<?php echo json_encode($data['productlist']) ?>');
    var productcategorylist = JSON.parse('<?php echo json_encode($data['productcategory']) ?>');
		const cls_product = new class_product(productlist,productcategorylist);

    var productoutput = JSON.parse('<?php echo json_encode($data['productoutput_list']) ?>');
		const cls_productoutput = new class_productoutput(productoutput);

    var cls_payment = new class_payment;

    

		document.addEventListener('DOMContentLoaded', function() {
      cls_provider.filter('');
		});
    document.getElementById('nav-provider-tab').addEventListener('click', () => {
      cls_provider.filter('');
    });
    document.getElementById('nav-productinput-tab').addEventListener('click', () => {
      cls_productinput.render('');
    });
    document.getElementById('nav-requisition-tab').addEventListener('click', () => {
      cls_requisition.render('');
    });
    document.getElementById('nav-productoutput-tab').addEventListener('click', () => {
      cls_productoutput.render('');
    });
    document.getElementById('nav-paymentprovider-tab').addEventListener('click', () => {
      cls_paymentprovider.index();
    });

    $(function () {      
      $("#productinputDatefilter" ).datepicker();
    });
  </script>
    {{-- ##############    JQUERY   ############### --}}
  <script type="text/javascript">
  </script>
@endsection