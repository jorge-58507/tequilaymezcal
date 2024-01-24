class class_controlaccess
{
  init (){
    document.getElementById('btn_set_in').style = "display: ";
    document.getElementById('btn_set_out').style = "display: ";
    document.getElementById('btn_set_breakin').style = "display: ";
    document.getElementById('btn_set_breakout').style = "display: ";

    document.getElementById('btn_set_in').disabled = false
    document.getElementById('btn_set_out').disabled = false
    document.getElementById('btn_set_breakin').disabled = false
    document.getElementById('btn_set_breakout').disabled = false
  }

  set_in(btn){
    document.getElementById('controlaccess_IN').value = '';
    document.getElementById('controlaccess_IN').focus()
    cls_general.disable_submit(btn,0)

    document.getElementById('btn_set_out').style = "display: none";
    document.getElementById('btn_set_breakin').style = "display: none";
    document.getElementById('btn_set_breakout').style = "display: none";
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
      } else {
        cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
        cls_controlaccess.init();
      }
    }
    cls_general.async_laravel_request(url, method, funcion, body);
  }
}