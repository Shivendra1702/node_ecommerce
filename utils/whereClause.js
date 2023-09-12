//base = Product.find();
//bigQ = //search=shirt&page=2&category=shortsleeves&rating[gte]=4&limit=2&sort=price

class WhereClause {
  constructor(base, bigQ) {
    this.base = base;
    this.bigQ = bigQ;
  }

  search() {
    const searchWord = this.bigQ.search
      ? {
          name: {
            $regex: this.bigQ.search,
            $options: "i",
          },
        }
      : {};

    this.base = this.base.find(searchWord);
    return this;
  }

  filter() {
    const queryCopy = { ...this.bigQ };

    delete queryCopy["search"];
    delete queryCopy["page"];
    delete queryCopy["limit"];

    const queryStr = JSON.stringify(queryCopy);
    const queryStringWithDollar = queryStr.replace(
      /\b{gt|gte|lt|lte}\b/g,
      (m) => `$${m}`
    );

    const jsonQuery = JSON.parse(queryStringWithDollar);

    this.base = this.base.find(jsonQuery);
    return this;
  }

  pager(resultPerPage) {
    const currentPage = this.bigQ.page || 1;
    const skipval = resultPerPage * (currentPage - 1);

    this.base = this.base.limit(resultPerPage).skip(skipval);
    return this;
  }
  
}

module.exports = WhereClause;
