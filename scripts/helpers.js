 function wait(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('done!');
      }, time);
    });
 }