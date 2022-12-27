import { WhoseError } from './useResponse';

export enum TypeData {
  string = 'string',
  number = 'number',
  includes = 'includes',
  everyNumber = 'everyNumber',
  date = 'date',
  boolean = 'boolean',
  time = 'time',
  array = 'array',
  obj = 'obj',
}

type Params = (data: any, type: TypeData, errorValue: string, object?: object, array?: Array<any>) => void;

const useCheckValue: Params = (data: any, type: TypeData, errorValue: string, object = {}, array = []) => {
  const stringType = (str: string, errorValue: string) => {
    if (typeof str !== 'string') {
      throw new Error(`${WhoseError.web} ${errorValue} it's not string`);
    }
  };

  const numberType = (numb: number, errorValue: string) => {
    if (isNaN(numb) || typeof numb === 'boolean' || Array.isArray(numb)) {
      throw new Error(`${WhoseError.web} ${errorValue} it's not number`);
    }
    return true;
  };

  const includesType = (str: string, errorValue: string, obj: object) => {
    if (!Object.values(obj).includes(str)) {
      throw new Error(`${WhoseError.web} "${errorValue}" it's not in an accessible ${JSON.stringify(obj)}`);
    }
    return true;
  };

  const everyNumber = (arr: Array<any>, errorValue: string) => {
    try {
      arr.every(el => numberType(el, `${WhoseError.web} In ${errorValue} "${el}"`));
      return true;
    } catch (e: any) {
      throw new Error(`${WhoseError.web} ${e}`);
    }
  };

  const dateType = (str: string, errorValue: string) => {
    try {
      const [splitYear, splitMonth, splitDay] = str.split('-');
      const checkDate = new Date(str);
      if (
        splitYear.length !== 4 ||
        splitMonth.length !== 2 ||
        splitDay.length !== 2 ||
        !(checkDate instanceof Date) ||
        String(checkDate) === 'Invalid Date' ||
        !str
      ) {
        throw new Error(`${WhoseError.web} "${errorValue}" it's not new Date()`);
      }
      return true;
    } catch (e: any) {
      throw new Error(`${WhoseError.web} "${errorValue}" it's not new Date()`);
    }
  };

  const booleanType = (bool: number, errorValue: string) => {
    if (typeof bool !== 'boolean') {
      throw new Error(`${WhoseError.web} ${errorValue} it's not boolean`);
    }
    return true;
  };

  const timeType = (str: string, errorValue: string) => {
    try {
      const [splitHour, splitMin, splitSec] = str.split(':');
      if (
        splitHour.length !== 2 ||
        splitMin.length !== 2 ||
        splitSec.length !== 2 ||
        Number(splitHour) > 25 ||
        Number(splitMin) > 60 ||
        Number(splitHour) > 60
      ) {
        throw new Error(`${WhoseError.web} "${errorValue}" it's not Time`);
      }
      return true;
    } catch (e: any) {
      throw new Error(`${WhoseError.web} "${errorValue}" it's not Time`);
    }
  };

  const arrayType = (array: [], errorValue: string) => {
    if (!Array.isArray(array)) {
      throw new Error(`${WhoseError.web} ${errorValue} it's not array`);
    }
    return true;
  };

  const objType = (arrObj: [], errorValue: string, array: any[]) => {
    if (!Array.isArray(arrObj)) {
      throw new Error(`${WhoseError.web} ${errorValue} it's not array`);
    }

    arrObj.forEach((el: any) => {
      array.forEach((e: string) => {
        if (!Object.keys(el).includes(e)) {
          throw new Error(`${WhoseError.web} "${errorValue}" values are not equal to the example [${array}]`);
        }
      });
    });

    return true;
  };

  switch (type) {
    case TypeData.string: {
      return stringType(data, errorValue);
    }
    case TypeData.number: {
      return numberType(data, errorValue);
    }
    case TypeData.includes: {
      return includesType(data, errorValue, object);
    }
    case TypeData.everyNumber: {
      return everyNumber(array, errorValue);
    }
    case TypeData.date: {
      return dateType(data, errorValue);
    }
    case TypeData.boolean: {
      return booleanType(data, errorValue);
    }
    case TypeData.time: {
      return timeType(data, errorValue);
    }
    case TypeData.array: {
      return arrayType(data, errorValue);
    }
    case TypeData.obj: {
      return objType(data, errorValue, array);
    }
  }
};

export default useCheckValue;
