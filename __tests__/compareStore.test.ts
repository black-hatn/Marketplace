import { act, renderHook } from '@testing-library/react';
import { useCompareStore } from '@/lib/compareStore';

const makeProduct = (id: string) => ({
  id,
  title: `Product ${id}`,
  price: 1000,
  image: '/img.jpg',
  category: 'Test',
  vendor: 'Vendor',
  rating: 4.5,
  reviews: 10,
});

beforeEach(() => {
  act(() => useCompareStore.getState().clear());
});

describe('useCompareStore', () => {
  it('adds a product', () => {
    const { result } = renderHook(() => useCompareStore());
    act(() => result.current.add(makeProduct('a')));
    expect(result.current.items).toHaveLength(1);
  });

  it('does not add duplicate', () => {
    const { result } = renderHook(() => useCompareStore());
    act(() => {
      result.current.add(makeProduct('b'));
      result.current.add(makeProduct('b'));
    });
    expect(result.current.items).toHaveLength(1);
  });

  it('caps at 4 items', () => {
    const { result } = renderHook(() => useCompareStore());
    act(() => {
      ['c1', 'c2', 'c3', 'c4', 'c5'].forEach((id) =>
        result.current.add(makeProduct(id))
      );
    });
    expect(result.current.items).toHaveLength(4);
  });

  it('removes a product by id', () => {
    const { result } = renderHook(() => useCompareStore());
    act(() => {
      result.current.add(makeProduct('d'));
      result.current.remove('d');
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('has() returns correct boolean', () => {
    const { result } = renderHook(() => useCompareStore());
    act(() => result.current.add(makeProduct('e')));
    expect(result.current.has('e')).toBe(true);
    expect(result.current.has('x')).toBe(false);
  });

  it('clear() empties store', () => {
    const { result } = renderHook(() => useCompareStore());
    act(() => {
      result.current.add(makeProduct('f'));
      result.current.clear();
    });
    expect(result.current.items).toHaveLength(0);
  });
});
