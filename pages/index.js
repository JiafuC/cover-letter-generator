import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [skillsInput, setSkillsInput] = useState("");
  const [jobDescriptionInput, setJobDescriptionInput] = useState("");
  const [temperatureInput, setTemperatureInput] = useState(0.5);
  const [tokensInput, setTokensInput] = useState(500);
  const [loading, setLoading] = useState();
  const [result, setResult] = useState();

  async function onSubmit(event) {
      setLoading(true);
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skills: skillsInput, job_description: jobDescriptionInput,temperature:temperatureInput,tokens:tokensInput }),
      });

      const data = await response.json();
        console.log('response data:');
        console.log(data);
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
        setLoading(false);
      // setSkillsInput("");
      // setJobDescriptionInput("");
      // setTemperatureInput(0.5);
      // setTokensInput(500);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>求职信生成器</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>求职信生成器</h3>
        <form onSubmit={onSubmit}>
          <textarea
            name="skills"
            placeholder="请输入您的技能"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
          />
          <textarea
            name="job_description"
            placeholder="请输入职位要求"
            value={jobDescriptionInput}
            onChange={(e) => setJobDescriptionInput(e.target.value)}
          />
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={temperatureInput}
                onChange={(e) => setTemperatureInput(parseFloat(e.target.value))}
            />
            <p><b className={styles.green}>选择的温度: {temperatureInput} </b> <br/><i>温度数值越小，求职信内容约中规中矩。温度数值越高，求职信内容约有创造力。</i></p>
            <input
                type="range"
                min="50"
                max="1000"
                step="1"
                value={tokensInput}
                onChange={(e) => setTokensInput(parseInt(e.target.value))}
            />
            <p><b className={styles.green}>选择的token总数: {tokensInput}</b> <br/><i>token总数越小，求职信内容越短，但收费越便宜。token总数越大，求职信内容越长，但收费越贵。</i></p>

            <input type="submit" value="生成求职信" />
        </form>
        <div className={styles.result}>{loading?'Loading....':result}</div>
      </main>
    </div>
  );
}
