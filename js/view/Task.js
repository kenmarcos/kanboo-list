import KanbanAPI from "../api/KanbanAPI.js";

export default class Task {
  constructor(id, content) {
    this.elements = {};
    this.elements.root = Task.createRoot();
    this.elements.content =
      this.elements.root.querySelector(".kanban__content");
    this.elements.taskDeleteBtn =
      this.elements.root.querySelector(".button--delete");

    this.elements.root.dataset.id = id;
    this.elements.content.textContent = content;

    this.content = content;

    const onBlur = () => {
      const newContent = this.elements.content.textContent.trim();

      if (newContent === this.content) {
        return;
      }

      this.content = newContent;
      KanbanAPI.updateTask(id, {
        content: this.content,
      });

      console.log(content);
      console.log(newContent);
    };

    this.elements.content.addEventListener("blur", onBlur);

    this.elements.taskDeleteBtn.addEventListener("click", () => {
      const check = confirm("Tem certeza que deseja deletar a tarefa?");

      if (check) {
        KanbanAPI.deleteTask(id);

        this.elements.content.removeEventListener("blur", onBlur);
        this.elements.root.parentElement.removeChild(this.elements.root);
      }
    });
  }

  static createRoot() {
    const range = document.createRange();
    range.selectNode(document.body);

    return range.createContextualFragment(`
      <li class="kanban__item" draggable="true">
        <p contenteditable class="kanban__content"></p>
        <div class="kanban__delete">
          <button class="button button--delete">
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </div>
      </li>
    `).children[0];
  }
}
