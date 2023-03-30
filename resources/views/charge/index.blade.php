@extends('layouts.app')
@section('title','Caja')
@section('css')
  <link rel="stylesheet" href="{{ asset('attached/css/jquery-ui.css') }}">
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

  <!-- Modal -->
  <div class="modal fade  modal-lg" id="cashoutputModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="inspectModal_title">Caja Menuda</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="inspectModal_content" class="modal-body">
          <form onsubmit="event.preventDefault(); cls_cashoutput.save();" autocomplete="off">
            <div class="row">
              <div class="col-md-12 col-lg-4">
                <label for="cashoutputType">Tipo</label>
                <select name="cashoutputType" id="cashoutputType" class="form-select">
                  <option value="0">Entrada</option>
                  <option value="1" selected>Salida</option>
                </select>
              </div>
              <div class="col-md-12 col-lg-4">
                <label for="cashoutputAmount">Monto</label>
                <input type="text" name="cashoutputAmount" id="cashoutputAmount" class="form-control" placeholder="B/" onfocus="cls_general.validFranz(this.id, ['number'],'.')">
              </div>
              <div class="col-md-12 col-lg-4">
                <label for="cashoutputReason">Motivo</label>
                <input type="text" name="cashoutputReason" id="cashoutputReason" class="form-control" placeholder="Motivo de la salida" onfocus="cls_general.validFranz(this.id, ['punctuation','mathematic','close','word','number'])">
              </div>
              <div class="col-md-12 text-center py-2">
                <button type="submit" class="btn btn-primary btn-lg">Guardar</button>
              </div>
            </div>
          </form>
          <div class="row">
            <div class="col-md-12 col-lg-6">
              <label for="cashoutputDatefilter">Fecha</label>
              <input type="text" name="cashoutputDatefilter" id="cashoutputDatefilter" class="form-control" value="" onchange="cls_cashoutput.show(this.value)">
            </div>
            <div class="col-md-12 col-lg-6 text-center pt-3">
              <button type="button" class="btn btn-info btn-lg">Imprimir</button>
            </div>
            <div class="col-md-12 pt-3">
              <span>Movimientos del: </span><span id="cashoutputDateshow"></span>
              <div class="row">
                <div id="container_cashoutputlist" class="col-sm-12 pb-2">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="inspectModal_footer" class="modal-footer">
          <div class="row">
            <div class="col-sm-12">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade  modal-lg" id="cashregisterModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="cashregisterModal_title">Arqueo de Caja</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="cashregisterModal_content" class="modal-body">
          <div class="row">
            <div class="col-xs-12 text-center">
              <button id="btn_saveCashregister" class="btn btn-danger btn-lg">Cerrar Caja</button>
            </div>
            <div class="col-md-12 col-lg-6">
              <label for="cashregisterDatefilter">Fecha</label>
              <input type="text" name="cashregisterDatefilter" id="cashregisterDatefilter" class="form-control" value="" onchange="cls_cashregister.show(this.value)">
            </div>
            <div id="container_cashregisterFiltered" class="col-xs-12 pt-2">
              <span>Listado de Cierres de Caja</span>
              <ol class="list-group list-group-numbered">
                <li class="list-group-item d-flex justify-content-between align-items-start">
                  <div class="ms-2 me-auto">
                    <div class="fw-bold">Subheading</div>
                    Content for list item
                  </div>
                  <span class="badge bg-primary rounded-pill">14</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-start">
                  <div class="ms-2 me-auto">
                    <div class="fw-bold">Subheading</div>
                    Content for list item
                  </div>
                  <span class="badge bg-primary rounded-pill">14</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-start">
                  <div class="ms-2 me-auto">
                    <div class="fw-bold">Subheading</div>
                    Content for list item
                  </div>
                  <span class="badge bg-primary rounded-pill">14</span>
                </li>
              </ol>
            </div>
            <div class="row pt-2">
              <div class="col-xs-12 text-bg-success h_30 text-center">
                Movimientos Parciales
              </div>
              <div class="col-xs-12">
                <table class="table table-bordered">
                  <thead>
                    <tr class="table-success text-center">
                      <th scope="col">Total</th>
                      <th scope="col">Entrada</th>
                      <th scope="col">Salida</th>
                      <th scope="col">Salida Anulada</th>
                    </tr>
                  </thead> 
                  {{-- HACER ESTA TABLA DE LA CAJA MENUDA, UBICAR EL DIV PARA LA LISTA DE ARQUEOS HECHOS EN E DIA --}}
                  <tbody>
                    <tr>
                      <th><span id="span_totalCashout"></span></th>
                      <td><span id="span_incomeCashout"></span></td>
                      <td><span id="span_outcomeCashout"></span></td>
                      <td><span id="span_nullifiedCashout"></span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-xs-12">                
                <table class="table table-bordered">
                  <thead>
                    <tr class="table-success text-center">
                      <th scope="col">M&eacute;todo de Pago</th>
                      <th scope="col">Total</th>
                      <th scope="col">Entrada</th>
                      <th scope="col">Salida</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="col">Efectivo</th>
                      <td class="table-secondary"><span id="span_totalCash"></span></td>
                      <td><span id="span_incomeCash"></span></td>
                      <td><span id="span_returnCash"></span></td>
                    </tr>
                    <tr>
                      <th>Cheque</th>
                      <td class="table-secondary"><span id="span_totalCheck"></span></td>
                      <td><span id="span_incomeCheck"></span></td>
                      <td><span id="span_returnCheck"></span></td>
                    </tr>
                    <tr>
                      <th>T. Debito</th>
                      <td class="table-secondary"><span id="span_totalDebitcard"></span></td>
                      <td><span id="span_incomeDebitcard"></span></td>
                      <td><span id="span_returnDebitcard"></span></td>
                    </tr>
                    <tr>
                      <th>T. Cr&eacute;dito</th>
                      <td class="table-secondary"><span id="span_totalCreditcard"></span></td>
                      <td><span id="span_incomeCreditcard"></span></td>
                      <td><span id="span_returnCreditcard"></span></td>
                    </tr>
                    <tr>
                      <th>Yappi</th>
                      <td class="table-secondary"><span id="span_totalYappi"></span></td>
                      <td><span id="span_incomeYappi"></span></td>
                      <td><span id="span_returnYappi"></span></td>
                    </tr>
                    <tr>
                      <th>Nequi</th>
                      <td class="table-secondary"><span id="span_totalNequi"></span></td>
                      <td><span id="span_incomeNequi"></span></td>
                      <td><span id="span_returnNequi"></span></td>
                    </tr>
                    <tr>
                      <th>Otro</th>
                      <td class="table-secondary"><span id="span_totalAnother"></span></td>
                      <td><span id="span_incomeAnother"></span></td>
                      <td><span id="span_returnAnother"></span></td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="table-success">
                      <td></td>
                      <td>Descuentos:  <span id="span_totaldiscount"></span></td>
                      <td>Devoluciones:  <span id="span_totalcashback"></span></td>
                      <td>Anulaciones:  <span id="span_totalnull"></span></td>
                    </tr>
                    <tr class="table-success">
                      <td></td>
                      <td>Venta Bruta: <span id="span_grosssale"></span></td>
                      <td>Venta Neta <span id="span_netsale"></span></td>
                      <td>Venta Real <span id="span_realsale"></span></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div id="cashregisterModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>

	<div id="container_request" class="row"></div>

@endsection

@section('javascript')
	<script src="{{ asset('attached/js/charge.js') }}"></script>
	<script src="{{ asset('attached/js/sweetalert.js') }}"></script>
	<script src="{{ asset('attached/js/jquery-ui.min_edit.js') }}"></script>
	
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

    const cls_cashoutput = new class_cashoutput;

    const cls_cashregister = new class_cashregister;
    
		document.addEventListener('DOMContentLoaded', function() {
      cls_charge.index();
      cls_request.render('open',cls_request.open_request.slice(0,10));
      cls_request.render('closed',cls_request.closed_request.slice(0,10));
      cls_request.render('canceled',cls_charge.charge_list.slice(0,10));
		});
    var fecha = cls_general.getDate()
    document.getElementById('cashoutputDatefilter').value = cls_general.date_converter('ymd','dmy', fecha[0]);
    document.getElementById('cashoutputDateshow').innerHTML = cls_general.date_converter('ymd','dmy', fecha[0]);
    document.getElementById('btn_saveCashregister').addEventListener('click',() => { cls_cashregister.save(); });

	</script>
	{{-- ##############    JQUERY   ############### --}}
	<script type="text/javascript">
    $( function() {
      $( "#cashregisterDatefilter" ).datepicker();
      $( "#cashoutputDatefilter" ).datepicker();
    } );
	</script>
@endsection