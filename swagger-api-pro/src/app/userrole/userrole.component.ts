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

  instances: any[] = [];
  accountList: any[] = [];
  showForm: boolean = false;
  isViewMode: boolean = false;
  userroleCount: number | null = null;
  selecteduserroleId: number | null = null;


  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.userroleForm = this.fb.group({
      userrolename: ['', Validators.required],

      // userrole: [''],
      createdby: [''],
      updatedby: [''],
      accountid: [''],
      instanceid: [''],



      accountname: [''],
      instancename: [''],

      // userroleid: ['']
    });
    this.getInstances();

    this.loadUserrole();

    this.loadUserroleCount();
    this.loadAccounts();
  }

  readonly displayModes = [{ text: "Display Mode 'full'", value: 'full' }, { text: "Display Mode 'compact'", value: 'compact' }];
  readonly allowedPageSizes = [5, 10, 'all'];
  displayMode = 'full';

  showPageSizeSelector = true;

  showInfo = true;

  showNavButtons = true;

   get isCompactMode() {
    return this.displayMode === 'compact';
  }


  loadUserrole() {
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

        console.log('Viewing userrole:', userroles);

         // ✅ Match account and instance names from existing lists
      // const selectedAccount = this.accountList?.find(
      //   (a: { accountid: number }) => a.accountid === userroles.accountid
      // );
      // const selectedInstance = this.instances?.find(
      //   (i: { instanceid: number }) => i.instanceid === userroles.instanceid
      // );

        


        // Load the user data into the form
        this.userroleForm.patchValue({
          accountname: userroles.accountid,
          // accountname: selectedAccount.companyname,
          userrolename: userroles.userrolename,

          instancename: userroles.instanceid,
          // instancename: selectedInstance.instancename,
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
    this.http.get<any[]>(`${this.baseUrl}/userrole/list`).subscribe({
      next: (res) => {
        const userrole = res.find(i => i.userroleid === userroleid);
        if (!userrole) {
          alert('user not found');
          return;
        }

        const created = userrole.createddate ? new Date(userrole.createddate) : null;
        const updated = userrole.updateddate ? new Date(userrole.updateddate) : null;

        // Find matching role name from your roles list
        //   const matchedRole = this.userroles.find(r =>
        //   r.userrolename === user.userrole || r.userroleid === user.userrole
        // );

        this.selecteduserroleId = userrole.userid;
        this.isViewMode = false;
        this.showForm = true;
        // this.instanceForm.patchValue(instance);
        this.userroleForm.patchValue({
          ...userrole,
          // userrolename: matchedRole ? matchedRole.userrolename : '',
          // userroleid: user.userroleid,
          createdby: sessionStorage.getItem('userId') ?? '2',
          updatedby: sessionStorage.getItem('userId') ?? '2',

          createddate: created ? created.toISOString().substring(0, 10) : '',
          updateddate: updated ? updated.toISOString().substring(0, 10) : '',
        })
        this.userroleForm.enable();

        this.loadUserrole();
      },
      error: err => console.error('Edit error:', err)
    });


  }


  // Delete user
  onDelete(userroleid: number) {
    if (confirm(`Are you sure you want to delete User ID ${userroleid}?`)) {
      this.http.delete(`${this.baseUrl}/userrole/userroledelete/${userroleid}`).subscribe({
        next: () => {
          alert('User deleted successfully!');
          this.loadUserrole(); // refresh list
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
      
      accountid: String(formData.accountname),
      // cityid: String(formData.cityid),
      instanceid: String(formData.instancename),
      // userroleid: String(formData.userroleid),
      createdby: "2",  // or dynamic from sessionStorage
      updatedby: "2",
      createddate: new Date().toISOString(),
      updateddate: new Date().toISOString(),

      userroleisactive: true
    };
    console.log('Payload to send:', payload);
    // const uname = payload.userrolename;



    this.http.post<any>(`${this.baseUrl}/userrole/userrolesave`, payload).subscribe({
      next: (res) => {
        console.log(res);

        alert('Userrole created successfully!');
        this.loadUserrole();

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

  getInstances() {
    this.http.get<any[]>(`${this.baseUrl}/instance/list`).subscribe({
      next: data => this.instances = data,
      error: err => console.error('Error fetching instances:', err)
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

  //  onInstanceSelect(event: any) {
  //   const selectedInstanceId = event.target.value;
  //   if (!selectedInstanceId) return;

  //   // Find selected account from the list
  //   const selectedInstance = this.instances.find(i => i.instanceid == selectedInstanceId);
  //   if (selectedInstance) {
  //     this.userroleForm.patchValue({
  //       accountid:selectedInstance.accountid || '',


  //     });
  //   }
  // }


  // onInstanceSelect(event: any) {
  //   const selectedInstanceId = event.target.value;
  //   if (!selectedInstanceId) return;

  //   // Find the selected instance
  //   const selectedInstance = this.instances.find(
  //     (i) => i.instanceid == selectedInstanceId
  //   );

  //   if (selectedInstance) {
  //     // Find matching account from your accounts list
  //     const selectedAccount = this.accountList?.find(
  //       (a) => a.accountid == selectedInstance.accountid
  //     );

  //     // Auto-patch only the accountname (companyname)
  //     this.userroleForm.patchValue({
  //       accountname: selectedAccount ? selectedAccount.companyname : ''
  //     });
  //   }
  // }

  onInstanceSelect(event: any) {
    const selectedInstanceName = event.target.value;
    if (!selectedInstanceName) return;

    // 1️⃣ Find the selected instance by name
    const selectedInstance = this.instances.find(
      (i) => i.instancename === selectedInstanceName
    );

    if (selectedInstance) {
      // 2️⃣ Extract accountid from the instance
      const accountid = selectedInstance.accountid;

      // 3️⃣ Find the account using that accountid
      const selectedAccount = this.accountList.find(
        (a) => a.accountid === accountid
      );

      // 4️⃣ Auto-patch only the accountname field (companyname)
      this.userroleForm.patchValue({
        accountname: selectedAccount ? selectedAccount.companyname : ''
      });
    } else {
      // Clear accountname if no matching instance found
      this.userroleForm.patchValue({ accountname: '' });
    }
  }




}
