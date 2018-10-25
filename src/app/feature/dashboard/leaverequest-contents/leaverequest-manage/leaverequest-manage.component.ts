import { LeaveType } from './../../model/leaveType';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject, concat, of } from 'rxjs';
import { EmployeeLeaveService } from './../../services/employeeLeave.service';
import { Component, OnInit } from '@angular/core';
import { LeaveTypeService } from '../../services/leaveType.service';
import { EmployeeLeave } from '../../model/EmployeeLeave';

@Component({
  selector: 'app-leaverequest-manage',
  templateUrl: './leaverequest-manage.component.html',
  styleUrls: ['./leaverequest-manage.component.css']
})
export class LeaverequestManageComponent implements OnInit {

  private create_leave_req_msg: string;
  public has_error = false;

  leaveTypes: Observable<any>;
  selectedLeaveType: LeaveType = null;
  leaveForm: FormGroup;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private _employeeLeaveService: EmployeeLeaveService, private _leaveTypeService: LeaveTypeService) { }

  ngOnInit() {
    this.leaveTypes = this._leaveTypeService.getAllLeaveTypes();

    this.leaveForm = this.formBuilder.group({
      leaveType: [, Validators.required],
      leaveReason: ['', [Validators.required, Validators.minLength(3)]],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });
  }

  get f() { return this.leaveForm.controls; }

  onSubmit() {
    this.submitted = true;

    console.log(this.leaveForm.value);

    // stop here if form is invalid
    if (this.leaveForm.invalid) {
      return;
    }
    let submissionData = { ...this.leaveForm.value, "leaveTypeDTO": { "leaveTypeId": this.leaveForm.value.leaveType } };
    console.log("success ", submissionData);

    this._employeeLeaveService.createEmployeeLeave(submissionData).subscribe(res => {
      // console.log("creation successful", res);
      this.has_error = false;
      this.create_leave_req_msg = "Leave Request succesfully Submitted";
    }, error => {
      console.log("leave creation error", error.error);
      this.has_error = true;
      this.create_leave_req_msg = error.error.message;
    });
  }

  createLeaveRequest(formData) {
    console.log("form data ", formData.value);
    let leave: EmployeeLeave = new EmployeeLeave("", "", this.selectedLeaveType, formData.value.leaveReason, formData.value.dateFrom, formData.value.dateTo, "", "", formData.value.status, "", "");
    let submissionData = { ...formData.value, "leaveTypeDTO": { "leaveTypeId": this.selectedLeaveType } };
    console.log("new form data ", leave);
    this._employeeLeaveService.createEmployeeLeave(formData.value).subscribe(res => {
      // console.log("creation successful", res);
      this.has_error = false;
      this.create_leave_req_msg = "Leave Request Created Succesfully";
    }, error => {
      console.log("leave creation error", error.error);
      this.has_error = true;
      this.create_leave_req_msg = error.error.message;
    });

  }

}