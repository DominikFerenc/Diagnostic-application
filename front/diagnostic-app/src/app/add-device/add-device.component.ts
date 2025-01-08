import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DeviceService } from '../device.service';

@Component({
  selector: 'app-add-device',
  standalone: false,
  
  templateUrl: './add-device.component.html',
  styleUrl: './add-device.component.css'
})
export class AddDeviceComponent {
  deviceForm: FormGroup; 

  constructor(private formBuilder: FormBuilder, private deviceService: DeviceService){
    this.deviceForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      ip_address: ['', [Validators.required, Validators.pattern(/^(?:\d{1,3}\.){3}\d{1,3}$/)]],
    });
  }

  addDevice() {
    if(this.deviceForm.valid){
      this.deviceService.addDevice(this.deviceForm.value).subscribe(() => {
        this.deviceForm.reset(); 
        console.log("urzdzenie zosta dodane")
      })
    }
    
  }

}
