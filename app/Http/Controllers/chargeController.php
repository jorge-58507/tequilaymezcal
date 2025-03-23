<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_charge;
use App\tm_request;
use App\tm_paymentmethod;
use App\tm_payment;
use App\tm_creditnote;
use App\tm_cashoutput;
use App\tm_cashregister;
use App\tm_client;
use App\tm_giftcard;
use App\tm_article;
use App\tm_option;
use App\tm_point;

require '../vendor/autoload.php';

use Mike42\Escpos\Printer;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;
use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;

class chargeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (auth()->user()->hasAnyRole(['admin', 'super', 'cashier']) != true) {
            return redirect()->route('request.index');
        }
        $requestController = new requestController;
        $clientController = new clientController;
        $creditnoteController = new creditnoteController;
        $tableController = new tableController;

        $rs_openrequest = $requestController->getOpenRequest();
        $rs_closedrequest = $requestController->getClosedRequest();
        $rs_canceledrequest = $requestController->getCanceledRequest();
        $rs_paymentmethod = tm_paymentmethod::where('tx_paymentmethod_status', 1)->get();
        $rs_client = $clientController->getAll();
        $rs_creditnote = $creditnoteController->getAll();
        $rs_article = tm_article::select('tm_articles.ai_article_id', 'tm_articles.tx_article_thumbnail', 'tm_articles.tx_article_code', 'tm_articles.tx_article_value', 'tm_articles.tx_article_promotion', 'tm_articles.tx_article_slug', 'tm_categories.ai_category_id', 'tm_categories.tx_category_value')->join('tm_categories', 'tm_categories.ai_category_id', 'tm_articles.article_ai_category_id')->where('tx_article_status', 1)->orderby('tx_article_promotion', 'DESC')->orderby('tx_article_value', 'ASC')->get();
        $rs_table = $tableController->getAll();
        $url = tm_option::select('tx_option_value')->where('tx_option_title', 'API_URL')->first();
        $data = [
            'open_request' => $rs_openrequest,
            'closed_request' => $rs_closedrequest,
            'canceled_request' => $rs_canceledrequest,
            'paymentmethod' => $rs_paymentmethod,
            'client_list' => $rs_client,
            'article_list' => $rs_article,
            'creditnote_list' => $rs_creditnote,
            'table_list' => $rs_table['list'],
            'api_url' => $url['tx_option_value']
        ];
        return view('charge.index', compact('data'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    public function checkInternet() {
        $connected = @fsockopen("www.google.com", 80); 
        if ($connected) {
            fclose($connected);
            return true; 
        }
        return false;
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if (auth()->user()->hasAnyRole(['admin', 'super', 'cashier']) != true) {
            return response()->json(['status' => 'failed', 'message' => 'Usuario no autorizado.']);
        }

        $request_slug = $request->input('a');
        $raw_payment = $request->input('b');
        $raw_giftcard = $request->input('c');
        $tip = $request->input('d');

        $qry_request = tm_request::where('tx_request_slug', $request_slug);
        if ($qry_request->count() < 1) {
            return response()->json(['status' => 'failed', 'message' => 'Pedido no existe.']);
        }
        $rs_request = $qry_request->first();
        $commandController = new commandController;
        $raw_commanddata = $commandController->getByRequest($rs_request['ai_request_id']);
        $point_price = 0;
        $raw_price = []; //[{PRICE,discount,tax, quantity}]
        foreach ($raw_commanddata as $key => $value) {
            if ($value['tx_commanddata_status'] === 1) {
                array_push($raw_price, [
                    'price' => $value['tx_commanddata_price'],
                    'discount' => $value['tx_commanddata_discountrate'],
                    'tax' => $value['tx_commanddata_taxrate'],
                    'quantity' => $value['tx_commanddata_quantity']
                ]);
            }
            $point_price += $value['tx_article_point'];
        }
        // Verificar disponibilidad de puntos
        $qry_client = tm_client::where('ai_client_id', $rs_request['request_ai_client_id']);
        $rs_client = $qry_client->first();

        if ($rs_client['tx_client_point'] < $point_price) {
            return response()->json(['status' => 'failed', 'message' => 'El cliente no dispone de suficientes puntos.']);
        }

        $price_sale = $this->calculate_sale($raw_price);
        $received = 0;
        foreach ($raw_payment as $key => $payment) {
            $received += $payment['amount'];
        }
        foreach ($raw_giftcard as $key => $payment) {
            $received += $payment['amount'];
        }
        if ($price_sale['total'] > $received) {
            return response()->json(['status' => 'failed', 'message' => 'Faltan pagos.']);
        }

        $change = ($price_sale['total'] === $received) ? 0.00 : $received - $price_sale['total'] - $tip;

        $number = tm_charge::count() + 55;
        $user = $request->user();
        $tm_charge = new tm_charge;
        $charge_slug = time() . str_replace('.', '', $price_sale['total']);
        $tm_charge->charge_ai_user_id = $user['id'];
        $tm_charge->charge_ai_paydesk_id = 0;
        $tm_charge->tx_charge_number = substr('0000000000' . $number, -10);
        $tm_charge->tx_charge_nontaxable = $price_sale['st_notaxable'];
        $tm_charge->tx_charge_taxable = $price_sale['subtotal'];
        $tm_charge->tx_charge_discount = $price_sale['discount'];
        $tm_charge->tx_charge_tax = $price_sale['tax'];
        $tm_charge->tx_charge_total = $price_sale['total'];
        $tm_charge->tx_charge_change = $change;
        $tm_charge->tx_charge_tip = $tip;
        $tm_charge->tx_charge_status = 1;
        $tm_charge->tx_charge_slug = $charge_slug;
        $tm_charge->save();
        $charge_id = $tm_charge->ai_charge_id;

        $paymentController = new paymentController;
        $paymentController->save($raw_payment, $charge_id, $user['id']);
        $paymentController->save_giftcard($raw_giftcard, $charge_id, $user['id']);

        $qry_request->update(['tx_request_status' => 2, 'request_ai_charge_id' => $charge_id]);
        foreach ($raw_giftcard as $key => $payment) {
            $qry_giftcard = tm_giftcard::where('ai_giftcard_id', $payment['giftcard_id']);
            $rs_giftcard = $qry_giftcard->first();
            $qry_giftcard->update(['tx_giftcard_amount' => ($rs_giftcard['tx_giftcard_amount'] - $payment['amount'])]);
        }

        if ($rs_client['ai_client_id'] != 1) {
            // Remocion de puntos
            $qry_client->update(['tx_client_point' => $rs_client['tx_client_point'] - $point_price]);

            // Agregado de puntos
            $rs_client = $qry_client->first();
            $point_before = $rs_client['tx_client_point'];
            $point_quantity = round(($price_sale['subtotal'] + $price_sale['st_notaxable']) / 6, 0, PHP_ROUND_HALF_DOWN);
            $point_after = $point_before + $point_quantity;
            $qry_client->update(['tx_client_point' => $point_after]);

            $tm_point = new tm_point;
            $tm_point->point_ai_cliente_id = $rs_client['ai_client_id'];
            $tm_point->point_ai_charge_id = $charge_id;
            $tm_point->tx_point_quantitybefore = $point_before;
            $tm_point->tx_point_quantity = $point_quantity;
            $tm_point->tx_point_quantityafter = $point_after;
            $tm_point->save();
        }

        if (!$this->checkInternet()) {
            return response()->json(['status' => 'failed', 'message' => 'No hay conexion a internet.']);
        }

        $charge_data = $this->showIt($charge_slug);

        if ($charge_data['charge']['tx_client_birthday'] != '1970-01-01') {
            $birthday_congrats = (date('d-m', strtotime($charge_data['charge']['tx_client_birthday'])) == date('d-m')) ? 1 : 0;
        } else {
            $birthday_congrats = 0;
        }

        if ($point_price > 0) {
            $this->print_charge(
                $charge_data['charge']['tx_charge_number'],
                $charge_data['charge']['created_at'],
                $charge_data['charge']['tx_client_name'],
                $charge_data['charge']['tx_client_cif'] . ' DV' . $charge_data['charge']['tx_client_dv'],
                $charge_data['article'],
                $charge_data['charge']['tx_charge_nontaxable'] + $charge_data['charge']['tx_charge_taxable'],
                $charge_data['charge']['tx_charge_discount'],
                $charge_data['charge']['tx_charge_tax'],
                $charge_data['charge']['tx_charge_total'],
                $charge_data['payment'],
                $charge_data['charge']['tx_charge_change'],
                $charge_data['charge']['user_name'],
                $birthday_congrats,
                $charge_data['charge']['tx_charge_tip'],
                $charge_data['charge']['tx_client_point'],
            );
            // return response()->json(['status' => 'success', 'message' => 'Pedido cobrado satisfactoriamente.', 'data' => ['slug' => $charge_slug]]);
        }

        $response = $this->fe_send(
            $charge_data['charge']['tx_charge_number'],
            $charge_data['charge']['created_at'],
            $charge_data['charge']['tx_client_type'],
            $charge_data['charge']['tx_client_taxpayer'],
            $charge_data['charge']['tx_client_cif'],
            $charge_data['charge']['tx_client_dv'],
            $charge_data['charge']['tx_client_name'],
            $charge_data['charge']['tx_client_direction'],
            $charge_data['charge']['tx_client_telephone'],
            $charge_data['charge']['tx_client_email'],
            $charge_data['article'],
            $charge_data['charge']['tx_charge_nontaxable'] + $charge_data['charge']['tx_charge_taxable'],
            $charge_data['charge']['tx_charge_tax'],
            $charge_data['charge']['tx_charge_discount'],
            $charge_data['charge']['tx_charge_total'],
            $charge_data['payment'],
            $charge_data['charge']['tx_charge_change']
        );

        
        $xml = simplexml_load_string(str_replace(["s:", "a:", "i:"], "", $response));
        $xml = json_decode(json_encode($xml), true);
        $responseFE = $xml['Body']['EnviarResponse']['EnviarResult'];

        if ($responseFE['resultado'] === 'error') {
            return response()->json(['status' => 'failed', 'message' => $responseFE['mensaje']]);
        } else {
            $this->print_fe($charge_data['charge']['tx_charge_number'], $charge_data['charge']['created_at'], $charge_data['charge']['tx_client_name'], $charge_data['charge']['tx_client_cif'] . ' DV' . $charge_data['charge']['tx_client_dv'], $charge_data['article'], $charge_data['charge']['tx_charge_nontaxable'] + $charge_data['charge']['tx_charge_taxable'], $charge_data['charge']['tx_charge_discount'], $charge_data['charge']['tx_charge_tax'], $charge_data['charge']['tx_charge_total'], $charge_data['payment'], $charge_data['charge']['tx_charge_change'], $charge_data['charge']['user_name'], $birthday_congrats, $charge_data['charge']['tx_charge_tip'], $charge_data['charge']['tx_client_point'], $responseFE);
        }

        return response()->json(['status' => 'success', 'message' => 'Pedido cobrado satisfactoriamente.', 'data' => ['slug' => $charge_slug]]);
    }
    public function print_fe($number, $date, $client_name, $client_ruc, $raw_item, $subtotal, $discount, $tax, $total, $raw_payment, $change, $user_name, $birthday_congrats, $tip, $point, $response)
    {
        $connector = new NetworkPrintConnector("192.168.1.113", 9100);
        $printer = new Printer($connector);

        // ############ COMANDA  ############

        // Start the printer

        $logo = EscposImage::load("./attached/image/logo_print2.png", 30);

        // PRINT TOP DATE
        $printer -> setJustification(Printer::JUSTIFY_RIGHT);
        $printer -> text(date('d-m-Y')."\n");

        //  Print top logo
        $printer -> setJustification(Printer::JUSTIFY_CENTER);
        $printer -> bitImage($logo);

        // Name of shop
        $optionController = new optionController;
        $rs_option = $optionController->getOption();

        $printer -> text($rs_option['SOCIETY']."\n");
        $printer -> text($rs_option['RUC']." DV ".$rs_option['DV']."\n");
        $printer -> text($rs_option['DIRECCION']."\n");
        $printer -> text("Whatsapp: ".$rs_option['CEL']." Tel. ".$rs_option['TELEFONO']."\n");
        $printer -> feed();

        // Title of receipt 
        $printer -> selectPrintMode(Printer::MODE_DOUBLE_HEIGHT);
        $printer -> setEmphasis(true);
        $printer -> text("Facturación #".$number."\n");
        $printer -> setEmphasis(false);

        // Client Info 
        $printer -> selectPrintMode();
        $printer -> text(date('d-m-Y h:i:s', strtotime($date))."\n");
        $printer -> text("Cliente: ".$client_name."\n");
        $printer -> text("RUC: ".$client_ruc."\n");

        $printer -> setJustification(Printer::JUSTIFY_CENTER);
        $printer -> selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer -> text("COMANDA\n");
        $printer -> selectPrintMode();
        $printer -> setJustification(Printer::JUSTIFY_LEFT);

        $printer -> feed(2);

        //  Items
        $printer -> text("Articulos de la Comanda.\n");

        $content_observation = '';
        $last_observation = '';
        $command_id = 0 ;
        // foreach ($raw_item as $item) {
        foreach ($raw_item as $key => $item) {
            if ($item['tx_commanddata_status'] === 1) {  

                $printer -> text($item['tx_article_code']." - ".$item['tx_commanddata_description']);
                $printer -> selectPrintMode(Printer::MODE_DOUBLE_HEIGHT);
                $printer -> setEmphasis(true);
                $printer -> text(" (".$item['tx_presentation_value'].")\n");
                $printer -> setEmphasis(false);
                $printer -> selectPrintMode();

                $printer -> selectPrintMode(Printer::MODE_DOUBLE_HEIGHT);
                $printer -> setEmphasis(true);
                $printer -> text($item['tx_commanddata_quantity']." x ".$item['tx_commanddata_price']."\n");
                $printer -> setEmphasis(false);
                $printer -> selectPrintMode();

                $raw_recipe = json_decode($item['tx_commanddata_recipe'], true);
                foreach ($raw_recipe as $ingredient) {
                    foreach ($ingredient as $k => $formule) {
                        $splited_formule = explode(",", $formule);
                        if ($splited_formule[4] === 'show') {
                            $ing = explode(")", $k, 2);
                            $printer->text('   -' . $ing[1] . "\n");
                        }
                    }
                }

                if (!empty($raw_item[$key + 1])) {
                    if ($raw_item[$key + 1]['ai_command_id'] != $item['ai_command_id']) {
                        $printer->text("OBS. " . $item['tx_command_observation'] . "\n" . "Consumo: " . $item['tx_command_consumption'] . "\n");
                    }
                } else {
                    $printer->text("OBS. " . $item['tx_command_observation'] . "\n" . "Consumo: " . $item['tx_command_consumption'] . "\n");
                }
            }
        }

        // Cut the receipt
        $printer -> cut();

        // ############ RECIBO  ############





        /* Start the printer */
        $logo = EscposImage::load("./attached/image/logo_print2.png", 30);
        $printer = new Printer($connector);

        // PRINT TOP DATE
        $printer->setJustification(Printer::JUSTIFY_RIGHT);
        $printer->text(date('d-m-Y') . "\n");

        /* Print top logo */
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $printer->bitImage($logo);

        /* Name of shop */
        $optionController = new optionController;
        $rs_option = $optionController->getOption();

        $printer->text($rs_option['SOCIETY'] . "\n");
        $printer->text($rs_option['RUC'] . " DV " . $rs_option['DV'] . "\n");
        $printer->text($rs_option['DIRECCION'] . "\n");
        $printer->text("Whatsapp: " . $rs_option['CEL'] . " Tel. " . $rs_option['TELEFONO'] . "\n");
        $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer->selectPrintMode();
        $printer->feed();

        /* Title of receipt */
        $printer->selectPrintMode(Printer::MODE_DOUBLE_HEIGHT);
        $printer->setEmphasis(true);
        $printer->text("COMPROBANTE AUXILIAR DE FACTURA ELECTRONICA" . "\n");
        $printer->setEmphasis(false);

        /* Client Info */
        $printer->selectPrintMode();
        $printer->text("Fecha: " . date('d-m-Y h:i:s', strtotime($date)) . "\n");
        $printer->text("N. Doc: " . $number);
        $printer->text(" Cajera: " . $user_name . "\n");
        $printer->text("Razon Social: " . $client_name . "\n");
        $printer->text("RUC: " . $client_ruc . "\n");
        $printer->feed(2);

        /* Items */
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer->text("TIQUETE \n");
        $printer->selectPrintMode();
        $printer->setJustification(Printer::JUSTIFY_LEFT);
        $printer->text("Articulos Relacionados.\n");

        foreach ($raw_item as $key => $item) {
            if ($item['tx_commanddata_status'] === 1) {
                $printer->text($item['tx_article_code'] . " - " . $item['tx_commanddata_description'] . " (" . $item['tx_presentation_value'] . ")\n");
                $printer->text($item['tx_commanddata_quantity'] . " x " . number_format($item['tx_commanddata_price'], 2) . "\n");
                if ($item['tx_commanddata_discountrate'] != 0.00) {
                    $printer->text("Ahorro " . number_format(($item['tx_commanddata_discountrate'] * ($item['tx_commanddata_quantity'] * $item['tx_commanddata_price'])) / 100, 2) . "\n");
                }

                // $raw_recipe = json_decode($item['tx_commanddata_recipe'], true);
                // foreach ($raw_recipe as $ingredient) {
                //     foreach ($ingredient as $k => $formule) {
                //         $splited_formule = explode(",", $formule);
                //         if ($splited_formule[4] === 'show') {
                //             $ing = explode(")", $k, 2);
                //             $printer->text('   -' . $ing[1] . "\n");
                //         }
                //     }
                // }

                // if (!empty($raw_item[$key + 1])) {
                //     if ($raw_item[$key + 1]['ai_command_id'] != $item['ai_command_id']) {
                //         $printer->text("OBS. " . $item['tx_command_observation'] . "\n" . "Consumo: " . $item['tx_command_consumption'] . "\n");
                //     }
                // } else {
                //     $printer->text("OBS. " . $item['tx_command_observation'] . "\n" . "Consumo: " . $item['tx_command_consumption'] . "\n");
                // }
            }
        }

        $printer->feed(2);
        $printer->setJustification(Printer::JUSTIFY_RIGHT);
        $printer->setEmphasis(true);
        $printer->text("Subtotal. B/ " . number_format($subtotal, 2) . "\n");
        $printer->setEmphasis(false);

        /* Tax and total */
        $printer->text("Descuento. B/ " . number_format($discount, 2) . "\n");
        $printer->text("ITBMS. B/ " . number_format($tax, 2) . "\n");
        $printer->text("Propina B/ " . number_format($tip, 2) . "\n");
        $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer->text("TOTAL. B/ " . number_format($total, 2) . "\n");
        $printer->selectPrintMode();
        $printer->feed(1);
        $printer->text("Pagos Relacionados.\n");
        foreach ($raw_payment as $payment) {
            $printer->text($payment['tx_paymentmethod_value'] . ": " . number_format($payment['tx_payment_amount'], 2) . "\n");
        }
        $printer->text("Cambio: " . number_format($change, 2) . "\n");

        $printer->setJustification(Printer::JUSTIFY_CENTER);
        if ($birthday_congrats === 1) {
            $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
            $printer->text("FELICIDADES\n");
            $printer->text("EN TU CUMPLEAÑOS" . "\n");
            $printer->selectPrintMode();
            $printer->text("De parte de Jade Café" . "\n");
            $printer->text("le obsequiamos un Café." . "\n");
        }
        /* Footer */
        $printer->feed(2);
        if ($point > 0) {
            $printer->setEmphasis(true);
            $printer->text("Ud. lleva acumulados " . $point . " puntos\n");
            $printer->text("con 24 podrá canjearlos por productos seleccionados.\n");
            $printer->setEmphasis(false);
        }
        $printer->text("Gracias por su compra en Jade Café\n");
        $printer->text("Lo esperamos pronto.\n");
        $printer->feed(2);

        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $printer->qrCode($response['qr']);
        $printer->feed(1);
        $printer->setEmphasis(true);
        $printer->text("Autorizado. \n");
        $printer->setEmphasis(false);
        $printer->text($response['cufe'] . " \n");
        $printer->feed(1);
        $printer->setEmphasis(true);
        $printer->text("Fecha Recepción DGI. \n");
        $printer->setEmphasis(false);
        $printer->text($response['fechaRecepcionDGI'] . " \n");
        $printer->text("Documento validado por The Factory HKA Corp. con RUC 155596713-2-2015 Quien es proveedor autorizado calificado bajo la resolución No. 201-9719 del 12/10/2021 \n");
        $printer->feed(1);
        /* Cut the receipt and open the cash drawer */
        $printer->cut();
        $printer->pulse();

        $printer->close();
    }

    public function print_charge($number, $date, $client_name, $client_ruc, $raw_item, $subtotal, $discount, $tax, $total, $raw_payment, $change, $user_name, $birthday_congrats, $tip, $point = 0)
    {
        $connector = new NetworkPrintConnector("192.168.1.113", 9100);
        $printer = new Printer($connector);

        /* Information for the receipt */

        // ############ COMANDA  ############

        // Start the printer

        // $logo = EscposImage::load("./attached/image/logo_print2.png", 30);

        // // PRINT TOP DATE
        // $printer -> setJustification(Printer::JUSTIFY_RIGHT);
        // $printer -> text(date('d-m-Y')."\n");

        // //  Print top logo
        // $printer -> setJustification(Printer::JUSTIFY_CENTER);
        // $printer -> bitImage($logo);

        // // Name of shop
        // // $printer -> text("Cancino Nuñez, S.A.\n");
        // // $printer -> text("155732387-2-2023 DV 14.\n");
        // // $printer -> text("Boulevard Penonomé, Feria, Local #50\n");
        // // $printer -> text("Whatsapp: 6890-7358 Tel. 909-7100\n");
        // $optionController = new optionController;
        // $rs_option = $optionController->getOption();

        // $printer -> text($rs_option['SOCIETY']."\n");
        // $printer -> text($rs_option['RUC']." DV ".$rs_option['DV']."\n");
        // $printer -> text($rs_option['DIRECCION']."\n");
        // $printer -> text("Whatsapp: ".$rs_option['CEL']." Tel. ".$rs_option['TELEFONO']."\n");
        // $printer -> feed();

        // // Title of receipt 
        // $printer -> selectPrintMode(Printer::MODE_DOUBLE_HEIGHT);
        // $printer -> setEmphasis(true);
        // $printer -> text("Facturación #".$number."\n");
        // $printer -> setEmphasis(false);

        // // Client Info 
        // $printer -> selectPrintMode();
        // $printer -> text(date('d-m-Y h:i:s', strtotime($date))."\n");
        // $printer -> text("Cliente: ".$client_name."\n");
        // $printer -> text("RUC: ".$client_ruc."\n");

        // $printer -> setJustification(Printer::JUSTIFY_CENTER);
        // $printer -> selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        // $printer -> text("COMANDA\n");
        // $printer -> selectPrintMode();
        // $printer -> setJustification(Printer::JUSTIFY_LEFT);

        // $printer -> feed(2);

        // //  Items
        // $printer -> text("Articulos de la Comanda.\n");

        // $content_observation = '';
        // $last_observation = '';
        // $command_id = 0 ;
        // // foreach ($raw_item as $item) {
        // foreach ($raw_item as $key => $item) {
        //     if ($item['tx_commanddata_status'] === 1) {  

        //         $printer -> text($item['tx_article_code']." - ".$item['tx_commanddata_description']);
        //         $printer -> selectPrintMode(Printer::MODE_DOUBLE_HEIGHT);
        //         $printer -> setEmphasis(true);
        //         $printer -> text(" (".$item['tx_presentation_value'].")\n");
        //         $printer -> setEmphasis(false);
        //         $printer -> selectPrintMode();

        //         $printer -> selectPrintMode(Printer::MODE_DOUBLE_HEIGHT);
        //         $printer -> setEmphasis(true);
        //         $printer -> text($item['tx_commanddata_quantity']." x ".$item['tx_commanddata_price']."\n");
        //         $printer -> setEmphasis(false);
        //         $printer -> selectPrintMode();

        //         $raw_recipe = json_decode($item['tx_commanddata_recipe'],true);
        //         foreach ($raw_recipe as $ingredient) {
        //             foreach ($ingredient as $k => $formule) {
        //                 $splited_formule = explode(",",$formule);
        //                 if ($splited_formule[3] === 'show') {
        //                     $ing = explode(")",$k,2);
        //                     $printer -> text('   -'.$ing[1]."\n");
        //                 }
        //             }
        //         }

        //         if (!empty($raw_item[$key+1])) {
        //             if ($raw_item[$key+1]['ai_command_id'] != $item['ai_command_id']) {
        //                 $printer -> text("OBS. ".$item['tx_command_observation']."\n"."Consumo: ".$item['tx_command_consumption']."\n");
        //             }
        //         }else{
        //             $printer -> text("OBS. ".$item['tx_command_observation']."\n"."Consumo: ".$item['tx_command_consumption']."\n");
        //         }
        //     }
        // }

        // // Cut the receipt
        // $printer -> cut();

        // ############ RECIBO  ############

        /* Start the printer */
        $logo = EscposImage::load("./attached/image/logo_print2.png", 30);
        $printer = new Printer($connector);

        // PRINT TOP DATE
        $printer->setJustification(Printer::JUSTIFY_RIGHT);
        $printer->text(date('d-m-Y') . "\n");

        /* Print top logo */
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $printer->bitImage($logo);

        /* Name of shop */
        $optionController = new optionController;
        $rs_option = $optionController->getOption();

        $printer->text($rs_option['SOCIETY'] . "\n");
        $printer->text($rs_option['RUC'] . " DV " . $rs_option['DV'] . "\n");
        $printer->text($rs_option['DIRECCION'] . "\n");
        $printer->text("Whatsapp: " . $rs_option['CEL'] . " Tel. " . $rs_option['TELEFONO'] . "\n");
        $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer->text("DOCUMENTO NO FISCAL\n");
        $printer->selectPrintMode();
        $printer->feed();

        /* Title of receipt */
        $printer->selectPrintMode(Printer::MODE_DOUBLE_HEIGHT);
        $printer->setEmphasis(true);
        $printer->text("RECIBO DE FACTURACIÓN #" . $number . "\n");
        $printer->setEmphasis(false);

        /* Client Info */
        $printer->selectPrintMode();
        $printer->text(date('d-m-Y h:i:s', strtotime($date)) . "\n");
        $printer->text("Cliente: " . $client_name . "\n");
        $printer->text("RUC: " . $client_ruc . "\n");
        $printer->feed(2);

        /* Items */
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer->text("DOCUMENTO NO FISCAL\n");
        $printer->selectPrintMode();
        $printer->setJustification(Printer::JUSTIFY_LEFT);
        $printer->text("Articulos Relacionados.\n");

        $content_observation = '';
        $last_observation = '';
        $command_id = 0;
        foreach ($raw_item as $key => $item) {
            if ($item['tx_commanddata_status'] === 1) {
                $printer->text($item['tx_article_code'] . " - " . $item['tx_commanddata_description'] . " (" . $item['tx_presentation_value'] . ")\n");
                $printer->text($item['tx_commanddata_quantity'] . " x " . $item['tx_commanddata_price'] . "\n");

                $raw_recipe = json_decode($item['tx_commanddata_recipe'], true);
                foreach ($raw_recipe as $ingredient) {
                    foreach ($ingredient as $k => $formule) {
                        $splited_formule = explode(",", $formule);
                        if ($splited_formule[4] === 'show') {
                            $ing = explode(")", $k, 2);
                            $printer->text('   -' . $ing[1] . "\n");
                        }
                    }
                }

                if (!empty($raw_item[$key + 1])) {
                    if ($raw_item[$key + 1]['ai_command_id'] != $item['ai_command_id']) {
                        $printer->text("OBS. " . $item['tx_command_observation'] . "\n" . "Consumo: " . $item['tx_command_consumption'] . "\n");
                    }
                } else {
                    $printer->text("OBS. " . $item['tx_command_observation'] . "\n" . "Consumo: " . $item['tx_command_consumption'] . "\n");
                }
            }
        }

        $printer->feed(2);
        $printer->setJustification(Printer::JUSTIFY_RIGHT);
        $printer->setEmphasis(true);
        $printer->text("Subtotal. B/ " . number_format($subtotal, 2) . "\n");
        $printer->setEmphasis(false);

        /* Tax and total */
        $printer->text("Descuento. B/ " . number_format($discount, 2) . "\n");
        $printer->text("ITBMS. B/ " . number_format($tax, 2) . "\n");
        $printer->text("Propina B/ " . number_format($tip, 2) . "\n");
        $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer->text("TOTAL. B/ " . number_format($total, 2) . "\n");
        $printer->selectPrintMode();
        $printer->feed(1);
        $printer->text("Pagos Relacionados.\n");
        foreach ($raw_payment as $payment) {
            $printer->text($payment['tx_paymentmethod_value'] . ": " . number_format($payment['tx_payment_amount'], 2) . "\n");
        }
        $printer->text("Cambio: " . number_format($change, 2) . "\n");
        $printer->text("Cajera: " . $user_name . "\n");

        $printer->setJustification(Printer::JUSTIFY_CENTER);
        if ($birthday_congrats === 1) {
            $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
            $printer->text("FELICIDADES\n");
            $printer->text("EN TU CUMPLEAÑOS" . "\n");
            $printer->selectPrintMode();
            $printer->text("De parte de Jade Café" . "\n");
            $printer->text("le obsequiamos un Café." . "\n");
        }
        /* Footer */
        $printer->feed(2);
        $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer->text("DOCUMENTO NO FISCAL\n");
        $printer->selectPrintMode();
        if ($point > 0) {
            $printer->setEmphasis(true);
            $printer->text("Ud. lleva acumulados " . $point . " puntos\n");
            $printer->text("con 24 podrá canjearlos por productos seleccionados.\n");
            $printer->setEmphasis(false);
        }
        $printer->text("Gracias por su compra en Jade Café\n");
        $printer->text("Lo esperamos pronto.\n");
        $printer->feed(2);

        /* Cut the receipt and open the cash drawer */
        $printer->cut();
        $printer->pulse();

        $printer->close();
    }

    public function print_receipt($number, $date, $client_name, $client_ruc, $raw_item, $subtotal, $discount, $tax, $total, $raw_payment, $change, $user_name, $birthday_congrats, $tip, $point = 0)
    {
        $connector = new NetworkPrintConnector("192.168.1.113", 9100);
        $printer = new Printer($connector);

        /* Information for the receipt */

        /* Start the printer */
        $logo = EscposImage::load("./attached/image/logo_print2.png", 30);
        // $printer = new Printer($connector);

        // PRINT TOP DATE
        $printer->setJustification(Printer::JUSTIFY_RIGHT);
        $printer->text(date('d-m-Y') . "\n");

        /* Print top logo */
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $printer->bitImage($logo);

        /* Name of shop */
        $optionController = new optionController;
        $rs_option = $optionController->getOption();

        $printer->text($rs_option['SOCIETY'] . "\n");
        $printer->text($rs_option['RUC'] . " DV " . $rs_option['DV'] . "\n");
        $printer->text($rs_option['DIRECCION'] . "\n");
        $printer->text("Whatsapp: " . $rs_option['CEL'] . " Tel. " . $rs_option['TELEFONO'] . "\n");
        $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer->text("DOCUMENTO NO FISCAL\n");
        $printer->selectPrintMode();
        $printer->feed();

        /* Title of receipt */
        $printer->selectPrintMode(Printer::MODE_DOUBLE_HEIGHT);
        $printer->setEmphasis(true);
        $printer->text("RECIBO DE FACTURACIÓN #" . $number . "\n");
        $printer->setEmphasis(false);

        /* Client Info */
        $printer->selectPrintMode();
        $printer->text(date('d-m-Y h:i:s', strtotime($date)) . "\n");
        $printer->text("Cliente: " . $client_name . "\n");
        $printer->text("RUC: " . $client_ruc . "\n");
        $printer->feed(2);

        /* Items */
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer->text("DOCUMENTO NO FISCAL\n");
        $printer->selectPrintMode();
        $printer->setJustification(Printer::JUSTIFY_LEFT);
        $printer->text("Articulos Relacionados.\n");

        foreach ($raw_item as $key => $item) {
            if ($item['tx_commanddata_status'] === 1) {
                $printer->text($item['tx_article_code'] . " - " . $item['tx_commanddata_description'] . " (" . $item['tx_presentation_value'] . ")\n");
                $printer->text($item['tx_commanddata_quantity'] . " x " . $item['tx_commanddata_price'] . "\n");

                $raw_recipe = json_decode($item['tx_commanddata_recipe'], true);
                foreach ($raw_recipe as $ingredient) {
                    foreach ($ingredient as $k => $formule) {
                        $splited_formule = explode(",", $formule);
                        if ($splited_formule[4] === 'show') {
                            $ing = explode(")", $k, 2);
                            $printer->text('   -' . $ing[1] . "\n");
                        }
                    }
                }
                if (!empty($raw_item[$key + 1])) {
                    if ($raw_item[$key + 1]['ai_command_id'] != $item['ai_command_id']) {
                        $printer->text("OBS. " . $item['tx_command_observation'] . "\n" . "Consumo: " . $item['tx_command_consumption'] . "\n");
                        $printer->feed(1);
                    }
                } else {
                    $printer->text("OBS. " . $item['tx_command_observation'] . "\n" . "Consumo: " . $item['tx_command_consumption'] . "\n");
                    $printer->feed(1);
                }
            }
        }

        $printer->feed(2);
        $printer->setJustification(Printer::JUSTIFY_RIGHT);
        $printer->setEmphasis(true);
        $printer->text("Subtotal. B/ " . number_format($subtotal, 2) . "\n");
        $printer->setEmphasis(false);

        /* Tax and total */
        $printer->text("Descuento. B/ " . number_format($discount, 2) . "\n");
        $printer->text("ITBMS. B/ " . number_format($tax, 2) . "\n");
        $printer->text("Propina B/ " . number_format($tip, 2) . "\n");
        $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer->text("TOTAL. B/ " . number_format($total, 2) . "\n");
        $printer->selectPrintMode();
        $printer->feed(1);
        $printer->text("Pagos Relacionados.\n");
        foreach ($raw_payment as $payment) {
            $printer->text($payment['tx_paymentmethod_value'] . ": " . number_format($payment['tx_payment_amount'], 2) . "\n");
        }
        $printer->text("Cambio: " . number_format($change, 2) . "\n");
        $printer->text("Cajera: " . $user_name . "\n");
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        if ($birthday_congrats === 1) {
            $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
            $printer->text("FELICIDADES\n");
            $printer->text("EN TU CUMPLEAÑOS" . "\n");
            $printer->selectPrintMode();
        }

        /* Footer */
        $printer->feed(2);
        $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer->text("DOCUMENTO NO FISCAL\n");
        $printer->selectPrintMode();
        if ($point > 0) {
            $printer->setEmphasis(true);
            $printer->text("Ud. lleva acumulados " . $point . " puntos\n");
            $printer->text("con 24 podrá canjearlos por productos seleccionados.\n");
            $printer->setEmphasis(false);
        }
        $printer->text("Gracias por su compra en jade Café\n");
        $printer->text("Lo esperamos pronto.\n");
        $printer->feed(2);

        /* Cut the receipt and open the cash drawer */
        $printer->cut();
        $printer->close();
    }
    public function fe_send($number,$date,$client_type,$client_taxpayer,$client_ruc,$client_dv,$client_name,$client_direction,$client_telephone,$client_email,
        $raw_item,$net_total,$total_tax,$total_discount,$total_charge,$raw_payment,$change,$client_country = 'Panama') {

        $optionController = new optionController;
        $rs_option = $optionController->getOption();

        //$location = 'https://demoemision.thefactoryhka.com.pa/ws/obj/v1.0/Service.svc?wsdl';
        $location = 'https://emision.thefactoryhka.com.pa/ws/obj/v1.0/Service.svc';
        $t_company = $rs_option['FE_USER'];
        $t_pass = $rs_option['FE_PASSWORD'];
        // $t_company = 'zblvgogrmgjv_tfhka';
        // $t_pass = 'n*M,EcB2O_gg';


        $item_xml = '';
        $item_counter = 0;
        foreach ($raw_item as $item) {
            if ($item['tx_commanddata_status'] === 1) {
                $ttl_discount = ($item['tx_commanddata_discountrate'] * $item['tx_commanddata_price']) / 100;
                $ttl_discount = round($ttl_discount, 3);
                $ttl_discount = round($ttl_discount, 2);

                $ttl_tax = ($item['tx_commanddata_taxrate'] * ($item['tx_commanddata_price']-$ttl_discount)) / 100;
                $ttl_tax *= $item['tx_commanddata_quantity'];
                $ttl_tax = round($ttl_tax, 3);
                $ttl_tax = round($ttl_tax, 2);

                $price_item = ($item['tx_commanddata_price'] - $ttl_discount) * $item['tx_commanddata_quantity'];

                switch ($item['tx_commanddata_taxrate']) {
                    case '7.00':
                        $tax_rate_code = '01';
                        break;
                    case '10.00':
                        $tax_rate_code = '02';
                        break;
                    case '15.00':
                        $tax_rate_code = '03';
                        break;
                    default:
                        $tax_rate_code = '00';
                        break;
                }
                $item_xml .= "
                    <ser:item>
                        <ser:descripcion>" . $item['tx_commanddata_description'] . "</ser:descripcion>
                        <ser:codigo>" . $item['tx_article_code'] . "</ser:codigo>
                        <ser:unidadMedida>m</ser:unidadMedida>
                        <ser:cantidad>" . number_format($item['tx_commanddata_quantity'], 2) . "</ser:cantidad>
                        <ser:fechaFabricacion>" . date('Y-m-d') . "</ser:fechaFabricacion>
                        <ser:fechaCaducidad>" . date('Y-m-d', strtotime('+1 day')) . "</ser:fechaCaducidad>
                        <ser:codigoCPBSAbrev></ser:codigoCPBSAbrev>
                        <ser:codigoCPBS></ser:codigoCPBS>
                        <ser:unidadMedidaCPBS></ser:unidadMedidaCPBS>
                        <ser:infoItem>" . $item['tx_commanddata_description'] . "</ser:infoItem>
                        <ser:precioUnitario>" . number_format($item['tx_commanddata_price'], 2) . "</ser:precioUnitario>
                        <ser:precioUnitarioDescuento>" . number_format($ttl_discount, 2) . "</ser:precioUnitarioDescuento>
                        <ser:precioItem>" . number_format($price_item, 2) . "</ser:precioItem>
                        <ser:valorTotal>" . number_format($price_item + $ttl_tax, 2) . "</ser:valorTotal>
                        <ser:tasaITBMS>" . $tax_rate_code . "</ser:tasaITBMS>
                        <ser:valorITBMS>" . number_format($ttl_tax, 2) . "</ser:valorITBMS>
                        <ser:tasaISC></ser:tasaISC>
                        <ser:valorISC></ser:valorISC>
                        <ser:listaItemOTI>
                            <ser:oti>
                                <ser:tasaOTI>01</ser:tasaOTI>
                                <ser:valorTasa>0.00</ser:valorTasa>
                            </ser:oti>
                        </ser:listaItemOTI>
                    </ser:item>
                ";
                $item_counter++;
            }
        }
        $payment_xml = "";
        $payment_total = 0;
        foreach ($raw_payment as $payment) {
            /*
                02:Efectivo. 
                09: Cheque 
                03:Tarjeta Crédito. 
                04:Tarjeta Débito. 
                01:Crédito. 
                
                99:Otro. 
                05:Tarjeta Fidelización. 
                06:Vale. 
                07:Tarjeta de Regalo. 
                08:Transf/Deposito cta. Bancaria 
            */
            switch ($payment["ai_paymentmethod_id"]) {
                case 1:
                    $paymentmethod_code = "02";
                    break;
                case 2:
                    $paymentmethod_code = "09";
                    break;
                case 3:
                    $paymentmethod_code = "03";
                    break;
                case 4:
                    $paymentmethod_code = "04";

                default:
                    $paymentmethod_code = "01";
                    break;
            }
            $payment_xml .= "
                <ser:formaPago>
                    <ser:formaPagoFact>" . $paymentmethod_code . "</ser:formaPagoFact>
                    <ser:descFormaPago></ser:descFormaPago>
                    <ser:valorCuotaPagada>" . number_format($payment["tx_payment_amount"], 2) . "</ser:valorCuotaPagada>
                </ser:formaPago>
            ";
            $payment_total += $payment["tx_payment_amount"];
        }
        $listaDescBonificacion = '';

        $request = "
            <soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\" xmlns:ser=\"http://schemas.datacontract.org/2004/07/Services.ObjComprobante.v1_0\">
                <soapenv:Header/>
                <soapenv:Body>
                    <tem:Enviar>
                        <tem:tokenEmpresa>" . $t_company . "</tem:tokenEmpresa>
                        <tem:tokenPassword>" . $t_pass . "</tem:tokenPassword>
                        <tem:documento>
                            <ser:codigoSucursalEmisor>0000</ser:codigoSucursalEmisor>
                            <ser:tipoSucursal>1</ser:tipoSucursal>
                            <ser:datosTransaccion>
                                <ser:tipoEmision>01</ser:tipoEmision>
                                <ser:tipoDocumento>01</ser:tipoDocumento>
                                <ser:numeroDocumentoFiscal>" . $number . "</ser:numeroDocumentoFiscal>
                                <ser:puntoFacturacionFiscal>505</ser:puntoFacturacionFiscal>
                                <ser:fechaEmision>" . date("Y-m-d\TH:i:sP", strtotime($date)) . "</ser:fechaEmision>
                                <ser:fechaSalida>" . date("Y-m-d\TH:i:sP", strtotime($date)) . "</ser:fechaSalida>
                                <ser:naturalezaOperacion>01</ser:naturalezaOperacion>
                                <ser:tipoOperacion>1</ser:tipoOperacion>
                                <ser:destinoOperacion>1</ser:destinoOperacion>
                                <ser:formatoCAFE>2</ser:formatoCAFE>
                                <ser:entregaCAFE>2</ser:entregaCAFE>
                                <ser:envioContenedor>1</ser:envioContenedor>
                                <ser:procesoGeneracion>1</ser:procesoGeneracion>
                                <ser:tipoVenta>1</ser:tipoVenta>
                                <ser:cliente>
                                    <ser:tipoClienteFE>" . $client_type . "</ser:tipoClienteFE>
                                    <ser:tipoContribuyente>" . $client_taxpayer . "</ser:tipoContribuyente>
                                    <ser:numeroRUC>" . $client_ruc . "</ser:numeroRUC>
                                    <ser:digitoVerificadorRUC>" . $client_dv . "</ser:digitoVerificadorRUC>
                                    <ser:razonSocial>" . $client_name . "</ser:razonSocial>
                                    <ser:direccion>" . $client_direction . "</ser:direccion>
                                    <ser:codigoUbicacion>2-6-1</ser:codigoUbicacion>
                                    <ser:provincia>Cocle</ser:provincia>
                                    <ser:distrito>Cocle</ser:distrito>
                                    <ser:corregimiento>Cocle Cabecera</ser:corregimiento>
                                    <ser:tipoIdentificacion></ser:tipoIdentificacion>
                                    <ser:nroIdentificacionExtranjero></ser:nroIdentificacionExtranjero>
                                    <ser:paisExtranjero></ser:paisExtranjero>
                                    <ser:telefono1>" . $client_telephone . "</ser:telefono1>
                                    <ser:telefono2></ser:telefono2>
                                    <ser:telefono3></ser:telefono3>
                                    <ser:correoElectronico1>" . $client_email . "</ser:correoElectronico1>
                                    <ser:correoElectronico2></ser:correoElectronico2>
                                    <ser:correoElectronico3></ser:correoElectronico3>
                                    <ser:pais>PA</ser:pais>
                                    <ser:paisOtro></ser:paisOtro>
                                </ser:cliente>
                            </ser:datosTransaccion>

                            <ser:listaItems>
                                <!--Zero or more repetitions:-->
                                " . $item_xml . "
                            </ser:listaItems>
                            <ser:totalesSubTotales>
                                <ser:totalPrecioNeto>" . number_format($net_total, 2) . "</ser:totalPrecioNeto>
                                <ser:totalITBMS>" . number_format($total_tax, 2) . "</ser:totalITBMS>
                                <ser:totalISC></ser:totalISC>
                                <ser:totalMontoGravado>" . number_format($total_tax, 2) . "</ser:totalMontoGravado>
                                <ser:totalDescuento>" . number_format(0, 2) . "</ser:totalDescuento>
                                <ser:totalAcarreoCobrado>0.00</ser:totalAcarreoCobrado>
                                <ser:valorSeguroCobrado>0.00</ser:valorSeguroCobrado>
                                <ser:totalFactura>" . number_format($total_charge, 2) . "</ser:totalFactura>
                                <ser:totalValorRecibido>" . number_format($payment_total, 2) . "</ser:totalValorRecibido>
                                <ser:vuelto>" . number_format($change, 2) . "</ser:vuelto>
                                <ser:tiempoPago>1</ser:tiempoPago>
                                <ser:nroItems>". $item_counter ."</ser:nroItems>
                                <ser:totalTodosItems>" . number_format($net_total + $total_tax, 2) . "</ser:totalTodosItems>
                                ".$listaDescBonificacion."
                                <ser:listaFormaPago>
                                    " . $payment_xml . "
                                </ser:listaFormaPago>
                                <ser:listaTotalOTI>
                                    <ser:totalOti>
                                        <ser:codigoTotalOTI>01</ser:codigoTotalOTI>
                                        <ser:valorTotalOTI>0.00</ser:valorTotalOTI>
                                    </ser:totalOti>
                                </ser:listaTotalOTI>
                            </ser:totalesSubTotales>
                            <ser:usoPosterior>
                                <ser:cufe></ser:cufe>
                            </ser:usoPosterior>
                        </tem:documento>
                    </tem:Enviar>
                </soapenv:Body>
            </soapenv:Envelope>
        ";
//return $request;
        $action = "Enviar";
        $header = [
            'Method: POST',
            'Connection: Keep-Alive',
            'User-Agent: PHP-SOAP-CURL',
            'Content-Type: text/xml;charset=UTF-8',
            'SOAPAction: "http://tempuri.org/IService/Enviar"'
        ];

        $ch = curl_init($location);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $request);
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);

        $response = curl_exec($ch);
        $err_status = curl_errno($ch);
        return $response;
    }

    public function fe_left()
    {
        $optionController = new optionController;
        $rs_option = $optionController->getOption();

        
        $location = 'https://emision.thefactoryhka.com.pa/ws/obj/v1.0/Service.svc';
        // $t_company = $rs_option['FE_USER'];
        // $t_pass = $rs_option['FE_PASSWORD'];
        $t_company = 'zblvgogrmgjv_tfhka';
        $t_pass = 'n*M,EcB2O_gg';

        $request = "
            <soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\">
                <soapenv:Header/>
                <soapenv:Body>
                    <tem:FoliosRestantes>
                        <!--Optional:-->
                        <tem:tokenEmpresa>".$t_company."</tem:tokenEmpresa>
                        <!--Optional:-->
                        <tem:tokenPassword>".$t_pass."</tem:tokenPassword>
                    </tem:FoliosRestantes>
                </soapenv:Body>
            </soapenv:Envelope>
        ";
        //        return $request;


        $action = "FoliosRestantes";
        $header = [
            'Method: POST',
            'Connection: Keep-Alive',
            'User-Agent: PHP-SOAP-CURL',
            'Content-Type: text/xml;charset=UTF-8',
            'SOAPAction: "http://tempuri.org/IService/FoliosRestantes"'
        ];

        $ch = curl_init($location);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $request);
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);

        $response = curl_exec($ch);
        $err_status = curl_errno($ch);

        $xml = simplexml_load_string(str_replace(["s:", "a:", "i:"], "", $response));
        $xml = json_decode(json_encode($xml), true);
        $responseFE = $xml['Body']['FoliosRestantesResponse']['FoliosRestantesResult'];
        // return response()->json(['status' => 'success', 'data' => $responseFE]);

        if ($responseFE['resultado'] === 'error') {
            return response()->json(['status' => 'failed', 'message' => $responseFE['mensaje']]);
        } else {
            return response()->json(['status' => 'success', 'data' => $responseFE]);
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        if (auth()->user()->hasAnyRole(['admin', 'super', 'cashier']) != true) {
            return redirect()->route('request.index');
        }
        $qry = tm_charge::join('tm_requests', 'tm_requests.request_ai_charge_id', 'tm_charges.ai_charge_id')->join('tm_clients', 'tm_clients.ai_client_id', 'tm_requests.request_ai_client_id')->where('tx_charge_slug', $slug);
        if ($qry->count() < 1) {
            return response()->json(['status' => 'failed', 'message' => 'Factura no existe.']);
        }
        $rs = $this->showIt($slug);
        return response()->json(['status' => 'success', 'message' => '', 'data' => ['charge' => $rs['charge'], 'payment' => $rs['payment'], 'article' => $rs['article']]]);
    }
    public function filter(Request $request, $from, $to, $limit)
    {
        $rs_canceledrequest = tm_request::select('users.name as user_name', 'tm_clients.tx_client_name', 'tm_charges.tx_charge_number', 'tm_charges.updated_at', 'tm_charges.tx_charge_total', 'tm_charges.tx_charge_slug', 'tm_requests.tx_request_title', 'tm_requests.tx_request_code', 'tm_tables.tx_table_value', 'tm_charges.created_at')
            ->join('tm_charges', 'tm_charges.ai_charge_id', 'tm_requests.request_ai_charge_id')
            ->join('tm_clients', 'tm_clients.ai_client_id', 'tm_requests.request_ai_client_id')
            ->join('tm_tables', 'tm_tables.ai_table_id', 'tm_requests.request_ai_table_id')->where('tx_request_status', 2)
            ->join('users', 'users.id', 'tm_charges.charge_ai_user_id')
            ->where('tm_charges.created_at', '>=', date('Y-m-d H:i:s', strtotime($from . " 00:00:01")))
            ->where('tm_charges.created_at', '<=', date('Y-m-d H:i:s', strtotime($to . " 23:59:00")))
            ->orderby('tm_charges.created_at', 'DESC')
            ->get();
        return response()->json(['status' => 'success', 'message' => '', 'data' => ['canceled' => $rs_canceledrequest]]);
    }

    public function showIt($slug)
    {
        $qry = tm_charge::select(
            'tm_clients.tx_client_name',
            'tm_clients.tx_client_point',
            'tm_clients.tx_client_cif',
            'tm_clients.tx_client_dv',
            'tm_clients.tx_client_direction',
            'tm_clients.tx_client_telephone',
            'tm_clients.tx_client_email',
            'tm_clients.tx_client_birthday',
            'tm_clients.tx_client_taxpayer',
            'tm_clients.tx_client_type',
            'tm_tables.tx_table_value',
            'users.name as user_name',
            'tm_charges.ai_charge_id',
            'tm_charges.charge_ai_user_id',
            'tm_charges.charge_ai_cashregister_id',
            'tm_charges.charge_ai_paydesk_id',
            'tm_charges.tx_charge_number',
            'tm_charges.tx_charge_nontaxable',
            'tm_charges.tx_charge_taxable',
            'tm_charges.tx_charge_discount',
            'tm_charges.tx_charge_tax',
            'tm_charges.tx_charge_total',
            'tm_charges.tx_charge_change',
            'tm_charges.tx_charge_status',
            'tm_charges.tx_charge_ticket',
            'tm_charges.tx_charge_note',
            'tm_charges.tx_charge_slug',
            'tm_charges.created_at',
            'tm_charges.tx_charge_tip'
        )
            ->join('tm_requests', 'tm_requests.request_ai_charge_id', 'tm_charges.ai_charge_id')
            ->join('tm_tables', 'tm_tables.ai_table_id', 'tm_requests.request_ai_table_id')
            ->join('tm_clients', 'tm_clients.ai_client_id', 'tm_requests.request_ai_client_id')
            ->join('users', 'users.id', 'tm_charges.charge_ai_user_id')->where('tx_charge_slug', $slug);
        $rs = $qry->first();

        $rs_payment = tm_payment::join('tm_paymentmethods', 'tm_paymentmethods.ai_paymentmethod_id', 'tm_payments.payment_ai_paymentmethod_id')->where('payment_ai_charge_id', $rs['ai_charge_id'])->get();

        $commandController = new commandController;
        $rs_article = $commandController->getByCharge($rs['ai_charge_id']);

        return ['charge' => $rs, 'payment' => $rs_payment, 'article' => $rs_article];
    }
    public function show_cashregister($date)
    {
        $user = auth()->user();
        $cashregister = $this->get_cashregister($date, $user);
        return response()->json(['status' => 'success', 'message' => '', 'data' => ['cashregister' => $cashregister]]);
    }

    public function get_cashregister($date, $user)
    {
        // gross_sale la suma de la totalidad de las ventas sin descuentos, 
        // Venta real: gross_sale - descuento
        // net_sale: gross_sale - descuento -  devolucion - anulado, 
        $rs_charge = tm_charge::join('tm_payments', 'tm_payments.payment_ai_charge_id', 'tm_charges.ai_charge_id')->where('charge_ai_user_id', $user['id'])->where('charge_ai_cashregister_id', null)->get();
        $raw_payment = [];
        $gross_sale = 0;
        $nontaxable = 0;
        $taxable = 0;
        $tax = 0;
        $ttl_discount = 0;
        $ttl_tip = 0;
        $i = 0;
        $raw_ffid = [];
        foreach ($rs_charge as $charge) {
            if ($charge['payment_ai_paymentmethod_id'] === 1) {
                if (empty($raw_payment[$charge['payment_ai_paymentmethod_id']])) {
                    $raw_payment[$charge['payment_ai_paymentmethod_id']] = $charge['tx_payment_amount'] - $charge['tx_charge_change'];
                } else {
                    $raw_payment[$charge['payment_ai_paymentmethod_id']] += $charge['tx_payment_amount'] - $charge['tx_charge_change'];
                }
                $gross_sale += $charge['tx_payment_amount'] - $charge['tx_charge_change'];
            } else {
                if (empty($raw_payment[$charge['payment_ai_paymentmethod_id']])) {
                    $raw_payment[$charge['payment_ai_paymentmethod_id']] = $charge['tx_payment_amount'];
                } else {
                    $raw_payment[$charge['payment_ai_paymentmethod_id']] += $charge['tx_payment_amount'];
                }
                $gross_sale += $charge['tx_payment_amount'];
            }
            if (!in_array($charge['ai_charge_id'], $raw_ffid)) {
                $ttl_tip += $charge['tx_charge_tip'];
                $ttl_discount += $charge['tx_charge_discount'];
                $nontaxable += $charge['tx_charge_nontaxable'];
                $taxable += $charge['tx_charge_taxable'];
                $tax += $charge['tx_charge_tax'];
                array_push($raw_ffid, $charge['ai_charge_id']);
                $i++;
            }
        }
        $gross_sale = $gross_sale + $ttl_discount;

        $rs_creditnote = tm_creditnote::where('creditnote_ai_user_id', $user['id'])->where('creditnote_ai_cashregister_id', null)->get();
        $nc_nontaxable = 0;
        $nc_taxable = 0;
        $nc_tax = 0;
        $cashback = 0;
        $canceled = 0;
        $raw_canceled = [];
        $raw_creditnote = [];
        $ite = 0;
        foreach ($rs_creditnote as $creditnote) {
            array_push($raw_creditnote, $creditnote['ai_creditnote_id']);
            $ite++;

            if ($creditnote['tx_creditnote_nullification'] === 1) {
                $canceled += $creditnote['tx_creditnote_taxable'] + $creditnote['tx_creditnote_nontaxable'] + $creditnote['tx_creditnote_tax'];
                $rs_payment = tm_payment::where('payment_ai_charge_id', $creditnote['creditnote_ai_charge_id'])->get();
                foreach ($rs_payment as $payment) {
                    if (empty($raw_canceled[$payment['payment_ai_paymentmethod_id']])) {
                        $raw_canceled[$payment['payment_ai_paymentmethod_id']] = $payment['tx_payment_amount'];
                    } else {
                        $raw_canceled[$payment['payment_ai_paymentmethod_id']] += $payment['tx_payment_amount'];
                    }
                }
            } else {
                $cashback += $creditnote['tx_creditnote_nontaxable'] + $creditnote['tx_creditnote_taxable'] + $creditnote['tx_creditnote_tax'];
                $nc_nontaxable += $creditnote['tx_creditnote_nontaxable'];
                $nc_taxable += $creditnote['tx_creditnote_taxable'];
                $nc_tax += $creditnote['tx_creditnote_tax'];
            }
        }

        $rs_cashoutput = tm_cashoutput::where('cashoutput_ai_user_id', $user['id'])->where('cashoutput_ai_cashregister_id', null)->get();
        $income_cashoutput = 0;
        $outcome_cashoutput = 0;
        $nullified_cashoutput = 0;
        foreach ($rs_cashoutput as $cashoutput) {
            if ($cashoutput['tx_cashoutput_status'] === 0) {
                $nullified_cashoutput += $cashoutput['tx_cashoutput_amount'];
            } else {
                if ($cashoutput['tx_cashoutput_type'] === 1) {
                    $outcome_cashoutput += $cashoutput['tx_cashoutput_amount'];
                } else {
                    $income_cashoutput += $cashoutput['tx_cashoutput_amount'];
                }
            }
        }

        $cashregisterController = new cashregisterController;
        $rs_cashregister = $cashregisterController->get_by_date(date('Y-m-d'));
        $rs_giftcard = tm_giftcard::where('giftcard_ai_user_id', $user['id'])->where('giftcard_ai_cashregister_id', null)->get();
        return [
            'payment' => $raw_payment, //array
            'returnpayment' => $raw_canceled, //array
            'grosssale' => $gross_sale - $ttl_tip,
            'netsale' => round($gross_sale - $ttl_discount - $cashback - $canceled - $ttl_tip, 2),
            'realsale' => $gross_sale - $ttl_discount - $ttl_tip,
            'nontaxable' => $nontaxable,
            'returnnontaxable' => $nc_nontaxable,
            'taxable' => $taxable,
            'returntaxable' => $nc_taxable,
            'tax' => $tax,
            'returntax' => $nc_tax,
            'tip' => $ttl_tip,
            'discount' => $ttl_discount,
            'quantitydoc' => $i,
            'returnquantitydoc' => $ite,
            'cashback' => $cashback,
            'canceled' => $canceled,
            'cashoutput' => ['in' => $income_cashoutput, 'out' => $outcome_cashoutput, 'nullified' => $nullified_cashoutput],
            'cashregister_list' => $rs_cashregister,
            'giftcard' => $rs_giftcard
        ];
    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
    public function calculate_sale($raw_price)
    { //[{price,discount,tax, quantity}]
        $ttl_gross = 0;
        $ttl_discount = 0;
        $ttl_tax = 0;
        $subtotal = 0;
        $st_notaxable = 0;
        $total = 0;

        foreach ($raw_price as $key => $article) {
            $discount = ($article['price'] * $article['discount']) / 100;
            $discount = round($discount, 3);
            $discount = round($discount, 2);
            $price_discount = $article['price'] - $discount;
            $tax = ($price_discount * $article['tax']) / 100;
            $tax = round($tax, 3);
            $tax = round($tax, 2);
            $price_tax = $price_discount + $tax;

            if ($article['tax'] != 0) {
                $subtotal += $article['quantity'] * $price_discount;
            } else {
                $st_notaxable += $article['quantity'] * $price_discount;
            }
            $ttl_gross += $article['quantity'] * $article['price'];
            $total += $article['quantity'] * $price_tax;
            $ttl_discount += $article['quantity'] * $discount;
            $ttl_tax += $article['quantity'] * $tax;
        }
        return [
            'gross_total' => round($ttl_gross, 2),
            'subtotal' => round($subtotal, 2),           //taxable
            'st_notaxable' => round($st_notaxable, 2),   //non_taxable
            'total' => round($total, 2),
            'discount' => round($ttl_discount, 2),
            'tax' => round($ttl_tax, 2)
        ];
    }

    public function report($from, $to)
    {
        $rs = tm_charge::select('tm_clients.tx_client_name', 'tm_clients.tx_client_cif', 'tm_clients.tx_client_dv', 'tm_charges.tx_charge_number', 'tm_charges.tx_charge_nontaxable', 'tm_charges.tx_charge_taxable', 'tm_charges.tx_charge_discount', 'tm_charges.tx_charge_tax', 'tm_charges.tx_charge_total', 'tm_charges.tx_charge_change', 'tm_charges.created_at', 'users.name as user_name')->join('tm_requests', 'tm_requests.request_ai_charge_id', 'tm_charges.ai_charge_id')->join('tm_clients', 'tm_clients.ai_client_id', 'tm_requests.request_ai_client_id')->join('users', 'users.id', 'tm_charges.charge_ai_user_id')->where('tm_charges.created_at', '>=', date('Y-m-d H:i:s', strtotime($from . " 00:00:01")))->where('tm_charges.created_at', '<=', date('Y-m-d H:i:s', strtotime($to . " 23:59:00")))->orderby('tm_charges.created_at')->get();
        $rs_paymentmethod = tm_charge::select('tm_payments.payment_ai_paymentmethod_id', 'tm_payments.tx_payment_amount', 'tm_payments.tx_payment_number', 'tm_charges.created_at')->join('tm_payments', 'tm_payments.payment_ai_charge_id', 'tm_charges.ai_charge_id')->where('tm_charges.created_at', '>=', date('Y-m-d H:i:s', strtotime($from . " 00:00:01")))->where('tm_charges.created_at', '<=', date('Y-m-d H:i:s', strtotime($to . " 23:59:00")))->get();

        return ['list' => $rs, 'paymentmethod' => $rs_paymentmethod];
    }



    public function print_test()
    {

        $connector = new NetworkPrintConnector("192.168.1.113", 9100);
        $printer = new Printer($connector);

        /* Information for the receipt */

        /* Start the printer */
        $logo = EscposImage::load("./attached/image/logo_print2.png", 30);

        // PRINT TOP DATE
        $printer->setJustification(Printer::JUSTIFY_RIGHT);
        $printer->text(date('d-m-Y') . "\n");

        /* Print top logo */
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $printer->bitImage($logo);

        /* Name of shop */
        $optionController = new optionController;
        $rs_option = $optionController->getOption();

        $printer->text($rs_option['SOCIETY'] . "\n");
        $printer->text($rs_option['RUC'] . " DV " . $rs_option['DV'] . "\n");
        $printer->text($rs_option['DIRECCION'] . "\n");
        $printer->text("Whatsapp: " . $rs_option['CEL'] . " Tel. " . $rs_option['TELEFONO'] . "\n");
        $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer->text("DOCUMENTO NO FISCAL\n");
        $printer->selectPrintMode();
        $printer->feed();

        /* Title of receipt */
        $printer->selectPrintMode(Printer::MODE_DOUBLE_HEIGHT);
        $printer->setEmphasis(true);
        $printer->setEmphasis(false);

        /* Client Info */
        $printer->selectPrintMode();
        $printer->feed(2);

        /* Items */
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer->text("DOCUMENTO NO FISCAL\n");
        $printer->selectPrintMode();
        $printer->setJustification(Printer::JUSTIFY_LEFT);
        $printer->text("Articulos Relacionados.\n");

        $printer->feed(2);
        $printer->setJustification(Printer::JUSTIFY_RIGHT);
        $printer->setEmphasis(true);
        $printer->setEmphasis(false);

        /* Tax and total */
        $printer->selectPrintMode();
        $printer->feed(1);
        $printer->text("Pagos Relacionados.\n");

        /* Footer */
        $printer->feed(2);
        $printer->setJustification(Printer::JUSTIFY_CENTER);
        $printer->selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
        $printer->text("DOCUMENTO NO FISCAL\n");
        $printer->selectPrintMode();
        $printer->text("Gracias por su compra en jade Café\n");
        $printer->text("Lo esperamos pronto.\n");
        $printer->feed(2);

        /* Cut the receipt and open the cash drawer */
        $printer->cut();
        $printer->pulse();

        $printer->close();

    }

    public function test_fe()
    {
        $charge_data = $this->showIt('171021202977');

        // echo $charge_data['charge']['tx_charge_number']."<br/>".
        //     $charge_data['charge']['created_at'] . "<br/>" .
        //     $charge_data['charge']['tx_client_type'] . "<br/>" .
        //     $charge_data['charge']['tx_client_taxpayer'] . "<br/>" .
        //     $charge_data['charge']['tx_client_cif'] . "<br/>" .
        //     $charge_data['charge']['tx_client_dv'] . "<br/>" .
        //     $charge_data['charge']['tx_client_name'] . "<br/>" .
        //     $charge_data['charge']['tx_client_direction'] . "<br/>" .
        //     $charge_data['charge']['tx_client_telephone'] . "<br/>" .
        //     // $charge_data['charge']['tx_client_email'],
        //     'jorgesaldar@gmail.com' . "<br/>" .
        //     // $charge_data['article'] . "<br/>" .
        //     $charge_data['charge']['tx_charge_nontaxable']+$charge_data['charge']['tx_charge_taxable'] . "<br/>" .
        //     $charge_data['charge']['tx_charge_tax'] . "<br/>" .
        //     $charge_data['charge']['tx_charge_discount'] . "<br/>" .
        //     $charge_data['charge']['tx_charge_total'] . "<br/>" .
        //     // $charge_data['payment'] . "<br/>" .
        //     $charge_data['charge']['tx_charge_change'];

        //  return false;

        $response = $this->fe_send(
            $charge_data['charge']['tx_charge_number'],
            $charge_data['charge']['created_at'],
            $charge_data['charge']['tx_client_type'],
            $charge_data['charge']['tx_client_taxpayer'],
            $charge_data['charge']['tx_client_cif'],
            $charge_data['charge']['tx_client_dv'],
            $charge_data['charge']['tx_client_name'],
            $charge_data['charge']['tx_client_direction'],
            $charge_data['charge']['tx_client_telephone'],
            $charge_data['charge']['tx_client_email'],
            $charge_data['article'],
            $charge_data['charge']['tx_charge_nontaxable'] + $charge_data['charge']['tx_charge_taxable'],
            $charge_data['charge']['tx_charge_tax'],
            $charge_data['charge']['tx_charge_discount'],
            $charge_data['charge']['tx_charge_total'],
            $charge_data['payment'],
            $charge_data['charge']['tx_charge_change']
        );
        /*
            $note = <<<XML
                <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
                    <s:Body>
                        <EnviarResponse xmlns="http://tempuri.org/">
                            <EnviarResult xmlns:a="http://schemas.datacontract.org/2004/07/Services.Response" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
                                <a:codigo>102</a:codigo>
                                <a:resultado>error</a:resultado>
                                <a:mensaje>El documento está duplicado</a:mensaje>
                                <a:cufe>FE0120000155732387-2-2023-1400002024052400000000015050128219609273</a:cufe>
                                <a:qr>https://dgi-fep-test.mef.gob.pa:40001/Consultas/FacturasPorQR?chFE=FE0120000155732387-2-2023-1400002024052400000000015050128219609273&amp;iAmb=2&amp;digestValue=Xy75MvDAeVW3fdJKaPx0r1SNUyG/6x2AO6R4h6JVM6o=&amp;jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaEZFIjoiRkUwMTIwMDAwMTU1NzMyMzg3LTItMjAyMy0xNDAwMDAyMDI0MDUyNDAwMDAwMDAwMDE1MDUwMTI4MjE5NjA5MjczIiwiaUFtYiI6IjIiLCJkaWdlc3RWYWx1ZSI6Ilh5NzVNdkRBZVZXM2ZkSkthUHgwcjFTTlV5Ry82eDJBTzZSNGg2SlZNNm89In0._P9mydQU7VXBCIbrfcByjgIl2e9Z8yuY1pBnmN0Kaek</a:qr>
                                <a:fechaRecepcionDGI>2024-05-24T22:27:28</a:fechaRecepcionDGI>
                                <a:nroProtocoloAutorizacion>0000155596713-2-201520240000000000505883</a:nroProtocoloAutorizacion>
                                <a:fechaLimite nil="true"/>
                            </EnviarResult>
                        </EnviarResponse>
                    </s:Body>
                </s:Envelope>
                XML;
        */
        $xml = simplexml_load_string(str_replace(["s:", "a:", "i:"], "", $response));
        $xml = json_decode(json_encode($xml), true);
        echo json_encode($xml['Body']['EnviarResponse']['EnviarResult']);
    }

    public function checklogin_reprint(Request $request)
    {
        // ESTA FUNCION LLAMA AL CHECKLOGIN DE USER para corroborar que lo indicado es correcto y devuelve un JSON

        $userController = new userController;
        $login = $userController->check_user($request->input('a'), $request->input('b'), ['admin', 'super']);
        if ($login['check'] === 1) {
            return response()->json(['status' => 'success']);
        } else {
            return response()->json(['status' => 'failed', 'message' => 'Los datos no coinciden.']);
        }

    }

    public function checklogin_creditnote(Request $request)
    {
        $userController = new userController;
        $login = $userController->check_user($request->input('a'), $request->input('b'), ['admin', 'super']);
        if ($login['check'] === 1) {
            return response()->json(['status' => 'success']);
        } else {
            return response()->json(['status' => 'failed', 'message' => 'Los datos no coinciden.']);
        }
    }


}
