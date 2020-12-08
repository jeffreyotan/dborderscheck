import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { OrderDetails } from './models';

@Injectable()
export class WebServices {

    svrUrl: string = "http://localhost:3000/order/total";

    constructor(private http: HttpClient) {}

    async getFormDetails(orderId): Promise<OrderDetails> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        const results = await this.http.get(`${this.svrUrl}/${orderId}`, httpOptions).toPromise();
        return results[0];
    }

}