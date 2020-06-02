import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

  @ViewChild('map', {static: false}) mapElement: ElementRef;
  map: any;

  latitude: number;
  longitude: number;

  locations = [
    {
      id: '36KQG7XJWYW9W',
      name: 'Katy',
      address: {
        address_line_1: '10350 richmond avenue',
        address_line_2: 'suite 400',
        locality: 'Houston',
        administrative_district_level_1: 'TX',
        postal_code: '77042',
        country: 'US'
      },
      timezone: 'America/Los_Angeles',
      status: 'ACTIVE',
      created_at: '2020-06-01T15:56:22Z',
      merchant_id: '2A3G349MMDJ1N',
      country: 'US',
      language_code: 'en-US',
      currency: 'USD',
      phone_number: '+1 281-881-6008',
      business_name: 'Pastel Katy',
      type: 'PHYSICAL',
      business_hours: {},
      business_email: 'dennis.coli@aveva.com',
      description: 'In Katy',
      coordinates: {
        latitude: 29.728441,
        longitude: -95.555403
      },
      logo_url: 'https://d1g145x70srn7h.cloudfront.net/files/c874c3661e16352a1dfd951544d53353d84231ab/original.jpeg',
      mcc: '5499'
    },
    {
      id: 'ZKEFE5BE0P2ZB',
      name: 'Pastel Paola',
      address: {
        address_line_1: '3832',
        address_line_2: 'Gramercy Street',
        locality: 'HOUSTON',
        administrative_district_level_1: 'TX',
        postal_code: '77025',
        country: 'US'
      },
      timezone: 'America/Chicago',
      status: 'ACTIVE',
      created_at: '2020-04-29T16:53:54Z',
      merchant_id: '2A3G349MMDJ1N',
      country: 'US',
      language_code: 'en-US',
      currency: 'USD',
      business_name: 'Pastel',
      type: 'PHYSICAL',
      business_hours: {},
      business_email: 'denniscalil@gmail.com',
      description: 'Test 123',
      coordinates: {
        latitude: 29.704834,
        longitude: -95.438865
      },
      mcc: '5499'
    }
  ];

  selectedLoc: any;

  constructor(private geolocation: Geolocation) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {

    this.geolocation.getCurrentPosition().then((resp) => {

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      const mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.map.addListener('dragend', () => {

        this.latitude = this.map.center.lat();
        this.longitude = this.map.center.lng();

      });

      this.addMarkers(this.map);

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  addMarkers(map) {

    this.locations.forEach((location) => {

      const data = this.buildInfoWindow(location);

      const infowindow = new google.maps.InfoWindow({
        content: data
      });

      const latLng = new google.maps.LatLng(location.coordinates.latitude, location.coordinates.longitude);
      const marker = new google.maps.Marker({
        position: latLng,
        map,
        title: 'Information'
      });

      google.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map, marker);
      });

      const self = this;

      google.maps.event.addListener(infowindow, 'domready', () => {

          const button = document.getElementById('saveButton');
          button.focus();
          const LocationId = button.getAttribute('data-id');
          button.onclick = () => {
            self.save(LocationId);
          };
      });

    });
  }

  buildInfoWindow(location) {
    let html = '';
    html += '<h5><b>Name: ' + location.name + '</b></h5>';
    if ('logo_url' in location) {
      html += '<img src="' + location.logo_url + '" height="40" width="40" style="float: right; margin-bottom: 10px"/>';
    }
    html += '<p>Address: ' + location.address.address_line_1 + ' ' + location.address.locality + ' ' + location.address.administrative_district_level_1 + '</p>';
    html += '<button id="saveButton" data-id="' + location.id + '" style="width: 100%; height: 30px">Select Location</button>';
    return html;
  }

  save(locationId) {
    localStorage.setItem('LocationID', locationId);
  }

  onSelectLoc() {
    const location = this.locations.find(item => item.id === this.selectedLoc);
    this.map.setCenter({
      lat : location.coordinates.latitude,
      lng : location.coordinates.longitude
    });
  }
}
