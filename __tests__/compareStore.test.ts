import { useCompareStore, CompareProduct } from '../lib/compareStore';

const testProduct1: CompareProduct = {
  id: 'prod-1',
  title: 'Samsung Galaxy A54',
  price: 218300,
  image: '/test1.jpg',
  category: 'Électronique',
  vendor: 'Tchad Tech',
  rating: 4.8,
  reviews: 3,
};

const testProduct2: CompareProduct = {
  id: 'prod-2',
  title: 'Laptop Lenovo IdeaPad 3',
  price: 377600,
  image: '/test2.jpg',
  category: 'Électronique',
  vendor: 'Tchad Tech',
  rating: 4.6,
  reviews: 2,
};

describe('useCompareStore', () => {
  beforeEach(() => {
    useCompareStore.getState().clear();
  });

  test('should initially be empty', () => {
    expect(useCompareStore.getState().items).toEqual([]);
  });

  test('should add products and check existence', () => {
    const store = useCompareStore.getState();
    store.add(testProduct1);

    expect(useCompareStore.getState().items).toHaveLength(1);
    expect(useCompareStore.getState().items[0]).toEqual(testProduct1);
    expect(useCompareStore.getState().has('prod-1')).toBe(true);
    expect(useCompareStore.getState().has('prod-2')).toBe(false);
  });

  test('should not add duplicate products', () => {
    const store = useCompareStore.getState();
    store.add(testProduct1);
    store.add(testProduct1); // duplicate

    expect(useCompareStore.getState().items).toHaveLength(1);
  });

  test('should remove products', () => {
    const store = useCompareStore.getState();
    store.add(testProduct1);
    store.add(testProduct2);
    
    useCompareStore.getState().remove('prod-1');

    expect(useCompareStore.getState().items).toHaveLength(1);
    expect(useCompareStore.getState().items[0].id).toBe('prod-2');
  });

  test('should limit items to 4 maximum', () => {
    const store = useCompareStore.getState();
    for (let i = 1; i <= 5; i++) {
      store.add({
        ...testProduct1,
        id: `prod-${i}`,
        title: `Product ${i}`,
      });
    }

    expect(useCompareStore.getState().items).toHaveLength(4);
  });

  test('should clear all items', () => {
    const store = useCompareStore.getState();
    store.add(testProduct1);
    store.add(testProduct2);
    
    useCompareStore.getState().clear();

    expect(useCompareStore.getState().items).toEqual([]);
  });
});
