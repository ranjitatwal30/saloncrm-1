import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
// import { Observable } from 'rxjs';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AdminServService {
  baseUrl = environment.backendBaseUrl+"/api";

  constructor(private http:HttpClient) { }




  private headerText = new BehaviorSubject<string>(''); // Initialize with emtpy string

  setHeaderText(data: string) {
      // Fire the update event with the new data
      this.headerText.next(data);
  }

  getHeaderText(): Observable<string>  {
      return this.headerText.asObservable();
  }





  getSalonsList(){
    let data = {"type":"activesalons"}
    return  this.http.post(this.baseUrl+"/activesalons",data)
  }

  getSalonsRequest(data){
    return this.http.post(this.baseUrl+"/salonsrequest",data);
  }
  approveSalonRequests(data){
    return this.http.post(this.baseUrl+ "/acceptrequest",data);
  }

  getActiveSalonsCount(data){
    return this.http.post(this.baseUrl+"/salonscount",data)
  }
  getActiveUsersCount(data){
    return this.http.post(this.baseUrl+"/userscount",data)
  }
  
  declineSalonRequest(data){
    return this.http.post(this.baseUrl+"/suspendsalon",data)
  }
  getActiveUsersList(data){
    return this.http.post(this.baseUrl+"/userslist",data)
  }

  getAdmincategoriesList(data){
    return this.http.post(this.baseUrl+"/admin-categories",data,httpOptions)
  }

  addCategories(data){
    return this.http.post(this.baseUrl+"/add-categories",data,httpOptions)
  }
  deleteCategories(data){
    return this.http.post(this.baseUrl+"/remove-categories",data,httpOptions)
  }
  getArchivedCategories(data){
    return this.http.post(this.baseUrl+"/archive-categories",data,httpOptions)
  }

  getRolesList(data){
    return this.http.post(this.baseUrl+"/roles",data,httpOptions)
  }
  addRoles(data){
    return this.http.post(this.baseUrl+"/add-role",data,httpOptions)
  }
  deleteRoles(data){
    return this.http.post(this.baseUrl+"/remove-role",data,httpOptions)
  }
  updateRoles(data){
    return this.http.post(this.baseUrl+"/edit-role",data,httpOptions)
  }

  awakeCategories(data){
  return this.http.post(this.baseUrl+"/awake-category",data,httpOptions)
  }
  addServices(data) { 
     return this.http.post(this.baseUrl+"/add-service",data,httpOptions)
  }
  removeServices(data) { 
     return this.http.post(this.baseUrl+"/remove-service",data,httpOptions)
  }
  
  getServices(data) { 
  return this.http.post(this.baseUrl+"/active-services",data,httpOptions)
  }
  
  // errorHandler(error:HttpErrorResponse){
  //   return Observable.throw(error.message|| "Server Error");
  // }



}
