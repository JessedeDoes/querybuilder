// directives/v-report-box.ts
import { layoutStore } from './LayoutStore.ts';
import { throttle } from 'lodash-es';          // or roll your own

export default {
  mounted(el: HTMLElement, binding) {
    const id    = binding.value;               // v-report-box=\"'token-7'\"
    const store = layoutStore();

    const report = throttle(
      () => {
      const rect = el.getBoundingClientRect();
      if (el) {
      const siblings = el.parentElement.children;
      const array = [...siblings];
      // console.log(`box layout change for ${id}: x=${rect.x}`);
      //console.log(rect); // ook the siblings doen.....
      array.forEach(c =>  {
      const id = c.getAttribute("data-id")
      const rect = c.getBoundingClientRect();
      store.updateBox(id, {
        width:  rect.width,
        height: rect.height,
        x:     rect.left,// + window.scrollX, do not report position, would trigger unwelcome redraws
        y:     rect.top //  + window.scrollY,
      });
    })
    }
    }, 100); // ± one animation frame

    /* watch size changes */
    const ro = new ResizeObserver(report);
    ro.observe(el);

    /* watch position changes (scroll, manual scrollLeft/Top) */
    window.addEventListener('scroll', report, true); // capture phase

    /* first measurement */
    report();

    /* cleanup */
    el._boxCleanup = () => {
      ro.disconnect();
      window.removeEventListener('scroll', report, true);
      store.removeBox(id);
    };
  },
  unmounted(el) {
    el._boxCleanup?.();
  },
};

