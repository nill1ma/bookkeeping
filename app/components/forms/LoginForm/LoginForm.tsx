import Input from "@/app/components/ui/Input/Input";

export default function LoginForm() {
  return (
    <>
            <Input 
              placeholder="user@example.com" 
              label="Email" 
              name="email" 
              type="email" 
              required
            />
            <Input 
              placeholder="password" 
              containerClassName="mt-3"
              label="Password" 
              name="password" 
              type="password" 
              required
            />
    </>
  )
}