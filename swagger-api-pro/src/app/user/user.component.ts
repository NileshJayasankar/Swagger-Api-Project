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
  instances: any[] = [];
  accountList: any[] = [];
  cities: any[] = [];
  userroles: any[] = [];
  showForm: boolean = false;
  isViewMode: boolean = false;
  userCount: number | null = null;
  selecteduserId: number | null = null;
  userRoleCounts: { role: string, count: number }[] = [];

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
      userrolename: [''],
      createdby: [''],
      updatedby: [''],

      userasaamount: [''],
      userpassword: ['', Validators.required],
      userforgotpwquest: [''],
      userforgotpwans: [''],
      accountid: [''],
      instanceid: [''],

      accountname: [''],
      instancename: [''],
      cityid: [''],
      // userroleid: ['']
    });

    this.loadUsers();
    this.loadUserCount();
    this.getloadUserrole();
    this.getInstances();
    this.loadUserRoleCounts();
    this.loadAccounts();
  }

  loadInstances() {
    this.http.get<any[]>(`${this.baseUrl}/instance/list`).subscribe({
      next: data => this.instances = data,
      error: err => console.error('Error fetching instances:', err)
    });
  }


  loadUsers() {
    this.http.get<any[]>(`${this.baseUrl}/user/list`).subscribe({
      next: (data) => {
        console.log('Users fetched:', data);
        this.users = data;
      //   this.users = res.map(u => ({
      //   ...u,
      //   accountname: this.accountList.find(a => a.accountid == u.accountid)?.companyname || 'N/A',
      //   instancename: this.instances.find(i => i.instanceid == u.instanceid)?.instancename || 'N/A'
      // }));
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

        const matchedRole = this.userroles.find(r =>
          r.userrolename === user.userrole
        );

        // 2️⃣ Find the instance by ID
        const selectedInstance = this.instances.find(
          (i) => i.instanceid === user.instanceid
        );

        // 3️⃣ Find the account by ID
        const selectedAccount = this.accountList.find(
          (a) => a.accountid === user.accountid
        );

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
          userrolename: matchedRole ? matchedRole.userrolename : '',
          // userrole: user.userrole,
          // userroleid: user.userroleid,
          // accountname: selectedAccount ? selectedAccount.companyname : '',

          accountname: selectedAccount ? selectedAccount.companyname : '',
          instancename: selectedInstance ? selectedInstance.instancename : '',

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
    this.http.get<any[]>(`${this.baseUrl}/user/list`).subscribe({
      next: (res) => {
        const user = res.find(i => i.userid === userid);
        if (!user) {
          alert('user not found');
          return;
        }

        const created = user.createddate ? new Date(user.createddate) : null;
        const updated = user.updateddate ? new Date(user.updateddate) : null;

        // Find matching role name from your roles list
        const matchedRole = this.userroles.find(r =>
          r.userrolename === user.userrole || r.userroleid === user.userrole
        );

        this.selecteduserId = user.userid;
        this.isViewMode = false;
        this.showForm = true;
        // this.instanceForm.patchValue(instance);
        this.userForm.patchValue({
          ...user,
          userrolename: matchedRole ? matchedRole.userrolename : '',
          // userroleid: user.userroleid,

          // createdby: sessionStorage.getItem('userId') ?? '2',
          updatedby: sessionStorage.getItem('userId') ?? '2',

          createddate: created ? created.toISOString().substring(0, 10) : '',
          updateddate: updated ? updated.toISOString().substring(0, 10) : '',
        })
        this.userForm.enable();

        this.loadUsers();
      },
      error: err => console.error('Edit error:', err)
    });


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
    console.log("formData", formData);

    if (this.selecteduserId) {
      formData.userid = this.selecteduserId;
      this.http.put(`${this.baseUrl}/user/userupdate`, formData).subscribe({
        next: () => {
          alert('User updated successfully!');
          this.loadUsers();
          this.showForm = false;
          // this.resetForm();
        },
        error: (err) => console.error('Update error:', err)
      });
    } else {

      const payload = {
        ...formData,
        //  createdby: "1",
        //  updatedby: "1",
        // createddate: new Date().toISOString(),
        // updateddate: new Date().toISOString(),
        // userasaenddate:new Date().toISOString(),
        // userisactive: true
        userrole: formData.userrolename,
        // accountid: String(formData.accountname),
        accountid: formData.accountid,
        cityid: String(formData.cityid),
        // instanceid: String(formData.instancename),
        instanceid: formData.instanceid,
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
      console.log(uname);



      this.http.post<any>(`${this.baseUrl}/user/usersave`, payload).subscribe({
        next: (res) => {
          console.log('User created:', res);

          console.log('User name:');
          sessionStorage.setItem('uname', uname);

          const userId = res.raw[0].userid; // backend should return this
          sessionStorage.setItem('userId', userId);
          alert('User created successfully!');
          this.loadUsers();
          this.isViewMode = false;

        },

        error: (err) => {
          console.error('Error creating user:', err);
          alert('Failed to create user');
        }
      });

    }


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

  getInstances() {
    this.http.get<any[]>(`${this.baseUrl}/instance/list`).subscribe({
      next: data => this.instances = data,
      error: err => console.error('Error fetching instances:', err)
    });
  }

  getloadUserrole() {
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


  // onRoleChange(event: any): void {
  //   const selectedRoleName = event.target.value;
  //   const selected = this.userroles.find(r => r.userrolename === selectedRoleName);
  //   if (selected) {
  //     this.userForm.patchValue({

  //       userroleid: selected.userroleid
  //     });
  //   } else {
  //     // Clear fields if no city selected
  //     this.userForm.patchValue({

  //       userroleid: ''
  //     });
  //   }
  // }

  onRoleChange(event: any) {
    const selectedRoleName = event.target.value;

    const selectedRole = this.userroles.find(
      (r: any) => r.userrolename === selectedRoleName
    );

    if (selectedRole) {
      this.userForm.patchValue({
        userrolename: selectedRole.userrolename,
        // userroleid: selectedRole.userroleid  // only if needed
      });
    } else {
      this.userForm.patchValue({
        userrolename: '',
        // userroleid: ''
      });
    }

    console.log('Selected Role:', selectedRole);
  }





  // onInstanceSelect(event: any) {

  //   const selectedInstanceName = event.target.value;
  //   if (!selectedInstanceName) return;

  //   // Find selected account from the list
  //   // const selected = this.instances.find(i => i.instanceid == selectedId);
  //   const selectedInstance = this.instances.find(
  //     (i) => i.instancename === selectedInstanceName
  //   );
  //   if (selectedInstance) {
  //     const accountid = selectedInstance.accountid;

  //     // 3️⃣ Find the account using that accountid
  //     const selectedAccount = this.accountList.find(
  //       (a) => a.accountid === accountid
  //     );
  //     this.userForm.patchValue({
  //       // accountid: selectedInstance.accountid || '',
  //       accountname: selectedAccount ? selectedAccount.companyname : '',
  //       cityid: selectedInstance.cityid || '',
  //       usercity: selectedInstance.instancecity || '',
  //       userstate: selectedInstance.instancestate || '',
  //       usercountry: selectedInstance.instancecountry || '',
  //       userpincode: selectedInstance.instancepincode || '',
  //       useraddress: selectedInstance.instanceaddress || ''




  //     });

  //   }






  // }

  loadUserRoleCounts() {
    this.http.get<any[]>(`${this.baseUrl}/user/list`).subscribe(users => {
      // Count users per role
      const counts: { [key: string]: number } = {};

      users.forEach(user => {
        const roleName = user.userrole || 'Unknown'; // fallback
        if (counts[roleName]) {
          counts[roleName]++;
        } else {
          counts[roleName] = 1;
        }
      });

      // Convert to array for *ngFor
      this.userRoleCounts = Object.keys(counts).map(key => ({
        role: key,
        count: counts[key]
      }));
    });
  }

  loadAccounts(): void {
    this.http.get<any[]>(`${this.baseUrl}/account/list`).subscribe({


      next: (res) => {
        console.log('Account API response:', res);
        this.accountList = res;
      },
      error: (err) => console.error('Error loading accounts:', err)
    });
  }

  // onInstanceSelect(event: any) {
  //   const selectedValue = event.target.value;
  //   if (!selectedValue) return;

  //   // // ✅ Use instanceid if your dropdown [value]="i.instanceid"
  //   // const selectedInstance = this.instances.find(
  //   //   (i) => i.instanceid == selectedValue
  //   // );

  //   // ❗If your dropdown [value]="i.instancename", change to:
  //   const selectedInstance = this.instances.find((i) => i.instancename === selectedValue);

  //   if (selectedInstance) {
  //     const accountid = selectedInstance.accountid;

  //     // ✅ Use == to avoid type mismatch
  //     const selectedAccount = this.accountList.find(
  //       (a) => a.accountid == accountid
  //     );

  //     console.log('Selected Instance:', selectedInstance);
  //     console.log('Matched Account:', selectedAccount.companyname);

  //     this.userForm.patchValue({
  //       accountname: selectedAccount ? selectedAccount.companyname : ''
  //     });


  //     this.userForm.patchValue({
  //       accountname: selectedAccount ? selectedAccount.companyname : '',
  //       cityid: selectedInstance.cityid || '',
  //       usercity: selectedInstance.instancecity || '',
  //       userstate: selectedInstance.instancestate || '',
  //       usercountry: selectedInstance.instancecountry || '',
  //       userpincode: selectedInstance.instancepincode || '',
  //       useraddress: selectedInstance.instanceaddress || ''
  //     });
  //   } else {
  //     this.userForm.patchValue({
  //       accountname: '',
  //       cityid: '',
  //       usercity: '',
  //       userstate: '',
  //       usercountry: '',
  //       userpincode: '',
  //       useraddress: ''
  //     });
  //   }
  // }

  //   onInstanceSelect(event: any) {
  //   const selectedInstanceName = event.target.value;
  //   if (!selectedInstanceName) return;

  //   // 1️⃣ Find the selected instance by name
  //   const selectedInstance = this.instances.find(
  //     (i) => i.instancename === selectedInstanceName
  //   );

  //   if (selectedInstance) {
  //     // 2️⃣ Extract accountid from the instance
  //     const accountid = selectedInstance.accountid;

  //     // 3️⃣ Find the account using that accountid
  //     const selectedAccount = this.accountList.find(
  //       (a) => a.accountid == accountid
  //     );

  //     // 4️⃣ Patch all related fields
  //     this.userForm.patchValue({
  //       accountname: selectedAccount ? selectedAccount.companyname : '',
  //       cityid: selectedInstance.cityid || '',
  //       usercity: selectedInstance.instancecity || '',
  //       userstate: selectedInstance.instancestate || '',
  //       usercountry: selectedInstance.instancecountry || '',
  //       userpincode: selectedInstance.instancepincode || '',
  //       useraddress: selectedInstance.instanceaddress || ''
  //     });
  //   } else {
  //     // Clear all fields if no match
  //     this.userForm.patchValue({
  //       accountname: '',
  //       cityid: '',
  //       usercity: '',
  //       userstate: '',
  //       usercountry: '',
  //       userpincode: '',
  //       useraddress: ''
  //     });
  //   }
  // }

  onInstanceSelect(event: any) {
    const selectedInstanceName = event.target.value;
    if (!selectedInstanceName) return;

    // 1️⃣ Find the selected instance by its name
    const selectedInstance = this.instances.find(
      (i) => i.instancename === selectedInstanceName
    );

    if (selectedInstance) {
      // 2️⃣ Extract accountid from the instance
      const accountid = selectedInstance.accountid;

      // 3️⃣ Find the matching account from accountList
      const selectedAccount = this.accountList.find(
        (a) => a.accountid == accountid
      );

      console.log('Selected Account:', selectedAccount.companyname);

      // 4️⃣ Patch all related fields in one go
      this.userForm.patchValue({
        instanceid: selectedInstance.instanceid,        // ✅ store instanceid
        accountid: accountid,
        accountname: selectedAccount ? selectedAccount.companyname : '',
        cityid: selectedInstance.cityid || '',
        usercity: selectedInstance.instancecity || '',
        userstate: selectedInstance.instancestate || '',
        usercountry: selectedInstance.instancecountry || '',
        userpincode: selectedInstance.instancepincode || '',
        useraddress: selectedInstance.instanceaddress || ''
      });

    } else {
      // 5️⃣ Clear all fields if instance not found
      this.userForm.patchValue({
        accountname: '',
        cityid: '',
        usercity: '',
        userstate: '',
        usercountry: '',
        userpincode: '',
        useraddress: ''
      });
    }


  }






}


