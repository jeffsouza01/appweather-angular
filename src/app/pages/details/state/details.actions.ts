import { createAction, props } from "@ngrx/store";


export const loadWeatherDetails = createAction('[Details] Load Weather Details');


export const loadWeatherDetailsSucess = createAction(
    '[Details] load Weather Details Sucess',
    props<{ entity: any }>(),
);

export const loadWeatherDetailsFailed = createAction('[Details] Load Weather Failed');