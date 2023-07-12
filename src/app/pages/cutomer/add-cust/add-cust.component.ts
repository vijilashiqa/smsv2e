import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryService, HeadendService, RoleservicesService } from '../../_services/index';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriberService } from '../../_services/subscriber.service';
import { Md5 } from 'ts-md5';
import * as JSXLSX from 'xlsx';
import { DomSanitizer } from '@angular/platform-browser';
import { ErrormsgComponent } from '../../channelcategory/errormsg/errormsg.component';
import { StbmanagementService } from '../../_services/stbmanagement.service';
@Component({
  selector: 'ngx-add-cust',
  templateUrl: './add-cust.component.html',
  styleUrls: ['./add-cust.component.scss']
})
export class AddCustComponent implements OnInit {
  submit: boolean; stbdet: any = []; file: any; failure: any = [];
  AddCustForm; opt: any = []; arrayBuffer: any; imageURL: any; addressurl: any; idurl: any;
  loc: any = []; branch: any = []; head: any = []; but: any; disabled = false; p1: any;
  state: any = []; district = []; city: any = []; id; listhead; bulk: any = []; sameaddressandid = false;
  pincode: any = []; area = []; any = []; liststate; listarea; bulkmeta: any = []; addressselectedfile: File = null;
  editflag; getstates; dist; editdata; citylist; count; editable: boolean = false; idselectedfile: File = null;
  bulkopt = false; bulkdata = []; s = 0; f = 0; getoperatorlist; getboxlist; getboxeditl; selectedfile: File = null;
  constructor(private country: CountryService,
    private headend: HeadendService,
    private toast: ToastrService,
    private router: Router,
    public role: RoleservicesService,
    private domSanitizer: DomSanitizer,
    private subscribers: SubscriberService,
    private aRoute: ActivatedRoute,
    private stbm :StbmanagementService,
    private modal: NgbModal,) {
    this.submit = false;
  }

  async ngOnInit() {
    this.id = this.aRoute.snapshot.queryParams.id;
    this.createForm();
    this.getCountry();
    if (this.role.getroleid() > 777) {
     this.getHeadend();
      } else {
        this.AddCustForm.get('hdid').setValue(this.role.getheadend());
        this.AddCustForm.get('userid').setValue(this.role.getoperator());
      }
    this.clearValidation();
  }



  handleFile(file: FileList) {
    this.selectedfile = file.item(0);

    if (this.selectedfile) {
      var reader = new FileReader();
      //  reader 
      reader.onload = (event: any) => {
        this.imageURL = this.domSanitizer.bypassSecurityTrustUrl(event.target.result)
      }
      reader.readAsDataURL(this.selectedfile);
    } else {
      this.imageURL = '';
    }
  }


  addresshandleFile(file: FileList) {
    this.addressselectedfile = file.item(0);
    if (this.addressselectedfile) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.addressurl = this.domSanitizer.bypassSecurityTrustUrl(event.target.result)
      }
      reader.readAsDataURL(this.addressselectedfile);
    } else {
      this.addressurl = '';
    }
  }


  idandleFile(file: FileList) {
    this.idselectedfile = file.item(0);
    if (this.idselectedfile) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.idurl = this.domSanitizer.bypassSecurityTrustUrl(event.target.result)
      }
      reader.readAsDataURL(this.idselectedfile);
    } else {
      this.idurl = '';
    }
  }


  metavalue() {
    this.bulkmeta = [
      {
        msg: "Please fill User Name",
        label: "User Name * ",
        assign_to: "profileid",
        required: true,
      },
      {
        msg: "Please fill CAF Number",
        label: "CAF Number *",
        assign_to: "cafno",
        required: true,
      },
      {
        msg: "Please fill First Name",
        label: "First Name *",
        assign_to: "fullname",
        required: true,
      },

      {
        msg: "Please fill Password",
        label: "Password *",
        assign_to: "password",
        required: true,
      },

      {
        msg: "Please fill Mobile Number",
        label: "Mobile Number *",
        assign_to: "mobile",
        required: true,
      },


      // {
      //   msg: "Please fill Proof Type",
      //   label: "Proof Type *",
      //   assign_to: "proof_type",
      //   required: true,
      // },


      {
        msg: "Please fill STB Number",
        label: "STB Number *",
        assign_to: "stb_no",
        required: true,
      },


      {
        msg: "Please fill Address",
        label: "Address *",
        assign_to: "installation_addr",
        required: true,
      },


      // {
      //   msg: "Please fill Proof ID",
      //   label: "Proof ID *",
      //   assign_to: "proof_id",
      //   required: true,
      // },

      {
        msg: "Please fill Email ID",
        label: "Email *",
        assign_to: "email",
        required: true,
      },

      {
        msg: "Please fill City",
        label: "City *",
        assign_to: "city",
        required: true,
      },
      {
        msg: "Please fill Area",
        label: "Area *",
        assign_to: "area",
        required: true,
      },
      {
        msg: "Please fill Pincode ",
        label: "Pincode *",
        assign_to: "pin_no",
        required: true,
      },
    ];
    return this.bulkmeta;
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
      let fileReader = new FileReader(),
        filedata;
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
  async addcustomer() {
    this.submit = true;
    const invalid = [];
    const control = this.AddCustForm.controls;
    for (const name in control) {
      if (control[name].invalid) {
        invalid.push(name);
      }
    }
    if (this.AddCustForm.invalid) {
      console.log("Invalid value -----", invalid);
      return;
    }
    if (!this.val["bulkopt"]) {
      let result = await this.subscribers.addsubscriber(this.AddCustForm.value)
      console.log("add...", result);
      if (result && result[0].err_code == 0 && !this.id) {
         const file = new FormData(),id = result[0]['id'] ,
         idProofType = this.AddCustForm.value['id_proof_type'],
         addProofType = this.AddCustForm.value['address_proof_type']
         if(this.AddCustForm.value['sameaddressandid'] == true)
         {
         file.append('file', this.selectedfile, id + '-' + 'CAF')
         file.append('file', this.addressselectedfile,id + '-' + 'AddressProof' )
         file.append('id', id)
         file.append('addressproof', addProofType)
        }
         else{
          file.append('file', this.selectedfile, id + '-' + 'CAF')
          file.append('file', this.addressselectedfile,id + '-' + 'AddressProof' )
          file.append('file', this.idselectedfile, id + '-' + 'IDproof')
          file.append('id', id)
          file.append('addressproof', addProofType)
          file.append('idproof', idProofType)
         }
        let logoresult = await this.subscribers.uploadfile(file)
        console.log('image result', logoresult)
        if (result && result[0].err_code == 0) {
          this.toast.success(result[0]["msg"]);
          this.router.navigate(["/pages/customer/cust-list"]);
        } else {
          this.toast.warning(result[0]["msg"]);
        }
      }
    }
    if (this.bulk.length && this.val["bulkopt"]) {
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
      }
      this.val["bulkdata"] = this.bulk;
      console.log("form", this.val);
      let resp = await this.subscribers.bulkaddsubscriber(this.AddCustForm.value)
      console.log("bulkResult????????????????? ", resp);
      let item=resp;
      this.Error(item)
      if (item && item[0].err_code == 0) {
        this.router.navigate(["/pages/customer/cust-list"]);
      } 
               console.log("error msg ",item)
  

    }
  }

  onSelectionChanged(value: any) {
    if (value.target.value === '2') {
      this.AddCustForm.get('img').disable();
    } else {
      this.AddCustForm.get('img').enable();
    }
  }


  Error(item ) {
    const modalRef = this.modal.open(ErrormsgComponent, { size: 'sm', container: 'nb-layout', backdrop: false });
    modalRef.componentInstance.title = 'Error List';
    modalRef.componentInstance.item = item;
    modalRef.result.then((data) => {
      ;

    })

  }


  async edit() {
    console.log('edit herer')
    this.editdata = await this.subscribers.editsubscriber({ custid: this.id });
    console.log('editdata .....', this.editdata)
  }


  bulkvalid() {
    let form = this.AddCustForm;
    form.get('dob').clearValidators();
    form.get('profileid').clearValidators();
    form.get('password').clearValidators();
    form.get('stb_no').clearValidators();
    form.get('cafno').clearValidators();
    form.get('fullname').clearValidators();
    form.get('mobile').clearValidators();
    form.get('pin_no').clearValidators();
    form.get('country').clearValidators();
    form.get('state').clearValidators();
    form.get('district').clearValidators();
    form.get('city').clearValidators();
    form.get('area').clearValidators();
    form.get('installation_addr').clearValidators();
    form.get('billing_addr').clearValidators();
    form.get('addressimg').clearValidators();
    form.get('proof_id').clearValidators();
    form.get('email').clearValidators();
    form.get('status1').clearValidators();
    form.get('idproofimg').clearValidators();
    form.get('id_proof_type').clearValidators();
    form.get('address_proof_type').clearValidators();
    form.get('img').clearValidators();
    if (!this.bulkopt) {
      form.get('profileid').setValidators(Validators.required);
      form.get('password').setValidators(Validators.required);
      form.get('stb_no').setValidators(Validators.required);
      form.get('cafno').setValidators(Validators.required);
      form.get('fullname').setValidators(Validators.required);
      form.get('mobile').setValidators([Validators.required, Validators.pattern('^[0-9]{10}$')]);
      form.get('pin_no').setValidators(Validators.required);
      form.get('country').setValidators(Validators.required);
      form.get('state').setValidators(Validators.required);
      form.get('district').setValidators(Validators.required);
      form.get('city').setValidators(Validators.required);
      form.get('area').setValidators(Validators.required);
      form.get('installation_addr').setValidators(Validators.required);
      form.get('billing_addr').setValidators(Validators.required);
      form.get('addressimg').setValidators(Validators.required);
      form.get('proof_id').setValidators(Validators.required);
      form.get('status1').setValidators(Validators.required);
      form.get('idproofimg').setValidators(Validators.required);
      form.get('id_proof_type').setValidators(Validators.required);
      form.get('address_proof_type').setValidators(Validators.required);
      form.get('img').setValidators(Validators.required);
      form.get('email').setValidators(Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*]*[@]{1}[a-z A-Z]*[.]{1}[a-z A-Z]{2,3}"));
    }
    form.get('profileid').updateValueAndValidity();
    form.get('password').updateValueAndValidity();
    form.get('stb_no').updateValueAndValidity();
    form.get('cafno').updateValueAndValidity();
    form.get('fullname').updateValueAndValidity();
    form.get('mobile').updateValueAndValidity();
    form.get('pin_no').updateValueAndValidity();
    form.get('country').updateValueAndValidity();
    form.get('state').updateValueAndValidity();
    form.get('district').updateValueAndValidity();
    form.get('city').updateValueAndValidity();
    form.get('area').updateValueAndValidity();
    form.get('installation_addr').updateValueAndValidity();
    form.get('billing_addr').updateValueAndValidity();
    form.get('addressimg').updateValueAndValidity();
    form.get('proof_id').updateValueAndValidity();
    form.get('email').updateValueAndValidity();
    form.get('status1').updateValueAndValidity();
   form.get('idproofimg').updateValueAndValidity();
   form.get('id_proof_type').updateValueAndValidity();
   form.get('address_proof_type').updateValueAndValidity();
   form.get('img').updateValueAndValidity();
   
  }
  async getCountry($event = '') {
    this.count = await this.country.listcountry({ like: $event });
  }
  async getstate($event = '') {
    this.getstates = await this.country.liststate({ country_fk: this.AddCustForm.value['country'], like: $event });
  }
  async getdistrict($event = '') {
    this.dist = await this.country.listdistrict({ state_fk: this.AddCustForm.value['state'], like: $event });
  }
  async getcity($event = '') {
    this.citylist = await this.country.listcity({ district_id: this.AddCustForm.value['district'] });
  }
  async getarea($event = '') {
    this.listarea = await this.country.listarea({ city_id: this.AddCustForm.value['city'] });
  }

  clearValidation() {
// console.log('fssdfdfdf',val)

    let clear =this.AddCustForm.value['sameaddressandid'];
    console.log('sdfsdfsaf',clear)
    if(clear == true)
    {
      this.AddCustForm.get('id_proof_type').clearValidators();
      this.AddCustForm.get('id_proof_type').updateValueAndValidity();
      this.AddCustForm.get('proof_id').clearValidators();
      this.AddCustForm.get('proof_id').updateValueAndValidity();
      this.AddCustForm.get('idproofimg').clearValidators();
      this.AddCustForm.get('idproofimg').updateValueAndValidity();
     
    }
    else
    {
      this.AddCustForm.get('id_proof_type').setValidators([Validators.required]);
      this.AddCustForm.get('id_proof_type').updateValueAndValidity();
      this.AddCustForm.get('proof_id').setValidators([Validators.required]);
      this.AddCustForm.get('proof_id').updateValueAndValidity();
      this.AddCustForm.get('idproofimg').setValidators([Validators.required]);
      this.AddCustForm.get('idproofimg').updateValueAndValidity();      
    }
 
  }


  changeclear(...data) {
    for (let i of data) {
      this.AddCustForm.controls[i].setValue("");
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
  typeclearopr() {
    this.changeclear('userid', 'stb_no')
  }
  async getHeadend($event = '') {
    this.listhead = await this.headend.getHeadend({ like: $event })
    console.log(this.listhead)
  }

  async getoperator(event ='') {
    if(this.AddCustForm.value ["hdid"]){
      this.getoperatorlist = await this.subscribers.getoperator({ hdid: this.AddCustForm.value['hdid'] , like : event})
      console.log("operator list ", this.getoperatorlist)
    }


  }
  async getbox() {
    this.getboxlist = await this.stbm.getbox({ hdid: this.AddCustForm.value['hdid'] , pairstatus : 0 , userid : this.AddCustForm.value['userid']})
    console.log('getbox', this.getboxlist)
  }
  async getboxedit() {
    if(this.AddCustForm.value["hdid"]){
      this.getboxeditl = await this.subscribers.getboxedit({ hdid: this.AddCustForm.value['hdid'] })
      console.log("getboxlistedir", this.getboxeditl)
    }

  }

  createForm() {
    this.AddCustForm = new FormGroup({
      userid: new FormControl(this.editdata?.userid || '', Validators.required),
      profileid: new FormControl(this.editdata?.profileid || '', Validators.required),
      password: new FormControl('', Validators.required),
      stb_no: new FormControl(this.editdata?.boxid || '',Validators.required),
      hdid: new FormControl(this.editdata?.hdid || '', Validators.required),
      cafno: new FormControl(this.editdata?.cafno || '', Validators.required),
      fullname: new FormControl(this.editdata?.fullname || '', Validators.required),
      dob: new FormControl(this.editdata?.dob?.slice(0, 10) || ''),
      mobile: new FormControl(this.editdata?.mobile || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      phone: new FormControl(this.editdata?.phone || ''),
      pin_no: new FormControl(this.editdata?.pin_no || '', Validators.required),
      country: new FormControl(this.editdata?.country || '', Validators.required),
      state: new FormControl(this.editdata?.state || '', Validators.required),
      district: new FormControl(this.editdata?.district || '', Validators.required),
      city: new FormControl(this.editdata?.city || '', Validators.required),
      area: new FormControl(this.editdata?.area || '', Validators.required),
      installation_addr: new FormControl(this.editdata?.installation_addr || '', Validators.required),
      billing_addr: new FormControl(this.editdata?.billing_addr || '', Validators.required),
      same_addr: new FormControl(true),
      addressimg: new FormControl('', Validators.required),
      idproofimg: new FormControl(''  , Validators.required),
      status1: new FormControl(this.editdata?.status1 || '', Validators.required),
      id_proof_type: new FormControl(this.editdata?.id_proof_type || '',Validators.required ),
      proof_id: new FormControl(this.editdata?.proof_id || '',Validators.required ),
      address_proof_type: new FormControl(this.editdata?.address_proof_type || '', Validators.required),
      email: new FormControl(this.editdata?.email || '', [Validators.required, Validators.pattern("[0-9 A-Z a-z ,.`!@#$%^&*]*[@]{1}[a-z A-Z]*[.]{1}[a-z A-Z]{2,3}")]),
      descr: new FormControl(this.editdata?.descr || ''),
      bulk: new FormControl(''),
      img: new FormControl({ value: "", disabled: false }, [Validators.required]),
      bulkopt: new FormControl(false),
      sameaddressandid: new FormControl(false),
    });
  }
  get ctrl() {
    return this.AddCustForm.controls
  }
  get val() {
    return this.AddCustForm.value
  }
}



