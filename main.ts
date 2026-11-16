import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

class Tree {
  value: number;
  left: Tree | null;
  right: Tree | null;

  constructor(value: number) {
    this.value = value;
    this.left = null;
    this.right = null;
  }

  // Вставка и поиск
  insert(value: number): void {
    if (value < this.value) {
      if (this.left === null) {
        this.left = new Tree(value);
      } else {
        this.left.insert(value);
      }
    }

    if (value > this.value) {
      if (this.right === null) {
        this.right = new Tree(value);
      } else {
        this.right.insert(value);
      }
    }
  }

  search(value: number): boolean {
    if (value === this.value) {
      return true;
    }

    if (value < this.value) {
      if (this.left === null) {
        return false;
      } else {
        return this.left.search(value);
      }
    }

    if (value > this.value) {
      if (this.right === null) {
        return false;
      } else {
        return this.right.search(value);
      }
    }

    return false;
  }

  // Обходы
  symmetricTraversal(): number[] {
    const result: number[] = [];

    if (this.left !== null) {
      result.push(...this.left.symmetricTraversal());
    }
    result.push(this.value);

    if (this.right !== null) {
      result.push(...this.right.symmetricTraversal());
    }

    return result;
  }

  preorderTraversal(): number[] {
    const result: number[] = [];

    result.push(this.value);

    if (this.left !== null) {
      result.push(...this.left.preorderTraversal());
    }

    if (this.right !== null) {
      result.push(...this.right.preorderTraversal());
    }

    return result;
  }

  postorderTraversal(): number[] {
    const result: number[] = [];

    if (this.left !== null) {
      result.push(...this.left.postorderTraversal());
    }

    if (this.right !== null) {
      result.push(...this.right.postorderTraversal());
    }

    result.push(this.value);

    return result;
  }

  widthTraversal(): number[] {
    const result: number[] = [];
    const queue: Tree[] = [this];

    while (queue.length > 0) {
      let currentNode = queue.shift()!;

      if (currentNode.left !== null) {
        queue.push(currentNode.left);
      }

      if (currentNode.right !== null) {
        queue.push(currentNode.right);
      }

      result.push(currentNode.value);
    }

    return result;
  }

  // Минимум и Максимум
  findMin(): number {
    if (this.left === null) {
      return this.value;
    } else {
      return this.left.findMin();
    }
  }

  findMax(): number {
    if (this.right === null) {
      return this.value;
    } else {
      return this.right.findMax();
    }
  }

  // Высота и размер
  height(): number {
    let leftHeight: number = 0;
    let rightHeight: number = 0;

    if (this.left !== null) {
      leftHeight += this.left.height();
    }

    if (this.right !== null) {
      rightHeight += this.right.height();
    }

    return Math.max(leftHeight, rightHeight) + 1;
  }

  size(): number {
    let result: number = 1;

    if (this.left !== null) {
      result += this.left.size();
    }

    if (this.right !== null) {
      result += this.right.size();
    }

    return result;
  }

  delete(value: number): Tree | null {
    if (value < this.value) {
      if (this.left !== null) {
        this.left = this.left.delete(value);
      }
    } else if (value > this.value) {
      if (this.right !== null) {
        this.right = this.right.delete(value);
      }
    } else {
      if (this.left === null && this.right === null) {
        return null;
      } else if (this.left === null) {
        return this.right;
      } else if (this.right === null) {
        return this.left;
      } else {
        const minRightValue = this.right.findMin();
        this.value = minRightValue;
        this.right = this.right.delete(minRightValue);
      }
    }

    return this;
  }
}

function checkNumber(value: string | undefined): number | null {
  if (isNaN(Number(value))) {
    return null;
  } else if (value === "") {
    return null;
  } else {
    return Number(value);
  }
}

function show(tree: Tree | null): void {
  if (tree === null) {
    console.log("Дерево пустое");
  } else {
    console.log(`Текущий узел: ${tree.value}`);

    if (tree.left !== null) {
      console.log(`Слева: ${tree.left.value}`);
    } else {
      console.log("Слева пусто");
    }

    if (tree.right !== null) {
      console.log(`Справа: ${tree.right.value}`);
    } else {
      console.log("Справа пусто");
    }
  }
}

async function main() {
  const rl = readline.createInterface({ input, output });
  let tree: Tree | null = null;
  let cursor: Tree | null = null;
  let parents: Tree[] = [];

  console.log("Введите help, чтобы увидеть список команд");
  while (true) {
    const request: string[] = (await rl.question("Введите команду: "))
      .trim()
      .toLowerCase()
      .split(" ");

    switch (request[0]) {
      case "insert": {
        const value = checkNumber(request[1]);

        if (value === null) {
          console.log("Некорректное значение");
          continue;
        }

        if (tree === null) {
          tree = new Tree(value);
          cursor = tree;
          console.log(`Дерево создано, элемент ${value} добавлен`);
        } else {
          if (tree.search(value)) {
            console.log("Элемент уже существует");
            continue;
          } else {
            tree.insert(value);
            console.log(`Элемент ${value} добавлен`);
          }
        }
        break;
      }
      case "search": {
        const value = checkNumber(request[1]);

        if (value === null) {
          console.log("Некорректное значение");
          continue;
        }

        if (tree === null) {
          console.log("Дерево пустое");
        } else {
          if (tree.search(value)) {
            console.log("Элемент найден");
          } else {
            console.log("Элемент не найден");
          }
        }
        break;
      }
      case "delete": {
        const value = checkNumber(request[1]);

        if (value === null) {
          console.log("Некорректное значение");
          continue;
        }

        if (tree === null) {
          console.log("Дерево пустое");
        } else {
          if (tree.search(value)) {
            tree = tree.delete(value);
            cursor = tree;
            parents = [];
            console.log(`Элемент ${value} удален`);
          } else {
            console.log("Элемент не найден");
          }
        }
        break;
      }
      case "show": {
        show(cursor);
        break;
      }
      case "symmetric": {
        if (tree === null) {
          console.log("Дерево пустое");
        } else {
          console.log(
            `Симметричный обход: ${tree.symmetricTraversal().join(", ")}`,
          );
        }
        break;
      }
      case "preorder": {
        if (tree === null) {
          console.log("Дерево пустое");
        } else {
          console.log(`Прямой обход: ${tree.preorderTraversal().join(", ")}`);
        }
        break;
      }
      case "postorder": {
        if (tree === null) {
          console.log("Дерево пустое");
        } else {
          console.log(
            `Обратный обход: ${tree.postorderTraversal().join(", ")}`,
          );
        }
        break;
      }
      case "width": {
        if (tree === null) {
          console.log("Дерево пустое");
        } else {
          console.log(`Обход в ширину: ${tree.widthTraversal().join(", ")}`);
        }
        break;
      }
      case "min": {
        if (tree === null) {
          console.log("Дерево пустое");
        } else {
          console.log(`Минимальный элемент: ${tree.findMin()}`);
        }
        break;
      }
      case "max": {
        if (tree === null) {
          console.log("Дерево пустое");
        } else {
          console.log(`Максимальный элемент: ${tree.findMax()}`);
        }
        break;
      }
      case "height": {
        if (tree === null) {
          console.log("Дерево пустое");
        } else {
          console.log(`Высота дерева: ${tree.height()}`);
        }
        break;
      }
      case "size": {
        if (tree === null) {
          console.log("Дерево пустое");
        } else {
          console.log(`Размер дерева: ${tree.size()}`);
        }
        break;
      }
      case "left": {
        if (cursor === null) {
          console.log("Дерево пустое");
        } else if (cursor.left === null) {
          console.log("Слева пусто");
        } else {
          parents.push(cursor);
          cursor = cursor.left;
          show(cursor);
        }
        break;
      }
      case "right": {
        if (cursor === null) {
          console.log("Дерево пустое");
        } else if (cursor.right === null) {
          console.log("Справа пусто");
        } else {
          parents.push(cursor);
          cursor = cursor.right;
          show(cursor);
        }
        break;
      }
      case "up": {
        if (cursor === null) {
          console.log("Дерево пустое");
        } else if (parents.length === 0) {
          console.log("Нет родительского узла");
        } else {
          cursor = parents.pop()!;
          show(cursor);
        }
        break;
      }
      case "help": {
        console.log(`
Все команды

Операции вставки, поиска и удаления
Вставить: insert число
Поиск: search число
Удалить: delete число
          
Обходы
Симметричный обход:  symmetric
Прямой обход: preorder
Обратный обход: postorder
Обход в ширину: width
          
Минимум и Максимум
Минимум: min
Максимум: max
          
Высота и Размер
Высота: height
Размер: size
          
Перемещение по дереву
Переместиться в левый узел: left
Переместитья в правый узед: right
Вернуться в родительский узел от текущего: up
Посмотреть текущий узел: show

Выход: exit`);
        break;
      }
      case "exit": {
        console.log("Выход из программы");
        rl.close();
        return;
      }
      default: {
        console.log("Неизвестная команда");
        break;
      }
    }
  }
}

main();
