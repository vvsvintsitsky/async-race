import styles from "./table.module.css";

export class Table<T> {
  private rootElement: HTMLElement;

  private tableBodyElement: HTMLElement;

  constructor(
    private renderRow: (rowItem: T) => HTMLElement,
    private renderHeader: () => HTMLElement,
    private data: T[]
  ) {
    this.rootElement = document.createElement("div");
    this.tableBodyElement = document.createElement("div");
  }

  public render() {
    const header = this.renderHeader();
    header.classList.add(styles.header);
    this.rootElement.append(header);

    this.tableBodyElement.classList.add(styles.body);
    this.rootElement.append(this.tableBodyElement);

    this.renderContent();
    return this.rootElement;
  }

  public updateData(data: T[]) {
    this.data = data;
    this.renderContent();
  }

  private renderContent() {
    this.tableBodyElement.innerHTML = "";

    const rows = this.data.map((item) => {
      const row = this.renderRow(item);
      row.classList.add(styles.row);
      return row;
    });

    this.tableBodyElement.append(...rows);
  }
}
