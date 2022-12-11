import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit{

  public firstName: string;
  public firstNameContactUs: string;
  public lastName: string;
  public phoneNumber: string;
  public emailAddress: string;
  public subject: string;
  public subjecttext: string;
  public saveUnsuccessful: boolean;
  public saveNotSuccessful: boolean;


  operating: any[] = [{

    "time": [{
      "dayOfWeek": "Monday",
      "operatingTime": "Closed"
    },
    {
      "dayOfWeek": "Tuesday",
      "operatingTime": "9:00am - 8:30pm"

    },
    {
      "dayOfWeek": "Wednesday",
      "operatingTime": "9:00am - 8:30pm"

    },
    {
      "dayOfWeek": "Thursday",
      "operatingTime": "9:00am - 8:30pm"

    },
    {
      "dayOfWeek": "Friday",
      "operatingTime": "9:00am - 8:30pm"

    },
    {
      "dayOfWeek": "Saturday",
      "operatingTime": "8:30am - 3:30pm"

    },
    {
      "dayOfWeek": "Sunday",
      "operatingTime": "8:30am - 3:30pm"

    }]
  }]

  onFormSubmit(ngForm: NgForm){
    this.saveUnsuccessful = false;

    if(!ngForm.valid){
      this.saveUnsuccessful = true;
      return;
    }

    console.log(ngForm);

    ngForm.resetForm();
    windowAlert();
  }

  onFormSend(ngSend: NgForm){
    this.saveNotSuccessful = false;


    if(!ngSend.valid){
      this.saveNotSuccessful = true;
      fail();
      return;
    }
    console.log(ngSend);

    ngSend.resetForm();
    sendEmail();
  }

    ngOnInit(): void {

    }
}

function fail(){
  alert("please fill out all fields")
}

function sendEmail(){
  alert("You sent us an email");
}

function windowAlert() {
  alert('Congratulations! You signed up for exclusive offers!')

}

