import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { MyInterceptor } from "./my-interceptor";
import { AppRoutingModule } from "./app-routing.module";
import { SimpleModalModule } from "ngx-simple-modal";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import {
  MatPaginatorModule,
  MatTableModule,
  MatButtonModule,
  MatDialogModule,
  MatSelectModule,
  MatOptionModule,
  MatProgressSpinnerModule
} from "@angular/material";

import { MatTabsModule } from "@angular/material/tabs";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { ToastrModule } from "ngx-toastr";
import {} from "googlemaps";

import { AgmCoreModule } from "@agm/core";
import LatLng = google.maps.LatLng;
import { LocationPickerModule } from "ng-location-picker";
import { SelectAutocompleteModule } from "mat-select-autocomplete";
import { SalonComponent } from "./salon/salon.component";
import { UserComponent } from "./user/user.component";
import { AdminComponent } from "./admin/admin.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { PagenotfoundComponent } from "./pagenotfound/pagenotfound.component";
import { ForgetpasswordComponent } from "./forgetpassword/forgetpassword.component";

@NgModule({
  declarations: [
    AppComponent,
    SalonComponent,
    UserComponent,
    AdminComponent,
    PagenotfoundComponent,
    ForgetpasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBtFviJz4HltgeXLEnK8p-sbztqf7fVfFg"
    }),
    FormsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatTabsModule,
    SelectAutocompleteModule,
    NgxMaterialTimepickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatProgressSpinnerModule,
    SimpleModalModule.forRoot({ container: "modal-container" })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
