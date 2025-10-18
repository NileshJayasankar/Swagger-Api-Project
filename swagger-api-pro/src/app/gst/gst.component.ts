import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import dxDataGrid from 'devextreme/ui/data_grid';


@Component({
  selector: 'app-gst',
  templateUrl: './gst.component.html',
  styleUrls: ['./gst.component.scss']
})
export class GstComponent implements OnInit {
  

  isViewMode: boolean = false;
  gstForm!: FormGroup;
  gstList:any[] = [];
  selectedGstId: number | null = null;
  showForm: boolean= false;
  currentEditIndex: number | null = null;
  gstCount: number | null = null;

  

  

  
  constructor(private fb: FormBuilder, private http: HttpClient) {}
  baseUrl = 'http://49.50.112.46:3002';

    ngOnInit(): void {
        this.gstForm = this.fb.group({
        
        totalgstpercent: [''],
        igstpercent: [''],
        cgstpercent: [''],
        sgstpercent: [''],
        ugstpercent: [''],
        chesspercent: [''],
        createddate: [''],
        updateddate: [''],
        createdby: [''],
        updatedby: [''],
        // userid: ['', Validators.required],
        gstisactive: ['true']
      });

      this.loadGsts();
      this.loadgstcount();
      this.resetForm();

    }

    loadGsts() {
      this.http.get<any[]>(`${this.baseUrl}/gst/list`).subscribe({
        next: data => this.gstList = data,
        error: err => console.error('Error fetching gst:', err)
      });
    }

    resetForm() {
    this.gstForm.reset();
    this.currentEditIndex = null;
    }
    


    // ---- VIEW ----
  onView(gstid: number) {
    this.http.get<any[]>(`${this.baseUrl}/gst/list`).subscribe({
      next: (res) => {
        const gst = res.find(g => g.gstid === gstid);
        if (!gst) {
          alert(`GST with ID ${gstid} not found`);
          return;
        }

        const created = gst.createddate ? new Date(gst.createddate) : null;
        const updated = gst.updateddate ? new Date(gst.updateddate) : null;
        this.selectedGstId = gst.gstid;
        this.isViewMode = true;
        this.showForm = true;
        this.gstForm.patchValue({
          ...gst,
          createddate: created ? created.toISOString().substring(0, 10) : '',
          updateddate: updated ? updated.toISOString().substring(0, 10) : '',
        });

        console.log("API createdDate:", gst.createddate, "API updatedDate:", gst.updateddate);
        this.gstForm.disable();
      },
      error: (err) => {
        console.error('Error fetching GST:', err);
        alert('Failed to fetch GST details.');
      }
    });
  }

  // ---- EDIT ----
  onEdit(gstid: number) {
    this.http.get<any[]>(`${this.baseUrl}/gst/list`).subscribe({
      next: (res) => {
        const gst = res.find(g => g.gstid === gstid);
        if (!gst) {
          alert(`GST with ID ${gstid} not found`);
          return;
        }

        const created = gst.createddate ? new Date(gst.createddate) : null;
        const updated = gst.updateddate ? new Date(gst.updateddate) : null;
        this.selectedGstId = gst.gstid;
        this.isViewMode = false;
        this.showForm = true;
        this.gstForm.patchValue({
          ...gst,
          createddate: created ? created.toISOString().substring(0, 10) : '',
          updateddate: updated ? updated.toISOString().substring(0, 10) : '',
          
        });

        this.gstForm.enable();
        
      },
      error: (err) => {
        console.error('Error fetching GST for edit:', err);
        alert('Failed to load GST for edit.');
      }
    });
  }

  // ---- DELETE ----
  onDelete(gstid: number):void {
    if (!confirm('Are you sure you want to delete this GST?')) return;

    this.http.delete(`${this.baseUrl}/gst/gstdelete/${gstid}`).subscribe({
      next: (res: any) => {
        console.log('Delete response:', res);
        if (res?.affected > 0) {
          alert('GST deleted successfully.');
          this.loadGsts(); // reload data
        } else {
          alert(`No GST deleted. GST ID ${gstid} may not exist.`);
        }
      },
      error: (err) => {
        console.error('Error deleting GST:', err);
        alert('Failed to delete GST.');
      }
    });
  }

  // ---- SUBMIT (CREATE/UPDATE) ----
  onSubmit() {
    if (this.gstForm.invalid) {
      this.gstForm.markAllAsTouched();
      alert('Please fill required fields.');
      return;
    }

    const userId = sessionStorage.getItem('userId');
    console.log(userId);

    const payload = {
      ...this.gstForm.getRawValue(),
      createddate: new Date().toISOString(),
      updateddate: new Date().toISOString(),
      createdby:userId ,
      updatedby: userId,
      userid:userId,
      gstisactive:true

    };

    if (this.selectedGstId) {
      // UPDATE
      payload.gstid = this.selectedGstId;
      this.http.put(`${this.baseUrl}/gst/gstupdate`, payload).subscribe({
        next: () => {
          alert('GST updated successfully!');
          this.loadGsts();
          this.resetForm();
        },
        error: (err) => {
          console.error('Update failed:', err);
          alert('Failed to update GST.');
        }
      });
    } else {
      // CREATE


      this.http.post(`${this.baseUrl}/gst/gstsave`, payload).subscribe({
        next: () => {
          alert('GST created successfully!');
          this.loadGsts();
          this.resetForm();
        },
        error: (err) => {
          console.error('Create failed:', err);
          alert('Failed to create GST.');
        }
      });
    }
  }

  // ---- HELPERS ----
  onAddGst() {
    this.showForm = true;
    this.gstForm.reset(); // Clear form
  }

  onCancel() {
    this.showForm = false;
  }

  openForm() {
    this.showForm = true;
    this.gstForm.reset(); // optional: clear form
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





