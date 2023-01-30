@extends('layouts.app')
@section('title','Pedidos')
@section('css')
@endsection
@section('content')




    <div class="col-xs-12 col-md-7">

        
        <div class="row">
            <div class="col">


                <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Home</button>
                        <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Profile</button>
                    </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">uno</div>
                    <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">dos</div>
                </div>


            </div>
        </div>


    </div>
    <div class="col-xs-12 col-md-5">
        <div class="row">
            <div class="col">

            </div>
        </div>
    </div>




@endsection

@section('javascript')
    {{-- <script src="{{ asset('js/jquery.js') }}"></script> --}}
    <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function() {

        });

    </script>
    {{-- ##############    JQUERY   ############### --}}
    <script type="text/javascript">
    </script>
@endsection