<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>@yield('title') - Tequila y Mezcal</title>

        <!-- Fonts -->
        <link rel="icon" href="{{ asset('/attached/image/favicon.ico') }}">
        <link rel="stylesheet" href="https://fonts.bunny.net/css2?family=Nunito:wght@400;600;700&display=swap">
        <link rel="stylesheet" href="{{ asset('attached/css/bootstrap.css') }}">
        <link rel="stylesheet" href="{{ asset('attached/css/mp.css') }}">
        <link rel="stylesheet" href="{{ asset('attached/css/tm.css') }}">
        @yield('css')

        <!-- Scripts -->
    </head>
    <body class="">
        <main>
            <div class="container-xl">
                <div class="row">
                    <div class="col-md-12 col-lg-1 text-truncate text-center pt-1 d-none d-lg-block d-xxl-block">
                        <span class="bs_1 text-bg-success radius_5 p-1 fs_15" title="{{ Auth()->user()->name }}">{{ Auth()->user()->name }}</span>
                        <br><br>
                        <button class="btn btn-primary btn_xl rounded-circle pt_0 px_10" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMenu" aria-controls="offcanvasMenu">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-text-center" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                        </button>
                        <br/>
                        <br>
                        <button class="btn btn-primary btn_xl rounded-circle pt_0 px_10" type="button" onclick="window.location='/request'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-card-checklist" viewBox="0 0 16 16">
                                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                                <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z"/>
                            </svg>    
                        </button>
                        <br/>
                        <br>
                        <button class="btn btn-primary btn_xl rounded-circle pt_0 px_10" type="button" onclick="window.location='/depletion'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                            </svg>
                        </button>
                        <br/>
                        <br>
                        <button class="btn btn-primary btn_xl rounded-circle pt_0 px_10" type="button" onclick="document.getElementById('form_logout').submit()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-door-open" viewBox="0 0 16 16">
                                <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z"/>
                                <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117zM11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5zM4 1.934V15h6V1.077l-6 .857z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="col-md-12 col-lg-1 text-truncate text-center pt-1 d-lg-none d-md-block">
                        <span class="bs_1 text-bg-success radius_5 p-1 fs_15" title="{{ Auth()->user()->name }}">{{ Auth()->user()->name }}</span>
                        <br><br>
                        <button class="btn btn-primary btn_xl rounded-circle pt_0 px_10" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMenu" aria-controls="offcanvasMenu">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-text-center" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                        </button>
                        &nbsp;&nbsp;
                        <button class="btn btn-primary btn_xl rounded-circle pt_0 px_10" type="button" onclick="window.location='/request'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-card-checklist" viewBox="0 0 16 16">
                                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                                <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z"/>
                            </svg>    
                        </button>
                        &nbsp;&nbsp;
                        <button class="btn btn-primary btn_xl rounded-circle pt_0 px_10" type="button" onclick="window.location='/depletion'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
                            </svg>
                        </button>
                        &nbsp;&nbsp;
                        <button class="btn btn-primary btn_xl rounded-circle pt_0 px_10" type="button" onclick="document.getElementById('form_logout').submit()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-door-open" viewBox="0 0 16 16">
                                <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z"/>
                                <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117zM11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5zM4 1.934V15h6V1.077l-6 .857z"/>
                            </svg>
                        </button>
                    </div>

                    <form method="POST" id="form_logout" action="{{ route('logout') }}" style="display: none">  @csrf   <button type="submit" id="btn_logout" class="">{{ __('Log Out') }}</button></form>
                    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasMenu" aria-labelledby="offcanvasMenuLabel">
                        <div class="offcanvas-header">
                            <h5 class="offcanvas-title" id="offcanvasMenuLabel">Menu</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">
                            <div class="row py-3">
                                <div class="col-sm-6 text-center d-grid gap-2">
                                    <button class="btn btn-primary btn_xl" onclick="window.location='/request'" type="button">Pedido</button>
                                </div>
                                <div class="col-sm-6 text-center d-grid gap-2">
                                    <button class="btn btn-primary btn_xl" onclick="window.location='/depletion'" type="button">Merma</button>
                                </div>
                            </div>
                            <div class="row py-3">
                                <div class="col-sm-6 text-center d-grid gap-2">
                                    <button class="btn btn-primary btn_xl" onclick="window.location='/paydesk'" type="button">Caja</button>
                                </div>
                                <div class="col-sm-6 text-center d-grid gap-2">
                                    <button class="btn btn-primary btn_xl" onclick="window.location='/kitchen'" type="button">Cocina</button>
                                </div>
                            </div>
                            <div class="row py-3">
                                <div class="col-sm-6 text-center d-grid gap-2">
                                    <button class="btn btn-primary btn_xl" onclick="window.location='/purchase'" type="button">Compras</button>
                                </div>
                                <div class="col-sm-6 text-center d-grid gap-2">
                                    <button class="btn btn-primary btn_xl" onclick="window.location='/stock'" type="button">Inventario</button>
                                </div>
                            </div>
                            <div class="row py-3">
                                <div class="col-sm-6 text-center d-grid gap-2">
                                    <button class="btn btn-primary btn_xl" onclick="window.location='/report'" type="button">Reportes</button>
                                </div>
                                <div class="col-sm-6 text-center d-grid gap-2">
                                    <button class="btn btn-primary btn_xl" onclick="window.location='/configuration'" type="button">Opciones</button>
                                </div>
                            </div>
                            <div class="row py-3">
                                <div class="col-sm-6 text-center d-grid gap-2">
                                    <button class="btn btn-primary btn_xl" onclick="document.getElementById('form_logout').submit()" type="button">Salir</button>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div class="col-md-12 col-lg-11 ">
                        @yield('content')
                        <div id="toast_container" class="toast-container position-fixed bottom-0 end-0 p-3"></div>
                    </div>
                </div>
            </div>
        </main>

        <script src="{{ asset('attached/js/popper.js') }}"></script>
        <script src="{{ asset('attached/js/bootstrap.min.js') }}"></script>
        <script src="{{ asset('attached/js/jquery.js') }}"></script>
        <script src="{{ asset('attached/js/validCampoFranz.js') }}"></script>
        <script src="{{ asset('attached/js/mp.js') }}"></script>

        <script src="{{ asset('attached/js/jquery-ui.min_edit.js')}}"></script>
        <link href="{{ asset('attached/dist/css/jquery-ui.css')}}" rel="stylesheet">
        <!-- keyboard widget css & script -->
        <link href="{{ asset('attached/dist/css/keyboard.min.css')}}" rel="stylesheet">
        <script src="{{ asset('attached/dist/js/jquery.keyboard.js')}}"></script>

        <!-- css for the preview keyset extension -->
        <link href="{{ asset('attached/dist/css/keyboard-previewkeyset.min.css')}}" rel="stylesheet">

        <!-- keyboard optional extensions - include ALL (includes mousewheel) -->
        <script src="{{ asset('attached/dist/js/jquery.keyboard.extension-all.min.js')}}"></script>

        <script type="text/javascript">
            const cls_general = new general_funct();
        </script>

        @yield('javascript')
    </body>
</html>
