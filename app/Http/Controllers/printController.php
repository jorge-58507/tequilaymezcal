<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_cashregister;


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
		// @page { margin: 170px 25px 100px 25px;}
		$output = '
		<link type="text/css" rel="stylesheet" href="attached/css/print.css"  media="screen,projection"/>
		<link type="text/css" rel="stylesheet" href="attached/css/bootstrap.css"  media="screen,projection">
		<link type="text/css" rel="stylesheet" href="attached/js/bootstrap.css"  media="screen,projection">
		<script src="attached/js/bootstrap.min.js"></script>

		<title>'.$raw_page['title_page'].'</title>
		<style>
			.print_header { position: fixed; top: -30px; left: 0px; right: 0px; height: 50px; }
			.print_page { position: fixed; top: 130px; left: 0px; right: 0px; height: 50px; }
			.print_bottom { position: fixed; bottom: -50px; left: 0px; right: 0px; height: 50px; }
		</style>
		<div class="print_header">
				<div class="text-center col-sm-3 col_25" style="height: 100px; float: left;">&nbsp;</div>
				<div class="text-center col-sm-6 col_25" style="height: 100px; float: left;">
					<img width="115px" height="115px" src="./attached/image/logo_print.png">
					<p style="font-size: 10pt;">Boulevard Penonomé, Via Interamericana</p>
				</div>
				<div class="text-center col-sm-3 col_25" style="height: 100px; float: left; text-align: right;">'.date('d-m-Y',strtotime($raw_page['date'])).'</div>
		</div>
		<div class="print_page">
			<div class="top_content">
				<div class="col_100 text-center h_30" >
					<span class="content_title sanson_title fs_20">
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
		$rs_charge = $chargeController->showit($charge_slug);

		$data_content = '';
		foreach ($rs_charge['article'] as $value) {
			$data_content .= '
				<tr class="bs_1">
					<td class="text_center">'.$value['tx_article_code'].'</td>
					<td class="text_center">'.$value['tx_article_value'].'</td>
					<td class="text_center">'.$value['tx_commanddata_quantity'].'</td>
					<td class="text_center">'.number_format($value['tx_commanddata_price'],2).'</td>
				</tr>
			';
		}
		$data_payment = '';
		foreach ($rs_charge['payment'] as $key => $value) {
			$data_payment .= '
				<tr class="bs_1">
					<td class="text_center">'.$value['tx_paymentmethod_value'].'</td>
					<td class="text_center">'.$value['tx_payment_amount'].'</td>
					<td class="text_center">'.$value['tx_payment_number'].'</td>
				</tr>
			';
		}
		$content = '
			<div>
				<table class="table bs_1 h_70">
					<tbody>
						<tr>
							<td class="text_left px_10 h_30"><strong>Cliente:</strong> '.$rs_charge['charge']['tx_client_name'].'</td>
							<td class="text_right px_10"><strong>RUC:</strong>'.$rs_charge['charge']['tx_client_cif'].$rs_charge['charge']['tx_client_dv'].'</td>
						</tr>
						<tr>
							<td class="text_left px_10 h_30" colspan="2"><strong>Dirección:</strong> '.$rs_charge['charge']['tx_client_direction'].'</td>
						</tr>
					</tbody>
				</table>
				<table class="table bs_1 h_70">
					<tbody>
						<tr>
							<td class="text_left px_10 h_30"><strong>Cajera:</strong> '.$rs_charge['charge']['user_name'].'</td>
							<td class="text_left px_10"><strong>Fecha:</strong>'.date('d-m-Y', strtotime($rs_charge['charge']['created_at'])).'</td>
							<td class="text_left px_10" colspan="2"><strong>Hora:</strong>'.date('h:i a', strtotime($rs_charge['charge']['created_at'])).'</td>
						</tr>
						<tr>
							<td class="text_left px_10 h_30"><strong>Factura:</strong>#'.$rs_charge['charge']['tx_charge_number'].'</td>
							<td class="text_left px_10" colspan="3"><strong>Total:</strong>B/ '.number_format($rs_charge['charge']['tx_charge_total'],2).'</td>
						</tr>
						<tr>
							<td class="text_left px_10 h_30"><strong>Descuento:</strong>B/ '.number_format($rs_charge['charge']['tx_charge_discount'],2).'</td>
							<td class="text_left px_10"><strong>No Imponible:</strong>B/ '.number_format($rs_charge['charge']['tx_charge_nontaxable'],2).'</td>
							<td class="text_left px_10"><strong>Imponible:</strong>B/ '.number_format($rs_charge['charge']['tx_charge_taxable'],2).'</td>
							<td class="text_left px_10"><strong>Impuesto:</strong>B/ '.number_format($rs_charge['charge']['tx_charge_tax'],2).'</td>
						</tr>
					</tbody>
				</table>

				<table class="table h_70">
					<caption>Artículos Relacionados</caption>
					<thead style="background-color: #ccc">
						<tr class="bs_1">
							<th>Código</td>
							<th>Detalle</td>
							<th>Cantidad</td>
							<th>Precio</td>
						</tr>
					</thead>
					<tbody>
						'.$data_content.'
					</tbody>
					<tfoot>
						<tr class="bs_1">
							<td colspan="3"></td>
							<td class="text_right"><strong>Total:</strong> '.number_format($rs_charge['charge']['tx_charge_total'],2).'</td>
						</tr>
					</tfoot>
				</table>
				<table class="table h_70">
					<caption>Pagos Asociados</caption>
					<thead style="background-color: #ccc">
						<tr class="bs_1">
							<th>Método</td>
							<th>Monto</td>
							<th>Numero</td>
						</tr>
					</thead>
					<tbody>
						'.$data_payment.'
					</tbody>
				</table>

			</div>
		';
		$content_bottom = '';

		$raw_page = [
			'date' => date('d-m-Y'),
			'title'=>'Factura #'.$rs_charge['charge']['tx_charge_number'],
			'content'=>[$content],
			'bottom'=>$content_bottom,
			'title_page'=>"Información de Pago"
		];
		$pdf = \App::make('dompdf.wrapper');
		$pdf->loadHTML($this->full_page($raw_page));
		return $pdf->stream();
	}


}
