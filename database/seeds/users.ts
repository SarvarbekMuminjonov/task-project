import { Knex } from 'knex';
import { faker } from '@faker-js/faker';

const generateUser = () => {
  const firstname = faker.name.firstName();
  const lastname = faker.name.lastName();
  const email = faker.internet.email(firstname, lastname);
  const password = faker.internet.password();
  return {
    firstname,
    lastname,
    email,
    password,
  };
};

const users = Array.from({ length: 50 }, generateUser);

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert({
    firstname: 'Sarvarbek',
    lastname: 'Muminjonov',
    password: '$2b$10$7Xtx/NH0Su5WM27gwyMRYu8m/ek6j/XwYa4PusaGIwrX.CT5/De3C',
    email: 'sarvar@gmail.com',
    role: 'admin',
  });
  await knex('users').insert(users);
}
