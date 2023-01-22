function fn(str) {
    /** YOUR CODE GOES HERE /**/
    return {
      fn: function (s) {
        if (s) {
          str += ` ${s}`;
          return this;
        }
        return str;
      },
    };
  }
  
  console.log(fn("This").fn("is").fn("just").fn("a").fn("test").fn());
    // O/P print: This is just a test