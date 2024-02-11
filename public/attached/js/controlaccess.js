class class_controlaccess
{
  init (){
    document.getElementById('accessControlModal_body').innerHTML = `
      <div class="row h_200">
        <div class="col-6 text-center pb-3">
            <button type="button" id="btn_set_in" class="btn btn-lg btn-success" onclick="cls_controlaccess.set_in(this)">Entrada</button>
        </div>
        <div class="col-6 text-center">
            <button type="button" id="btn_set_out" class="btn btn-lg btn-primary" onclick="cls_controlaccess.set_out(this)">Salida</button>
        </div>
        <div class="col-6 text-center">
            <button type="button" id="btn_set_breakin" class="btn btn-lg btn-info" onclick="cls_controlaccess.set_breakin(this)">Entrada al Almuerzo</button>
        </div>
        <div class="col-6 text-center">
            <button type="button" id="btn_set_breakout" class="btn btn-lg btn-info" onclick="cls_controlaccess.set_breakout(this)">Salida del Almuerzo</button>
        </div>
        <div class="col-12 text-center pt-3">
            <button type="button" id="btn_set_verify" class="btn btn-lg btn-secondary" onclick="cls_controlaccess.set_verify(this)">Verificar</button>
        </div>
        <div class="col-12" style="opacity: 0;">
            <form action="" name="form_controlaccess_IN" onsubmit="event.preventDefault(); cls_controlaccess.in()">
                <input type="text" id="controlaccess_IN" name="controlaccess_IN" class="form-control" value="IN">
            </form>
            <form action="" name="form_controlaccess_OUT" onsubmit="event.preventDefault(); cls_controlaccess.out()">
                <input type="text" id="controlaccess_OUT" name="controlaccess_OUT" class="form-control" value="OUT">
            </form>
            <form action="" name="form_controlaccess_BREAKIN" onsubmit="event.preventDefault(); cls_controlaccess.breakin()">
                <input type="text" id="controlaccess_BREAKIN" name="controlaccess_BREAKIN" class="form-control" value="BREAKIN">
            </form>
            <form action="" name="form_controlaccess_BREAKOUT" onsubmit="event.preventDefault(); cls_controlaccess.breakout()">
                <input type="text" id="controlaccess_BREAKOUT" name="controlaccess_BREAKOUT" class="form-control" value="BREAKOUT">
            </form>
            <form action="" name="form_controlaccess_VERIFY" onsubmit="event.preventDefault(); cls_controlaccess.verify()">
                <input type="text" id="controlaccess_VERIFY" name="controlaccess_VERIFY" class="form-control" value="VERIFY">
            </form>
        </div>
      </div>
    `;
    document.getElementById('btn_set_in').style = "display: ";
    document.getElementById('btn_set_out').style = "display: ";
    document.getElementById('btn_set_breakin').style = "display: ";
    document.getElementById('btn_set_breakout').style = "display: ";
    document.getElementById('btn_set_verify').style = "display: ";

    document.getElementById('btn_set_in').disabled = false
    document.getElementById('btn_set_out').disabled = false
    document.getElementById('btn_set_breakin').disabled = false
    document.getElementById('btn_set_breakout').disabled = false
    document.getElementById('btn_set_verify').disabled = false
  }

  set_in(btn){
    document.getElementById('controlaccess_IN').value = '';
    document.getElementById('controlaccess_IN').focus()
    cls_general.disable_submit(btn,0)

    document.getElementById('btn_set_out').style = "display: none";
    document.getElementById('btn_set_breakin').style = "display: none";
    document.getElementById('btn_set_breakout').style = "display: none";
    document.getElementById('btn_set_verify').style = "display: none";
  }
  in() {
    var code = document.getElementById('controlaccess_IN').value
    var url = '/acregister/';
    var method = 'POST';
    var body = JSON.stringify({ a: 1, b: code});
    var funcion = function (obj) {
      if (obj.status === 'success') {
        const modal_win = bootstrap.Modal.getInstance('#accessControlModal');
        if (modal_win) {
          modal_win.hide();
        }
        return swal({text: "Registro guardado " + obj.data.name,icon: "success"})
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
        cls_controlaccess.init();
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

  set_out(btn) {
    document.getElementById('controlaccess_OUT').value = '';
    document.getElementById('controlaccess_OUT').focus()
    cls_general.disable_submit(btn, 0)
    document.getElementById('btn_set_in').style = "display: none";
    document.getElementById('btn_set_breakin').style = "display: none";
    document.getElementById('btn_set_breakout').style = "display: none";
    document.getElementById('btn_set_verify').style = "display: none";
  }
  out() {
    var code = document.getElementById('controlaccess_OUT').value
    var url = '/acregister/';
    var method = 'POST';
    var body = JSON.stringify({ a: 4, b: code });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        const modal_win = bootstrap.Modal.getInstance('#accessControlModal');
        if (modal_win) {
          modal_win.hide();
        }
        return swal({ text: "Registro guardado " + obj.data.name, icon: "success" })
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
        cls_controlaccess.init();
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

  set_breakin(btn) {
    document.getElementById('controlaccess_BREAKIN').value = '';
    document.getElementById('controlaccess_BREAKIN').focus()
    cls_general.disable_submit(btn, 0)
    document.getElementById('btn_set_in').style = "display: none";
    document.getElementById('btn_set_out').style = "display: none";
    document.getElementById('btn_set_verify').style = "display: none";
    document.getElementById('btn_set_breakout').style = "display: none";
  }
  breakin() {
    var code = document.getElementById('controlaccess_BREAKIN').value
    var url = '/acregister/';
    var method = 'POST';
    var body = JSON.stringify({ a: 2, b: code });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        const modal_win = bootstrap.Modal.getInstance('#accessControlModal');
        if (modal_win) {
          modal_win.hide();
        }
        return swal({ text: "Registro guardado " + obj.data.name, icon: "success" })
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
        cls_controlaccess.init();
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

  set_breakout(btn) {
    document.getElementById('controlaccess_BREAKOUT').value = '';
    document.getElementById('controlaccess_BREAKOUT').focus()
    cls_general.disable_submit(btn, 0)
    document.getElementById('btn_set_in').style = "display: none";
    document.getElementById('btn_set_out').style = "display: none";
    document.getElementById('btn_set_breakin').style = "display: none";
    document.getElementById('btn_set_verify').style = "display: none";
  }
  breakout() {
    var code = document.getElementById('controlaccess_BREAKOUT').value
    var url = '/acregister/';
    var method = 'POST';
    var body = JSON.stringify({ a: 3, b: code });
    var funcion = function (obj) {
      if (obj.status === 'success') {
        const modal_win = bootstrap.Modal.getInstance('#accessControlModal');
        if (modal_win) {
          modal_win.hide();
        }
        return swal({ text: "Registro guardado " + obj.data.name, icon: "success" })
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
        cls_controlaccess.init();
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

  set_verify(btn) {
    document.getElementById('controlaccess_VERIFY').value = '';
    document.getElementById('controlaccess_VERIFY').focus()
    cls_general.disable_submit(btn, 0)
    document.getElementById('btn_set_in').style = "display: none";
    document.getElementById('btn_set_out').style = "display: none";
    document.getElementById('btn_set_breakin').style = "display: none";
    document.getElementById('btn_set_breakout').style = "display: none";
  }
  verify() {
    var code = document.getElementById('controlaccess_VERIFY').value
    var url = '/acregister/'+code;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        var content_table = '';
        obj.data.register.map((line) => {
          switch (line.tx_acregister_type) {
            case 1: var type = 'Entrada'; break;
            case 2: var type = 'Entrada al Almuerzo'; break;
            case 3: var type = 'Salida del Almuerzo'; break;
            case 4: var type = 'Salida';  break;
          }
          var bg = '';
          var status = ''
          if(line.tx_acregister_status === 0){
            var bg = 'text-bg-secondary';
            var status = '(Anulada)'
          } 
          content_table += `
            <tr class="${bg}">
              <td>${type} ${status}</td>
              <td>${cls_general.datetime_converter(line.created_at)} ${cls_general.time_converter(line.created_at,1)}</td>
              <td class="text-center">
                <button class="btn btn-warning" type="button" onclick="cls_controlaccess.delete(${line.ai_acregister_id})">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"></path>
                  </svg>
                </button>
              </td>
            </tr>`;
        })
        document.getElementById('accessControlModal_body').innerHTML = `
          <h5>Ultimas Marcaciones, de: ${obj.data.info.name}</h5>
          <table class="table table-bordered table-condensed table-striped table-print">
            <thead style="border: solid">
              <tr class="text-center">
                <th class="col-sm-2">Tipo</th>
                <th class="col-sm-1">Hora</th>
                <th class="col-sm-1"></th>
              </tr>
            </thead>
            <tbody>
              ${content_table}
            </tbody>
            <tfoot>
              <tr><td colspan="3"></tr>
            </tfoot>
          <table>
        `;
        setTimeout(() => {
          $("#filter_acregister").datepicker({
            changeYear: true,
            changeMonth: true
          });
        }, 1000);

      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
        cls_controlaccess.init();
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

  delete(id){
    var url = '/acregister/' + id; var method = 'DELETE';
    var body = "";
    var funcion = function (obj) {
      if (obj.status === 'success') {
        const modal_win = bootstrap.Modal.getInstance('#accessControlModal');
        if (modal_win) {
          modal_win.hide();
        }
        cls_general.shot_toast_bs(obj['message']);
      } else {
        cls_general.shot_toast_bs(obj['message'], { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

  }
}