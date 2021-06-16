import { Table } from "../table/Table";

export class TableWithPagination<T> {
  private table: Table<T>;

  private rootElement = document.createElement("div");

  private prevButton = document.createElement("button");

  private nextButton = document.createElement("button");

  private currentPageElement = document.createElement("span");

  private currentPage = 0;

  private totalPages = 0;

  constructor(
    private getPage: (
      page: number
    ) => Promise<{ data: T[]; totalPages: number }>,
    renderRow: (rowItem: T) => HTMLElement,
    renderHeader: () => HTMLElement
  ) {
    this.table = new Table(renderRow, renderHeader, []);
  }

  public render() {
    this.rootElement.append(this.table.render());

    this.prevButton.innerText = "prev";
    this.prevButton.addEventListener("click", this.loadPreviousPage);
    this.nextButton.innerText = "next";
    this.nextButton.addEventListener("click", this.loadNextPage);

    this.currentPageElement.style.padding = "0 10px";

    this.refreshPaginationElements();

    this.rootElement.append(this.prevButton, this.currentPageElement, this.nextButton);

    return this.rootElement;
  }

  public async updateCurrentPageContent() {
    const { data, totalPages } = await this.getPage(this.currentPage);
    this.totalPages = totalPages;

    this.refreshPaginationElements();

    this.table.updateData(data);
  }

  private loadNextPage = () => {
    return this.changeCurrentPage(1);
  };

  private loadPreviousPage = () => {
    return this.changeCurrentPage(-1);
  };

  private async changeCurrentPage(offset: number) {
    this.currentPage += offset;

    this.refreshPaginationElements();

    return this.updateCurrentPageContent();
  }

  private refreshPaginationElements() {
    this.prevButton.disabled = !this.currentPage;
    this.currentPageElement.textContent = `${this.currentPage + 1}`;
    this.nextButton.disabled = this.currentPage === this.totalPages;
  }
}
