import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';

@Injectable()

export class FakeBackendOrdersInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let orders: any[] = JSON.parse(localStorage.getItem('orders')) || [];

        return of(null).pipe(mergeMap(() => {
            if (request.url.endsWith('/orders') && request.method === 'GET') {
                if (request.headers.get('Authorization') === 'Bearer fake-token') {
                    return of(new HttpResponse({ status: 200, body: orders }));
                } else {
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            if (request.url.match(/\/orders\/\d+$/) && request.method == 'GET') {
                if (request.headers.get('Authorization') === 'Bearer fake-token') {
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    let matchedOrders = orders.filter(order => { return order.id === id; });
                    let order = matchedOrders.length ? matchedOrders[0] : null;

                    return of(new HttpResponse({ status: 200, body: order }));
                } else {
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            if (request.url.endsWith('/orders/register') && request.method === 'POST') {
                let newOrder = request.body;

                newOrder.id = orders.length + 1;
                orders.push(newOrder);
                localStorage.setItem('orders', JSON.stringify(orders));

                return of(new HttpResponse({ status: 200 }));
            }
        }))
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }
}

export let fakeBackendOrdersProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendOrdersInterceptor,
    multi: true
}