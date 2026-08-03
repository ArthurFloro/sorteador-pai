import { Button } from "@base-ui/react/button";
import { Input } from "@base-ui/react/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";


export default function Home() {
  const [players, setPlayers] = useState<string[]>(Array(10).fill(""));
  const navigate = useNavigate();

  const handleNameChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const sortTeams = () => {
    // Verifica se todos os nomes foram preenchidos (opcional, mas recomendado)
    if (players.some((p) => p.trim() === "")) {
      alert("Preencha os 10 nomes!");
      return;
    }

    // Embaralha os jogadores
    const shuffled = [...players].sort(() => 0.5 - Math.random());

    // Divide em dois times de 5
    const teamA = shuffled.slice(0, 5);
    const teamB = shuffled.slice(5, 10);

    // Navega para a tela da partida passando os times no estado
    navigate("/match", { state: { teamA, teamB } });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sorteio da Pelada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {players.map((player, index) => (
              <Input
                key={index}
                placeholder={`Jogador ${index + 1}`}
                value={player}
                onChange={(e) => handleNameChange(index, e.target.value)}
              />
            ))}
          </div>
          <Button className="w-full mt-4" onClick={sortTeams}>
            Sortear Times
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}