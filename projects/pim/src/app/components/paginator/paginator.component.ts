import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pim-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  @Input() index: number | undefined
  @Input() isLastPage = false;
  @Output() pageChange = new EventEmitter<string>;

public onPageChange(page: string): void {
  this.pageChange.emit(page)
}
}
