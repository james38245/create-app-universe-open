
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';

interface DocumentUploadProps {
  onUpload: (file: File, type: 'cv' | 'resume' | 'certificate' | 'portfolio') => Promise<boolean>;
  uploading: boolean;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUpload, uploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = React.useState<'cv' | 'resume' | 'certificate' | 'portfolio'>('cv');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document.');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    await onUpload(file, selectedType);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Upload Document</h3>
      
      <div className="space-y-2">
        <Label htmlFor="document-type">Document Type</Label>
        <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cv">CV</SelectItem>
            <SelectItem value="resume">Resume</SelectItem>
            <SelectItem value="certificate">Certificate</SelectItem>
            <SelectItem value="portfolio">Portfolio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-upload">Select File</Label>
        <div className="flex items-center gap-2">
          <Input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {uploading ? 'Uploading...' : 'Choose File'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Supported formats: PDF, DOC, DOCX (Max 10MB)
        </p>
      </div>
    </div>
  );
};

export default DocumentUpload;
