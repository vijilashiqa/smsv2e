import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HeadendService, BroadcasterService, ChannelService, PackageService, RoleservicesService } from '../../_services';
import { toJS } from "mobx";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ITreeOptions } from '@circlon/angular-tree-component';
import { PackagechannelComponent } from '../packagechannel/packagechannel.component';
@Component({
  selector: 'ngx-editpackage',
  templateUrl: './editpackage.component.html',
  styleUrls: ['./editpackage.component.scss']
})
export class EditpackageComponent implements OnInit {
  @ViewChild('tree') public tree;
  cas: any = []; searchalcart: string; searchaddon: string;
  searchbase: string; baseBack = ''; listhead; listbroadaterr
  opt: any = []; loc: any = []; branch: any = []; package; listver
  nodes: any = []; Getchannel; broadcaster: any = []; listhdcas
  bpack: any = ''; addonpack: any = ''; alacartepack: any = ''; prodid: any = '';
  submit: boolean; casdata; getbundle; id; editdata; addonpackids;
  EditPackageForm; modalRef: BsModalRef; checckbundle: any = ''; editprot
  addpackagevalues; disable = true; valueshow = false; isDisabled: boolean = true;

  treeOptions: ITreeOptions = {
    useCheckbox: true
  };

  constructor(private _fb: FormBuilder, private headend: HeadendService, private toast: ToastrService,
    private broadcast: BroadcasterService,
    private channel: ChannelService,
    private packageser: PackageService,
    private modal: NgbModal,
    private route: Router,
    private aRoute: ActivatedRoute,
    public role: RoleservicesService,

  ) { }

  async ngOnInit() {
    await this.createForm();
   
    this.id = this.aRoute.snapshot.queryParams['id'];
    if (this.role.getroleid() > 777 ) {
        this.getHeadend();
    }else
    {
      this.EditPackageForm.get('hdid').setValue(this.role.getheadend());
      // this.getblundledata();
    }
    await this.edit();
    this.getcas();
  }
  async getcas($event = '') {
    this.listhdcas = await this.headend.listHdcas({ like: $event })
    this.listhdcas = this.casdata = this.listhdcas[0]
  }
  async edit() {
    this.editdata = await this.packageser.editdatapackage({ packid: this.id });
    console.log('edit package data @@@@@@@', this.editdata)
    this.checckbundle = '[' + this.editdata['bundlepack'] + ']';
    console.log("include the checkbundle@@@@@@@@@@@@@@@@@@@",this.checckbundle)
    await this.editproduct();
    await  this.getblundledata();
    this.getbroadcaster();
    if (this.editdata['packtype'] != 3) { this.getchannel(); }
    this.bundleedit();

  }
  bundleedit() {
    if (this.bpack) {
      let [basePackId] = this.bpack.filter(item => this.checckbundle.includes(item.packid)).map(item => item.packid)
      console.log(' 1 include the value',this.bpack.filter(item => this.checckbundle.includes(item.packid)));
      console.log(' 2 include the value',this.bpack.filter(item => this.checckbundle.includes(item.packid)).map(item => item.packid))
      this.baseBack = basePackId
      this.addonpack.filter(item => item.state = this.checckbundle.includes(item.packid))
      console.log('add on pack ',this.addonpack)
      this.alacartepack.filter(item => item.state = this.checckbundle.includes(item.packid))
      console.log('chack bundl data', this.alacartepack)

    }
  }


  async getbroadcaster() {
    this.listbroadaterr = await this.broadcast.listbroadcaster({ hdid: this.val['hdid'] })
    this.listbroadaterr = this.listbroadaterr[0]
  }


  checkaddonpack(checked) {
    console.log('checked the add on pack',checked)
    this.addonpack.forEach(x => x.state = checked)
  }
  checkalpack(checked) {
    console.log('checked the alla cart pack',checked)
    this.alacartepack.forEach(x => x.state = checked)
  }


  async editproduct() {
    this.editprot = await this.packageser.getproductid({ packid: this.id })
    this.listver = this.editprot[0];
    console.log('product list@@@@@@@@@@@@@@@@', this.listver);
    await this.createForm();
  }



  async getchannel() {
    if (this.EditPackageForm.value['packtype'] != 3) {
      let result = await this.channel.getchannel_for_pack({ hdid: this.EditPackageForm.value['hdid'], bcid: this.EditPackageForm.value['bcid'] }).toPromise()
      if (result) {
        this.Getchannel = result;

        let temp = [], temp1 = [];
        let total = result['length'];
        // console.log(';length @@@@@@@@@@@%%%%%%%', total)
        for (var i = 0; i < total; i++) {
          let lang = result[i]['langname'];
          let genre, channel = [];

          for (var j = i; j < total; j++) {

            if (lang == result[j]['langname']) {
              genre = result[j]['genrename']

              for (var k = j; k < total; k++) {

                if (k == total - 1 && (result[k]['genrename'] == genre && lang == result[k]['langname'])) {
                  temp.push({ name: genre, children: channel });
                  j = k;
                  i = k;
                }
                if (result[k]['genrename'] == genre && lang == result[k]['langname']) {
                  channel.push({ name: result[k]['channame'], id: result[k]['chanid'] })
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
          temp = []
        }


        this.nodes = temp1
        this.tree.treeModel.update();
      }

      setTimeout(() => {
        if (this.EditPackageForm.value['packtype'] != 3) {
          this.selectnodes();
        }
      }, 1000);

    }

  }
  selectnodes() {
    if (this.EditPackageForm.value['packtype'] != 3) {
      let chanids = '[' + this.editdata['channelid'] + ']'
    console.log('cannel idsin select node', this.editdata['channelid'])
    if(this.editdata['channelid'] != null){
      let channel = JSON.parse(chanids);
      for (var i = 0; i < channel.length; ++i) {
        let leaf = this.tree.treeModel.getNodeById(JSON.parse(channel[i]))
        if (leaf)
          leaf.setIsSelected(true);
      }
    }
  }
}


ClearHeadend(){

  this.EditPackageForm.controls.bcid.setValue("");

}


  selectednodes() {
    if (this.EditPackageForm.value['packtype'] != 3) {
      const selectedNodes = [];
      Object.entries(toJS(this.tree.treeModel.selectedLeafNodeIds)).forEach(([key, value]) => {
        // console.log(key, value);
        if (value === true) {
          selectedNodes.push(parseInt(key));
        }
      });
      return (selectedNodes);
    }
  }

  getnode() {
    const snode = this.selectednodes()
    // console.log('node length', snode.length);
  }

  taxcontrol() {
    let clear = this.EditPackageForm.value["enable_tax"];
    console.log("enable_tax", clear);
    if (clear == false) {
      this.EditPackageForm.get("tax_type").clearValidators();
      this.EditPackageForm.get("tax_type").updateValueAndValidity();
    } else {
      this.EditPackageForm.get("tax_type").setValidators([Validators.required]);
      this.EditPackageForm.get("tax_type").updateValueAndValidity();
    }
  }



  get serviceid(): FormArray {
    return this.EditPackageForm.get('serviceid') as FormArray;
  }

  createserviceid(id: number, name: string, product: string = ''): FormGroup {

    console.log("create data",name , "product id",product )
    return this._fb.group({
      productid: [{ value: product || '', disabled: product ? true : false }, Validators.required],
      casid: [name, Validators.required],
      id: [id, Validators.required],
    });
  }


  channels(item) {
    const modalRef = this.modal.open(PackagechannelComponent, { size: 'sm', container: 'nb-layout', backdrop: false });
    modalRef.componentInstance.modalHeader = 'Channel List';
    modalRef.componentInstance.item = item;
    //modalRef.result.then((data) => {})
  }

  async addPack() {
    console.log('value', this.EditPackageForm.value.serviceid, 'list', this.listver);
    let checkaddonpack = this.addonpack.filter(item => item.state).map(item => item.packid),
    checkalacatepack = this.alacartepack.filter(item => item.state).map(item => item.packid);
    const nodeselected = this.selectednodes();
    console.log('node selected', nodeselected)
    if (this.EditPackageForm.value['packtype'] != 3 && nodeselected.length == 0) {
      this.toast.warning('Please Select Channel');
      return;
    } else if (this.EditPackageForm.value['packtype'] == 1 && nodeselected.length != 1) {
      this.toast.warning('Please Select Only One Channel');
      return;
    }
    this.EditPackageForm.value.serviceid = this.EditPackageForm.value.serviceid.filter(obj1 => !this.listver.find(obj2 => obj1.id === obj2.casid) && obj1.productid != '');
    console.log('value****', this.EditPackageForm.value.serviceid);
    this.EditPackageForm.value['channel'] = nodeselected;
    this.EditPackageForm.value['packid'] = this.id;
    this.EditPackageForm.value.package = [...checkaddonpack, ...checkalacatepack, this.baseBack];
    console.log('package length@@@@@@@@@@@@@@',this.baseBack);
    if (this.EditPackageForm.value["packtype"] == 3 && this.baseBack == "") {
      this.toast.warning('Please Select Any One Base Package');
      return;
    }
    this.EditPackageForm.value['status'] = this.EditPackageForm.value['status'] == true ? 1 : 0;
     let ser = this.EditPackageForm.value.serviceid;
     console.log("entered data",ser.length)
     let res1 =this.listver
    console.log("length value @@@",res1.length)
    if ( ser.length == 0  && res1.length == 0  && this.EditPackageForm.value["packtype"] != 3) {
      this.toast.warning("Please Fill Any One Product ID");
      return;
    }
    this.addpackagevalues = await this.packageser.editpackage(this.EditPackageForm.value)
    if (this.addpackagevalues && this.addpackagevalues[0].err_code == 0) {
      this.toast.success(this.addpackagevalues[0]['msg']);
      this.route.navigate(['/pages/channelcategory/packagelist'])
    } else {
      this.toast.warning(this.addpackagevalues[0]['msg'])
      console.log('Updated Data...', this.EditPackageForm.value);
    }
  }
  async getHeadend($event = '') {
    this.listhead = await this.headend.getHeadend({ like: $event })
  }


  shareb() {
    console.log("dfgdfgdsfg share fggdfgff")
    if (this.EditPackageForm.value["packtype"] = 3) {
      this.EditPackageForm.get('bcid').setValue('');
      this.EditPackageForm.get('broadcaster_share').setValue('');
    }
  }



// packages()
// {
//   console.log('package i s herer ')
// if(this.EditPackageForm.value["packtype"] = 1 ){
//   this.EditPackageForm.value.package.setValue('');
// }


// }


  clearValidation() {
    let clear = (this.EditPackageForm.value["packtype"] = 3);
    if (clear == 3) {
      this.EditPackageForm.get("bcid").clearValidators();
      this.EditPackageForm.get("bcid").updateValueAndValidity();
      this.EditPackageForm.get("broadcaster_share").clearValidators();
      this.EditPackageForm.get("broadcaster_share").updateValueAndValidity();
    } else {
      this.EditPackageForm.get("bcid").setValidators([Validators.required]);
      this.EditPackageForm.get("bcid").updateValueAndValidity();
      this.EditPackageForm.get("broadcaster_share").setValidators([
        Validators.required,
      ]);
      this.EditPackageForm.get("broadcaster_share").updateValueAndValidity();
    }
  }



  async getblundledata() {
    if (this.EditPackageForm.value["packtype"] = 3) {
      this.getbundle = await this.packageser.listbundlepack({ hdid: this.EditPackageForm.value['hdid'] })
      this.getbundle = this.getbundle[0];
      if (this.getbundle) {
        this.package = this.getbundle;
        this.bpack = this.package.filter(item => item.packtype == 0);
        this.addonpack = this.package.filter(item => item.packtype == 2);
        this.alacartepack = this.package.filter(item => item.packtype == 1);
      }
    }
  }

  createForm() {
    this.EditPackageForm = this._fb.group({
      packname: new FormControl(this.editdata?.packname || '', Validators.required),
      bcid: new FormControl(this.editdata?.bcid || '', Validators.required),
      srvtype: new FormControl(this.editdata?.srvtype.toString() || '', Validators.required),
      tax_type: new FormControl(this.editdata?.tax_type.toString() || '', Validators.required),
      hdid: new FormControl(this.editdata?.hdid || '', Validators.required),
      status: new FormControl(this.editdata?.status || '',),
      enable_tax: new FormControl(this.editdata?.enable_tax),
      packtype: new FormControl(this.editdata?.packtype.toString(), Validators.required),
      broadcaster_share: new FormControl(this.editdata?.bcshare || '', [Validators.required, Validators.max(100)]),
      bcamt: new FormControl(this.editdata?.bcamt || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      serviceid: new FormArray([
        this.createserviceid(1, 'Gospell', this.getProductInfo(1)),
        this.createserviceid(2, 'Secure Tv', this.getProductInfo(2)),
        this.createserviceid(3, 'Safeview', this.getProductInfo(3)),
        this.createserviceid(4, 'Gospell ADV', this.getProductInfo(4)),
        this.createserviceid(5, 'Bharath CAS', this.getProductInfo(5)),
      ])
    });
  }



  getProductInfo(i: number) {
    if (this.listver) {
      console.log('list the product ',this.listver.find(x => x.casid == i))
      // console.log('index', i, 'list in the product' ,this.listver.find(x => x.casid == i)?.prodid)
      return this.listver.find(x => x.casid == i)?.prodid
    }

  }


  get val() {
    return this.EditPackageForm.value
  }


}
