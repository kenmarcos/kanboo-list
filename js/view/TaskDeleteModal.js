export default class TaskDeleteModal {
  constructor() {
    this.elements = {};
    this.elements.root = TaskDeleteModal.createRoot();
  }

  static createRoot() {
    const range = document.createRange();
    range.selectNode(document.body);

    return range.createContextualFragment(`
      <dialog class="modal__task-delete">
        <p>Tem certeza que deseja excluir esta tarefa?</p>
      </dialog>
    `).children[0];
  }
}
