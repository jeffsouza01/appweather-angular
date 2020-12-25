import { Injectable } from "@angular/core";
import { Params } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { combineLatest } from "rxjs";
import { catchError, map, mergeMap, withLatestFrom } from "rxjs/operators";

import { WeatherService } from "src/app/shared/services/weather.service";
import { AppState } from "src/app/shared/state/app.reducer";

import * as fromDetailsActions from './details.actions';
import * as fromRouterSelectors from '../../../shared/state/router/router.selectors';


@Injectable()
export class DetailsEffects {

    loadCurrentWeather$ = createEffect(() => this.actions$
        .pipe(
            ofType(fromDetailsActions.loadWeatherDetails),
            withLatestFrom(this.store.pipe(select(fromRouterSelectors.selectRouterQueryParams))),
            mergeMap(([, queryParams]: [any, Params]) =>
                combineLatest([
                    this.weatherService.getCityWeatherByCoord(queryParams.lat, queryParams.long),
                    this.weatherService.getWeatherDetails(queryParams.lat, queryParams.long)
                ])
        ),
        catchError((err, caught$) => {
            this.store.dispatch(fromDetailsActions.loadWeatherDetailsFailed()),
            return caught$
        }),
        map(([current, daily]) => {
            const entity = daily;
            entity.city = {...current.city, timeZone: daily.city.timeZone};
            return fromDetailsActions.loadWeatherDetailsSucess({ entity });
        }),
        )
        
    );

    constructor(private actions$: Actions,
                private store: Store<AppState>,
                private weatherService: WeatherService) {

        }
        
}