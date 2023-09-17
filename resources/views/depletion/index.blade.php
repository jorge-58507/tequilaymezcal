@extends('layouts.app')
@section('title','Merma')
@section('css')
  <link rel="stylesheet" href="{{ asset('attached/css/jquery-ui.css') }}">
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

	<div id="container_depletion" class="row"></div>

@endsection

@section('javascript')
	<script src="{{ asset('attached/js/depletion.js') }}"></script>
	<script src="{{ asset('attached/js/sweetalert.js') }}"></script>
	<script src="{{ asset('attached/js/jquery-ui.min_edit.js') }}"></script>
	
	<script type="text/javascript">
    var raw_processed = JSON.parse('<?php echo json_encode($data['depletion_list']['order_status']) ?>');
    const cls_depletion = new class_depletion(raw_processed);
    
    var article_list = JSON.parse('<?php echo json_encode($data['article_list']) ?>');
    const cls_article = new class_article(article_list);

    var product_list = JSON.parse('<?php echo json_encode($data['product_list']) ?>');
    const cls_product = new class_product(product_list);

		document.addEventListener('DOMContentLoaded', function() {
      cls_depletion.index();
      cls_depletion.filter_product('');
      document.getElementById('depletionList').innerHTML = cls_depletion.generate_processed(raw_processed);
		});

	</script>
	{{-- ##############    JQUERY   ############### --}}
	<script type="text/javascript">
    $( function() {
      $( "#cashoutputDatefilter" ).datepicker();
    } );
	</script>
@endsection