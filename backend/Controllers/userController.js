const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

async function RegisterUser(req, res) {
  try {
    const { email, password, ...rest } = req.body;
    const incomingRole = req.body?.role;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (!incomingRole) {
      return res.status(400).json({ message: "Role is required" });
    }

    const normalizedEmail = email.toLowerCase();
    const normalizedRole = incomingRole.toLowerCase();

    if (!["student", "organizer"].includes(normalizedRole)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: `User with email:${normalizedEmail} already exist` });
    }

    const round = 10;
    const encoded_password = await bcrypt.hash(password, round);
    const user_detail = {
      ...rest,
      email: normalizedEmail,
      role: normalizedRole,
      password: encoded_password,
    };

    const registerNewUser = new User(user_detail);
    await registerNewUser.validate();
    await registerNewUser.save();

    if (!registerNewUser.role) {
      return res
        .status(500)
        .json({ message: "Role was not persisted. Please try again." });
    }

    const userObj = registerNewUser.toObject();
    delete userObj.password;

    return res.status(201).json({
      message: "User Register Successfully Created",
      user: userObj,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getUser(req, res) {
  try {
    const email = req.params.email?.toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email: ${email} not exist` });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateUserProfile(req, res) {
  try {
    const userId = req.params.id;
    const updates = { ...req.body };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateUserStatus(req, res) {
  try {
    const userEmail = req.params.email;
    const status = req.body?.status?.toLowerCase();

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" });
    }

    if (!["active", "block"].includes(status)) {
      return res.status(400).json({ message: "Invalid status selected" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail.toLowerCase() },
      { $set: { status } },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found", user: updatedUser });
    }

    return res
      .status(200)
      .json({ message: "User Status Updated", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userObj = user.toObject();
  
    const { password: _ignoredPassword, ...rest } = userObj;
    const token = jwt.sign(rest, process.env.MY_SECRET_KEY, {expiresIn: '2h'})
    return res.status(200).json({
      message: "Login successful",
      accessToken: token,
      
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function logout(req, res) {
  try {
    return res.status(200).json({ message: "Logout successful" });
  } catch(error) {
    return res.status(500).json({message:error.message})
  }
}

module.exports = {
  RegisterUser,
  getUsers,
  getUser,
  updateUserProfile,
  login,
  deleteUser,
  updateUserStatus,
  logout
};
