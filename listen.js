const app = require("./Express/app");
const { PORT = 6543 } = process.env;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
