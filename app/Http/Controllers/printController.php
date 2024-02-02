<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\tm_cashregister;
use App\tm_commanddata;
use App\tm_dataproductinput;
use App\tm_measure;
use App\tm_product;
use App\tm_depletion;


class printController extends Controller
{
    
	public function pdfStream($raw_page, $format){
		$pdf = \App::make('dompdf.wrapper');
		switch ($format) {
			case 'half':
				$pdf->loadHTML($this->half_page($raw_page))->setPaper('letter', 'landscape'); 			
				break;
			case 'vertical_halfPage':
				$pdf->loadHTML($this->vertical_half_page($raw_page))->setPaper('letter'); 			
				break;
			case 'roll_page':
				$pdf->loadHTML($this->roll_page($raw_page)); 			
				break;			

			default:
				$pdf->loadHTML($this->full_page($raw_page))->setPaper('letter');
				break;
		}
		return $pdf->stream();
	}

	function full_page ($raw_page){
		$content='';
		foreach ($raw_page['content'] as $key => $value) {
			$content .= ($value != end($raw_page['content'])) ? $value.'<span style="page-break-after: always"></span>' : $value;
		}
		$output = '
			<link type="text/css" rel="stylesheet" href="attached/css/print.css"  media="screen,projection"/>
			<link type="text/css" rel="stylesheet" href="attached/css/bootstrap.css"  media="screen,projection">
			<script src="attached/js/bootstrap.min.js"></script>

			<title>'.$raw_page['title_page'].'</title>
			<style>
				.print_header { position: static; top: -30px; left: 0px; right: 0px; height: 160px; }
				.print_page { top: 180px; left: 0px; right: 0px; height: 50px; }
				.print_bottom { position: fixed; bottom: -50px; left: 0px; right: 0px; height: 50px; }
			</style>
			<div class="print_header">
					<div class="text-center col-sm-3 col_25" style="height: 160px; float: left;">&nbsp;</div>
					<div class="text-center col-sm-6 col_25" style="height: 160px; float: left;">
						<img width="115px" height="115px" src="./attached/image/logo_print2.png">
						<p style="font-size: 10pt;">Cancino Nuñez, S.A.</p>
					</div>
					<div class="text-center col-sm-3 col_25" style="height: 160px; float: left; text-align: right;">'.date('d-m-Y',strtotime($raw_page['date'])).'</div>
			</div>
			<div class="print_page">				
		 		<div class="">
		 			<div class="col_100 text-center " >
		 				<span class=" sanson_title fs_20">
		 					'.$raw_page['title'].'
		 				</span>
		 			</div>
		 		</div>
		 		<div class="px_10">'.$content.'</div>
			</div>
			<div class="print_bottom">
				'.$raw_page['bottom'].'
			</div>
		';

		return $output;
	}
	function half_page ($raw_page) {
		$r_medic = new medicController;
		$rs_medic = $r_medic->get_medic_logged();
		$medic_print = $rs_medic['tx_medic_print'];
		$raw_print = json_decode($medic_print, true);
		$medic_option = $rs_medic['tx_medic_option'];
		$raw_option = json_decode($medic_option, true);
		$profile_selected = $raw_print[$raw_option['print_profile']];
		$profile_selected = $profile_selected['half_page'];
		$dr = ($rs_medic['tx_medic_gender'] === "female") ? 'Dra.' : 'Dr.';
		$sign_line = ($profile_selected['sign_line'] == "1") ? '<span>______________________________</span><br /><span>'.$dr.' '.$rs_medic['tx_medic_pseudonym'].'</span><br /><span>'.$profile_selected['speciality'].'</span><br /><span>'.$rs_medic['tx_medic_suitability'].'</span><br />' : '';
		$print_title = ($profile_selected['letterhead'] === 'localization') ? $profile_selected['localization'] : $dr.' '.$rs_medic['tx_medic_pseudonym'];
		$patient_info = "<strong>Nombre:</strong> ".$raw_page['patient_name']." <strong>C.I.</strong> ".$raw_page['patient_cip'];

		$output = '
            <link type="text/css" rel="stylesheet" href="./css/print.css"  media="screen,projection"/>
            <link type="text/css" rel="stylesheet" href="./css/material_icons.css"  media="screen,projection"/>
            <link type="text/css" rel="stylesheet" href="./css/materialize.min.css"  media="screen,projection"/>
            <title>'.$raw_page['title_page'].'</title>
            <style>
                @page { margin: 50px 25px 30px 25px; size: 27cm 21.59cm;}
                .print_content { height: 425px;		max-height: 425px;	}
                .print_bottom  { font-size: 10pt; }
                .halfpage_side { width: 12.34cm;}

                .print_header {  height: 105px; }
                .halfpage_logo { 				float: left; 		height: 85px; 		width:17%; 		padding-left: 10px; padding-top: 15px; }
                .halfpage_letterhead { 	float: left;  	height: 100px; 		width:62%;  	}
                .halfpage_date { 				float: left; 		height: 100px;		width:17%;		}

                .halfpage_title { height: 30px; }
                .halfpage_content { font-size: 12pt; }
            </style>
            <table cellpadding="0" cellspacing="0">
                <tr>
                    <td class="halfpage_side">
                        <div class="print_header">
                            <div class="halfpage_logo">
                                <img width="75px" height="75px" src="./image/logo/'.$profile_selected['medic_logo'].'">
                            </div>
                            <div class="halfpage_letterhead center-align">
                                <div class="header_title_halfpage sanson_title">'.$print_title.'</div>
                                <div class="top_subLine_halfpage">'.$profile_selected['line1'].'</div>
                                <div class="top_subLine_halfpage">'.$profile_selected['line2'].'</div>
                                <div class="top_subLine_halfpage">'.$profile_selected['line3'].'</div>
                            </div>
                            <div class="halfpage_date center-align">
                                '.date('d-m-Y',strtotime($raw_page['date'])).'
                            </div>
                        </div>

                        <div class="print_content">
                            <div class="halfpage_content col_100">
                                '.$patient_info.'
                            </div>
                            <div class="halfpage_title vhp_top_content col_100 center-align">
                                <span class="content_title_halfpage sanson_title fs_14">
                                    '.$raw_page['title'].'
                                </span>
                            </div>
                            <div class="halfpage_content px_10">
                                '.$raw_page['content']['left'].'
                            </div>
                        </div>
                        <div class="print_bottom center-align" >
                            '.$sign_line.'<br/>
                            <div class="center-align bs_2 radius_10 ">
                                <div class="bottom_subLine_halfpage">'.$profile_selected['bottomline1'].'</div>
                                <div class="bottom_subLine_halfpage">'.$profile_selected['bottomline2'].'</div>
                            </div>
                        </div>
                    </td>
                    <td  class="halfpage_side">
                        <div class="print_header">
                            <div class="halfpage_logo">
                                <img width="75px" height="75px" src="./image/logo/'.$profile_selected['medic_logo'].'">
                            </div>
                            <div class="halfpage_letterhead center-align">
                                <div class="header_title_halfpage sanson_title">'.$print_title.'</div>
                                <div class="top_subLine_halfpage">'.$profile_selected['line1'].'</div>
                                <div class="top_subLine_halfpage">'.$profile_selected['line2'].'</div>
                                <div class="top_subLine_halfpage">'.$profile_selected['line3'].'</div>
                            </div>
                            <div class="halfpage_date center-align">
                                '.date('d-m-Y',strtotime($raw_page['date'])).'
                            </div>
                        </div>

                        <div class="print_content">
                            <div class="halfpage_content col_100">
                                '.$patient_info.'
                            </div>
                            <div class="halfpage_title vhp_top_content col_100 center-align">
                                <span class="content_title_halfpage sanson_title fs_14">
                                    '.$raw_page['title'].'
                                </span>
                            </div>
                            <div class="halfpage_content px_10">
                                '.$raw_page['content']['right'].'
                            </div>
                        </div>
                        <div class="print_bottom center-align" >
                            '.$sign_line.'<br/>
                            <div class="center-align bs_2 radius_10 ">
                                <div class="bottom_subLine_halfpage">'.$profile_selected['bottomline1'].'</div>
                                <div class="bottom_subLine_halfpage">'.$profile_selected['bottomline2'].'</div>
                            </div>
                        </div>
                    </td>
                <tr>
            </table>
        ';
		return $output;
	}
	function vertical_half_page ($raw_page){
		$r_medic = new medicController;
		$rs_medic = $r_medic->get_medic_logged();
		$medic_print = $rs_medic['tx_medic_print'];
		$raw_print = json_decode($medic_print, true);
		$medic_option = $rs_medic['tx_medic_option'];
		$raw_option = json_decode($medic_option, true);
		$profile_selected = $raw_print[$raw_option['print_profile']];
		$profile_selected = $profile_selected['complete_page'];
		$dr = ($rs_medic['tx_medic_gender'] === "female") ? 'Dra.' : 'Dr.';
		$sign_line = ($profile_selected['sign_line'] == "1") ? '<span>______________________________</span><br /><span>'.$dr.' '.$rs_medic['tx_medic_pseudonym'].'</span><br /><span>'.$profile_selected['speciality'].'</span><br /><span>'.$rs_medic['tx_medic_suitability'].'</span><br />' : '';
		$print_title = ($profile_selected['letterhead'] === 'localization') ? $profile_selected['localization'] : $dr.' '.$rs_medic['tx_medic_pseudonym'];
		$content='';
		foreach ($raw_page['content'] as $key => $value) {
			$content .= ($value != end($raw_page['content'])) ? $value.'<span style="page-break-after: always"></span>' : $value;
		}
		$output = '
		<link type="text/css" rel="stylesheet" href="./css/print.css"  media="screen,projection"/>
		<link type="text/css" rel="stylesheet" href="./css/material_icons.css"  media="screen,projection"/>
		<link type="text/css" rel="stylesheet" href="./css/materialize.min.css"  media="screen,projection"/>
		<title>'.$raw_page['title_page'].'</title>
		<style>
			@page { margin: 30px 25px 30px 25px; size: 21.59cm 13.5cm;}
			.print_header { position: fixed; top: -10px; left: 0px; right: 0px; height: 50px; }
			.print_bottom { position: fixed; bottom: 80px; left: 0px; right: 0px; height: 50px; }
		</style>
		<div class="print_header">
			<div class="center-align col_25" style="height: 60px; padding-top: 15px; float: left;">
				<img width="75px" height="75px" src="./image/logo/'.$profile_selected['medic_logo'].'">
			</div>
			<div class="center-align col_50 h_80" style="float: left;">
				<div class="header_title sanson_title">'.$print_title.'</div>
				<div><font style="font-size:8px">'.$profile_selected['line1'].'</font></div>
				<div><font style="font-size:8px">'.$profile_selected['line2'].'</font></div>
				<div><font style="font-size:8px">'.$profile_selected['line3'].'</font></div>
			</div>
			<div class="center-align col_25" style="height: 60px; float: left; text-align: right;">'.date('d-m-Y',strtotime($raw_page['date'])).'</div>
		</div>
		<div class="print_bottom center-align ">
			'.$sign_line.'
			<div class=" center-align bs_2 radius_10 ">
				<span>'.$profile_selected['bottomline1'].'</span>
				<br />
				<span>'.$profile_selected['bottomline2'].'</span>
			</div>
		</div>
		<div class="" style="">
			<div class="vhp_top_content" style="margin-top: 80px;">
				<div class="col_100 center-align h_30" >
					<span class="content_title sanson_title fs_20">
						'.$raw_page['title'].'
					</span>
				</div>
				<div class="bs_2 radius_10 h_30">
					<div class="flex_horizontal col_100 h_30 px_10" >
						<div class="col_40" style="float: left;"><span class="font_bolder">Nombre:   </span>'.$raw_page['patient_name'].'</div>
						<div class="col_25" style="float: left;"><span class="font_bolder">CIP:      </span>'.$raw_page['patient_cip'].'</div>
						<div class="col_35" style="float: left;"><span class="font_bolder">Telefono: </span>'.$raw_page['patient_tlf'].'</div>
					</div>
				</div>
			</div>
			<div class="vhp_middle_content px_10">'.$content.'</div>
		</div>        ';
		return $output;
	}
	function roll_page ($raw_page){
		$content='';
		foreach ($raw_page['content'] as $key => $value) {
			$content .= ($value != end($raw_page['content'])) ? $value.'<span style="page-break-after: always"></span>' : $value;
		}
		$output = '
		<link type="text/css" rel="stylesheet" href="attached/css/print.css"  media="screen,projection"/>
		<link type="text/css" rel="stylesheet" href="attached/css/bootstrap.css"  media="screen,projection">
		<link type="text/css" rel="stylesheet" href="attached/js/bootstrap.css"  media="screen,projection">
		<script src="attached/js/bootstrap.min.js"></script>

		<title>'.$raw_page['title_page'].'</title>
		<style>
			@page { margin: 25px 5px 5px 5px;}
			@page { size: 10cm 80cm; }
			.print_header { position: fixed; top: -30px; left: 0px; right: 0px; height: 50px; }
			.print_page { position: fixed; top: 180px; left: 0px; right: 0px; height: 50px; }
			.print_bottom { position: fixed; bottom: -50px; left: 0px; right: 0px; height: 50px; }
			.logo { position: fixed; left: 0px; }
		</style>
		<div class="print_header">
				<div class="text-center col_25" style="height: 230px; float: left;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
				<div class="text-center col_50" style="height: 230px; float: left; text-align: center;">
					<img class="logo" width="150px" height="150px" src="./attached/image/logo_print.svg">
					<br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/>
					<p style="font-size: 12px;">Boulevard Penonomé, Via Interamericana</p>
				</div>
				<div class="text-center col_25" style="height: 230px; float: left; text-align: right; font-size: 14px;">'.date('d-m-Y',strtotime($raw_page['date'])).'</div>
		</div>
		<div class="print_page"  >
			<div class="top_content">
				<div class="col_100 text-center h_30">
					<span class="content_title sanson_title fs_14">
						'.$raw_page['title'].'
					</span>
				</div>
			</div>
			<div class="px_10">'.$content.'</div>
		</div>
		<div class="print_bottom">
			'.$raw_page['bottom'].'
		</div>
				';
		return $output;

	}

	public function print_cashregister ($cashregister_id){
		$cashregisterController = new cashregisterController;
		$rs_cashregister = $cashregisterController->getit($cashregister_id);
		
		$incomeCash = (empty($rs_cashregister['payment'][1])) 	? 0 : $rs_cashregister['payment'][1];
		$returnCash = (empty($rs_cashregister['canceled'][1])) ? 0 : $rs_cashregister['canceled'][1];

		$incomeCheck = (empty($rs_cashregister['payment'][2])) 	? 0 : $rs_cashregister['payment'][2];
		$returnCheck= (empty($rs_cashregister['canceled'][2])) ? 0 : $rs_cashregister['canceled'][2];

		$incomeDebit = (empty($rs_cashregister['payment'][3])) 	? 0 : $rs_cashregister['payment'][3];
		$returnDebit = (empty($rs_cashregister['canceled'][3])) ? 0 : $rs_cashregister['canceled'][3];

		$incomeCredit = (empty($rs_cashregister['payment'][4])) 	? 0 : $rs_cashregister['payment'][4];
		$returnCredit = (empty($rs_cashregister['canceled'][4])) ? 0 : $rs_cashregister['canceled'][4];

		$incomeYappi = (empty($rs_cashregister['payment'][5])) 	? 0 : $rs_cashregister['payment'][5];
		$returnYappi = (empty($rs_cashregister['canceled'][5])) ? 0 : $rs_cashregister['canceled'][5];

		$incomeNequi = (empty($rs_cashregister['payment'][6])) 	? 0 : $rs_cashregister['payment'][6];
		$returnNequi = (empty($rs_cashregister['canceled'][6])) ? 0 : $rs_cashregister['canceled'][6];

		$incomeAnother = (empty($rs_cashregister['payment'][7])) 	? 0 : $rs_cashregister['payment'][7];
		$returnAnother = (empty($rs_cashregister['canceled'][7])) ? 0 : $rs_cashregister['canceled'][7];

		$incomeGiftcard = (empty($rs_cashregister['payment'][8])) 	? 0 : $rs_cashregister['payment'][8];
		$returnGiftcard = (empty($rs_cashregister['canceled'][8])) ? 0 : $rs_cashregister['canceled'][8];

		$total_giftcard = ['active' => 0, 'inactive' => 0];
		foreach ($rs_cashregister['giftcard'] as $giftcard) {
			$ttl_giftcard = 0;
			$giftcard_payment = json_decode($giftcard['tx_giftcard_payment'],true);
			foreach ($giftcard_payment as $key => $gcp) {
				$ttl_giftcard += $gcp['amount'];
			}
			if ($giftcard['tx_giftcard_status'] === 0) {
				$total_giftcard['inactive'] += $ttl_giftcard;
			}else{
				$total_giftcard['active'] += $ttl_giftcard;
			}
		}

		$content = '

			<div class="row">
				<div class="col-md-12 col-lg-6">
					<table class="table table-bordered">
						<thead>
							<tr class="table-success text-center">
								<th colspan="4">Movimientos</th>
							</tr>
							<tr class="table-success text-center">
								<th scope="col" style="font-size: 14pt">Método de Pago</th>
								<th scope="col" style="font-size: 14pt">Total</th>
								<th scope="col" style="font-size: 14pt">Entrada</th>
								<th scope="col" style="font-size: 14pt">Salida</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th>Efectivo</th>
								<td>'.number_format($incomeCash - $returnCash, 2).'</td>
								<td>'.number_format($incomeCash, 2).'</td>
								<td>'.number_format($returnCash, 2).'</td>
							</tr>
							<tr>
								<th>Cheque</th>
								<td>'.number_format($incomeCheck - $returnCheck, 2).'</td>
								<td>'.number_format($incomeCheck, 2).'</td>
								<td>'.number_format($returnCheck, 2).'</td>
							</tr>
							<tr>
								<th>T. Debito</th>
								<td>'.number_format($incomeDebit - $returnDebit, 2).'</td>
								<td>'.number_format($incomeDebit, 2).'</td>
								<td>'.number_format($returnDebit, 2).'</td>
							</tr>
							<tr>
								<th>T. Crédito</th>
								<td>'.number_format($incomeCredit - $returnCredit, 2).'</td>
								<td>'.number_format($incomeCredit, 2).'</td>
								<td>'.number_format($returnCredit, 2).'</td>
							</tr>
							<tr>
								<th>Yappi</th>
								<td>'.number_format($incomeYappi - $returnYappi, 2).'</td>
								<td>'.number_format($incomeYappi, 2).'</td>
								<td>'.number_format($returnYappi, 2).'</td>
							</tr>
							<tr>
								<th>Nequi</th>
								<td>'.number_format($incomeNequi - $returnNequi, 2).'</td>
								<td>'.number_format($incomeNequi, 2).'</td>
								<td>'.number_format($returnNequi, 2).'</td>
							</tr>
							<tr>
								<th>Otro</th>
								<td>'.number_format($incomeAnother - $returnAnother, 2).'</td>
								<td>'.number_format($incomeAnother, 2).'</td>
								<td>'.number_format($returnAnother, 2).'</td>
							</tr>
							<tr>
								<th>Cupón</th>
								<td>'.number_format($incomeGiftcard - $returnGiftcard, 2).'</td>
								<td>'.number_format($incomeGiftcard, 2).'</td>
								<td>'.number_format($returnGiftcard, 2).'</td>
							</tr>
						</tbody>
					</table>

					<table class="table table-bordered">
						<thead>
							<tr class="table-success text-center">
								<th colspan="4">Venta de Cupones</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th>Activos</th>
								<td>'.number_format($total_giftcard['active'], 2).'</td>
								<td colspan="2"></td>
							</tr>
							<tr>
								<th>Inactivos</th>
								<td>'.number_format($total_giftcard['inactive'], 2).'</td>
								<td colspan="2"></td>
							</tr>
						</tbody>
					</table>

				</div>
				<div class="col-md-12 col-lg-6">
					<table class="table table-bordered">
						<thead>
							<tr class="table-success text-center">
								<th colspan="2"  style="font-size: 14pt">Totales</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th>Venta Bruta</th>
								<td>B/ '.$rs_cashregister['cashregister']['tx_cashregister_grosssale'].'</td>
							</tr>
							<tr>
								<th>Descuento</th>
								<td>B/ '.$rs_cashregister['cashregister']['tx_cashregister_discount'].'</td>
							</tr>
							<tr>
								<th>Venta Neta</th>
								<td>B/ '.$rs_cashregister['cashregister']['tx_cashregister_netsale'].'</td>
							</tr>
							<tr>
								<th>Documentos</th>
								<td>B/ '.$rs_cashregister['cashregister']['tx_cashregister_quantitydoc'].'</td>
							</tr>
							<tr>
								<th>Venta Real</th>
								<td>B/ '.$rs_cashregister['cashregister']['tx_cashregister_realsale'].'</td>
							</tr>
							<tr>
								<th>Devolución</th>
								<td>B/ '.$rs_cashregister['cashregister']['tx_cashregister_returntaxable'] + $rs_cashregister['cashregister']['tx_cashregister_returnnontaxable'].'</td>
							</tr>
							<tr>
								<th>Anulado</th>
								<td>B/ '.$rs_cashregister['cashregister']['tx_cashregister_canceled'].'</td>
							</tr>
							<tr>
								<th colspan="2">Desglose ITBMS</th>
							</tr>
							<tr>
								<th>Base No Imponible</th>
								<td>B/ '.$rs_cashregister['cashregister']['tx_cashregister_nontaxable'].'</td>
							</tr>
							<tr>
								<th>Base Imponible</th>
								<td>B/ '.$rs_cashregister['cashregister']['tx_cashregister_taxable'].'</td>
							</tr>
							<tr>
								<th>Base No imponible NC</th>
								<td>B/ '.$rs_cashregister['cashregister']['tx_cashregister_returnnontaxable'].'</td>
							</tr>
							<tr>
								<th>Base imponible NC</th>
								<td>B/ '.$rs_cashregister['cashregister']['tx_cashregister_returntaxable'].'</td>
							</tr>
							<tr>
								<th>Impuesto</th>
								<td>B/ '.$rs_cashregister['cashregister']['tx_cashregister_tax'].'</td>
							</tr>
							<tr>
								<th>Impuesto N.C.</th>
								<td>B/ '.$rs_cashregister['cashregister']['tx_cashregister_returntax'].'</td>
							</tr>                                                                                                                        
						</tbody>
					</table>
				</div>
			</div>
		';


		$raw_page = [
			'date' => date('d-m-Y'),
			'title'=>'Arqueo del '.date('d-m-Y',strtotime($rs_cashregister['cashregister']['created_at'])).' a las '.date('H:i',strtotime($rs_cashregister['cashregister']['created_at'])),
			'content'=>[$content],
			'bottom'=>'',
			'title_page'=>"Arqueo de Caja"
		];
		$pdf = \App::make('dompdf.wrapper');
		$pdf->loadHTML($this->full_page($raw_page));
		return $pdf->stream();
	}
	
	public function print_requisition ($requisition_slug){
		$requisitionController = new requisitionController;
		$rs_requisition = $requisitionController->showit($requisition_slug);

		$data_content = '';
		$subtotal = 0; $total_tax = 0;
		foreach ($rs_requisition['datarequisition'] as $value) {
			$total4product = $value['tx_datarequisition_quantity']*$value['tx_datarequisition_price'];
			$data_content .= '
				<tr>
					<td class="text_center">'.$value['tx_datarequisition_quantity'].'</td>
					<td class="text_center">'.$value['tx_measure_value'].'</td>
					<td class="text_center">'.$value['tx_datarequisition_description'].'</td>
					<td class="text_center">'.number_format($value['tx_datarequisition_price'],2).'</td>
				</tr>
			';
			$subtotal += $total4product;
			$total_tax += ($value['tx_datarequisition_taxrate']*$total4product)/100;
		}
		$content = '
			<div>
				<table class="table bs_1 h_70">
					<tbody>
						<tr>
							<td class="text_left px_10 h_30"><strong>Señores(a):</strong> '.$rs_requisition['requisition']['tx_provider_value'].'</td>
							<td class="text_right px_10">#'.$rs_requisition['requisition']['tx_requisition_number'].'</td>
						</tr>
					</tbody>
				</table>
				<table class="table h_70">
					<thead>
						<tr class="bs_1">
							<th>Cantidad</td>
							<th>Medida</td>
							<th>Descripción</td>
							<th>Precio</td>
						</tr>
					</thead>
					<tbody>
						'.$data_content.'
					</tbody>
				</table>
			</div>
		';
		$content_bottom = '
			<table class="table bs_1">
				<tbody>
					<tr>
						<td class="text_right px_10 h_30"><strong>Subtotal:</strong> '.number_format($subtotal,2).'</td>
						<td class="text_right px_10"><strong>Imp:</strong> '.number_format($total_tax,2).'</td>
						<td class="text_right px_10"><strong>Total:</strong> '.number_format($subtotal+$total_tax,2).'</td>
					</tr>
				</tbody>
			</table>
		';

		$raw_page = [
			'date' => date('d-m-Y', strtotime($rs_requisition['requisition']['created_at'])),
			'title'=>'Orden de Compra #'.$rs_requisition['requisition']['tx_requisition_number'],
			'content'=>[$content],
			'bottom'=>$content_bottom,
			'title_page'=>"Orden de Compra"
		];
		$pdf = \App::make('dompdf.wrapper');
		$pdf->loadHTML($this->full_page($raw_page));
		return $pdf->stream();
	}

	public function print_paymentprovider ($paymentprovider_id){
		$paymentproviderController = new paymentproviderController;
		$rs_paymentprovider = $paymentproviderController->showit($paymentprovider_id);

		$data_content = '';
		foreach ($rs_paymentprovider['data_paymentprovider'] as $value) {
			$number = (!empty($value['tx_datapaymentprovider_number'])) ? '('.$value['tx_datapaymentprovider_number'].')' : '';
			$data_content .= '
				<tr class="bs_1">
					<td class="text_center">'.$value['tx_paymentmethod_value'].'</td>
					<td class="text_center">'.$number.'</td>
					<td class="text_center">'.number_format($value['tx_datapaymentprovider_amount'],2).'</td>
				</tr>
			';
		}
		$data_productinput = '';
		$data_requisition = '';
		foreach ($rs_paymentprovider['data_productinput'] as $key => $value) {
			$data_productinput .= '
				<tr>
					<td class="text_center">'.date('d-m-Y', strtotime($value['tx_productinput_date'])).'</td>
					<td class="text_center">'.$value['tx_productinput_number'].'</td>
					<td class="text_center">'.number_format($value['tx_productinput_total'],2).'</td>
					<td class="text_center">'.number_format($value['tx_paymentprovider_productinput_payment'],2).'</td>
				</tr>
			';
			$data_requisition .= '
				<tr>
					<td class="text_center">'.date('d-m-Y', strtotime($value['requisition_date'])).'</td>
					<td class="text_center">'.$value['tx_requisition_number'].'</td>
					<td class="text_center">'.number_format($value['tx_requisition_total'],2).'</td>
				</tr>
			';

		}
		$content = '
			<div>
				<table class="table bs_1 h_70">
					<tbody>
						<tr>
							<td class="text_left px_10 h_30"><strong>Proveedor:</strong> '.$rs_paymentprovider['info']['tx_provider_value'].'</td>
							<td class="text_right px_10">#'.$rs_paymentprovider['info']['tx_paymentprovider_number'].'</td>
						</tr>
					</tbody>
				</table>

				<table class="table h_70">
					<caption>Listado de Pagos</caption>
					<thead>
						<tr class="bs_1">
							<th>Método</td>
							<th>Numero</td>
							<th>Monto</td>
						</tr>
					</thead>
					<tbody>
						'.$data_content.'
					</tbody>
					<tfoot>
						<tr class="bs_1">
							<td colspan="2"></td>
							<td><strong>Total:</strong> '.number_format($rs_paymentprovider['info']['tx_paymentprovider_total'],2).'</td>
						</tr>
					</tfoot>
				</table>

				<table class="table h_70">
					<caption>Compras Relacionadas</caption>
					<thead>
						<tr class="bs_1">
							<th>Fecha</td>
							<th>Numero</td>
							<th>Total</td>
							<th>Abono</td>
						</tr>
					</thead>
					<tbody>
						'.$data_productinput.'
					</tbody>
					<tfoot>
						<tr>
							<td colspan="3"></td>
						</tr>
					</tfoot>
				</table>

				<table class="table h_70">
					<caption>Ordenes de Compra Relacionadas</caption>
					<thead>
						<tr class="bs_1">
							<th>Fecha</td>
							<th>Numero</td>
							<th>Total</td>
						</tr>
					</thead>
					<tbody>
						'.$data_requisition.'
					</tbody>
					<tfoot>
						<tr>
							<td colspan="3"></td>
						</tr>
					</tfoot>
				</table>

			</div>
		';
		$content_bottom = '';

		$raw_page = [
			'date' => date('d-m-Y', strtotime($rs_paymentprovider['info']['created_at'])),
			'title'=>'Pago #'.$rs_paymentprovider['info']['tx_paymentprovider_number'],
			'content'=>[$content],
			'bottom'=>$content_bottom,
			'title_page'=>"Información de Pago"
		];
		$pdf = \App::make('dompdf.wrapper');
		$pdf->loadHTML($this->full_page($raw_page));
		return $pdf->stream();
	}

	public function print_productoutput ($productoutput_id){
		$productoutputController = new productoutputController;
		$rs_productoutput = $productoutputController->showit($productoutput_id);

		$data_content = '';
		foreach ($rs_productoutput['dataproductoutput'] as $value) {
			$data_content .= '
				<tr>
					<td class="text_center">'.$value['tx_dataproductoutput_quantity'].'</td>
					<td class="text_center">'.$value['tx_measure_value'].'</td>
					<td class="text_center">'.$value['tx_product_value'].'</td>
				</tr>
			';
		}
		$content = '
			<div>
				<table class="table bs_1 h_70">
					<tbody>
						<tr>
							<td class="text_left px_10 h_30"><strong>Motivo:</strong> '.$rs_productoutput['info']['tx_productoutput_reason'].'</td>
							<td class="text_right px_10"><strong>Total:</strong> B/. '.$rs_productoutput['info']['tx_productoutput_total'].'</td>
						</tr>
					</tbody>
				</table>
				<table class="table h_70">
					<thead>
						<tr class="bs_1">
							<th>Cantidad</td>
							<th>Medida</td>
							<th>Descripción</td>
						</tr>
					</thead>
					<tbody>
						'.$data_content.'
					</tbody>
				</table>
			</div>
		';
		$content_bottom = '';

		$raw_page = [
			'date' => date('d-m-Y', strtotime($rs_productoutput['info']['created_at'])),
			'title'=>'Salida de Producto' ,
			'content'=>[$content],
			'bottom'=>$content_bottom,
			'title_page'=>"Salida de Producto"
		];
		$pdf = \App::make('dompdf.wrapper');
		$pdf->loadHTML($this->full_page($raw_page));
		return $pdf->stream();
	}

	public function print_charge ($charge_slug){
		$chargeController = new chargeController;
		$charge_data = $chargeController->showIt($charge_slug);
		$birthday_congrats = ($charge_data['charge']['tx_client_birthday'] != '1970-01-01' && date('d-m', strtotime($charge_data['charge']['tx_client_birthday'])) === date('d-m', strtotime($charge_data['charge']['created_at']))) ? 1:0;
		$chargeController->print_receipt($charge_data['charge']['tx_charge_number'],$charge_data['charge']['created_at'],$charge_data['charge']['tx_client_name'],$charge_data['charge']['tx_client_cif'].' DV'.$charge_data['charge']['tx_client_dv'],$charge_data['article'],$charge_data['charge']['tx_charge_nontaxable']+$charge_data['charge']['tx_charge_taxable'],$charge_data['charge']['tx_charge_discount'],$charge_data['charge']['tx_charge_tax'],$charge_data['charge']['tx_charge_total'],$charge_data['payment'],$charge_data['charge']['tx_charge_change'],$charge_data['charge']['user_name'],$birthday_congrats, $charge_data['charge']['tx_charge_tip']);
		return response()->json(['status'=>'success','message'=>'Recibo Impreso.']);
	}

	public function print_reportcommanddata ($from,$to,$str){
		$c_from = date('Y-m-d H:i:s',strtotime($from." 00:00:01"));
		$c_to = date('Y-m-d H:i:s',strtotime($to." 23:59:00"));
		$str = ($str === 'empty') ? '' : $str;

		$rs = tm_commanddata::select('tm_commanddatas.created_at','tm_commanddatas.tx_commanddata_quantity','tm_commanddatas.tx_commanddata_price','tm_commanddatas.commanddata_ai_article_id','tm_commanddatas.tx_commanddata_description','tm_commanddatas.commanddata_ai_presentation_id','tm_presentations.tx_presentation_value')
		->join('tm_presentations','tm_presentations.ai_presentation_id','tm_commanddatas.commanddata_ai_presentation_id')
		->where('tm_commanddatas.created_at','>=',$c_from)
		->where('tm_commanddatas.created_at','<=',$c_to)
		->where('tx_commanddata_description','like','%'.$str.'%')
		->orderby('tx_commanddata_description')
		->get();



		$raw_report = [];
		foreach ($rs as $key => $commanddata) {
			$i = -1;
			foreach ($raw_report as $key => $report) {
				if($report['article_id'] === $commanddata['commanddata_ai_article_id'] && $report['presentation_id'] === $commanddata['commanddata_ai_presentation_id']){
					$i = $key;
					break;
				}
			}

			if ($i != -1) {
				$raw_report[$i]['quantity'] += $commanddata['tx_commanddata_quantity'];
				$raw_report[$i]['price'] += $commanddata['tx_commanddata_quantity']*$commanddata['tx_commanddata_price'];
			}else{
				array_push($raw_report,[
          'article_id' 	=> $commanddata['commanddata_ai_article_id'],
          'quantity'		=> $commanddata['tx_commanddata_quantity'], 
          'article_description'	=> $commanddata['tx_commanddata_description'],
          'price' 			=> $commanddata['tx_commanddata_quantity'] * $commanddata['tx_commanddata_price'],
          'presentation_value'	=> $commanddata['tx_presentation_value'], 
          'presentation_id'			=> $commanddata['commanddata_ai_presentation_id'] 
				]);
			}
		}

		$data_content = '';
		$total = 0;
		foreach ($raw_report as $value) {
			$data_content .= '
				<tr>
					<td class="text_center">'.$value['quantity'].'</td>
					<td class="">'.$value['article_description'].'</td>
					<td class="text_center">'.$value['presentation_value'].'</td>
					<td class="text_center">'.number_format($value['price']/$value['quantity'],2).'</td>
				</tr>
			';
			$total += $value['price'];
		}
		$content = '
			<div>
				<h4>Listado de Comandas, Desde: '.date('d-m-Y',strtotime($from)).' Hasta: '.date('d-m-Y',strtotime($to)).'</h4>
				<table class="table h_70">
					<thead>
						<tr class="bs_1">
							<th>Cantidad</td>
							<th>Descripción</td>
							<th>Medida</td>
							<th>Precio Regular</td>
						</tr>
					</thead>
					<tbody>
						'.$data_content.'
					</tbody>
					<tfoot>
						<tr class="bs_1">
							<td colspan="3"></td>
							<th>Total: '.number_format($total,2).'</td>
						</tr>
					</tfoot>

				</table>
			</div>
		';
		$content_bottom = '';

		$raw_page = [
			'date' => date('d-m-Y'),
			'title'=>'Ventas por Art&iacute;culo' ,
			'content'=>[$content],
			'bottom'=>$content_bottom,
			'title_page'=>"Ventas por Art&iacute;culo"
		];
		$pdf = \App::make('dompdf.wrapper');
		$pdf->loadHTML($this->full_page($raw_page));
		return $pdf->stream();
	}

	public function print_reportdataproductinput ($from,$to,$str){
		$c_from = date('Y-m-d H:i:s',strtotime($from." 00:00:01"));
		$c_to = date('Y-m-d H:i:s',strtotime($to." 23:59:00"));
		$str = ($str === 'empty') ? '' : $str;

		$rs = tm_dataproductinput::select('tm_dataproductinputs.created_at','tm_dataproductinputs.tx_dataproductinput_quantity','tm_dataproductinputs.tx_dataproductinput_price','tm_dataproductinputs.dataproductinput_ai_product_id','tm_dataproductinputs.tx_dataproductinput_description','tm_dataproductinputs.dataproductinput_ai_measurement_id','tm_measures.tx_measure_value')
		->join('tm_measures','tm_measures.ai_measure_id','tm_dataproductinputs.dataproductinput_ai_measurement_id')
		->where('tm_dataproductinputs.created_at','>=',$c_from)
		->where('tm_dataproductinputs.created_at','<=',$c_to)
		->where('tx_dataproductinput_description','like','%'.$str.'%')
		->orderby('tx_dataproductinput_description')
		->get();

		$raw_report = [];
		foreach ($rs as $key => $dataproductinput) {
			$i = -1;
			foreach ($raw_report as $key => $report) {
				if($report['article_id'] === $dataproductinput['dataproductinput_ai_product_id'] && $report['measure_id'] === $dataproductinput['dataproductinput_ai_measure_id']){
					$i = $key;
					break;
				}
			}

			if ($i != -1) {
				$raw_report[$i]['quantity'] += $dataproductinput['tx_dataproductinput_quantity'];
				$raw_report[$i]['price'] += $dataproductinput['tx_dataproductinput_quantity'] * $dataproductinput['tx_dataproductinput_price'];
			}else{
				array_push($raw_report,[
          'article_id' 	=> $dataproductinput['dataproductinput_ai_product_id'],
          'quantity'		=> $dataproductinput['tx_dataproductinput_quantity'], 
          'product_description'	=> $dataproductinput['tx_dataproductinput_description'],
          'price' 			=> $dataproductinput['tx_dataproductinput_quantity'] * $dataproductinput['tx_dataproductinput_price'],
          'measure_value'	=> $dataproductinput['tx_measure_value'], 
          'measure_id'			=> $dataproductinput['dataproductinput_ai_measure_id'] 
				]);
			}
		}

		$data_content = '';
		$total = 0;
		foreach ($raw_report as $value) {
			$data_content .= '
				<tr class="bs_1">
					<td class="text_center">'.$value['quantity'].'</td>
					<td class="">'.$value['product_description'].'</td>
					<td class="text_center">'.$value['measure_value'].'</td>
					<td class="text_center">'.number_format($value['price']/$value['quantity'],2).'</td>
				</tr>
			';
			$total += $value['price'];
		}
		$content = '
			<div>
				<h4>Listado de Productos Comprados, Desde: '.date('d-m-Y',strtotime($from)).' Hasta: '.date('d-m-Y',strtotime($to)).'</h4>
				<table class="table h_70">
					<thead>
						<tr class="bs_1">
							<th>Cantidad</td>
							<th>Descripción</td>
							<th>Medida</td>
							<th>Precio Regular</td>
						</tr>
					</thead>
					<tbody>
						'.$data_content.'
					</tbody>
					<tfoot>
						<tr class="bs_1">
							<td colspan="3"></td>
							<th>Total: '.number_format($total,2).'</td>
						</tr>
					</tfoot>

				</table>
			</div>
		';


		
		// $content = '
		// 	<div>
		// 		<h4>Listado de Productos Comprados, Desde: </h4>
		// 		<table class="table">
		// 			<thead>
		// 				<tr class="bs_1">
		// 					<th>Cantidad</td>
		// 				</tr>
		// 			</thead>
		// 			<tbody>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
		// 				<tr class="bs_1">
		// 					<td>
		// 							Lorem ipsum dolor sit amet consectetur adipi<br/>sicing elit. Ex aspernatur cupiditate exercitationem, minima p<br/>erferendis dicta a incidunt et, voluptates quia odit distinct<br/>io magnam? Eveniet deleniti sit quod corporis vel cupiditate.
		// 					</td>
		// 				</tr>
					


		// 			</tbody>
		// 			<tfoot>
		// 				<tr class="bs_1">
		// 					<th>Total: 324342</td>
		// 				</tr>
		// 			</tfoot>

		// 		</table>
		// 	</div>
		

		
		// ';
		$content_bottom = '';

		$raw_page = [
			'date' => date('d-m-Y'),
			'title'=>'Compras por Producto',
			'content'=>[$content],
			'bottom'=>$content_bottom,
			'title_page'=>"Compras por Producto"
		];
		$pdf = \App::make('dompdf.wrapper');
		$pdf->loadHTML($this->full_page($raw_page));
		return $pdf->stream();
	}

	public function print_reportcommanddataproduct ($from,$to,$str){
		$c_from = date('Y-m-d H:i:s',strtotime($from." 00:00:01"));
		$c_to = date('Y-m-d H:i:s',strtotime($to." 23:59:00"));
		$str = ($str === 'empty') ? '' : $str;

		$rs = tm_commanddata::select('tm_commanddatas.tx_commanddata_recipe', 'tm_commanddatas.tx_commanddata_status', 'tm_commands.tx_command_consumption')
		->join('tm_commands','tm_commands.ai_command_id','tm_commanddatas.commanddata_ai_command_id')
		->where('tm_commanddatas.created_at','>=',$c_from)
		->where('tm_commanddatas.created_at','<=',$c_to)
		->where('tx_commanddata_recipe','like','%'.$str.'%')
		->orderby('tx_commanddata_description')
		->get();

		$raw_product = [];
		foreach ($rs as $commanddata) {
			if ($commanddata['tx_commanddata_status'] === 1) {
				$raw_recipe = json_decode($commanddata['tx_commanddata_recipe'],true);
				foreach ($raw_recipe as $key => $recipe) {
					foreach ($recipe as $ingredient) {
						$split = explode(",",$ingredient);
	
						if ($commanddata['tx_command_consumption'] === 'Local') {
							if (!empty($split[4])) {
								if ($split[4] != 'togo') {
									$rs_measure = tm_measure::select('tx_measure_value')->where('ai_measure_id',$split[1])->first();
									$rs_product = tm_product::select('tx_product_value')->where('ai_product_id',$split[2])->first();
									if (empty($str)) {
										array_push($raw_product, [
											'quantity' => $split[0],
											'measure_id' => $split[1],
											'measure_value' => $rs_measure['tx_measure_value'],
											'product_id' => $split[2],
											'product_description' => $rs_product['tx_product_value']
										]);
									}else{
										if (substr_count(strtolower($rs_product['tx_product_value']),strtolower($str)) > 0) {
											array_push($raw_product, [
												'quantity' => $split[0],
												'measure_id' => $split[1],
												'measure_value' => $rs_measure['tx_measure_value'],
												'product_id' => $split[2],
												'product_description' => $rs_product['tx_product_value']
											]);
										}
									}
								}
							}else{
								$rs_measure = tm_measure::select('tx_measure_value')->where('ai_measure_id',$split[1])->first();
								$rs_product = tm_product::select('tx_product_value')->where('ai_product_id',$split[2])->first();
								if (empty($str)) {
									array_push($raw_product, [
										'quantity' => $split[0],
										'measure_id' => $split[1],
										'measure_value' => $rs_measure['tx_measure_value'],
										'product_id' => $split[2],
										'product_description' => $rs_product['tx_product_value']
									]);
								}else{
									if (substr_count(strtolower($rs_product['tx_product_value']),strtolower($str)) > 0) {
										array_push($raw_product, [
											'quantity' => $split[0],
											'measure_id' => $split[1],
											'measure_value' => $rs_measure['tx_measure_value'],
											'product_id' => $split[2],
											'product_description' => $rs_product['tx_product_value']
										]);
									}
								}
							}
						}else{
							$rs_measure = tm_measure::select('tx_measure_value')->where('ai_measure_id',$split[1])->first();
							$rs_product = tm_product::select('tx_product_value')->where('ai_product_id',$split[2])->first();
							if (empty($str)) {
								array_push($raw_product, [
									'quantity' => $split[0],
									'measure_id' => $split[1],
									'measure_value' => $rs_measure['tx_measure_value'],
									'product_id' => $split[2],
									'product_description' => $rs_product['tx_product_value']
								]);
							}else{
								if (substr_count(strtolower($rs_product['tx_product_value']),strtolower($str)) > 0) {
									array_push($raw_product, [
										'quantity' => $split[0],
										'measure_id' => $split[1],
										'measure_value' => $rs_measure['tx_measure_value'],
										'product_id' => $split[2],
										'product_description' => $rs_product['tx_product_value']
									]);
								}
							}
						}
					}
				}
			}
		}



		$raw_report = [];
		foreach ($raw_product as $key => $commanddata) {
			$i = -1;
			foreach ($raw_report as $key => $report) {
				if($report['product_id'] === $commanddata['product_id'] && $report['measure_id'] === $commanddata['measure_id']){
					$i = $key;
					break;
				}
			}

			if ($i != -1) {
				$raw_report[$i]['quantity'] += floatval($commanddata['quantity']);
			}else{
				array_push($raw_report,[
          'product_id' 	=> $commanddata['product_id'],
          'quantity'		=> floatval($commanddata['quantity']), 
          'product_description'	=> $commanddata['product_description'],
          'measure_value'	=> $commanddata['measure_value'], 
          'measure_id'			=> $commanddata['measure_id'] 
				]);
			}
		}

		$data_content = '';
		$total = 0;
		foreach ($raw_report as $value) {
			$data_content .= '
				<tr>
					<td class="text_center">'.$value['quantity'].'</td>
					<td class="text_center">'.$value['measure_value'].'</td>
					<td class="">'.$value['product_description'].'</td>
				</tr>
			';
		}
		$content = '
			<div>
				<h4>Listado de Productos incluidos, Desde: '.date('d-m-Y',strtotime($from)).' Hasta: '.date('d-m-Y',strtotime($to)).'</h4>
				<table class="table h_70">
					<thead>
						<tr class="bs_1">
							<th>Cantidad</td>
							<th>Medida</td>
							<th>Descripción</td>
						</tr>
					</thead>
					<tbody>
						'.$data_content.'
					</tbody>
					<tfoot>
						<tr class="bs_1">
							<td colspan="4">&nbsp;</td>
						</tr>
					</tfoot>
				</table>
			</div>
		';
		$content_bottom = '';

		$raw_page = [
			'date' => date('d-m-Y'),
			'title'=>'Ventas por Productos' ,
			'content'=>[$content],
			'bottom'=>$content_bottom,
			'title_page'=>"Ventas por Productos"
		];
		$pdf = \App::make('dompdf.wrapper');
		$pdf->loadHTML($this->full_page($raw_page));
		return $pdf->stream();
	}
	
	public function print_reporttotalproductinput ($from,$to){
		$c_from = date('Y-m-d H:i:s',strtotime($from." 00:00:01"));
		$c_to = date('Y-m-d H:i:s',strtotime($to." 23:59:00"));

		$productinputController = new productinputController;
		$rs_productinput = $productinputController->report($from,$to);

		$total_nontaxable = 0;
		$total_taxable = 0;
		$total_tax = 0;
		foreach($rs_productinput['list'] as $productinput) {
		$total_nontaxable  += $productinput['tx_productinput_nontaxable'];
		$total_taxable     += $productinput['tx_productinput_taxable'];
		$total_tax         += $productinput['tx_productinput_tax'];
		}

		$content = '
			<div class="row py-4">
				<div class="col-sm-12 text-center">
				<h3>Reporte de Compras</h3>
				<strong>Desde:</strong> '.date('d-m-Y', strtotime($c_from)).'
				&nbsp;
				<strong>Hasta:</strong> '.date('d-m-Y', strtotime($c_to)).'	
				</div>
			</div>
			<div class="row">
				<div class="col-sm-12 text-center">
				<h5>TOTALES DE COMPRAS</h5>
				</div>
				<div class="col-sm-12 text-center">
				<strong>Base No Imponible</strong><br><strong>B/</strong> '.number_format($total_nontaxable,2).'
				</div>
				<div class="col-sm-12 text-center">
				<strong>Base Imponible</strong><br><strong>B/</strong> '.number_format($total_taxable,2).'
				</div>
				<div class="col-sm-12 text-center">
				<strong>Impuesto</strong><br><strong>B/</strong> '.number_format($total_tax,2).'
				</div>
				<div class="col-sm-12 text-center">
				<strong>Total</strong><br><strong>B/</strong> '.number_format($total_nontaxable+$total_taxable+$total_tax,2).'
				</div>
			</div>
		';
		$content_bottom = '';

		$raw_page = [
			'date' => date('d-m-Y'),
			'title'=>'Total de Compras',
			'content'=>[$content],
			'bottom'=>$content_bottom,
			'title_page'=>"Total de Compras"
		];
		$pdf = \App::make('dompdf.wrapper');
		$pdf->loadHTML($this->full_page($raw_page));
		return $pdf->stream();
	}

	public function print_reporttotalcharge ($from,$to){
		$c_from = date('Y-m-d H:i:s',strtotime($from." 00:00:01"));
		$c_to = date('Y-m-d H:i:s',strtotime($to." 23:59:00"));

		$chargeController = new chargeController;
		$rs_charge = $chargeController->report($from,$to);
		$creditnoteController = new creditnoteController;
		$rs_creditnote = $creditnoteController->report($from,$to);

		$total_nontaxable = 0;
		$total_taxable = 0;
		$total_tax = 0;
		$total_change = 0;
		foreach ($rs_charge['list'] as $key => $charge)  {
			$total_nontaxable += $charge['tx_charge_nontaxable'];
			$total_taxable += $charge['tx_charge_taxable'];
			$total_tax += $charge['tx_charge_tax'];
			$total_change += $charge['tx_charge_change'];
		}

		$cn_nontaxable = 0;
		$cn_taxable = 0;
		$cn_tax = 0;
		foreach ($rs_creditnote['list'] as $key => $creditnote) {
			$cn_nontaxable += $creditnote['tx_creditnote_nontaxable'];
			$cn_taxable += $creditnote['tx_creditnote_taxable'];
			$cn_tax += $creditnote['tx_creditnote_tax'];
		}

		$raw_paymenttotal = [1=>0, 2=>0, 3=>0, 4=>0, 5=>0, 6=>0, 7=>0, 8=>0 ];
		foreach ($rs_charge['paymentmethod'] as $key => $payment)  {
			$raw_paymenttotal[$payment['payment_ai_paymentmethod_id']] += $payment['tx_payment_amount'];
		}
		$content = '
			<div class="row py-4">
				<div class="col-sm-12 text-center">
				<h3>Reporte de Ventas</h3>
				<strong>Desde:</strong> '.date('d-m-Y',strtotime($c_from)).'
				&nbsp;
				<strong>Hasta:</strong> '.date('d-m-Y',strtotime($c_to)).'		
				</div>
			</div>
			<div class="row">
				<div class="col-sm-12 text-center">
				<h5>TOTALES DE VENTA</h5>
				</div>
				<div class="col-sm-12 text-center">
				<strong>Base No Imponible</strong><br><strong>B/</strong> '.number_format($total_nontaxable,2).'
				</div>
				<div class="col-sm-12 text-center">
				<strong>Base Imponible</strong><br><strong>B/</strong>  '.number_format($total_taxable,2).'
				</div>
				<div class="col-sm-12 text-center">
				<strong>Impuesto</strong><br><strong>B/</strong>  '.number_format($total_tax,2).'
				</div>
				<div class="col-sm-12 text-center">
				<strong>Total</strong><br><strong>B/</strong>  '.number_format($total_nontaxable+$total_taxable+$total_tax,2).'
				</div>
				<div class="col-sm-12 text-center">
				<h5>TOTALES NOTA DE CREDITO</h5>
				</div>
				<div class="col-sm-12 text-center">
				<strong>Base No Imponible</strong><br><strong>B/</strong> '.number_format($cn_nontaxable,2).'
				</div>
				<div class="col-sm-12 text-center">
				<strong>Base Imponible</strong><br><strong>B/</strong> '.number_format($cn_taxable,2).'
				</div>
				<div class="col-sm-12 text-center">
				<strong>Devolucion de Impuestos</strong><br><strong>B/</strong> '.number_format($cn_tax,2).'
				</div>
				<div class="col-sm-12 text-center">
				<strong>Total</strong><br><strong>B/</strong> '.number_format($cn_nontaxable+$cn_taxable+$cn_tax,2).'
				</div>
			</div>
			<div class="row pt-4">
				<div class="col-lg-12">
							<table class="table">
								<tbody>
									<tr class="bs_1">
										<th colspan="4">Medios de Pago</td>
									</tr>
									<tr>
										<td>
											<strong>Efectivo</strong><br>
											B/ '.number_format($raw_paymenttotal[1]-$total_change,2).'
										</td>
										<td>
											<strong>Cheque</strong><br>
											B/ '.number_format($raw_paymenttotal[2],2).'
										</td>
										<td>
											<strong>Tarjeta Debito</strong><br>
											B/ '.number_format($raw_paymenttotal[3],2).'
										</td>
										<td>
											<strong>Tarjeta Credito</strong><br>
											B/ '.number_format($raw_paymenttotal[4],2).'
										</td>
									</tr>
									<tr>
										<td>
											<strong>Yappi</strong><br>
											B/ '.number_format($raw_paymenttotal[5],2).'
										</td>
										<td>
											<strong>Nequi</strong><br>
											B/ '.number_format($raw_paymenttotal[6],2).'
										</td>
										<td>
											<strong>Otro</strong><br>
											B/ '.number_format($raw_paymenttotal[7],2).'
										</td>
										<td>
											<strong>Cupon</strong><br>
											B/ '.number_format($raw_paymenttotal[8],2).'
										</td>
									</tr>
								</tbody>
								<tfoot>
									<tr class="bs_1">
										<td colspan="4">&nbsp;</td>
									</tr>
								</tfoot>
							</table>
				</div>
			</div>
		';

		$content_bottom = '';

		$raw_page = [
			'date' => date('d-m-Y'),
			'title'=>'Total de Ventas',
			'content'=>[$content],
			'bottom'=>$content_bottom,
			'title_page'=>"Total de Ventas"
		];
		$pdf = \App::make('dompdf.wrapper');
		$pdf->loadHTML($this->full_page($raw_page));
		return $pdf->stream();
	}
	
	public function print_reportdetailproductinput ($from,$to){
		$c_from = date('Y-m-d H:i:s',strtotime($from." 00:00:01"));
		$c_to = date('Y-m-d H:i:s',strtotime($to." 23:59:00"));

		$productinputController = new productinputController;
		$rs_productinput = $productinputController->report($from,$to);

		$total_nontaxable = 0;
		$total_taxable = 0;
		$total_tax = 0;
		$content = '
			<h5>Listado de Compras, Desde: '.date('d-m-Y',strtotime($c_from)).' Hasta: '.date('d-m-Y',strtotime($c_to)).'</h5>
			<table class="table table-bordered table-condensed table-striped table-print">
				<thead style="border: solid">
				<tr>
					<th class="col-xs-2 col-sm-2 col-md-2 col-lg-2">Fecha</th>
					<th class="col-xs-4 col-sm-4 col-md-4 col-lg-4">Proveedor</th>
					<th class="col-xs-3 col-sm-3 col-md-3 col-lg-3">RUC</th>
					<th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">#Num.</th>
					<th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">Imp.</th>
					<th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">Total</th>
				</tr>
				</thead>
				<tbody>
		';
    	foreach($rs_productinput['list'] as $productinput) {
			$content .= '
				<tr>
					<td>'.date('d-m-Y',strtotime($productinput['tx_productinput_date'])).'</td>
					<td>'.$productinput['tx_provider_value'].'</td>
					<td>'.$productinput['tx_provider_ruc'].' DV'.$productinput['tx_provider_dv'].'</td>
					<td>'.$productinput['tx_productinput_number'].'</td>
					<td>'.number_format($productinput['tx_productinput_tax'],2).'</td>
					<td>'.number_format($productinput['tx_productinput_total'],2).'</td>
				</tr>
			';
			$total_nontaxable  += $productinput['tx_productinput_nontaxable'];
			$total_taxable     += $productinput['tx_productinput_taxable'];
			$total_tax         += $productinput['tx_productinput_tax'];
    	}
		$content .= '
			</tbody>
			<tfoot style="border:solid;">
				<tr>
					<td colspan="6">
						<table class="table" style="border: 0;">
							<tbody>
								<tr>
									<td style="border: 0;"><strong>Subtotal: </strong> B/ '.number_format($total_nontaxable+$total_taxable,2).'</th>
									<td style="border: 0;"><strong>Imp.: </strong> B/ '.number_format($total_tax,2).'</th>
									<td style="border: 0;"><strong>Total: </strong> B/ '.number_format($total_nontaxable+$total_taxable+$total_tax,2).'</th>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tfoot>
		</table>
		';
		$content_bottom = '';

		$raw_page = [
			'date' => date('d-m-Y'),
			'title'=>'Listado de Compras',
			'content'=>[$content],
			'bottom'=>$content_bottom,
			'title_page'=>"Listado de Compras"
		];
		$pdf = \App::make('dompdf.wrapper');
		$pdf->loadHTML($this->full_page($raw_page));
		return $pdf->stream();
	}

	public function print_reportdetailcharge ($from,$to){
		$c_from = date('Y-m-d H:i:s',strtotime($from." 00:00:01"));
		$c_to = date('Y-m-d H:i:s',strtotime($to." 23:59:00"));

		$chargeController = new chargeController;
		$rs_charge = $chargeController->report($from,$to);
		$creditnoteController = new creditnoteController;
		$rs_creditnote = $creditnoteController->report($from,$to);

		$total_nontaxable = 0;
		$total_taxable = 0;
		$total_tax = 0;
		$total_change = 0;

		$total_cn_nontaxable = 0;
		$total_cn_taxable = 0;
		$total_cn_tax = 0;

    	$content = '
			<h5>Listado de Ventas, Desde: '.date('d-m-Y',strtotime($c_from)).' Hasta: '.date('d-m-Y',strtotime($c_to)).'</h5>
				<table class="table table-bordered table-condensed table-striped table-print">
					<thead style="border: solid">
						<tr class="text-center">
							<th class="col-sm-2">Fecha</th>
							<th class="col-sm-1">#Num</th>
							<th class="col-sm-5">Cliente</th>
							<th class="col-sm-2">Cajera(o)</th>
							<th class="col-sm-1">%Desc.</th>
							<th class="col-sm-1">Total</th>
						</tr>
					</thead>
					<tbody>
    	';
		foreach ($rs_charge['list'] as $key => $charge) {
			$content .= '
				<tr>
				<td>'.date('d-m-Y h:i A',strtotime($charge['created_at'])).'</td>
				<td>'.$charge['tx_charge_number'].'</td>
				<td>'.$charge['tx_client_name'].' RUC '.$charge['tx_client_cif'].' DV '.$charge['tx_client_dv'].'</td>
				<td>'.$charge['user_name'].'</td>
				<td>'.number_format($charge['tx_charge_discount'],2).'</td>
				<td>'.number_format($charge['tx_charge_total'],2).'</td>
				</tr>
			';
			$total_nontaxable += $charge['tx_charge_nontaxable'];
			$total_taxable += $charge['tx_charge_taxable'];
			$total_tax += $charge['tx_charge_tax'];
		}
    	$content .= '
					</tbody>
					<tfoot style="border:solid;">
						<tr>
							<td colspan="6">
								<table class="table" style="border: 0;">
									<tbody>
										<tr>
											<td style="border: 0;"><strong>Subtotal: </strong> B/ '.number_format($total_nontaxable+$total_taxable,2).'</th>
											<td style="border: 0;"><strong>Imp.: </strong> B/ '.number_format($total_tax,2).'</th>
											<td style="border: 0;"><strong>Total: </strong> B/ '.number_format($total_nontaxable+$total_taxable+$total_tax,2).'</th>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
				</tfoot>
			</table>
    	';

		$content .= '
		<h5>Listado de Notas de Cr&eacute;dito, Desde: '.date('d-m-Y',strtotime($c_from)).' Hasta: '.date('d-m-Y',strtotime($c_to)).'</h5>
		<table class="table table-bordered table-condensed table-striped table-print">
			<thead style="border: solid">
			<tr class="text-center">
				<th class="col-sm-2">Fecha</th>
				<th class="col-sm-1">#Num</th>
				<th class="col-sm-5">Cliente</th>
				<th class="col-sm-2">Cajera(o)</th>
				<th class="col-sm-1">Imp.</th>
				<th class="col-sm-1">Total</th>
			</tr>
			</thead>
			<tbody>
		';
		foreach ($rs_creditnote['list'] as $key => $creditnote) {
			$content .= '
				<tr>
					<td>'.date('d-m-Y h:i A', strtotime($creditnote['created_at'])).'</td>
					<td>'.$creditnote['tx_creditnote_number'].'</td>
					<td>'.$creditnote['tx_client_name'].' RUC '.$creditnote['tx_client_cif'].' DV '.$creditnote['tx_client_dv'].'</td>
					<td>'.$creditnote['user_name'].'</td>
					<td>'.$creditnote['tx_creditnote_tax'].'</td>
					<td>'.number_format($creditnote['tx_creditnote_nontaxable'] + $creditnote['tx_creditnote_taxable'] + $creditnote['tx_creditnote_tax'],2).'</td>
				</tr>
			';
			$total_cn_nontaxable += $creditnote['tx_creditnote_nontaxable'];
			$total_cn_taxable += $creditnote['tx_creditnote_taxable'];
			$total_cn_tax += $creditnote['tx_creditnote_tax'];
		}
		$content .= '
			</tbody>
			<tfoot style="border:solid;">
			<tr>
				<td colspan="6">
								<table class="table" style="border: 0;">
									<tbody>
										<tr>
											<td style="border: 0;"><strong>Subtotal: </strong> B/ '.number_format($total_cn_nontaxable+$total_cn_taxable,2).'</th>
											<td style="border: 0;"><strong>Imp.: </strong> B/ '.number_format($total_cn_tax,2).'</th>
											<td style="border: 0;"><strong>Total: </strong> B/ '.number_format($total_cn_nontaxable+$total_cn_taxable+$total_cn_tax,2).'</th>
										</tr>
									</tbody>
								</table>
							</td>
			</tr>
			</tfoot>
		</table>
		';

		$content_bottom = '';

		$raw_page = [
			'date' => date('d-m-Y'),
			'title'=>'Listado de Ventas',
			'content'=>[$content],
			'bottom'=>$content_bottom,
			'title_page'=>"Listado de Ventas"
		];
		$pdf = \App::make('dompdf.wrapper');
		$pdf->loadHTML($this->full_page($raw_page));
		return $pdf->stream();
	}

	public function print_reportdetailcreditnote ($from,$to){
		$c_from = date('Y-m-d H:i:s',strtotime($from." 00:00:01"));
		$c_to = date('Y-m-d H:i:s',strtotime($to." 23:59:00"));

		$creditnoteController = new creditnoteController;
		$rs_creditnote = $creditnoteController->report($from,$to);

		$total_cn_nontaxable = 0;
		$total_cn_taxable = 0;
		$total_cn_tax = 0;

		$content = '
		<h5>Listado de Notas de Cr&eacute;dito, Desde: '.date('d-m-Y',strtotime($c_from)).' Hasta: '.date('d-m-Y',strtotime($c_to)).'</h5>
		<table class="table table-bordered table-condensed table-striped table-print">
			<thead style="border: solid">
			<tr class="text-center">
				<th class="col-sm-2">Fecha</th>
				<th class="col-sm-1">#Num</th>
				<th class="col-sm-5">Cliente</th>
				<th class="col-sm-2">Cajera(o)</th>
				<th class="col-sm-1">Imp.</th>
				<th class="col-sm-1">Total</th>
			</tr>
			</thead>
			<tbody>
		';
		foreach ($rs_creditnote['list'] as $key => $creditnote) {
			$content .= '
				<tr>
				<td>'.date('d-m-Y h:i A', strtotime($creditnote['created_at'])).'</td>
				<td>'.$creditnote['tx_creditnote_number'].'</td>
				<td>'.$creditnote['tx_client_name'].' RUC '.$creditnote['tx_client_cif'].' DV '.$creditnote['tx_client_dv'].'</td>
				<td>'.$creditnote['user_name'].'</td>
				<td>'.$creditnote['tx_creditnote_tax'].'</td>
				<td>'.number_format($creditnote['tx_creditnote_nontaxable'] + $creditnote['tx_creditnote_taxable'] + $creditnote['tx_creditnote_tax'],2).'</td>
				</tr>
			';
			$total_cn_nontaxable += $creditnote['tx_creditnote_nontaxable'];
			$total_cn_taxable += $creditnote['tx_creditnote_taxable'];
			$total_cn_tax += $creditnote['tx_creditnote_tax'];
		}
		$content .= '
			</tbody>
			<tfoot style="border:solid;">
			<tr>
				<td colspan="6">
					<table class="table" style="border: 0;">
						<tbody>
							<tr>
								<td style="border: 0;"><strong>Subtotal: </strong> B/ '.number_format($total_cn_nontaxable+$total_cn_taxable,2).'</th>
								<td style="border: 0;"><strong>Imp.: </strong> B/ '.number_format($total_cn_tax,2).'</th>
								<td style="border: 0;"><strong>Total: </strong> B/ '.number_format($total_cn_nontaxable+$total_cn_taxable+$total_cn_tax,2).'</th>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
			</tfoot>
		</table>
		';

		$content_bottom = '';

		$raw_page = [
			'date' => date('d-m-Y'),
			'title'=>'Listado de Notas de Crédito',
			'content'=>[$content],
			'bottom'=>$content_bottom,
			'title_page'=>"Listado de Notas de Crédito"
		];
		$pdf = \App::make('dompdf.wrapper');
		$pdf->loadHTML($this->full_page($raw_page));
		return $pdf->stream();
	}

	public function print_reportproductinputbyprovider ($from,$to){
		$c_from = date('Y-m-d H:i:s',strtotime($from." 00:00:01"));
		$c_to = date('Y-m-d H:i:s',strtotime($to." 23:59:00"));

		$rs_productinput = DB::table('tm_productinputs')
		->select(DB::raw('SUM(tm_productinputs.tx_productinput_taxable) as total_taxable'),DB::raw('SUM(tm_productinputs.tx_productinput_tax) as total_tax'), DB::raw('SUM(tm_productinputs.tx_productinput_nontaxable) as total_nontaxable'),'tm_providers.tx_provider_value','tm_providers.tx_provider_ruc','tm_providers.tx_provider_dv','tm_providers.tx_provider_status')
		->join('tm_providers','tm_providers.ai_provider_id','tm_productinputs.productinput_ai_provider_id')
		->where('tm_productinputs.created_at','>=',$c_from)
		->where('tm_productinputs.created_at','<=',$c_to)
		->groupby('tm_productinputs.productinput_ai_provider_id')
		->get();
		
		$rs_productinput = json_decode(json_encode($rs_productinput),true);

		$total_nontaxable = 0;
		$total_taxable = 0;
		$total_tax = 0;
		$content = '
			<h5>Listado de Compras por Proveedor, Desde: '.date('d-m-Y',strtotime($c_from)).' Hasta: '.date('d-m-Y',strtotime($c_to)).'</h5>
			<table class="table table-bordered table-condensed table-striped table-print">
				<thead style="border: solid">
					<tr>
						<th class="col-xs-5 col-sm-5 col-md-5 col-lg-5">Proveedor</th>
						<th class="col-xs-2 col-sm-2 col-md-2 col-lg-2">RUC</th>
						<th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">Total No Imp.</th>
						<th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">Total Imponible.</th>
						<th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">Total Impuesto</th>
						<th class="col-xs-1 col-sm-1 col-md-1 col-lg-1">Total</th>
					</tr>
				</thead>
				<tbody>
		';
    	foreach($rs_productinput as $productinput) {
			$content .= '
				<tr>
					<td>'.$productinput['tx_provider_value'].'</td>
					<td>'.$productinput['tx_provider_ruc'].' DV'.$productinput['tx_provider_dv'].'</td>
					<td>'.number_format($productinput['total_nontaxable'],2).'</td>
					<td>'.number_format($productinput['total_taxable'],2).'</td>
					<td>'.number_format($productinput['total_tax'],2).'</td>
					<td>'.number_format($productinput['total_nontaxable'] + $productinput['total_taxable'] + $productinput['total_tax'],2).'</td>
				</tr>
			';
			$total_nontaxable  += $productinput['total_nontaxable'];
			$total_taxable     += $productinput['total_taxable'];
			$total_tax         += $productinput['total_tax'];
		}
		$content .= '
				</tbody>
				<tfoot style="border:solid;">
					<tr>
						<td colspan="6">
							<table class="table" style="border: 0;">
								<tbody>
									<tr>
										<td style="border: 0;"><strong>Subtotal: </strong> B/ '.number_format($total_nontaxable+$total_taxable,2).'</th>
										<td style="border: 0;"><strong>Imp.: </strong> B/ '.number_format($total_tax,2).'</th>
										<td style="border: 0;"><strong>Total: </strong> B/ '.number_format($total_nontaxable+$total_taxable+$total_tax,2).'</th>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</tfoot>
			</table>
		';
		$content_bottom = '';

		$raw_page = [
			'date' => date('d-m-Y'),
			'title'=>'Listado de Compras por Proveedor',
			'content'=>[$content],
			'bottom'=>$content_bottom,
			'title_page'=>"Listado de Compras por Proveedor"
		];
		$pdf = \App::make('dompdf.wrapper');
		$pdf->loadHTML($this->full_page($raw_page));
		return $pdf->stream();
	}

	public function print_reportdepletion ($from,$to){
		$c_from = date('Y-m-d H:i:s',strtotime($from." 00:00:01"));
		$c_to = date('Y-m-d H:i:s',strtotime($to." 23:59:00"));

		$rs = tm_depletion::select('tm_products.tx_product_value','tm_depletions.tx_depletion_quantity','tm_depletions.tx_depletion_status','tm_depletions.created_at')->join('tm_products','tm_products.ai_product_id','tm_depletions.depletion_ai_product_id')->where('tm_depletions.created_at','>=',$c_from)->where('tm_depletions.created_at','<=',$c_to)->orderby('created_at','DESC')->get();

		$total_nontaxable = 0;
		$total_taxable = 0;
		$total_tax = 0;
		$content = '
			<h5>Listado de Mermas, Desde: '.date('d-m-Y',strtotime($c_from)).' Hasta: '.date('d-m-Y',strtotime($c_to)).'</h5>
			<table class="table table-bordered table-condensed table-striped table-print">
				<thead style="border: solid">
					<tr>
						<th class="col-lg-2">Cantidad</th>
						<th class="col-lg-6">Descripción</th>
						<th class="col-lg-4">Fecha</th>
					</tr>
				</thead>
				<tbody>
    	';
		foreach($rs as $depletion) {
			$content .= '
				<tr>
					<td style="text-align: center;">'.$depletion['tx_depletion_quantity'].'</td>
					<td>'.$depletion['tx_product_value'].'</td>
					<td>'.date('d-m-Y h:i A', strtotime($depletion['created_at'])).'</td>
				</tr>
			';
		}
		$content .= '
				</tbody>
				<tfoot style="border:solid;">
				<tr>
					<td colspan="3">
						&nbsp;
					</td>
				</tr>
				</tfoot>
			</table>
		';
		$content_bottom = '';

		$raw_page = [
			'date' => date('d-m-Y'),
			'title'=>'Listado de Mermas',
			'content'=>[$content],
			'bottom'=>$content_bottom,
			'title_page'=>"Listado de Mermas"
		];
		$pdf = \App::make('dompdf.wrapper');
		$pdf->loadHTML($this->full_page($raw_page));
		return $pdf->stream();
	}

	public function print_reportcommanddatanulled ($from,$to){
		$c_from = date('Y-m-d H:i:s',strtotime($from." 00:00:01"));
		$c_to = date('Y-m-d H:i:s',strtotime($to." 23:59:00"));

		$rs = tm_commanddata::select('tm_commanddatas.tx_commanddata_quantity','tm_commanddatas.tx_commanddata_description','tm_presentations.tx_presentation_value','tm_commanddatas.created_at')->join('tm_presentations','tm_presentations.ai_presentation_id','tm_commanddatas.commanddata_ai_presentation_id')->where('tm_commanddatas.tx_commanddata_status',0)->where('tm_commanddatas.created_at','>=',$c_from)->where('tm_commanddatas.created_at','<=',$c_to)->orderby('tm_commanddatas.created_at','DESC')->get();
		
		$content = '
			<h5>Listado de Comandas Anuladas, Desde: '.date('d-m-Y',strtotime($c_from)).' Hasta: '.date('d-m-Y',strtotime($c_to)).'</h5>
			<table class="table table-bordered table-condensed table-striped table-print">
				<thead style="border: solid">
					<tr>
						<th class="col-sm-2">Cantidad</th>
						<th class="col-sm-6">Descripción</th>
						<th class="col-sm-4">Fecha</th>
					</tr>
				</thead>
				<tbody>
    	';
		foreach($rs as $anuled) {
			$content .= '
				<tr>
					<td style="text-align: center;">'.$anuled['tx_commanddata_quantity'].'</td>
					<td>'.$anuled['tx_commanddata_description'].'</td>
					<td style="text-align: center;">'.date('d-m-Y h:i A', strtotime($anuled['created_at'])).'</td>
				</tr>
			';
		}
		$content .= '
				</tbody>
				<tfoot style="border:solid;">
					<tr>
						<td colspan="3">
							&nbsp;
						</td>
					</tr>
				</tfoot>
			</table>
		';
		
		$content_bottom = '';

		$raw_page = [
			'date' => date('d-m-Y'),
			'title'=>'Comandas Anuladas' ,
			'content'=>[$content],
			'bottom'=>$content_bottom,
			'title_page'=>"Comandas Anuladas"
		];
		$pdf = \App::make('dompdf.wrapper');
		$pdf->loadHTML($this->full_page($raw_page));
		return $pdf->stream();
	}









	public function print_reportacregister ($from,$to,$user_id){
		$acregisterController = new acregisterController;
		$user_id = ($user_id === 'empty') ? '' : $user_id;
		$raw_report = $acregisterController->report($from,$to,$user_id);

		$data_counter = '';
		foreach ($raw_report['counter_list'] as $value) {
			$data_counter .= '
				<tr class="bs_1">
					<td class="text_center">'.$value['name'].'</td>
					<td class="text_center">'.$value['counter'].'</td>
					<td class="text_center">'.$value['inasistance'].'</td>
				</tr>
			';
		}
		$content[] = '
			<div>
				<h4>Conteo de Asistencias</h4>
				<table class="table h_70">
					<thead>
						<tr class="bs_1">
							<th>Nombre</td>
							<th>Asistencias</td>
							<th>Inasistencias</td>
						</tr>
					</thead>
					<tbody>
						'.$data_counter.'
					</tbody>
					<tfoot>
						<tr class="bs_1">
							<td colspan="3">&nbsp;</td>
						</tr>
					</tfoot>
				</table>
			</div>
		';

		$data_attendance = '';
		foreach ($raw_report['report'] as $raw_person) {
			foreach ($raw_person as $key => $date) {
				foreach ($date as $key => $value) {
					$data_attendance .= '
						<tr class="bs_1">
							<td class="text_center">'.$value['name'].'</td>
							<td class="text_center">'.$value['date'].'</td>
							<td class="text_center">'.((!empty($value['in'])) ? $value['in'] : "").'</td>
							<td class="text_center">'.((!empty($value['out'])) ? $value['out'] : "").'</td>
							<td class="text_center">'.((!empty($value['asistance'])) ? $value['asistance'] : "").'</td>
							<td class="text_center">'.((!empty($value['breaktime'])) ? $value['breaktime'] : "").'</td>
							<td class="text_center">'.((!empty($value['totaltime'])) ? $value['totaltime'] : "").'</td>
							<td class="text_center">'.((!empty($value['extratime'])) ? $value['extratime'] : "").'</td>
						</tr>
					';
				}
			}
		}
		$content[] = '
			<div>
				<h4>Listado de Asistencias</h4>
				<table class="table h_70">
					<thead>
						<tr class="bs_1">
							<th>Nombre</td>
							<th>Fecha</td>
							<th>Entrada</td>
							<th>Salida</td>
							<th>Asistencia</td>
							<th>Breaktime</td>
							<th>Tiempo Total</td>
							<th>Tiempo Extra</td>
						</tr>
					</thead>
					<tbody>
						'.$data_attendance.'
					</tbody>
					<tfoot>
						<tr class="bs_1">
							<td colspan="8">&nbsp;</td>
						</tr>
					</tfoot>
				</table>
			</div>
		';



		$data_register = '';
		foreach ($raw_report['list'] as $value) {
			switch ($value['tx_acregister_type']) {
				case 1:
          			$register_type = 'Entrada';
					break;
				case 2:
          			$register_type = 'Entrada al Break';
					break;
				case 3:
          			$register_type = 'Salida del Break';
					break;
				default:
          			$register_type = 'Salida';
					break;
			}

			$data_register .= '
				<tr class="bs_1">
					<td class="text_center">'.$value['id'].'</td>
					<td class="text_center">'.$value['name'].'</td>
					<td class="text_center">'.$register_type.'</td>
					<td class="text_center">'.$value['created_at'].'</td>
				</tr>
			';
		}
		$content[] = '
			<div>
				<h4>Registros</h4>
				<table class="table h_70">
					<thead>
						<tr class="bs_1">
							<th>ID</td>
							<th>Nombre</td>
							<th>Registro</td>
							<th>Fecha</td>
						</tr>
					</thead>
					<tbody>
						'.$data_register.'
					</tbody>
					<tfoot>
						<tr class="bs_1">
							<td colspan="4">&nbsp;</td>
						</tr>
					</tfoot>
				</table>
			</div>
		';



		$content_bottom = '';

		$raw_page = [
			'date' => date('d-m-Y'),
			'title'=>'Reporte de Asistencias,  <br/>Desde: '.date('d-m-Y',strtotime($from)).' Hasta: '.date('d-m-Y',strtotime($to)).'<br/>('.$raw_report['total_day'].' dias)',
			'content'=>$content,
			'bottom'=>$content_bottom,
			'title_page'=>"Reporte de Asistencias"
		];
		$pdf = \App::make('dompdf.wrapper');
		$pdf->loadHTML($this->full_page($raw_page));
		return $pdf->stream();
	}



}
