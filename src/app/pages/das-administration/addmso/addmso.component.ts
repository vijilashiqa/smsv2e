// import { Component, OnInit } from '@angular/core';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BroadcasterService, CountryService, HeadendService, RoleservicesService } from '../../_services/index';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { OperatorService } from '../../_services/operator.service';
import { sumValidator } from '../../_services/validator_service';
@Component({
  selector: 'ngx-addmso',
  templateUrl: './addmso.component.html',
  styleUrls: ['./addmso.component.scss']
})
export class AddmsoComponent implements OnInit {
  @ViewChild('tab') tab: any;
  @ViewChildren('input') input: QueryList<ElementRef>;
  filter; distributer: any = [];
  s_distributer: any = [];
  AddMsoForm;

  submit: boolean
  loc: any = []; branch: any = []; head: any = []; profile: any = [];
  state: any = []; district: any = []; city: any = []; id; disabled = false; showtextf
  pincode: any = []; area: any = []; liststate; listarea; editflag; getstates; dist; citylist; operatortypelist; getlistlco; getlistcount;
  nodes = []; User; LocandBranch; keyword = 'name'; listcountry; count; listhead; listbroadaterr; result; subdistributortype;
  editable: boolean = false; editdata: any; showtext: string = '';
  distShareShow = false; subdistshare = false;
  constructor(private country: CountryService,
    private headService: HeadendService,
    // private broadcast: BroadcasterService,
    private toast: ToastrService,
    private route: Router,
    private aRoute: ActivatedRoute,
    private fb: FormBuilder,
    public role: RoleservicesService,
    private operator: OperatorService
  ) { }

  async ngOnInit() {
    this.id = this.aRoute.snapshot.queryParams.id;
    await this.createForm();
    if (this.role.getroleid() > 777) {
      await this.getHeadend();
    } else {
      this.AddMsoForm.get('hdid').setValue(this.role.getheadend());
    }
   await this.getCountry();
    if (this.id) {
      this.disabled = !this.disabled;
      await this.edit();
      this.clearValidation();
      this.getCountry();
      this.getstate();
      this.getdistrict()
      this.getcity();
      this.getarea();
      this.getHeadend();
      // this.listlco();
    }
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
    if (this.AddMsoForm.invalid) {
      window.alert('Please fill mandatory fields');
      return;
    }
    let method = this.id ? 'editoperator' : 'addoperator'
    this.AddMsoForm.value['enablestatus'] = this.AddMsoForm.value['enablestatus'] == true ? 1 : 0;
    if (this.id) this.AddMsoForm.value['id'] = this.id
    let result = await this.operator[method](this.AddMsoForm.value)
    if (result && result[0].err_code == 0) {
      this.toast.success(result[0]['msg']);
      this.route.navigate(['/pages/das-administration/listmso'])
    } else {
      this.toast.warning(result[0]['msg'])
    }

  }

  async edit() {
    this.editdata = await this.operator.geteditoperator({ id: this.id })
    console.log('edit data @@@@@@@@@@@',this.editdata)
    this.createForm();
  }

  Validatorsshare() {
    let clear = this.AddMsoForm.value["holderflg"];
    if (clear == false) {
      this.AddMsoForm.get("folino").clearValidators();
      this.AddMsoForm.get("folino").updateValueAndValidity();
    } else {
      this.AddMsoForm.get("folino").setValidators([Validators.required]);
      this.AddMsoForm.get("folino").updateValueAndValidity();
    }


  }


  async getCountry($event = '') {
    this.count = await this.country.listcountry({ like: $event });
  }

  async getstate($event = '') {
    this.getstates = await this.country.liststate({ country_fk: this.AddMsoForm.value['country'], like: $event });
  }
  async getdistrict($event = '') {
    this.dist = await this.country.listdistrict({ state_fk: this.AddMsoForm.value['state'], like: $event });

  }
  async getcity($event = '') {
    this.citylist = await this.country.listcity({ district_id: this.AddMsoForm.value['district'] });
  }
  async getarea($event = '') {
    this.listarea = await this.country.listarea({ city_id: this.AddMsoForm.value['city'] });
  }


  // async listlco() {

  //   this.getlistlco = await this.operator.getlcocode({ hdid: this.AddMsoForm.value['hdid'] });
  //   this.getlistcount = this.getlistlco[0];
  // }


  changeclear(...data) {
    for (let i of data) {
      this.AddMsoForm.controls[i].setValue("");
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
    this.AddMsoForm.get('password').clearValidators();
    this.AddMsoForm.get('password').updateValueAndValidity();
  }

  async getHeadend($event = '') {

    this.listhead = await this.headService.getHeadend({ like: $event })
  }



  createForm() {
    this.AddMsoForm = new FormGroup({
      profileid: new FormControl(this.editdata?.profileid || '', Validators.required),
      password: new FormControl( '', Validators.required),
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
      email: new FormControl(this.editdata?.email1 ||'', [Validators.required, Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*]*[@]{1}[a-z A-Z]*[.]{1}[a-z A-Z]{2,3}")]),
      desc: new FormControl(this.editdata?.descs || ''),
      usertype: new FormControl(this.editdata?.usertype || '', Validators.required),
      folino: new FormControl(this.editdata?.foliono || ''),
      business_name: new FormControl(this.editdata?.business_name || '', Validators.required),
      distid: new FormControl(''),
      lcocode: new FormControl(this.editdata?.lcocode || '', Validators.required),
      holderflg: new FormControl(this.editdata ? this.editdata['holderflg'] == 1 ? true : false: true),
      gstno: new FormControl(this.editdata?.gstno || '', Validators.required),
      email2: new FormControl(this.editdata?.email2 || '', [Validators.required, Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*]*[@]{1}[a-z A-Z]*[.]{1}[a-z A-Z]{2,3}")]),
      postalregno: new FormControl(this.editdata?.postalregno || '', Validators.required),
      enablestatus: new FormControl(true),
    },
      
    );
  }


  get ctrl() {
    return this.AddMsoForm.controls
  }
  get val() {
    return this.AddMsoForm.value
  }

}


