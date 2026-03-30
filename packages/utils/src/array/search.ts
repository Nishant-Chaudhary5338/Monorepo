export function binarySearch<T>(sortedArr: T[], target: T): number {
  if (!sortedArr?.length) return -1;
  let left = 0;
  let right = sortedArr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (sortedArr[mid] === target) return mid;
    if (sortedArr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

export function findIndex<T>(arr: T[], predicate: (item: T, index: number) => boolean): number {
  if (!arr?.length) return -1;
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i)) return i;
  }
  return -1;
}

export function findLastIndex<T>(arr: T[], predicate: (item: T, index: number) => boolean): number {
  if (!arr?.length) return -1;
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i], i)) return i;
  }
  return -1;
}
