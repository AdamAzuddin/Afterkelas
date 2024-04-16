"use client";
import React, { useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";

const Page: React.FC<any> = () => {
  const [topic, setTopic] = useState<any>("");
  const [numQuestions, setNumQuestions] = useState<any>("");
  const [questionFormat, setQuestionFormat] = useState<any>("");
  const [difficulty, setDifficulty] = useState<any>("");
  const [generatedSheet, setGeneratedSheet] = useState<any>("");
  const [error, setError] = useState<any>("");

  const handleGenerateSheet = () => {
    setError("");
  
    // Check if all fields are filled
    if (!topic || !numQuestions || !questionFormat || !difficulty) {
      setError("Please fill in all the fields.");
      return;
    }
  
    // Construct prompt based on provided parameters
    let prompt = `I am a teacher teaching high school students and I want you to generate questions with the following criteria:\n`;
  
    prompt += `Topic: ${topic}\n`;
    prompt += `Number of Questions: ${numQuestions}\n`;
    prompt += `Question Format: ${questionFormat}\n`;
    prompt += `Difficulty: ${difficulty}\n`;
    prompt += `\nPlease respond with the questions only. Ensure that your response includes line breaks and correct spacings for proper formatting when converted to a PDF.\n`;
    console.log(prompt);

    //TODO: Connect with OpenAi api and complete this function
    // Call your API here with the generated prompt
    // Update 'generatedSheet' state with the response
    // Handle errors if any
  };
  

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <Typography variant="h5" gutterBottom>
        Generate Exercise Sheet
      </Typography>
      <TextField
        label="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        fullWidth
        className="my-6"
      />
      <TextField
        label="Number of Questions"
        type="number"
        value={numQuestions}
        onChange={(e) => setNumQuestions(e.target.value)}
        fullWidth
        className="my-6"
        inputProps={{ min: 0 }}
      />
      <FormControl fullWidth className="my-6">
        <InputLabel>Question Format</InputLabel>
        <Select
          value={questionFormat}
          onChange={(e) => setQuestionFormat(e.target.value)}
        >
          <MenuItem value="">Select format</MenuItem>
          <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
          <MenuItem value="true_false">True/False</MenuItem>
          <MenuItem value="subjective">Subjective</MenuItem>
          <MenuItem value="essay">Essay</MenuItem>
          {/* Add more options as needed */}
        </Select>
      </FormControl>
      <FormControl fullWidth className="my-6">
        <InputLabel>Difficulty</InputLabel>
        <Select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <MenuItem value="">Select difficulty</MenuItem>
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateSheet}
        fullWidth
        className="mb-4"
      >
        Generate Sheet
      </Button>
      {generatedSheet && (
        <Typography variant="body1" className="font-bold mb-2">
          {/* Display the generated sheet here */}
          {generatedSheet}
        </Typography>
      )}
      {error && (
        <Typography variant="body1" className="text-red-500">
          {/* Display error message */}
          {error}
        </Typography>
      )}
    </div>
  );
};

export default Page;
