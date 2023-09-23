const fs = require('fs');
const superagent = require('superagent');

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) return reject('I could not find the file 🆘');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) return reject('I could not write the file 🆘');
      resolve('success');
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
    const imgs = all.map((el) => el.body.message);
    console.log(imgs);

    await writeFilePro('dog-img.txt', imgs.join('\n'));
    console.log('Random image saved to file');
  } catch (err) {
    console.error(err);
    throw err;
  }
  return '2: READY🆗';
};
(async()=>{
try {
  console.log('1: will get dogPic');
  const x =await getDogPic();
  console.log(x);
  console.log('3: done getting dogPic');
}catch(err) {
  console.log('ERROR 🔻');
}
})();



/*
console.log('1: will get dogPic');
getDogPic()
  .then((x) => {
    console.log(x);
    console.log('3: done getting dogPic');
  })
  .catch((err) => {
    console.log('ERROR 🔻');
  });
*/
/*
readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePro('dog-img.txt', res.body.message);
  })
  .then(() => {
    console.log('Random image saved to file');
  })
  .catch((err) => {
    console.error(err);
  });
*/
