export const areObjectsPartsEqualUtil = (obj1: unknown, obj2: unknown) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  return keys1.some((key) => keys2.includes(key) && obj1[key] === obj2[key]);
}