@extends('layouts.app')
@section('title','Cocina')
@section('css')
  <link rel="stylesheet" href="{{ asset('attached/css/jquery-ui.css') }}">
@endsection
@section('content')

  <!-- Modal -->
  <div class="modal fade  modal-lg" id="inspectCommandModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="inspectCommandModal_title"></h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="inspectCommandModal_content" class="modal-body">
        </div>
        <div id="inspectCommandModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>



	<div id="container_kitchen" class="row">

    

    <div class="col-xs-12 v_scrollable bb_1 border_gray" style="height: 100vh;">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link active" id="btn_tab_ready" data-bs-toggle="tab" data-bs-target="#tab_ready" type="button" role="tab" aria-controls="nav-home" aria-selected="true" onclick="cls_kitchen.reload()">PENDIENTE</button>
            
          <button class="nav-link" id="btn_tab_notready" data-bs-toggle="tab" data-bs-target="#tab_notready" type="button" role="tab" aria-controls="nav-home" aria-selected="false" tabindex="-1">TERMINADO</button>
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="tab_ready" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
          <div id="container_notready" class="row">
              <div class="col-12">
                <nav>
                  <div class="nav nav-tabs" id="nav-tab" role="tablist">
                    <button class="nav-link active" id="btn_tab_kitchen" data-bs-toggle="tab" data-bs-target="#tab_notready_kitchen" type="button" role="tab" aria-controls="nav-home" aria-selected="true">COCINA</button>
                    <button class="nav-link" id="btn_tab_bar" data-bs-toggle="tab" data-bs-target="#tab_notready_bar" type="button" role="tab" aria-controls="nav-home" aria-selected="false" tabindex="-1">BAR</button>
                  </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                  
                  <div class="tab-pane fade show active" id="tab_notready_kitchen" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
                    <div id="container_notready_kitchen" class="row">
                        COCINA
                    </div>
                  </div>

                  <div class="tab-pane fade" id="tab_notready_bar" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
                    <div id="container_notready_bar" class="row">        
                        BAR
                    </div>
                  </div>

                </div>
              </div>
          </div>
        </div>
              
        <div class="tab-pane fade" id="tab_notready" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
          <div id="container_ready" class="row">        
          </div>
        </div>
      </div>
    </div>



  </div>

@endsection

@section('javascript')
	<script src="{{ asset('attached/js/kitchen.js') }}"></script>
	<script src="{{ asset('attached/js/sweetalert.js') }}"></script>
	
	<script type="text/javascript">
    var not_ready = JSON.parse('<?php echo json_encode($data['notready']) ?>');
    var ready = JSON.parse('<?php echo json_encode($data['ready']) ?>');
    const cls_kitchen = new class_kitchen(not_ready,ready);
    const cls_commanddata = new class_commanddata;

    const cls_command = new class_command;
		document.addEventListener('DOMContentLoaded', function() {
      // cls_kitchen.index();
      cls_kitchen.render_notready();
      cls_kitchen.render_ready();

      setInterval(() => {
        cls_kitchen.reload();
      }, 15000);

		});

    document.getElementById('btn_tab_kitchen').addEventListener("click", () => {
       cls_kitchen.reload();
    });

</script>
	{{-- ##############    JQUERY   ############### --}}
	<script type="text/javascript">
	</script>
@endsection