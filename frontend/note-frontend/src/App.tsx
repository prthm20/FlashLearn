import  { useState } from "react";
import axios from "axios";

type Flashcard = {
  question: string;
  answer: string;
};

function App() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);

  const generateNotes = async () => {
    if (!inputText.trim()) return;
    setLoadingNotes(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/v1/users/Notes", {
        params:{text: inputText},
      });
      console.log(res.data)
      setSummary(res.data?.message || "No summary generated.");
      setFlashcards([]); // clear flashcards if new summary generated
    } catch (error) {
      console.error(error);
      setSummary("Error generating summary.");
    } finally {
      setLoadingNotes(false);
    }
  };

  const generateFlashcards = async () => {
    if (!summary.trim()) return;
    setLoadingFlashcards(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/v1/users/flashcards", {
        params:{summary: inputText},
      });

      const raw = res.data?.message[0]?.message?.content || "";
      const parsed: Flashcard[] = raw
        .split("Flashcard")
        .filter((line: string | string[]) => line.includes("Q:") && line.includes("A:"))
        .map((card: string) => {
          const qMatch = card.match(/Q:\s*(.+?)\n/);
          const aMatch = card.match(/A:\s*(.+)/);
          return {
            question: qMatch?.[1]?.trim() || "Unknown question",
            answer: aMatch?.[1]?.trim() || "Unknown answer",
          };
        });

      setFlashcards(parsed);
    } catch (error) {
      console.error(error);
      setFlashcards([]);
    } finally {
      setLoadingFlashcards(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-4 text-blue-600 text-center">🧠 FlashLearn</h1>

        <textarea
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          rows={8}
          placeholder="Paste your textbook paragraph or lecture notes here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <button
          onClick={generateNotes}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition mb-6"
          disabled={loadingNotes}
        >
          {loadingNotes ? "Generating Summary..." : "Generate Summary"}
        </button>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">📝 Summary:</h2>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 whitespace-pre-wrap text-gray-800">
            {summary}
          </div>
        </div>

        {summary && (
          <button
            onClick={generateFlashcards}
            className="mt-6 w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition"
            disabled={loadingFlashcards}
          >
            {loadingFlashcards ? "Generating Flashcards..." : "Generate Flashcards"}
          </button>
        )}

        {flashcards.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">🃏 Flashcards:</h2>
            <div className="space-y-4">
              {flashcards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow"
                >
                  <p className="font-bold text-blue-700">Q: {card.question}</p>
                  <p className="text-gray-800 mt-1">A: {card.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
