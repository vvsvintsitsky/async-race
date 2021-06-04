import styles from "./App.module.css";

export class App {
  private content = document.createElement("div");

  render() {
    this.content.classList.add(styles.app);
    return this.content;
  }
}