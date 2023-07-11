import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Component({
  selector: 'ngx-errormsg',
  templateUrl: './errormsg.component.html',
  styleUrls: ['./errormsg.component.scss']
})
export class ErrormsgComponent implements OnInit {
  item ;bulkmeta;@Input() title: string; stbshow= false;showitem
  constructor(
    private activemodel: NgbActiveModal,
  ) { }

  ngOnInit() {
    console.log('itemmm shw',this.item);
    this.show();
  }

  close() {
    this.activemodel.close();
  }

show(){
 this.stbshow= false;
  this.showitem =this.item.filter( x=> x.stb_no_or_vc);
  console.log('show thw item',this.showitem)
  if(this.showitem){
    this.stbshow =true;
  } else
  {
    this.stbshow=false;
  }
}




// showShare() {
//   this.distShareShow = false;
//   this.subdistshare = false;
//   const [show_flag] = this.getlistcount.filter(({ id }) => this.val['lcoid'] == id).map(item => item.dist_or_sub_flg)
//   console.log("show flaf@@@@@@@@", show_flag)
//   if (show_flag == 2) this.distShareShow = !this.distShareShow;
//   if (show_flag == 3) this.subdistshare = !this.subdistshare;
// }



  Download() {
    let tempdata = [], temp: any = this.item;
    for (var i = 0; i < temp.length; i++) {
      let parm = {};
      parm['Message'] = temp[i]['msg'];
      parm['Error Code'] = temp[i]['err_code'];
      tempdata[i] = parm;
    }
    const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
    const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
    JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
    JSXLSX.writeFile(wb, 'cserrorlist' + EXCEL_EXTENSION);
  }
}
