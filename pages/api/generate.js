import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
    // res.status(200).json({ result:  'Skills:' + req.body.skills
    //         + ' ------- Job description:' + req.body.job_description
    //         + ' ------- Temperature:' + req.body.temperature
    //         + ' ------- Tokens:' + req.body.tokens
    // });
    // return;

    if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const skills = req.body.skills || '';
  if (skills.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "请输入您的技能！",
      }
    });
    return;
  }

  const job_description = req.body.job_description || '';
  if (job_description.trim().length === 0) {
    res.status(400).json({
        error: {
            message: "请输入职位要求！",
        }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(skills,job_description),
      temperature: req.body.temperature, //floating number
        max_tokens: req.body.tokens//integer
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(skills,job_description) {
  const capitalizedSkills = skills[0].toUpperCase() + skills.slice(1).toLowerCase();
  const capitalizedJobDescription = job_description[0].toUpperCase() + job_description.slice(1).toLowerCase();

    // return `Please write me a cover letter based on my skills and job description.
    //
    //     My Skills: ${capitalizedSkills}
    //     Job Description:${capitalizedJobDescription}`;
    return `请根据我的技能和职位要求帮我写一封求职信。
    
        我的技能: ${capitalizedSkills}
        职位要求:${capitalizedJobDescription}`;
}
