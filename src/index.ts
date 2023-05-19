type IdType = number | string;

type ItemType = {
  id: IdType;
  parent: IdType | null;
  children?: ItemsArrType;
  type?: null | string;
};

type ItemsArrType = Array<ItemType>;

type TreeStoreType = {
  items: ItemsArrType;
};

class TreeStore {
  items: ItemsArrType;
  root: ItemType;
  tree: ItemsArrType;
  constructor(items: ItemsArrType) {
    this.items = items;
    this.root = this.createTree();
    this.tree = this.root.children as ItemsArrType;
  }

  createTree = () => {
    const map: object = Object.assign(
      {},
      ...this.items.map((v) => ({
        [v.id]: Object.assign(v, { children: [] }),
      }))
    );

    return {
      id: 'root',
      parent: null,
      children: Object.values(map).filter(
        (v) => !(v?.parent && map[v?.parent]?.children.push(v))
      ),
    };
  };

  searchTreeById = (id: IdType) => {
    const searchIteration = (
      arr: ItemsArrType,
      id: IdType
    ): ItemType | null => {
      let res: ItemType | null = null;

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          res = arr[i];
        } else {
          res = searchIteration(arr[i].children as ItemsArrType, id);
        }
        if (res) break;
      }
      return res;
    };

    return searchIteration(this.tree, id);
  };

  getAll = () => {
    return this.items;
  };

  getItem = (id: IdType) => {
    return this.searchTreeById(id);
  };

  getChildren = (id: IdType) => {
    const startPoint = this.searchTreeById(id);
    return startPoint?.children ? startPoint.children : null;
  };

  getAllChildren = (id: IdType) => {
    const startPoint = this.searchTreeById(id);
    const getNestedChildren = (arr: ItemsArrType) => {
      let children: ItemsArrType = [...arr];
      arr.forEach((e) => {
        if (!e.children) return;
        children = [...children, ...getNestedChildren(e.children)];
      });

      return children;
    };
    if (!startPoint || !startPoint.children) return null;
    return getNestedChildren(startPoint.children);
  };

  getAllParents = (id: IdType) => {
    let cur = this.searchTreeById(id);
    let res = [cur];
    if (cur === undefined) return null;
    while (cur?.parent) {
      const next = this.searchTreeById(cur!.parent) as ItemType;
      res.push(next);
      cur = next;
    }

    return res;
  };
}

const items = [
  { id: 1, parent: 'root' },
  { id: 2, parent: 1, type: 'test' },
  { id: 3, parent: 1, type: 'test' },

  { id: 4, parent: 2, type: 'test' },
  { id: 5, parent: 2, type: 'test' },
  { id: 6, parent: 2, type: 'test' },

  { id: 7, parent: 4, type: null },
  { id: 8, parent: 4, type: null },
];
const ts = new TreeStore(items);

console.log(ts.getAllChildren(2));
