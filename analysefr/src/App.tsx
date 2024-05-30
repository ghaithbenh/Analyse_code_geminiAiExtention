import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

interface AnalysisData {
  issues: string[];
  aiSuggestions: string;
}

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<AnalysisData | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post<AnalysisData>('/api/code-analysis', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Code Analysis Tool</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleAnalyze} disabled={!file}>Analyze</button>
      {data && (
        <>
          <Bar
            data={{
              labels: ['Issues', 'AI Suggestions'],
              datasets: [{
                label: 'Code Analysis',
                data: [data.issues.length, data.aiSuggestions.length],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1,
              }],
            }}
          />
          <h2>Issues</h2>
          <ul>
            {data.issues.map((issue, index) => <li key={index}>{issue}</li>)}
          </ul>
          <h2>AI Suggestions</h2>
          <p>{data.aiSuggestions}</p>
        </>
      )}
    </div>
  );
};

export default App;
