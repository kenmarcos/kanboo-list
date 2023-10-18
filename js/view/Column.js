import KanbanAPI from "../api/KanbanAPI.js";
import Task from "./Task.js";

export default class Column {
  constructor({ id, title, name }) {
    this.elements = {};
    this.elements.root = Column.createRoot();
    this.elements.title = this.elements.root.querySelector(".kanban__title");
    this.elements.tasks = this.elements.root.querySelector(".kanban__list");
    this.elements.taskAddBtn = this.elements.root.querySelector(".button--add");

    this.elements.root.dataset.id = id;
    this.elements.root.classList.add(`kanban__column--${name}`);
    this.elements.title.textContent = title;

    this.elements.taskAddBtn.addEventListener("click", () => {
      // TODO: adicionar uma nova task
      const newTask = KanbanAPI.insertTask(id, "");
      this.renderTask(newTask);
    });

    KanbanAPI.getTasks(id).forEach((task) => {
      this.renderTask(task);
    });
  }

  static createRoot() {
    const range = document.createRange();
    range.selectNode(document.body);

    return range.createContextualFragment(`
      <section class="kanban__column kanban__column--todo">
        <h3 class="kanban__title"></h3>

        <ul class="kanban__list"></ul>

        <button class="button button--add">
          <ion-icon name="add-outline"></ion-icon>
          <span>Adicionar</span>
        </button>
      </section>
    `).children[0];
  }

  renderTask(data) {
    // TODO: criar instância da task
    const task = new Task(data.id, data.content);

    this.elements.tasks.appendChild(task.elements.root);
  }
}
