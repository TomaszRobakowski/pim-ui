import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pim-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  @Input() index: number | undefined
  @Input() isLastPage = false;
  @Input() set totalCount(value: number | undefined) {
    this._totalCount = value;  
    this.setTotalPages();
  };
  @Input() set pageSize(value: number | undefined){
    this._pageSize = value;
    this.setTotalPages();
  };
  @Output() pageChange = new EventEmitter<string>;

  private _totalCount: number | undefined;
  private _pageSize: number | undefined;

  public totalPages: number | undefined;

  public onPageChange(page: string): void {
    this.pageChange.emit(page)
  }

  private setTotalPages() {
    if (!!this._totalCount && !!this._pageSize) {
      this.totalPages = Math.ceil(this._totalCount / this._pageSize);
    }
  }
}
