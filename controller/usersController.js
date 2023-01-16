const User = require("../model/usersModel");
const jwt = require("jsonwebtoken");
const { listeners } = require("../model/usersModel");
const maxAge = 3 * 60 * 60 * 24;

const tokenGenerator = (id) => {
  return jwt.sign({ id }, process.env.PROJECT_SECRET, { expiresIn: maxAge });
};
const errorHandler = (error) => {
  const errObj = { email: "", password: "" };
  if (error.message == "invalid email") {
    errObj.email = "email not registered";
  }

  if (error.message == "invalid password") {
    errObj.password = "incorrect password";
  }

  return errObj;
};

class UsersRepo {
  about = (req, res) => {
    res.render("about");
  };
  login_post = async (req, res) => {
    try {
      const userx = await User.compareDetails(
        req.body.email,
        req.body.password
      );
      const token = tokenGenerator(userx._id);
      res.cookie("authentication", token, {
        httpOnly: true,
        maxAge: 1000 * maxAge,
      });
      const { password, ...user } = userx;
      res.status(200).json({ user });
    } catch (err) {
      const error = errorHandler(err);
      console.log(err);
      res.status(400).json({ error });
    }
  };
  login_get = async (req, res) => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const role = process.env.ADMIN_ROLE;

    try {
      const userFind = await User.findOne({ email });
      if (!userFind) {
        const user = await User.create({
          email,
          password,
          role,
        });

        res.render("index");
      } else {
        // console.log(userFind)
        res.render("index");
      }
    } catch (error) {
      res.render("index");
      console.log(error);
    }
  };
  logout = (req, res) => {
    res.cookie("authentication", "", { maxAge: 1 });
    res.redirect("/");
  };
  profile = (req, res) => {
    req.user.role == "dev" && res.render("admin/profile");
  };

  regGet = async (req, res) => {
    try {
      res.render("register");
    } catch (e) {
      res.render("register");
    }
  };
  regPost = async (req, res) => {
    const email = req.body.email;
    try {
      console.log(req.body);
      const userFind = await User.findOne({ email });
      if (!userFind) {
        const user = await User.create(req.body);
        if (user) return res.json({ user });
        return res.json({ mess: "Oop something went wrong !!!" });
      } else {
        return res.json({ mess: "user exits" });
      }
    } catch (err) {
      console.log(err);
      res.json({ mess: "Oop somthing went wrong" });
    }
  };
}

module.exports = new UsersRepo();
