import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { HeadendService, RoleservicesService } from "../../_services";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { BroadcasterService } from "../../_services/broadcaster.service";
import { ChannelService } from "../../_services/channel.service";

@Component({
  selector: "ngx-editchannel",
  templateUrl: "./editchannel.component.html",
  styleUrls: ["./editchannel.component.scss"],
})
export class EditchannelComponent implements OnInit {
  editchannelForm;
  submit: boolean;
  count;
  id;
  lang;
  genres;
  headend;
  broadcasters;
  listhdcas;
  gethdcasname;
  cou;
  editable: boolean = false;
  editdata;
  editflag = false;
  result;
  addchan;
  editdaat;getchan;
  data1;
  fildata;
  each;
  channelid;
  constructor(
    private headService: HeadendService,
    private channelService: ChannelService,
    private toast: ToastrService,
    private route: Router,
    private aRoute: ActivatedRoute,
    private _fb: FormBuilder,

    public role: RoleservicesService,
    private broadcasterService: BroadcasterService
  ) {}

  async ngOnInit() {
    this.id = this.aRoute.snapshot.queryParams["id"];
    await this.createForm();
    if (this.role.getroleid() > 777) {
      await this.getheadend();
    } else {
      this.editchannelForm.get("hdid").setValue(this.role.getheadend());
      await this.Getbroadcasteredit();
      await this.listlang();
    }
    if (this.id) {
      console.log("id!!!!!!!!!!!!!!", this.id);
      await this.edit();
      await this.createForm();
      await this.getchanneledit();
      await this.getcashead();
      await this.listgenre();
      await this.Getbroadcasteredit();
      await this.listlang();
    }

    // this.getcashead()
  }
  async getheadend($event = "") {
    this.count = await this.headService.getHeadend({});
  }
  async listlang($event = "") {
    if (this.editchannelForm.value["hdid"]) {
      let result = await this.channelService.listlang({
        hdid: this.val["hdid"],
      });
      this.lang = result[0];
    }
  }

  async Getbroadcasteredit($event = "") {
    if (this.editchannelForm.value["hdid"]) {
      this.result = await this.broadcasterService.getbroadcaster({
        hdid: this.val["hdid"],
      });
    }
  }

  async listgenre($event = "") {
    if (this.editchannelForm.value["hdid"]) {
      this.genres = await this.channelService.selectgenere({
        hdid: this.val["hdid"],
        langid: this.val["langid"],
      });
      console.log("list genre", this.genres);
    }
  }
  typeclearheadend(val = "1") {
    this.changeclear("genreid", "langid", "bcid");
  }
  typeclearlang(val = "1") {
    this.changeclear("genreid");
  }
  changeclear(...data) {
    for (let i of data) {
      this.editchannelForm.controls[i].setValue("");
    }
  }

  async addchannel() {
    {
      this.submit = true;
      console.log("add...", this.val);
      const invalid = [];
      const control = this.editchannelForm.controls;
      for (const name in control) {
        if (control[name].invalid) {
          invalid.push(name);
        }
      }
      if (this.editchannelForm.invalid) {
        // window.alert('Please fill mandatory fields');
        return;
      }
      console.log("add...", this.val);
      let method = this.id ? "editchannel" : "addchannel";
      console.log("updatelist", method);
      if (this.id) this.editchannelForm.value["id"] = this.id;
      this.editchannelForm.value["status"] =
        this.editchannelForm.value["status"] == true ? 1 : 0;
      let result = await this.channelService[method](
        this.editchannelForm.value
      );
      if (result && result[0].err_code == 0) {
        this.toast.success(result[0]["msg"]);
        this.route.navigate(["/pages/channelcategory/listchannel"]);
      } else {
        this.toast.warning(result[0]["msg"]);
        console.log("add...", this.val);
      }
    }
  }

  async getcashead($event = "") {
    if (this.editchannelForm.value["hdid"]) {
      this.listhdcas = await this.headService.listHdcas({
        hdid: this.editchannelForm.value["hdid"],
      });
      this.listhdcas = this.listhdcas[0];
      console.log("get name", this.listhdcas);
      this.listhdcas = this.listhdcas[0];
      console.log("get name", this.listhdcas);
      // for (let item of this.listhdcas) {
      //   this.addMaterial(item.cas_name, item.hdcasid);
      // }
      // }
    }
  }

  async getchanneledit() {
    this.editdata = await this.channelService.getchannelservices({
      hdid: this.editchannelForm.value["hdid"],
      id: this.getchan
    });
    this.data1 = this.editdata;
    console.log("getchannelservices", this.data1);
    for (let item of this.data1) {
      this.addMaterial(item.cas_name, item.hdcasid, item.casserviceid, item.id
        );

        console.log('channel id',item.chanid);
    }

   
    
  }

  ClearBoradcaster() {
    this.editchannelForm.controls.langid.setValue("");
    this.editchannelForm.controls.genreid.setValue("");
  }
  get ctrl() {
    return this.editchannelForm.controls;
  }
  get val() {
    return this.editchannelForm.value;
  }

  async edit() {
    console.log("edit herer");
    this.addchan = await this.channelService.getchanneledit({ id: this.id });
    console.log("getchanneledit", this.addchan);
    this.channelid = this.addchan.id;
    this.getchan=this.addchan.chanid;



  }

  get casservices(): FormArray {
    return this.editchannelForm.get("casservices") as FormArray;
  }

  addMaterial(cas_name = "", casid = 0, servicesid = 0, id) {
    this.casservices.push(this.createservices(cas_name, casid, servicesid, id));
  }

  // deleteMatField(index: number) {
  //   this.casservices.removeAt(index);
  // }

  createservices(cas_name = "", casid = 0, servicesid = 0, id = 0): FormGroup {
    console.log("channel id $$$$$$$$$$$$$" ,     id
    );
    // console.log("channel id", id);
    return this._fb.group({
      cas_name: [cas_name],
      id: [id ? id : null],
      casid: [casid],
      servicesid: [servicesid],
    });
  }

  createForm() {
    this.editchannelForm = new FormGroup({
      channame: new FormControl(
        this.addchan?.channame || "",
        Validators.required
      ),
      chanmode: new FormControl(
        this.addchan?.chanmode || "",
        Validators.required
      ),
      langid: new FormControl(this.addchan?.langid || "", Validators.required),
      genreid: new FormControl(
        this.addchan?.genreid || "",
        Validators.required
      ),
      bcid: new FormControl(this.addchan?.bcid || "", Validators.required),
      chantype: new FormControl(
        this.addchan?.chantype || "",
        Validators.required
      ),
      hdid: new FormControl(this.addchan?.hdid || "", Validators.required),
      price: new FormControl(this.addchan?.price || "", Validators.required),
      chanlcm: new FormControl(
        this.addchan?.chanlcm || "",
        Validators.required
      ),
      status: new FormControl(
        this.addchan ? (this.addchan["status"] == 1 ? true : false) : true
      ),
      casservices: new FormArray([]),
    });
  }
}
