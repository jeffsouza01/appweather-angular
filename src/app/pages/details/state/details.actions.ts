import { createAction, props } from "@ngrx/store";
import { CityDailyWeather } from "src/app/shared/models/weather.model";


export const loadWeatherDetails = createAction('[Details] Load Weather Details');


export const loadWeatherDetailsSucess = createAction(
    '[Details] load Weather Details Sucess',
    props<{ entity: CityDailyWeather  }>(),
);

export const loadWeatherDetailsFailed = createAction('[Details] Load Weather Failed');