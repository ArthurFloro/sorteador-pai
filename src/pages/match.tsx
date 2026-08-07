import { useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

import { Trophy, Timer, Plus, Minus } from "lucide-react";
import { Button } from "@base-ui/react";
import { Card, CardContent } from "../components/ui/card";
import { useLocalStorage } from "../hooks/useLocalStorage";


export default function Match() {
  // Apenas uma declaração do location
  const location = useLocation();
  const navigate = useNavigate();

  // Pegamos os dados da rota (memória) e renomeamos para não conflitar
  const { teamA: stateTeamA, teamB: stateTeamB } = location.state || {};

  // Usamos o hook de LocalStorage, inicializando com a rota se existir
  const [teamA, setTeamA] = useLocalStorage<string[]>("pelada_teamA", stateTeamA || []);
  const [teamB, setTeamB] = useLocalStorage<string[]>("pelada_teamB", stateTeamB || []);
  const [time, setTime] = useLocalStorage<number>("pelada_time", 600); // 10 minutos em segundos
  const [scoreA, setScoreA] = useLocalStorage<number>("pelada_scoreA", 0);
  const [scoreB, setScoreB] = useLocalStorage<number>("pelada_scoreB", 0);
  const [matchEnded, setMatchEnded] = useLocalStorage<boolean>("pelada_matchEnded", false);
  const [winner, setWinner] = useLocalStorage<string | null>("pelada_winner", null);

  // Sincroniza forçadamente caso os times tenham vindo novos da tela de Teams
  useEffect(() => {
    if (stateTeamA) setTeamA(stateTeamA);
    if (stateTeamB) setTeamB(stateTeamB);
  }, [stateTeamA, stateTeamB, setTeamA, setTeamB]); // <-- Adicionado setTeamA e setTeamB para o ESLint

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
  }, [matchEnded, scoreA, scoreB, setMatchEnded, setTime, setWinner]); // <-- Adicionado as dependências para o ESLint

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

  // Redireciona para "/teams" se os times estiverem vazios
  if (!teamA || !teamB || (teamA.length === 0 && teamB.length === 0)) return <Navigate to="/teams" />;

  // Formatação do tempo (MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-slate text-slate-50 p-6 flex flex-col items-center">

      {/* Placar Principal */}
      <div className="flex items-center gap-8 mb-10 mt-8">
        <div className="text-center">
          <h2 className="text-xl text-black font-bold mb-2">Time A</h2>
          <div className="text-6xl text-black font-black">{scoreA}</div>
        </div>

        <div className="flex flex-col items-center px-4">
          <Timer className={`w-8 h-8 mb-2 ${matchEnded ? 'text-red-500' : 'text-black'}`} />
          <div className={`text-4xl font-mono ${matchEnded ? 'text-red-500' : 'text-black'}`}>
            {formatTime(time)}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl text-black font-bold mb-2">Time B</h2>
          <div className="text-6xl text-black font-black">{scoreB}</div>
        </div>
      </div>

      {matchEnded && (
        <div className="bg-yellow-500 text-black border border-black px-8 py-4 rounded-lg mb-8 flex items-center gap-3 animate-bounce">
          <Trophy className="w-6 h-6" />
          <h3 className="text-2xl font-bold">Fim de Jogo! Vencedor: {winner}</h3>
        </div>
      )}

      {/* Controles e Escalação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">

        {/* Card Time A */}
        <Card className="bg-transparent border-yellow-500 border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <Button
                onClick={() => setScoreA(Math.max(0, scoreA - 1))}
                disabled={matchEnded}
              >
                <Minus className="w-4 h-4 text-slate-900" />
              </Button>
              <Button
                className="bg-transparent border border-yellow-500 flex cursor-pointer items-center justify-center p-2 hover:bg-gray-100 transition"
                onClick={addGoalA}
                disabled={matchEnded}
              >
                <Plus className="w-4 h-4 mr-2" /> Gol Time A
              </Button>
            </div>
            <ul className="space-y-2">
              {teamA.map((p: string, i: number) => (
                <li key={i} className="p-2 border rounded text-center font-medium">{p}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Card Time B */}
        <Card className="bg-transparent border-yellow-500 border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <Button
                className="bg-transparent border border-yellow-500 flex cursor-pointer items-center justify-center p-2 hover:bg-gray-100 transition"
                onClick={addGoalB}
                disabled={matchEnded}
              >
                <Plus className="w-4 h-4 mr-2" /> Gol Time B
              </Button>
              <Button
                onClick={() => setScoreB(Math.max(0, scoreB - 1))}
                disabled={matchEnded}
              >
                <Minus className="w-4 h-4 text-slate-900" />
              </Button>
            </div>
            <ul className="space-y-2">
              {teamB.map((p: string, i: number) => (
                <li key={i} className="p-2 border rounded text-center font-medium">{p}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

      </div>

      <Button className="mt-12 w-full max-w-md h-12 text-lg text-slate-900" onClick={() => navigate("/teams")}>
        Encerrar e Voltar para os Times
      </Button>
    </div>
  );
}