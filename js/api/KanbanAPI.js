export default class KanbanAPI {
  static getTasks(columnId) {
    const column = read().find((column) => column.id === columnId);

    if (!column) {
      return [];
    }

    return column.tasks;
  }

  static insertTask(columnId, content) {
    const data = read();
    const column = data.find((column) => column.id === columnId);

    if (!column) {
      throw new Error("Column does not exist");
    }

    const task = {
      id: crypto.getRandomValues(new Uint32Array(1))[0],
      content,
    };

    column.tasks.push(task);

    save(data);

    return task;
  }

  static updateTask(taskId, newProps) {
    const data = read();

    const [task, currentColumn] = (() => {
      for (const column of data) {
        const task = column.tasks.find((task) => task.id === taskId);

        if (task) {
          return [task, column];
        }
      }
    })();

    if (!task) {
      throw new Error("Task not found");
    }

    task.content =
      newProps.content === undefined ? task.content : newProps.content;

    // Atualizar a coluna e posição
    if (newProps.columnId !== undefined && newProps.position !== undefined) {
      const targetColumn = data.find(
        (column) => column.id === newProps.columnId
      );

      if (!targetColumn) {
        throw new Error("Target column not found");
      }

      // Deletar a task da sua coluna atual
      currentColumn.tasks.splice(currentColumn.tasks.indexOf(task), 1);

      // Mover a task para sua nova coluna e posição
      targetColumn.tasks.splice(newProps.position, 0, task);
    }

    save(data);
  }

  static deleteTask(taskId) {
    const data = read();

    for (const column of data) {
      const task = column.tasks.find((task) => {
        return task.id === taskId;
      });

      if (task) {
        column.tasks.splice(column.tasks.indexOf(task), 1);
      }
    }
    save(data);
  }
}

const read = () => {
  const json = localStorage.getItem("kanban-data");

  if (!json) {
    return [
      {
        id: 1,
        tasks: [],
      },
      {
        id: 2,
        tasks: [],
      },
      {
        id: 3,
        tasks: [],
      },
    ];
  }

  return JSON.parse(json);
};

const save = (data) => {
  localStorage.setItem("kanban-data", JSON.stringify(data));
};
