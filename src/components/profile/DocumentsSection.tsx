
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, Plus, Star, X } from 'lucide-react';

interface DocumentsSectionProps {
  profileData: {
    isServiceProvider: boolean;
  };
  serviceProviderData: {
    cvUploaded: boolean;
    cvFileName: string;
    certifications: string[];
  };
  onFileUpload: (type: 'cv') => void;
  onAddCertification: () => void;
  onServiceProviderChange: (data: any) => void;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  profileData,
  serviceProviderData,
  onFileUpload,
  onAddCertification,
  onServiceProviderChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents & Certifications</CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload your CV/Resume and certifications to complete your provider profile
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* CV/Resume Upload */}
        <div className="space-y-3">
          <Label>CV/Resume {profileData.isServiceProvider && <span className="text-red-500">*</span>}</Label>
          
          {serviceProviderData.cvUploaded ? (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">{serviceProviderData.cvFileName}</p>
                  <p className="text-sm text-muted-foreground">Uploaded successfully</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onFileUpload('cv')}
                >
                  Replace
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload your CV or Resume (PDF, DOC, DOCX)
              </p>
              <p className="text-xs text-red-600 mb-3">
                Required for service provider registration
              </p>
              <Button 
                variant="outline" 
                onClick={() => onFileUpload('cv')}
              >
                Choose File
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Certifications */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Certifications & Awards</Label>
            <Button variant="outline" size="sm" onClick={onAddCertification}>
              <Plus className="h-4 w-4 mr-1" />
              Add Certification
            </Button>
          </div>
          
          <div className="space-y-3">
            {serviceProviderData.certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>{cert}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    const newCerts = serviceProviderData.certifications.filter((_, i) => i !== index);
                    onServiceProviderChange({ ...serviceProviderData, certifications: newCerts });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Provider Registration Status */}
        {profileData.isServiceProvider && (
          <div className="pt-4 border-t">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Registration Complete!</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Profile information completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${serviceProviderData.cvUploaded ? 'bg-green-500' : 'bg-yellow-500'} rounded-full`}></div>
                  <span>CV/Resume {serviceProviderData.cvUploaded ? 'uploaded' : 'pending'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Services and portfolio added</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
