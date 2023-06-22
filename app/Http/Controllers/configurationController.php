<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\tm_productcategory;
use App\tm_option;
use App\tm_measure;
use App\tm_category;
use App\tm_paymentmethod;

require '../vendor/autoload.php';

use Mike42\Escpos\Printer;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;

class configurationController extends Controller
{
    public function index(){
        if ( auth()->user()->hasAnyRole(['admin','super']) != true){ 
            return redirect() -> route('request.index');
        }

        $rs_productcategoryList = tm_productcategory::where('tx_productcategory_status',1)->orderby('tx_productcategory_value')->get();
        $rs_categoryList = tm_category::where('tx_category_status',1)->orderby('tx_category_value')->get();
        $rs_option = tm_option::all();
        $raw_option = [];
        foreach ($rs_option as $key => $value) {
            $raw_option[$value['tx_option_title']] = $value['tx_option_value'];
        }
        $rs_measure = tm_measure::where('tx_measure_status',1)->orderby('tx_measure_value')->get();
        $productController = new productController;
        $rs_product = $productController->getAll();
        $articleController = new articleController;
        $rs_article = $articleController->getAll();
        $presentationController = new presentationController;
        $rs_presentation = $presentationController->getAll();
        $rs_paymentmethod = tm_paymentmethod::where('tx_paymentmethod_status',1)->get();
       $data = [
            'productcategory_list' => $rs_productcategoryList,
            'category_list' => $rs_categoryList,
            'raw_option' => $raw_option,
            'measure_list' => $rs_measure,
            'product_list' => $rs_product,
            'article_list' => $rs_article,
            'presentation_list' => $rs_presentation,
            'paymentmethod_list' => $rs_paymentmethod
        ];

        return view('configuration.index', compact('data'));
    }

    public function test(){
        $connector = new WindowsPrintConnector("printreceipt");

        /* Information for the receipt */
        
        /* Start the printer */
        $logo = EscposImage::load("./attached/image/logo_print2.png", 30);
        $printer = new Printer($connector);
        
        $printer -> text("DOCUMENTO NO FISCAL\n");
        
        $printer -> feed(10);

        // PRINT TOP DATE
                                        // $printer -> setJustification(Printer::JUSTIFY_RIGHT);
                                        // $printer -> text("18-06-2023\n");

                                        // /* Print top logo */
                                        // $printer -> setJustification(Printer::JUSTIFY_CENTER);
                                        // $printer -> bitImage($logo);
        
        /* Name of shop */
                                        // $printer -> text("Cancino Nuñez, S.A.\n");
                                        // $printer -> text("155732387-2-2023 DV 14.\n");
                                        // $printer -> text("Boulevard Penonomé, Feria, Local #50\n");
                                        // $printer -> text("Whatsapp: 6890-7358 Tel. 909-7100\n");
                                        // $printer -> text("DOCUMENTO NO FISCAL\n");
                                        // $printer -> feed();
                                        
                                        // /* Title of receipt */
                                        // $printer -> selectPrintMode(Printer::MODE_DOUBLE_HEIGHT);
                                        // $printer -> setEmphasis(true);
                                        // $printer -> text("RECIBO DE FACTURACIÓN #\n");
                                        // $printer -> setEmphasis(false);

                                        // /* Client Info */
                                        // $printer -> selectPrintMode();
                                        // $printer -> text("FECHA DE FACTURACION\n");
                                        // $printer -> text("Cliente: NOMBRE DE CLIENTE\n");
                                        // $printer -> text("RUC: RUC DEL CLIENTE\n");
                                        // $printer -> feed(2);
                                        
                                        // /* Items */
                                        // $printer -> setJustification(Printer::JUSTIFY_CENTER);
                                        // $printer -> text("DOCUMENTO NO FISCAL\n");
                                        // $printer -> setJustification(Printer::JUSTIFY_LEFT);
                                        // $printer -> text("Articulos Relacionados.\n");
                                        // // foreach ($items as $item) {
                                        //     $printer -> text("CODIGO - DESCRIPCION\n");
                                        //     $printer -> text("CANTIDAD x PRECIO\n");
                                        // // }

                                        // $printer -> feed(2);

                                        // $printer -> setJustification(Printer::JUSTIFY_RIGHT);
                                        // $printer -> setEmphasis(true);
                                        // $printer -> text("Subtotal. B/ 1,050.35\n");
                                        // $printer -> setEmphasis(false);
                                        
                                        // /* Tax and total */
                                        // $printer -> text("Descuento. B/ 0.00\n");
                                        // $printer -> text("ITBMS. B/ 150.00\n");
                                        // $printer -> selectPrintMode(Printer::MODE_DOUBLE_WIDTH);
                                        // $printer -> text("TOTAL. B/ 1,200.35\n");
                                        // $printer -> selectPrintMode();
                                        
                                        // /* Footer */
                                        // $printer -> feed(2);
                                        // $printer -> setJustification(Printer::JUSTIFY_CENTER);
                                        // $printer -> text("DOCUMENTO NO FISCAL\n");
                                        // $printer -> text("Gracias por su compra en Jade Café\n");
                                        // $printer -> text("Lo esperamos pronto.\n");
                                        // $printer -> feed(2);
                                        
        /* Cut the receipt and open the cash drawer */
        // 27,112,0,25,30,27,116,2

        $printer -> text("Lo esperamos pronto.\n");
        
        // $printer -> cut();
        $printer -> close();
    }


    function pulse($pin = 0, $on_ms = 120, $off_ms = 240) {
		fwrite($this -> fp, self::ESC . "p" . chr($m + 48) . chr($t1 / 2) . chr($t2 / 2));
	}
}





class item
{
    private $name;
    private $price;
    private $dollarSign;

    public function __construct($name = '', $price = '', $dollarSign = false)
    {
        $this -> name = $name;
        $this -> price = $price;
        $this -> dollarSign = $dollarSign;
    }
    
    public function __toString()
    {
        $rightCols = 10;
        $leftCols = 38;
        if ($this -> dollarSign) {
            $leftCols = $leftCols / 2 - $rightCols / 2;
        }
        $left = str_pad($this -> name, $leftCols) ;
        
        $sign = ($this -> dollarSign ? '$ ' : '');
        $right = str_pad($sign . $this -> price, $rightCols, ' ', STR_PAD_LEFT);
        return "$left$right\n";
    }
}
