const express = require("express");
const supabase = require("@supabase/supabase-js");
const dotenv = require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");
const pdf = require("pdf-parse");
const scrape = require("./util");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//function for asking chat GPT
async function askQuestion(question) {
	try {
		const response = await axios.post(
			"https://api.openai.com/v1/chat/completions",
			{
				model: "gpt-3.5-turbo",
				messages: [
					{ role: "system", content: "You are" },
					{ role: "user", content: question },
				],
			},
			{
				headers: {
					Authorization:
						"Bearer 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",
					"Content-Type": "application/json",
				},
			}
		);

		const { choices } = response.data;
		if (choices && choices.length > 0) {
			const answer = choices[0].message.content;
			return answer;
		}

		return null; 
	} catch (error) {
		console.log('error happened at askQuestion',error)
		throw new Error(error.message);
	}
}

//fucntion for parsing resume of user
const parsePDFBYURL = async (resume_url) => {
	try {
		// Fetch the PDF file from the provided URL
		const response = await axios.get(resume_url, {
			responseType: "arraybuffer",
		});

		// Parse the PDF data
		const data = await pdf(response.data);

		// Get the extracted text
		const text = data.text;

		// Return the extracted text as the API response
		return text;
	} catch (error) {
		console.log('error happened at parsePDFBYURL',error)
	
		throw new Error(error.message);
	}
};

//gets the response for the question
async function getChatGPTResponse(jobDescription, pdfText) {
	const parsedDescription = JSON.parse(jobDescription);

	try {
		
	
		const question = ` I need a cover letter for a job called ${parsedDescription.jobTitle} with the following requirements ${parsedDescription.jobRequirements} using my resume ${pdfText}`;
		const chatGPTresponse = await askQuestion(question);
		return chatGPTresponse;
	} catch (error) {
		console.log('error happened at getChatGPTResponse',error)
		throw new Error(error.message);
	}

	
}

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

app.post("/content", async (req, res) => {
	let supabaseUrl = process.env.URL;
	let supabaseKey = process.env.KEY;
	let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

	const { session, jobDescription } = req.body;
	const {
		data: {
			session: { user },
		},
	} = JSON.parse(session);

	try {
		const { data, error } = await supabaseClient
			.from("profile")
			.select("resume_url")
			.eq("id", user.id);
		if (error) throw error;

		const { resume_url } = data[0];

		if (resume_url) {
			const pdfText = await parsePDFBYURL(resume_url);

			if (jobDescription && pdfText) {
				const chatGPTresponse = await getChatGPTResponse(
					jobDescription,
					pdfText
				);
				if (chatGPTresponse) {
					res.status(200).json({
						message: chatGPTresponse,
					});
				} else {
					res.status(404).json({ message: "not found" });
				}
			}
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({
			message: "internal server error",
		});
	}
});

api.get('/description', async (req, res) => {
	
// Usage example
const webpageURL = `https://jobs.lever.co/${company}/${id}`;
const elementSelector = '.section-wrapper .section:nth-child(3) ul'; // CSS selector of the HTML element you want to scrape
  scrape(webpageURL, elementSelector)
  .then(content => {
    console.log('Scraped Content:', content);
    // Use the scraped content as needed
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle the error
  });


});

const port = 8000;
app.listen(port, () => {
	console.log("listening on port " + port);
});
