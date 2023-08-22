import { Component, OnInit } from "@angular/core";
import "style-loader!angular2-toaster/toaster.css";
import { Router } from "@angular/router";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { ToasterService } from "angular2-toaster";
import { DashService } from "../../../pages/_services/dash.service";

@Component({
  selector: "ngx-searchpop",
  templateUrl: "./searchpop.component.html",
  styleUrls: ["./searchpop.component.scss"],
})
export class SearchpopComponent implements OnInit {
  submit: boolean = false;
  AddNasForm;
  id;
  sflag = "";
  search = "";
  limit: number = 10;
  datas: Object;
  liststb: any;
  data: any;
  loading: boolean;
  stbopt: any;
  op_type: any;
  pair: any;
  assign: any;
  count: any;
  setPage: any;
  vc: any;
  stb: any;
  castype: any;
  mobile: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alert: ToasterService,
    // private ser: AdminuserService,
    private router: Router,
    private dashii: DashService
  ) {
    this.id = JSON.parse(localStorage.getItem("details"));
  }

  closeModal() {
    this.activeModal.close();
  }

  async ngOnInit() {
    await this.searchresult();
  }

  async searchresult($event = "") {
    // console.log(this.sflag)
    console.log($event);
    let result = await this.dashii.search({ sflag: this.sflag, like: $event });
    this.datas = result;
    console.log(result);
  }

  searchclick() {
    if (this.search) {
      console.log("search here ", this.search);
      localStorage.setItem("details", JSON.stringify(this.search));
      this.router
        .navigateByUrl("/", { skipLocationChange: true })
        .then(() => this.router.navigate(["/pages/customer/view-cust"]));
      this.closeModal();
    }
  }
}
