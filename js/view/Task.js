import KanbanAPI from "../api/KanbanAPI.js";
import DropZone from "./DropZone.js";

export default class Task {
  constructor(id, content) {
    const bottomDropZone = DropZone.createDropZone();

    this.elements = {};
    this.elements.root = Task.createRoot();
    this.elements.taskMenu = this.elements.root.querySelector(".task__menu");
    this.elements.content =
      this.elements.root.querySelector(".kanban__content");
    this.elements.actions =
      this.elements.root.querySelector(".kanban__actions");
    this.elements.taskActionsBtn =
      this.elements.root.querySelector(".button--actions");
    this.elements.taskDeleteBtn = this.elements.root.querySelector(
      ".button__task-delete"
    );
    this.elements.taskMoveBtn =
      this.elements.root.querySelector(".button__task-move");

    this.elements.root.dataset.id = id;
    this.elements.content.textContent = content;

    this.content = content;
    this.elements.root.appendChild(bottomDropZone);

    const onBlur = () => {
      const newContent = this.elements.content.textContent.trim();

      if (newContent === this.content) {
        return;
      }

      this.content = newContent;
      KanbanAPI.updateTask(id, {
        content: this.content,
      });
    };

    this.elements.content.addEventListener("blur", onBlur);

    this.elements.content.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.elements.content.blur();
      }
    });

    this.elements.taskActionsBtn.addEventListener("click", () => {
      if (this.elements.actions.classList.contains("hidden")) {
        this.openTaskMenu();
      } else {
        this.closeTaskMenu();
      }

      this.closeTaskMenuOnClickOutside();
    });

    this.elements.taskDeleteBtn.addEventListener("click", () => {
      const check = confirm("Tem certeza que deseja deletar a tarefa?");
      if (check) {
        KanbanAPI.deleteTask(id);
        this.elements.content.removeEventListener("blur", onBlur);
        this.elements.root.parentElement.removeChild(this.elements.root);
      }
    });

    this.elements.root.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", id);
    });

    this.elements.root.addEventListener("drop", (event) => {
      event.preventDefault();
    });
  }

  static createRoot() {
    const range = document.createRange();
    range.selectNode(document.body);

    return range.createContextualFragment(`
      <li class="kanban__item" draggable="true">
        <div class="kanban__task">
          <p contenteditable class="kanban__content"></p>
          <div class="kanban__actions hidden">
           <button class="button button--actions">
             <ion-icon name="ellipsis-vertical-outline"></ion-icon>
           </button>
           </div>
           <div class="task__menu hidden" draggable="true">
             <button class="button button--menu button__task-move">
               <ion-icon name="arrow-forward-outline"></ion-icon>
               <span>Mover</span>
             </button>
             <button class="button button--menu button__task-delete">
               <ion-icon name="trash-outline"></ion-icon>
               <span>Excluir</span>
             </button>
           </div>
        </div>
      </li>
    `).children[0];
  }

  openTaskMenu() {
    this.elements.actions.classList.remove("hidden");
    this.elements.taskMenu.classList.remove("hidden");
  }

  closeTaskMenu() {
    this.elements.taskMenu.classList.add("task__menu--out");

    setTimeout(() => {
      this.elements.actions.classList.add("hidden");
      this.elements.taskMenu.classList.add("hidden");

      this.elements.taskMenu.classList.remove("task__menu--out");
    }, 350);
  }

  closeTaskMenuOnClickOutside() {
    document.addEventListener("click", (event) => {
      if (
        !this.elements.actions.contains(event.target) &&
        !this.elements.taskMenu.contains(event.target)
      ) {
        this.closeTaskMenu();
      }
    });
  }
}
