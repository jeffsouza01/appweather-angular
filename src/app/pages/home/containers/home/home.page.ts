import { ApplicationRef, Component, ComponentFactory, ComponentFactoryResolver, Injector, OnDestroy, OnInit } from '@angular/core';
import { PortalOutlet, DomPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { FormControl, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Bookmark } from 'src/app/shared/models/bookmark.model';
import { CityWeather } from 'src/app/shared/models/weather.model';
import { UnitSelectorComponent } from '../unit-selector/unit-selector.component';

import { CityTypeaheadItem } from 'src/app/shared/models/city-typeahead-item.model';
import * as fromHomeActions from '../../state/home.actions';
import * as fromHomeSelectors from '../../state/home.selector';
import * as fromBookmarksSelectors from '../../../bookmarks/state/bookmarks.selectors';


@Component({
  selector: 'jv-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {

  cityWeather$: Observable<CityWeather>;
  cityWeather: CityWeather;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  bookmarksList$: Observable<Bookmark[]>;
  isCurrentFavorite$: Observable<boolean>;

  searchControl: FormControl;
  searchControlWithAutoComplete: FormControl;

  text: string;

  private componentDestroy$ = new Subject();

  private portalOutlet: PortalOutlet;

  constructor(private store: Store,
              private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector  ) { }

  ngOnInit() {
    this.searchControl = new FormControl('', Validators.required);
    this.searchControlWithAutoComplete = new FormControl(undefined);

    this.searchControlWithAutoComplete.valueChanges
        .pipe(takeUntil(this.componentDestroy$))
        .subscribe((value: CityTypeaheadItem) => {
          if (!!value) {
            this.store.dispatch(fromHomeActions.loadCurrentWeatherById({ id: value.geonameid.toString() }))
          }
        });

    this.cityWeather$ = this.store.pipe(select(fromHomeSelectors.selectCurrentWeather));
    this.cityWeather$
        .pipe(takeUntil(this.componentDestroy$))
        .subscribe(value => this.cityWeather = value);
    this.loading$ =  this.store.pipe(select(fromHomeSelectors.selectCurrentWeatherLoading))
    this.error$ = this.store.pipe(select(fromHomeSelectors.selectCurrentWeatherError))

    this.bookmarksList$ = this.store.pipe(select(fromBookmarksSelectors.selectorBookmarksList));

    this.isCurrentFavorite$ = combineLatest([this.cityWeather$, this.bookmarksList$])
          .pipe(
            map(([current, bookmarksList]) => {
              if (!!current) {
                return bookmarksList.some(bookmark => bookmark.id === current.city.id);
              }
              return false;
            }),
          );

  }

  ngOnDestroy() {
      this.componentDestroy$.next();
      this.componentDestroy$.unsubscribe();
      this.store.dispatch(fromHomeActions.clearHomeState());
      this.portalOutlet.detach();
  }

  search() {
    const query = this.searchControl.value;
    this.store.dispatch(fromHomeActions.loadCurrentWeather({ query }));
  }


  onToggleBookmark() {
    const bookmark = new Bookmark();
    bookmark.id = this.cityWeather.city.id;
    bookmark.name = this.cityWeather.city.name;
    bookmark.country = this.cityWeather.city.country;
    bookmark.coord = this.cityWeather.city.coord;

    this.store.dispatch(fromHomeActions.toggleBookmark({  entity: bookmark }))
  }

  private setupPortal() {
    const portal = document.querySelector('#navbar-portal-outlet');
    this.portalOutlet = new DomPortalOutlet(
      portal,
      this.componentFactoryResolver,
      this.appRef,
      this.injector,
    );
    this.portalOutlet.attach(new ComponentPortal(UnitSelectorComponent))
  }

}
