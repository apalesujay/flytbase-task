import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { MessageExchangeService } from '../../services/message-exchange.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-fence',
	templateUrl: './fence.component.html',
	styleUrls: ['./fence.component.scss'],
})
export class FenceComponent implements OnInit, OnDestroy {
	subscription: Subscription;
	boxes = [];
	lastBoxId = 0;
	selectedBoxId = 0;
	movePositionBy = 10;
	isKeyboardActive = false;

	constructor(private messageExchangeService: MessageExchangeService) { }

	ngOnInit(): void {
		this.subscription = this.messageExchangeService.currentMessage.subscribe(
			(message) => {
				if (message.createNewBox) {
					this.addBox();
				}

				if (message.keyboardActive !== undefined) {
					this.isKeyboardActive = message.keyboardActive;
				}
			}
		);
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	// Listens keydown events
	@HostListener('document:keydown', ['$event'])
	handleKeyDownEvent(event: any): void {
		if (this.isKeyboardActive) {
			// If keycode is 46 i.e. delete key then remove the selected box, else move the element
			if (event.keyCode === 46) {
				const index = this.boxes.findIndex((box, index) => {
					box.id === this.selectedBoxId;
				});

				this.removeBox(index);

				// Shift focus from deleted element to first element of boxes array
				if (this.boxes[0]) {
					this.selectedBoxId = this.boxes[0].id;
				}
			} else {
				this.move(event);
			}
		}
	}

	// Selects the box when cliked on a box
	selectBox = (index: number): void => {
    if (this.isKeyboardActive) {
      const box = this.boxes[index];
      this.selectedBoxId = box.id;
    }
	};

	// Removes box object from the array
	removeBox = (index: number): void => {
		const removed = this.boxes.splice(index, 1);
	};

	// Adds a box object to the boxes array
	addBox = (): void => {
		this.lastBoxId += 1;
		const newBox = { id: this.lastBoxId };
		this.boxes.push(newBox);
	};

	// Moves selected box inside the fence
  move = (event: any): void => {
    if (this.boxes.length === 0 || this.selectedBoxId === 0) {
      return;
    }

		const selectedBoxElement = document.getElementById(`box${this.selectedBoxId}`);

    const fenceElementPosition = document
      .getElementById('fence')
      .getBoundingClientRect();

    const selectedBoxElementPosition = selectedBoxElement
      .getBoundingClientRect();

    let transform = selectedBoxElement.style.transform;
    let leftRight = 0, upDown = 0;
    let matches = transform.match(/-?\d+/g);
    if (matches !== null) {
      leftRight = +matches[0];
      upDown = +matches[1];
    }

    // Move left
    if (event.keyCode === 37 || event.keyCode === 65) {
      if (fenceElementPosition.left < selectedBoxElementPosition.left - this.movePositionBy) {
        leftRight -= 10;
      }
    }

    // Move right
    if (event.keyCode === 39 || event.keyCode === 68) {
      if (fenceElementPosition.right > selectedBoxElementPosition.right) {
        leftRight += 10;
      }
    }

    // Move up
    if (event.keyCode === 38 || event.keyCode === 87) {
      if (fenceElementPosition.top < selectedBoxElementPosition.top - this.movePositionBy) {
        upDown -= 10;
      }
    }

    // Mode down
    if (event.keyCode === 40 || event.keyCode === 83) {
      if (fenceElementPosition.bottom > selectedBoxElementPosition.bottom) {
        upDown += 10;
      }
    }

    selectedBoxElement.style.transform = `translate(${leftRight}px,${upDown}px)`;
  }
}
