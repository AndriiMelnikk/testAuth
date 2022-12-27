import Config from '../../config';

type useRange = (page: number, range?: number) => { rangeFrom: number; rangeTo: number };

const useRange: useRange = (page, range = 0) => {
  const rangeDefault = range ? range : Config.RANGE;

  const rangeFrom: number = page == 1 ? 0 : (Number(page) - 1) * (rangeDefault - 1) + Number(page) - 1;

  const rangeTo =
    page == 1
      ? rangeDefault - 1
      : (Number(page) - 1) * (rangeDefault - 1) + Number(page) - 1 + Number(rangeDefault - 1);
  return { rangeFrom, rangeTo };
};

export default useRange;
