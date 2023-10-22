import KanbanAPI from "../api/KanbanAPI.js";
import DropZone from "./DropZone.js";

export default class Task {
  constructor(id, content) {
    const bottomDropZone = DropZone.createDropZone();

    this.elements = {};
    this.elements.taskRoot = Task.createRoot();
    this.elements.taskItem = this.elements.taskRoot.children[0];
    this.elements.taskDeleteModal = this.elements.taskRoot.children[1];
    this.elements.taskMenu =
      this.elements.taskItem.querySelector(".task__menu");
    this.elements.content =
      this.elements.taskItem.querySelector(".kanban__content");
    this.elements.actions =
      this.elements.taskItem.querySelector(".kanban__actions");
    this.elements.taskActionsBtn =
      this.elements.taskItem.querySelector(".button--actions");
    this.elements.taskDeleteBtn = this.elements.taskItem.querySelector(
      ".button__task-delete"
    );
    this.elements.taskMoveBtn =
      this.elements.taskItem.querySelector(".button__task-move");

    this.elements.modalConfirmBtn =
      this.elements.taskDeleteModal.querySelector(".button--confirm");
    this.elements.modalCancelBtn =
      this.elements.taskDeleteModal.querySelector(".button--cancel");

    this.elements.taskItem.dataset.id = id;
    this.elements.content.textContent = content;

    this.content = content;
    this.elements.taskItem.appendChild(bottomDropZone);

    const onBlur = () => {
      const newContent = this.elements.content.textContent.trim();

      if (newContent === "") {
        KanbanAPI.deleteTask(id);
        this.elements.taskItem.parentElement.removeChild(
          this.elements.taskItem
        );
      }

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
      this.closeTaskMenu();

      this.elements.taskDeleteModal.showModal();

      this.elements.modalConfirmBtn.addEventListener("click", () => {
        KanbanAPI.deleteTask(id);
        this.elements.taskItem.parentElement.removeChild(
          this.elements.taskItem
        );
        this.elements.taskDeleteModal.close();
      });

      this.elements.modalCancelBtn.addEventListener("click", () => {
        this.elements.taskDeleteModal.close();
      });
    });

    this.elements.taskItem.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", id);
    });

    this.elements.taskItem.addEventListener("drop", (event) => {
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
      <dialog class="modal__task-delete">
        <div class="modal__content">
          <p>Tem certeza que deseja excluir esta tarefa?</p>

          <div class="modal__actions">
            <button class="button button--taskDeleteModal button--cancel">Não</button>
            <button class="button button--taskDeleteModal button--confirm">Sim</button>
          </div>
        </div>
      </dialog>
    `);
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
