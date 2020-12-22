import { createAction, props } from '@ngrx/store';

export const loadCurrentWeather = createAction(
  '[Home] Load Current Weather',
  props<{ query: string }>(),
);

export const loadCurrentWeatherSucess = createAction(
  '[Weather API] Load Current Weather Sucess',
  props<{ entity: any }>(),
);

export const loadCurrentWeatherFailed = createAction(
  '[Weather API] Load Current Weather Failed',
);

