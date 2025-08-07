import { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Loader2 } from "lucide-react";

type UploadViewProps = {
    file: File | null;
    isLoading: boolean;
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleAnalyze: () => void;
};

export function UploadView({ file, isLoading, handleFileChange, handleAnalyze }: UploadViewProps) {
    return (
        <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">
                Start Your Project
                </CardTitle>
                <CardDescription>
                Upload your project specification PDF to begin.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border-2 border-dashed border-muted-foreground rounded-lg p-12 flex flex-col items-center justify-center space-y-4">
                <UploadCloud className="w-16 h-16 text-primary" />
                <p className="text-muted-foreground">
                    {file ? file.name : "Drag & drop or click to upload"}
                </p>
                <Input
                    id="pdf-upload"
                    type="file"
                    className="hidden"
                    accept="application/pdf"
                    onChange={handleFileChange}
                />
                <Button asChild variant="outline">
                    <Label htmlFor="pdf-upload">Choose File</Label>
                </Button>
                </div>
            </CardContent>
            <CardFooter className="justify-center">
                <Button onClick={handleAnalyze} disabled={!file || isLoading} size="lg">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? "Analyzing..." : "Analyze Project"}
                </Button>
            </CardFooter>
        </Card>
    );
}
