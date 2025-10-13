import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Save, FileText, X } from "lucide-react";
import { toast } from "sonner";

const KnowledgeBasePage: React.FC = () => {
  const [knowledgeBaseName, setKnowledgeBaseName] = useState("");
  const [selectedChatbot, setSelectedChatbot] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock chatbot data - replace with actual data from your backend
  const chatbots = [
    { id: "1", name: "Support Bot" },
    { id: "2", name: "Sales Bot" },
    { id: "3", name: "Technical Bot" },
  ];

  const validateFile = (file: File): boolean => {
    const validTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const validExtensions = [".doc", ".docx"];
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    return (
      validTypes.includes(file.type) || validExtensions.includes(fileExtension)
    );
  };

  const handleFileUpload = (file: File) => {
    if (file && validateFile(file)) {
      setUploadedFile(file);
      toast.success("File Uploaded", {
        description: `${file.name} has been uploaded successfully.`,
      });
    } else {
      toast.error("Invalid File Type", {
        description: "Please upload a Word document (.doc or .docx)",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("File Removed", {
      description: "The uploaded file has been removed.",
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleSave = () => {
    if (!knowledgeBaseName || !selectedChatbot || !uploadedFile) {
      toast.error("Missing Information", {
        description: "Please fill in all fields before saving.",
      });
      return;
    }

    toast.success("Knowledge Base Saved", {
      description: "Your knowledge base has been saved successfully.",
    });
  };

  return (
    <div className="max-w-8xl ml-7 mr-7">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 mt-5">
          Knowledge Base
        </h1>
        <p className="text-muted-foreground">
          Upload documents to train your chatbot
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-foreground">
          Add New Knowledge Base
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 w-full md:grid-cols-2 lg:grid-cols-2">
            {/* Knowledge Base Name */}
            <div className="space-y-2 w-full">
              <Label htmlFor="kb-name">Knowledge Base Name</Label>
              <Input
                id="kb-name"
                type="text"
                value={knowledgeBaseName}
                onChange={(e) => setKnowledgeBaseName(e.target.value)}
                placeholder="Enter knowledge base name"
              />
            </div>

            {/* Chatbot Selection */}
            <div className="space-y-2 w-full">
              <Label htmlFor="chatbot-select">Select Chatbot</Label>
              <Select
                value={selectedChatbot}
                onValueChange={setSelectedChatbot}
              >
                <SelectTrigger id="chatbot-select" className="w-full">
                  <SelectValue placeholder="Choose a chatbot" />
                </SelectTrigger>
                <SelectContent>
                  {chatbots.map((chatbot) => (
                    <SelectItem key={chatbot.id} value={chatbot.id}>
                      {chatbot.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Document Upload with Drag & Drop */}
          <div className="space-y-2">
            <Label htmlFor="document-upload">Upload Word Document</Label>
            <div
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-lg p-6 
                transition-all duration-200 cursor-pointer
                ${
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-border bg-muted/30 hover:bg-muted/50"
                }
              `}
            >
              <input
                ref={fileInputRef}
                id="document-upload"
                type="file"
                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload Word document"
              />

              <div className="flex flex-col items-center justify-center gap-3">
                <div
                  className={`
                  w-16 h-16 rounded-full flex items-center justify-center transition-colors
                  ${isDragging ? "bg-primary/20" : "bg-primary/10"}
                `}
                >
                  <Upload
                    className={`h-8 w-8 transition-colors ${
                      isDragging
                        ? "text-primary animate-bounce"
                        : "text-primary"
                    }`}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {isDragging
                      ? "Drop your file here"
                      : uploadedFile
                      ? uploadedFile.name
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports .doc and .docx files (Max 10MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* File Preview */}
          {uploadedFile && (
            <div className="border border-border rounded-lg p-4 bg-card animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
                <Button
                  onClick={handleRemoveFile}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <Button
            onClick={handleSave}
            className="w-full gap-2 bg-[#03a84e] hover:bg-[#028a40]"
            size="lg"
          >
            <Save className="h-4 w-4" />
            Save Knowledge Base
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default KnowledgeBasePage;
