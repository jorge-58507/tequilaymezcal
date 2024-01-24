<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>Tequila & Mezcal</title>

        <!-- Fonts -->
        <link rel="icon" href="{{ asset('/attached/image/favicon.ico') }}">
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
        <link rel="stylesheet" href="{{ asset('attached/css/bootstrap.css') }}">
        <link rel="stylesheet" href="{{ asset('attached/css/mp.css') }}">
        <link rel="stylesheet" href="{{ asset('attached/css/tm.css') }}">

        <!-- Styles -->
        <style>
            html, body {
                background-color: #fff;
                color: #636b6f;
                font-family: 'Nunito', sans-serif;
                font-weight: 200;
                height: 100vh;
                margin: 0;
            }

            .full-height {
                height: 100vh;
            }

            .flex-center {
                align-items: center;
                display: flex;
                justify-content: center;
            }

            .position-ref {
                position: relative;
            }

            .top-right {
                position: absolute;
                right: 10px;
                top: 18px;
            }

            .content {
                text-align: center;
            }

            .title {
                font-size: 84px;
            }

            .links > a {
                color: #636b6f;
                padding: 0 25px;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: .1rem;
                text-decoration: none;
                text-transform: uppercase;
            }

            .m-b-md {
                margin-bottom: 30px;
            }
        </style>
    </head>
    <body>
        <div class="flex-center position-ref full-height">
            <div class="row">
                <div class="col-12 text-end">
                    <button type="button" class="btn tmgreen_bg"  data-bs-toggle="modal" data-bs-target="#accessControlModal" onclick="cls_controlaccess.init()">
                        {{ __('Control de Acceso') }}
                    </button>
                </div>
                <div class="col-12">
                    <div class="text-center">
                        <div class="title m-b-md tmred_text">
                            <img src="{{ asset('attached/image/logo.png') }}" alt="" height="300">
                        </div>
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
                        <div class="form-group row mb-3">
                            <div class="col-md-12 text-center">
                                <button type="button" id="bn_toggle_formlogin" class="btn btn-secondary">
                                    {{ __('Ingreso Manual') }}
                                </button>
                            </div>
                        </div>
                        <div class="row" id="container_loginform" style="display: none">
                            <div id="container_userlist" class="col-sm-12 py-3"></div>
                            <form id="login_form" method="POST" action="{{ route('login') }}" >
                                @csrf
                                <div class="form-group row">
                                    <label for="email" class="col-md-4 col-form-label text-md-right">{{ __('Correo E.') }}</label>
                                    <div class="col-md-6 mb-3">
                                        <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>
                                        @error('email')
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="password" class="col-md-4 col-form-label text-md-right">{{ __('Contraseña') }}</label>
                                    <div class="col-md-6 mb-3">
                                        <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">
                                        @error('password')
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                </div>
                                <div class="form-group row mb-0">
                                    <div class="col-md-12 text-center">
                                        <button type="submit" id="submit_login" class="btn tmgreen_bg">
                                            {{ __('login') }}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div id="toast_container" class="toast-container position-fixed bottom-0 end-0 p-3"></div>

            {{-- MODAL ACCESSCONTROL --}}
            <div class="modal fade" id="accessControlModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Registro de Asistencia</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="accessControlModal_body">
                        <div class="row h_100">
                            <div class="col-6 text-center pb-3">
                                <button type="button" id="btn_set_in" class="btn btn-lg btn-success" onclick="cls_controlaccess.set_in(this)">Entrada</button>
                            </div>
                            <div class="col-6 text-center">
                                <button type="button" id="btn_set_out" class="btn btn-lg btn-primary" onclick="cls_controlaccess.set_out(this)">Salida</button>
                            </div>
                            <div class="col-6 text-center">
                                <button type="button" id="btn_set_breakin" class="btn btn-lg btn-info" onclick="cls_controlaccess.set_breakin(this)">Salida Almuerzo</button>
                            </div>
                            <div class="col-6 text-center">
                                <button type="button" id="btn_set_breakout" class="btn btn-lg btn-info" onclick="cls_controlaccess.set_breakout(this)">Entrada Almuerzo</button>
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
                            </div>
                        </div>
                        
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>

        </div>

        <script src="{{ asset('attached/js/jquery.js') }}"></script>
        <script src="{{ asset('attached/js/bootstrap.min.js') }}"></script>
        <script src="{{ asset('attached/js/mp.js') }}"></script>
        <script src="{{ asset('attached/js/controlaccess.js') }}"></script>
        
        <script src="{{ asset('attached/js/jquery-ui.min_edit.js')}}"></script>
        <link href="{{ asset('attached/dist/css/jquery-ui.css')}}" rel="stylesheet">

        <script type="text/javascript">

            const cls_general = new general_funct();
            const cls_controlaccess = new class_controlaccess();

            document.getElementById('form_logincode').addEventListener("submit", (e) => {
                e.preventDefault();
                var url = '/logincode/'+document.getElementById('logincode').value;
                var method = 'GET';
                var body = '';
                var funcion = function (obj) {
                  if (obj.status === 'success') {
                    document.getElementById('email').value = obj.data.email;
                    document.getElementById('password').value = obj.data.password;
                    document.getElementById('login_form').submit();
                  } else {
                    cls_general.shot_toast_bs(obj.message, { bg: 'text-bg-warning' });
                  }
                }
                cls_general.async_laravel_request(url, method, funcion, body);

            });
            document.getElementById('bn_toggle_formlogin').addEventListener("click", () => {
                $("#container_loginform").toggle();
                $("#form_logincode").toggle();
            });
            var user_list = JSON.parse('<?php echo json_encode($data['user_list']) ?>');
            var content = '';
            user_list.map((user)=> {
                content += `<button type="button" class="btn btn-primary btn-lg" onclick="login('${user.email}')">${user.name}</button>&nbsp;`;
            });
            document.getElementById('container_userlist').innerHTML = content;

            function login (email){
                document.getElementById('email').value = email;
                document.getElementById('password').focus();
            }

        </script>
    </body>
</html>

