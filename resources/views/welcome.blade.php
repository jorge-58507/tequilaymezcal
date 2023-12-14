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
            <div class="text-center">
                <div class="title m-b-md tmred_text">
                    <img src="{{ asset('attached/image/logo.png') }}" alt="" height="300">
                </div>
                <div class="row">
                    <div id="container_userlist" class="col-sm-12 py-3"></div>
                </div>
                <form method="POST" action="{{ route('login') }}">
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
                                {{ __('Ingresar') }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div id="toast_container" class="toast-container position-fixed bottom-0 end-0 p-3"></div>

        </div>

        <script src="{{ asset('attached/js/jquery.js') }}"></script>
        <script src="{{ asset('attached/js/bootstrap.min.js') }}"></script>
        <script src="{{ asset('attached/js/mp.js') }}"></script>
        
        <script src="{{ asset('attached/js/jquery-ui.min_edit.js')}}"></script>
        <link href="{{ asset('attached/dist/css/jquery-ui.css')}}" rel="stylesheet">

        <script type="text/javascript">

            const cls_general = new general_funct();
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

