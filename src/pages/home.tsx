import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Input, Button } from "@base-ui/react";
import { Trash2, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";


export default function Home() {
  const [players, setPlayers] = useLocalStorage<string[]>("pelada_names", Array(10).fill(""));
  const navigate = useNavigate();

  const handleNameChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const addPlayer = () => setPlayers([...players, ""]);
  const removePlayer = (index: number) => setPlayers(players.filter((_, i) => i !== index));

  const sortTeams = () => {
    const validPlayers = players.filter(p => p.trim() !== "");

    if (validPlayers.length < 10) {
      alert("Preencha pelo menos 10 nomes para formar 2 times!");
      return;
    }

    // Embaralha
    const shuffled = [...validPlayers].sort(() => 0.5 - Math.random());

    // Divide em times de 5
    const chunkedTeams: string[][] = [];
    for (let i = 0; i < shuffled.length; i += 5) {
      chunkedTeams.push(shuffled.slice(i, i + 5));
    }

    // Salva TODOS os times gerados
    localStorage.setItem("pelada_allTeams", JSON.stringify(chunkedTeams));

    navigate("/teams");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Jogadores da Pelada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {players.map((player, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  className="border p-2 border-black rounded w-full"
                  placeholder={`Jogador ${index + 1}`}
                  value={player}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                />
                {players.length > 10 && (
                  <Button onClick={() => removePlayer(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button className="w-full border-black bg-amber-300 font-bold border rounded p-2 flex items-center justify-center cursor-pointer" onClick={addPlayer}>
            <Plus className="w-4 h-4 mr-2" /> Adicionar Jogador
          </Button>

          <Button className="w-full bg-amber-300 font-bold border-black mt-4 border p-2 rounded cursor-pointer" onClick={sortTeams}>
            Sortear Times
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}