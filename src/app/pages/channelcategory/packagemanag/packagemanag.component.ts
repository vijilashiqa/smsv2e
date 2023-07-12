import { Component, OnInit } from '@angular/core';
import { BroadcasterService, HeadendService, PackageService, PagerService, RoleservicesService } from '../../_services';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { PackagechannelComponent } from '../packagechannel/packagechannel.component';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PackpriceshareService } from '../../_services/packpriceshare.service';

@Component({
  selector: 'ngx-packagemanag',
  templateUrl: './packagemanag.component.html',
  styleUrls: ['./packagemanag.component.scss']
})
export class PackagemanagComponent implements OnInit {
  pager: any = {}; page: number = 1; pagedItems: any = []; limit = 25; listpackagedata; data; count; data1; idd; len
  headend = ''; op_type = ''; opt: any = []; listhead; broadcast; searchpackage; valamount; bcamount; resp; checkdata;
  share: any = []; operator_name = ''; mode = ''; packagemang; dist; bcassign; searchpackage1; amountv; sha; total; total1; total2; total3
  pack_type = ''; pack: any = []; package = ''; getpackagelist; disable = false; val; check_count; result; entry
  index = -1; cas: any = []; cas_type = ''; prod_id = ''; bcshare: any; bbshare; msov; distv; subdistv; bcsharev; resellerv;
  broadlist: any = []; bcid = ''; modalRef: BsModalRef; vall

  submit: boolean;
  formGroup: any;
  constructor(
    private _fb: FormBuilder,
    private packageser: PackageService,
    private broadcasterService: BroadcasterService,
    public role: RoleservicesService,
    private toast: ToastrService,
    private route: Router,
    private headends: HeadendService,
    private packservices: PackpriceshareService) { }

  async ngOnInit() {
    if (this.role.getroleid() > 777) {
      this.getHeadend();
      this.createForm();
    } else {
      this.headend = JSON.parse(localStorage.getItem('userinfo'))['hdid'];
      this.getpackage();
      this.createForm();
    }
  }

  async Getbroadcasteredit($event = '') {
    this.broadcast = await this.broadcasterService.getbroadcaster({ hdid: this.headend });
  }



  async initiallist() {
    this.listpackagedata = await this.packageser.searchpackshareone({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      hdid: this.headend,
      packtype: this.pack_type,
      packid: this.package,
      mode: this.mode
    });
    this.data = this.listpackagedata[0];
    this.arary();
    this.getbcshare();
  }
  clearpackage() {
    this.package = '';
    this.bcshare = ''

  }
  async getpackage() {
    this.getpackagelist = await this.packageser.searchpack({ hdid: this.headend, packtype: this.pack_type })
  }


  async getbcshare() {
    this.bbshare = this.package;
    this.bcassign = this.getpackagelist.filter(x => x.packid == this.bbshare).map(x => x.bcshare)
    this.bcshare = this.bcassign;
  }


  async amount() {
    this.valamount = this.package;
    this.amountv = Number(this.getpackagelist.filter(x => x.packid == this.valamount).map(x => x.bcamt).join(''));
  }


  async arary() {
    await this.createForm();
    for (let item of this.data) {
      this.addreseller(item.dist_share, item.mso_share, item.reseller_share, item.sub_dist_share, item.distid, item.profileid, item.subdistid, item.id, this.amountv, this.bcamount, this.checkdata, this.resp)
    }

  }

  checkBoxChecked() {
    this.checkdata = this.data.filter(x => x.checked == true).map(x => x.id);

  }


  async getHeadend() {
    this.listhead = await this.headends.getHeadend({})
    console.log(this.listhead)
  }
  get share_details(): FormArray {
    return this.searchpackage.get('share_details') as FormArray;
  }

  addreseller(dist_share = 0, mso_share = 0, reseller_share = 0, sub_dist_share = 0, distid = 0, profileid = 0, subdistid = 0, id = 0, amountv = 0, bcamount, resp, checkdata) {
    this.share_details.push(this.createReseller(dist_share, mso_share, reseller_share, sub_dist_share, distid, profileid, subdistid, id, amountv, bcamount, resp, checkdata));
  }

  async Updatepack() {
    {
      this.submit = true;
      const invalid = [];
      const control = this.searchpackage.controls
      for (const name in control) {
        if (control[name].invalid) {
          invalid.push(name);
        }
      }
      if (this.searchpackage.invalid) {
        return;
      }
    }
    if (this.vall != 100) {
      this.toast.warning("share not equal to 100 ")
    }
    this.searchpackage.value.share_details = this.searchpackage.value.share_details.filter(x => x.checked == true);
    this.searchpackage.value.hdid = this.headend;
    this.searchpackage.value.packid = this.package;
    this.result = await this.packservices.packpriceshare(this.searchpackage.value);
    if (this.result && this.result[0].err_code == 0) {
      this.toast.success(this.result[0]['msg']);
      this.route.navigate(['/pages/channelcategory/searchpackage']);
    } else {
      this.toast.warning(this.result[0]['msg']);
    }

  }


  onkeyupQty(index: number) {
    this.msov = this.searchpackage.value["share_details"][index]["mso_share"] ? this.searchpackage.value["share_details"][index]["mso_share"] : 0;
    this.distv = this.searchpackage.value["share_details"][index]["dist_share"] ? this.searchpackage.value["share_details"][index]["dist_share"] : 0;
    this.subdistv = this.searchpackage.value["share_details"][index]["sub_dist_share"] ? this.searchpackage.value["share_details"][index]["sub_dist_share"] : 0;
    this.resellerv = this.searchpackage.value["share_details"][index]["reseller_share"] ? this.searchpackage.value["share_details"][index]["reseller_share"] : 0;
    this.bcsharev = Number(this.bcassign);
    this.vall = this.msov + this.distv + this.subdistv + this.resellerv + this.bcsharev;
    console.log("share @@@@@@@@@@@@@@", this.vall)
   
  }




  createReseller(dist_share, mso_share, reseller_share, sub_dist_share, distid, profileid, subdistid, id, amountv, bcamount, resp, checkdata): FormGroup {
    return this._fb.group({
      checked: [],
      resellerid: [id],
      profileid: [profileid],
      dist_share: [{ value: dist_share, disabled: distid == 0 ? true : null }],
      mso_share: [mso_share],
      sub_dist_share: [{ value: sub_dist_share, disabled: subdistid == 0 ? true : null }],
      reseller_share: [reseller_share],
      r_price: [amountv]
    }
    );

  }

  createForm() {
    this.searchpackage = new FormGroup({
      share_details: new FormArray([])
    });
  }

}

