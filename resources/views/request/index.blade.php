@extends('layouts.app')
@section('title','Pedidos')
@section('css')
@endsection
@section('content')
  <!-- Modal -->
  <div class="modal fade" id="commandModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="commandModal_title">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="commandModal_content" class="modal-body">
        </div>
        <div id="commandModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade" id="clientModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="clientModal_title">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="clientModal_content" class="modal-body">
        </div>
        <div id="clientModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade" id="requestModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="requestModal_title">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="requestModal_content" class="modal-body">
        </div>
        <div id="requestModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade modal-xl" id="modalArticleList" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="articlelistModal_title">Seleccione el producto</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="articlelistModal_content" class="modal-body">
          <div class="row">
            <div class="col-sm-12">
              <div class="input-group" style="height: 10vh">
                <input type="text" id="articlethumbnailFilter" class="form-control" placeholder="Buscar artículo por código o descripción" onkeyup="cls_command.filter_articlethumbnail(this.value)">
                <button class="btn btn-outline-secondary" type="button" onclick="cls_command.filter_article(document.getElementById('articleFilter').value)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div id="container_articlethumbnail_categories" class="col-sm-12 h_scrollable pt-1" style="height: 10vh">
            </div>
            <div id="container_articlethumbnail" class="col-sm-12"></div>
          </div>
        </div>
        <div id="articlelistModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>

	<div id="container_request" class="row"></div>

	@endsection

@section('javascript')
	<script src="{{ asset('attached/js/request.js') }}"></script>
	<script src="{{ asset('attached/js/sweetalert.js') }}"></script>
	
	<script type="text/javascript">
		var low_inventory = '<?php echo $data['low_inventory'] ?>';
		if (low_inventory > 0) {
		  swal ( "Atención" ,  "Existen artículos con baja existencia. Diríjase al Menu Compras." ,  "error" );      
		}

		var open_request = JSON.parse('<?php echo json_encode($data['open_request']) ?>');
		var closed_request = JSON.parse('<?php echo json_encode($data['closed_request']) ?>');
		var canceled_request = JSON.parse('<?php echo json_encode($data['canceled_request']) ?>');
		var cls_request = new class_request(open_request,closed_request,canceled_request);


		var raw_table = JSON.parse('<?php echo json_encode($data['table_list']) ?>');
		var cls_table = new class_table(raw_table);

		var raw_article = JSON.parse('<?php echo json_encode($data['article_list']) ?>');
		var cls_article = new class_article(raw_article);
		
		var cls_command = new class_command;

		var raw_client = JSON.parse('<?php echo json_encode($data['client_list']) ?>');
		var cls_client = new class_client(raw_client);
			
		document.addEventListener('DOMContentLoaded', function() {
			cls_request.index(); //MUESTRA LA INTERFAZ PEDIDO
			cls_table.render(cls_table.table_list); //MUESTRA LAS MESAS
			cls_request.render('open',cls_request.open_request); //MUESTRA LOS PEDIDOS ABIERTOS

      setInterval(() => {
        var btn = document.getElementById('btn_reloadrequest');
        if (btn) {
          btn.click();
          cls_request.filter(document.getElementById('requestFilter').value)
        }
      }, 60000);
		});


	</script>
	{{-- ##############    JQUERY   ############### --}}
	<script type="text/javascript">
  
	</script>
@endsection