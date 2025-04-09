import React, { useState } from "react";
import axios from "axios";

interface Flashcard {
  question: string;
  answer: string;
}

const FlashcardGenerator: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const generateFlashcards = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setFlashcards([]);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/v1/users/flashcards", {
        params: { summary: inputText },
      });

      const rawContent: string =
        res.data?.message?.[0]?.message?.content || "";

      const parsedFlashcards: Flashcard[] = rawContent
        .split(/\n\n/)
        .map((entry: string) => {
          const qMatch = entry.match(/Q:\s*(.*)/);
          const aMatch = entry.match(/A:\s*(.*)/);
          return qMatch && aMatch
            ? {
                question: qMatch[1].trim(),
                answer: aMatch[1].trim(),
              }
            : null;
        })
        .filter((card): card is Flashcard => card !== null);

      setFlashcards(parsedFlashcards);
      setCurrentIndex(0);
    } catch (err) {
      console.error(err);
      alert("Failed to generate flashcards.");
    } finally {
      setLoading(false);
    }
  };

  const current = flashcards[currentIndex];

  return (
    <div className="min-h-screen bg-blue-50 p-6 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-6 rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">📚 Flashcard Generator</h1>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your notes or paragraph..."
          className="w-full p-4 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={6}
        />
        <button
          onClick={generateFlashcards}
          disabled={loading || !inputText.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 mb-6 transition"
        >
          {loading ? "Generating..." : "Generate Flashcards"}
        </button>

        {current && (
          <div className="bg-gray-100 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Question:</h2>
            <p className="text-gray-900 mb-4">{current.question}</p>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Answer:</h2>
            <p className="text-gray-800">{current.answer}</p>
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg"
                onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
                disabled={currentIndex === 0}
              >
                Prev
              </button>
              <span className="text-gray-600 self-center">
                {currentIndex + 1} / {flashcards.length}
              </span>
              <button
                className="bg-gray-300 px-4 py-2 rounded-lg"
                onClick={() =>
                  setCurrentIndex((i) => Math.min(i + 1, flashcards.length - 1))
                }
                disabled={currentIndex === flashcards.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardGenerator;
