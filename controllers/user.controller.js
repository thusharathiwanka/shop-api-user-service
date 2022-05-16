const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * use to register the users
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} res
 */
const saveUser = async (req, res) => {
	// request body validation
	if (req.body) {
		const { name, email, password, mobile } = req.body;
		const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

		// user inputs validation
		if (!name || !email || !password || !mobile) {
			return res.status(400).json({ message: "Please fill all the fields" });
		}

		if (!email.match(pattern)) {
			return res.status(400).json({ message: "Please enter a valid email address" });
		}

		if (password.length < 6) {
			return res.status(400).json({ message: "Password should be at least 6 characters long" });
		}

		if (mobile.length < 10) {
			return res.status(400).json({ message: "Please enter a valid phone number" });
		}

		try {
			// checking for exiting user with the same email
			const existingUser = await User.findOne({ email: email });
			if (existingUser) {
				return res.status(400).json({
					message: "An account with this email is already registered",
				});
			}

			// hashing the password
			const salt = await bcrypt.genSalt();
			const hashedPassword = await bcrypt.hash(password, salt);

			// save user account
			const newUser = new User({
				name,
				email,
				password: hashedPassword,
				mobile,
				type: "User",
			});
			const savedUser = await newUser.save();

			// logging the user
			const token = jwt.sign({ user: savedUser._id, type: "User" }, process.env.APP_SECRET);

			// sending token as a cookie
			return res.status(201).json({ token: token, role: "User", data: savedUser });
		} catch (err) {
			return res.status(500).send();
		}
	}

	return res.status(400).send();
};

/**
 * use to get all the users
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} res
 */
const getUsers = async (req, res) => {
	try {
		const Users = await User.find().select("-password");
		return res.status(200).json({ data: Users, message: "Users received" });
	} catch (err) {
		console.error(err.message);
		return res.status(500).send();
	}
};

/**
 * use to get total of the Users
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} res
 */
const getUsersTotal = async (req, res) => {
	try {
		const Users = await User.find();
		return res.status(200).json({ total: Users.length });
	} catch (err) {
		console.error(err.message);
		return res.status(500).send();
	}
};

const loginUser = async (req, res) => {
	// request body validation
	if (req.body) {
		const { email, password } = req.body;

		// user inputs validation
		if (!email || !password) {
			return res.status(400).json({ message: "Please fill all the fields" });
		}

		try {
			// checking for email existence
			const existingUser = await User.findOne({ email: email });
			if (!existingUser) {
				return res.status(401).json({
					message: "Wrong email or password",
				});
			}

			// checking for password existence
			const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

			if (!isPasswordCorrect) {
				return res.status(401).json({
					message: "Wrong email or password",
				});
			}

			// logging the user
			const token = jwt.sign({ user: existingUser._id, type: "User" }, process.env.APP_SECRET);

			// sending token as a cookie
			return res.status(200).json({ token: token, role: "User" });
		} catch (err) {
			console.error(err.message);
			return res.status(500).send();
		}
	}

	return res.status(406).send();
};

/**
 * use to delete the specific user
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} res
 */
const deleteUser = async (req, res) => {
	if (req.params.id) {
		try {
			await User.findByIdAndDelete(req.params.id);
			return res.status(200).send();
		} catch (err) {
			console.error(err.message);
			return res.status(500).send();
		}
	}
};

/**
 * use to get the specific users
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} res
 */
const getUser = async (req, res) => {
	if (req.params.id) {
		try {
			const user = await User.findById(req.params.id, "-password");
			res.status(200).json({ message: "User details received", data: user });
		} catch (err) {
			res.status(404).json({ message: err.message });
		}
	} else res.status(404).json({ message: "Client error" });
};

/**
 * use to update the specific user
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} res
 */
const updateUser = async (req, res) => {
	// request params validation
	if (req.body.userId) {
		// request body validation
		if (req.body) {
			const { name, email, password, mobile } = req.body;
			const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
			// user update input validation
			if (!name || !email || !password || !mobile) {
				return res.status(400).json({ message: "Please fill all fields" });
			}
			if (!email.match(pattern)) {
				return res.status(400).json({ message: "Please enter a valid email address" });
			}

			if (password.length < 6) {
				return res.status(400).json({ message: "Password should be at least 6 characters long" });
			}

			if (mobile.length < 10) {
				return res.status(400).json({ message: "Please enter a valid phone number" });
			}

			try {
				// hashing the password
				const salt = await bcrypt.genSalt();
				const hPassword = await bcrypt.hash(password, salt);
				// update user userprofile Update
				await User.findByIdAndUpdate(req.body.userId, {
					name,
					email,
					password: hPassword,
					mobile,
				});

				// sending as updated
				return res.status(201).json("Updated Successfully");
			} catch (err) {
				console.error(err.message);
				return res.status(500).send();
			}
		}

		return res.status(400).send();
	}
};

module.exports = {
	saveUser,
	getUsers,
	loginUser,
	deleteUser,
	getUser,
	getUsersTotal,
	updateUser,
};
