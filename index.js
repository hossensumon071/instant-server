const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // in case Framer posts form-encoded

const LOOPS_API_KEY = "ccf80b4faf6e4ff17825ba70d5683fbe";
const TRANSACTIONAL_ID = "cmfm2f5y612y6w50iy2x04u8m";
const THANK_YOU_URL = "https://www.theinstantleader.com/thank-you";  // <-- change this
const DOWNLOAD_LINK = "https://drive.google.com/file/d/1a9biuJAVA7jyxrkviS5jJgmr1IFw6znD/view"; // <-- change this


app.get("/", (_, res) => res.send("✅ Server OK. Use POST /send-email."));

app.post("/send-email", async (req, res) => {
  try {
    const email =
      req.body.email || req.query.email || (req.body.fields && req.body.fields.email);

    if (!email) return res.status(400).send("Missing email");

    await axios.post(
      "https://app.loops.so/api/v1/transactional",
      {
        transactionalId: TRANSACTIONAL_ID,
        email,
        dataVariables: { downloadLink: DOWNLOAD_LINK },
      },
      {
        headers: {
          Authorization: `Bearer ${LOOPS_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Redirect user to thank-you page after sending
    return res.redirect(302, THANK_YOU_URL);
  } catch (err) {
    console.error("Loops error:", err?.response?.data || err.message);
    return res.status(500).send("Failed to send email");
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));


