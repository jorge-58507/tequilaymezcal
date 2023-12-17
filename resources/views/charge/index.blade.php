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
            {{-- <div class="col-md-12 col-lg-6 text-center pt-3">
              <button type="button" class="btn btn-info btn-lg">Imprimir</button>
            </div> --}}
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
              <input type="text" name="cashregisterDatefilter" id="cashregisterDatefilter" class="form-control" value="" onchange="cls_cashregister.filter(this.value)">
            </div>
            <div id="container_cashregisterFiltered" class="col-xs-12 pt-2" style="min-height: 100px;">
            </div>
            <div class="col-xs-12">
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
                      <tr>
                        <th>Cupones</th>
                        <td class="table-secondary"><span id="span_totalGiftcard"></span></td>
                        <td><span id="span_incomeGiftcard"></span></td>
                        <td><span id="span_returnGiftcard"></span></td>
                      </tr>
                      <tr>
                        <th>Venta de Cupones</th>
                        <td>&nbsp;</td>
                        <td><span id="span_giftcardactive"></span></td>
                        <td><span id="span_giftcardinactive"></span></td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr class="table-success">
                        <td>Propinas:  <span id="span_totaltip"></span></td>
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
        </div>
        <div id="cashregisterModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade  modal-lg" id="inspectCRModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="inspectCRModal_title">Arqueo de Caja</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="inspectCRModal_content" class="modal-body">
          <div class="row">
            <div class="row pt-2">
              <div id="inspectCR_title" class="col-xs-12 text-bg-success h_30 text-center">
              </div>
              <div id="inspectCR_container" class="col-xs-12">
                <div class="row">
                  <div class="col-md-12 col-lg-6">
                    <table class="table table-bordered">
                      <thead>
                        <tr class="table-success text-center">
                          <th colspan="2">Totales</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>Venta Bruta</th>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Descuento</th>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Venta Neta</th>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Documentos</th>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Venta Real</th>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Devoluci&oacute;n</th>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Anulado</th>
                          <td></td>
                        </tr>
                        <tr>
                          <th colspan="2">DESGLOSE ITBMS</th>
                        </tr>
                        <tr>
                          <th>Base No Imponible</th>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Base Imponible</th>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Base No imponible NC</th>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Base imponible NC</th>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Impuesto</th>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Impuesto N.C.</th>
                          <td></td>
                        </tr>                                                                                                                        
                      </tbody>
                    </table>
                  </div>
                  <div class="col-md-12 col-lg-6">
                    <table class="table table-bordered">
                      <thead>
                        <tr class="table-success text-center">
                          <th colspan="4">Movimientos</th>
                        </tr>
                        <tr class="table-success text-center">
                          <th scope="col">M&eacute;todo de Pago</th>
                          <th scope="col">Total</th>
                          <th scope="col">Entrada</th>
                          <th scope="col">Salida</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>Efectivo</th>
                          <td class="table-secondary"></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Cheque</th>
                          <td class="table-secondary"></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>T. Debito</th>
                          <td class="table-secondary"></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>T. Cr&eacute;dito</th>
                          <td class="table-secondary"></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Yappi</th>
                          <td class="table-secondary"></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Nequi</th>
                          <td class="table-secondary"></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Cup&oacute;n</th>
                          <td class="table-secondary"></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="cashregisterModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>

  <!-- Modal GIFTCARD -->
  <div class="modal fade" id="giftcardModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="giftcardModal_title">Cupones</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="giftcardModal_content" class="modal-body">
        </div>
        <div id="giftcardModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>

  <!-- Modal LOGIN TO PRINT -->
  <div class="modal fade" id="print_chargeModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="print_chargeModal_title">Ingresar Usuario</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="print_chargeModal_content" class="modal-body">
          <div id="container_form_logincode_reprint">
            <form method="POST" action="" id="form_logincode_reprint">
                @csrf
                <div class="form-group row">
                    <label for="logincode_reprint" class="col-md-4 col-form-label text-md-right">{{ __('Acceso') }}</label>
                    <div class="col-md-6 mb-3">
                        <input id="logincode_reprint" type="password" class="form-control" name="logincode_reprint" value="" required autofocus>
                    </div>
                </div>
                <div class="form-group row mb-0">
                    <div class="col-md-12 text-center">
                        <button type="submit" id="submit_login_reprint" class="btn tmgreen_bg" style="display: none">
                            {{ __('Ingresar') }}
                        </button>
                    </div>
                </div>
            </form>
          </div>
          <div class="form-group row mb-3">
              <div class="col-md-12 text-center">
                  <button type="button" id="btn_toggle_formlogin_reprint" class="btn btn-secondary">
                      {{ __('Ingreso Manual') }}
                  </button>
              </div>
          </div>



          <form id="container_loginform_reprint" onsubmit="event.preventDefault();" style="display: none">
            <p>Ingrese una contrase&ntilde;a de administrador o supervisor.</p>
            <div class="form-group row">
                <label for="useremailReprint" class="col-md-4 col-form-label text-md-right">{{ __('Correo E.') }}</label>
                <div class="col-md-6 mb-3">
                    <input id="hd_charge" type="hidden" class="form-control" required autocomplete="email" autofocus>
                    <input id="useremailReprint" type="email" class="form-control" name="useremailReprint" required autocomplete="email" autofocus>
                </div>
            </div>
            <div class="form-group row">
                <label for="userpasswordReprint" class="col-md-4 col-form-label text-md-right">{{ __('Contraseña') }}</label>
                <div class="col-md-6 mb-3">
                    <input id="userpasswordReprint" type="password" class="form-control" name="userpasswordReprint" required autocomplete="current-password">
                </div>
            </div>
            <div class="form-group row mb-0">
                <div class="col-md-12 text-center">
                    <button type="button" id="btn_loginuser_reprint" class="btn tmgreen_bg">
                        {{ __('Ingresar') }}
                    </button>
                </div>
            </div>
          </form>
        </div>
        <div id="print_chargeModal_footer" class="modal-footer">
        </div>
      </div>
    </div>
  </div>

  <!-- Modal LOGIN TO CREDITNOTE -->
  <div class="modal fade" id="login_creditnoteModal" tabindex="-1">
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
                <label for="useremailCreditnote" class="col-md-4 col-form-label text-md-right">{{ __('Correo E.') }}</label>
                <div class="col-md-6 mb-3">
                    <input id="hd_charge_creditnote" type="hidden" class="form-control" required autocomplete="email" autofocus>
                    <input id="useremailCreditnote" type="email" class="form-control" name="useremailCreditnote" required autocomplete="email" autofocus>
                </div>
            </div>
            <div class="form-group row">
                <label for="userpasswordCreditnote" class="col-md-4 col-form-label text-md-right">{{ __('Contraseña') }}</label>
                <div class="col-md-6 mb-3">
                    <input id="userpasswordCreditnote" type="password" class="form-control" name="userpasswordCreditnote" required autocomplete="current-password">
                </div>
            </div>
            <div class="form-group row mb-0">
                <div class="col-md-12 text-center">
                    <button type="submit" id="btn_loginuser_creditnote" class="btn tmgreen_bg">
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
  
  <!-- Modal LOGIN TO CANCEL COMMANDDATA -->
  <div class="modal fade" id="login_cancelModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="">Ingresar Usuario</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="" class="modal-body">
          <div id="container_form_logincode_nullcommand">
            <form method="POST" action="" id="form_logincode_nullcommand">
              @csrf
              <div class="form-group row">
                <label for="logincode_nullcommand" class="col-md-4 col-form-label text-md-right">{{ __('Acceso') }}</label>
                <div class="col-md-6 mb-3">
                  <input id="logincode_nullcommand" type="password" class="form-control" name="logincode_nullcommand" value="" required autofocus>
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
              <button type="button" id="btn_toggle_formlogin_nullcommand" class="btn btn-secondary">
                {{ __('Ingreso Manual') }}
              </button>
            </div>
          </div>
          <form id="container_loginform_nullcommand" onsubmit="event.preventDefault();" style="display: none">
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

  <!-- Modal ARTICLELIST GRAPHIC -->
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
                <button class="btn btn-outline-secondary" type="button" onclick="cls_command.filter_article(document.getElementById('articlethumbnailFilter').value)">
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

  <!-- Modal COMMAND -->
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

  <!-- Modal CLIENT -->
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
	<script src="{{ asset('attached/js/charge.js') }}"></script>
	<script src="{{ asset('attached/js/sweetalert.js') }}"></script>
	<script src="{{ asset('attached/js/jquery-ui.min_edit.js') }}"></script>
	
	<script type="text/javascript">
		var open_request = JSON.parse('<?php echo json_encode($data['open_request']) ?>');
		var closed_request = JSON.parse('<?php echo json_encode($data['closed_request']) ?>');
    const cls_request = new class_request(open_request,closed_request);

		var canceled_request = JSON.parse('<?php echo json_encode($data['canceled_request']) ?>');
		var api_url = <?php echo json_encode($data['api_url']); ?>;
    const cls_charge = new class_charge(canceled_request,api_url);

    const cls_command = new class_command;

		var paymentmethod = JSON.parse('<?php echo json_encode($data['paymentmethod']) ?>');
		const cls_paymentmethod = new class_paymentmethod(paymentmethod);

		const cls_payment = new class_payment;

		var creditnote = JSON.parse('<?php echo json_encode($data['creditnote_list']) ?>');
    const cls_creditnote = new class_creditnote(creditnote.active, creditnote.inactive);

    const cls_cashoutput = new class_cashoutput;

    const cls_cashregister = new class_cashregister;

    const cls_giftcard = new class_giftcard;

    var client_list = JSON.parse('<?php echo json_encode($data['client_list']) ?>');
		const cls_client = new class_client(client_list);

    var raw_article = JSON.parse('<?php echo json_encode($data['article_list']) ?>');
		var cls_article = new class_article(raw_article);

    var raw_table = JSON.parse('<?php echo json_encode($data['table_list']) ?>');
		var cls_table = new class_table(raw_table);

    document.addEventListener('DOMContentLoaded', function() {
      cls_charge.index();
      setInterval(() => {
        var btn = document.getElementById('btn_reloadrequest');
        if (btn) {
          btn.click();
        }
        var btn = document.getElementById('btn_filterClosedRequest');
        if (btn) {
          btn.click();
        }
      }, 60000);
      cls_charge.api_login();
		});
    var fecha = cls_general.getDate()
    document.getElementById('cashoutputDatefilter').value = cls_general.date_converter('ymd','dmy', fecha[0]);
    document.getElementById('cashoutputDateshow').innerHTML = cls_general.date_converter('ymd','dmy', fecha[0]);
    document.getElementById('btn_saveCashregister').addEventListener('click',() => { cls_cashregister.save(); });
    document.getElementById('btn_loginuser_reprint').addEventListener('click',() => { cls_charge.checklogin_reprint(); });
    document.getElementById('btn_loginuser_creditnote').addEventListener('click',() => { cls_charge.checklogin_creditnote(); });
    document.getElementById('btn_loginuser_cancel').addEventListener('click',() => { cls_command.checklogin_cancel(); });

	</script>
	{{-- ##############    JQUERY   ############### --}}
	<script type="text/javascript">
    $( function() {
      $( "#cashregisterDatefilter" ).datepicker();
      $( "#cashoutputDatefilter" ).datepicker();
    } );
	</script>
@endsection