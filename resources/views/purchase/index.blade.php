@extends('layouts.app')
@section('title','Compras')
@section('css')
  <link rel="stylesheet" href="{{ asset('attached/css/jquery-ui.css') }}">
@endsection
@section('content')

  <!-- Modal -->
  <div class="modal fade" id="addproductrequisitionModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="addproductrequisitionModal_title">Ingresar Cantidad</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="addproductrequisitionModal_content" class="modal-body">
        </div>
        <div id="addproductrequisitionModal_footer" class="modal-footer">
          Total: <h5> B/ <span id="productTotal">0.00</span></h5>&nbsp;
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button id="addproductRequisition" type="button" class="btn btn-primary">Agregar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="providerrequisitionModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="providerrequisitionModal_title">Seleccione el proveedor</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="providerrequisitionModal_content" class="modal-body">
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
              <input type="text" id="providerFilter" class="form-control" onfocus="cls_general.validFranz(this.id, ['word', 'number', 'punctuation', 'mathematic'])" onkeyup="cls_provider.filter(this.value,'container_providerfiltered')">
            </div>
            <div id="container_providerfiltered" class="col-sm-12 h_300 v_scrollable"></div>
          </div>
        </div>
        <div id="providerrequisitionModal_footer" class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button id="btn_saveRequisition" type="button" class="btn btn-primary">Procesar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="createproviderrequisitionModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="createproviderrequisitionModal_title">Crear proveedor</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="createproviderrequisitionModal_content" class="modal-body">
          <div class="row">
            <div class="col-sm-12">
              <label for="providerValue" class="form-label">Descripci&oacute;n</label>
              <input type="text" id="providerValue" class="form-control" onfocus="cls_general.validFranz(this.id, ['word', 'number', 'punctuation', 'mathematic'])">
            </div>
            <div class="col-sm-8">
              <label for="providerRUC" class="form-label">RUC</label>
              <input type="text" id="providerRUC" class="form-control" onfocus="cls_general.validFranz(this.id, ['word', 'number'],'-')">
            </div>
            <div class="col-sm-2">
              <label for="providerDV" class="form-label">DV</label>
              <input type="text" id="providerDV" class="form-control" onfocus="cls_general.validFranz(this.id, ['number'])">
            </div>
            <div class="col-sm-4">
              <label for="providerTelephone" class="form-label">Tel&eacute;fono</label>
              <input type="text" id="providerTelephone" class="form-control" onfocus="cls_general.validFranz(this.id, ['number'], '- ')">
            </div>
            <div class="col-sm-8">
              <label for="providerAddress" class="form-label">Direcci&oacute;n</label>
              <input type="text" id="providerAddress" class="form-control" onfocus="cls_general.validFranz(this.id, ['word', 'number', 'punctuation', 'mathematic'])">
            </div>
            <div class="col-sm-12">
              <label for="providerObservation" class="form-label">Observaciones</label>
              <input type="text" id="providerObservation" class="form-control" onfocus="cls_general.validFranz(this.id, ['word', 'number', 'punctuation', 'mathematic'])">
            </div>
          </div>
        </div>
        <div id="createproviderrequisitionModal_footer" class="modal-footer">
          <button class="btn btn-secondary" id="btn_providerrequisitionModal" data-bs-target="#providerrequisitionModal" data-bs-toggle="modal">Volver</button>
          <button id="saveproviderRequisition" type="button" class="btn btn-primary">Guardar</button>
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
  <div class="modal fade" id="dataproductinputModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="dataproductinputModal_title"></h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="dataproductinputModal_content" class="modal-body">
        </div>
        <div id="dataproductinputModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade modal-lg" id="productinputModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="productinputModal_title"></h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="productinputModal_content" class="modal-body">
        </div>
        <div id="productinputModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>


  <div id="container_purchase" class="row">
  </div>

@endsection

@section('javascript')
	<script src="{{ asset('attached/js/purchase.js') }}"></script>
	{{-- <script src="{{ asset('attached/js/sweetalert.js') }}"></script> --}}
	<script src="{{ asset('attached/js/jquery-ui.min_edit.js') }}"></script>
	
	<script type="text/javascript">
    var notprocesed = JSON.parse('<?php echo json_encode($data['notprocesed']) ?>');
    var procesed = JSON.parse('<?php echo json_encode($data['procesed']) ?>');
    var low_inventory = '<?php echo $data['low_inventory'] ?>';

    const cls_productinput = new class_productinput(notprocesed,procesed);
    const cls_purchase = new class_purchase;

    var providerlist = JSON.parse('<?php echo json_encode($data['providerlist']) ?>');
    const cls_provider = new class_provider(providerlist);

    var requisition_procesed = JSON.parse('<?php echo json_encode($data['requisition_procesed']) ?>');
    var requisition_notprocesed = JSON.parse('<?php echo json_encode($data['requisition_notprocesed']) ?>');
    const cls_requisition = new class_requisition(requisition_procesed,requisition_notprocesed);

    var productlist = JSON.parse('<?php echo json_encode($data['productlist']) ?>');
    var productcategory = JSON.parse('<?php echo json_encode($data['productcategory']) ?>');
    const cls_product = new class_product(productlist,productcategory);

    
    
    document.addEventListener('DOMContentLoaded', function() {
      cls_purchase.index();
    });
    document.getElementById('addproductRequisition').addEventListener('click', function() {
      cls_general.disable_submit(this,1)
      cls_product.addproduct();
    });
    document.getElementById('saveproviderRequisition').addEventListener('click', function() {
      cls_general.disable_submit(this,1)
      cls_provider.save();
    });
    document.getElementById('btn_saveRequisition').addEventListener('click', function() {
      cls_general.disable_submit(this,1)
      cls_requisition.process();
    });
    
	</script>
	{{-- ##############    JQUERY   ############### --}}
	<script type="text/javascript">

  </script>
@endsection