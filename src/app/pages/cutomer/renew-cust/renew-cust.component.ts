import { Component, OnInit, ViewChildren, QueryList, ElementRef, NgModule, ViewChild } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PackageService } from '../../_services';
import { SubscriberService } from '../../_services/subscriber.service';

const now = new Date();
@Component({
  selector: 'ngx-renew-cust',
  templateUrl: './renew-cust.component.html',
  styleUrls: ['./renew-cust.component.scss']
})
export class RenewCustComponent implements OnInit {
  // public ngxLoadingAnimationTypes = this.ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false; failpack: any = [];
  baseBack; baseBackAct = false; arr: any = []; s: any = ''; 
  submit: boolean = false; RenewForm; pack_type: any; months: any = ''; day: any = ''; getboxlist
  package: any = []; cust_id: any = []; package_price: any = []; bpack: any = []; getbundle
  addonpack: any = []; alacartepack: any = []; searchalcart: string; searchaddon: string;
  searchbase: string; now: Date = new Date(); data: any = []; toDate: any = ''; fdate: any = '';
  @ViewChildren('input') input: QueryList<ElementRef>;
  confirmationDialogService: any;
  constructor(
    private alert: ToasterService,
    private router: Router,
    private nasmodel: NgbModal,
    private subscribers: SubscriberService,
    private packageservices: PackageService,

  ) {
    this.cust_id = JSON.parse(localStorage.getItem('cust_data'))
    console.log("customer id", this.cust_id);
    // console.log(this.now)
  }



  focusInvalid() {
    let valid: boolean = false;
    this.input.forEach((item) => {
      if (!valid) {
        if (item.nativeElement) {
          item.nativeElement.classList.forEach((item1) => {
            if (item1 == 'form-control-danger') {
              valid = true;
              item.nativeElement.focus();
            }
          });
        } else {
          item['input'].nativeElement.classList.forEach((item1) => {
            if (item1 == 'form-control-danger') {
              valid = true;
              item['input'].nativeElement.focus();
            }
          });
        }
      }
    });
  }

  ngOnInit() {
    this.createForm();
    this.getpack();
    this.operator();
    this.getbox();
  }
  defaultdate(result) {

    // console.log('qwerty')
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    var d = new Date(year, month, 0).getDate();
    var newexpdate = new Date();
    var newexpdates = new Date();

    console.log('ssfdffggg')


    this.months = newexpdate.setDate(this.now.getDate() + d);
    // console.log(this.months)
    for (var i = 0; i < result.length; i++) {
      console.log(result[i].day)
      this.s = result[i].day
      // console.log(this.day)
    }
    this.day = newexpdates.setDate(this.now.getDate() + (this.s));


  }


  async getbox() {
    this.getboxlist = await this.subscribers.getbox({ hdid: this.cust_id['hdid'] })
    console.log('getbox', this.getboxlist)
  }

  selectThisMonth(item, unit, day) {
    console.log(day)
    let year = now.getFullYear();
    let month = now.getMonth() + 1;

    let q = month + item.r_price
    this.toDate = new Date(year, month, 0).getDate()
    const arr = []
    for (var i = month; i < q; i++) {
      arr.push(new Date(year, i, 0).getDate())
    }
    let d = arr.reduce((acc, cur) => acc + cur);
    // console.log(d)
    var newexpdate = new Date();
    var newexpdates = new Date();

    if (unit == 2) {
      item.expiry_date = newexpdate.setDate(this.now.getDate() + d);
    }
    if (unit == 1) {
      item.expiry_date = newexpdates.setDate(this.now.getDate() + (item.r_price * day));
    }
  }

  disablePackage() {
    // console.log(this.bpack.packid)
    let packId = this.bpack.find(item => item.packid == this.baseBack);
    packId = packId ? packId.bundle_pack : null;
    // console.log(packId)
    if (packId) {
      packId = JSON.parse(packId);
      this.addonpack.filter(item => { if (item.active_pack != 1 && packId.includes(item.packid)) { item.state = true; item.bandleFlg = true; } });
      this.alacartepack.filter(item => { if (item.active_pack != 1 && packId.includes(item.packid)) { item.state = true; item.bandleFlg = true; } });
      // console.log(this.addonpack)
      // console.log(this.alacartepack)
    }
  }

  async getpack() {
    let packagedet = await this.subscribers.listsubscriberpack(
      {
        resellerid: this.cust_id['resellerid'],
        boxid: this.RenewForm.value['stb_no'],
      })

    // packagedet = result1
    console.log("package list ", packagedet)
    // if (packagedet) {

    //   this.package = packagedet;
    //   this.defaultdate(packagedet);

    //    console.log('packkkkkk',packagedet)
    //   this.bpack = this.package.filter(item => { if (item.packtype == 1 || item.packtype == 3) { item.r_price = 1; return item; } });
    //   if (this.bpack.find(item => item.active_pack == 1)) {
    //     this.baseBack = this.bpack.find(item => item.active_pack == 1).packid;
    //   }
    //  console.log(this.baseBack)

    //   this.baseBackAct = this.baseBack ? true : false;

    //   this.addonpack = this.package.filter(item => {
    //     if (item.packtype == 1) {
    //       item.state = item.active_pack == 1
    //       item.r_price = 1;
    //       return item;
    //     }

    //   });
    //   console.log(this.addonpack);
    //   this.alacartepack = this.package.filter(item => {
    //     if (item.packtype == 0) {
    //       item.state = item.active_pack == 1;
    //       item.r_price = 1;
    //       return item;
    //     }
    //   });
    //   console.log(this.alacartepack)
    // }

    this.getbundle = packagedet[0];
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
    this.disablePackage();

  }

  checkaddonpack(checked) {
    this.addonpack.forEach((x) => (x.state = checked));
  }
  checkalcartepack(checked) {
    this.alacartepack.forEach((x) => (x.state = checked));
  }


  getpackprice() {
    // let val = this.RenewForm.value['package'];
    // if (val) {
    //   this.pack.getpackprice({ cust_id: this.cust_id['cust_id'], packid: val }).subscribe(result => {
    //     if (result) {
    //       this.package_price = result;
    //       // console.log(this.package_price)
    //     }
    //   });
    // }
  }

  renewval() {
    let checkaddonpack = this.addonpack.filter(item => item.state && item.active_pack != 1 && !item.bandleFlg).map(item => {
      return {
        package: item.packid,
        r_price: item.r_price || 0,
        alacart: item.packtype,
        vc_no: this.cust_id['vc_no'],
        cust_id: this.cust_id['cust_id'],
        renewal: 1,
        cust_price: item.cprice,
        mso_price: item.mprice,
        tax_type: item.tax_type,
        lco_share: item.lco_share
      }
    }),
      checkalacatepack = this.alacartepack.filter(item => item.state && item.active_pack != 1 && !item.bandleFlg).map(item => {
        return {
          package: item.packid,
          r_price: item.r_price || 0,
          alacart: item.packtype,
          vc_no: this.cust_id['vc_no'],
          cust_id: this.cust_id['cust_id'],
          renewal: 1,
          cust_price: item.cprice,
          mso_price: item.mprice,
          tax_type: item.tax_type,
          lco_share: item.lco_share
        }
      });

    this.confirmationDialogService.confirm('Confirm Box', 'Please Confirm Your Request')
      .then((confirmed) => {
        if (confirmed == true) {
          this.loading = true;
          this.submit = true;
          // console.log(confirmed,"confirmed");
          let form = this.RenewForm, renewal = form.value;
          // if(form.invalid){
          //   return;
          // }

          renewal['package'] = [...checkaddonpack, ...checkalacatepack];
          if (!this.baseBackAct) {
            let bpack = this.bpack.find(item => item.packid == this.baseBack);
            // console.log(bpack)
            if (bpack) {
              renewal['package'].push({
                package: bpack.packid,
                r_price: bpack.r_price || 0,
                alacart: bpack.packtype,
                vc_no: this.cust_id['vc_no'],
                cust_id: this.cust_id['cust_id'],
                renewal: 1,
                cust_price: bpack.cprice,
                mso_price: bpack.mprice,
                tax_type: bpack.tax_type,
                lco_share: bpack.lco_share
              });
            }
          }
          // Clone A Variable
          let totalamt = JSON.parse(JSON.stringify(this.data.deposit_amt || 0));

          if (!this.balValidation(totalamt, renewal['package'])) {
            return;
          }

          // this.stb.bulk_renewal({ renewal: renewal['package'] }).subscribe(result => {
          //   if (result) {
          //     // console.log(result)
          //     this.showResult(result);
          //     this.disablepack(result);
          //     let packis = this.bpack.bundle_pack;

          //     if (packis) {
          //       this.disablePackage();
          //     }
          //     this.loading = false;
          //   }
          // });
        }
      })

  }

  disablepack(item) {
    // console.log('adsgffghfh')
    this.failpack = item.filter(item => item.Error_msg == 0).map(item => item.packid);
    this.baseBackAct = this.baseBackAct || this.bpack.find(item => this.failpack.includes(item.packid)) ? true : false;
    this.addonpack.filter(item => {
      if (this.failpack.includes(item.packid)) {
        item.active_pack = 1;
      }
    });
    this.alacartepack.filter(item => {
      if (this.failpack.includes(item.packid)) {
        item.active_pack = 1;
      }
    });
  }

  createForm() {
    this.RenewForm = new FormGroup({
      renewal_type: new FormControl(1),
      schedule: new FormControl(''),
      stb_no :new FormControl('')
    });
  }

  balValidation(total = 0, packages = []) {
    let status = true;
    for (let item of packages) {
      total -= this.taxcharge(item.r_price, item.mso_price, item.cust_price, item.tax_type, item.lco_share);
      // if (total < 0) {
      //   status = false;
      // }
    }
    // if (!status) {
    //   total *= -1;
    //   total = Math.round(total * 100) / 100;
    //   this.toastalert("Insufficent Balance You Need " + total, 0);
    // }
    return status;
  }

  taxcharge(qty = 0, mprice = 0, cprice = 0, tax_type, lco_share = 0) {
    // console.log(mprice,qty,cprice,tax_type)
    var pack_price = 0, ctaxamt = 0, mso_price_taxamt = 0;
    if ((tax_type) == 0) {    //Tax Inclusive from LCO price
      pack_price = Number((((qty) * (mprice)) / 1.18));
      ctaxamt = Number((((qty) * (mprice)) - (pack_price)));
    } else if ((tax_type) == 1) {  // Tax Exclusive from LCO price
      pack_price = Number(((qty) * (mprice)));

      ctaxamt = Number(((qty) * ((mprice)) * (0.18)));

    } else if ((tax_type) == 2) {  // Tax Inclusive from Cust price
      pack_price = Number((((qty) * (mprice)) / 1.18));
      cprice = Number((((qty) * (cprice)) / 1.18));
      mso_price_taxamt = Number((((qty) * (mprice)) - (pack_price)));
      ctaxamt = Number((((qty) * (cprice)) - (cprice)));
    } else if (Number(tax_type) == 3) {  // Tax Exclusive from Cust price
      pack_price = Number(((qty) * (mprice)));
      cprice = Number(((qty) * (cprice)));
      mso_price_taxamt = Number(((qty) * ((mprice)) * (0.18)));
      ctaxamt = Number((((qty) * (cprice)) * (0.18)));
    }
    let lcoamt = (pack_price - (pack_price * (lco_share / 100))) + ctaxamt
    // console.log(lcoamt)
    return lcoamt;
  }

  lcoamt() {
    let temp = this.package_price;
    return temp ? (this.package() * (temp.lco_share / 100)) : 0
  }

  channels(item) {
    // const activeModal = this.nasmodel.open(renewalchannel, { size: 'sm', container: 'nb-layout' });
    // activeModal.componentInstance.modalHeader = 'Channel List';
    // activeModal.componentInstance.item = item.packid;
  }


  showResult(item) {
    // const activeModal = this.nasmodel.open(renewalResult, { size: 'lg', backdrop: 'static', container: 'nb-layout' });
    // activeModal.componentInstance.modalHeader = 'Result';
    // activeModal.componentInstance.result = item;
    // activeModal.result.then((data) => {
    //   this.operator();
    // }, (reason) => {
    //   return;
    // });
  }

  operator() {
    // console.log(this.cust_id['id'])
    // this.user.getUserList(
    //   {
    //     id: this.cust_id['id'],
    //     user_type: 1
    //   }).subscribe(result => {
    //     if (result) {
    //       // console.log(result)
    //       this.data = result[0];
    //     }
    //   });
  }
}