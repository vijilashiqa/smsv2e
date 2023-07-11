import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  HeadendService,
  BroadcasterService,
  ChannelService,
  PackageService,
  RoleservicesService,
} from "../../_services";
import { toJS } from "mobx";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { ITreeOptions } from "@circlon/angular-tree-component";
import { PackagechannelComponent } from "../packagechannel/packagechannel.component";
@Component({
  selector: "ngx-addpackage",
  templateUrl: "./addpackage.component.html",
  styleUrls: ["./addpackage.component.scss"],
})
export class AddpackageComponent implements OnInit {
  @ViewChild("tree") public tree;
  cas: any = [];
  searchalcart: string;
  searchaddon: string;
  searchbase: string;
  baseBack = "";
  listhead;
  listbroadaterr;
  addbulkvalues;
  opt: any = [];
  loc: any = [];
  branch: any = [];
  package;
  nodes: any = [];
  Getchannel;
  broadcaster: any = [];
  listhdcas;
  bpack: any = "";
  addonpack: any = "";
  alacartepack: any = "";
  submit: boolean;
  casdata;
  getbundle;
  id;
  editdata;
  AddPackageForm;
  modalRef: BsModalRef;
  addpackagevalues;
  treeOptions: ITreeOptions = {
    useCheckbox: true,
  };

  constructor(
    private _fb: FormBuilder,
    private headend: HeadendService,
    private toast: ToastrService,
    private broadcast: BroadcasterService,
    private channel: ChannelService,
    private packageser: PackageService,
    private modal: NgbModal,
    private route: Router,
    private aRoute: ActivatedRoute,
    public role: RoleservicesService
  ) { }

  ngOnInit() {
    this.createForm();
    if (this.role.getroleid() > 777) {
      this.getHeadend();
    } else {
      this.AddPackageForm.get("hdid").setValue(this.role.getheadend());
      this.getblundledata();
      this.getbroadcaster();
    }
    this.getcas();
  }

  async getcas($event = "") {
    if(this.AddPackageForm.value['hdid']){
      this.listhdcas = await this.headend.listHdcas({ like: $event });
      this.listhdcas = this.casdata = this.listhdcas[0];
    }
  }

  async getbroadcaster() {
    if(this.AddPackageForm.value['hdid']){
    this.listbroadaterr = await this.broadcast.listbroadcaster({
      hdid: this.AddPackageForm.value["hdid"],
    });
    this.listbroadaterr = this.listbroadaterr[0];
  }
}

  checkaddonpack(checked) {
    this.addonpack.forEach((x) => (x.state = checked));
  }
  checkalpack(checked) {
    this.alacartepack.forEach((x) => (x.state = checked));
  }
  async getchannel() {
    let result = await this.channel
      .getchannel_for_pack({
        hdid: this.AddPackageForm.value["hdid"],
        bcid: this.AddPackageForm.value["bcid"],
      })
      .toPromise();
    console.log("getchannel11111", result);
    if (result) {
      this.Getchannel = result;

      let temp = [],
        temp1 = [];
      let total = result["length"];
      console.log(total, result);
      for (var i = 0; i < total; i++) {
        let lang = result[i]["langname"];
        let genre,
          channel = [];
        console.log("lan", result[i]["langname"]);

        for (var j = i; j < total; j++) {
          console.log("j value", j);

          if (lang == result[j]["langname"]) {
            genre = result[j]["genrename"];
            console.log("gen", genre);

            for (var k = j; k < total; k++) {
              console.log("k value", k);

              if (
                k == total - 1 &&
                result[k]["genrename"] == genre &&
                lang == result[k]["langname"]
              ) {
                temp.push({ name: genre, children: channel });
                j = k;
                i = k;
              }
              if (
                result[k]["genrename"] == genre &&
                lang == result[k]["langname"]
              ) {
                channel.push({
                  name: result[k]["channame"],
                  id: result[k]["chanid"],
                });
              } else {
                i = k - 1;
                j = k - 1;
                temp.push({ name: genre, children: channel });

                channel = [];
                break;
              }
            }
          } else {
            i = j - 1;
            break;
          }
        }
        temp1.push({
          name: lang,
          children: temp,
        });
        temp = [];
      }
      this.nodes = temp1;
      this.tree.treeModel.update();
      console.log("nodes-----------------", this.nodes);

      const nodeselected: any = this.selectednodes();
      if (this.AddPackageForm.value["packtype"] != 3) {
        for (var i = 0; i < nodeselected.length; ++i) {
          this.tree.treeModel.getNodeById(nodeselected[i]).setIsSelected(false);
        }
      }
    }
  }

  selectednodes() {
    if (this.AddPackageForm.value["packtype"] != 3) {
      const selectedNodes = [];
      Object.entries(toJS(this.tree.treeModel.selectedLeafNodeIds)).forEach(
        ([key, value]) => {
          console.log("key and value ", key, value);
          if (value === true) {
            selectedNodes.push(parseInt(key));
          }
        }
      );
      return selectedNodes;
    }
  }

  getnode() {
    const snode = this.selectednodes();
    console.log("node length", snode.length);
  }

  channels(item) {
    const modalRef = this.modal.open(PackagechannelComponent, {
      size: "sm",
      container: "nb-layout",
      backdrop: false,
    });
    modalRef.componentInstance.modalHeader = "Channel List";
    modalRef.componentInstance.item = item;
    modalRef.result.then((data) => { });
  }

  async addPack() {
    this.submit = true;
    if (this.AddPackageForm.invalid) {
      return;
    }
    let checkaddonpack = this.addonpack.filter((item) => item.state).map((item) => item.packid),
      checkalacatepack = this.alacartepack
        .filter((item) => item.state)
        .map((item) => item.packid);
    const nodeselected = this.selectednodes();
    // console.log("node selected", nodeselected);
    if (
      this.AddPackageForm.value["packtype"] != 3 &&
      nodeselected.length == 0
    ) {
      this.toast.warning("Please Select Channel");
      return;
    } else if (
      this.AddPackageForm.value["packtype"] == 1 &&
      nodeselected.length != 1
    ) {
      this.toast.warning("Please Select Only One Channel");
      return;
    }
    this.AddPackageForm.value["channel"] = nodeselected;
    this.AddPackageForm.value.package = [
      ...checkaddonpack,
      ...checkalacatepack,
      this.baseBack,
    ];
    if (this.AddPackageForm.value["packtype"] == 3 && this.baseBack == "") {
      this.toast.warning("Please Select Any One Base Pack");
      return;
    }
    this.AddPackageForm.value["status"] =
    this.AddPackageForm.value["status"] == true ? 1 : 0;
    let ser = this.AddPackageForm.value.serviceid;
    let res1 = ser.filter((x) => x.productid == "").map((x) => x.productid);
    if (res1.length == 5 && this.AddPackageForm.value["packtype"] != 3) {
      this.toast.warning("Please Fill Any One Product ID");
      return;
    }
    const result = await this.packageser.addpackage(this.AddPackageForm.value);
    if (result && result[0].err_code == 0) {
      this.toast.success(result[0]["msg"]);
      this.route.navigate(["/pages/channelcategory/packagelist"]);
    } else {
      this.toast.warning(result[0]["msg"]);
    }
  }
  async getHeadend($event = "") {
    this.listhead = await this.headend.getHeadend({ like: $event });
    console.log(this.listhead);
  }

  BasePackage() {
    this.AddPackageForm.value["permission"] == 2
      ? this.AddPackageForm.get("basic_package").setValidators([ Validators.required,]): this.AddPackageForm.get("basic_package").clearValidators();
    this.AddPackageForm.get("basic_package").updateValueAndValidity();
  }

  clearValidation() {
    let clear = (this.AddPackageForm.value["packtype"] = 3);
    if (clear == 3) {
      this.AddPackageForm.get("bcid").clearValidators();
      this.AddPackageForm.get("bcid").updateValueAndValidity();
      this.AddPackageForm.get("broadcaster_share").clearValidators();
      this.AddPackageForm.get("broadcaster_share").updateValueAndValidity();
    } else {
      this.AddPackageForm.get("bcid").setValidators([Validators.required]);
      this.AddPackageForm.get("bcid").updateValueAndValidity();
      this.AddPackageForm.get("broadcaster_share").setValidators([
        Validators.required,
      ]);
      this.AddPackageForm.get("broadcaster_share").updateValueAndValidity();
    }
  }

  taxcontrol() {
    let clear = this.AddPackageForm.value["enable_tax"];
    if (clear == false) {
      this.AddPackageForm.get("tax_type").clearValidators();
      this.AddPackageForm.get("tax_type").updateValueAndValidity();
    } else {
      this.AddPackageForm.get("tax_type").setValidators([Validators.required]);
      this.AddPackageForm.get("tax_type").updateValueAndValidity();
    }
  }

  async getblundledata() {
    this.getbundle = await this.packageser.listbundlepack({
      hdid: this.AddPackageForm.value["hdid"],
    });
    this.getbundle = this.getbundle[0];
    if (this.getbundle) {
      this.package = this.getbundle;
      this.bpack = this.package.filter((item) => item.packtype == 0);
      console.log("packtype bpack", this.bpack);
      this.addonpack = this.package.filter((item) => item.packtype == 2);
      console.log("packtype addonpack", this.addonpack);
      this.alacartepack = this.package.filter((item) => item.packtype == 1);
      console.log("packtype alacartepack", this.alacartepack);
    }
    console.log("get bundle data********", this.getbundle);
  }

  share() {
    console.log("dfgdfgdsfg share fggdfgff");
    this.AddPackageForm.value["packtype"] = 3
      ? this.AddPackageForm.get("bcid").setValidators([Validators.required])
      : this.AddPackageForm.get("bcid").clearValidators();
    this.AddPackageForm.get("bcid").updateValueAndValidity();

    this.AddPackageForm.value["packtype"] = 3
      ? this.AddPackageForm.get("broadcaster_share").setValidators([
        Validators.required,
      ])
      : this.AddPackageForm.get("broadcaster_share").clearValidators();
    this.AddPackageForm.get("broadcaster_share").updateValueAndValidity();
  }

  get serviceid(): FormArray {
    return this.AddPackageForm.get("serviceid") as FormArray;
  }

  deleteserviceid(index: number) {
    this.serviceid.removeAt(index);
  }
  createserviceid(id: number, name: string): FormGroup {
    return this._fb.group({
      productid: [""],
      casid: [name, Validators.required],
      id: [id, Validators.required],
    });
  }
  createForm() {
    this.AddPackageForm = new FormGroup({
      packname: new FormControl("", Validators.required),
      bcid: new FormControl("", Validators.required),
      srvtype: new FormControl("", Validators.required),
      tax_type: new FormControl("", Validators.required),
      hdid: new FormControl("", Validators.required),
      status: new FormControl(true),
      enable_tax: new FormControl(true),
      packtype: new FormControl("0"),
      broadcaster_share: new FormControl("", [
        Validators.required,
        Validators.max(100),
      ]),
      bcamt: new FormControl("", Validators.required),
      serviceid: new FormArray([
        this.createserviceid(1, "Gospell"),
        this.createserviceid(2, "Secure Tv"),
        this.createserviceid(3, "Safeview"),
        this.createserviceid(4, "Gospell ADV"),
        this.createserviceid(5, "Bharath CAS"),
      ]),
    });
  }

  val() {
    return this.AddPackageForm.value;
  }
}
