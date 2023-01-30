@extends('layouts.app')
@section('title','Configuración')
@section('css')
@endsection
@section('content')








  <!-- Modal -->
  <div class="modal fade" id="ubicationModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="ubicationModal_title">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="ubicationModal_content" class="modal-body">
        </div>
        <div id="ubicationModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>
  <!-- Modal PRODUCT -->
  <div class="modal fade" id="productModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="productModal_title">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="productModal_content" class="modal-body">
        </div>
        <div id="productModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>






  <div class="row">
    <div class="col-xs-12 col-md-3">
      <div class="row">
        <div class="col pt-5">
          <ul class="nav flex-column">
            <li class="nav-item d-grid gap-2">
              <button type="button" class="btn btn-primary btn-lg">Carta</button>
            </li>
            <li class="nav-item d-grid gap-2">
              <button type="button" class="btn btn-success btn-lg">Usuario</button>
            </li>
            <li class="nav-item d-grid gap-2">
              <button type="button" class="btn btn-primary btn-lg" onclick="cls_product.render()">Producto</button>
            </li>
            <li class="nav-item d-grid gap-2">
              <button type="button" class="btn btn-success btn-lg" onclick="cls_ubication.render()">Areas</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-md-9">
      <div class="row">
        <div id="container" class="col-XS-12 pt-3">
        </div>
      </div>
    </div>
  </div>



@endsection

@section('javascript')
  <script src="{{ asset('attached/js/configuration.js') }}"></script>

  <script type="text/javascript">
    const cls_ubication = new class_ubication;
    const cls_table = new class_table;
    const cls_product = new class_product;
    var productCategory = JSON.parse('<?php echo json_encode($data['productcategory_list']) ?>');
    const cls_productcategory = new class_productcategory(productCategory);
    console.log(cls_productcategory.category);
  </script>
    {{-- ##############    JQUERY   ############### --}}
    <script type="text/javascript">
    </script>
@endsection