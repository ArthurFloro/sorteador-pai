import { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

import { Trophy, Timer, Plus, Minus } from "lucide-react";
import { Button } from "@base-ui/react";
import { Card, CardContent } from "../components/ui/card";

export default function Match() {
  const location = useLocation();
  const navigate = useNavigate();
  const { teamA, teamB } = location.state || {};

  const [time, setTime] = useState(600); // 10 minutos em segundos
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [matchEnded, setMatchEnded] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  // Efeito do Cronômetro
  useEffect(() => {
    if (matchEnded) return;

    const timerId = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);

          setMatchEnded(true);
          setWinner(
            scoreA === scoreB
              ? "Empate"
              : scoreA > scoreB
                ? "Time A"
                : "Time B"
          );

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [matchEnded, scoreA, scoreB]);


  const addGoalA = () => {
    if (matchEnded) return;

    const newScore = scoreA + 1;
    setScoreA(newScore);

    if (newScore >= 2) {
      setMatchEnded(true);
      setWinner("Time A");
    }
  };

  const addGoalB = () => {
    if (matchEnded) return;

    const newScore = scoreB + 1;
    setScoreB(newScore);

    if (newScore >= 2) {
      setMatchEnded(true);
      setWinner("Time B");
    }
  };


  // Redireciona para home se acessar a rota direto sem sortear
  if (!teamA || !teamB) return <Navigate to="/" />;



  // Formatação do tempo (MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-6 flex flex-col items-center">

      {/* Placar Principal */}
      <div className="flex items-center gap-8 mb-10 mt-8">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Time A</h2>
          <div className="text-6xl font-black">{scoreA}</div>
        </div>

        <div className="flex flex-col items-center px-4">
          <Timer className={`w-8 h-8 mb-2 ${matchEnded ? 'text-red-500' : 'text-emerald-400'}`} />
          <div className={`text-4xl font-mono ${matchEnded ? 'text-red-500' : 'text-emerald-400'}`}>
            {formatTime(time)}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Time B</h2>
          <div className="text-6xl font-black">{scoreB}</div>
        </div>
      </div>

      {matchEnded && (
        <div className="bg-emerald-500 text-white px-8 py-4 rounded-lg mb-8 flex items-center gap-3 animate-bounce">
          <Trophy className="w-6 h-6" />
          <h3 className="text-2xl font-bold">Fim de Jogo! Vencedor: {winner}</h3>
        </div>
      )}

      {/* Controles e Escalação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">

        {/* Card Time A */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <Button
                onClick={() => setScoreA(Math.max(0, scoreA - 1))}
                disabled={matchEnded}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={addGoalA}
                disabled={matchEnded}
              >
                <Plus className="w-4 h-4 mr-2" /> Gol Time A
              </Button>
            </div>
            <ul className="space-y-2">
              {teamA.map((p: string, i: number) => (
                <li key={i} className="bg-slate-700 p-2 rounded text-center">{p}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Card Time B */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={addGoalB}
                disabled={matchEnded}
              >
                <Plus className="w-4 h-4 mr-2" /> Gol Time B
              </Button>
              <Button
                onClick={() => setScoreB(Math.max(0, scoreB - 1))}
                disabled={matchEnded}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
            <ul className="space-y-2">
              {teamB.map((p: string, i: number) => (
                <li key={i} className="bg-slate-700 p-2 rounded text-center">{p}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

      </div>

      <Button className="mt-12" onClick={() => navigate("/")}>
        Novo Sorteio
      </Button>
    </div>
  );
}