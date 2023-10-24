import KanbanAPI from "../api/KanbanAPI.js";

export default class DropZone {
  static createDropZone() {
    const range = document.createRange();
    range.selectNode(document.body);

    const dropZone = range.createContextualFragment(`
      <div class="kanban__dropzone"></div>
    `).children[0];

    dropZone.addEventListener("dragover", (event) => {
      event.preventDefault();

      dropZone.classList.add("kanban__dropzone--active");
    });

    dropZone.addEventListener("dragleave", (event) => {
      dropZone.classList.remove("kanban__dropzone--active");
    });

    dropZone.addEventListener("drop", (event) => {
      event.preventDefault();

      dropZone.classList.remove("kanban__dropzone--active");

      const columnElement = dropZone.closest(".kanban__column");
      const columnId = Number(columnElement.dataset.id);
      const dropZoneInColumn = Array.from(
        columnElement.querySelectorAll(".kanban__dropzone")
      );
      const droppedIndex = dropZoneInColumn.indexOf(dropZone);
      const taskId = event.dataTransfer.getData("text/plain");

      const droppedItemElement = document.querySelector(
        `[data-id="${taskId}"]`
      );
      const insertAfter = dropZone.parentElement.classList.contains(
        "kanban__item"
      )
        ? dropZone.parentElement
        : dropZone;

      if (droppedItemElement.contains(dropZone)) {
        return;
      }

      insertAfter.after(droppedItemElement);

      KanbanAPI.updateTask(taskId, {
        columnId,
        position: droppedIndex,
      });
    });

    return dropZone;
  }
}
