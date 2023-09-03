const app = require("./app");

app.listen(process.env.PORT, () => {
  console.log(`Server Running at PORT ${process.env.PORT}`);
});
