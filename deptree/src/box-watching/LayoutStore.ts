// stores/useLayoutStore.ts
import { defineStore } from 'pinia';

interface Box {
  width:  number;
  height: number;
  x:      number;
  y:      number;
}

export const layoutStore = defineStore('layout', {
  state: () => ({
    boxes: {} as Record<string, Box>,   // id → measurements
    boxwidths: {} as Record<string,Number>
  }),
  getters: {



  },
  actions: {
    updateBox(id: string, b: Box) {
      const prev = this.boxes[id];
      // avoid useless Vue updates
      if (
        !prev ||
        prev.width  !== b.width  ||
        // prev.height !== b.height ||
        prev.x      !== b.x    //  ||
        // prev.y      !== b.y
      ) {
        this.boxes[id] = b;
      }
      if (!prev || prev.width != b.width) {
        console.log(`width change for box ${id}: ${prev.width} -> ${b.width}`)
        this.boxwidths[id]  = b.width
      }
    },
    removeBox(id: string) {
      delete this.boxes[id];
    },
  },
});

