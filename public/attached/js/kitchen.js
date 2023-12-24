class class_kitchen
{
  constructor(notready,ready){
    this.notready = notready;
    this.ready = ready;
  }
  index(){

  }
  render_notready(){
    var nr_kitchen = [];
    var nr_bar = [];
    cls_kitchen.notready.map((notready) => {
      if (notready.tx_article_kitchen === 0) {
        nr_kitchen.push(notready);
      }else{
        nr_bar.push(notready);
      }
    })
    var content_kitchen = cls_command.generate_notready_list(nr_kitchen);
    var content_bar = cls_command.generate_notready_list(nr_bar);
    document.getElementById('container_notready_kitchen').innerHTML = content_kitchen;
    document.getElementById('container_notready_bar').innerHTML = content_bar;
  }
  render_ready() {
    var content = cls_command.generate_ready_list(cls_kitchen.ready);
    document.getElementById('container_ready').innerHTML = content;
  }
  reload() {
    var url = '/kitchen/reload';
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        cls_kitchen.notready = obj.data.notready;
        cls_kitchen.ready = obj.data.ready;

        cls_kitchen.render_notready();
        cls_kitchen.render_ready();
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);

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
  generate_notready_list(notready) {
    var content = '';
    var command_id = (notready[0]) ? notready[0].ai_command_id : 0;
    var raw_notready = [];
    var array_command = [];
    notready.map((command, key) => {
      if (command_id != command.ai_command_id) {
        raw_notready.push(array_command);
        array_command = [];
        command_id = command.ai_command_id;
      }
      array_command.push(command);
      if (notready.length - 1 === key) {
        raw_notready.push(array_command);
      }
    })
    raw_notready.map((notready) => {
      var command_id = '';
      var title = '';
      var command_text = '';
      var observation = '';
      var kitchen_id = 0;
      notready.map((command) => {
        title = command.tx_table_value + ' H ' + cls_general.time_converter(command.created_at, 1);
        command_id = command.ai_command_id;
        observation = (cls_general.is_empty_var(command.tx_command_observation) === 1) ? command.tx_command_observation : '';
        if (command.tx_commanddata_status === 1) {
          command_text += `
            <h5 class="card-title text-truncate">${command.tx_commanddata_description}</h5>
          `;
          if (cls_general.is_empty_var(command.tx_commanddata_option) === 1) {
            command_text += `Opciones <ul>`;
            var split_option = command.tx_commanddata_option.split(',');
            split_option.map((option) => {
              command_text += `<li class="card-text">${option}</li>`;
            })
            command_text += `</ul>`;
          }
          kitchen_id = command.tx_article_kitchen;
        }
      })
      if (command_text.length > 0) {
        content += `
          <div class="col-sm-3 pt-3">
            <div class="card" onclick="cls_command.show_command(${command_id},${kitchen_id});">
              <h5 class="card-header cursor_pointer text-bg-primary">${title}</h5>
              <div class="card-body">
                <div class="cursor_pointer">
                  ${observation}
                  ${command_text}
                </div>
              </div>
            </div>
          </div>
        `;
      }
    })
    return content;
  }

  show_command(command_id, kitchen_id =0){
    var url = '/command/'+command_id;
    var method = 'GET';
    var body = '';
    var funcion = function (obj) {
      if (obj.status === 'success') {
        document.getElementById('inspectCommandModal_title').innerHTML = obj.data.request_info.tx_table_value + ' (' + obj.data.request_info.waiter + ')';
        
        var command_list = '';
        obj.data.commanddata.map((command) => {
          console.log(command);
          if (command.tx_commanddata_status === 1) {
            var btn_ready = (command.tx_commanddata_delivered === 0) ? `<a href="#" class="btn btn-info btn-lg" onclick="cls_general.disable_submit(this,0); cls_commanddata.set_ready(${command.ai_commanddata_id},this)">Listo</a>` : '';


            if (command.tx_article_kitchen === kitchen_id) {
              
              command_list += `<p class="mb-2 fs-4">-${command.tx_commanddata_description} (${command.tx_presentation_value}) ${btn_ready}</p>`;
              if (cls_general.is_empty_var(command.tx_commanddata_option) === 1) {
                command_list += `Opciones<ul>`;
                var split_option = command.tx_commanddata_option.split(',');
                split_option.map((option) => {
                  command_list += `<li>${option}</li>`;
                })
                command_list += `</ul>`;            
              }
              var recipe_list = '';
              if (cls_general.is_empty_var(command.tx_commanddata_recipe) === 1) {
                var raw_recipe = JSON.parse(command.tx_commanddata_recipe);
                if (raw_recipe.length > 0) {
                  recipe_list += `-Receta <ul>`;
                  raw_recipe.map((ingredient) => {
                    for (const x in ingredient) {
                      var raw_ingredient = ingredient[x].split(',');
                      if (raw_ingredient[3] === 'show') {
                        recipe_list += `<li class="card-text">${x}</li>`;
                      }
                    }
                  })
                  recipe_list += `</ul>`;
                }
              }
              command_list += (recipe_list.length > 17) ? recipe_list : '';
            }





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
              <span class="fw-bold">Observaciones: </span><span class="fs-5">${(cls_general.is_empty_var(obj.data.info.tx_command_observation) === 1) ? obj.data.info.tx_command_observation : '' }</span>
            </div>
            <div class="col-12 pt-2">
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

class class_commanddata{
  set_ready(command_id, btn) {
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
          var url = '/commanddata/' + command_id + '/setready';
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