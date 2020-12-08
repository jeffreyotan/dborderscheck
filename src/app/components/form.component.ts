import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderDetails } from '../models';
import { WebServices } from '../web.services';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  form: FormGroup;
  orderDetails: OrderDetails;

  isClicked: boolean;

  constructor(private fb: FormBuilder, private webSvc: WebServices) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      orderId: this.fb.control('', [ Validators.required ])
    });

    this.orderDetails = {
      id: 0,
      order_date: "",
      customer_id: 0,
      total_quantity: "",
      total_unit_price: "",
      total_discount: 0,
      cost_price: ""
    }

    this.isClicked = false;
  }

  async onClickLookUp() {
    const orderRetrieved = await this.webSvc.getFormDetails(this.form.get('orderId').value) as OrderDetails;
    // console.info('=> Order Retrieved: ', orderRetrieved);

    if(orderRetrieved) {
      this.orderDetails = {
        id: orderRetrieved.id,
        order_date: orderRetrieved.order_date,
        customer_id: orderRetrieved.customer_id,
        total_quantity: orderRetrieved.total_quantity,
        total_unit_price: orderRetrieved.total_unit_price,
        total_discount: orderRetrieved.total_discount,
        cost_price: orderRetrieved.cost_price
      };

      // console.info('=> orderDetails: ', this.orderDetails);
      this.isClicked = true;
    }
  }

}
