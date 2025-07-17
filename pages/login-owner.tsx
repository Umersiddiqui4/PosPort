
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import '@/styles/globals.css'
import { useLogin } from "@/hooks/useLogin"
import { useAuthStore } from "@/lib/store"

export default function LoginOwnerPage() {
    const login = useAuthStore((state) => state.login);
    const { mutate, data, isSuccess } = useLogin()
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    if (isSuccess) {
        login();
        console.log("Login successful:", data);
        window.location.href = "/";
    }
    console.log("LoginOwnerPage data:", data, "isSuccess:", isSuccess);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;
        setForm((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Submitted:', form);
        mutate({ email: form.email, password: form.password });
    };

    function screenChange(screen: string) {
        window.location.href = `/${screen}`;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
            <Card className="w-full max-w-md mx-auto shadow-xl border-0">
                <CardHeader className="text-center pb-4 relative">
                    <button
                        onClick={() => screenChange("login")}
                        className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="">
                        <div className="text-2xl font-extrabold flex justify-center text-blue-600 mb-2">
                            Log in as Owner
                        </div>

                    </div>
                </CardHeader>

                <CardContent className="p-8 pt-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <Label htmlFor="owner-email" className="text-gray-700 font-medium">
                                Email
                            </Label>
                            <Input
                                id="owner-email"
                                name="email"
                                type="email"
                                placeholder="Enter owner email"
                                value={form.email}
                                onChange={handleChange}
                                className="mt-1 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <Label htmlFor="owner-password" className="text-gray-700 font-medium">
                                Password
                            </Label>
                            <div className="relative mt-1">
                                <Input
                                    id="owner-password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter owner password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                                />

                                {/* Show/Hide Password */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? (
                                        // Eye icon (open)
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        // Eye icon (closed)
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.379.282-2.693.789-3.878m1.93-1.931A9.975 9.975 0 0112 3c5.523 0 10 4.477 10 10 0 1.379-.282 2.693-.789 3.878M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Send OTP Section */}
                        <div className="space-y-4 mt-4">
                            <p className="text-gray-700 font-bold text-sm">Send OTP:</p>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Email OTP */}
                                <Button
                                    type="button"
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                                    onClick={() => console.log("Send OTP via Email")}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    Email
                                </Button>

                                {/* WhatsApp OTP */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                                    onClick={() => console.log("Send OTP via WhatsApp")}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                                    </svg>
                                    WhatsApp
                                </Button>

                                {/* SMS OTP */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                                    onClick={() => console.log("Send OTP via SMS")}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    SMS
                                </Button>

                                {/* Missed Call OTP */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                                    onClick={() => console.log("Send OTP via Missed Call")}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    Missed Call
                                </Button>
                            </div>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold mt-6"
                        >
                            Login
                        </Button>
                    </form>


                    <div className="mt-6 text-center" >
                        <button
                            onClick={() => screenChange("login")}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}