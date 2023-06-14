class class_kitchen
{
  constructor(notready,ready){
    this.notready = notready;
    this.ready = ready;
  }
  index(){

  }
  render_notready(){
    var content = cls_command.generate_notready_list(cls_kitchen.notready);
    document.getElementById('container_notready').innerHTML = content;
  }
  render_ready() {
    var content = cls_command.generate_ready_list(cls_kitchen.ready);
    document.getElementById('container_ready').innerHTML = content;
  }

}
class class_command
{
  generate_ready_list(ready) {
    var content = '';
    var command_id = 0;
    var raw_ready = [];
    var array_command = [];
    ready.map((command) => {
      array_command.push(command);
      // if (command_id != command.ai_command_id && command_id > 0) {
      if (command_id != command.ai_command_id || command_id === 0) {
        raw_ready.push(array_command);
        array_command = [];
        command_id = command.ai_command_id;
      }
    })
    raw_ready.map((ready) => {
      var command_id = '';
      var title = '';
      var command_text = '';
      var observation = '';
      var upd_date = '';
      ready.map((command) => {
        title = command.tx_table_value + ' H ' + cls_general.time_converter(command.created_at, 1);
        upd_date = cls_general.datetime_converter(command.updated_at) + ' ' + cls_general.time_converter(command.updated_at, 1);
        command_id = command.ai_command_id;
        observation = (cls_general.is_empty_var(command.tx_command_observation) === 1) ? command.tx_command_observation : '';
        command_text += `
          <h5 class="card-title text-truncate">${command.tx_commanddata_description}</h5>
          <ul>
        `;
        if (cls_general.is_empty_var(command.tx_commanddata_option) === 1) {
          var split_option = command.tx_commanddata_option.split(',');
          split_option.map((option) => {
            command_text += `<li class="card-text">${option}</li>`;
          })
        }
        command_text += `</ul>`;
      })
      content += `
        <div class="col-sm-3 pt-3">
          <div class="card">
            <h5 class="card-header cursor_pointer bg-secondary" onclick="cls_command.show_ready(${command_id});">${title}</h5>
            <div class="card-body">
              ${observation}
              ${command_text}
              Actualizado el: <h5>${upd_date}</h5>
            </div>
          </div>
        </div>
      `;
    })
    return content;
  }
  generate_notready_list(notready){
    var content = '';
    var command_id = 0;
    var raw_notready = [];
    var array_command = [];
    notready.map((command) => {
      array_command.push(command);
      // if (command_id != command.ai_command_id && command_id > 0) {
      if (command_id != command.ai_command_id || command_id === 0) {
        raw_notready.push(array_command);
        array_command = [];
        command_id = command.ai_command_id;
      }
    })
    raw_notready.map((notready) => {
      var command_id = '';
      var title = '';
      var command_text = '';
      var observation = ''
      notready.map((command) => {
        title = command.tx_table_value + ' H ' + cls_general.time_converter(command.created_at,1);
        command_id = command.ai_command_id;
        observation = (cls_general.is_empty_var(command.tx_command_observation) === 1) ? command.tx_command_observation : '';
        command_text += `
          <h5 class="card-title text-truncate">${command.tx_commanddata_description}</h5>
          <ul>
        `;
        if (cls_general.is_empty_var(command.tx_commanddata_option) === 1) {
          var split_option = command.tx_commanddata_option.split(',');
          split_option.map((option) => {
            command_text += `<li class="card-text">${option}</li>`;
          })
        }
        command_text += `</ul>`;
      })
      content += `
        <div class="col-sm-3 pt-3">
          <div class="card">
            <h5 class="card-header cursor_pointer text-bg-dark" onclick="cls_command.show_command(${command_id});">${title}</h5>
            <div class="card-body">
              ${observation}
              ${command_text}
              <button class="btn btn-warning btn-lg" onclick="cls_general.disable_submit(this,0); cls_command.set_ready(${command_id},this)">Listo</button>
            </div>
          </div>
        </div>
      `;
    })
    return content;
  }
  show_command(command_id){
    var url = '/command/'+command_id;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('inspectCommandModal_title').innerHTML = obj.data.request_info.tx_table_value + ' (' + obj.data.request_info.tx_request_title + ')';
        
        var command_list = '';
        obj.data.commanddata.map((command) => {
          command_list += `<p class="mb-0">${command.tx_commanddata_description}</p>`;
          if (cls_general.is_empty_var(command.tx_commanddata_option) === 1) {
            command_list += `<ul>`;
            var split_option = command.tx_commanddata_option.split(',');
            split_option.map((option) => {
              command_list += `<li>${option}</li>`;
            })
            command_list += `</ul>`;            
          }
        })
        document.getElementById('inspectCommandModal_content').innerHTML = `
          <div class="row">
            <div class="col-md-12 col-lg-6 pt-2">
              <span class="fw-bold">Fecha de Creaci&oacute;n: </span><h5>${cls_general.datetime_converter(obj.data.info.created_at)}</h5>
            </div>
             <div class="col-md-12 col-lg-6 pt-2">
              <span class="fw-bold">Hora de Creaci&oacute;n: </span><h5>${cls_general.time_converter(obj.data.info.created_at,1)}</h5>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-lg-3 pt-2">
              <span class="fw-bold">Consumo: </span><span>${obj.data.info.tx_command_consumption}</span>
            </div>
            <div class="col-md-12 col-lg-9 pt-2">
              <span class="fw-bold">Observaciones: </span><span>${(cls_general.is_empty_var(obj.data.info.tx_command_observation) === 1) ? obj.data.info.tx_command_observation : '' }</span>
            </div>
            <div class="col-xs-12 pt-2">
              <span class="fw-bold">Comandas: </span>
              ${command_list}
            </div>
          </div>
        `;
        document.getElementById('inspectCommandModal_footer').innerHTML = `<a href="#" class="btn btn-warning btn-lg" onclick="cls_general.disable_submit(this,0); cls_command.set_ready(${obj.data.info.ai_command_id},this)">Listo</a>`;
        const modal = new bootstrap.Modal('#inspectCommandModal', {})
        modal.show();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
  show_ready(command_id) {
    var url = '/command/' + command_id;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('inspectCommandModal_title').innerHTML = obj.data.request_info.tx_table_value + ' (' + obj.data.request_info.tx_request_title + ')';

        var command_list = '';
        obj.data.commanddata.map((command) => {
          command_list += `<p class="mb-0">${command.tx_commanddata_description}</p>`;
          if (cls_general.is_empty_var(command.tx_commanddata_option) === 1) {
            command_list += `<ul>`;
            var split_option = command.tx_commanddata_option.split(',');
            split_option.map((option) => {
              command_list += `<li>${option}</li>`;
            })
            command_list += `</ul>`;
          }
        })
        document.getElementById('inspectCommandModal_content').innerHTML = `
          <div class="row">
            <div class="col-md-12 col-lg-6 pt-2">
              <span class="fw-bold">Fecha de Preparaci&oacute;n: </span><h5>${cls_general.datetime_converter(obj.data.info.updated_at)}</h5>
            </div>
             <div class="col-md-12 col-lg-6 pt-2">
              <span class="fw-bold">Hora de Preparaci&oacute;n: </span><h5>${cls_general.time_converter(obj.data.info.updated_at, 1)}</h5>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-lg-3 pt-2">
              <span class="fw-bold">Consumo: </span><span>${obj.data.info.tx_command_consumption}</span>
            </div>
            <div class="col-md-12 col-lg-9 pt-2">
              <span class="fw-bold">Observaciones: </span><span>${(cls_general.is_empty_var(obj.data.info.tx_command_observation) === 1) ? obj.data.info.tx_command_observation : ''}</span>
            </div>
            <div class="col-xs-12 pt-2">
              <span class="fw-bold">Comandas: </span>
              ${command_list}
            </div>
          </div>
        `;
        const modal = new bootstrap.Modal('#inspectCommandModal', {})
        modal.show();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }

  set_ready(command_id, btn){
    swal({
      title: "¿Confirma?",
      icon: "info",

      buttons: {
        si: {
          text: "Si, confirmado",
          className: "btn btn-success btn-lg"
        },
        no: {
          text: "Volver",
          className: "btn btn-warning btn-lg",
        },
      },
      dangerMode: true,
    })

    .then((ans) => {
      switch (ans) {
        case 'si':
          var url = '/command/'+command_id+'/setready';
          var method = 'PUT';
          var body = '';
          var funcion = function (obj) {
            if (obj.status === 'success') {
              cls_kitchen.notready = obj.data.notready;
              cls_kitchen.ready = obj.data.ready;

              cls_kitchen.render_notready();
              cls_kitchen.render_ready();

              const Modal = bootstrap.Modal.getInstance('#inspectCommandModal');
              if (Modal != null) {
                Modal.hide();
              }
              cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-success' });
            } else {
              cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
            }
          }
          cls_general.async_laravel_request(url, method, funcion, body);
          break;
        case 'no':
          btn.disabled = false;
          break;
      }
    });
  }

}