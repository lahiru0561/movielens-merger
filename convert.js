const fs = require('fs');
const csv = require('csvtojson');
const Json2csvParser = require('json2csv').Parser;
let dataFilePath = './csv/data.csv';
let moviesFilePath = './csv/movies.csv';
let userFilePath = './csv/user.csv';
let data = null;
let movies = null;
let users = null;
const fields = [
  'user_id',
  'item_id',
  'rating',
  'timestamp',
  'movie_id',
  'movie_title',
  'release_date',
  'video_release_date',
  'unknown',
  'Action',
  'Adventure',
  'Animation',
  'Children',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Fantasy',
  'Film_Noir',
  'Horror',
  'Musical',
  'Mystery',
  'Romance',
  'Sci_Fi',
  'Thriller',
  'War',
  'Western',
  'age',
  'gender',
  'occupation',
  'zip_code'
];

const run = async () => {
  const finalArr = [];
  data = await getFile(dataFilePath);
  movies = await getFile(moviesFilePath);
  users = await getFile(userFilePath);

  //Iterate data
  data.map(item => {
    const movieobj = getMovieDetails(item.item_id);
    const userObj = getUserDetails(item.user_id);

    finalArr.push({
      ...userObj,
      ...item,
      ...movieobj
    });
  });

  //Convert to csv
  const json2csvParser = new Json2csvParser({ fields });
  const csv = json2csvParser.parse(finalArr);

  //Save file
  fs.writeFile('./dataset.csv', csv, err => {
    if (err) {
      return console.log(err);
    }

    console.log('The file was saved!');
  });
};

const getMovieDetails = key => {
  let returnObj = {};
  if (movies) {
    movies.map(item => {
      if (item.movie_id === key) {
        returnObj = item;
      }
    });
  } else {
    console.error('Movie object cannot be null');
  }
  //   console.log('returnObj', returnObj);
  return returnObj;
};

const getUserDetails = key => {
  let returnObj = {};
  if (users) {
    users.map(item => {
      if (item.user_id === key) {
        returnObj = item;
      }
    });
  } else {
    console.error('Users object cannot be null');
  }
  //   console.log('returnObj', returnObj);
  return returnObj;
};

const getFile = path => {
  return new Promise((resolve, reject) => {
    csv()
      .fromFile(path)
      .then(async data => {
        resolve(data);
      })
      .catch(e => {
        console.log('Error in getting csv to json', e);
      });
  });
};

run();
