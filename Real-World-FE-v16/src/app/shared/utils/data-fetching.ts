import { Observable, OperatorFunction, switchMap, map, catchError, of, startWith, scan, tap } from "rxjs";

interface Query<T = unknown> {
  status: 'pending' | 'success' | 'error';
  /** Will be `true` when the `observableFunction` is executing */
  isFetching?: boolean;
  /** Will be `true` when the `observableFunction` is executing at the first time */
  isLoading?: boolean;
  error?: any;
  data?: T;
}

export function switchMapWithLoading<T>(
  observableFunction: (value: any) => Observable<T>
): OperatorFunction<any, Query<T>> {
  return (source: Observable<any>) =>
    source.pipe(
      switchMap((value) =>
        observableFunction(value).pipe(
          map((data) => ({
            status: 'success' as const,
            error: undefined,
            data,
          })),
          catchError((error) => of({
            status: 'error' as const,
            error,
            data: undefined,
          })),
          startWith({
            status: 'pending' as const,
            error: undefined,
          })
        )
      ),
      scan((state: Query<T>, change: Query<T>) => ({
        ...state,
        ...change,
        isFetching: change.status === 'pending',
        isLoading: change.status === 'pending' && !state.data && !state.error
      }), { status: 'pending' as const }),
    );
}