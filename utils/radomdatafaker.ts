import { faker } from '@faker-js/faker';

export class RandomDataFaker {
  static amount(min = 100, max = 3000): string {
    return faker.number.int({ min, max }).toString();
  }

  static vendorName(): string {
    return faker.company.name();
  }

  static expenseDescription(): string {
    const category = faker.helpers.arrayElement([
      'Taxi', 'Lunch', 'Hotel', 'Fuel', 'Parking', 'Flight', 'Office supplies'
    ]);
  
    return `${category} expense for ${faker.company.name()} meeting`;
  }

  static notes(prefix = 'Initial Insert'): string {
    return `${prefix} ${faker.string.alphanumeric({ length: 6, casing: 'upper' })}`;
  }

}
