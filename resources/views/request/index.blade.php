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

	<div id="container_request" class="row"></div>

	@endsection

@section('javascript')
	<script src="{{ asset('attached/js/request.js') }}"></script>
	<script src="{{ asset('attached/js/sweetalert.js') }}"></script>
	
	<script type="text/javascript">
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
		});


	</script>
	{{-- ##############    JQUERY   ############### --}}
	<script type="text/javascript">
  
	</script>
@endsection