import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-userrole',
  templateUrl: './userrole.component.html',
  styleUrls: ['./userrole.component.scss']
})
export class UserroleComponent implements OnInit {

  userroleForm!: FormGroup;
  baseUrl = 'http://49.50.112.46:3002';
  userroles: any[] = [];
  showForm: boolean = false;
  isViewMode: boolean = false;
  userroleCount: number | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.userroleForm = this.fb.group({
      userrolename: ['', Validators.required],
      
      // userrole: [''],
      createdby: [''],
      updatedby: [''],

      

      accountid: [''],
      instanceid: [''],
      
      // userroleid: ['']
    });

    this.loadUsers();
    this.loadUserCount()
  }


  loadUsers() {
    this.http.get<any[]>(`${this.baseUrl}/userrole/list`).subscribe({
      next: (data) => {
        console.log('Users fetched:', data);
        this.userroles = data;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  // View user details
  // onView(userid: number) {
  //   this.http.get<any>(`${this.baseUrl}/user/list`).subscribe({
  //     next: (res) => {
  //       const user = res.find((u: { userid: number; }) => u.userid === userid);
  //       if (!user) {
  //         alert(`User with ID ${userid} not found`);
  //         return;
  //       }
  //       console.log('Viewing user:', user);
  //       alert(JSON.stringify(user, null, 2));
  //     },
  //     error: (err) => console.error('Error fetching user:', err)
  //   });
  // }

  onView(userroleid: number) {
    this.http.get<any>(`${this.baseUrl}/userrole/list`).subscribe({
      next: (res) => {
        // Find the user by ID
        const userroles = res.find((u: { userroleid: number }) => u.userroleid === userroleid);
        if (!userroles) {
          alert(`User with ID ${userroleid} not found`);
          return;
        }

        console.log('Viewing user:', userroles);

        // Load the user data into the form
        this.userroleForm.patchValue({
          accountid: userroles.accountid,
          userrolename:userroles.userrolename,
          
          instanceid: userroles.instanceid,
          username: userroles.username,
          
          
          // userrole: userroles.userrole,
          // userroleid: user.userroleid,
          
          userisactive: userroles.userisactive,
          createdby: userroles.createdby,
          updatedby: userroles.updatedby,
          // userid:user.userid
        });

        // Disable the form to prevent editing
        this.userroleForm.disable();

        this.isViewMode = true;

        // Optionally, show the form if hidden
        this.showForm = true;
      },
      error: (err) => console.error('Error fetching user:', err)
    });
  }



  // Edit user details
  onEdit(userroleid: number) {
    this.showForm = true;

    console.log('Editing user with ID:', userroleid);
    // You can prefill form fields here
  }

  // Delete user
  onDelete(userroleid: number) {
    if (confirm(`Are you sure you want to delete User ID ${userroleid}?`)) {
      this.http.delete(`${this.baseUrl}/user/userdelete/${userroleid}`).subscribe({
        next: () => {
          alert('User deleted successfully!');
          this.loadUsers(); // refresh list
        },
        error: (err) => console.error('Error deleting user:', err)
      });
    }
  }


  onSubmit() {
    if (this.userroleForm.invalid) {
      alert('Please fill required fields.');
      return;
    }

    const formData = this.userroleForm.value;

    const payload = {
      ...formData,
      //  createdby: "1",
      //  updatedby: "1",
      // createddate: new Date().toISOString(),
      // updateddate: new Date().toISOString(),
      // userasaenddate:new Date().toISOString(),
      // userisactive: true
      accountid: String(formData.accountid),
      // cityid: String(formData.cityid),
      instanceid: String(formData.instanceid),
      // userroleid: String(formData.userroleid),
      createdby: "2",  // or dynamic from sessionStorage
      updatedby: "2",
      createddate: new Date().toISOString(),
      updateddate: new Date().toISOString(),
      
      userisactive: true
    };
    console.log('Payload to send:', payload);
    const uname = payload.userrolename;
    


    this.http.post<any>(`${this.baseUrl}/userrole/userrolesave`, payload).subscribe({
      next: (res) => {
        console.log('User created:', res);
        
        console.log('Userrole name:');
        sessionStorage.setItem('uname', uname);
        
        const userId = res.raw[0].userid; // backend should return this
        sessionStorage.setItem('userId', userId);
        alert('User created successfully!');

      },

      error: (err) => {
        console.error('Error creating user:', err);
        alert('Failed to create user');
      }
    });
  }


  onCancel() {
    this.showForm = false;
  }

  openForm() {
    this.showForm = true;
    // this.userForm.reset();
    this.userroleForm.enable();
    this.isViewMode = false;
    this.userroleForm.reset(); // optional: clear form
  }

  loadUserCount() {
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



}
