import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageExchangeService } from "../../services/message-exchange.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  message: any;
  subscription: Subscription;
  isKeyboardActive = false;

  constructor(
    private messageExchangeService: MessageExchangeService
  ) { }

  ngOnInit(): void {
    this.subscription = this.messageExchangeService.currentMessage.subscribe(message => this.message = message);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Broadcast message to create a new box
	createBox(): void {
    if (this.isKeyboardActive) {
      this.messageExchangeService.changeMessage({ createNewBox: true });
    }
  }

  // Toogles the state of keyboard from  active to inacctive and vice versa
  toggleKeyboard(): void {
		this.isKeyboardActive = !this.isKeyboardActive;

    this.messageExchangeService.changeMessage({
      keyboardActive: this.isKeyboardActive
    });
	}
}
