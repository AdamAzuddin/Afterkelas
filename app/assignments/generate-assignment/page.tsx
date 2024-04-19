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
} from "@mui/material";

const Page: React.FC<any> = () => {
  const [topic, setTopic] = useState<any>("");
  const [topicDetails, setTopicDetails] = useState<any>("");
  const [numQuestions, setNumQuestions] = useState<any>("");
  const [questionFormat, setQuestionFormat] = useState<any>("");
  const [difficulty, setDifficulty] = useState<any>("");
  const [generatedSheet, setGeneratedSheet] = useState<any>("");
  const [error, setError] = useState<any>("");

  //TODO(Amir Hakim): complete this function, return a pdf file in form of url. Tips: checkout /assignments/assignment to see how we change file to url
  const convertStringsToPdf = () =>{

  }

  const handleGenerateSheet = () => {
    setError("");
  
    // Check if all fields are filled
    if (!topic || !topicDetails || !numQuestions || !questionFormat || !difficulty) {
      setError("Please fill in all the fields.");
      return;
    }
  
    // Construct prompt based on provided parameters
    let prompt = `As a teacher, I want you to generate questions for my high school students based on the following criteria:\n`;
  
    prompt += `Topic: ${topic} (${topicDetails})\n`; // Provide the topic and its details
    prompt += `Number of Questions: ${numQuestions}\n`; // Specify the number of questions required
    prompt += `Question Format: ${questionFormat}\n`; // Specify the format of questions (e.g., multiple choice, true/false)
    prompt += `Difficulty: ${difficulty}\n`; // Specify the difficulty level of questions
    
    prompt += `\nPlease respond with the questions only. Ensure that your response includes line breaks and correct spacings for proper formatting when converted to a PDF.\n`;
    
    // TODO(Shameer):Call your API here with the generated prompt
    // Update 'generatedSheet' state with the response
    // Handle errors if any
    
    convertStringsToPdf()
    // For now, set a dummy response
    setGeneratedSheet("Generated questions will be displayed here.");
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
        // Description for teacher: Specify the main topic for the questions (e.g., Trigonometry)
      />
      <TextField
        label="Topic Details"
        value={topicDetails}
        onChange={(e) => setTopicDetails(e.target.value)}
        fullWidth
        className="my-6"
        // Description for teacher: Specify specific details or subtopics related to the main topic
      />
      <TextField
        label="Number of Questions"
        type="number"
        value={numQuestions}
        onChange={(e) => setNumQuestions(e.target.value)}
        fullWidth
        className="my-6"
        inputProps={{ min: 0 }}
        // Description for teacher: Specify the number of questions required
      />
      <FormControl fullWidth className="my-6">
        <InputLabel>Question Format</InputLabel>
        <Select
          value={questionFormat}
          onChange={(e) => setQuestionFormat(e.target.value)}
          // Description for teacher: Specify the format of questions (e.g., multiple choice, true/false)
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
          // Description for teacher: Specify the difficulty level of questions
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
        // Description for teacher: Click to generate exercise sheet based on provided criteria
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
