import { Spinner } from "./ui/spinner";

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--page-bg)">
      <div className="flex items-center gap-4">
        <Spinner className="size-16 text-accent" />
        <div className="text-2xl font-mono text-(--text-primary)">
          loading<span className="animate-blink text-accent">_</span>
        </div>
      </div>
    </div>
  );
}
