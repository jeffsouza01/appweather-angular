import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';

import { Observable, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Bookmark } from 'src/app/shared/models/bookmark.model';
import { CityTypeaheadItem } from 'src/app/shared/models/city-typeahead-item.model';
import { BookmarksState } from '../../state/bookmarks.reducer';

import * as fromBookmarksSelectors from '../../state/bookmarks.selectors';
import * as fromBookmarksActions from '../../state/bookmarks.actions';

@Component({
  selector: 'jv-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss']
})
export class BookmarksPage implements OnInit, OnDestroy {

  bookmarks$: Observable<Bookmark[]>;

  seachTypeaheadControl = new FormControl(undefined);

  private componentDestroy$ = new Subject();

  constructor(private store: Store<BookmarksState>) { }

  ngOnInit() {
    this.bookmarks$ = this.store.pipe(select(fromBookmarksSelectors.selectorBookmarksList));

    this.seachTypeaheadControl.valueChanges
      .pipe(takeUntil(this.componentDestroy$))
      .subscribe((value: CityTypeaheadItem) =>
      this.store.dispatch(fromBookmarksActions.toggleBookmarksById({ id: value.geonameid }))
      );
  }

  ngOnDestroy() {
    this.componentDestroy$.next();
    this.componentDestroy$.unsubscribe();
  }

  removeBookmark(id: number) {
    this.store.dispatch(fromBookmarksActions.removeBookmark({id}));
  }

}
