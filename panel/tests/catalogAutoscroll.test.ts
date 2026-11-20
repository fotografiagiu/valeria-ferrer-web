import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const catalog = readFileSync(new URL('../web/src/components/CatalogScreen.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../web/src/modernPanel.css', import.meta.url), 'utf8');

describe('catalogue drag autoscroll: web and installed PWA', () => {
  it('accelerates when the handle reaches the top/bottom 30% of the viewport', () => {
    expect(catalog).toMatch(/thresholds:\s*\{\s*x:\s*0\.05,\s*y:\s*0\.3\s*\}/);
    expect(catalog).toMatch(/acceleration:\s*18/);
    expect(catalog).toMatch(/interval:\s*5/);
    expect(catalog).toContain('autoScroll={CATALOG_AUTO_SCROLL}');
  });

  it('uses immediate scrolling only during an active drag, restoring on drop/cancel/unmount', () => {
    expect(catalog).toMatch(/function onDragStart\(\)\s*\{[\s\S]*?classList\.add\(CATALOG_DRAG_CLASS\)/);
    expect(catalog).toMatch(/function onDragCancel\(\)\s*\{[\s\S]*?classList\.remove\(CATALOG_DRAG_CLASS\)/);
    expect(catalog).toMatch(/function onDragEnd\(event: DragEndEvent\)\s*\{\s*document\.documentElement\.classList\.remove/);
    expect(catalog).toMatch(/useEffect\(\(\) => \{\s*return \(\) => document\.documentElement\.classList\.remove/);
    expect(styles).toContain('html { scroll-behavior:smooth; }');
    expect(styles).toMatch(/html\.vf-catalog-dragging,[\s\S]*?scroll-behavior:\s*auto !important/);
  });

  it('does not change service-order persistence or mobile touch activator', () => {
    expect(catalog).toContain('applyLocalModels(arrayMove(models, oldIndex, newIndex))');
    expect(catalog).toContain('const result = await putOrder(');
    expect(catalog).toContain("useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } })");
  });
});
