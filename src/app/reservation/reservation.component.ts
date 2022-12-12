import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { IReservationItem } from '../model/reservation-item'; 
import { ReservationService } from '../shared/reservation.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})

export class ReservationComponent implements OnInit {
  
  public availableTimes: IReservationItem[] = [];
  public reservedTimes: IReservationItem[] = [];
  public dataLoading: boolean = false;
  public personName: string = "";
  public partyNumber: number;
  public selectedReservation: IReservationItem = {id: 0, name: "", time: "", number: 0};
  saveUnsuccessful: boolean;
  partyArray: any[];

  constructor(
    public route: ActivatedRoute,
    public reservationService: ReservationService,
    public httpClient: HttpClient
  ) { }


  // call get endpoint on page load for both available time list and reservation list
  ngOnInit(): void {
    this.dataLoading = true;
    this.reservationService.fetchReservationData()
      .subscribe({
        next: (data) => {
          this.availableTimes = data.available;
          this.reservedTimes = data.reservations;
          this.reservedTimes.sort((a, b) => a.id - b.id); // sort reservations by time
          this.dataLoading = false;
        },
        error: (err) => {
          console.error("Error occurred: " + err);
        }
      });
  }

  onFormSubmit(ngForm: NgForm) {
    this.saveUnsuccessful = false;

    if (!ngForm.valid) {
      this.saveUnsuccessful = true;
      return;
    }

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
    };
    
    // created modified item with new max party number
    let modifiedAvailableItem = JSON.parse(JSON.stringify(this.selectedReservation));
    let newNum = modifiedAvailableItem.number - ngForm.value.partyNumber;
    modifiedAvailableItem.number = newNum;

    // create reserved item to add to confirmed reservation list
    let reservedItem = JSON.parse(JSON.stringify(this.selectedReservation));
    reservedItem.name = ngForm.value.personName;
    reservedItem.number = ngForm.value.partyNumber;

    // calls PUT endpoint to update available times item to modified item with new item number
    this.httpClient.put<any>("http://localhost:8080/reservation", JSON.stringify(modifiedAvailableItem), options)
        .subscribe({
          next: () => {
            console.log("Call successful");
          },
          error: (err) => {
            console.error("Error occurred: " + err);
          }
        });

      // calls POST endpoint to add reserved item to confirmed reservation list
      this.httpClient.post<any>("http://localhost:8080/reservation", JSON.stringify(reservedItem), options)
      .subscribe({
          next: () => {
            console.log("Call successful");
          },
          error: (err) => {
            console.error("Error occurred: " + err);
          }
        });

      // if the new max party number is 0, call DELETE endpoint to remove from available times list
      if (modifiedAvailableItem.number <= 0) 
      {
        // delete endpoint needs it's body inside the options paramater
        const deleteOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }),
          body: JSON.stringify(modifiedAvailableItem)
        };
        this.httpClient.delete<any>("http://localhost:8080/reservation", deleteOptions)
        .subscribe({
            next: () => {
              console.log("Call successful");
            },
            error: (err) => {
              console.error("Error occurred: " + err);
            }
          });
      }


    //clear the form and the selected reservation
    ngForm.resetForm();
    this.selectedReservation = {id: 0, name: "", time: "", number: 0};

    //reload the available times and the reservation list
    this.reservationService.fetchReservationData()
      .subscribe({
        next: (data) => {
          this.availableTimes = data.available;
          this.reservedTimes = data.reservations;
          this.reservedTimes.sort((a, b) => a.id - b.id); // sort by time
          this.dataLoading = false;
        },
        error: (err) => {
          console.error("Error occurred: " + err);
        }
      });

  }

  public hoveredItem: any;

  // to highlight the row you are hovering
  public highlightRow(item: IReservationItem) {
    this.hoveredItem = item.id
  }

  // clicking on an available time makes it the selectedReservation and set the party number array for the form
  public clickRow(item: IReservationItem) {
    this.selectedReservation = item;
    this.partyArray = Array.from(Array(item.number),(x,i)=>i+1);
  }

}