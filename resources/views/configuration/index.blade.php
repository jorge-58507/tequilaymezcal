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

  <!-- Modal ARTICLE -->
  <div class="modal fade" id="articleModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="articleModal_title">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="articleModal_content" class="modal-body">
        </div>
        <div id="articleModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>

  <!-- Modal ARTICLEPRODUCT -->
  <div class="modal fade" id="articleproductModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="articleproductModal_title">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="articleproductModal_content" class="modal-body">
        </div>
        <div id="articleproductModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>

  <!-- Modal PRICE -->
  <div class="modal fade" id="presentationModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="presentationModal_title">Presentacion</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="presentationModal_content" class="modal-body">
        </div>
        <div id="presentationModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>

  <!-- Modal USER -->
  <div class="modal fade" id="userModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="userModal_title">Información de Usuario</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="userModal_content" class="modal-body">
        </div>
        <div id="userModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>

  <!-- Modal ROLE -->
  <div class="modal fade" id="roleModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="roleModal_title">Roles</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="roleModal_content" class="modal-body">
          <div class="row">
            <div class="col-12">
              <h5>Listado de Roles</h5>
            </div>
            <div id="container_list_rolemodal" class="col-12"></div>
          </div>
        </div>
        <div id="roleModal_footer" class="modal-footer">
          <div class="row">
            <div class="col-12">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" class="btn btn-info btn-lg" id="btn_productModal" onclick="cls_role.create()">Crear Rol</button>
            </div>
          </div>
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
              <button type="button" id="btn_article" class="btn btn-primary btn-lg">Carta</button>
            </li>
            <li class="nav-item d-grid gap-2">
              <button type="button" class="btn btn-success btn-lg" onclick="cls_user.render()">Usuario</button>
            </li>
            <li class="nav-item d-grid gap-2">
              <button type="button" class="btn btn-primary btn-lg" onclick="cls_product.render()">Producto</button>
            </li>
            <li class="nav-item d-grid gap-2">
              <button type="button" class="btn btn-success btn-lg" onclick="cls_ubication.render()">Areas</button>
            </li>
            <li class="nav-item d-grid gap-2">
              <button type="button" class="btn btn-primary btn-lg" onclick="cls_client.render()">Cliente</button>
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
  <script src="{{ asset('attached/js/sweetalert.js') }}"></script>
 
  <script type="text/javascript">
    const cls_ubication = new class_ubication;
    const cls_table = new class_table;
    var product = JSON.parse('<?php echo json_encode($data['product_list']) ?>');
    const cls_product = new class_product(product);
    var productCategory = JSON.parse('<?php echo json_encode($data['productcategory_list']) ?>');
    const cls_productcategory = new class_productcategory(productCategory);
    var category = JSON.parse('<?php echo json_encode($data['category_list']) ?>');
    const cls_category = new class_category(category);
    var raw_option = JSON.parse('<?php echo json_encode($data['raw_option']) ?>')
    const cls_option = new class_option(raw_option);
    var raw_measure = JSON.parse('<?php echo json_encode($data['measure_list']) ?>')
    const cls_measure = new class_measure(raw_measure);
    var raw_article = JSON.parse('<?php echo json_encode($data['article_list']) ?>')    
    const cls_article = new class_article(raw_article);
    const cls_articleproduct = new class_articleproduct;  
    const cls_price = new class_price;
    var raw_presentation = JSON.parse('<?php echo json_encode($data['presentation_list']) ?>')    
    const cls_presentation = new class_presentation(raw_presentation);
    const cls_client = new class_client;
    var raw_paymentmethod = JSON.parse('<?php echo json_encode($data['paymentmethod_list']) ?>')    
    const cls_payment = new class_payment(raw_paymentmethod);
    const cls_user = new class_user();
    var raw_role = JSON.parse('<?php echo json_encode($data['role_list']) ?>')    
    const cls_role = new class_role(raw_role);

  </script>
    {{-- ##############    JQUERY   ############### --}}
  <script type="text/javascript">
    document.getElementById('btn_article').addEventListener('click',() => {
      cls_article.render();
    })
  </script>
@endsection