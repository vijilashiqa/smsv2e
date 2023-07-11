import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BroadcasterService, CountryService, HeadendService, RoleservicesService } from '../../_services/index';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { id } from '@swimlane/ngx-charts';
import { OperatorService } from '../../_services/operator.service';
import { sumValidator } from '../../_services/validator_service';


@Component({
  selector: 'ngx-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  @ViewChild('tab') tab: any;
  @ViewChildren('input') input: QueryList<ElementRef>;
  filter; distributer: any = [];
  s_distributer: any = [];
  edituser;

  submit: boolean
  loc: any = []; branch: any = []; head: any = []; profile: any = [];
  state: any = []; district: any = []; city: any = []; id; disabled = false; editable: boolean = false;
  showtextf
  pincode: any = []; area: any = []; liststate; listarea; editflag; getstates; dist; citylist; operatortypelist; getlistlco; getlistcount;
  nodes = []; User; LocandBranch; keyword = 'name'; listcountry; count; listhead; listbroadaterr; result; subdistributortype;
  editdata: any; showtext: string = '';
  distShareShow = false; subdistshare = false;
  constructor(private country: CountryService,
    private headService: HeadendService,
    private broadcast: BroadcasterService,
    private toast: ToastrService,
    private route: Router,
    private aRoute: ActivatedRoute,
    private fb: FormBuilder,
    public role: RoleservicesService,
    private operator: OperatorService
  ) { }

  async ngOnInit() {
    this.id = this.aRoute.snapshot.queryParams.id;
    this.createForm();
    this.getCountry();
    if (this.role.getroleid() > 777) {
      this.getHeadend();
      {
        this.edituser.get('hdid').setValue(this.role.getheadend());
        this.getCountry();
      }
    }
    this.edit();

  }


  async edit() {
    this.editdata = await this.operator.geteditoperator({ id: this.id })
    this.createForm();
    this.disabled = !this.disabled;
    this.clearValidation();
    this.getCountry();
    this.getstate();
    this.getdistrict()
    this.getcity();
    this.getarea();
    this.listoperator();
    this.subdistributor();
  }



  showShare() {
    this.distShareShow = false;
    this.subdistshare = false;
    const [show_flag] = this.getlistcount.filter(({ id }) => this.val['lcoid'] == id).map(item => item.dist_or_sub_flg)
    if (show_flag == 2) this.distShareShow = !this.distShareShow;
    if (show_flag == 3) this.subdistshare = !this.subdistshare;
  }
  async edituserf() {
    this.submit = true;
    console.log('add...', this.val);
    const invalid = [];
    const control = this.ctrl
    for (const name in control) {
      if (control[name].invalid) {
        invalid.push(name);
      }
    }
    if (this.edituser.invalid) {
      console.log('Invalid value -----', invalid);
      window.alert('Please fill mandatory fields');
      return;
    }
    let method = this.id ? 'editoperator' : 'addoperator'
    this.edituser.value['enablestatus'] = this.edituser.value['enablestatus'] == true ? 1 : 0;
    if (this.id) this.edituser.value['id'] = this.id
    let result = await this.operator[method](this.edituser.value)
    if (result && result[0].err_code == 0) {
      this.toast.success(result[0]['msg']);
      this.route.navigate(['/pages/users/userlist'])
    } else {
      this.toast.warning(result[0]['msg'])
      console.log('add...', this.val);
    }

  }


  async listoperator() {
    this.operatortypelist = await this.operator.searchoperator({ usertype: 666, hdid: this.edituser.value['hdid'] })
    console.log('list operator', this.operatortypelist)
  }
  async subdistributor() {
    this.subdistributortype = await this.operator.searchoperator({ usertype: 555, hdid: this.edituser.value['hdid'], distid: this.edituser.value['distid'] })
    console.log('list operator', this.subdistributortype)
  }
  taxpayby() {
    this.edituser.get('gstno').clearValidators();
    this.edituser.get('panno').clearValidators();
    if (this.edituser.value["usertype"] != 333 && this.edituser.value["taxpayby"] == 2) {
      this.edituser.get('gstno').setValidators([Validators.required]);
      this.edituser.get('panno').setValidators([Validators.required]);
    }
    this.edituser.get('gstno').updateValueAndValidity();
    this.edituser.get('panno').updateValueAndValidity();
  }

  operatortype() {
    this.edituser.get('business_name').clearValidators();
    this.edituser.get('distributercode').clearValidators();
    this.edituser.get('dist_or_sub_flg').clearValidators();
    this.edituser.get('distid').clearValidators();
    this.edituser.get('subdistributername').clearValidators();
    this.edituser.get('lcocode').clearValidators();
    this.edituser.get('subcode').clearValidators();
    this.edituser.get('folino').clearValidators();
    this.edituser.get('subscription_start_date').clearValidators();
    this.edituser.get('subscription_end_date').clearValidators();
    let op = parseInt(this.edituser.value["usertype"]),
      dist_or_sub_flg = this.edituser.value['dist_or_sub_flg'],
      share = this.edituser.value["Share_holder"];
    if (op != 333 && op != 666 && !share) {
      this.edituser.get('folino').setValidators([Validators.required]);
    }
    switch (op) {
      case 1:
        this.edituser.get('subscription_start_date').setValidators([Validators.required]);
        this.edituser.get('subscription_end_date').setValidators([Validators.required]);
        this.edituser.get('business_name').setValidators([Validators.required]);
        this.edituser.get('dist_or_sub_flg').setValidators([Validators.required]);
        if (dist_or_sub_flg == 2) {
          this.edituser.get('distid').setValidators([Validators.required]);
        }
        else if (dist_or_sub_flg == 3) {
          this.edituser.get('distid').setValidators([Validators.required]);
          this.edituser.get('subdistributername').setValidators([Validators.required]);
        }
        this.edituser.get('lcocode').setValidators([Validators.required]);
        this.edituser.get('folino').setValidators([Validators.required]);
        break;
      case 2:
        this.edituser.get('business_name').setValidators([Validators.required]);
        this.edituser.get('distributercode').setValidators([Validators.required]);
        this.edituser.get('folino').setValidators([Validators.required]);

        break;
      case 3:
        this.edituser.get('business_name').setValidators([Validators.required]);
        this.edituser.get('distid').setValidators([Validators.required]);
        this.edituser.get('subcode').setValidators([Validators.required]);
        this.edituser.get('folino').setValidators([Validators.required]);
        this.edituser.get('distid').setValidators([Validators.required]);
        break;
      case 4:
        this.edituser.get('business_name').setValidators([Validators.required]);
        this.edituser.get('broadcastername').setValidators([Validators.required]);
        break;
    }
    this.edituser.get('subscription_end_date').updateValueAndValidity();
    this.edituser.get('subscription_start_date').updateValueAndValidity();
    this.edituser.get('business_name').updateValueAndValidity();
    this.edituser.get('broadcastername').updateValueAndValidity();
    this.edituser.get('distributercode').updateValueAndValidity();
    this.edituser.get('dist_or_sub_flg').updateValueAndValidity();
    this.edituser.get('distid').updateValueAndValidity();
    this.edituser.get('subdistributername').updateValueAndValidity();
    this.edituser.get('lcocode').updateValueAndValidity();
    this.edituser.get('subcode').updateValueAndValidity();
    this.edituser.get('folino').updateValueAndValidity();
  }

  folio() {
    this.edituser.value["Share_holder"] ? this.edituser.get('folino').clearValidators() : this.edituser.get('folino').setValidators([Validators.required])
    this.edituser.get('folino').updateValueAndValidity();
  }
  async getCountry($event = '') {
    console.log('Country Event----', $event);
    this.count = await this.country.listcountry({ like: $event });
    console.log('country', this.count);
  }

  async getstate($event = '') {
    console.log('get state  calling-----', this.edituser.value['country']);
    this.getstates = await this.country.liststate({ country_fk: this.edituser.value['country'], like: $event });
  }
  async getdistrict($event = '') {
    console.log('dist', $event);
    console.log('get distric  calling-----', this.edituser.value['state']);
    this.dist = await this.country.listdistrict({ state_fk: this.edituser.value['state'], like: $event });
    console.log('Get district data', this.dist);

  }
  async getcity($event = '') {
    console.log('city...........', $event);
    console.log('get distric  calling-----', this.edituser.value['district']);
    this.citylist = await this.country.listcity({ district_id: this.edituser.value['district'] });
    console.log('city *****', this.citylist)
  }
  async getarea($event = '') {
    this.listarea = await this.country.listarea({ city_id: this.edituser.value['city'] });
    console.log('area', this.listarea)
  }



  sharechange() {
    this.edituser.get('lco_share').setValue('');
    this.edituser.get('mso_share').setValue('');
    this.edituser.get('dist_share').setValue('');
    this.edituser.get('sub_dist_share').setValue('');
    this.edituser.get('hotel_share').setValue('');

  }
  async listlco() {

    this.getlistlco = await this.operator.getlcocode({ hdid: this.edituser.value['hdid'] });
    this.getlistcount = this.getlistlco[0];
    console.log("lcocde **********88", this.getlistcount);

  }
  changeclear(...data) {
    for (let i of data) {
      this.edituser.controls[i].setValue("");
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
    this.edituser.get('password').clearValidators();
    this.edituser.get('password').updateValueAndValidity();
  }

  Validatorsshare() {
    let clear = this.edituser.value["holderflg"];
    console.log("clear validate", clear);
    if (clear == true) {
      this.edituser.get("folino").clearValidators();
      this.edituser.get("folino").updateValueAndValidity();
    } else {
      this.edituser.get("folino").setValidators([Validators.required]);
      this.edituser.get("folino").updateValueAndValidity();
    }
  }



  async getHeadend($event = '') {

    this.listhead = await this.headService.getHeadend({ like: $event })
    console.log(this.listhead)
  }
  createForm() {
    this.edituser = this.fb.group({
      profileid: new FormControl(this.editdata?.profileid || '', Validators.required),
      password: new FormControl('', Validators.required),
      fullname: new FormControl(this.editdata?.fullname || '', Validators.required),
      hdid: new FormControl(this.editdata?.hdid || '', Validators.required),
      dob: new FormControl(this.editdata?.dob?.slice(0, 10) || '', Validators.required),
      gender: new FormControl(this.editdata?.gender || '', Validators.required),
      mobile: new FormControl(this.editdata?.mobile || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      phoneno: new FormControl(this.editdata?.phoneno || '', [Validators.pattern('^[0-9]{10}$')]),
      pincode: new FormControl(this.editdata?.pincode || '', Validators.required),
      country: new FormControl(this.editdata?.country || '', Validators.required),
      state: new FormControl(this.editdata?.state || '', Validators.required),
      district: new FormControl(this.editdata?.district || '', Validators.required),
      city: new FormControl(this.editdata?.city || '', Validators.required),
      area: new FormControl(this.editdata?.area || '', Validators.required),
      installation_addr: new FormControl(this.editdata?.installation_addr || '', Validators.required),
      billing_addr: new FormControl(this.editdata?.billing_addr || '', Validators.required),
      addsflag: new FormControl(true),
      prooftype: new FormControl(this.editdata?.prooftype || '', Validators.required),
      proofno: new FormControl(this.editdata?.proofno || '', Validators.required),
      email: new FormControl(this.editdata?.email1 || '', [Validators.required, Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*]*[@]{1}[a-z A-Z]*[.]{1}[a-z A-Z]{2,3}")]),
      desc: new FormControl(this.editdata?.descs || ''),
      lcoid: new FormControl(this.editdata?.lcoid || ''),
      operator_profile: new FormControl(this.editdata?.operator_profile || ''),
      usertype: new FormControl(this.editdata?.usertype || '', Validators.required),
      distributercode: new FormControl(this.editdata?.lcocode || ''),
      folino: new FormControl(this.editdata?.foliono || '',),
      business_name: new FormControl(this.editdata?.business_name || '', Validators.required),
      dist_or_sub_flg: new FormControl(this.editdata?.dist_or_sub_flg),
      distid: new FormControl(this.editdata?.distid || ''),
      subdistid: new FormControl(this.editdata?.subdistid || ''),
      lcocode: new FormControl(this.editdata?.lcocode || ''),
      subcode: new FormControl(this.editdata?.lcocode || ''),
      holderflg: new FormControl(this.editdata ? this.editdata['holderflg'] == 1 ? true : false : true),
      tanno: new FormControl(''),
      gstno: new FormControl(this.editdata?.gstno || ''),
      tinno: new FormControl(''),
      srvtaxno: new FormControl(''),
      panno: new FormControl(this.editdata?.panno || ''),
      entertainmenttaxno: new FormControl(''),
      email2: new FormControl(this.editdata?.email2 || '', [Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*]*[@]{1}[a-z A-Z]*[.]{1}[a-z A-Z]{2,3}")]),
      taxpayby: new FormControl(1),
      hotel_share: new FormControl(this.editdata?.hotel_share || '',),
      mso_share: new FormControl(this.editdata?.mso_share || ''),
      dist_share: new FormControl(this.editdata?.dist_share || '',),
      sub_dist_share: new FormControl(this.editdata?.sub_dist_share || '',),
      lco_share: new FormControl(this.editdata?.lco_share || ''),
      postalregno: new FormControl(this.editdata?.postalregno || ''),
      subscription_start_date: new FormControl(this.editdata?.subscrip_start_date?.slice(0, 10) || ''),
      subscription_end_date: new FormControl(this.editdata?.subscrip_end_date?.slice(0, 10) || ''),
      enablestatus: new FormControl(this.editdata ? this.editdata['enablestatus'] == 1 ? true : false : true),
      op_profile: new FormControl(''),
    },
      {
        validators: sumValidator(100, 'mso_share', 'lco_share', 'dist_share', 'sub_dist_share', 'hotel_share')
      }

    );
  }


  get ctrl() {
    return this.edituser.controls
  }
  get val() {
    return this.edituser.value
  }

}





