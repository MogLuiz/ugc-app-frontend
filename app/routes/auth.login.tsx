import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { toast } from "~/components/ui/toast";

export default function AuthLoginRoute() {
  const navigate = useNavigate();
  const [role, setRole] = useState("business");

  function handleLogin(event: FormEvent) {
    event.preventDefault();
    toast.success("Login simulado com sucesso");
    navigate(role === "business" ? "/empresa" : "/criadora");
  }

  return (
    <Card>
      <h1 className="text-lg font-semibold">Entrar</h1>
      <p className="mt-1 text-sm text-slate-600">Acesso por provider externo + sessao via cookie (backend).</p>

      <form onSubmit={handleLogin} className="mt-4 space-y-3">
        <Input type="email" placeholder="seu-email@empresa.com" required />
        <Select value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="business">Empresa</option>
          <option value="creator">Criadora</option>
        </Select>
        <Button type="submit" className="w-full">
          Continuar
        </Button>
      </form>
    </Card>
  );
}
