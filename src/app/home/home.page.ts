import {Component, ViewEncapsulation} from '@angular/core';

declare var SqPaymentForm: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomePage {

  constructor() {}

  paymentForm;

  ionViewDidEnter() {
    // Create and initialize a payment form object
    // @ts-ignore
    this.paymentForm = new SqPaymentForm({
      // Initialize the payment form elements

      applicationId: 'sandbox-sq0idb-E8M9kTBAkqa0SActJIa6OQ',
      inputClass: 'sq-input',
      autoBuild: false,
      // Customize the CSS for SqPaymentForm iframe elements
      inputStyles: [{
        fontSize: '16px',
        lineHeight: '24px',
        padding: '16px',
        placeholderColor: '#a0a0a0',
        backgroundColor: 'transparent',
      }],
      // Initialize the credit card placeholders
      cardNumber: {
        elementId: 'sq-card-number',
        placeholder: 'Card Number'
      },
      cvv: {
        elementId: 'sq-cvv',
        placeholder: 'CVV'
      },
      expirationDate: {
        elementId: 'sq-expiration-date',
        placeholder: 'MM/YY'
      },
      postalCode: {
        elementId: 'sq-postal-code',
        placeholder: 'Postal'
      },
      // SqPaymentForm callback functions
      callbacks: {
        /*
        * callback function: cardNonceResponseReceived
        * Triggered when: SqPaymentForm completes a card nonce request
        */
        cardNonceResponseReceived: (errors, nonce, cardData) => {
          if (errors) {
            // Log errors from nonce generation to the browser developer console.
            console.error('Encountered errors:');
            errors.forEach(error => {
              console.error('  ' + error.message);
            });
            alert('Encountered errors, check browser developer console for more details');
            return;
          }
          alert(`The generated nonce is:\n${nonce}`);
        }
      }
    });
    this.paymentForm.build();
  }

  onGetCardNonce(event) {
    // Don't submit the form until SqPaymentForm returns with a nonce
    event.preventDefault();
    // Request a nonce from the SqPaymentForm object
    this.paymentForm.requestCardNonce();
  }
}
