// components/ui/FormMessage.jsx
import { CheckCircle } from "lucide-react";
export default function FormMessage({ type = "error", message }) {
    if (!message) return null;
  
    const styles =
      type === "error"
        ? "border-destructive bg-destructive/10 text-destructive"
        : "border-green-500 bg-green-50 text-green-700";
        
       
  
    return (
      <div className={`rounded-md border px-4 py-3 text-sm ${styles}`}>
        
        {message}
      </div>
    );
  }