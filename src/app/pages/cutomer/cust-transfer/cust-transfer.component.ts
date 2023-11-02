import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SubscriberService } from "../../_services/subscriber.service";
import { HeadendService } from "../../_services/headend.service";
import { StbmanagementService } from "../../_services/stbmanagement.service";
import { log } from "console";
import * as JSXLSX from "xlsx";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { ErrormsgComponent } from "../../channelcategory/errormsg/errormsg.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
@Component({
	selector: "ngx-cust-transfer",
	templateUrl: "./cust-transfer.component.html",
	styleUrls: ["./cust-transfer.component.scss"],
})
export class CustTransferComponent implements OnInit {
	loc: any = [[], []];
	branch: any = [[], []];
	head: any = [];
	bulkopt = false;
	File: any;
	arrayBuffer: any;
	bulk: any = [];
	result;
	TransForm;
	opt: any = [[], []];
	stbdet: any = [];
	submit = false;
	listhead;
	getoperatorlist;getvclist
	getboxlist;
	filter;bulkmeta: any = [];
	file: any;

	constructor(
		private subscribers: SubscriberService,
		private headend: HeadendService,
		private stbm: StbmanagementService,
		private toast: ToastrService,
		private router: Router,
		private modal: NgbModal
	) { }

	async ngOnInit() {
		this.createForm();

		await this.getHeadend();
	}

	async addTransfer() {
		this.submit = true;
		const invalid = [];
		const control = this.TransForm.controls;
		for (const name in control) {
		  if (control[name].invalid) {
			invalid.push(name);
		  }
		}
		if (this.TransForm.invalid) {
		  console.log("Invalid value -----", invalid);
		  return;
		}
		if (!this.val["bulkopt"]) {
		let result = await this.stbm.addstbtransfer(this.TransForm.value);
		if (result[0]["err_code"] == 0) {
			this.toast.success(result[0]["msg"]);
		
			 this.router.navigate(["/pages/customer/cust-list"]);
		} else {
			this.toast.warning(result[0]["msg"]);
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
			let resp = await this.stbm.addbulkstbtransfer(this.TransForm.value)
			console.log("bulkResult????????????????? ", resp);
			let item=resp;
			this.Error(item)
			if (item && item[0].err_code == 0) {
			  this.router.navigate(["/pages/customer/cust-list"]);
			} 
					 console.log("error msg ",item)
		
	  
		  }
	}
	get val() {
		return this.TransForm.value
	  }
	metavalue() {
		this.bulkmeta = [
		  {
			msg: "Please fill stb or vc",
			label: "STB OR VC *",
			assign_to: "boxid",
			required: true,
		  },
		 
		  
		];
		return this.bulkmeta;
	  }


	  Error(item ) {
		const modalRef = this.modal.open(ErrormsgComponent, { size: 'lg', container: 'nb-layout', backdrop: false });
		modalRef.componentInstance.title = 'Error List';
		modalRef.componentInstance.item = item;
		modalRef.result.then((data) => {
		  
	
		})
	
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

	changeListener(file) {
		this.file = file;
		this.filereader(this.file, (result) => {
			this.bulk = result;
			console.log("result............", this.bulk);
		});
	}
	async getHeadend($event = "") {
		this.listhead = await this.headend.getHeadend({ like: $event });
		console.log(this.listhead);
	}
	// async getvc($event = "") {
	// 	if(this.TransForm.value["hdid"]){
	// 	this.getvclist = await this.stbm.getboxvc({ like: $event ,hdid: this.TransForm.value['hdid'], userid : this.TransForm.value['fuserid'] , changetype: this.TransForm.value['changetype']})
	// 	}
	//   }



	removedrop() {
		console.log("remove head", this.TransForm.value["fuserid"]);

		let remove = this.TransForm.value["fuserid"];

		this.filter = this.getoperatorlist.filter((id) => id.id != remove);

		console.log("filter", this.filter);
	}

	async getoperator($event = "") {
		if (this.TransForm.value["hdid"]) {
			this.getoperatorlist = await this.subscribers.getoperator({
				hdid: this.TransForm.value["hdid"],
				like: $event,
			});
			console.log("operator list ", this.getoperatorlist);
		}
	}

	clearopt() {
		console.log("clezr");

		this.TransForm.controls.tuserid.setValue();
		this.TransForm.controls.boxid.setValue()
	}


	clearstb(){
		this.TransForm.controls.boxid.setValue()
		this.TransForm.controls.vcid.setValue()

	}

	clearHeaded(){

		this.TransForm.controls.tuserid.setValue();
		this.TransForm.controls.fuserid.setValue();
		// this.TransForm.controls.Changetype.setValue();
		this.TransForm.controls.boxid.setValue();

	}




	async getbox($event = "") {
		if (this.TransForm.value["hdid"] !='' && this.TransForm.value["fuserid"]  != '' && this.TransForm.value['changetype'] != '' ) {
			if(this.TransForm.value["changetype"] ==3 ){
				console.log("vc only");
				this.getboxlist = await this.stbm.getboxvc({
					like: $event,
					hdid: this.TransForm.value["hdid"],
					// 0-pair 1  unpair
					pairstatus: 0 ,
					// changetype==1 BOX ONLY(UNPAIRED BOX) changetype==2 BOX AND VC (PAIRED) changetype==3 VC ONLY (GET VC UNPAIRED)
	
					userid :this.TransForm.value['fuserid']
					// changetype: this.TransForm.value['changetype']

				});
				
			}else{
			this.getboxlist = await this.stbm.getbox({
				like: $event,
				hdid: this.TransForm.value["hdid"],
				// 0-pair 1  unpair
				pairstatus: this.TransForm.value["changetype"]==1?0:this.TransForm.value["changetype"]==2?0:1 ,
				// changetype==1 BOX ONLY(UNPAIRED BOX) changetype==2 BOX AND VC (PAIRED) changetype==3 VC ONLY (GET VC UNPAIRED)

				userid :this.TransForm.value['fuserid']
				// changetype: this.TransForm.value['changetype']
			});
		}
		}
	}





	createForm() {
		this.TransForm = new FormGroup({
			hdid: new FormControl("", Validators.required),
			fuserid: new FormControl("", Validators.required),
			changetype: new FormControl("", Validators.required),
			tuserid: new FormControl("", Validators.required),
			bulkopt: new FormControl(false),
			boxid: new FormControl(""),
			vcid:new FormControl('')
		});
	}
}
