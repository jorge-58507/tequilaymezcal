@extends('layouts.app')
@section('title','Caja')
@section('css')
@endsection
@section('content')

  <!-- Modal -->
  <div class="modal fade  modal-lg" id="inspectModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="inspectModal_title">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="inspectModal_content" class="modal-body">
        </div>
        <div id="inspectModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>

	<div id="container_request" class="row"></div>

@endsection

@section('javascript')
	<script src="{{ asset('attached/js/charge.js') }}"></script>
	<script src="{{ asset('attached/js/sweetalert.js') }}"></script>
	
	<script type="text/javascript">
		var open_request = JSON.parse('<?php echo json_encode($data['open_request']) ?>');
		var closed_request = JSON.parse('<?php echo json_encode($data['closed_request']) ?>');
    const cls_request = new class_request(open_request,closed_request,canceled_request);

		var canceled_request = JSON.parse('<?php echo json_encode($data['canceled_request']) ?>');
    const cls_charge = new class_charge(canceled_request);

    const cls_command = new class_command;

		var paymentmethod = JSON.parse('<?php echo json_encode($data['paymentmethod']) ?>');
		const cls_paymentmethod = new class_paymentmethod(paymentmethod);

		const cls_payment = new class_payment;

    const cls_creditnote = new class_creditnote;
    
		document.addEventListener('DOMContentLoaded', function() {
      cls_charge.index();
      cls_request.render('open',cls_request.open_request);
      cls_request.render('closed',cls_request.closed_request);
      cls_request.render('canceled',cls_charge.charge_list);
		});


	</script>
	{{-- ##############    JQUERY   ############### --}}
	<script type="text/javascript">
	</script>
@endsection