import KanbanAPI from "../api/KanbanAPI.js";
import DropZone from "./DropZone.js";

export default class Task {
  constructor(id, content) {
    const bottomDropZone = DropZone.createDropZone();

    this.elements = {};
    this.elements.taskRoot = Task.createRoot();
    this.elements.taskItem = this.elements.taskRoot.children[0];
    this.elements.taskDeleteModal =
      this.elements.taskItem.querySelector(".modal");
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
    this.elements.taskMoveForwardBtn = this.elements.taskItem.querySelector(
      ".button__task-move-forward"
    );
    this.elements.taskMoveBackBtn = this.elements.taskItem.querySelector(
      ".button__task-move-back"
    );

    this.elements.modalConfirmBtn =
      this.elements.taskDeleteModal.querySelector(".button--confirm");
    this.elements.modalCancelBtn =
      this.elements.taskDeleteModal.querySelector(".button--cancel");
    this.elements.modalCloseBtn =
      this.elements.taskDeleteModal.querySelector(".button--close");

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

    this.elements.taskMoveForwardBtn.addEventListener("click", () => {
      this.moveTask("forward");
    });

    this.elements.taskMoveBackBtn.addEventListener("click", () => {
      this.moveTask("back");
    });

    this.elements.taskDeleteBtn.addEventListener("click", () => {
      this.closeTaskMenu();

      this.openTaskDeleteModal();

      if (this.elements.taskDeleteModal.open) {
        this.elements.modalCloseBtn.addEventListener("click", () => {
          this.closeTaskDeleteModal();
        });

        this.elements.modalConfirmBtn.addEventListener("click", () => {
          KanbanAPI.deleteTask(id);
          this.closeTaskDeleteModal();

          setTimeout(() => {
            this.elements.taskItem.parentElement.removeChild(
              this.elements.taskItem
            );
          }, 400);
        });

        this.elements.modalCancelBtn.addEventListener("click", () => {
          this.closeTaskDeleteModal();
        });
      }
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
             <button class="button button--menu button__task-move-forward">
               <ion-icon name="arrow-forward-outline"></ion-icon>
               <span>Mover</span>
             </button>
             <button class="button button--menu button__task-move-back">
               <ion-icon name="arrow-back-outline"></ion-icon>
               <span>Mover</span>
             </button>
             <button class="button button--menu button__task-delete">
               <ion-icon name="trash-outline"></ion-icon>
               <span>Excluir</span>
             </button>
           </div>
        </div>

        <dialog class="modal">
          <div class="modal__content content--task-delete">
            <div class="modal__close">
              <button class="button button--close">X</button>
            </div>
  
            <p>Tem certeza que deseja excluir esta tarefa?</p>
  
            <div class="actions--task-delete">
              <button class="button button--taskDeleteModal button--cancel">Não</button>
              <button class="button button--taskDeleteModal button--confirm">Sim</button>
            </div>
          </div>
        </dialog>
      </li>
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

  moveTask(whereToMove) {
    this.closeTaskMenu();

    const currentColumn = this.elements.taskItem.closest(".kanban__column");
    const currentColumnId = Number(currentColumn.dataset.id);
    const FIRST_TASK_POSITION = 0;

    let newColumnId;

    if (whereToMove === "forward") {
      newColumnId = currentColumnId + 1;
    }

    if (whereToMove === "back") {
      newColumnId = currentColumnId - 1;
    }

    const newTaskList = document.querySelector(
      `[data-id="${newColumnId}"] .kanban__list`
    );

    newTaskList.firstChild.after(this.elements.taskItem);

    KanbanAPI.updateTask(this.elements.taskItem.dataset.id, {
      columnId: newColumnId,
      position: FIRST_TASK_POSITION,
    });
  }

  openTaskDeleteModal() {
    this.elements.taskDeleteModal.classList.remove("modal--out");

    this.elements.taskDeleteModal.showModal();
    this.elements.taskDeleteModal.classList.add("modal--in");
  }

  closeTaskDeleteModal() {
    this.elements.taskDeleteModal.classList.remove("modal--in");

    setTimeout(() => {
      this.elements.taskDeleteModal.close();
    }, 350);
    this.elements.taskDeleteModal.classList.add("modal--out");
  }
}
