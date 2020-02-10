import { Component, OnInit, Inject } from "@angular/core";
import { SimpleModalComponent } from "ngx-simple-modal";

export interface ConfirmModel {
  title: string;
  message: string;
}
@Component({
  selector: "app-confirmation",
  templateUrl: "./confirmation.component.html",
  styleUrls: ["./confirmation.component.scss"]
})
export class ConfirmationComponent
  extends SimpleModalComponent<ConfirmModel, boolean>
  implements ConfirmModel {
  title: string;
  message: string;
  result: any;
  constructor() {
    super();
  }
  confirm() {
    // on click on confirm button we set dialog result as true,
    // ten we can get dialog result from caller code
    this.result = true;
    console.log(this.result);
    this.close();
  }
  cancel() {
    this.result = false;
    console.log(this.result);
    this.close();
  }
}
