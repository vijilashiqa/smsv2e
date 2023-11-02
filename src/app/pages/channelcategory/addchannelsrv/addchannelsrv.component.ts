import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  HeadendService,
  ChannelService,
  RoleservicesService,
} from "../../_services/index";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from "xlsx";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { ErrormsgComponent } from "../errormsg/errormsg.component";
import { Item } from "@syncfusion/ej2-angular-navigations";
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";
@Component({
  selector: "ngx-addchannelsrv",
  templateUrl: "./addchannelsrv.component.html",
  styleUrls: ["./addchannelsrv.component.scss"],
})
export class AddchannelsrvComponent implements OnInit {
  channeservlForm;
  cas: any = [];
  editdata = {};
  editflag = false;
  failure: any = [];
  submit: boolean;
  channellist: any = [];
  disabled = false;
  channelsrv;
  result;
  alert: any;
  editable: boolean = false;
  id;
  router: any;
  listhead;
  listhdcas;
  listchnnel;
  bulkmeta: any = [];
  bulk = [];
  arrayBuffer: any;
  file: any[];
  constructor(
    private route: Router,
    private _fb: FormBuilder,
    private channel: ChannelService,
    private headend: HeadendService,
    public role: RoleservicesService,
    private toast: ToastrService,
    private channelService: ChannelService,
    private aRoute: ActivatedRoute,
    private modal: NgbModal,
  ) { }

  async ngOnInit() {
    this.id = this.aRoute.snapshot.queryParams["id"];
    this.createForm();
    if (this.role.getroleid() > 777) {
      this.getHeadend();
    } else {
      this.channeservlForm.get('hdid').setValue(this.role.getheadend());
      this.getcashead();
      this.getchannelname();
    }
    if (this.id) {
      await this.edit();
      await this.getHeadend();
      await this.getcashead();
      await this.getchannelname();
    }
  }
  async edit() {
    console.log("edit ",this.editdata)
    this.editdata = await this.channelService.getchannelservices({ id: this.id });

    this.createForm();
    // console.log("edit ",this.editdata)
  }
  metavalue() {
    this.bulkmeta = [
      {
        msg: "Please fill Channel",
        label: "ChannelName*",
        assign_to: "channelid",
        required: true,
      },
      {
        msg: "Please fill ServiceID",
        label: "ServiceId*",
        assign_to: "casserviceid",
        required: true,
      },
    ];
    return this.bulkmeta;
  }

  clearValidation() {
    console.log("validation");
    if (this.val["modetype"] == 0) {
      this.clearValue("channelid", "casserviceid");
    }
  }

  clearValue(...value) {
    for (let i of value) {
      console.log("clear value");
      this.channeservlForm.get(i).clearValidators();
      this.channeservlForm.get(i).updateValueAndValidity();
    }
  }

  Download() {
    const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(
      this.failure,

    );
    console.log('failure thwr ######3', this.failure)
    const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
    JSXLSX.utils.book_append_sheet(wb, worksheet, "Sheet1");
    /* save to file */
    JSXLSX.writeFile(wb, "stb_failed_report" + EXCEL_EXTENSION);
  }


  async addchannelsrv() {
    this.submit = true;
    const invalid = [];
    const control = this.ctrl
    for (const name in control) {
      if (control[name].invalid) {
        invalid.push(name);
        console.log('data missing ', name);

      }
    }
    if (this.channeservlForm.invalid) {
      window.alert('Please fill mandatory fields');
      return;
    }
    let method = this.id ? "editchannelservices" : "addchannelsrv";
    console.log("update channel service list", method);
    if (this.id) this.channeservlForm.value["id"] = this.id;
    if (this.val["modetype"] == 1) {
      let result = await this.channel[method](this.channeservlForm.value);
      if (result && result[0].err_code == 0) {
        this.toast.success(result[0]["msg"]);
        this.route.navigate(["/pages/channelcategory/listchannelsrv"]);
      } else {
        this.toast.warning(result[0]["msg"]);
      }
    }
    if (this.bulk.length && this.val["modetype"] == 0) {
      let result = this.metavalue();
      for (let i = 0; i < this.bulk.length; i++) {
        for (let meta of result) {
          if (!this.bulk[i].hasOwnProperty(meta.label) && meta.required) {
            this.toast.warning(meta.msg);
            return;
          } else {
            this.bulk[i][meta.assign_to] = this.bulk[i][meta.label];
          }
        }
        this.bulk[i].hdid = this.val["hdid"];
        this.bulk[i].casid = this.val["casid"];
      }
      let resp = await this.channel.bulkchannelservices({ channel: this.bulk });
      console.log("bulkResult????????????????? ", resp);
      if (resp && resp[0].err_code == 0) {
        this.toast.success(resp[0]["msg"]);
        this.route.navigate(["/pages/channelcategory/listchannelsrv"]);
      } else {
        // console.log("add...", this.channeservlForm.value);
        // console.log("error message @@@@@@@@@@@@", resp[0]);
        let item = resp
        //     console.log("error msg ",resp)
        this.Error(item)
      }
    }
  }



  get ctrl() {
    return this.channeservlForm.controls
  }




  async getHeadend($event = "") {
    this.listhead = await this.headend.getHeadend({ like: $event });
    console.log(this.listhead);
  }
  async getcashead($event = "") {
    if (this.channeservlForm.value['hdid']) {
      this.listhdcas = await this.headend.listHdcas({ hdid: this.channeservlForm.value["hdid"] });
      this.listhdcas = this.listhdcas[0];
      // console.log("hd cas list", this.listhdcas);
    }
  }

  async getchannelname($event = "") {
    if (this.channeservlForm.value['hdid']) {
      this.listchnnel = await this.channel.selectchannel({ hdid: this.val["hdid"] });
      console.log("list channel ", this.listchnnel);
    }
  }

  typeclearlheadend(val = "1") {
    this.changeclear("casid", "channelid");
  }
  changeclear(...data) {
    for (let i of data) {
      this.channeservlForm.controls[i].setValue("");
    }
  }

  typeclearcastype(val = "1") {
    this.changeclear("channelid");
  }

  changeListener(file) {
    this.file = file;
    this.filereader(this.file, (result) => {
      this.bulk = result;
      console.log("result............", this.bulk);
    });
  }

  filereader(file, callback) {
    if (file) {
      let fileReader = new FileReader()
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i)
          arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = JSXLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        callback(JSXLSX.utils.sheet_to_json(worksheet, { raw: true }));
      };
      fileReader.readAsArrayBuffer(file);
    } else {
      callback([]);
    }
  }


  Error(item) {
    const modalRef = this.modal.open(ErrormsgComponent, { size: 'lg', container: 'nb-layout', backdrop: false });
    modalRef.componentInstance.title = 'Error List';
    modalRef.componentInstance.item = item;
    modalRef.result.then((data) => {
      ;

    })

  }



  createForm() {
    this.channeservlForm = new FormGroup({
      hdid: new FormControl(this.editdata["hdid"] || "", Validators.required),
      modetype: new FormControl("1", Validators.required),
      casserviceid: new FormControl(this.editdata["casserviceid"] || "", Validators.required),
      casid: new FormControl(this.editdata["casid"] || "", Validators.required),
      channelid: new FormControl(this.editdata["channelid"] || "", Validators.required),
    });
  }

  get val() {
    return this.channeservlForm.value;
  }
}
