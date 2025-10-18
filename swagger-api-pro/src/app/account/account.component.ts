import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {


  private baseUrl = 'http://49.50.112.46:3002'; // Swagger API base
  @ViewChild(DxDataGridComponent) dataGrid!: DxDataGridComponent;
  companyForm!: FormGroup;
  accountList: any[] = [];
  selectedAccountId: number | null = null;
  accountCount: number | null = null;

  cities: any[] = [];
  isViewMode = false;
  showForm = false;

  constructor(private fb: FormBuilder, private http: HttpClient) { }




  ngOnInit() {
    this.companyForm = this.fb.group({
      // accountid:[0],

      companyname: ['', Validators.required],
      ownername: ['', Validators.required],
      ownermobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      owneremail: ['', [Validators.required, Validators.email]],
      companyaddress: [''],
      companycity: ['', Validators.required],
      companystate: [''],
      companycountry: [''],
      companypincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      licensecount: [''],
      createddate: [''],
      updateddate: [''],
      // isactive:[true],
      createdby:[''],
      updatedby:[''],
      cityid: [''],  // patched automatically
    });
    this.loadCities(); // load all cities from API

    this.loadAccounts();

    this.loadaccountcount();
  }


  // 🔹 Load Accounts
  loadAccounts(): void {
    this.http.get<any[]>(`${this.baseUrl}/account/list`).subscribe({


      next: (res) => {
        console.log('Account API response:', res);
        this.accountList = res;
      },
      error: (err) => console.error('Error loading accounts:', err)
    });
  }




  // Load cities
  loadCities() {
    this.http.get<any[]>(`${this.baseUrl}/city/list`).subscribe({
      next: (res) => this.cities = res,
      error: (err) => console.error('Error loading cities', err)
    });
  }

  // On city select -> patch state, country, cityid
  onCityChange(event: any): void {
    const selectedCityName = event.target.value;
    const selectedCity = this.cities.find(c => c.cityname === selectedCityName);
    if (selectedCity) {
      this.companyForm.patchValue({
        companystate: selectedCity.citystate,
        companycountry: selectedCity.citycountry,
        cityid: selectedCity.cityid
      });
    } else {
      // Clear fields if no city selected
      this.companyForm.patchValue({
        companystate: '',
        companycountry: '',
        cityid: ''
      });
    }
  }

  resetForm(): void {
    this.companyForm.reset();
    this.showForm = false;
    this.selectedAccountId = null;
  }


  // ---- VIEW ----
  onView(accountid: number): void {
    this.http.get<any[]>(`${this.baseUrl}/account/list`).subscribe({
      next: (res) => {
        const acc = res.find(a => a.accountid === accountid);
        if (!acc) {
          alert(`Account with ID ${accountid} not found`);
          return;
        }
        const created = acc.createddate ? new Date(acc.createddate) : null;
        const updated = acc.updateddate ? new Date(acc.updateddate) : null;

        this.selectedAccountId = acc.accountid;
        this.isViewMode = true;
        this.showForm = true;

        this.companyForm.patchValue({
          ...acc,
          createddate: created ? created.toISOString().substring(0, 10) : '',
          updateddate: updated ? updated.toISOString().substring(0, 10) : ''
        });

        // this.companyForm.reset();
      },
      error: (err) => {
        console.error('Error fetching account:', err);
        alert('Failed to fetch account details.');
      }
    });
  }


  // ---- EDIT ----
  onEdit(accountid: number): void {
    this.http.get<any[]>(`${this.baseUrl}/account/list`).subscribe({
      next: (res) => {
        const acc = res.find(a => a.accountid === accountid);
        if (!acc) {
          alert(`Account with ID ${accountid} not found`);
          return;
        }
        const created = acc.createddate ? new Date(acc.createddate) : null;
        const updated = acc.updateddate ? new Date(acc.updateddate) : null;

        this.selectedAccountId = acc.accountid;
        this.isViewMode = false;
        this.showForm = true;

        this.companyForm.patchValue({
          ...acc,
          createddate: created ? created.toISOString().substring(0, 10) : '',
          updateddate: updated ? updated.toISOString().substring(0, 10) : ''
        });

        this.companyForm.enable();
        this.companyForm.get('accountid')?.disable();
      },
      error: (err) => {
        console.error('Error fetching account for edit:', err);
        alert('Failed to load account for edit.');
      }
    });
  }

  // ---- DELETE ----
  onDelete(accountid: number): void {
    if (!confirm('Are you sure you want to delete this account?')) return;

    this.http.delete(`${this.baseUrl}/account/accountdelete/${accountid}`).subscribe({
      next: (res: any) => {
        if (res?.affected > 0) {
          alert('Account deleted successfully.');
          this.loadAccounts();
        } else {
          alert(`No account deleted. Account ID ${accountid} may not exist.`);
        }
      },
      error: (err) => {
        console.error('Error deleting account:', err);
        alert('Failed to delete account.');
      }
    });
  }

  // ---- SUBMIT (CREATE/UPDATE) ----
  //  onSubmit(): void {
  //   if (this.companyForm.invalid) {
  //      this.companyForm.markAllAsTouched();
  //      alert('Please fill required fields.');
  //      return;
  //    }

  //    const userId = sessionStorage.getItem('userId') || 'admin';

  //   const payload = {
  //      ...this.companyForm.getRawValue(),
  //      createdby: userId,
  //      updatedby: userId,
  //   };





  //   if (this.selectedAccountId) {

  //      payload.accountid = this.selectedAccountId;

  //      this.http.put(`${this.baseUrl}/account/accountupdate`, payload).subscribe({
  //       next: () => {
  //          alert('Account updated successfully!');
  //          this.loadAccounts();
  //          this.resetForm();
  //       },
  //        error: (err) => {
  //          console.error('Update failed:', err);
  //         alert('Failed to update account.');
  //        }
  //      });
  //    } else {
  //      // CREATE
  //     // delete payload.accountid;
  //      console.log('Payload being sent:', payload);

  //      this.http.post(`${this.baseUrl}/account/accountsave`, payload).subscribe({
  //        next: () => {
  //          alert('Account created successfully!');
  //          this.loadAccounts();
  //          this.resetForm();
  //        },
  //        error: (err) => {
  //          console.error('Create failed:', err);
  //          alert('Failed to create account.');
  //        }
  //      });
  //    }
  // }

  // working 2

  //    onSubmit(): void {
  //    if (this.companyForm.invalid) {
  //      this.companyForm.markAllAsTouched();
  //      alert('Please fill required fields.');
  //      return;
  //    }

  //    // const userId = sessionStorage.getItem('userId') || 'admin';
  //    const userId = sessionStorage.getItem('userId') || '1';

  //    const payload = {
  //      ...this.companyForm.getRawValue(),
  //      createdby: Number(userId),
  //      updatedby: Number(userId),
  //    };

  //    if (payload.accountid) {
  //      // UPDATE
  //     payload.accountid = this.selectedAccountId;
  //     this.http.put(`${this.baseUrl}/account/accountupdate`, payload).subscribe({
  //        next: () => {
  //          alert('Account updated successfully!');
  //          this.loadAccounts();
  //         this.resetForm();
  //        },
  //        error: (err) => {
  //          console.error('Update failed:', err);
  //          alert('Failed to update account.');
  //        }
  //      });
  //    } else {

  //      console.log('Payload:', payload);


  //      this.http.post(`${this.baseUrl}/account/accountsave`, payload).subscribe({
  //        next: () => {
  //          alert('Account created successfully!');
  //          this.loadAccounts();
  //          this.resetForm();
  //        },
  //        error: (err) => {
  //          console.error('Create failed:', err);
  //          console.log('Created account response:');
  //         alert('Failed to create account.');
  //        }
  //      });
  //   }
  //   this.showForm = false; 
  //  }

  // onSubmit() {
  //   if (this.companyForm.invalid) {
  //     this.companyForm.markAllAsTouched();
  //     alert('Please fill required fields.');
  //     return;
  //   }

  //   const payload = {
  //     ...this.companyForm.getRawValue(),
  //     createdby: this.companyForm.get('createdby')?.value || 'admin',
  //     updatedby: 'admin',
  //   };

  //   console.log('Payload being sent:', payload); // Add this line
  //   console.log('Selected Account ID:', this.selectedAccountId);

  //   if (this.selectedAccountId) {
  //     // UPDATE
  //     payload.accountid = this.selectedAccountId;
  //     this.http.put(`${this.baseUrl}/account/accountupdate`, payload).subscribe({
  //       next: () => {
  //         alert('Account updated successfully!');
  //         this.loadAccounts();
  //         this.resetForm();
  //       },
  //       error: (err) => {
  //         console.error('Update failed:', err);
  //         alert('Failed to update account.');
  //       }
  //     });
  //   } else {
  //     // CREATE
  //     this.http.post(`${this.baseUrl}/account/accountsave`, payload).subscribe({
  //       next: () => {
  //         alert('Account created successfully!');
  //         this.loadAccounts();
  //         this.resetForm();
  //       },
  //       error: (err) => {
  //         console.error('Create failed:', err);
  //         alert('Failed to create account.');
  //       }
  //     });
  //   }
  // }


  //   working 3 
  //   onSubmit(): void {
  //   if (this.companyForm.invalid) {
  //     this.companyForm.markAllAsTouched();
  //     alert('Please fill required fields.');
  //     return;
  //   }

  //   // const userId = sessionStorage.getItem('userId') || '1';

  //   const payload = {
  //     ...this.companyForm.getRawValue(),
  //     // createdby: Number(userId),
  //     // updatedby: Number(userId),
  //     isactive: true 
  //   };

  //   if (this.selectedAccountId) {
  //     // UPDATE
  //     payload.accountid = this.selectedAccountId;
  //     this.http.put(`${this.baseUrl}/account/accountupdate`, payload).subscribe({
  //       next: () => {
  //         alert('Account updated successfully!');
  //         this.loadAccounts();
  //         this.resetForm();
  //       },
  //       error: (err) => {
  //         console.error('Update failed:', err);
  //         alert('Failed to update account.');
  //       }
  //     });
  //   } else {
  //     // CREATE
  //     // console.log('Payload for creation:', payload);
  //     console.log("Form value:", this.companyForm.value);


  //     this.http.post(`${this.baseUrl}/account/accountsave`, this.companyForm.value).subscribe({

  //       next: (res) => {
  //         alert('Account created successfully!');
  //         console.log('Created account response:', res);
  //         this.loadAccounts();
  //         this.resetForm();
  //       },
  //       error: (err) => {
  //         console.error('Create failed:', err);
  //         alert('Failed to create account.');
  //       }
  //     });
  //   }

  //   this.showForm = false;
  // }



  //  create  and update are working 
  onSubmit(): void {
    if (this.companyForm.invalid) {
      return;
    }

    const formData = this.companyForm.value;

    //   // If accountid exists, it's an update
    if (this.selectedAccountId) {


      const payload = {
        ...formData,
        updateddate: new Date().toISOString(),  // set update date
        isactive: true,
        // createdby:sessionStorage.getItem('userId') ?? '2',
        // updatedby:sessionStorage.getItem('userId') ?? '2',
      };


      payload.accountid = this.selectedAccountId;
      this.http.put(`${this.baseUrl}/account/accountupdate`, payload).subscribe({
        next: (res) => {
          console.log("Account updated:", res);
          alert("Account updated successfully");
          this.companyForm.reset();
          this.showForm = false;
        },
        error: (err) => {
          console.error("Update failed", err);
        }
      });

    } else {
      // For create 
      const userId = sessionStorage.getItem('userId');
      console.log(userId);
      const payload = {
        ...formData,
        createdby: sessionStorage.getItem('userId') ?? '2',
        updatedby: sessionStorage.getItem('userId') ?? '2',
        createddate: new Date().toISOString(),
        updateddate: new Date().toISOString(),
        isactive: true
      };

      this.http.post(`${this.baseUrl}/account/accountsave`, payload).subscribe({
        next: (res) => {
          console.log("Account created:", res);
          alert("Account created successfully");
          this.companyForm.reset();
          this.showForm = false;
          this.loadAccounts();
        },
        error: (err) => {
          console.error("Create failed", err);
        }
      });
    }
  }






  onAddAccount() {
    this.showForm = true;
    this.companyForm.reset(); // Clear form
  }

  onCancel() {
    this.showForm = false;
  }

  openForm() {
    this.showForm = true;
    this.companyForm.reset(); // optional: clear form
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











}
