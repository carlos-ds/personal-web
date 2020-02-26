// required packages
const fetch = require("node-fetch");

// DatoCMS token
const token = process.env.DATOCMS_TOKEN;

// get blogposts
// see https://www.datocms.com/docs/content-delivery-api/first-request#vanilla-js-example
async function getAllBooks() {
  // max number of records to fetch per query
  const recordsPerQuery = 100;

  // number of records to skip (start at 0)
  let recordsToSkip = 0;

  // do we make a query ?
  let makeNewQuery = true;

  // Blogposts array
  let books = [];

  // make queries until makeNewQuery is set to false
  while (makeNewQuery) {
    try {
      // initiate fetch
      const dato = await fetch("https://graphql.datocms.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `{
            allBooks(
              first: ${recordsPerQuery},
              skip: ${recordsToSkip},
              orderBy: _createdAt_DESC,
              filter: {
                _status: {eq: published}
              }
            )
            {
              title
            }
          }`
        })
      });

      // store the JSON response when promise resolves
      const response = await dato.json();

      // handle DatoCMS errors
      if (response.errors) {
        let errors = response.errors;
        errors.map(error => {
          console.log(error.message);
        });
        throw new Error("Aborting: DatoCMS errors");
      }

      // update blogpost array with the data from the JSON response
      books = books.concat(response.data.allBooks);

      // prepare for next query
      recordsToSkip += recordsPerQuery;

      // check if we are geting back less than the records we fetch per query
      // if yes, stop querying
      if (response.data.allBooks.length < recordsPerQuery) {
        makeNewQuery = false;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  // format books objects
  const booksFormatted = books.map(item => {
    return {
      title: item.title
    };
  });

  // return formatted books
  return booksFormatted;
}

// export for 11ty
module.exports = getAllBooks;
