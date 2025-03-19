import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // Function to simulate typing effect
  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  // Start a new chat
  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setRecentPrompt("");
  };

  // Handle sending a prompt
  const onSent = async (prompt) => {
    // Determine the final input to send
    const finalPrompt = prompt && prompt.trim() !== "" ? prompt : input.trim();

    if (!finalPrompt) return; // Prevent sending empty input

    setResultData("");
    setLoading(true);
    setShowResult(true);

    let response = await run(finalPrompt);
    setRecentPrompt(finalPrompt);

    // Prevent duplicates in recent prompts
    setPrevPrompts((prev) =>
      prev.includes(finalPrompt) ? prev : [...prev, finalPrompt]
    );

    // Format the response text
    let formattedResponse = response
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Convert **bold**
      .replace(/\*(.*?)\*/g, "<i>$1</i>") // Convert *italic*
      .replace(/\n/g, "<br>"); // Convert new lines to <br>

    // Simulate the typing effect
    let words = formattedResponse.split(" ");
    words.forEach((word, index) => delayPara(index, word + " "));

    setLoading(false);
    setInput(""); // Clear input after sending
  };

  const contextValue = {
    input,
    setInput,
    onSent,
    recentPrompt,
    setRecentPrompt,
    prevPrompts,
    setPrevPrompts,
    showResult,
    setShowResult,
    loading,
    setLoading,
    resultData,
    setResultData,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
