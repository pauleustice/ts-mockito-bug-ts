import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProviderTwo {
  observable$: BehaviorSubject<string> = new BehaviorSubject('realproviderTwoObservableValue');
}
