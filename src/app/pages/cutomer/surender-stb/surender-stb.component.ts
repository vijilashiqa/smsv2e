import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { HeadendService } from "../../_services/headend.service";
import { SubscriberService } from "../../_services/subscriber.service";
import { StbmanagementService } from "../../_services/stbmanagement.service";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: "ngx-surender-stb",
  templateUrl: "./surender-stb.component.html",
  styleUrls: ["./surender-stb.component.scss"],
})
export class SurenderStbComponent implements OnInit {
  public primaryColour = "#dd0031";
  public secondaryColour = "#006ddd";
  public loading = false;
  data;
  count = 0;
  search: boolean = false;
  model: any = [];
  head: any = [];
  pager: any = {};
  page: number = 1;
  opt: any = [];
  stbdet: any = [];
  pagedItems: any = [];
  locitem: any = [];
  branchitem: any = [];
  vcdet: any = [];
  Custform;
  limit: number = 25;
  surenderstbForm;
  submit: boolean;
  operator_name = "";
  loc = "";liststb;
  branch = "";
  op_type = "";
  operatortype;
  model_opt = "";
  stbopt = "";
  vc = "";listsubc;
  status = "";
  listhead;
  getoperatorlist;
  from_date = "";
  to_date = "";
  head_opt = "";
  address = "";
  getboxlist;

  constructor(
    private headend: HeadendService,
    private subscribers: SubscriberService,
    private stb: StbmanagementService,
    private toast: ToastrService,
  ) {}

  ngOnInit() {
    this.createForm();
    this.getHeadend();
    // this.listsub()
  }

 async addsurender() {
    // console.log("ddassd");
    let result = await this.stb.addsurrender(this.surenderstbForm.value);
    console.log("result", result);
    if (result && result[0]['err_code'] == 0) {
      this.toast.success(result[0]['msg']);
      this.reset();

    } else {
      this.toast.warning(result[0]['msg'])
    }

  }


  async getHeadend($event = "") {
    this.listhead = await this.headend.getHeadend({ like: $event });
    console.log(this.listhead);
  }

  async getoperator($event = "") {
    if (this.surenderstbForm.value["hdid"]) {
      this.getoperatorlist = await this.subscribers.getoperator({
        hdid: this.surenderstbForm.value["hdid"],
        like: $event,
      });
      console.log("operator list ", this.getoperatorlist);
    }
  }

  changeopr() {
    this.surenderstbForm.controls.lcoid.setValue("");
    this.surenderstbForm.controls.custid.setValue("");
  }


  reset(){
    this.surenderstbForm.controls.hdid.setValue("");
    this.surenderstbForm.controls.custid.setValue("");
    this.surenderstbForm.controls.lcoid.setValue("");
    this.surenderstbForm.controls.usertype.setValue("");
    this.surenderstbForm.controls.type.setValue("");
    this.surenderstbForm.controls.stb_no.setValue("");

  }


  async listsub(){
if(this.surenderstbForm.value["hdid"] && this.surenderstbForm.value["usertype"] && this.surenderstbForm.value["lcoid"] ){
  this.liststb = await this.subscribers.listsubscriber({
    hdid: this.surenderstbForm.value["hdid"],
    usertype: this.surenderstbForm.value["usertype"],
    userid: this.surenderstbForm.value["lcoid"],
  });
  this.listsubc =this.liststb[0]

  console.log("subcriber name",this.listsubc)
}
  
  }

  async getoperatortypef() {
    this.operatortype = await this.stb.getoperatortype({
      usertype: this.surenderstbForm.value["usertype"],
      hdid: this.surenderstbForm.value["hdid"],
    });
    console.log("operator type ", this.operatortype);
  }
  async getbox($event = "") {
    this.getboxlist = await this.stb.getbox({
      hdid: this.surenderstbForm.value["hdid"],
      userid: this.surenderstbForm.value["lcoid"],
      like: $event,
      custid :this.surenderstbForm.value["custid"]
    });
    console.log("getbox", this.getboxlist);
  }

  createForm() {
    this.surenderstbForm = new FormGroup({
      hdid: new FormControl(""),
      lcoid: new FormControl(""),
      custid: new FormControl(""),
      usertype: new FormControl(""),
      type: new FormControl(""),
      stb_no: new FormControl(""),
      dob: new FormControl(""),
    });
  }
}
