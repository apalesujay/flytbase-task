import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Service for passing messages from  one component to another
@Injectable({
  providedIn: 'root'
})
export class MessageExchangeService {
  private messageSource = new BehaviorSubject({ createNewBox: false, keyboardActive: false });
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: any) {
    this.messageSource.next(message);
  }
}
