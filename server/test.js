// const fs = require('fs');
// const faker = require('faker');
// const cateogyries = ['apple', 'man', 'woman', 'mobile'];
// const imgCategories = ['sports', 'people', 'food', 'cats', 'fashion'];
// const result = [];

// function getRandom(min = 1, max = 4) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// for (let i = 0; i < 100; i++) {
//   const product_id = `product${i}`;
//   const title = faker.commerce.productName();
//   const price = faker.commerce.price(10, 1000);
//   const description = faker.commerce.productDescription();
//   const content = faker.lorem.words(30);
//   const images = [];
//   const imgCategory = faker.helpers.randomize(imgCategories);
//   for (let j = 0; j < getRandom(); j++) {
//     images.push(faker.image[imgCategory](400));
//   }
//   const category = faker.helpers.randomize(cateogyries);
//   result.push({
//     product_id,
//     title,
//     price,
//     description,
//     content,
//     images: [{ filename: images, url: images }],
//     category,
//   });
// }

// fs.writeFile('mockDB.json', JSON.stringify(result), (err) => {
//   if (err) throw err;
//   console.log('success');
// });

const price = { gte: '100' };

// const result = JSON.stringify(price).replace(
//   /\b(gte|gt|lt|lte)\b/g,
//   (match) => '$' + match
// );

// const test = {
//   ...(price ? { price: JSON.parse(result) } : {}),
// };

// console.log(test);

const title = 'client';
const priceQuery =
  price &&
  JSON.stringify(price).replace(/\b(gte|gt|lt|lte)\b/g, (match) => '$' + match);
const query = {
  ...(title ? { title: new RegExp(title, 'i') } : {}),
  ...(price ? { price: JSON.parse(priceQuery) } : {}),
};

console.log(query);
