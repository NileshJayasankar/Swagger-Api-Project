import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.scss']
})
export class InstanceComponent implements OnInit {

  instanceForm!: FormGroup;
  instances: any[] = [];
  accountList: any[] = [];
  selectedInstanceId: number | null = null;
  showForm: boolean = false;
  isViewMode: boolean = false;
  instanceCount: number | null = null;

  baseUrl = 'http://49.50.112.46:3002';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.instanceForm = this.fb.group({
      instancename: ['', Validators.required],
      ownername: ['', Validators.required],
      ownermobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      owneremail: ['', [Validators.required, Validators.email]],
      accountid: ['', Validators.required],
      // licensecount: ['', Validators.required],
      managername: ['', Validators.required],
      manageremail: ['', [Validators.required, Validators.email]],
      managermobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      instanceaddress: [''],
      instancecity: [''],
      instancestate: [''],
      instancecountry: [''],
      instancepincode: [''],
      createddate: [''],
      updateddate: [''],
      cityid: [''],
      instancesalesdate: [''],
      instanceasaenddate: [''],
      instanceasaamount: [''],
      instancesalesamount: [''],
      instancegstno:[''],
      instancevatno:[''],
      // createddate: [''],
      // updateddate: [''],
      createdby: [''],
      updatedby: [''],
      instancefssaino:[''],
      
    });

    this.getAccounts();

    this.loadInstances();

    this.loadinstancecount();

    
  }

  // Fetch all accounts for dropdown
  getAccounts() {
    this.http.get<any[]>(`${this.baseUrl}/account/list`).subscribe({
      next: (res) => {
        this.accountList = res;
      },
      error: (err) => {
        console.error('Error loading accounts:', err);
      }
    });
  }


  onAccountSelect(event: any) {
    const selectedAccountId = event.target.value;
    if (!selectedAccountId) return;

    // Find selected account from the list
    const selectedAccount = this.accountList.find(acc => acc.accountid == selectedAccountId);
    if (selectedAccount) {
      this.instanceForm.patchValue({
        ownername: selectedAccount.ownername || '',
        ownermobile: selectedAccount.ownermobile || '',
        owneremail: selectedAccount.owneremail || '',
        instanceaddress: selectedAccount.companyaddress || '',
        instancecity: selectedAccount.companycity || '',
        instancestate: selectedAccount.companystate || '',
        instancecountry: selectedAccount.companycountry || '',
        instancepincode: selectedAccount.companypincode || '',
        cityid: selectedAccount.cityid || ''
      });
    }
  }

  loadInstances() {
    this.http.get<any[]>(`${this.baseUrl}/instance/list`).subscribe({
      next: data => this.instances = data,
      error: err => console.error('Error fetching instances:', err)
    });
  }

  onView(instanceid: number) {
    this.http.get<any[]>(`${this.baseUrl}/instance/list`).subscribe({
      next: (res) => {
        const instance = res.find(i => i.instanceid === instanceid);
        if (!instance) {
          alert('Instance not found');
          return;
        }

        const created = instance.createddate ? new Date(instance.createddate) : null;
        const updated = instance.updateddate ? new Date(instance.updateddate) : null;
        const instancesalesdate = instance.instancesalesdate ? new Date(instance.instancesalesdate) : null;
        const instanceasaenddate = instance.instanceasaenddate ? new Date(instance.instanceasaenddate) : null ;

        this.selectedInstanceId = instance.instanceid;
        this.isViewMode = true;
        this.showForm = true;
        // this.instanceForm.patchValue(instance);
        this.instanceForm.patchValue({
          ...instance,
          instanceasaenddate : instanceasaenddate ? instanceasaenddate.toISOString().substring(0, 10) : '',
          instancesalesdate: instancesalesdate ? instancesalesdate.toISOString().substring(0, 10) : '',
          createddate: created ? created.toISOString().substring(0, 10) : '',
          updateddate: updated ? updated.toISOString().substring(0, 10) : '',
          // createddate: new Date().toISOString(),
          // updateddate: new Date().toISOString(),
        });
        this.instanceForm.disable();
      },
      error: err => console.error('View error:', err)
    });
  }

  onEdit(instanceid: number) {
    this.http.get<any[]>(`${this.baseUrl}/instance/list`).subscribe({
      next: (res) => {
        const instance = res.find(i => i.instanceid === instanceid);
        if (!instance) {
          alert('Instance not found');
          return;
        }

        const created = instance.createddate ? new Date(instance.createddate) : null;
        const updated = instance.updateddate ? new Date(instance.updateddate) : null;
        const instancesalesdate = instance.instancesalesdate ? new Date(instance.instancesalesdate) : null;
        const instanceasaenddate = instance.instanceasaenddate ? new Date(instance.instanceasaenddate) : null ;

        this.selectedInstanceId = instance.instanceid;
        this.isViewMode = false;
        this.showForm = true;
        // this.instanceForm.patchValue(instance);
        this.instanceForm.patchValue({
          ...instance,
          instanceasaenddate : instanceasaenddate ? instanceasaenddate.toISOString().substring(0, 10) : '',
          instancesalesdate: instancesalesdate ? instancesalesdate.toISOString().substring(0, 10) : '',
          createddate: created ? created.toISOString().substring(0, 10) : '',
          updateddate: updated ? updated.toISOString().substring(0, 10) : '',
        })
        this.instanceForm.enable();
      },
      error: err => console.error('Edit error:', err)
    });
  }

  onDelete(instanceid: number) {
    if (!confirm('Are you sure you want to delete this instance?')) return;

    this.http.delete(`${this.baseUrl}/instance/instancedelete/${instanceid}`).subscribe({
      next: (res: any) => {
        alert('Instance deleted successfully');
        this.loadInstances();
      },
      error: err => console.error('Delete error:', err)
    });
  }

  onSubmit() {
    if (this.instanceForm.invalid) {
      this.instanceForm.markAllAsTouched();
      alert('Please fill all required fields.');
      return;
    }

    const userId = sessionStorage.getItem('userId');
    console.log(userId);

    const payload = {
      ...this.instanceForm.getRawValue(),
      instancesalesdate:new Date().toISOString(),
      instanceasaenddate:new Date().toISOString(),

      createddate: new Date().toISOString(),
      updateddate: new Date().toISOString(),
      createdby: sessionStorage.getItem('userId') ?? '2',
      updatedby: sessionStorage.getItem('userId') ?? '2',
      isactive: true
    };

    if (this.selectedInstanceId) {
      // UPDATE
      payload.instanceid = this.selectedInstanceId;
      this.http.put(`${this.baseUrl}/instance/instanceupdate`, payload).subscribe({
        next: () => {
          alert('Instance updated successfully!');
          this.loadInstances();
          this.showForm = false;
        },
        error: err => console.error('Update error:', err)
      });
    } else {
      // CREATE
      this.http.post(`${this.baseUrl}/instance/instancesave`, payload).subscribe({
        next: () => {
          alert('Instance added successfully!');
          this.loadInstances();
          this.showForm = false;
        },
        error: err => console.error('Save error:', err)
      });
    }


  }

  onAddInstance() {
    this.showForm = true;
    this.instanceForm.reset();
    this.selectedInstanceId = null;
    this.instanceForm.enable();
  }

  onCancel() {
    this.showForm = false;
  }

  openForm() {
    this.showForm = true;
    this.instanceForm.reset(); // optional: clear form
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








}
