// A tiny to-do store with change listeners.
// Shows: classes, private fields, arrow functions, template literals, regex.
"use strict";

const PRIORITIES = Object.freeze(["low", "normal", "high"]);
const TAG_PATTERN = /#([a-z][\w-]*)/gi;

export class TodoStore {
  #items = new Map();
  #listeners = new Set();
  #nextId = 1;

  add(text, { priority = "normal", due = null } = {}) {
    if (!PRIORITIES.includes(priority)) {
      throw new RangeError(`Unknown priority: ${priority}`);
    }
    const tags = [...text.matchAll(TAG_PATTERN)].map((m) => m[1].toLowerCase());
    const item = { id: this.#nextId++, text, priority, due, tags, done: false };
    this.#items.set(item.id, item);
    this.#emit("add", item);
    return item.id;
  }

  toggle(id) {
    const item = this.#items.get(id);
    if (item === undefined) return false;
    item.done = !item.done;
    this.#emit("toggle", item);
    return true;
  }

  get pending() {
    return [...this.#items.values()].filter((i) => !i.done);
  }

  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  #emit(type, item) {
    for (const fn of this.#listeners) fn({ type, item, at: Date.now() });
  }
}

const store = new TodoStore();
const unsubscribe = store.subscribe(({ type, item }) =>
  console.log(`[${type}] #${item.id} ${item.text}`)
);

store.add("Review palette #design", { priority: "high" });
const id = store.add("Write samples #docs #light-theme");
store.toggle(id);

console.log("Pending:", store.pending.length, "— done in", 0.5e3, "ms");
unsubscribe();
