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
    const orderRetrieved: OrderDetails = await this.webSvc.getFormDetails(this.form.get('orderId').value) as OrderDetails;
    // console.info('=> Order Retrieved: ', orderRetrieved);

    if(orderRetrieved.length > 0) {
      this.orderDetails = {
        id: orderRetrieved[0].id,
        order_date: orderRetrieved[0].order_date,
        customer_id: orderRetrieved[0].customer_id,
        total_quantity: orderRetrieved[0].total_quantity,
        total_unit_price: orderRetrieved[0].total_unit_price,
        total_discount: orderRetrieved[0].total_discount,
        cost_price: orderRetrieved[0].cost_price
      };

      // console.info('=> orderDetails: ', this.orderDetails);
      this.isClicked = true;
    }
  }

}
