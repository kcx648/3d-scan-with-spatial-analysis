"use client"; // Add this line at the top

import { useEffect, useRef, useState } from "react";
import { createSession, createViewport } from "@shapediver/viewer";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sessionRef = useRef<any>(null);
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);

  const [visualizationType, setVisualizationType] = useState("0");
  const [analysisPeriod, setAnalysisPeriod] = useState("0");

  useEffect(() => {
    const initializeViewer = async () => {
      if (typeof window === 'undefined' || !canvasRef.current) return;

      try {
        const viewport = await createViewport({
          canvas: canvasRef.current,
          id: "myViewport",
        });

        const session = await createSession({
          ticket: "1b282b249db3a6ca11a697aa7eb7d6df0e8d328bb14413093593aeab207706fc79558670ceb5ffc76765e3de6f846c41e195a6c5ad13f24d99de14115fa8ce2c68e83d547d415e54c81a8199d7296a5722749cc97808caa12e39238594d6d600eb11e1467585b3-0374140ac433d3f7a8838683025879ed",
          modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
          id: "mySession",
        });

        sessionRef.current = session;
        setIsSessionInitialized(true);
      } catch (error) {
        console.error("Error initializing session:", error);
      }
    };

    initializeViewer();
  }, []);

  const updateShapeDiverParameters = async () => {
    if (!isSessionInitialized || !sessionRef.current) return;

    const session = sessionRef.current;
    const visualizationParam = session.getParameterByName("Visualization Type")[0];
    const analysisPeriodParam = session.getParameterByName("Analysis Period")[0];

    if (visualizationParam) visualizationParam.value = visualizationType;
    if (analysisPeriodParam) analysisPeriodParam.value = analysisPeriod;

    await session.customize();
  };

  useEffect(() => {
    if (isSessionInitialized) {
      updateShapeDiverParameters();
    }
  }, [visualizationType, analysisPeriod, isSessionInitialized]);

  return (
    <div className="flex min-h-screen p-8 gap-8 bg-gray-50">
      <div className="flex-1 bg-white rounded-lg shadow-md p-4 relative overflow-hidden">
        <h2 className="text-xl font-semibold mb-4">3D Viewer</h2>
        <canvas
          ref={canvasRef}
          id="viewport1"
          className="w-full h-full"
          style={{ maxWidth: "1000px", maxHeight: "600px" }}
        />
      </div>

      <div className="w-1/4 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Options</h2>
        
        {/* Visualization Type Button Group */}
        <div>
          <label className="block font-medium text-gray-700">Visualization Type</label>
          <div className="flex space-x-2 mt-2">
            {["Sun Hour", "Indoor Comfort", "Daylight Availability", "View Analysis"].map((type, index) => (
              <button
                key={index}
                onClick={() => setVisualizationType(index.toString())}
                className={`flex-1 px-4 py-2 rounded ${
                  visualizationType === index.toString() ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Analysis Period Button Group */}
        <div className="mt-4">
          <label className="block font-medium text-gray-700">Analysis Period</label>
          <div className="flex space-x-2 mt-2">
            {["Morning (6-10)", "Noon (10-14)", "Afternoon (14-18)"].map((period, index) => (
              <button
                key={index}
                onClick={() => setAnalysisPeriod(index.toString())}
                className={`flex-1 px-4 py-2 rounded ${
                  analysisPeriod === index.toString() ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <ChatGPTBox />
      </div>
    </div>
  );
}

// ChatGPT chat box component
function ChatGPTBox() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hello! How can I help you?" }]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prevMessages) => [...prevMessages, { role: "user", content: input }]);
    setInput("");

    const response = { role: "assistant", content: "I'm here to help with your questions!" };
    setMessages((prevMessages) => [...prevMessages, response]);
  };

  return (
    <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">ChatGPT Assistant</h2>
      <div className="overflow-y-auto h-48 mb-4 border rounded p-2 bg-white">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block p-2 rounded-lg ${msg.role === "user" ? "bg-blue-200" : "bg-gray-200"}`}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="w-full border rounded p-2 mb-2"
      />
      <button
        onClick={handleSendMessage}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
}
