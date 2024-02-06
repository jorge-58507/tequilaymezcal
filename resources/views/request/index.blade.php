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
  <!-- Modal LOGIN TO CANCEL COMMANDDATA -->
  <div class="modal fade" id="login_cancelModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="">Ingresar Usuario</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="" class="modal-body">
          <div id="container_form_logincode">
            <form method="POST" action="" id="form_logincode">
              @csrf
              <div class="form-group row">
                <label for="logincode" class="col-md-4 col-form-label text-md-right">{{ __('Acceso') }}</label>
                <div class="col-md-6 mb-3">
                  <input id="logincode" type="password" class="form-control" name="logincode" value="" required autofocus>
                </div>
              </div>
              <div class="form-group row mb-0">
                <div class="col-md-12 text-center">
                  <button type="submit" id="submit_login" class="btn tmgreen_bg" style="display: none">
                    {{ __('Ingresar') }}
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="form-group row mb-3">
            <div class="col-md-12 text-center">
              <button type="button" id="bn_toggle_formlogin" class="btn btn-secondary">
                {{ __('Ingreso Manual') }}
              </button>
            </div>
          </div>
          <form id="container_loginform" onsubmit="event.preventDefault();" style="display: none">
            <p>Ingrese una contrase&ntilde;a de administrador o supervisor.</p>
            <div class="form-group row">
                <label for="useremailCancel" class="col-md-4 col-form-label text-md-right">{{ __('Correo E.') }}</label>
                <div class="col-md-6 mb-3">
                    <input id="hd_command_cancel" type="hidden" class="form-control" required autocomplete="email" autofocus>
                    <input id="useremailCancel" type="email" class="form-control" name="useremailCancel" required autocomplete="email" autofocus>
                </div>
            </div>
            <div class="form-group row">
                <label for="userpasswordCancel" class="col-md-4 col-form-label text-md-right">{{ __('Contraseña') }}</label>
                <div class="col-md-6 mb-3">
                    <input id="userpasswordCancel" type="password" class="form-control" name="userpasswordCancel" required autocomplete="current-password">
                </div>
            </div>
            <div class="form-group row mb-0">
                <div class="col-md-12 text-center">
                    <button type="button" id="btn_loginuser_cancel" class="btn tmgreen_bg">
                        {{ __('Ingresar') }}
                    </button>
                </div>
            </div>
          </form>
        </div>
        <div id="" class="modal-footer">
        </div>
      </div>
    </div>
  </div>
  <!-- Modal ONLINEREQUEST -->
  <div class="modal fade" id="onlinerequestModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="onlinerequestModal_title">Modal title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="onlinerequestModal_content" class="modal-body">
          <div class="row">
            <div class="col-12">

            </div>
          </div>
        </div>
        <div id="onlinerequestModal_footer" class="modal-footer">
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
    console.log(low_inventory);
		if (low_inventory > 0) {
		  swal ( "Atención" ,  "Existen artículos con baja existencia. Diríjase al Menu Compras." ,  "error" );      
		}

		var open_request = JSON.parse('<?php echo json_encode($data['open_request']) ?>');
		var closed_request = JSON.parse('<?php echo json_encode($data['closed_request']) ?>');
		var canceled_request = JSON.parse('<?php echo json_encode($data['canceled_request']) ?>');
		var api_url = <?php echo json_encode($data['api_url']); ?>;
		var cls_request = new class_request(open_request,closed_request,canceled_request,api_url);


		var raw_table = JSON.parse('<?php echo json_encode($data['table_list']) ?>');
		var cls_table = new class_table(raw_table);

		var raw_article = JSON.parse('<?php echo json_encode($data['article_list']) ?>');
		var cls_article = new class_article(raw_article);
		
		var cls_command = new class_command;
		var cls_commanddata = new class_commanddata;

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
      cls_request.api_login();
		});

    document.getElementById('btn_loginuser_cancel').addEventListener('click',() => { cls_command.checklogin_cancel(); });
    document.getElementById('form_logincode').addEventListener("submit", (e) => {
      e.preventDefault();
      var url = '/logincode/'+document.getElementById('logincode').value;
      var method = 'GET';
      var body = '';
      var funcion = function (obj) {
        if (obj.status === 'success') {
          document.getElementById('useremailCancel').value = obj.data.email;
          document.getElementById('userpasswordCancel').value = obj.data.password;
          cls_command.checklogin_cancel();
        } else {
          cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
        }
      }
      cls_general.async_laravel_request(url, method, funcion, body);

    });

    document.getElementById('bn_toggle_formlogin').addEventListener("click", () => {
      $("#container_loginform").toggle();
      $("#container_form_logincode").toggle();
      if (document.getElementById('container_form_logincode').style.display === 'block') {
        document.getElementById('logincode').focus();
      }
    });

	</script>
	{{-- ##############    JQUERY   ############### --}}
	<script type="text/javascript">
  
	</script>
@endsection