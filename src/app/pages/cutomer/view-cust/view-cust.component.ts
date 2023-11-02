import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { PagerService } from "../../_services";
import { StbmanagementService } from "../../_services/stbmanagement.service";
import { StockService } from "../../_services/stock.service";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "ngx-view-cust",
  templateUrl: "./view-cust.component.html",
  styleUrls: ["./view-cust.component.scss"],
})
export class ViewCustComponent implements OnInit {
  //  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = "#dd0031";
  public secondaryColour = "#006ddd";
  public loading = false;
  getstbtypeg;
  getmodel;
  submit: boolean;
  cust_id;
  cust_det = {};
  black_submit: boolean;
  stbdetails: any = [];
  listboxpair;
  transfer_submit: boolean;
  oldinvoicepagedItems: any = [];
  getmodellist;
  fingerprint_submit: boolean;
  oldinvoicecount = 0;
  getboxlist;
  msg_submit: boolean;
  extendedinvoice: any = [];
  extendedinvoicecount = 0;
  TransferForm;
  old_invoice_list: any = [];
  activeinvoicecount = 0;
  fingerprint;
  totalIamount;
  totalOamount;
  stbmsg;
  pager: any = {};
  BlacklistForm;
  array: any = [];
  stbdet: any = [];
  model: any = [];
  pagerss: any = {};
  OTPflg: boolean = false;
  invoice_list: any = [];
  stb_type: any = [];
  page: number = 1;
  pagedItems: any = [];
  limit: number = 10;
  vcdet: any = [];
  bpack: any = [];
  pagers: any = {};
  extendedpagedItems: any = [];
  BGColor = [
    { id: 0, name: "black" },
    { id: 1, name: "white" },
    { id: 2, name: "blue" },
    { id: 3, name: "yellow" },
    { id: 4, name: "purple" },
    { id: 5, name: "brown" },
    { id: 6, name: "transparent" },
    { id: 7, name: "dark red" },
    { id: 8, name: "dark green" },
  ];
  TextColor = [
    { id: 0, name: "black" },
    { id: 1, name: "white" },
    { id: 2, name: "blue" },
    { id: 3, name: "yellow" },
    { id: 4, name: "purple" },
    { id: 5, name: "brown" },
    { id: 6, name: "transparent" },
    { id: 7, name: "dark red" },
    { id: 8, name: "dark green" },
  ];
  font = [];
  confirmationDialogService: any;
  constructor(
    private router: Router,
    private stock: StockService,
    private toast: ToastrService,
    private stbm: StbmanagementService,
    public pageservice: PagerService
  ) {
    for (var i = 0; i <= 100; i++) {
      this.font.push({ id: i, name: "font-" + i });
    }
    this.cust_id = JSON.parse(localStorage.getItem("cust_data"));
    console.log("DFGDFGDFGDFGDS", this.cust_id);
  }

  async ngOnInit() {
    await this.createForm();
    await this.getbox();
    await this.getModel();
    await this.boxparing();
    await this.getstbtype();
    this.surrender();
  }

  async transfer() {
    this.submit = true;
    const invalid = [];
    const control = this.TransferForm.controls;
    for (const name in control) {
      if (control[name].invalid) {
        invalid.push(name);
      }
    }
    if (this.TransferForm.invalid) {
      console.log("Invalid value -----", invalid);
      return;
    }
    console.log("data", this.TransferForm.value);

    if (this.TransferForm.value["reason"] == 5) {
      (this.TransferForm.value["hdid"] = this.cust_id["hdid"]),
        (this.TransferForm.value["usertype"] = this.cust_id["usertype"]),
        (this.TransferForm.value["custid"] = this.cust_id["cust_id"]),
        (this.TransferForm.value["lcoid"] = this.cust_id["userid"]),
        (this.TransferForm.value["stb_no"] = this.cust_id["boxid"]),
        (this.TransferForm.value["remarks"] =
          this.TransferForm.value["remarks"]),
        (this.TransferForm.value["note"] = this.TransferForm.value["note"]),
        (this.TransferForm.value["type"] = this.TransferForm.value["type"]),
        console.log("55555555555555", this.TransferForm.value);
      let result = await this.stbm.addsurrender(this.TransferForm.value);
      console.log("result", result);
      if (result && result[0]["err_code"] == 0) {
        this.toast.success(result[0]["msg"]);
      } else {
        this.toast.warning(result[0]["msg"]);
      }
    } else {
      (this.TransferForm.value["custid"] = this.cust_id["cust_id"]),
        (this.TransferForm.value["hdid"] = this.cust_id["hdid"]),
        (this.TransferForm.value["lcoid"] = this.cust_id["userid"]),
        (this.TransferForm.value["stb_no"] = this.cust_id["boxid"]);
      let result1 = await this.stbm.stbupgrade(this.TransferForm.value);
      console.log("result 2", result1);
      if (result1 && result1[0]["err_code"] == 0) {
        this.toast.success(result1[0]["msg"]);
      } else {
        this.toast.warning(result1[0]["msg"]);
      }
    }
  }

  async boxparing(event = "") {
    //BOX
    this.listboxpair = await this.stbm.getboxvcpair({
      hdid: this.cust_id["hdid"],
      // casid : this.TransferForm.value['casid'],
      pairstatus: 0,
      box_like: event,
      userid: this.cust_id["userid"],
    });

    console.log("box pair new ", this.listboxpair);
  }

  async getstbtype() {
    this.getstbtypeg = await this.stbm.getstbtype({
      hdid: this.cust_id["hdid"],
      boxtypeid: this.TransferForm.value["boxmodelid"],
    });
  }

  scheduletime() {
    this.fingerprint.value["Time"] == 2
      ? this.fingerprint.get("Schedule").setValidators([Validators.required])
      : this.fingerprint.get("Schedule").clearValidators();
    this.fingerprint.get("Schedule").updateValueAndValidity();
  }
  schedulemsg() {
    this.stbmsg.value["Time"] == 2
      ? this.stbmsg.get("Schedule").setValidators([Validators.required])
      : this.stbmsg.get("Schedule").clearValidators();
    this.stbmsg.get("Schedule").updateValueAndValidity();
  }

  msg() {
    this.stbmsg.value["msg_type"] == 2
      ? this.stbmsg.get("msg_title").setValidators([Validators.required])
      : this.stbmsg.get("msg_title").clearValidators();
    this.stbmsg.get("msg_title").updateValueAndValidity();
  }
  scrool() {
    this.stbmsg.value["msg_type"] == 1
      ? this.stbmsg.get("scrool_type").setValidators([Validators.required])
      : this.stbmsg.get("scrool_type").clearValidators();
    this.stbmsg.get("scrool_type").updateValueAndValidity();
  }
  osd() {
    this.stbmsg.value["msg_type"] == 1
      ? this.stbmsg.get("osd_type").setValidators([Validators.required])
      : this.stbmsg.get("osd_type").clearValidators();
    this.stbmsg.get("osd_type").updateValueAndValidity();
  }
  cord() {
    this.fingerprint.value["fp_type"] == 1
      ? this.fingerprint.get("xcord").setValidators([Validators.required])
      : this.fingerprint.get("xcord").clearValidators();
    this.fingerprint.get("xcord").updateValueAndValidity();
    this.fingerprint.value["fp_type"] == 1
      ? this.fingerprint.get("ycord").setValidators([Validators.required])
      : this.fingerprint.get("ycord").clearValidators();
    this.fingerprint.get("ycord").updateValueAndValidity();
  }
  duration() {
    this.fingerprint.value["msg_type"] == 1
      ? this.fingerprint.get("duration").setValidators([Validators.required])
      : this.fingerprint.get("duration").clearValidators();
    this.fingerprint.get("duration").updateValueAndValidity();
  }
  sendfingerprint() {
    this.transfer_submit = true;
    if (this.fingerprint.invalid) {
      return;
    }
    this.loading = true;
  }

  sendmsg() {}

  async getModelcas($event = "") {
    this.getmodel = await this.stock.getstockmodel({
      hdid: this.cust_id["hdid"],
      hdcasid: this.TransferForm.value["casid"],
      like: $event,
    });
  }

  setModelType() {
    let model = this.TransferForm.value["boxmodelid"];
    console.log("box id", model);
    let modeli = this.getmodellist.find((x) => x.bmid == model);
    let stbtypep = modeli.stbtypeid;
    console.log("model is thth ", modeli);
    let boxty = this.getstbtypeg.find((x) => x.boxtypeid == stbtypep);
    let ctrl = this.TransferForm.controls;
    ctrl["boxno"].clearValidators();
    if (model != "") {
      ctrl["stb_type"].setValue(boxty.boxtypeid);
    }
  }

  async getbox() {
    this.getboxlist = await this.stbm.getbox({
      hdid: this.cust_id["hdid"],
      custid: this.cust_id["cust_id"],
    });
    console.log("getbox", this.getboxlist);
  }

  surrender() {
console.log(this.TransferForm.value["reason"])
    if (this.TransferForm.value["reason"] == 5) { 
       console.log("surrender");
      this.TransferForm.get('amount').clearValidators();
      this.TransferForm.get('amount').updateValueAndValidity();
      this.TransferForm.get('boxmodelid').clearValidators();
      this.TransferForm.get('boxmodelid').updateValueAndValidity();
      this.TransferForm.get('boxno').clearValidators();
      this.TransferForm.get('boxno').updateValueAndValidity();
    } 
     if(this.TransferForm.value["reason"] == 6)
    {
      console.log("else")
      this.TransferForm.get('amount').setValidators([Validators.required]);
      this.TransferForm.get('amount').updateValueAndValidity();
      this.TransferForm.get('boxmodelid').setValidators([Validators.required]);
      this.TransferForm.get('boxmodelid').updateValueAndValidity();
      this.TransferForm.get('boxno').setValidators([Validators.required]);
      this.TransferForm.get('boxno').updateValueAndValidity();      
    }
  }

 

  createForm() {
    this.fingerprint = new FormGroup({
      Time: new FormControl("", Validators.required),
      xcord: new FormControl(""),
      ycord: new FormControl(""),
      boxid: new FormControl(""),
      fp_text_size: new FormControl(20),
      fp_bg_color: new FormControl(1),
      fp_text_color: new FormControl(0),
      fp_overt: new FormControl(""),
      Schedule: new FormControl(""),
      duration: new FormControl("", [
        Validators.required,
        Validators.max(99999999999),
      ]),
      repetition: new FormControl(1, [
        Validators.required,
        Validators.max(999),
      ]),
      intervals: new FormControl(0, [Validators.required,Validators.max(99999999999),]),
      fp_type: new FormControl(1),});



     this.stbmsg = new FormGroup({
      Time: new FormControl("", Validators.required),
      fp_text_size: new FormControl(20),
      boxid: new FormControl(""),
      fp_bg_color: new FormControl(1),
      fp_text_color: new FormControl(0),
      Schedule: new FormControl(""),
      duration: new FormControl("", [Validators.max(99999999999)]),
      repetition: new FormControl(1, [Validators.required,Validators.max(999),]),
      intervals: new FormControl(0, [Validators.required,Validators.max(99999999999),]),
      msg_type: new FormControl(1),
      msg_title: new FormControl("", [Validators.maxLength(30)]),
      msg: new FormControl("", [ Validators.required, Validators.maxLength(1000),]),
      osd_type: new FormControl(0),
      scrool_type: new FormControl(""),
    });
    this.TransferForm = new FormGroup({
      reason: new FormControl("", Validators.required),
      amount: new FormControl(""),
      boxmodelid: new FormControl(""),
      boxno: new FormControl(""),
      new_stb: new FormControl(""),
      type: new FormControl(""),
      stb_type: new FormControl({ value: "", disabled: true }),
      remarks: new FormControl("", Validators.required),
      // stbtype: new FormControl({ value: "", disabled: true }),
      vcnumber: new FormControl(""),
      hold_period: new FormControl(""),
      rep_of: new FormControl(3),
      note: new FormControl("", Validators.required),
      swap_stb: new FormControl(""),
    });
    this.BlacklistForm = new FormGroup({
      reason: new FormControl("", Validators.required),
      otp_type: new FormControl(1),
      otp: new FormControl("", Validators.required),
    });
  }

  async getModel() {
    this.getmodellist = await this.stock.getstockmodel({hdid: this.cust_id["hdid"],});
    console.log("stb model", this.getmodellist);
  }

  //   cancelinvoice(item) {
  //     // console.log(item)
  //     const activeModal = this.nasmodel.open(CancelInvoice, { size: 'sm', container: 'nb-layout' });
  //     activeModal.componentInstance.modalHeader = 'Cancel Invoice';
  //     activeModal.componentInstance.item = item;

  //     activeModal.result.then((data) => {

  //       this.getInvoice();
  //       this.getextendedinvoice();
  //       this.getcust();
  //     }, (reason) => {
  //       return;
  //     });
  //   }
  // }
}
