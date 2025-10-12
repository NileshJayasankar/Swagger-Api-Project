import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vat',
  templateUrl: './vat.component.html',
  styleUrls: ['./vat.component.scss']
})

export class VatComponent implements OnInit{

  vatForm!: FormGroup;
  vatList: any[] = [];
  selectedVatId: number | null = null;
  showForm: boolean = false;
  isViewMode: boolean = false;

  baseUrl = 'http://49.50.112.46:3002';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.vatForm = this.fb.group({
      vatpercent: ['', Validators.required],
      createddate: [''],
      updateddate: [''],
      createdby: [''],
      updatedby: [''],
      // gstisactive: [true]
    });

    this.loadVatList();
  }

  // Load all VAT entries
  loadVatList() {
    this.http.get<any[]>(`${this.baseUrl}/vat/list`).subscribe({
      next: (res) => this.vatList = res,
      error: (err) => console.error('Error loading VAT list:', err)
    });
  }

  // ---- VIEW ----
  onView(vatid: number) {
    this.http.get<any[]>(`${this.baseUrl}/vat/list`).subscribe({
      next: (res) => {
        const vat = res.find(v => v.vatid === vatid);
        if (!vat) {
          alert(`VAT record with ID ${vatid} not found.`);
          return;
        }

        this.selectedVatId = vat.vatid;
        this.isViewMode = true;
        this.showForm = true;

        this.vatForm.patchValue({
          ...vat,
          createddate: vat.createddate ? new Date(vat.createddate).toISOString().substring(0, 10) : '',
          updateddate: vat.updateddate ? new Date(vat.updateddate).toISOString().substring(0, 10) : '',
        });

        this.vatForm.disable();
      },
      error: (err) => console.error('Error viewing VAT:', err)
    });
  }

  // ---- EDIT ----
  onEdit(vatid: number) {
    this.http.get<any[]>(`${this.baseUrl}/vat/list`).subscribe({
      next: (res) => {
        const vat = res.find(v => v.vatid === vatid);
        if (!vat) {
          alert(`VAT record with ID ${vatid} not found.`);
          return;
        }

        this.selectedVatId = vat.vatid;
        this.isViewMode = false;
        this.showForm = true;

        this.vatForm.patchValue({
          ...vat,
          createddate: vat.createddate ? new Date(vat.createddate).toISOString().substring(0, 10) : '',
          updateddate: vat.updateddate ? new Date(vat.updateddate).toISOString().substring(0, 10) : '',
        });

        this.vatForm.enable();
      },
      error: (err) => console.error('Error editing VAT:', err)
    });
  }

  // ---- DELETE ----
  onDelete(vatid: number) {
    if (!confirm('Are you sure you want to delete this VAT record?')) return;

    this.http.delete(`${this.baseUrl}/vat/vatdelete/${vatid}`).subscribe({
      next: (res: any) => {
        alert('VAT deleted successfully!');
        this.loadVatList();
      },
      error: (err) => console.error('Error deleting VAT:', err)
    });
  }

  // ---- CREATE / UPDATE ----
  onSubmit() {
    if (this.vatForm.invalid) {
      this.vatForm.markAllAsTouched();
      alert('Please fill all required fields.');
      return;
    }

    const userId = sessionStorage.getItem('userId');
    const payload = {
      ...this.vatForm.getRawValue(),
      createddate: new Date().toISOString(),
      updateddate: new Date().toISOString(),
      createdby: userId,
      updatedby: userId,
      userid:userId,
      vatisactive:true
    };

    if (this.selectedVatId) {
      // Update
      payload.vatid = this.selectedVatId;
      this.http.put(`${this.baseUrl}/vat/vatupdate`, payload).subscribe({
        next: () => {
          alert('VAT updated successfully!');
          this.loadVatList();
          this.resetForm();
        },
        error: (err) => console.error('Update failed:', err)
      });
    } else {
      // Create
      this.http.post(`${this.baseUrl}/vat/vatsave`, payload).subscribe({
        next: () => {
          alert('VAT created successfully!');
          this.loadVatList();
          this.resetForm();
        },
        error: (err) => console.error('Create failed:', err)
      });
    }
  }

  // ---- HELPERS ----
  openForm() {
    this.showForm = true;
    this.isViewMode = false;
    this.vatForm.enable();
    this.vatForm.reset();
  }

  onCancel() {
    this.showForm = false;
    this.isViewMode = false;
    this.selectedVatId = null;
  }

  resetForm() {
    this.vatForm.reset();
    this.showForm = false;
    this.selectedVatId = null;
  }

}
