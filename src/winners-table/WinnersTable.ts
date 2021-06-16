import { SortOrder, Winner, WinnersSortColumns } from "../api/types";
import { WinnerStorage } from "../storage/types";
import { TableWithPagination } from "../table-with-pagination/TableWithPagination";

interface CellDescriptor {
  key: keyof Winner;
  text: string;
  sortColumn: WinnersSortColumns;
}

export class WinnersTable {
  private table: TableWithPagination<Winner>;

  private sortColumn = WinnersSortColumns.Id;

  private sortOrder = SortOrder.Desc;

  private cellDescriptors: CellDescriptor[] = [
    { key: "id", text: "Id", sortColumn: WinnersSortColumns.Id },
    { key: "time", text: "Time", sortColumn: WinnersSortColumns.Time },
    { key: "wins", text: "Wins", sortColumn: WinnersSortColumns.Wins },
  ];

  constructor(private winnersStorage: WinnerStorage, private pageSize: number) {
    this.table = new TableWithPagination(
      this.getPage,
      this.renderRow,
      this.renderHeader
    );
  }

  public render() {
    const content = this.table.render();
    this.table.updateCurrentPageContent();
    return content;
  }

  private getPage = async (page: number) => {
    const { data, totalRecords } = await this.winnersStorage.getAll(
      page,
      this.pageSize,
      this.sortColumn,
      this.sortOrder
    );

    return { data, totalPages: Math.ceil(totalRecords / this.pageSize) };
  };

  private renderHeader = () => {
    const header = document.createElement("div");

    const headerCells = this.cellDescriptors.map((descriptor) =>
      this.createHeaderCell(descriptor)
    );

    header.append(...headerCells);

    return header;
  };

  private createHeaderCell(cellDescriptor: CellDescriptor) {
    const cell = document.createElement("button");
    cell.textContent = cellDescriptor.text;
    cell.style.flexBasis = this.getFlexBasis();
    cell.addEventListener("click", () =>
      this.toggleSortingByColumn(cellDescriptor.sortColumn)
    );
    return cell;
  }

  private toggleSortingByColumn(sortColumn: WinnersSortColumns) {
    if (this.sortColumn === sortColumn) {
      this.sortOrder =
        this.sortOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc;
    } else {
      this.sortColumn = sortColumn;
      this.sortOrder = SortOrder.Asc;
    }

    this.table.updateCurrentPageContent();
  }

  private renderRow = (winner: Winner) => {
    const row = document.createElement("div");

    const headerCells = this.cellDescriptors.map((descriptor) =>
      this.createRowCell(descriptor, winner)
    );

    row.append(...headerCells);

    return row;
  };

  private createRowCell(cellDescriptor: CellDescriptor, winner: Winner) {
    const cell = document.createElement("div");
    cell.style.flexBasis = this.getFlexBasis();
    cell.textContent = String(winner[cellDescriptor.key]);
    return cell;
  }

  private getFlexBasis() {
      return `${Math.floor(100 / this.cellDescriptors.length)}%`;
  }
}
