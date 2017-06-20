import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { D3Service, D3, Selection } from 'd3-ng2-service'; // <-- import the D3 Service, the type alias for the d3 variable and the Selection interface
import { Satellite } from '../satellite.model';
import { SatelliteService } from '../satellite.service';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@Component({
  selector: 'app-d3main',
  templateUrl: './d3main.component.html',
  styleUrls: ['./d3main.component.css'],
  providers: [SatelliteService]
})

export class D3mainComponent implements OnInit {
  private d3: D3; // <-- Define the private member which will hold the d3 reference
  private parentNativeElement: any;
  satellites: FirebaseListObservable<any[]>;
  readyToDisplay: boolean = false;
  satToDisplay: any;

  constructor(element: ElementRef, d3Service: D3Service,
              private router: Router,
              private database: AngularFireDatabase,
              private satelliteService: SatelliteService) {
    this.d3 = d3Service.getD3(); // <-- obtain the d3 object from the D3 Service
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {
      let d3 = this.d3; // <-- for convenience use a block scope variable
      let d3ParentElement: Selection<any, any, any, any>; // <-- Use the Selection interface (very basic here for illustration only)
      if (this.parentNativeElement !== null) {
      d3ParentElement = d3.select(this.parentNativeElement); // <-- use the D3 select method
        // Do more D3 things
      this.satellites = this.satelliteService.getSatellites();
      // this.satToDisplay = this.satelliteService.getSatelliteById('0');
      this.satelliteService.getSatelliteById('0').subscribe(dataLastEmittedFromObserver => {
        this.satToDisplay = dataLastEmittedFromObserver;
      })

    }
  }

  funkButtonClicked() {
    this.readyToDisplay = true;
    this.mainFunk(this.d3);
  }

  mainFunk(d3) {

    let svg = d3.select("svg");

    let satData = [
      { rad:  5, speed: 5.5, phi0: 100, cx: 100, cy: -100 },
      { rad:  10, speed: 3, phi0: 100, cx: 170, cy: -80 },
      { rad:  20, speed: 1, phi0: 100, cx: 350, cy: -40 }
    ];

    //for each item in satData create a new satelite circle element
    let satelite = svg.selectAll(".start")
        .data(satData, function(d, i) { return (i); } )
        .attr("class", "satelite");

    satelite.enter().append("circle")
        .attr("class", "satelite");

    let allSatelites = svg.selectAll(".satelite")
    allSatelites.attr("cx", function(d) { return d.cx; });
    allSatelites.attr("cy", function(d) { return d.cy; });
    allSatelites.attr("r", function(d) { return d.rad; });

    let masterRad = 0;

    function updateAnim() {
      svg.selectAll(".satelite").attr("transform", function(d) {
        return "translate(500,500), rotate(" + d.phi0 + masterRad * d.speed + ")";
      });
      if (masterRad === 360) {
        masterRad = 0;
      }
      masterRad += 1;
      console.log(masterRad);
    }

    d3.timer(updateAnim);

  }

  // myFunk() {
    // this.d3.select("#test-div").append("div").html("<h1>FIRST LINE</h1>  <h2>SECOND LINE</h2>")
  // }

  // readyToDisplay() {
  //   return this.display;
  // }

  // getOneSat() {
  //   return this.satelliteService.getSatelliteById('0');
  // }

}