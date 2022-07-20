import { anything, deepEqual, instance, mock, spy, verify, when } from 'ts-mockito';
import { BehaviorSubject } from 'rxjs';
import { hot } from 'jasmine-marbles';
import { ProviderOne } from './provider-one.service';
import { ProviderTwo } from './provider-two.service';
import { BasicClass } from './basic.class';

describe('BasicClass', () => {
  let service: BasicClass;
  let serviceSpy: BasicClass;
  let providerOneMock: ProviderOne;
  let providerTwoMock: ProviderTwo;
  const providerOneObservable$ = new BehaviorSubject('mockedProviderOneObservable');
  const providerTwoObservable$ = new BehaviorSubject('mockedProviderTwoObservable');

  beforeEach(() => {
    providerOneMock = mock(ProviderOne);
    providerTwoMock = mock(ProviderTwo);

    when(providerOneMock.observable$).thenReturn(providerOneObservable$);
    when(providerTwoMock.observable$).thenReturn(providerTwoObservable$);

    service = new BasicClass(instance(providerOneMock), instance(providerTwoMock));
    serviceSpy = spy(service);

    when(serviceSpy.methodOne(anything())).thenReturn({ foo: 'bar' });
  });

  describe('spying and mocking on service under test', () => {
    it('should spy on BasicClass methods', () => {
      service.methodTwo({ some: 'value' });

      verify(
        // ---------- Used to spy on arguments and calls
        serviceSpy.methodOne(
          deepEqual({
            some: 'value',
          }),
        ),
      ).once();
    });

    it('should return mocked value', () => {
      const expected = service.methodOne({
        some: 'value',
      });

      expect(expected).toEqual({ foo: 'bar' });
    });

    it('should not mock spied service observable - marbles', () => {
      expect(service.observable$).toBeObservable(
        hot('a', {
          a: 'realObservableOne',
        }),
      );
    });

    it('should not mock spied service observable - subscribe', done => {
      service.observable$.subscribe(value => {
        expect(value).toEqual('realObservableOne');
        done();
      });
    });
  });

  describe('mocking observables on providers', () => {
    describe('first provider', () => {
      it('should mock out observable - marbles', () => {
        // Access it on the service under test
        expect(service.providerOneObservable$).toBeObservable(
          hot('a', {
            a: 'mockedProviderOneObservable',
          }),
        );

        // Access it on the provider
        expect(service['providerOne'].observable$).toBeObservable(
          hot('a', {
            a: 'mockedProviderOneObservable',
          }),
        );
      })

      it('should mock out observable - subscribe', done => {
        // Access it on the service under test
        service.providerOneObservable$.subscribe(value => {
          expect(value).toEqual('mockedProviderOneObservable');
          done();
        });
      });
    });

    describe('second provider', () => {
      it('should mock out observable - marbles', () => {
        // Access it on the service under test
        expect(service.providerTwoObservable$).toBeObservable(
          hot('a', {
            a: 'mockedProviderTwoObservable',
          }),
        );

        // Access it on the provider
        expect(service['providerTwo'].observable$).toBeObservable(
          hot('a', {
            a: 'mockedProviderTwoObservable',
          }),
        );
      })

      it('should mock out observable - subscribe', done => {
        // Access it on the service under test
        service.providerTwoObservable$.subscribe(value => {
          expect(value).toEqual('mockedProviderTwoObservable');
          done();
        });
      });
    });

  });

  describe('mocking combineLatest observables on service under test', () => {
    it('should not mock out rxjs combineLatest', () => {
      // Prove that combineLatest is not mocked

      const expected = `function combineLatest() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    var resultSelector = undefined;
    var scheduler = undefined;
    if (isScheduler_1.isScheduler(observables[observables.length - 1])) {
        scheduler = observables.pop();
    }
    if (typeof observables[observables.length - 1] === 'function') {
        resultSelector = observables.pop();
    }
    if (observables.length === 1 && isArray_1.isArray(observables[0])) {
        observables = observables[0];
    }
    return fromArray_1.fromArray(observables, scheduler).lift(new CombineLatestOperator(resultSelector));
}`;

      expect(service.whatIsCombineLatest).toEqual(expected);
    });

    it('should mock out providers with combineLatest - subscribe', done => {
      // The providers have mock values set in beforeEach, so the combinedProviderObservable$
      // should return those values
      service.combinedProviderObservable$.subscribe(value => {
        expect(value).toEqual('mockedProviderOneObservable/mockedProviderTwoObservable');
        done();
      });
    });

    it('should not mock for local observables in combineLatest - subscribe', done => {
      // Spying on the service under test should not replace the
      // observable$ and observableTwo$ class fields

      // See 'should not mock spied service observable - subscribe', which passes
      service.localCombinedObservable$.subscribe(value => {
        expect(value).toEqual('realObservableOne/realObservableTwo');
        done();
      });
    });

    it('should not mock for local observables in combineLatest with no pipe', () => {
      // This test is to determine whether it is combineLatest breaking the test,
      // or the pipe(map())

      expect(service.localCombinedObservableNoPipe$).toBeObservable(
        hot('a', {
          a: [ 'realObservableOne', 'realObservableTwo' ],
        }),
      );
    });
  });
});
