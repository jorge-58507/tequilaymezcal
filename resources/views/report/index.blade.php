@extends('layouts.app')
@section('title','Pedidos')
@section('css')
@endsection
@section('content')

  <div class="row">
    <div class="col-md-6 col-lg-3">
      <div class="input-group my-3">
        <label class="input-group-text" for="reportFromDatefilter">Desde</label>
        <input type="text" name="reportFromDatefilter" id="reportFromDatefilter" class="form-control" value="" readonly onkeyup="this.value = ''">
      </div>
    </div>
    <div class="col-md-6 col-lg-3">
      <div class="input-group my-3">
        <label class="input-group-text" for="reportToDatefilter">Hasta</label>
        <input type="text" name="reportToDatefilter" id="reportToDatefilter" class="form-control" value="" readonly onkeyup="this.value = ''">
      </div>
    </div>
    <div class="col-md-6 col-lg-4">
      <div class="input-group my-3">
        <label class="input-group-text" for="reportType">Reporte</label>
        <select id="reportType" class="form-select">
          <optgroup>
            <option value="0">Reporte Compras totales</option>
            <option value="1">Reporte Ventas totales</option>
          </optgroup>
          <optgroup>
            <option value="2">Reporte de Compras</option>
            <option value="3">Reporte de Ventas</option>
            <option value="4">Reporte Notas de Credito</option>
            <option value="5">Compras por proveedores</option>
            <option value="6">Merma</option>
            <option value="7">Comanda Anulada</option>
            <option value="8">Ventas por Art&iacute;culos</option>
            <option value="9">Compras por Producto</option>
            <option value="10">Ventas por Productos</option>
          </optgroup>
        </select>
      </div>
    </div>
    <div class="col-md-6 col-lg-2">
      <button class="btn btn-outline-secondary my-3" type="button" id="" onclick="cls_report.filter(this)">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
        </svg>
      </button>
    </div>

    <div id="container_report" class="col-sm-12">


    </div>
  </div>

@endsection

@section('javascript')
	<script src="{{ asset('attached/js/report.js') }}"></script>
	{{-- <script src="{{ asset('attached/js/sweetalert.js') }}"></script> --}}
	
	<script type="text/javascript">
		var cls_report = new class_report();
		var cls_commanddata = new class_commanddata();
		var cls_dataproductinput = new class_dataproductinput();

    $( function() {
      var dateFormat = "mm/dd/yy",
        from = $( "#reportFromDatefilter" )
          .datepicker({
            defaultDate: "today",
            changeMonth: true,
            numberOfMonths: 1
          })
          .on( "change", function() {
            // to.datepicker( "option", "maxDate", '+30d' );
            to.datepicker( "option", "minDate", getDate( this ) );
          }),
        to = $( "#reportToDatefilter" ).datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 1
        })
        .on( "change", function() {
          from.datepicker( "option", "maxDate", getDate( this ) );
          // from.datepicker( "option", "minDate", '-30d' );
        });
  
      function getDate( element ) {
        var raw_value = (element.value).split('-');
        var date_value = raw_value[1]+'/'+raw_value[0]+'/'+raw_value[2];
        var date;
        try {
          date = $.datepicker.parseDate( dateFormat, date_value );
        } catch( error ) {
          date = null;
        }
        return date;
      }
    } );
	</script>
	{{-- ##############    JQUERY   ############### --}}
	<script type="text/javascript">
  
	</script>
@endsection