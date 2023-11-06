import { getDuplicates } from "../src/api/removeDuplicates";

describe('getDuplicates', () => {
  test('it should return an array of duplicate NewsItems with the same original_link', () => {
    const newsArray = [
      { id: 1, title: 'News 1', original_link: 'link1', },
      { id: 2, title: 'News 2', original_link: 'link2' },
      { id: 3, title: 'News 3', original_link: 'link1' },
      { id: 4, title: 'News 4', original_link: 'link3' },
      { id: 5, title: 'News 5', original_link: 'link1' },
    ];
    //@ts-ignore
    const duplicates = getDuplicates(newsArray);
    console.log("duplicates ",duplicates);
    expect(duplicates).toEqual([
      { id: 1, title: 'News 1', original_link: 'link1' },
    ]);
  });

  test('it should return an empty array when there are no duplicates', () => {
    const newsArray = [
      { id: 1, title: 'News 1', original_link: 'link1' },
      { id: 2, title: 'News 2', original_link: 'link2' },
      { id: 3, title: 'News 3', original_link: 'link3' },
    ];
    //@ts-ignore
    const duplicates = getDuplicates(newsArray);

    expect(duplicates).toEqual([]);
  });
});