const result = (min, max) =>
    Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);

for (let i = 0; i <= 10; i++) {
    console.log(result(1, 100));
};