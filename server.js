const Sequelize = require("sequelize");
const { STRING } = Sequelize;
const sequelize = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/thing_db"
);
const path = require("path");

const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
const Thing = sequelize.define("thing", {
  name: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
});

app.use("/src", express.static(path.join(__dirname, "src"))); // express static needs a folder available!!! /src

app.delete("/api/things/:id", async (req, res, next) => {
  try {
    const thing = await Thing.findByPk(req.params.id);
    await thing.destroy();
    res.sendStatus(204); //this is the delete status
  } catch (err) {
    next(err);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/things", async (req, res, next) => {
  try {
    res.send(await Thing.findAll());
  } catch (e) {
    next(e);
  }
});

const init = async () => {
  try {
    await sequelize.sync({ force: true });
    const bar = await Thing.create({ name: "bar" });
    const baz = await Thing.create({ name: "baz" });
    const foo = await Thing.create({ name: "foo" });

    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (e) {
    console.log(e);
  }
};

init();
