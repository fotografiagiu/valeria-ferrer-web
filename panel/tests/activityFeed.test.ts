import { describe, expect, it } from 'vitest';
import { formatActivityItems } from '../src/lib/activityFeed.js';

const names = new Map([
  ['karen', 'Karen'],
  ['sara', 'Sara'],
  ['claudia', 'Claudia'],
]);

describe('formatActivityItems', () => {
  it('formats cover updates and skips auth noise', () => {
    const items = formatActivityItems(
      [
        {
          id: 1,
          createdAt: new Date('2026-09-11T10:42:00.000Z'),
          action: 'auth.login',
          modelSlug: null,
          staffUserId: 'staff-1',
          before: null,
          after: null,
        },
        {
          id: 2,
          createdAt: new Date('2026-09-11T10:42:00.000Z'),
          action: 'cover.update',
          modelSlug: 'sara',
          staffUserId: 'staff-1',
          before: { coverImagePath: '/a.jpg' },
          after: { coverImagePath: '/b.jpg' },
        },
      ],
      { names, limit: 30 }
    );

    expect(items).toEqual([
      {
        id: '2:cover',
        at: '2026-09-11T10:42:00.000Z',
        slug: 'sara',
        subject: 'Sara',
        summary: 'portada cambiada',
        automatic: false,
      },
    ]);
  });

  it('expands order.replace into per-girl position lines', () => {
    const items = formatActivityItems(
      [
        {
          id: 10,
          createdAt: new Date('2026-09-11T11:05:00.000Z'),
          action: 'order.replace',
          modelSlug: null,
          staffUserId: 'staff-1',
          before: [
            { slug: 'sara', displayOrder: 1 },
            { slug: 'karen', displayOrder: 25 },
          ],
          after: [
            { slug: 'karen', displayOrder: 6 },
            { slug: 'sara', displayOrder: 1 },
          ],
        },
      ],
      { names, limit: 30 }
    );

    expect(items).toContainEqual({
      id: '10:order:karen',
      at: '2026-09-11T11:05:00.000Z',
      slug: 'karen',
      subject: 'Karen',
      summary: 'posición 25 → 6',
      automatic: false,
    });
    expect(items.some((item) => item.slug === 'sara')).toBe(false);
  });

  it('expands catalog.sync added as Sistema lines', () => {
    const items = formatActivityItems(
      [
        {
          id: 20,
          createdAt: new Date('2026-09-11T11:31:00.000Z'),
          action: 'catalog.sync',
          modelSlug: null,
          staffUserId: null,
          before: { keptActive: ['sara'], deactivated: ['claudia', 'kim'] },
          after: {
            added: ['karen'],
            reactivatedAtEnd: [],
            coversReset: [],
            orderVersionBumped: true,
          },
        },
      ],
      { names, limit: 30 }
    );

    expect(items).toEqual([
      {
        id: '20:add:karen',
        at: '2026-09-11T11:31:00.000Z',
        slug: 'karen',
        subject: 'Sistema',
        summary: 'Karen añadida desde la web',
        automatic: true,
      },
    ]);
  });
});
