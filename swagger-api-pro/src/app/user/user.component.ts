import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})


export class UserComponent implements OnInit {

  userForm!: FormGroup;
  baseUrl = 'http://49.50.112.46:3002';
  users: any[] = [];
  showForm: boolean = false;
  isViewMode: boolean = false;
  userCount: number | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      usermobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      useremail: ['', [Validators.required, Validators.email]],
      useraddress: [''],
      usercity: [''],
      userstate: [''],
      usercountry: [''],
      userpincode: [''],
      userrole: [''],
      createdby: [''],
      updatedby: [''],

      userasaamount: [''],
      userpassword: ['', Validators.required],
      userforgotpwquest: [''],
      userforgotpwans: [''],

      accountid: [''],
      instanceid: [''],
      cityid: [''],
      // userroleid: ['']
    });

    this.loadUsers();
    this.loadUserCount()
  }


  loadUsers() {
    this.http.get<any[]>(`${this.baseUrl}/user/list`).subscribe({
      next: (data) => {
        console.log('Users fetched:', data);
        this.users = data;
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

  onView(userid: number) {
    this.http.get<any>(`${this.baseUrl}/user/list`).subscribe({
      next: (res) => {
        // Find the user by ID
        const user = res.find((u: { userid: number }) => u.userid === userid);
        if (!user) {
          alert(`User with ID ${userid} not found`);
          return;
        }

        console.log('Viewing user:', user);

        // Load the user data into the form
        this.userForm.patchValue({
          accountid: user.accountid,
          cityid: user.cityid,
          instanceid: user.instanceid,
          username: user.username,
          usermobile: user.usermobile,
          useremail: user.useremail,
          useraddress: user.useraddress,
          usercity: user.usercity,
          userstate: user.userstate,
          usercountry: user.usercountry,
          userpincode: user.userpincode,
          userrole: user.userrole,
          // userroleid: user.userroleid,
          userasaamount: user.userasaamount,
          userasaenddate: user.userasaenddate,
          userpassword: user.userpassword,
          userforgotpwquest: user.userforgotpwquest,
          userforgotpwans: user.userforgotpwans,
          userisactive: user.userisactive,
          createdby: user.createdby,
          updatedby: user.updatedby,
          // userid:user.userid
        });

        // Disable the form to prevent editing
        this.userForm.disable();

        this.isViewMode = true;

        // Optionally, show the form if hidden
        this.showForm = true;
      },
      error: (err) => console.error('Error fetching user:', err)
    });
  }



  // Edit user details
  onEdit(userid: number) {
    this.showForm = true;

    console.log('Editing user with ID:', userid);
    // You can prefill form fields here
  }

  // Delete user
  onDelete(userid: number) {
    if (confirm(`Are you sure you want to delete User ID ${userid}?`)) {
      this.http.delete(`${this.baseUrl}/user/userdelete/${userid}`).subscribe({
        next: () => {
          alert('User deleted successfully!');
          this.loadUsers(); // refresh list
        },
        error: (err) => console.error('Error deleting user:', err)
      });
    }
  }


  onSubmit() {
    if (this.userForm.invalid) {
      alert('Please fill required fields.');
      return;
    }

    const formData = this.userForm.value;

    const payload = {
      ...formData,
      //  createdby: "1",
      //  updatedby: "1",
      // createddate: new Date().toISOString(),
      // updateddate: new Date().toISOString(),
      // userasaenddate:new Date().toISOString(),
      // userisactive: true
      accountid: String(formData.accountid),
      cityid: String(formData.cityid),
      instanceid: String(formData.instanceid),
      // userroleid: String(formData.userroleid),
      createdby: "2",  // or dynamic from sessionStorage
      updatedby: "2",
      createddate: new Date().toISOString(),
      updateddate: new Date().toISOString(),
      userasaenddate: new Date().toISOString(),
      userisactive: true
    };
    console.log('Payload to send:', payload);
    const uname = payload.username;
    


    this.http.post<any>(`${this.baseUrl}/user/usersave`, payload).subscribe({
      next: (res) => {
        console.log('User created:', res);
        
        console.log('User name:');
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
    this.userForm.enable();
    this.isViewMode = false;
    this.userForm.reset(); // optional: clear form
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



}