import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

@Injectable()

export class FakeBackendStockListInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let stockList: any[] = JSON.parse(localStorage.getItem('stock-list')) || [];

    return of(null).pipe(mergeMap(() => {
      if (request.url.endsWith('/stock-list') && request.method === 'GET') {
        if (request.headers.get('Authorization') === 'Bearer fake-token') {
          return of(new HttpResponse({
            status: 200,
            body: stockList
          }));
        } else {
          return throwError({
            status: 401,
            error: {
              message: 'Unauthorised'
            }
          })
        }
      }

      if (request.url.match(/\/stock-list\/\d+$/) && request.method === 'GET') {
        if (request.headers.get('Authorization') === 'Bearer fake-token') {
          let urlParts = request.url.split('/');
          let id = parseInt(urlParts[urlParts.length - 1]);
          let matchedStocks = stockList.filter(stock => { return stock.id === id; });
          let stock = matchedStocks.length ? matchedStocks[0] : null;

          return of(new HttpResponse({ status: 200, body: stock }));
        } else {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }
      }

      return next.handle(request);
    }))
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());
  }
}

export let fakeBackendStockListProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendStockListInterceptor,
  multi: true
}