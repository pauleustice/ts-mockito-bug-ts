import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProviderOne {
  observable$: BehaviorSubject<string> = new BehaviorSubject('realproviderOneObservableValue');
}
