import { useState } from "react";

export default function StudyPlanForm() {
  const [form, setForm] = useState({
    examDate: "",
    hoursPerWeek: "",
    targetBand: "",
  });

  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan("");

    const res = await fetch("http://localhost:5000/api/ai/study-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setPlan(data.plan);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">🎯 Get Your IELTS Study Plan</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          name="examDate"
          value={form.examDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="hoursPerWeek"
          placeholder="Hours per week"
          value={form.hoursPerWeek}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="targetBand"
          placeholder="Target Band (e.g., 8)"
          value={form.targetBand}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
        >
          {loading ? "Generating..." : "Generate Study Plan"}
        </button>
      </form>

      {plan && (
        <div className="mt-6 bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
          {plan}
        </div>
      )}
    </div>
  );
}
