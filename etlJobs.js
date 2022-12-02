const fs = require('fs');

let rawDataIngredients = fs.readFileSync('dataIngredientsName2.txt', 'utf8');
rawDataIngredients = rawDataIngredients.split('\n');
let rawdata = fs.readFileSync('dataDessertRecipe.json');
let recipes = JSON.parse(rawdata);

const regex = new RegExp(
  '([\\d]+)?([  ])?((?:h)(?=[  ]))?([  ])?([\\d]+)?',
  'i'
);

for (let i = 0; i < recipes.length; i++) {
  // format title
  recipes[i].title = recipes[i].title.trim();

  // format time
  const regex = new RegExp(
    '([\\d]+)?([  ])?((?:h)(?=[  ]))?([  ])?([\\d]+)?',
    'i'
  );
  const res = [...recipes[i].timeToCook.match(regex)];
  let newTime = 0;
  if (res[3] === 'h')
    newTime = Number.parseInt(res[1]) * 60 + Number.parseInt(res[5]);
  else newTime = Number.parseInt(res[1]);
  recipes[i].timeToCookMin = newTime;
  if (recipes[i].timeToCookMin == null) recipes[i].timeToCookMin = 0;

  // change size unity : put kg->g, cl->ml, l->ml
  for (let y = 0; y < recipes[i].ingredients.length; y++) {
    if (recipes[i].ingredients[y].unity === 'kg') {
      recipes[i].ingredients[y].qte =
        Number.parseInt(recipes[i].ingredients[y].qte) * 1000;
      recipes[i].ingredients[y].unity = 'G';
    } else if (recipes[i].ingredients[y].unity === 'cl') {
      recipes[i].ingredients[y].qte =
        Number.parseInt(recipes[i].ingredients[y].qte) * 10;
      recipes[i].ingredients[y].unity = 'ML';
    } else if (recipes[i].ingredients[y].unity === 'l') {
      recipes[i].ingredients[y].qte =
        Number.parseInt(recipes[i].ingredients[y].qte) * 1000;
      recipes[i].ingredients[y].unity = 'ML';
    } else {
      recipes[i].ingredients[y].qte =
        Number.parseInt(recipes[i].ingredients[y].qte) || 1;
    }
  }

  // format unity name : g -> G, c.à.s -> CAS
  for (let y = 0; y < recipes[i].ingredients.length; y++) {
    if (recipes[i].ingredients[y].unity === 'g')
      recipes[i].ingredients[y].unity = 'G';
    if (recipes[i].ingredients[y].unity === 'c.à.s')
      recipes[i].ingredients[y].unity = 'CAS';
    if (recipes[i].ingredients[y].unity === 'c.à.c')
      recipes[i].ingredients[y].unity = 'CAC';
    if (recipes[i].ingredients[y].unity === 'ml')
      recipes[i].ingredients[y].unity = 'ML';
    if (recipes[i].ingredients[y].unity === '')
      recipes[i].ingredients[y].unity = 'Piece';
  }

  // format string to number
  recipes[i].nbPeople = Number.parseInt(recipes[i].nbPeople);

  // format names ingredients
  for (let y = 0; y < recipes[i].ingredients.length; y++) {
    const filterNames = rawDataIngredients.filter((e) =>
      recipes[i].ingredients[y].name.includes(e)
    );
    const newName =
      filterNames.length > 0 ? filterNames[0] : recipes[i].ingredients[y].name;
    recipes[i].ingredients[y].nameFormat = newName.trim();
  }
}

fs.writeFileSync('dataDessertRecipeFinal.json', JSON.stringify(recipes));

// let ingredientsName = '';
// for (let i = 0; i < recipes.length; i++) {
//   for (let y = 0; y < recipes[i].ingredients.length; y++) {
//     const filterNames = rawDataIngredients.filter((e) =>
//       recipes[i].ingredients[y].name.includes(e)
//     );
//     // console.log(filterNames);
//     const newName =
//       filterNames.length > 0 ? filterNames[0] : recipes[i].ingredients[y].name;
//     ingredientsName += newName + '\n';
//   }
// }

// fs.writeFileSync('ingredientsName.txt', ingredientsName);
