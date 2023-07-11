 import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BroadcasterService, CountryService, HeadendService, RoleservicesService } from '../../_services/index';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { OperatorService } from '../../_services/operator.service';
import { sumValidator } from '../../_services/validator_service';
@Component({
  selector: 'ngx-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  @ViewChild('tab') tab: any;
  @ViewChildren('input') input: QueryList<ElementRef>;
  filter; distributer: any = [];
  s_distributer: any = [];
  AddUserForm;submit: boolean
  loc: any = []; branch: any = []; head: any = []; profile: any = [];
  state: any = []; district: any = []; city: any = []; id; disabled = false; showtextf
  pincode: any = []; area: any = []; liststate; listarea; editflag; getstates; dist; citylist; operatortypelist; getlistlco; getlistcount;
  nodes = []; User; LocandBranch; keyword = 'name'; listcountry; count; listhead; listbroadaterr; result; subdistributortype;
  editable: boolean = false; editdata: any; showtext: string = '';
  distShareShow = false; subdistshare = false;
  constructor(private country: CountryService,
    private headService: HeadendService,
    private broadcast: BroadcasterService,
    private toast: ToastrService,
    private route: Router,
    public role: RoleservicesService,
    private aRoute: ActivatedRoute,
    private fb: FormBuilder,
    private operator: OperatorService
  ) { }

  async ngOnInit() {
    this.id = this.aRoute.snapshot.queryParams.id;
    this.createForm();
    if (this.role.getroleid() > 777 ) {
    this.getHeadend();
    } else {
      this.AddUserForm.get('hdid').setValue(this.role.getheadend());
    }
    this.getCountry();
    }


  showShare() {
    this.distShareShow = false;
    this.subdistshare = false;
    const [show_flag] = this.getlistcount.filter(({ id }) => this.val['lcoid'] == id).map(item => item.dist_or_sub_flg)
    console.log("show flaf@@@@@@@@", show_flag)
    if (show_flag == 2) this.distShareShow = !this.distShareShow;
    if (show_flag == 3) this.subdistshare = !this.subdistshare;
  }
  async AddUser() {
    this.submit = true;
    const invalid = [];
    const control = this.ctrl
    for (const name in control) {
      if (control[name].invalid) {
        invalid.push(name);
        console.log('data missing ', name);

      }
    }
    if (this.AddUserForm.invalid) {
      window.alert('Please fill mandatory fields');
      return;
    }
    let method = this.id ? 'editoperator' : 'addoperator'
    this.AddUserForm.value['enablestatus'] = this.AddUserForm.value['enablestatus'] == true ? 1 : 0;
    if (this.id) this.AddUserForm.value['id'] = this.id
    let result = await this.operator[method](this.AddUserForm.value)
    if (result && result[0].err_code == 0) {
      this.toast.success(result[0]['msg']);
      this.route.navigate(['/pages/users/userlist'])
    } else {
      this.toast.warning(result[0]['msg'])
    }

  }

  taxpayby() {
    this.AddUserForm.get('gstno').clearValidators();
    this.AddUserForm.get('panno').clearValidators();
    if (this.AddUserForm.value["usertype"] != 333 && this.AddUserForm.value["taxpayby"] == 2) {
      this.AddUserForm.get('gstno').setValidators([Validators.required]);
      this.AddUserForm.get('panno').setValidators([Validators.required]);
    }
    this.AddUserForm.get('gstno').updateValueAndValidity();
    this.AddUserForm.get('panno').updateValueAndValidity();
  }

  operatortype() {
    this.AddUserForm.get('business_name').clearValidators();
    this.AddUserForm.get('distributercode').clearValidators();
    this.AddUserForm.get('dist_or_sub_flg').clearValidators();
    this.AddUserForm.get('distid').clearValidators();
    this.AddUserForm.get('subdistributername').clearValidators();
    this.AddUserForm.get('lcocode').clearValidators();
    this.AddUserForm.get('subcode').clearValidators();
    this.AddUserForm.get('folino').clearValidators();
    this.AddUserForm.get('subscription_start_date').clearValidators();
    this.AddUserForm.get('subscription_end_date').clearValidators();
    let op = parseInt(this.AddUserForm.value["usertype"]),
      dist_or_sub_flg = this.AddUserForm.value['dist_or_sub_flg'],
      share = this.AddUserForm.value["Share_holder"];
    if (op != 333 && op != 666 && !share) {
      this.AddUserForm.get('folino').setValidators([Validators.required]);
    }
    switch (op) {
      case 1:
        this.AddUserForm.get('subscription_start_date').setValidators([Validators.required]);
        this.AddUserForm.get('subscription_end_date').setValidators([Validators.required]);
        this.AddUserForm.get('business_name').setValidators([Validators.required]);
        this.AddUserForm.get('dist_or_sub_flg').setValidators([Validators.required]);
        if (dist_or_sub_flg == 2) {
          this.AddUserForm.get('distid').setValidators([Validators.required]);
        }
        else if (dist_or_sub_flg == 3) {
          this.AddUserForm.get('distid').setValidators([Validators.required]);
          this.AddUserForm.get('subdistributername').setValidators([Validators.required]);
        }
        this.AddUserForm.get('lcocode').setValidators([Validators.required]);
        this.AddUserForm.get('folino').setValidators([Validators.required]);
        break;
      case 2:
        this.AddUserForm.get('business_name').setValidators([Validators.required]);
        this.AddUserForm.get('distributercode').setValidators([Validators.required]);
        this.AddUserForm.get('folino').setValidators([Validators.required]);

        break;
      case 3:
        this.AddUserForm.get('business_name').setValidators([Validators.required]);
        this.AddUserForm.get('distid').setValidators([Validators.required]);
        this.AddUserForm.get('subcode').setValidators([Validators.required]);
        this.AddUserForm.get('folino').setValidators([Validators.required]);
        this.AddUserForm.get('distid').setValidators([Validators.required]);
        break;
      case 4:
        this.AddUserForm.get('business_name').setValidators([Validators.required]);
        this.AddUserForm.get('broadcastername').setValidators([Validators.required]);
        break;
    }
    this.AddUserForm.get('subscription_end_date').updateValueAndValidity();
    this.AddUserForm.get('subscription_start_date').updateValueAndValidity();
    this.AddUserForm.get('business_name').updateValueAndValidity();
    this.AddUserForm.get('broadcastername').updateValueAndValidity();
    this.AddUserForm.get('distributercode').updateValueAndValidity();
    this.AddUserForm.get('dist_or_sub_flg').updateValueAndValidity();
    this.AddUserForm.get('distid').updateValueAndValidity();
    this.AddUserForm.get('subdistributername').updateValueAndValidity();
    this.AddUserForm.get('lcocode').updateValueAndValidity();
    this.AddUserForm.get('subcode').updateValueAndValidity();
    this.AddUserForm.get('folino').updateValueAndValidity();
  }

  Validatorsshare() {
    let clear = this.AddUserForm.value["holderflg"];
    console.log("clear validate", clear);
    if (clear == true) {
      this.AddUserForm.get("folino").clearValidators();
      this.AddUserForm.get("folino").updateValueAndValidity();
    } else {
      this.AddUserForm.get("folino").setValidators([Validators.required]);
      this.AddUserForm.get("folino").updateValueAndValidity();
    }


  }
  
  async getCountry($event = '') {
    this.count = await this.country.listcountry({ like: $event });
  }

  async getstate($event = '') {
    this.getstates = await this.country.liststate({ country_fk: this.AddUserForm.value['country'], like: $event });
  }
  async getdistrict($event = '') {
    this.dist = await this.country.listdistrict({ state_fk: this.AddUserForm.value['state'], like: $event });

  }
  async getcity($event = '') {
    this.citylist = await this.country.listcity({ district_id: this.AddUserForm.value['district'] });
  }
  async getarea($event = '') {
    this.listarea = await this.country.listarea({ city_id: this.AddUserForm.value['city'] });
  }


  async listlco() {

    this.getlistlco = await this.operator.getlcocode({ hdid: this.AddUserForm.value['hdid'] });
    this.getlistcount = this.getlistlco[0];
    console.log('get operator',this.getlistcount)
  }




  async listoperator() {
    this.operatortypelist = await this.operator.searchoperator({ usertype: 666, hdid: this.AddUserForm.value['hdid'] })
    console.log('list operator', this.operatortypelist)
  }
  async subdistributor() {
    this.subdistributortype = await this.operator.searchoperator({ usertype: 555, hdid: this.AddUserForm.value['hdid'], distid: this.AddUserForm.value['distid'] })
    console.log('list operator', this.subdistributortype)
  }



  changeclear(...data) {
    for (let i of data) {
      this.AddUserForm.controls[i].setValue("");
    }
  }

  typeclearcountry(val = "1") {
    this.changeclear('state', 'district', 'city', 'area');
  }


  typeclearstate(val = "1") {
    this.changeclear('district', 'city', 'area');
  }



  typecleardist(val = "1") {
    this.changeclear('city', 'area');
  }

  typeclearcity(val = "1") {
    this.changeclear('area');
  }



  clearValidation() {
    console.log('clear headend@@@@@@@@')
    this.AddUserForm.get('hdid').clearValidators();
    this.AddUserForm.get('hdid').updateValueAndValidity();
  }

  async getHeadend($event = '') {
    this.listhead = await this.headService.getHeadend({ like: $event })
  }



  createForm() {
    this.AddUserForm = this.fb.group({
      profileid: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      fullname: new FormControl('', Validators.required),
      hdid: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      phoneno: new FormControl('', [Validators.pattern('^[0-9]{10}$')]),
      pincode: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      area: new FormControl('', Validators.required),
      installation_addr: new FormControl('', Validators.required),
      billing_addr: new FormControl('', Validators.required),
      addsflag: new FormControl(true),
      prooftype: new FormControl('', Validators.required),
      proofno: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*]*[@]{1}[a-z A-Z]*[.]{1}[a-z A-Z]{2,3}")]),
      desc: new FormControl(''),
      lcoid: new FormControl(''),
      operator_profile: new FormControl(''),
      usertype: new FormControl('', Validators.required),
      distributercode: new FormControl(''),
      folino: new FormControl('',),
      business_name: new FormControl('', Validators.required),
      dist_or_sub_flg: new FormControl(1),
      distid: new FormControl(''),
      subdistid: new FormControl(''),
      lcocode: new FormControl(''),
      subcode: new FormControl(''),
      holderflg: new FormControl(true),
      tanno: new FormControl(''),
      gstno: new FormControl('', Validators.required),
      tinno: new FormControl(''),
      srvtaxno: new FormControl(''),
      panno: new FormControl(''),
      entertainmenttaxno: new FormControl(''),
      email2: new FormControl('', [Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*]*[@]{1}[a-z A-Z]*[.]{1}[a-z A-Z]{2,3}")]),
      taxpayby: new FormControl(1),
      hotel_share: new FormControl('',),
      mso_share: new FormControl(''),
      dist_share: new FormControl('',),
      sub_dist_share: new FormControl('',),
      lco_share: new FormControl(''),
      postalregno: new FormControl(''),
      subscription_start_date: new FormControl(''),
      subscription_end_date: new FormControl(''),
      enablestatus: new FormControl(true),
      op_profile: new FormControl(''),
    },
      {
        validators: sumValidator(100, 'mso_share', 'lco_share', 'dist_share', 'sub_dist_share', 'hotel_share')
      }

    );
  }


  get ctrl() {
    return this.AddUserForm.controls
  }
  get val() {
    return this.AddUserForm.value
  }

}





