import Column from "./Column.js";

export default class Kanban {
  constructor(root) {
    this.root = root;

    Kanban.columns().forEach((column) => {
      // TODO: criar uma classe para cada coluna
      const columnView = new Column({
        id: column.id,
        title: column.title,
        name: column.name,
      });

      this.root.appendChild(columnView.elements.root);
    });
  }

  static columns() {
    return [
      {
        id: 1,
        title: "A Fazer",
        name: "todo",
      },
      {
        id: 2,
        title: "Em Andamento",
        name: "doing",
      },
      {
        id: 3,
        title: "Concluído",
        name: "done",
      },
    ];
  }
}
