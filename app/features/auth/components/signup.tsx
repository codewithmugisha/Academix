import { useState } from "react";
import { SignFlow } from "../../types";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";


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
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";


interface SignUpCardProps {
    setState: (state:SignFlow) => void;
}
const SignupCard = ({setState}:SignUpCardProps) => {
  const {signIn}  = useAuthActions();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onProviderSignUp = ( value: "github" | "google") =>{
        setPending(true)
        signIn(value)
        .finally(()=>{
            setPending(false);
        })
      };

  const onPasswordSignUp  = (e:React.FormEvent<HTMLFormElement>) =>{

    e.preventDefault();
    if(!name.trim()) return toast.error("full name is required!");
    if(!email.trim()) return toast.error("email is required!");
    if(password.length < 6) return toast.error("Password should atleast be of 6 characters");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) return toast.error("Email is required!");
    if (!emailRegex.test(email)) return toast.error("Enter a valid email address");
    
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    
    if (password.length < 6) return toast.error("Password should be at least 6 characters");
    if (!passwordRegex.test(password)) {
      return toast.error("Password must include letters and numbers");
    }
    
    setPending(true);
         signIn("password",{ name, email, password, flow:"signUp"})
        .catch((er)=>{
          console.log(er)
         setError("Something went wrong " + er)
        })
        .finally(() =>{
          setPending(false);
          if(error) return toast.error(error);
          setName("");
          setEmail("");
          setPassword("");
        })

        

  }


  return (
    <Card className="w-md">
      <CardHeader>
        <CardTitle className="font-bold text-2xl">Register now</CardTitle>
        <CardDescription>Create strong credentials</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form onSubmit={onPasswordSignUp} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Full name</label>
          <Input
          
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder=""
            disabled={pending}
          />
        </div>
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
         disabled= {pending}
          className="w-full text-center cursor-pointer"
          onClick={() => {}}
        >
          {pending &&  <Loader2 className="animate-spin" /> }
          
          {pending ?"Getting you in...": "Get started"}
          
        </Button>
        </form>
        <div className="flex gap-x-3">
          <Button
           size={"lg"}
           disabled = {pending}
           variant={"outline"}
            className="cursor-pointer flex-1 flex items-center justify-center items-center gap-x-2"
            onClick={() => onProviderSignUp("google")}
          >
            <FcGoogle size={20} />  
            Sign up with Google
          </Button>
          <Button
           size={"lg"}
           disabled ={pending}
           variant={"outline"}
            className=" cursor-pointer flex-1 flex items-center justify-center items-center gap-x-2"
            onClick={() => onProviderSignUp("github")}
          >
            <FaGithub size={20} />  
            Sign up with GitHub
          </Button>
        </div>
        <p>Already have an account? <span className="hover:text-black hover:underline cursor-pointer" onClick={()=>setState("signIn")}>Sign in</span></p>
      </CardContent>
  
    </Card>
  )
}

export default SignupCard;