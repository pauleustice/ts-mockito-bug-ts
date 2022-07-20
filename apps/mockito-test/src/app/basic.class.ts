import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProviderOne } from './provider-one.service';
import { ProviderTwo } from './provider-two.service';

export class BasicClass {
  observable$ = new BehaviorSubject('realObservableOne');
  observableTwo$ = new BehaviorSubject('realObservableTwo');
  providerOneObservable$: Observable<string> = this.providerOne.observable$;
  providerTwoObservable$: Observable<string> = this.providerTwo.observable$;

  whatIsCombineLatest = combineLatest.toString();

  combinedProviderObservable$: Observable<string> = combineLatest([
    this.providerOne.observable$,
    this.providerTwo.observable$,
    ]).pipe(
      map(([ second, third ]) => `${second}/${third}`),
    );

  localCombinedObservable$: Observable<string> = combineLatest([
    this.observable$,
    this.observableTwo$,
    ]).pipe(
      map(([ first, another ]) => `${first}/${another}`),
    );

  localCombinedObservableNoPipe$: Observable<Array<string>> = combineLatest([
    this.observable$,
    this.observableTwo$,
    ]);

  methodOne (input: Record<string, any>) {
    return input;
  }

  methodTwo (input: Record<string, any>) {
    this.methodOne(input);
  }

  constructor(private providerOne: ProviderOne, private providerTwo: ProviderTwo) {
  }
}
