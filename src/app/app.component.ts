import { Component, OnInit } from '@angular/core';
//import * as jspdf from 'jspdf';  
var JsBarcode: any;
//import { JsBarcode} from 'jsbarcode';

/* tslint:disable */
var JsBarcode = require('jsbarcode');
/* tslint:enable */

import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { FileSaver, saveAs } from 'file-saver';

class RequestModel {
  orderno: string;
  qty: number;
  type: string;
  size: string;
  prefix:string;
  length:number;
}

class Barcode {
  id: number;
  orderno: string;
  prefix: string;
  code: string;
  url: string;
  type: string;
  size: string;
  createdBy: string;
  createdDateTimeStamp: Date;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'ClientApp';
  barcodes: Barcode[] = [];
  model: RequestModel = new RequestModel();

  ngOnInit(): void {

  }

  ResetAll() {
    this.barcodes = [];
    this.model = new RequestModel();

    try {
      // document.getElementById("size").nodeValue = "";
      // document.getElementById("type").nodeValue = "";

      document.getElementById("orderno")['value'] = '';
      document.getElementById("qty")['value'] = '';

      // document.getElementById("orderno").innerText = "0";
      // document.getElementById("qty").innerText = "0";

      // document.getElementById("orderno").innerHTML = "0";
      // document.getElementById("qty").innerHTML = "0";
    } catch (error) {

    }

  }

  padLeadingZeros(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }
  GenerateBarcodes() {
    if (this.barcodes.length > 0) {
      // this.ResetAll();
    }


    try {

      var d = document.getElementById("orderno");
      var value = d['value'].toString();
      this.model.orderno = value;
      console.log(this.model.orderno);

      var d = document.getElementById("qty");
      var value = d['value'].toString();
      this.model.qty = Number(value);
      console.log(this.model.qty);

      var d = document.getElementById("size");
      var value = d['value'].toString();
      this.model.size = value;
      console.log(this.model.size);

      var d = document.getElementById("type");
      var value = d['value'].toString();
      this.model.type = value;
      console.log(this.model.type);

      var d = document.getElementById("bprefix");
      //console.log(d);
      var value = d['value'].toString();
      //console.log(value);
      this.model.prefix = value;
      console.log(this.model.prefix);

      var d = document.getElementById("blength");
     // console.log(d);
      var value = d['value'].toString();
     // console.log(value);
      this.model.length = Number(value);
      console.log(this.model.length);

    } catch (error) {

    }

    console.log("Validating Parameters");

    if (this.model.orderno == '' || this.model.orderno == undefined || this.model.orderno.toString() == 'NaN') {
      alert("Please Enter a Valid Value For the Order No");
      return;
    }
    if (this.model.qty == 0 || this.model.qty == undefined || this.model.qty.toString() == 'NaN') {
      alert("Please Enter a Valid Value For the Quantity");
      return;
    }

    console.log("Generating Barcodes");

    for (var i = 0; i < this.model.qty; i++) {
      var barcode = new Barcode();

      barcode.id = i;
      barcode.type = this.model.type;
      barcode.size = this.model.size;
      barcode.orderno = this.model.orderno;
      barcode.createdBy = "Vishal Admin";
      barcode.createdDateTimeStamp = new Date();
     // barcode.code = "AM-" + this.model.orderno + "-" + (i + 1) + "/" + this.model.qty;
      console.log(this.padLeadingZeros(i+ 1,this.model.length))
      barcode.code = this.model.prefix + "-" + this.padLeadingZeros(i+ 1,this.model.length);
      console.log(barcode.code);
      barcode.url = 'https://barcode.tec-it.com/barcode.ashx?data=' + barcode.code + '&code=Code128&dpi=96&dataseparator=';

      this.barcodes.push(barcode)
    }

  }

  PrintAll() {
    console.log("Printing Barcodes");

    var data = document.getElementById('contentToConvert');

    //let pdf = new jsPDF('p', 'mm');
    // let pdf = new jsPDF();
    let pdf = new jsPDF({
      orientation: "landscape",
      unit: "in",
      format: [4, 2]
    }
    );
    // pdf.setFontSize(40);


    // html2canvas(data).then(canvas => {  
    //   // Few necessary setting options  
    //   var imgWidth = 208;   
    //   var pageHeight = 295;    
    //   var imgHeight = canvas.height * imgWidth / canvas.width;  
    //   var heightLeft = imgHeight;  

    //   const contentDataURL = canvas.toDataURL('image/png');
    //   //console.log(contentDataURL);
    //  // let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
    //  // let pdf = new jsPDF('p', 'mm', 'a4');

    //   var position = 0;  
    //  // pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

    //   function getBase64Image(img) {
    //     var canvas = document.createElement("canvas");
    //     canvas.width = img.width;
    //     canvas.height = img.height;
    //     var ctx = canvas.getContext("2d");
    //     ctx.drawImage(img, 0, 0);
    //     var dataURL = canvas.toDataURL("image/png");
    //     return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    //   }



    // });  

    var position = 0;
    var imgWidth = 208;
    var pageHeight = 295;
    //var imgHeight = canvas.height * imgWidth / canvas.width;  
    //var heightLeft = imgHeight;  

    for (let index = 0; index < this.barcodes.length; index++) {
      const element = this.barcodes[index];
      pdf.addPage();
      //var base64 = getBase64Image(element.url);
      //var base64 = getBase64Image(document.getElementById(element.code));
      console.log(document.getElementById(element.code));

      JsBarcode("#imageid", element.code);
      var img = document.querySelector('img#imageid');

      // pdf.text(element.code,30, 20);
      // pdf.addImage(img.src, 'JPEG', 15, 40, 180, 160);
      pdf.addImage(img['src'], 'JPEG', 0, 0, 4, 2);

      // html2canvas(document.getElementById(element.code)).then(base64 =>{

      //   console.log(base64);
      //   console.log(base64.toDataURL('image/png'));

      //  // pdf.addImage(base64.toDataURL('image/png'), 'PNG', 0, position, base64.width, base64.height);
      //  // pdf.addImage(element.url, 'JPEG', 15, 40, 180, 160);

      // });

    }

    pdf.deletePage(0);
    pdf.deletePage(1);
    pdf.save(this.model.orderno + '.pdf'); // Generated PDF
    //window.open(pdf.output('bloburl').toJSON());

    /* tslint:disable */
    //window.open(pdf.output('bloburl'));
    /* tslint:enable */

    //pdf.autoPrint();   
  }

  ExportAll() {
    console.log("Exporting Barcodes");
    this.downloadFile(this.barcodes, this.model.orderno + ".csv");
  }
  downloadFile(data: any, filename) {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], { type: 'text/csv' })
    saveAs(blob, filename);
  }

}
