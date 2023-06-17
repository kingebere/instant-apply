const express = require("express");
const supabase = require("@supabase/supabase-js");
const dotenv = require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//API ROUTES
app.post("/getUser", async (req, res) => {
	let supabaseUrl = process.env.URL;
	let supabaseKey = process.env.KEY;
	let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
	const { session } = req.body;
	const {
		data: {
			session: { user },
		},
	} = JSON.parse(session);

	const { data: dbdata, dberror } = await supabaseClient
		.from("profile")
		.select("*")
		.eq("id", user.id);

	if (dbdata) {
		return res.status(200).json({
			data: dbdata[0],
		});
	}

	return res.status(500).json({
		message: "Internal Server Error",
	});
});

app.post("/submitJob", async (req, res) => {
	let supabaseUrl = process.env.URL;
	let supabaseKey = process.env.KEY;
	let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

	const { jobDescription } = req.body;
	try {
		const { data, error } = await supabaseClient
			.from("jobsSubmitted")
			.insert(jobDescription);
		if (error) console.log(error);

		return res.status(200).json({
			data: data,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
});

app.post("/count", async (req, res) => {
	let supabaseUrl = process.env.URL;
	let supabaseKey = process.env.KEY;
	let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

	const { userID } = req.body;


	try {
		const { data, error } = await supabaseClient.rpc("submit", {
			user_id: userID,
			increment_num: 1,
		});

		if (error) throw error;

		res.status(201).json({
			message: "Count updated successfully",
		});
	} catch (e) {
		res.status(500).json({
			message: "internal server error",
		});
	}
});

app.get("/count", async (req, res) => {
	let supabaseUrl = process.env.URL;
	let supabaseKey = process.env.KEY;
	let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

	const { userID } = req.query;

	try {
		const { data, error } = await supabaseClient
			.from("profile")
			.select("submitcount")
			.eq("id", userID);
		if (error) throw error;
		if (data) {
			res.status(200).send({
				count: data[0].submitcount,
			});
		}
	} catch (e) {
		res.status(500).json({
			message: "internal server error",
		});
	}
});

const port = 8000;
app.listen(port, () => {
	console.log("listening on port " + port);
});
