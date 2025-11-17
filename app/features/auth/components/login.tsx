import { SignFlow } from "../../types";


import { Button } from "@/components/ui/button";
import {
Card,
CardAction,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";


interface LoginCardProps {
    setState: (state:SignFlow) => void;
}
const LoginCard = ({setState}:LoginCardProps) => {

    const { signIn } = useAuthActions();
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pending, setPending] = useState(false);

    const onProviderSignIn = (value:"google"| "github") =>{

      setPending(true);

      signIn(value)
      .finally(()=>{
        setPending(false);
      })
    }

    const onPasswordSignIn =  (e:React.FormEvent<HTMLFormElement>) =>{

      e.preventDefault();
      if(!email.trim() || !password.trim()) { return toast.error("No email or password")}
      setPending(true);

      signIn("password", {email , password, flow:"signIn"})
      .catch(()=>{
          setError("Invalid email or password")
      })
      .finally(()=>{
          setPending(false);
      })

      if(error) {toast.error(error)}
      setEmail("");
      setPassword("");
    }

  

  return (
    <Card className="w-md">
      <CardHeader>
        <CardTitle className="font-bold text-2xl">Login to continue</CardTitle>
        <CardDescription>Enter your credentials to login</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={onPasswordSignIn} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder=""
            disabled={pending}
          />
        </div>
        <div className="space-y-2">

          <label className="block text-sm font-medium">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder=""
            disabled={pending}
          />
        </div>
        <Button
         size={"lg"}
         variant={"default"}
          className="w-full text-center cursor-pointer"
          onClick={() => {}}
        >
          {pending ? "Getting you in..":"Get started"}
        </Button>
        </form>
         <div className="flex gap-x-3">
                  <Button
                   size={"lg"}
                   variant={"outline"}
                    className="cursor-pointer flex-1 flex items-center justify-center items-center gap-x-2"
                    onClick={() => onProviderSignIn("google")}
                  >
                    <FcGoogle size={20} />  
                    Sign in with Google
                  </Button>
                  <Button
                   size={"lg"}
                   variant={"outline"}
                    className=" cursor-pointer flex-1 flex items-center justify-center items-center gap-x-2"
                    onClick={() => onProviderSignIn("github")}
                  >
                    <FaGithub size={20} />  
                    Sign in with GitHub
                  </Button>
                </div>
        <p>Don't have an account? <span className="hover:text-black hover:underline cursor-pointer" onClick={()=>setState("signUp")}>Sign up</span></p>
      </CardContent>
    </Card>
  )
}

export default LoginCard;