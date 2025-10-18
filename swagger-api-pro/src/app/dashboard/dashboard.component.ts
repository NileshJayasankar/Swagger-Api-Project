import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  baseUrl = 'http://49.50.112.46:3002';
  userCount: number | null = null;
  userroleCount:number | null = null;
  instanceCount: number | null = null;
  accountCount: number | null = null;
  cityCount: number | null = null;
  vatCount: number | null = null;
  gstCount: number | null = null;
  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void{
    this.loadUserCount();
    this.loadUserroleCount();
    this.loadinstancecount();
    this.loadaccountcount();
    this.loadcitycount();
    this.loadvatCount();
    this.loadgstcount();
  }


  loadUserCount() {
    this.http.get<any>(`${this.baseUrl}/user/counts`).subscribe({
      next: (res) => {
        this.userCount = res.totalUser; // <-- mapping your JSON key
        console.log('Total Users:', this.userCount);
      },
      error: (err) => {
        console.error('Error fetching user count:', err);
      }
    });
  }

   loadUserroleCount() {
    this.http.get<any>(`${this.baseUrl}/userrole/counts`).subscribe({
      next: (res) => {
        this.userroleCount = res.totalUserrole; // <-- mapping your JSON key
        console.log('Total Users:', this.userroleCount);
      },
      error: (err) => {
        console.error('Error fetching user count:', err);
      }
    });
  }

  loadinstancecount() {
    this.http.get<any>(`${this.baseUrl}/instance/counts`).subscribe({
      next: (res) => {
        this.instanceCount = res.totalInstance; // <-- mapping your JSON key
        console.log('Total Users:', this.instanceCount);
      },
      error: (err) => {
        console.error('Error fetching user count:', err);
      }
    });
  }

  loadaccountcount() {
    this.http.get<any>(`${this.baseUrl}/account/counts`).subscribe({
      next: (res) => {
        this.accountCount = res.totalAccounts; // <-- mapping your JSON key
        console.log('Total Users:', this.accountCount);
      },
      error: (err) => {
        console.error('Error fetching user count:', err);
      }
    });
  }

  loadcitycount() {
    this.http.get<any>(`${this.baseUrl}/city/counts`).subscribe({
      next: (res) => {
        this.cityCount = res.totalCity; // <-- mapping your JSON key
        console.log('Total Users:', this.cityCount);
      },
      error: (err) => {
        console.error('Error fetching user count:', err);
      }
    });
  }

  loadvatCount() {
    this.http.get<any>(`${this.baseUrl}/vat/counts`).subscribe({
      next: (res) => {
        this.vatCount = res.totalVat; // <-- mapping your JSON key
        console.log('Total Users:', this.vatCount);
      },
      error: (err) => {
        console.error('Error fetching user count:', err);
      }
    });
  }

  loadgstcount() {
    this.http.get<any>(`${this.baseUrl}/gst/counts`).subscribe({
      next: (res) => {
        this.gstCount = res.totalGst; // <-- mapping your JSON key
        console.log('Total Users:', this.gstCount);
      },
      error: (err) => {
        console.error('Error fetching user count:', err);
      }
    });
  }


}
