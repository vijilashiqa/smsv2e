import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Component({
  selector: 'ngx-sucess',
  templateUrl: './sucess.component.html',
  styleUrls: ['./sucess.component.scss']
})
export class SucessComponent implements OnInit {
  item ;bulkmeta;@Input() title: string; stbshow= false;showitem;
  constructor(
    private activemodel: NgbActiveModal,
){}
  ngOnInit() {
    console.log('itemmm shw',this.item);
 }
  close() {
    this.activemodel.close();
  }
  Download() {
    let tempdata = [], temp: any = this.item;
    for (var i = 0; i < temp.length; i++) {
      let parm = {};
      parm['Message'] = temp[i]['msg'];
      parm['Error Code'] = temp[i]['err_code'];
      parm['SB NO '] = temp[i]['stb_no_or_vc'];
      tempdata[i] = parm;
    }
    const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
    const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
    JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
    JSXLSX.writeFile(wb, 'cserrorlist' + EXCEL_EXTENSION);
  }
}