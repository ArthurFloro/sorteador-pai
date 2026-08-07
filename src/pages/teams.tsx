import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import { CheckCircle2 } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Button } from "@base-ui/react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

export default function Teams() {
  const navigate = useNavigate();
  const [allTeams] = useLocalStorage<string[][]>("pelada_allTeams", []);

  // Controla quais índices do array de times estão selecionados para jogar
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);

  if (allTeams.length === 0) return <Navigate to="/" />;

  const toggleSelection = (index: number) => {
    if (selectedTeams.includes(index)) {
      setSelectedTeams(selectedTeams.filter(i => i !== index));
    } else {
      if (selectedTeams.length < 2) {
        setSelectedTeams([...selectedTeams, index]);
      }
    }
  };

  const startMatch = () => {
    if (selectedTeams.length !== 2) return;

    const teamA = allTeams[selectedTeams[0]];
    const teamB = allTeams[selectedTeams[1]];

    // Zera todos os dados da partida anterior
    localStorage.removeItem("pelada_scoreA");
    localStorage.removeItem("pelada_scoreB");
    localStorage.removeItem("pelada_time");
    localStorage.removeItem("pelada_matchEnded");
    localStorage.removeItem("pelada_winner");
    localStorage.removeItem("pelada_penaltyMode");
    localStorage.removeItem("pelada_penaltiesA");
    localStorage.removeItem("pelada_penaltiesB");

    // Salva os times no storage como backup
    localStorage.setItem("pelada_teamA", JSON.stringify(teamA));
    localStorage.setItem("pelada_teamB", JSON.stringify(teamB));

    // A MUDANÇA ESTÁ AQUI: Passamos os times diretamente pela memória da rota
    navigate("/match", { state: { teamA, teamB } });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 mt-4">
        <h1 className="text-3xl font-bold text-slate-800">Times Formados</h1>
        <Button className="border p-2 cursor-pointer rounded" onClick={() => navigate("/")}>Novo Sorteio</Button>
      </div>

      <div className="mb-6 text-slate-600 font-medium">
        Selecione exatamente 2 times para iniciar a partida ({selectedTeams.length}/2)
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {allTeams.map((team, index) => {
          const isSelected = selectedTeams.includes(index);
          return (
            <Card
              key={index}
              className={`cursor-pointer transition-all border-2 ${isSelected ? 'border-emerald-500 bg-emerald-50 scale-[1.02]' : 'border-transparent hover:border-slate-300'}`}
              onClick={() => toggleSelection(index)}
            >
              <CardHeader className="pb-2 flex flex-row justify-between items-center">
                <CardTitle className="text-xl">Time {index + 1}</CardTitle>
                {isSelected && <CheckCircle2 className="text-emerald-500 w-6 h-6" />}
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {team.map((player, pIndex) => (
                    <li key={pIndex} className="text-slate-700 bg-white p-2 rounded border border-slate-100">
                      {player}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bottom-0 mt-10 left-0 w-full bg-white border-t p-4 flex justify-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <Button
          className="w-full max-w-md text-lg h-14 cursor-pointer"
          disabled={selectedTeams.length !== 2}
          onClick={startMatch}
        >
          Iniciar Partida
        </Button>
      </div>
    </div>
  );
}