import { useState } from 'react';
import { Eye, EyeOff, Disc, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // For now, just navigate to dashboard
        navigate('/');
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

                {/* Geometric Lines */}
                <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent transform -rotate-12"></div>
                <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent transform rotate-12"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                            <Disc className="h-6 w-6 text-black" />
                        </div>
                        <div className="flex gap-1">
                            <Shield className="h-5 w-5 text-primary/50" />
                            <Zap className="h-5 w-5 text-primary/50" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-primary tracking-tight mb-2">OBO Studio</h1>
                    <p className="text-zinc-500 text-sm font-medium">Sistema de Produtividade Futurístico</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-900">Email de Acesso</label>
                        <input
                            type="email"
                            placeholder="Digite seu email..."
                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-900">Senha de Segurança</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Digite sua senha..."
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary" />
                            <span className="text-sm text-zinc-600">Lembrar-me</span>
                        </label>
                        <a href="#" className="text-sm font-semibold text-primary hover:text-primary/80">
                            Esqueci minha senha
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 bg-primary text-black font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                        Acessar Sistema
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-zinc-400 bg-zinc-50 py-3 rounded-lg">
                        Use suas credenciais cadastradas no sistema
                    </p>
                </div>
            </div>
        </div>
    );
}
