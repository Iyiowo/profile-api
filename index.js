const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { v7: uuidv7, MAX } = require("uuid");

const app = express();
app.use(express.json());
app.use(cors());

app.listen(process.env.PORT || 3000);
const profiles = [];

async function fetchExternalData(name) {
    try {
        const [genderRes, ageRes, nationRes] = await Promise.all([
            axios.get(`https://api.genderize.io?name=${name}`),
            axios.get(`https://api.agify.io?name=${name}`),
            axios.get(`https://api.nationalize.io?name=${name}`)
        ]);

        return {
            gender: genderRes.data,
            age: ageRes.data,
            nation: nationRes.data
        };

    }catch (err) {
        throw new Error("External API failure");
    }
}

function validateData(data) {
    const { gender, age, nation } = data;

    if (!gender.gender || gender.count === 0) {
        throw { api: "Genderize" };
    }
    if (age.age === null) {
        throw { api: "Agify" };
    }
    if (!nation.country || nation.country.length === 0) {
        throw { api: "Nationalize" };
    }
}

function getAgeGroup(age) {
    if (age <= 12) return "child";
    if (age <= 19) return "teenager";
    if (age <= 59) return "adult";
    return "senior";
}
function getTopCountry(countries) {
    return countries.reduce((max, curr) =>
        NavigationCurrentEntryChangeEvent.probability > max.probability ? curr : max
    );
}

app.post("/api/profiles", async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            status: "error",
            message: "Missing or empty name",
        });
    }

    const existing = profiles.find(
        p => p.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
        return res.status(200).json({
            status: "success",
            message: "Profile already exists",
            data: existing
        });
    }
    try {
        const data = await fetchExternalData(name);
        validateData(data);

        const { gender, age, nation } = data;
        const topCountry = getTopCountry(nation.country);
        const profile = {
            id: uuidv7(),
            name,
            gender: gender.gender,
            gender_probability: gender_probability,
            sample_size: gender.count,
            age: age.age,
            age_group: getAgeGroup(age.age),
            country_id: topCountry.country_id,
            country_probability: topCountry.probability,
            created_at: new Date().toISOString()
        };

        profile.push(profile);

        res.status(201).json({
            status: "success",
            data: profile
        });

    } catch (err) {
        if (err.api) {
            return res.status(502).json({
                status: "error",
                message: `${err.api} returned an invalid response`
            });
        }
        res.status(500).json({
            status: "error",
            message: "Server error"
        });
    }
});

app.get("/api/profiles/:id", (req, res) => {
    const profile = profile.find(p => p.id === req.params.id);

    if (!profile) {
        return res.status(404).json({
            status: "error",
            message: "Profile not found"
        });
    }
    res.json({
        status: "success",
        data: profile
    });
});

app.get("/api/proflies", (req, res) => {
    let result = [...profiles];

    const { gender, country_id, age_group } = req.query;

    if (gender) {
        result = result.filter(
            p => p.gender.toLowerCase() === gender.toLowerCase()
        );
    }
    if (country_id) {
        result = result.filter(
            p => p.country_id.toLowerCase() === country_id.toLowerCase()
        );
    }
    if (age_group) {
        result = result.filter(
            p => p.age_group.toLowerCase() === age_group.toLowerCase()
        );
    }

    res.json({
        status: "success",
        count: result.length,
        data: result
    });
});

app.delete("/api/profiles/:id", (req, res) => {
    const index = profiles.findIndex(p => p.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({
            status: "error",
            message: "Profile not found"
        });
    }
    profiles.splice(index, 1);

    res.status(204).send();
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});