import { describe, expect, it } from 'vitest';
import { formatActivityItems } from '../src/lib/activityFeed.js';

const names = new Map([
  ['karen', 'Karen'],
  ['sara', 'Sara'],
  ['erika', 'Erika'],
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
        summary: 'portada actualizada',
        automatic: false,
      },
    ]);
  });

  it('collapses order.replace into one summary card with preview details', () => {
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
            { slug: 'erika', displayOrder: 2 },
            { slug: 'karen', displayOrder: 3 },
            { slug: 'claudia', displayOrder: 4 },
          ],
          after: [
            { slug: 'erika', displayOrder: 1 },
            { slug: 'sara', displayOrder: 2 },
            { slug: 'karen', displayOrder: 3 },
            { slug: 'claudia', displayOrder: 4 },
          ],
        },
      ],
      { names, limit: 30 }
    );

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: '10:order',
      subject: 'Orden de fichas',
      summary: '2 posiciones modificadas',
      automatic: false,
    });
    expect(items[0].details?.[0]).toContain('Erika');
    expect(items[0].details?.[1]).toContain('Sara');
  });

  it('uses a single line when only one position changes', () => {
    const items = formatActivityItems(
      [
        {
          id: 11,
          createdAt: new Date('2026-09-11T11:06:00.000Z'),
          action: 'order.replace',
          modelSlug: null,
          staffUserId: 'staff-1',
          before: [
            { slug: 'sara', displayOrder: 1 },
            { slug: 'karen', displayOrder: 25 },
          ],
          after: [
            { slug: 'sara', displayOrder: 1 },
            { slug: 'karen', displayOrder: 6 },
          ],
        },
      ],
      { names, limit: 30 }
    );

    expect(items).toEqual([
      {
        id: '11:order',
        at: '2026-09-11T11:06:00.000Z',
        slug: null,
        subject: 'Orden de fichas',
        summary: 'Karen 25 → 6',
        automatic: false,
      },
    ]);
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
