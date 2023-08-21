/* eslint-disable no-undef */
import { paginateData } from '../src/lib/utils';

describe('paginateData', () => {
  it('should return the first page of data when page and limit are 1', () => {
    const data = [1, 2, 3, 4, 5];
    const options = { page: 1, limit: 1 };
    const result = paginateData(data, options);
    expect(result.currentPage).toBe(1);
    expect(result.hasNextPage).toBe(true);
    expect(result.items).toEqual([1]);
  });

  it('should return the second page of data when page is 2 and limit is 1', () => {
    const data = [1, 2, 3, 4, 5];
    const options = { page: 2, limit: 1 };
    const result = paginateData(data, options);
    expect(result.currentPage).toBe(2);
    expect(result.hasNextPage).toBe(true);
    expect(result.items).toEqual([2]);
  });

  it('should return the second page of data when page is 2 and limit is 2', () => {
    const data = [1, 2, 3, 4, 5];
    const options = { page: 2, limit: 2 };
    const result = paginateData(data, options);
    expect(result.currentPage).toBe(2);
    expect(result.hasNextPage).toBe(true);
    expect(result.items).toEqual([3, 4]);
  });

  it('should throw an error when data is not an array', () => {
    const data = 'not an array';
    const options = { page: 1, limit: 1 };
    expect(() => paginateData(data, options)).toThrow('Data must be an array.');
  });

  it('should throw an error when page or limit is not an integer or is less than or equal to 0', () => {
    const data = [1, 2, 3, 4, 5];
    const options1 = { page: 1.5, limit: 1 };
    const options2 = { page: 1, limit: -1 };
    expect(() => paginateData(data, options1)).toThrow('Invalid page or limit value.');
    expect(() => paginateData(data, options2)).toThrow('Invalid page or limit value.');
  });

  it('should return an empty array when page is greater than the total number of pages', () => {
    const data = [1, 2, 3, 4, 5];
    const options = { page: 4, limit: 2 };
    const result = paginateData(data, options);
    expect(result.currentPage).toBe(4);
    expect(result.hasNextPage).toBe(false);
    expect(result.items).toEqual([]);
  });
});
