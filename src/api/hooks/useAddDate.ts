type useAddDate = (date: string, period: number, type: string) => string | undefined;

const useAddDate: useAddDate = (date, period = 0, type = 'day') => {
  const toDate = (dateToDay: Date) => {
    const dd = String(dateToDay.getDate()).padStart(2, '0');
    const mm = String(dateToDay.getMonth() + 1).padStart(2, '0');
    const yyyy = dateToDay.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  let endDate;

  switch (type) {
    case 'day':
      const dateDay = new Date(date).setDate(new Date(date).getDate() + Number(period));
      return (endDate = toDate(new Date(dateDay)));

    default:
      break;
  }

  return endDate;
};

export default useAddDate;
