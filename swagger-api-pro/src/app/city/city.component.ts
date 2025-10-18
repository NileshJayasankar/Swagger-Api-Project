import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {

  // static cityCounter = 1;
  cityForm!: FormGroup;
  isViewMode: boolean = false;
  cityCount: number | null = null;

  cities: any[] = [];
  currentEditIndex: number | null = null;  // track which row is being edited


  selectedCityId: number | null = null;
  showForm: boolean = false;


  constructor(private fb: FormBuilder, private http: HttpClient) { }
  baseUrl = 'http://49.50.112.46:3002';

  ngOnInit(): void {
    this.cityForm = this.fb.group({
      // cityid: [''],
      cityname: ['', Validators.required],
      citystate: ['', Validators.required],
      citycountry: ['', Validators.required],
      createddate: ['',],
      updateddate: ['',],
      createdby:[''],
      updatedby:['']

    });

    this.loadCities(); // 🔹 fetch data from API when page loads

    this.loadcitycount();
  }

  loadCities() {
    this.http.get<any[]>(`${this.baseUrl}/city/list`).subscribe({
      next: data => this.cities = data,
      error: err => console.error('Error fetching cities:', err)
    });
  }


  resetForm() {
    this.cityForm.reset();
    this.currentEditIndex = null;
  }













  //      onView(cityid:number) {
  //       if (!cityid) {
  //         alert('Invalid city ID');
  //          return;
  //        }

  //        console.log('Viewing cityid:', cityid);

  //        this.http.get<any>(`${this.baseUrl}/city/${cityid}`).subscribe({
  //           next: (res) => {
  //             console.log('View response:', res);
  //             if (res) {
  //               // Patch the form or show details in a modal
  //               this.cityForm.patchValue({
  //                  cityname: res.cityname,
  //                  citystate: res.citystate,
  //                  citycountry: res.citycountry,
  //                 createdDate: res.createdDate ? new Date(res.createdDate) : null,
  //                  updatedDate: res.updatedDate ? new Date(res.updatedDate) : null,
  //                  createdBy: res.createdBy,
  //                  updatedBy: res.updatedBy
  //                });



  //                alert('City details loaded'); // optional
  //              } else {
  //               alert(`City with ID ${cityid} not found`);
  //              }
  //            },
  //            error: (err) => {
  //              console.error('View failed:', err);
  //             alert('Failed to fetch city details');
  //            }
  //          });
  //  }

  //  onEdit(cityid: number) {
  //   if (!cityid) return;

  //   console.log('Editing cityid:', cityid);

  //   this.http.get<any>(`${this.baseUrl}/city/list${cityid}`)
  //     .subscribe({
  //       next: (res) => {
  //         console.log('Edit response:', res);

  //         if (res  && res.length > 0) {
  //            this.cities = res[0];
  //           // Patch form with API data
  //           this.cityForm.patchValue({
  //             cityname: res.cityname,
  //             citystate: res.citystate,
  //             citycountry: res.citycountry,
  //             createdDate: res.createdDate ? new Date(res.createdDate) : null,
  //             updatedDate: res.updatedDate ? new Date(res.updatedDate) : null,
  //             createdBy: res.createdBy,
  //             updatedBy: res.updatedBy
  //           });

  //           // Set currentEditIndex so onSubmit() knows it’s an update
  //           this.currentEditIndex = res.cityid;
  //         } else {
  //           alert(`City with ID ${cityid} not found`);
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Edit failed:', err);
  //         alert('Failed to load city data');
  //       }
  //     });
  //  }


  //   onSubmit(): void {
  //   if (this.cityForm.invalid) {
  //     this.cityForm.markAllAsTouched();
  //     return;
  //   }

  //   const formValue = this.cityForm.getRawValue();

  //   const payload: any = {
  //     cityname: formValue.cityname,
  //     citystate: formValue.citystate,
  //     citycountry: formValue.citycountry,
  //     createdDate: formValue.createdDate ? new Date(formValue.createdDate).toISOString() : null,
  //     updatedDate: formValue.updatedDate ? new Date(formValue.updatedDate).toISOString() : null,
  //     createdBy: Number(formValue.createdBy),
  //     updatedBy: Number(formValue.updatedBy)
  //   };

  //   if (this.currentEditIndex !== null) {
  //     // Update
  //     payload.cityid = this.currentEditIndex;

  //     this.http.put(`${this.baseUrl}/city/cityupdate`, payload)
  //       .subscribe({
  //         next: () => {
  //           alert('City updated successfully');
  //           this.loadCities();
  //           this.resetForm();
  //         },
  //         error: err => console.error('Update failed:', err, payload)
  //       });
  //   } else {
  //     // Add new city
  //     this.http.post(`${this.baseUrl}/city/citysave`, payload)
  //       .subscribe({
  //         next: () => {
  //           alert('City added successfully');
  //           this.loadCities();
  //           this.resetForm();
  //         },
  //         error: err => console.error('Save failed:', err, payload)
  //       });
  //   }
  // }



  // ---- VIEW ----
  onView(cityid: number) {
    this.http.get<any[]>(`${this.baseUrl}/city/list`).subscribe({
      next: (res) => {
        const city = res.find(c => c.cityid === cityid);
        if (!city) {
          alert(`City with ID ${cityid} not found`);
          return;
        }
        const userId = sessionStorage.getItem('userId');
        const created = city.createddate ? new Date(city.createddate) : null;
        const updated = city.updateddate ? new Date(city.updateddate) : null;
        this.selectedCityId = city.cityid;
        this.isViewMode = true;
        this.showForm = true;
        this.cityForm.patchValue({
          ...city,
          createddate: created ? created.toISOString().substring(0, 10) : '',
          updateddate: updated ? updated.toISOString().substring(0, 10) : '',
          createdby: sessionStorage.getItem('userId') ?? '2',
          updatedby: sessionStorage.getItem('userId') ?? '2',



        });
        console.log("API createdDate:", city.createdDate, "API updatedDate:", city.updatedDate);
        this.cityForm.disable();
      },
      error: (err) => {
        console.error('Error fetching city:', err);
        alert('Failed to fetch city details.');
      }
    });
  }

  // ---- EDIT ----
  onEdit(cityid: number) {
    this.http.get<any[]>(`${this.baseUrl}/city/list`).subscribe({
      next: (res) => {
        const city = res.find(c => c.cityid === cityid);
        if (!city) {
          alert(`City with ID ${cityid} not found`);
          return;
        }
        const userId = sessionStorage.getItem('userId');

        const created = city.createddate ? new Date(city.createddate) : null;
        const updated = city.updateddate ? new Date(city.updateddate) : null;
        this.selectedCityId = city.cityid;
        this.isViewMode = false;
        this.showForm = true;
        this.cityForm.patchValue({
          ...city,
          createddate: created ? created.toISOString().substring(0, 10) : '',
          updateddate: updated ? updated.toISOString().substring(0, 10) : '',
          createdby: sessionStorage.getItem('userId') ?? '2',
          updatedby: sessionStorage.getItem('userId') ?? '2',

        });
        this.cityForm.enable();
        // disable system-managed fields
        // this.cityForm.get('cityid')?.disable();
        // this.cityForm.get('createddate')?.disable();
        // this.cityForm.get('updateddate')?.disable();
        // this.cityForm.get('createdby')?.disable();
        // this.cityForm.get('updatedby')?.disable();
      },
      error: (err) => {
        console.error('Error fetching city for edit:', err);
        alert('Failed to load city for edit.');
      }
    });
  }

  // ---- DELETE ----
  onDelete(cityid: number) {
    if (!confirm('Are you sure you want to delete this city?')) return;
    const citytid = cityid;
    console.log('citytid', citytid);

    this.http.delete(`${this.baseUrl}/city/citydelete/${citytid}`).subscribe({
      next: (res: any) => {
        console.log('Delete response:', res);
        if (res?.affected > 0) {
          alert('City deleted successfully.');
          this.loadCities(); // reload data

        } else {
          alert(`No city deleted. City ID ${citytid} may not exist.`);
        }
        // alert('City deleted successfully.');
        // this.loadCities(); // reload data from API
      },
      error: (err) => {
        console.error('Error deleting city:', err);
        alert('Failed to delete city.');
      }
    });
  }

  // ---- SUBMIT (CREATE/UPDATE) ----
  onSubmit() {
    if (this.cityForm.invalid) {
      this.cityForm.markAllAsTouched();
      alert('Please fill required fields.');
      return;
    }

    const userId = sessionStorage.getItem('userId');

    console.log(userId);

    const payload = {
      ...this.cityForm.getRawValue(),
      createdby: sessionStorage.getItem('userId') ?? '2',
      updatedby: sessionStorage.getItem('userId') ?? '2',
      createddate: new Date().toISOString(),
      updateddate: new Date().toISOString(),
      isactive: true
    };

    if (this.selectedCityId) {
      // UPDATE
      payload.cityid = this.selectedCityId;
      this.http.put(`${this.baseUrl}/city/cityupdate`, payload).subscribe({
        next: () => {
          alert('City updated successfully!');
          this.loadCities();
          this.resetForm();
        },
        error: (err) => {
          console.error('Update failed:', err);
          alert('Failed to update city.');
        }
      });
    } else {
      // CREATE
      
      this.http.post(`${this.baseUrl}/city/citysave`, payload).subscribe({
        next: () => {
          alert('City created successfully!');
          this.loadCities();
          this.resetForm();
        },
        error: (err) => {
          console.error('Create failed:', err);
          alert('Failed to create city.');
        }
      });
    }
  }

  onAddAccount() {
    this.showForm = true;
    this.cityForm.reset(); // Clear form
  }

  onCancel() {
    this.showForm = false;
  }

  openForm() {
    this.showForm = true;
    this.cityForm.reset(); // optional: clear form
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




























}
