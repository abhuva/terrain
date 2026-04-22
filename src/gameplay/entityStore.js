export function createEntityStore() {
  const entities = new Map();
  const clone = typeof structuredClone === "function"
    ? structuredClone
    : (value) => JSON.parse(JSON.stringify(value));

  function upsert(entity) {
    if (!entity || typeof entity.id !== "string") return;
    entities.set(entity.id, clone(entity));
  }

  function remove(id) {
    entities.delete(id);
  }

  function get(id) {
    const entity = entities.get(id);
    return entity ? clone(entity) : null;
  }

  function list() {
    return Array.from(entities.values()).map((entity) => clone(entity));
  }

  return {
    upsert,
    remove,
    get,
    list,
  };
}
