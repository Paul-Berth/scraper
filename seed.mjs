import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import fs from 'fs';

let rawdata = fs.readFileSync('dataDessertRecipeFinal.json');
let recipes = JSON.parse(rawdata);
const prisma = new PrismaClient();

async function main() {
  const nbUser = 20;
  const chunkSize = recipes.length / nbUser;
  for (let i = 0; i < nbUser; i++) {
    console.log(`user: ${i}/${nbUser}`);
    const recipesUser = recipes.slice(i * chunkSize, (i + 1) * chunkSize);
    // Generate User
    const user = await prisma.user.create({
      data: {
        name: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
      },
    });

    // Add recipe for this user
    for (let j = 0; j < recipesUser.length; j++) {
      const ingredients = recipesUser[j].ingredients.map((ingredient) => {
        return {
          name: ingredient.nameFormat,
          idImage: '',
          qte: ingredient.qte,
          unity: ingredient.unity,
          family: 'OTHER',
          userId: user.id,
        };
      });

      console.log(`recipe: ${j}/${recipesUser.length}`);
      try {
        await prisma.recipe.create({
          data: {
            title: recipesUser[j].title,
            timeToCook: recipesUser[j].timeToCookMin,
            nbPeople: recipesUser[j].nbPeople,
            type: recipesUser[j].typeRecipe,
            ingredients: {
              create: ingredients,
            },
            userId: user.id,
          },
        });
      } catch (e) {
        console.log('error');
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
