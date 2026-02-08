import { KeySquare } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <KeySquare className="h-8 w-8" />
          </div>
          <h1 className="font-headline text-3xl font-bold text-foreground">KeyMaster</h1>
          <p className="text-muted-foreground">Admin Dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
