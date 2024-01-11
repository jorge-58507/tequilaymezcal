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
    document.getElementById('controlaccess_IN').focus()
    cls_general.disable_submit(btn,0)

    document.getElementById('btn_set_out').style = "display: none";
    document.getElementById('btn_set_breakin').style = "display: none";
    document.getElementById('btn_set_breakout').style = "display: none";
  }
  in() {
    console.log(document.getElementById('controlaccess_IN').value);
  }
  set_out(btn) {
    document.getElementById('controlaccess_OUT').focus()
    cls_general.disable_submit(btn, 0)
    document.getElementById('btn_set_in').style = "display: none";
    document.getElementById('btn_set_breakin').style = "display: none";
    document.getElementById('btn_set_breakout').style = "display: none";
  }
  out() {
    console.log(document.getElementById('controlaccess_OUT').value);
  }
  set_breakin(btn) {
    document.getElementById('controlaccess_BREAKIN').focus()
    cls_general.disable_submit(btn, 0)
    document.getElementById('btn_set_in').style = "display: none";
    document.getElementById('btn_set_out').style = "display: none";
    document.getElementById('btn_set_breakout').style = "display: none";
  }
  breakin() {
    console.log(document.getElementById('controlaccess_BREAKIN').value);
  }
  set_breakout(btn) {
    document.getElementById('controlaccess_BREAKOUT').focus()
    cls_general.disable_submit(btn, 0)
    document.getElementById('btn_set_in').style = "display: none";
    document.getElementById('btn_set_out').style = "display: none";
    document.getElementById('btn_set_breakin').style = "display: none";
  }
  breakout() {
    console.log(document.getElementById('controlaccess_BREAKOUT').value);
  }
}