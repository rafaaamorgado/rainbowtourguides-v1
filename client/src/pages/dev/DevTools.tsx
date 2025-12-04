import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Database, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DevTools() {
  const [seeding, setSeeding] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const { toast } = useToast();

  const handleSeed = async () => {
    setSeeding(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/seed', { method: 'POST' });
      const data = await response.json();
      
      if (response.ok) {
        setResult({ type: 'success', message: data.message });
        toast({
          title: "Success",
          description: "Database seeded successfully with demo data",
        });
      } else {
        throw new Error(data.error || 'Seed failed');
      }
    } catch (error: any) {
      setResult({ type: 'error', message: error.message });
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure? This will delete ALL data and reseed the database.')) {
      return;
    }

    setResetting(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/reset', { method: 'POST' });
      const data = await response.json();
      
      if (response.ok) {
        setResult({ type: 'success', message: data.message });
        toast({
          title: "Success",
          description: "Database reset and reseeded successfully",
        });
      } else {
        throw new Error(data.error || 'Reset failed');
      }
    } catch (error: any) {
      setResult({ type: 'error', message: error.message });
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Developer Tools</h1>
          <p className="text-muted-foreground">
            Manage the demo database and seed data
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card data-testid="card-seed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Seed Database
              </CardTitle>
              <CardDescription>
                Import data from /seed/*.json files and generate sample reviews and availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleSeed}
                disabled={seeding || resetting}
                className="w-full"
                data-testid="button-seed"
              >
                {seeding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Seeding...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Seed Database
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This will add data if the database is empty, or merge with existing data.
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-reset">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Reset Database
              </CardTitle>
              <CardDescription>
                Clear all data from .tmp/mockdb.json and reseed with fresh demo data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleReset}
                disabled={seeding || resetting}
                variant="destructive"
                className="w-full"
                data-testid="button-reset"
              >
                {resetting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset & Reseed
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                ⚠️ This will permanently delete all existing data.
              </p>
            </CardContent>
          </Card>
        </div>

        {result && (
          <Alert 
            className="mt-6"
            variant={result.type === 'error' ? 'destructive' : 'default'}
            data-testid={`alert-${result.type}`}
          >
            {result.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription data-testid="text-result">
              {result.message}
            </AlertDescription>
          </Alert>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Database Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Storage Type:</span>
              <span className="font-mono" data-testid="text-storage-type">
                File-based (.tmp/mockdb.json)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seed Files:</span>
              <span className="font-mono" data-testid="text-seed-files">
                /seed/cities.json, /seed/guides.json
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fallback:</span>
              <span className="font-mono" data-testid="text-fallback">
                In-memory (if FS blocked)
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            <a href="/explore" className="text-primary hover:underline" data-testid="link-explore">
              → Explore Cities
            </a>
            <a href="/cities/paris" className="text-primary hover:underline" data-testid="link-paris">
              → Paris City Page
            </a>
            <a href="/auth/demo-login" className="text-primary hover:underline" data-testid="link-demo-login">
              → Demo Login
            </a>
            <a href="/admin" className="text-primary hover:underline" data-testid="link-admin">
              → Admin Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
