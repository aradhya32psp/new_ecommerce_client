import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb:FormBuilder, private http:HttpClient) { }

  readonly BaseURI = 'http://localhost:5000/api';

  formModel = this.fb.group({
    UserName : ['', Validators.required],
    Email : ['',Validators.email],
    Name : [''],
    Passwords : this.fb.group({
      Password : ['', [Validators.required, Validators.minLength(4)]],
      ConfPassword : ['', Validators.required]
    }, {validator : this.comparePasswords})
  });

  comparePasswords(fb:FormGroup)
  {
    let confirmPasswordControl = fb.get('ConfPassword');
    if(confirmPasswordControl.errors == null || 'passwordMismatch' in confirmPasswordControl.errors){
      if(fb.get('Password').value != confirmPasswordControl.value)
      confirmPasswordControl.setErrors({passwordMismatch:true});
      else
      confirmPasswordControl.setErrors(null);
    }
  }

  register(){
    var body={
      UserName : this.formModel.value.UserName,
      Email : this.formModel.value.Email,
      Name : this.formModel.value.Name,
      Password : this.formModel.value.Passwords.Password
    };
    return this.http.post(this.BaseURI + '/users', body);
  }
}
